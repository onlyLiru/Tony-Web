import { DatePicker } from '@/features/DatePicker';
import {
  Flex,
  FormControl,
  FormLabel,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  VStack,
  useToast,
  Input,
  SimpleGrid,
  Box,
  Center,
  Spinner,
  Heading,
  CloseButton,
  HStack,
  Text,
  Tooltip,
  Icon,
  Stack,
  AspectRatio,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import * as marketApis from '@/services/market';
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CheckCircleIcon,
  CheckIcon,
  QuestionOutlineIcon,
} from '@chakra-ui/icons';
import {
  ContractSingleListingParams,
  useContractSingleListing,
} from '@/hooks/useContractSingleListing';
import { ContractSteps } from '../ContractStep';
import { MdAddCircle } from 'react-icons/md';
import { useAddWethToWallet } from '@/hooks/useAddWethToWallet';
import { formatPrice } from '@/utils/formatPrice';
import { useRootModalConsumer } from './RootModalProvider';
import { useTranslations } from 'next-intl';
import { AssetImage } from '../AssetItem';
import { useSwitchChain } from '@/hooks/useSwitchChain';

const NftView = (props: {
  img: string;
  type: number;
  itemId: number;
  tokenId: string;
  price: string;
  name: string;
  collection: string;
  renderCurrencyLogo: () => React.ReactNode;
}) => {
  return (
    <Flex fontSize="md" justifyContent="space-between">
      <Flex>
        {/* 预览图 */}
        <AspectRatio ratio={1} w={{ base: '80px', md: '80px' }}>
          <AssetImage
            border="1px solid rgba(0,0,0,0.05)"
            borderRadius="10px"
            src={props.img}
            h="auto"
          />
        </AspectRatio>
        {/* 名称与集合 */}
        <Flex direction="column" justifyContent="center" ml="16px">
          <Text fontWeight="bold">{props.name}</Text>
          <Text mt="9px">{props.collection}</Text>
        </Flex>
      </Flex>
      {/* 价格 */}
      <Flex direction="column" justifyContent="center">
        <Text color="rgba(0,0,0,0.45)">Listing price</Text>
        <Flex mt="5px" align={'center'} justifyContent="flex-end">
          {props.renderCurrencyLogo?.()}
          <Text color="#1F1F2C" fontWeight="bold" fontSize="20px">
            {(Number(props.price) > 0 && props.price) || ``}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export type NftListModalOpenParams = {
  token_id: string;
  collection_address?: string;
  chain_id?: number;
  /**
   * 挂单modal类型
   * - `listing` 挂单
   * - `adjustListing` 修改挂单
   * - `activityListing` 活动挂单
   **/
  openType?: 'listing' | 'adjustListing' | 'activityListing';
  /** 挂单成功回调 */
  success?: () => void;
  /** 挂单失败回调 */
  error?: (err: Error) => void;
  /** 弹窗关闭回调 */
  close?: () => void;
};

export type NftSellModalAction = {
  open: (p: NftListModalOpenParams) => void;
};

export const NftSellModal = forwardRef<NftSellModalAction>((props, ref) => {
  const [fetchLoading, setFetchLoading] = useState(false);
  const [process, setProcess] = useState<'edit' | 'pending' | 'success'>(
    'edit',
  );
  const [data, setData] = useState<marketApis.ApiMarket.ItemDetail>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    steps,
    singleListing,
    adjustListing,
    reset: resetSinleSell,
  } = useContractSingleListing();
  const [openType, setOpenType] =
    useState<NftListModalOpenParams['openType']>('listing');
  const { addWethToWallet } = useAddWethToWallet();
  const t = useTranslations('common');
  const { openLearnMoreModal } = useRootModalConsumer();
  const paramsRef = useRef<NftListModalOpenParams>();
  const {
    needSwitchChain,
    switchChain,
    visitChain,
    visitChainSymbols,
    VisitChainLogo,
  } = useSwitchChain();

  // 是否是编辑挂单
  const isAdjustListing = useMemo(
    () => openType === 'adjustListing',
    [openType],
  );

  useImperativeHandle(ref, () => ({
    open: async (params: NftListModalOpenParams) => {
      if (needSwitchChain) return switchChain();
      paramsRef.current = params;
      setOpenType(params.openType || 'listing');
      onOpen();
      try {
        setFetchLoading(true);
        const { data: res } = await marketApis.itemDetail({
          token_id: params.token_id,
          chain_id: visitChain.id,
          collection_address: params.collection_address,
        });
        setFetchLoading(false);
        setData(res);
      } catch (error) {
        setFetchLoading(false);
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    },
  }));

  const modalReset = () => {
    onClose();
    setProcess('edit');
    resetSinleSell();
  };

  const onModalClose = () => {
    modalReset();
    paramsRef.current?.close?.();
  };

  const onSell = async (values: any) => {
    setProcess('pending');
    const params: ContractSingleListingParams = {
      data: data!,
      payload: {
        price: values.price,
        endTime: values.duration,
        tokenId: data?.item_info.token_id!,
        itemId: Number(data!.item_info.item_id),
        collection: data?.contract_metadata.contract_address!,
        title: data?.item_info.name!,
      },
      error: (err: any) => {
        toast({
          status: 'error',
          title: err?.reason || err?.message,
          variant: 'subtle',
        });
        paramsRef.current?.error?.(err);
      },
      complete: () => {
        if (paramsRef.current?.openType === 'activityListing') {
          modalReset();
        } else {
          setProcess('success');
        }
        paramsRef.current?.success?.();
      },
    };
    if (isAdjustListing) {
      adjustListing(params);
    } else {
      singleListing(params);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onModalClose} isCentered>
      <ModalOverlay backdropFilter="blur(12px)" />
      <ModalContent maxW={{ base: '90vw', md: '2xl' }}>
        <ModalBody px={{ base: 5, md: 10 }} py={5}>
          <Flex w="full" justify={'space-between'} mb={6}>
            <Heading fontSize={{ base: 'lg', md: '2xl' }}>
              {isAdjustListing ? 'Adjust Listing' : 'Listing for Sale'}
            </Heading>
            <CloseButton
              size={{ base: 'sm', md: 'md' }}
              onClick={onModalClose}
            />
          </Flex>
          {fetchLoading ? (
            <Center w="full" h="45vh">
              <Spinner />
            </Center>
          ) : (
            <Formik
              initialValues={{
                price: isAdjustListing
                  ? formatPrice(
                      data?.order_info?.price!,
                      visitChain.nativeCurrency.decimals,
                    )
                  : '',
                duration: isAdjustListing
                  ? new Date(data?.order_info?.endTime! * 1000)
                  : '',
                amount: '1',
              }}
              enableReinitialize
              onSubmit={(values) => {
                onSell(values);
              }}
            >
              {({ values, errors, touched }) => (
                <>
                  <Form>
                    <Box>
                      <NftView
                        img={data?.item_info.logo!}
                        type={data?.item_info.ass_type!}
                        itemId={Number(data!.item_info.token_id!)}
                        tokenId={data?.item_info.token_id!}
                        collection={
                          data?.item_info.collection_name || 'Unamed Collection'
                        }
                        name={data?.item_info.name || 'No name'}
                        price={values.price}
                        renderCurrencyLogo={() => (
                          <VisitChainLogo.Local fontSize={20} />
                        )}
                      />

                      {process === 'edit' && (
                        <VStack
                          w="full"
                          mx="auto"
                          spacing={5}
                          align="flex-start"
                          mt="36px"
                        >
                          <FormControl
                            isInvalid={!!errors.price && touched.price}
                          >
                            <FormLabel fontWeight={'normal'}>
                              {t('price')}
                            </FormLabel>
                            <HStack spacing={5}>
                              <Field
                                size={{ base: 'md', md: 'lg' }}
                                as={Input}
                                autoComplete="off"
                                w={{ base: 'full', md: 'full' }}
                                name="price"
                                fontWeight="bold"
                                validate={(val: string) => {
                                  if (+val < 0.0001) {
                                    return 'Minimum amount of 0.0001';
                                  }
                                }}
                                render={({ field }: { field: any }) => (
                                  <InputGroup size="lg" mr="0">
                                    <Input
                                      placeholder="Enter price"
                                      {...field}
                                    />
                                    <InputRightElement>
                                      <Text
                                        fontSize="md"
                                        fontWeight="400"
                                        pr="16px"
                                      >
                                        {visitChain?.nativeCurrency?.symbol}
                                      </Text>
                                    </InputRightElement>
                                  </InputGroup>
                                )}
                              />
                            </HStack>
                            <FormErrorMessage fontSize={'sm'}>
                              {errors.price}
                            </FormErrorMessage>
                          </FormControl>
                          <Field name="duration">
                            {(filedProps: FieldProps) => (
                              <FormControl>
                                <FormLabel fontWeight={'normal'}>
                                  {t('duration')}
                                </FormLabel>
                                <DatePicker
                                  size={{ base: 'md', md: 'lg' }}
                                  popover={{
                                    matchWidth: false,
                                  }}
                                  value={filedProps.field.value}
                                  onChange={(v) =>
                                    filedProps.form.setFieldValue(
                                      filedProps.field.name,
                                      v,
                                    )
                                  }
                                  showPickDate={false}
                                />
                              </FormControl>
                            )}
                          </Field>
                          <SimpleGrid
                            fontSize="md"
                            fontFamily={'Inter'}
                            w="full"
                            templateColumns={'auto 1fr'}
                          >
                            {/* <Text gridRow={'1 / span 2'} color="typo.sec">
                              {t('fees')}
                            </Text> */}
                            <HStack align={'center'} justify={'flex-end'}>
                              <Text>{t('creatorRoyalties')}: </Text>
                              <Tooltip
                                hasArrow
                                placement="top"
                                padding={4}
                                rounded="lg"
                                bg="primary.main"
                                color="white"
                                textAlign={'center'}
                                offset={[0, 15]}
                                label={t('creatorRoyaltiesTip')}
                              >
                                <Text
                                  display={'inline-flex'}
                                  alignItems="center"
                                >
                                  {data?.royalty}%
                                  <QuestionOutlineIcon ml={1} />
                                </Text>
                              </Tooltip>
                            </HStack>
                            <HStack
                              display={'none'}
                              w="full"
                              align={'center'}
                              justify={'flex-end'}
                            >
                              <Text>UneMeta:</Text>
                              <Tooltip
                                hasArrow
                                placement="top"
                                padding={4}
                                rounded="lg"
                                bg="primary.main"
                                color="white"
                                textAlign={'center'}
                                offset={[0, 15]}
                                label={t('unemetaRoyaltiesTip')}
                              >
                                <Text
                                  display={'inline-flex'}
                                  alignItems="center"
                                >
                                  2%
                                  <QuestionOutlineIcon ml={1} />
                                </Text>
                              </Tooltip>
                            </HStack>
                          </SimpleGrid>
                          <Flex w="full" justify={'flex-end'}>
                            <Button
                              className="As013"
                              mt={5}
                              type="submit"
                              variant="primary"
                              size="lg"
                              rounded={'lg'}
                              isDisabled={!!errors.price}
                              w={{ base: 'full', md: 'full' }}
                              h="14"
                              _hover={{}}
                              _active={{}}
                              background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%)"
                              borderRadius="4px"
                            >
                              {t('list')}
                            </Button>
                          </Flex>
                        </VStack>
                      )}
                      {process === 'pending' && (
                        <>
                          <ContractSteps steps={steps} />
                        </>
                      )}
                      {process === 'success' && (
                        <Flex
                          direction={'column'}
                          justify="space-between"
                          mt="36px"
                        >
                          <VStack
                            spacing={5}
                            align={{ base: 'center', md: 'flex-start' }}
                            w="full"
                          >
                            <Flex>
                              <CheckCircleIcon
                                fontSize={48}
                                color="green.300"
                              />
                              <Heading
                                display={'inline-flex'}
                                alignItems="center"
                                size="lg"
                                ml="4"
                              >
                                {isAdjustListing
                                  ? 'Listing Updated!'
                                  : 'Success Listed!'}
                              </Heading>
                            </Flex>
                            <Text
                              color="primary.main"
                              textAlign={{ base: 'center', md: 'left' }}
                            >
                              {t('listingWarning', {
                                eth: visitChainSymbols.Local,
                                weth: visitChainSymbols.Wrapper,
                              })}
                              <Text
                                onClick={() => openLearnMoreModal()}
                                as="strong"
                                cursor={'pointer'}
                              >
                                {t('learnMore')}
                              </Text>
                            </Text>

                            <Button
                              onClick={addWethToWallet}
                              size="sm"
                              leftIcon={<Icon as={MdAddCircle} />}
                            >
                              {t('add')} {visitChainSymbols.Wrapper} to MetaMask
                            </Button>
                          </VStack>
                          <Flex mt={{ base: 10, md: 0 }} justify={'flex-end'}>
                            <Button
                              onClick={() => {
                                onModalClose();
                              }}
                              variant="primary"
                              size="lg"
                              rounded={'lg'}
                              w={{ base: 'full', md: '160px' }}
                            >
                              {t('viewItem')}
                            </Button>
                          </Flex>
                        </Flex>
                      )}
                    </Box>
                  </Form>
                </>
              )}
            </Formik>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
