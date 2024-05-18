import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import {
  useDisclosure,
  Box,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  useToast,
  VStack,
  Flex,
  Center,
  Spinner,
} from '@chakra-ui/react';
import Image from '@/components/Image';
import { HiLockOpen, HiLockClosed } from 'react-icons/hi';
import * as transactionApis from '@/services/transaction';
import { useContractApprove } from '@/hooks/useContractApprove';
import {
  QuestionIcon,
  TimeIcon,
  CheckCircleIcon,
  NotAllowedIcon,
} from '@chakra-ui/icons';
import { useContractSell } from '@/hooks/useContractSell';
import { useTranslations } from 'next-intl';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { Contract } from 'ethers';
import { useAccount, useSigner } from 'wagmi';

export type BulkListItem = {
  /** 挂单价格 */
  price: string;
  endTime: Date;
  /** 合集合约地址 */
  collection: string;
  /** nft 的token id */
  tokenId: string;
  /** nft 的item id */
  itemId: number;
  /** nft 名称 */
  title: string;
};

type NftWithStatus = BulkListItem & {
  _status?: '' | 'pending' | 'failed' | 'success';
};

type CollectionWithStatus =
  transactionApis.ApiTransaction.ApproveListResItem & {
    _approveStatus?: 'pending' | 'failed' | '';
  };

type OpenParams = {
  /** 需要挂单的nft数组 */
  data: BulkListItem[];
  /** 批量挂单流程完成 */
  complete: () => void;
  cancel: () => void;
};

type ApproveModalAction = {
  open: (params: OpenParams) => void;
};

