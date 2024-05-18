import { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  Button,
  Heading,
  Input,
  FormControl,
  HStack,
  Flex,
  useToast,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { Field, Form, Formik } from 'formik';
import { createAccount, exchangePrize } from '@/services/points';
import { ApiPoints } from '@/services/points';
import { emailReg } from '@/utils';
import { useUuInfo } from '@/store';
import Image from '@/components/Image';
import { EthLogo } from '../TokenBalance';

export type ExchangeModalRef = {
  open: (editor?: boolean) => void;
};

type EProps = {
  info: ApiPoints.PrizeList;
  refreshInfo?: () => void;
};

export const ExchangeModal = forwardRef((props: EProps, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { info } = props;
  const toast = useToast();
  const t = useTranslations('points');
  const ct = useTranslations('common');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [uuInfo, setUuInfo] = useUuInfo();

  // const { sign } = useSignHelper();

  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
    },
  }));

  // 创建账户
  const newAccount = useCallback(async () => {
    try {
      if (!email || !emailReg.test(email)) {
        return toast({
          status: 'error',
          title: 'Email is not available',
          variant: 'subtle',
        });
      }
      setLoading(true);
      const { data } = await createAccount({
        account_type: 1,
        email,
      });
      setLoading(false);
      if (data.status === 1) {
        setUuInfo({ ...uuInfo, qibee: true, email });
        // onClose();
        return toast({
          status: 'success',
          title: 'Save success',
          variant: 'subtle',
        });
      }
      toast({ status: 'error', title: 'Save failed', variant: 'subtle' });
    } catch (error) {
      setLoading(false);
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  }, [email]);

  // 兑换
  const exchange = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        const { data } = await exchangePrize({
          to_token_id: info.tokenId,
          amount: values.amount,
        });

        setLoading(false);
        if (data.status === 1) {
          onClose();
          props.refreshInfo?.();
          return toast({
            status: 'success',
            title: 'Exchange successfully',
            variant: 'subtle',
          });
        }
        toast({
          status: 'error',
          title: 'redemption failed',
          variant: 'subtle',
        });
      } catch (error) {
        setLoading(false);
        console.error('error', error);
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    },
    [info],
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.400" />
        <ModalContent
          maxW={{ md: '500px' }}
          w={{ md: '500px', base: 'full' }}
          fontFamily={'Inter'}
          mx={{ md: 'auto', base: '4vw' }}
        >
          <ModalBody p={0}>
            {uuInfo?.qibee && uuInfo.email ? (
              <Box>
                <HStack
                  color={'#14141F'}
                  h={'50px'}
                  bg={'#F3F7FA'}
                  fontSize={'20px'}
                  fontWeight={'700'}
                  px={'20px'}
                >
                  <Box>{t('swap')}</Box>
                </HStack>
                <Formik
                  initialValues={{
                    amount: '',
                  }}
                  onSubmit={(values) => {
                    exchange(values);
                  }}
                >
                  {({ errors, touched }) => (
                    <Box
                      p={{ md: '20px 25px 25px 50px', base: '20px 20px 25px' }}
                    >
                      <Form>
                        <Box pr={'25px'} pl={'6px'}>
                          <FormControl
                            mb={'23px'}
                            isInvalid={!!errors.amount && touched.amount}
                          >
                            <Flex
                              justify={'space-between'}
                              borderBottom={'1px solid #E5E8EB'}
                              pb={'10px'}
                              h={'50px'}
                            >
                              <HStack
                                spacing={'5px'}
                                h={'26px'}
                                fontWeight={'600'}
                                color={'#14141F'}
                                fontSize={'16px'}
                                pl={'6px'}
                              >
                                <Text>uuu</Text>
                                <Image
                                  src={'/images/points/q.png'}
                                  h={'14.32px'}
                                  w={'14.32px'}
                                />
                              </HStack>
                              <Field
                                alignSelf={'flex-end'}
                                type={'number'}
                                fontSize={'20px'}
                                name="amount"
                                as={Input}
                                textAlign={'right'}
                                w={'200px'}
                                h={'30px'}
                                fontWeight={'700'}
                                color={'#14141F'}
                                _placeholder={{
                                  color: '#D9D9D9',
                                }}
                                border={'none'}
                                placeholder={uuInfo.integral}
                                validate={(val: number) => {
                                  if (
                                    val > info.max_amount_per_transaction ||
                                    val < info.min_amount_per_transaction
                                  ) {
                                    return `range is ${info.min_amount_per_transaction} to ${info.max_amount_per_transaction}`;
                                  }
                                }}
                              />
                            </Flex>
                            <FormErrorMessage>{errors.amount}</FormErrorMessage>
                          </FormControl>
                          <Flex
                            justify={'space-between'}
                            borderBottom={'1px solid #E5E8EB'}
                            pb={'10px'}
                            h={'50px'}
                          >
                            <HStack
                              spacing={'2px'}
                              h={'26px'}
                              fontWeight={'600'}
                              color={'#14141F'}
                              fontSize={'16px'}
                            >
                              <EthLogo fontSize={'24px'} />
                              <Text>{info.symbol}</Text>
                            </HStack>
                            <Box
                              fontSize={{ md: '20px', base: '16px' }}
                              alignSelf={'flex-end'}
                              lineHeight={'22px'}
                              color={'#D9D9D9'}
                              fontWeight={'700'}
                            >
                              {t('exchangeDec')}
                            </Box>
                          </Flex>
                        </Box>
                        <Flex
                          justify={{ md: 'flex-end', base: 'center' }}
                          mt={{ md: '40px', base: '44px' }}
                        >
                          <Button
                            className="Re008"
                            fontSize={{ md: '16px', base: '15pxx' }}
                            w={{ md: '180px', base: '240px' }}
                            h={{ md: '48px', base: '40px' }}
                            color={'#FFFFFF'}
                            bg={'#14141F'}
                            fontWeight={'700'}
                            rounded={{ md: '8px', base: '4px' }}
                            type={'submit'}
                            _hover={{ bg: '#14141F', opacity: 0.8 }}
                            isLoading={loading}
                          >
                            {t('exchange')}
                          </Button>
                        </Flex>
                      </Form>
                    </Box>
                  )}
                </Formik>
              </Box>
            ) : (
              <Box p={{ md: '33px 25px 20px', base: '36px 15px 20px' }}>
                <Heading
                  fontSize={'16px'}
                  fontWeight={'600'}
                  mb={'10px'}
                  lineHeight={'19px'}
                  color={'#14141F'}
                >
                  {t('PleaseEnterDec')}
                </Heading>
                <Box
                  color={'#8C8C8C'}
                  lineHeight={{ md: '19px', base: '16px' }}
                  mb={{ md: '40px', base: '20px' }}
                  fontSize={{ md: '16px', base: '13px' }}
                  dangerouslySetInnerHTML={{ __html: t.raw('coinbaseDec') }}
                ></Box>
                <Input
                  mb={{ md: '44px', base: '65px' }}
                  fontSize={'16px'}
                  px={{ md: '15px', base: '10px' }}
                  border={'2px solid #E5E8EB;'}
                  rounded={'8px'}
                  type={'email'}
                  _placeholder={{
                    color: '#14141F',
                    fontSize: '16px',
                  }}
                  value={email}
                  onChange={(e: any) => {
                    setEmail(e.target.value);
                  }}
                  placeholder={'Please Enter Your Email'}
                />
                <Flex justify={{ md: 'flex-end', base: 'center' }}>
                  <Button
                    className="Re007"
                    fontSize={{ md: '16px', base: '15px' }}
                    w={{ md: '180px', base: '240px' }}
                    h={{ md: '48px', base: '40px' }}
                    color={'#FFFFFF'}
                    bg={'#14141F'}
                    fontWeight={'700'}
                    rounded={{ md: '8px', base: '4px' }}
                    onClick={newAccount}
                    isLoading={loading}
                    _hover={{ bg: '#14141F', opacity: 0.8 }}
                  >
                    {ct('confirm')}
                  </Button>
                </Flex>
              </Box>
            )}
          </ModalBody>
          <ModalCloseButton
            color={'#B5B5B5'}
            top={{ md: '10px', base: '-2px' }}
            right={{ md: '10px', base: '0' }}
          />
        </ModalContent>
      </Modal>
    </>
  );
});
