import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  ModalFooter,
  Button,
  Center,
  Icon,
  ModalHeader,
  Heading,
  CloseButton,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  FormHelperText,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { CgArrowsExchangeV } from 'react-icons/cg';
import { MenuSelect } from '../MenuSelect';
import { useEthAndWethExchange } from '@/hooks/useEthAndWethExchange';
import { ContractSteps } from '../ContractStep';
import { floor } from 'lodash';
import { useTranslations } from 'next-intl';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { useUserWalletBalance } from '@/hooks/useUserWalletBalance';

interface Values {
  type: 'withdraw' | 'deposit';
  amount: string;
}

type OpenParams = {
  complete?: () => void;
};

export type SwapWethAndEthModalAction = {
  open: (params?: OpenParams) => void;
};

export const SwapWethAndEthModal = forwardRef<SwapWethAndEthModalAction>(
  (_, ref) => {
    const t = useTranslations('common');
    const {
      localCurrency,
      wrapperCurrency,
      localCurrencyAmount,
      wrapperCurrencyAmount,
    } = useUserWalletBalance();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const paramsRef = useRef<OpenParams>();
    const { needSwitchChain, switchChain, VisitChainLogo } = useSwitchChain();
    const { exchange, steps, isLoading, reset } = useEthAndWethExchange();

    useImperativeHandle(ref, () => ({
      open: (params?: OpenParams) => {
        if (needSwitchChain) return switchChain();
        paramsRef.current = params;
        onOpen();
      },
    }));
    const toast = useToast();

    const renderBalance = (type: Values['type']) => {
      const eth = type === 'deposit';
      return (
        <>
          {eth ? (
            <VisitChainLogo.Local fontSize={24} />
          ) : (
            <VisitChainLogo.Wrapper fontSize={24} />
          )}
          <Text color="primary.main" as="strong">
            {floor(eth ? localCurrencyAmount : wrapperCurrencyAmount, 4)}
          </Text>
        </>
      );
    };

    const onModalClose = () => {
      onClose();
      reset();
    };

    return (
      <Modal isOpen={isOpen} onClose={onModalClose}>
        <ModalOverlay backdropFilter="blur(12px)" />
        <ModalContent rounded={'2xl'} maxW={{ base: '92vw', md: 'md' }}>
          <Formik
            initialValues={{
              type: 'deposit',
              amount: '',
            }}
            onSubmit={(values: Values) => {
              exchange({
                ...values,
                complete: () => {
                  paramsRef.current?.complete?.();
                  onModalClose();
                },
                error: (error) => {
                  toast({
                    status: 'error',
                    title: error.message,
                    variant: 'subtle',
                  });
                },
              });
            }}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <ModalHeader
                  display={'flex'}
                  justifyContent="space-between"
                  alignItems={'center'}
                >
                  <Heading size="md">{t('swap')}</Heading>
                  <CloseButton onClick={onModalClose} />
                </ModalHeader>
                <ModalBody px={8} py={0}>
                  <VStack spacing={2}>
                    <FormControl isInvalid={!!errors.amount && touched.amount}>
                      <FormLabel>{t('from')}</FormLabel>
                      <HStack>
                        <Field
                          name="amount"
                          as={Input}
                          size="lg"
                          placeholder="0.0"
                          isDisabled={isLoading}
                          validate={(val: string) => {
                            const total =
                              values.type === 'deposit'
                                ? localCurrencyAmount
                                : wrapperCurrencyAmount;
                            if (+val > total) {
                              return 'Insufficient Balance';
                            }
                          }}
                        />
                        <Field name="type">
                          {({ field, form }: FieldProps) => (
                            <MenuSelect
                              isDisabled={isLoading}
                              size="lg"
                              w="120px"
                              options={[
                                {
                                  label: localCurrency.data?.symbol!,
                                  value: 'deposit',
                                },
                                {
                                  label: wrapperCurrency.data?.symbol!,
                                  value: 'withdraw',
                                },
                              ]}
                              variant={'outline2border'}
                              rounded="lg"
                              value={field.value}
                              onChange={(val) =>
                                form.setValues({ [field.name]: val })
                              }
                            />
                          )}
                        </Field>
                      </HStack>
                      <FormErrorMessage>{errors.amount}</FormErrorMessage>
                      <FormHelperText fontSize={'sm'} color="typo.sec">
                        <HStack spacing={1}>
                          <Text>{t('balance')}: </Text>
                          {renderBalance(values.type)}
                        </HStack>
                      </FormHelperText>
                    </FormControl>

                    <Center w="full">
                      <Icon
                        cursor={'pointer'}
                        onClick={() =>
                          setFieldValue(
                            'type',
                            values.type === 'deposit' ? 'withdraw' : 'deposit',
                            true,
                          )
                        }
                        mt={2}
                        fontSize={28}
                        as={CgArrowsExchangeV}
                      />
                    </Center>

                    <FormControl>
                      <FormLabel>{t('to')}</FormLabel>
                      <InputGroup size="lg">
                        <Input
                          value={values.amount || ''}
                          isDisabled={isLoading}
                          placeholder="0.0"
                          readOnly
                          pr={16}
                        />
                        <InputRightElement w="auto" pr={4}>
                          <Text color="primary.deepGray">
                            {values.type === 'deposit'
                              ? wrapperCurrency.data?.symbol
                              : localCurrency.data?.symbol}
                          </Text>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                    <Text color="#777e90" lineHeight={1.4} fontSize={'xs'}>
                      {t('swapDesc', {
                        weth:
                          values.type === 'deposit'
                            ? wrapperCurrency.data?.symbol
                            : localCurrency.data?.symbol,
                      })}
                    </Text>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  {Array.isArray(steps) && !!steps.length ? (
                    <ContractSteps steps={steps} />
                  ) : (
                    <Button
                      className="Sb006"
                      isDisabled={!!errors.amount}
                      w="full"
                      variant="primary"
                      rounded="lg"
                      size="xl"
                      type="submit"
                    >
                      {t('swap')}
                    </Button>
                  )}
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    );
  },
);
