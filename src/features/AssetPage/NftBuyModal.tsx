import {
  AspectRatio,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Input,
} from '@chakra-ui/react';
import { useContractBuy } from '@/hooks/useContractBuy';
import { ContractSteps } from '../ContractStep';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import * as marketApis from '@/services/market';
import {
  BalanceCheckoutState,
  TokenBalanceCheckout,
  TokenBalanceResult,
} from '../TokenBalance';
import NextLink from 'next/link';
import { getErrorMessage } from '@/utils/error';
import { formatPrice } from '@/utils/formatPrice';
import { useUserDataValue } from '@/store';
import { useTranslations } from 'next-intl';
import { useFatpayUrl } from '../Fatpay';
import { AssetImage } from '../AssetItem';
import { useSwitchChain } from '@/hooks/useSwitchChain';
// eslint-disable-next-line no-restricted-imports
import {
  mToast,
  setMail as saveMail,
  sendMail,
} from '@/features/Teamz/helpers/ticketInfo';
// eslint-disable-next-line no-restricted-imports
import { UseTicket } from '@/features/Teamz/hooks/useTicket';
import * as Cookies from 'tiny-cookie';
import { isProd } from '@/utils';
import { Web2LoginModal } from '@/components/PageLayout/Header/Web2Login';
import { defaultChainId } from '@/store';
import { useRouter } from 'next/router';
import { SupportedChainId } from '@/contract/types';
import { useNetwork } from 'wagmi';

const mailReg = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
const mailKey = 'asset-buy-mail';
const targetNFTContractAddress = isProd
  ? '0x8A78C938F1A8AA3c09d015602A810ed672780c52'.toLowerCase()
  : '0x36BE8B846e3b44f7A5Ca1De0Ed7aD75cA75e3A95'.toLowerCase();

export type NftBuyModalOpenParams = {
  token_id: string;
  chainId?: number;
  collection_address?: string;
  complete?: () => void;
  error?: (err: Error) => void;
  cancel?: () => void;
};

