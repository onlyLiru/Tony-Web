import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  ModalFooter,
  Button,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  VStack,
  FormErrorMessage,
  useToast,
  FormHelperText,
  ModalCloseButton,
  InputLeftElement,
} from '@chakra-ui/react';
import { Formik, Form, FormikProps, Field } from 'formik';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { ContractSteps } from '../ContractStep';
import { useTranslations } from 'next-intl';
import { addressReg } from '@/utils';
import { useCollectionFee } from '@/hooks/useCollectionFee';

interface Values {
  receiver: string;
  fee: string;
}

type OpenParams = {
  royalty?: number;
  methodName: string;
  contractAddress: string;
  complete?: () => void;
};

export type CollectionRoyaltySettingAction = {
  open: (params: OpenParams) => void;
};

export const CollectionRoyaltySetting =
  forwardRef<CollectionRoyaltySettingAction>((_, ref) => {
    const collectionDetailT = useTranslations('collectionDetail');
    const [initialValues, setInitialValues] = useState<Values>({
      fee: '',
      receiver: '',
    });
    const commonT = useTranslations('common');
    const formRef = useRef<FormikProps<Values>>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const paramsRef = useRef<OpenParams>();
    useImperativeHandle(ref, () => ({
      open: async (params: OpenParams) => {
        paramsRef.current = params;
        if (params.royalty! > 0) {
          setInitialValues({ ...initialValues, fee: `${params.royalty}` });
        }
        onOpen();
      },
    }));
    const toast = useToast();
    const { settingFee, steps, isLoading, reset } = useCollectionFee();

    const onModalClose = () => {
      onClose();
      reset();
    };

    return (
      <Modal isOpen={isOpen} onClose={onModalClose}>
        <ModalOverlay backdropFilter="blur(12px)" />
        <ModalContent rounded={'2xl'} maxW={{ base: '92vw', md: '2xl' }}>
          <ModalCloseButton />
          <Formik
            innerRef={formRef}
            initialValues={initialValues}
            onSubmit={(values: Values) => {
              settingFee({
                methodName: paramsRef.current?.methodName!,
                contractAddress: paramsRef.current?.contractAddress!,
                receiver: values.receiver,
                fee: values.fee,
                complete: () => {
                  paramsRef.current?.complete?.();
                  onModalClose();
                },
                error: (err) => {
                  toast({
                    status: 'error',
                    title: err.message,
                    variant: 'subtle',
                  });
                },
              });
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <ModalHeader px={{ base: 5, md: 10 }} pt={{ base: 5, md: 10 }}>
                  {collectionDetailT('collectionSettings')}
                </ModalHeader>
                <ModalBody p={5}>
                  <VStack
                    spacing={5}
                    mx="auto"
                    maxW={{ base: 'full', md: '450px' }}
                  >
                    <FormControl
                      isInvalid={!!errors.receiver && touched.receiver}
                    >
                      <FormLabel>
                        {collectionDetailT('receiverAdress')}
                      </FormLabel>
                      <FormHelperText mb={3} color="typo.sec" fontSize={'sm'}>
                        {collectionDetailT('receiverAdressDesc')}
                      </FormHelperText>
                      <Field
                        name="receiver"
                        as={Input}
                        size="lg"
                        placeholder="e.g. 0xabcde12345a1b2c3d4e5"
                        isDisabled={isLoading}
                        validate={(val: string) => {
                          if (!addressReg.test(val)) {
                            return 'Invalid address';
                          }
                        }}
                      />
                      <FormErrorMessage>{errors.receiver}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.fee && touched.fee}>
                      <FormLabel>
                        {collectionDetailT('collectionFee')}
                      </FormLabel>
                      <FormHelperText mb={3} color="typo.sec" fontSize={'sm'}>
                        {collectionDetailT('collectionFeeDesc')}
                      </FormHelperText>

                      <InputGroup size="lg">
                        <InputLeftElement>
                          <Text color="primary.main" fontWeight={'bold'}>
                            %
                          </Text>
                        </InputLeftElement>
                        <Field
                          name="fee"
                          as={Input}
                          size="lg"
                          pl={10}
                          placeholder="0"
                          isDisabled={isLoading}
                          validate={(val: string) => {
                            if (+val < 0 || +val > 100) {
                              return 'Invalid fee value';
                            }
                          }}
                        />
                      </InputGroup>
                      <FormErrorMessage>{errors.fee}</FormErrorMessage>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter mt={5}>
                  {Array.isArray(steps) && !!steps.length ? (
                    <ContractSteps steps={steps} />
                  ) : (
                    <Button
                      w={{ base: 'full', md: '180px' }}
                      isDisabled={!!(errors.receiver || errors.fee)}
                      variant="primary"
                      rounded="lg"
                      size="lg"
                      type="submit"
                    >
                      {commonT('confirm')}
                    </Button>
                  )}
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    );
  });