const ApproveModal = forwardRef<ApproveModalAction>((_, ref) => {
  const { addresses, abis, visitChainId } = useSwitchChain();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const paramsRef = useRef<OpenParams>();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [nfts, setNfts] = useState<NftWithStatus[]>([]);
  const [collections, setCollections] = useState<CollectionWithStatus[]>([]);
  const { sell } = useContractSell();
  const { approve } = useContractApprove();
  const initRef = useRef(false);
  // 所有nft挂单签名完成
  const [isAllNftSigned, setIsAllNftSigned] = useState(false);
  const t = useTranslations('userDetail');
  const ct = useTranslations('common');
  const { data: signer } = useSigner();
  const { address: account } = useAccount();

  // 所有合集授权完成
  const isAllApproved = useMemo(
    () => (initRef.current ? collections.every((el) => el.status) : false),
    [collections, initRef.current],
  );

  // 当前nft挂单签名失败
  const isCurrentNftFailed = useMemo(
    () => nfts.filter((el) => el._status).at(-1)?._status === 'failed',
    [nfts],
  );

  const handleClose = () => {
    setIsAllNftSigned(false);
    initRef.current = false;
    onClose();
    if (isAllNftSigned && paramsRef.current?.complete) {
      paramsRef.current?.complete();
      return;
    }
    if (paramsRef.current?.cancel) {
      paramsRef.current?.cancel();
    }
  };

  const handleOpen = async (params: OpenParams) => {
    paramsRef.current = params;
    onOpen();
    setNfts(params.data);
    // 33333333333 approveList
    // 获取需要合约的集合列表
    try {
      setFetchLoading(true);
      const collectionAddr = [
        ...new Set(
          params.data.map((el) => {
            return {
              ...el,
              collection_address: el.collection,
              token_id: el.tokenId,
              collection_name: el.title,
              status: false,
            };
          }),
        ),
      ];
      // const { data } = await transactionApis.approveList({
      //   list: collectionAddr.map((el) => ({
      //     collection: el.collection_address,
      //     chain_id: visitChainId,
      //   })),
      // });
      const collectionDic: any = {};
      for (const item of collectionAddr) {
        collectionDic[`${item.collection_address}`] = item;
      }
      const needApproveList = [];
      for (const collectionAddress of Object.keys(collectionDic)) {
        const nftContract = new Contract(
          collectionAddress,
          abis.TRANSFER_MANAGER_ERC721,
          signer!,
        );
        // await nftContract.setApprovalForAll?.(addresses.TRANSFER_MANAGER_ERC721, false);
        const res = await nftContract?.isApprovedForAll(
          account,
          addresses.TRANSFER_MANAGER_ERC721,
        );
        if (res) {
          //
        } else {
          needApproveList.push(collectionDic[collectionAddress]);
        }
      }

      setFetchLoading(false);
      initRef.current = true;
      if (needApproveList?.length > 0) {
        setCollections(needApproveList);
      }
    } catch (error) {
      setFetchLoading(false);
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  // 合集合约授权
  const handleApprove = async (
    col: transactionApis.ApiTransaction.ApproveListResItem,
  ) => {
    if (col.status) return;
    try {
      setCollections((prev) =>
        prev.map((el) =>
          el.collection === col.collection
            ? { ...el, _approveStatus: 'pending' }
            : el,
        ),
      );
      await approve(col);
      let next: CollectionWithStatus[];
      await setCollections((prev) => {
        next = prev.map((el) =>
          el.collection === col.collection
            ? { ...el, _approveStatus: '', status: true }
            : el,
        );
        return next;
      });
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
      setCollections((prev) =>
        prev.map((el) =>
          el.collection === col.collection
            ? { ...el, _approveStatus: 'failed' }
            : el,
        ),
      );
    }
  };

  // nft 挂单签名
  const nftSign = async (nft: NftWithStatus) => {
    /**关闭弹窗中断后续签名 */
    if (!initRef.current) return;
    try {
      setNfts((prev) =>
        prev.map((el) =>
          el.itemId === nft.itemId ? { ...el, _status: 'pending' } : el,
        ),
      );
      await sell(nft);
      await setNfts((prev) =>
        prev.map((el) =>
          el.itemId === nft.itemId ? { ...el, _status: 'success' } : el,
        ),
      );
      const nextIndex = nfts.findIndex((v) => v.itemId === nft.itemId) + 1;
      // 自动弹出下一个需要签名挂单的nft
      const nextNft = nfts[nextIndex];
      if (nextNft) {
        nftSign(nextNft);
      } else {
        setIsAllNftSigned(true);
      }
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
      setNfts((prev) =>
        prev.map((el) =>
          el.itemId === nft.itemId ? { ...el, _status: 'failed' } : el,
        ),
      );
    }
  };

  useEffect(() => {
    if (isAllApproved) {
      nftSign(nfts[0]!);
    }
  }, [isAllApproved]);

  const onTryAgain = () => {
    nftSign(nfts.filter((el) => el._status).at(-1)!);
  };

  const onSkip = () => {
    if (nfts.filter((el) => !el._status).length) {
      nftSign(nfts.filter((el) => !el._status)[0]!);
    } else {
      setIsAllNftSigned(true);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={{ base: 'full', md: 'md' }}
    >
      <ModalOverlay />
      <ModalContent rounded="xl" w="448px">
        <ModalHeader px={8} pt={8} pb={0} fontSize="32px">
          {t('listItemForSale')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={8}>
          {fetchLoading ? (
            <Center w="full" h="20vh">
              <Spinner />
            </Center>
          ) : (
            <>
              <HStack
                justify="space-between"
                py={4}
                borderBottom="1px solid"
                borderColor="gray.100"
              >
                <Text fontSize="sm">1.{ct('approve').toUpperCase()} NFT</Text>
                <Image
                  src="/images/user/approve.png"
                  w="16px"
                  h="16px"
                  opacity={!isAllApproved ? 0.2 : 1}
                />
              </HStack>
              {!isAllApproved && (
                <>
                  <Box opacity="0.5" fontSize="sm" py={6}>
                    {t('approveNFTDesc')}
                  </Box>
                  <VStack
                    spacing={3}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                    pb={6}
                  >
                    {collections.map((col) => (
                      <Button
                        className="Mi013"
                        key={col.collection}
                        w="full"
                        variant="outline"
                        borderColor="gray.100"
                        borderWidth="2px"
                        rounded="md"
                        rightIcon={
                          col._approveStatus === 'pending' ? (
                            <Spinner />
                          ) : col._approveStatus === 'failed' ? (
                            <QuestionIcon color="red.500" />
                          ) : (
                            <div />
                          )
                        }
                        _hover={
                          !col.status
                            ? {
                                borderColor: 'black',
                                color: 'white',
                                bg: 'black',
                              }
                            : {}
                        }
                        sx={
                          col.status
                            ? {
                                borderColor: 'primary.deepGray',
                                color: 'white',
                                bg: 'primary.deepGray',
                              }
                            : {}
                        }
                        onClick={() => handleApprove(col)}
                      >
                        {col.status ? (
                          <HiLockOpen className="mr-3" />
                        ) : (
                          <HiLockClosed className="mr-3" />
                        )}
                        {`Approve ${col.collection_name}`}
                      </Button>
                    ))}
                  </VStack>
                </>
              )}
              <HStack
                justify="space-between"
                py={4}
                borderBottom="1px solid"
                borderColor="gray.100"
              >
                <Text fontSize="sm" color={isAllApproved ? '' : 'gray.200'}>
                  2.{t('completeListing')}
                </Text>
                <Image
                  src="/images/user/approve.png"
                  w="16px"
                  h="16px"
                  opacity={!isAllNftSigned ? 0.2 : 1}
                />
              </HStack>
              {isAllApproved && (
                <>
                  <VStack spacing={3} p={4} align="flex-start">
                    {nfts.map((v) => (
                      <Flex key={v.itemId} align="center">
                        {!v._status && <TimeIcon />}
                        {v._status === 'pending' && <Spinner size="sm" />}
                        {v._status === 'failed' && (
                          <NotAllowedIcon color="red" />
                        )}
                        {v._status === 'success' && <CheckCircleIcon />}
                        <Text
                          ml={3}
                          color={v._status === 'failed' ? 'red' : ''}
                        >
                          {v.title}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                  {isAllNftSigned ? (
                    <Button
                      w="full"
                      variant="primary"
                      rounded="md"
                      onClick={handleClose}
                    >
                      {t('backToOwnedItems')}
                    </Button>
                  ) : (
                    <>
                      {!isCurrentNftFailed ? (
                        <Button
                          className="Mi010"
                          w="full"
                          variant="primary"
                          rounded="md"
                          disabled
                        >
                          {ct('listing')}
                        </Button>
                      ) : (
                        <VStack>
                          <Button
                            className="Mi014"
                            w="full"
                            variant="primary"
                            rounded="md"
                            onClick={onTryAgain}
                          >
                            {ct('steps.submitTransactionAgain')}
                          </Button>
                          <Button
                            className="Mi015"
                            w="full"
                            rounded="md"
                            variant="outline"
                            onClick={onSkip}
                          >
                            {ct('steps.skipThisOne')}
                          </Button>
                        </VStack>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default ApproveModal;