export type NftBuyModalAction = {
  open: (params: NftBuyModalOpenParams) => void;
};
export const NftBuyModal = forwardRef<NftBuyModalAction>((props, ref) => {
  const t = useTranslations('common');
  const { isOpen, onOpen, onClose: modalClose } = useDisclosure();
  const [data, setData] = useState<marketApis.ApiMarket.ItemDetail>();
  const [view, setView] = useState<'pay' | 'confirm' | 'success'>('pay');
  const [checkoutState, setCheckoutState] = useState<BalanceCheckoutState>();
  const [fetchLoading, setFetchLoading] = useState(false);
  const {
    buy,
    reset: buyReset,
    fetching: buyFetching,
    steps: buySteps,
  } = useContractBuy();
  const toast = useToast();
  const paramsRef = useRef<NftBuyModalOpenParams>();
  const web2LoginModal = useRef<{ open: () => void }>(null);
  const userData = useUserDataValue();
  const { loading: fatpaylUrlLoading, getFatpayUrl } = useFatpayUrl();
  const router = useRouter();
  const { chain, chains: _chains } = useNetwork();
  const { VisitChainLogo, visitChain, setLocalChainId } = useSwitchChain({
    fixedChainId: (+router.query?.chain! as SupportedChainId) || chain?.id,
  });
  // 特定NFT购买前先填写邮箱----start
  const {
    isOpen: isMailOpen,
    onClose: onMailClose,
    onOpen: onMailOpen,
  } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const [mail, setMail] = useState('');
  const handleMailChange = (event: any) => setMail(event.target.value);
  const [inValid, setInvalid] = useState(false);
  const handleClose = () => {
    onMailClose();
    setMail('');
    setInvalid(false);
    setIsLoading(false);
  };
  const handleClk = async () => {
    const validMail = new RegExp(mailReg, 'gm').test(mail);
    if (!mail || !validMail) {
      setInvalid(true);
      mToast(toast, t('teamz.emptyOrErrMail'));
      return;
    }
    Cookies.setCookie(mailKey, mail, { expires: '1h' });
    setIsLoading(true);
    const tipTimer5 = setTimeout(
      () => mToast(toast, t('teamz.slowTip5s')),
      1000 * 15,
    );
    const tipTimer30 = setTimeout(
      () => mToast(toast, t('teamz.slowTip10s')),
      1000 * 50,
    );
    clearTimeout(tipTimer5);
    clearTimeout(tipTimer30);
    await saveMail(mail);
    setIsLoading(false);
    onMailClose();
    onOpen();
  };
  // 特定NFT购买前先填写邮箱-----end

  useImperativeHandle(ref, () => ({
    open: async (params: NftBuyModalOpenParams) => {
      paramsRef.current = params;
      if (!userData?.wallet_address) {
        web2LoginModal?.current?.open();
        return;
      }
      if (!params.chainId) {
        console.log('chainId not exist');
        return;
      }
      try {
        setLocalChainId(params.chainId as number);
        setFetchLoading(true);
        const { data } = await marketApis.itemDetail({
          token_id: params.token_id,
          chain_id: params.chainId,
          collection_address: params.collection_address,
        });
        setData(data);
        // 如果是特定NFT需要记录邮箱
        const contractAddress =
          data?.contract_metadata?.contract_address?.toLowerCase();
        if (contractAddress === targetNFTContractAddress) {
          onMailOpen();
        } else {
          onOpen();
        }
      } catch (error: any) {
        toast({
          status: 'error',
          title: error?.reason || error.message,
          variant: 'subtle',
        });
      } finally {
        setFetchLoading(false);
      }
    },
  }));

  const onClose = () => {
    setView('pay');
    buyReset();
    modalClose();
    paramsRef.current?.cancel?.();
  };

  const onConfirm = async () => {
    setView('confirm');
    try {
      console.log('checkoutState', checkoutState, checkoutState?.weth!);
      await buy({
        orderId: data?.item_info.order_id!,
        ethPay: checkoutState?.eth,
        useWeth: checkoutState?.weth! > 0,
        error: (err) => {
          paramsRef.current?.error?.(err);
          toast({
            status: 'error',
            title: getErrorMessage(err),
            variant: 'subtle',
          });
        },
        complete: () => {
          paramsRef.current?.complete?.();
          setView('success');
          // 如果是特定NFT需要记录邮箱
          const contractAddress =
            data?.contract_metadata?.contract_address?.toLowerCase();
          if (contractAddress === targetNFTContractAddress) {
            const { tiktMint } = UseTicket(
              (userData && userData.wallet_address) as string,
            );
            setTimeout(() => sendMail(tiktMint), 0);
          }
        },
      });
    } catch (error) {
      toast({
        status: 'error',
        title: getErrorMessage(error),
        variant: 'subtle',
      });
    }
  };

  const openFatpay = async () => {
    try {
      const url = await getFatpayUrl();
      window.open(url, '_blank');
    } catch (error) {
      toast({ status: 'error', title: error.message });
    }
  };

  const getDetailAdr = () => {
    return data?.contract_metadata?.contract_address &&
      data?.item_info?.token_id
      ? `/asset/${visitChain.id}/${data?.contract_metadata?.contract_address}/${data?.item_info?.token_id}`
      : `/asset/${visitChain.id}/${data?.item_info.token_id}`;
  };
  return (
    <>
      {/* 针对特定的NFT显示填写邮箱 */}
      <Modal isOpen={isMailOpen} onClose={onClose} isCentered key="mintModal">
        <ModalOverlay backdropFilter="blur(12px)" />
        <ModalContent p={0} overflow="hidden" maxW={{ base: '90vw', md: 'xl' }}>
          <ModalHeader>
            <Text
              padding="17px"
              paddingBottom={{ base: '0' }}
              fontSize={{ base: '18px' }}
            >
              {t('teamz.mailTipTitle')}
            </Text>
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody fontSize={{ base: '12px' }}>
            <>
              <Box h={{ base: '30vh', md: 'auto' }}>
                {['1', '2', '3', '4'].map((key) => {
                  return (
                    <Box key={key}>
                      <Flex color="white" alignItems="baseline">
                        <Box
                          width="8px"
                          height="8px"
                          borderRadius="8px"
                          backgroundColor="#7F7F80"
                        />
                        <Text ml={3} flex="1" color="rgba(0,0,0,0.5)">
                          {t(`teamz.mailTipContent${key}` as any)}
                        </Text>
                      </Flex>
                    </Box>
                  );
                })}
              </Box>

              <Text ml="4px" mb="3px" mt={{ base: 14, md: 8 }}>
                {t('teamz.mailText')}
              </Text>
              <Center mt={2}>
                <Input
                  placeholder={t('teamz.mailFillTip')}
                  w="100%"
                  value={mail}
                  errorBorderColor="crimson"
                  focusBorderColor="blue"
                  onChange={handleMailChange}
                  isInvalid={inValid}
                />
              </Center>
            </>
          </ModalBody>

          <ModalFooter display="flex" mb="15px">
            <>
              <Button
                mr={3}
                onClick={handleClose}
                flex="1"
                colorScheme="whiteAlpha"
                variant="outline"
              >
                {t('teamz.mintCancelText')}
              </Button>
              <Button
                _hover={{ bgColor: '#2a2727' }}
                _active={{ bgColor: '#2a2727' }}
                bg="black"
                variant="outline"
                color="white"
                flex="1"
                onClick={handleClk}
                isLoading={isLoading}
                loadingText={t('teamz.mintConfirmText')}
              >
                {t('teamz.mintConfirmText')}
              </Button>
            </>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay backdropFilter="blur(12px)" />
          <ModalContent
            p={0}
            overflow="hidden"
            maxW={{ base: '90vw', md: 'xl' }}
          >
            <ModalHeader
              bg="blue.50"
              display={'flex'}
              alignItems="center"
              justifyContent={'space-between'}
              textAlign="center"
            >
              <Text>{t('buy')}</Text>
              <IconButton
                onClick={onClose}
                aria-label=""
                bg="none"
                size="sm"
                icon={<CloseIcon fontSize={14} />}
              />
            </ModalHeader>

            {fetchLoading ? (
              <Center w="full" h="45vh">
                <Spinner />
              </Center>
            ) : (
              <>
                <ModalBody p={0}>
                  {view !== 'success' && (
                    <Flex p={5} align={'flex-start'}>
                      <AspectRatio flex="1 0 60px" ratio={1} mr={4}>
                        <AssetImage
                          src={data?.item_info?.logo}
                          srcSuffix="s=60"
                        />
                      </AspectRatio>
                      <VStack w="full" spacing={2} align="flex-start">
                        <Text color={'primary.sec'}>
                          {data?.item_info.collection_name ||
                            'Unnamed Collection'}
                        </Text>
                        <Text fontWeight={'bold'}>
                          {data?.item_info.name || 'Unnamed'}
                        </Text>
                        <Divider h="2px" bg="primary.gray" borderWidth="0" />
                        <Flex
                          w="full"
                          align={'flex-start'}
                          justify="space-between"
                          color="primary.sec"
                        >
                          {view === 'pay' && (
                            <>
                              <Text>{t('totalPrice')}</Text>
                              <VStack spacing={1} align={'flex-end'}>
                                <Flex align={'center'}>
                                  <VisitChainLogo.Local fontSize={20} />
                                  <Text
                                    color="primary.main"
                                    fontWeight={'bold'}
                                  >
                                    {formatPrice(
                                      data?.order_info?.price!,
                                      visitChain.nativeCurrency.decimals,
                                    )}
                                  </Text>
                                </Flex>
                                <Text fontSize={'sm'}>
                                  {/* FIXME 缺少usdt_price */}
                                </Text>
                              </VStack>
                            </>
                          )}
                          {view === 'confirm' && (
                            <TokenBalanceResult data={checkoutState!} />
                          )}
                        </Flex>
                      </VStack>
                    </Flex>
                  )}
                  {view === 'pay' && (
                    <>
                      <Flex
                        px={5}
                        align={'center'}
                        bg="blue.50"
                        fontSize={'lg'}
                        fontWeight="bold"
                        h="50px"
                      >
                        <Text>{t('wallet')}</Text>
                      </Flex>
                      <Box p={5} pb={{ base: 0, md: 5 }}>
                        <TokenBalanceCheckout
                          total={
                            +formatPrice(
                              data?.order_info?.price!,
                              visitChain.nativeCurrency.decimals,
                            )
                          }
                          onChange={setCheckoutState}
                        />
                      </Box>
                    </>
                  )}

                  {view === 'confirm' && (
                    <Box px={5} py={10} bg="blue.50">
                      <ContractSteps loading={buyFetching} steps={buySteps} />
                    </Box>
                  )}
                  {view === 'success' && (
                    <VStack
                      textAlign={'center'}
                      fontFamily={'Inter'}
                      p={5}
                      spacing={5}
                      w="full"
                    >
                      <Heading size={{ base: 'md', md: 'lg' }}>
                        🎉 {t('buySuccessTitle')}
                      </Heading>
                      <Box>
                        <AspectRatio
                          borderWidth={1}
                          w={{ base: 'full', md: '200px' }}
                          ratio={1}
                          overflow="hidden"
                          rounded={'lg'}
                        >
                          <AssetImage src={data?.item_info?.logo} />
                        </AspectRatio>
                        <Text fontWeight={'bold'} mt={2}>
                          {data?.item_info.collection_name ||
                            'Unnamed Collection'}
                        </Text>
                        <Text>{data?.item_info.name}</Text>
                      </Box>
                      <Text fontSize={'sm'} color="primary.sec">
                        {t('buySuccessDesc')}
                      </Text>
                    </VStack>
                  )}
                </ModalBody>

                {view !== 'confirm' && (
                  <ModalFooter px={5} py={4}>
                    {view === 'pay' && (
                      <VStack w="full" spacing={3}>
                        <Button
                          isDisabled={!checkoutState?.canBuy}
                          onClick={onConfirm}
                          variant="primary"
                          rounded={'xl'}
                          size={{ base: 'lg', md: 'xl' }}
                          w="full"
                        >
                          {checkoutState?.canBuy
                            ? t('steps.confirmPurchase')
                            : t('insufficientAmount')}
                        </Button>
                        <Button
                          bg="none !important"
                          isLoading={fatpaylUrlLoading}
                          variant={'ghost'}
                          onClick={openFatpay}
                        >
                          Add With Card
                        </Button>
                      </VStack>
                    )}
                    {view === 'success' && (
                      <NextLink href={getDetailAdr()}>
                        <Button
                          onClick={onClose}
                          variant="primary"
                          rounded={'xl'}
                          size={{ base: 'lg', md: 'xl' }}
                          w="full"
                        >
                          {t('viewItem')}
                        </Button>
                      </NextLink>
                    )}
                  </ModalFooter>
                )}
              </>
            )}
          </ModalContent>
        </Modal>
      )}

      <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
    </>
  );
});
