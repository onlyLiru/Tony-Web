import { useTranslations } from 'next-intl';
import { joinme } from '@/services/agent';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRequest } from 'ahooks';
import { Formik, Form, Field } from 'formik';
import { forwardRef, useImperativeHandle, useRef, useContext } from 'react';
import { QrcodeModal, QrcodeModalRef } from './QrcodeModal';
import { AgentContext } from './Context';

type OpenParams = {
  callback: () => void;
};

export type GeneratorLinkModalRef = {
  open: (p?: OpenParams) => void;
};

type FormValueType = {
  description: string;
  is_default: boolean;
};

export const GeneratorLinkModal = forwardRef<GeneratorLinkModalRef>(
  (_, ref) => {
    const qrcodeModalRef = useRef<QrcodeModalRef>(null);
    const openParamsRef = useRef<OpenParams>();
    const { refresh } = useContext(AgentContext);
    const t = useTranslations('promoter');

    const { isOpen, onOpen, onClose } = useDisclosure();

    const clickType = useRef<'link' | 'poster'>('link');

    const toast = useToast();

    const joinmeReq = useRequest(joinme, {
      manual: true,
      onSuccess(data) {
        onClose();
        if (clickType.current === 'link') {
          toast({ status: 'success', title: t('generateLinks') });
          if (openParamsRef.current?.callback)
            openParamsRef.current.callback?.();
        } else {
          qrcodeModalRef.current?.open(data.data);
        }
      },
      onError(e) {
        toast({ status: 'error', title: e.message });
      },
    });

    useImperativeHandle(ref, () => ({
      open: (p?: OpenParams) => {
        openParamsRef.current = p;
        onOpen();
      },
    }));

    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
          <ModalOverlay backdropFilter="blur(8px)" />
          <ModalContent maxW={['345px', '720px']}>
            <ModalBody
              mx="auto"
              p={['30px 20px 40px', '50px 38px']}
              color="#000"
              w="full"
              fontFamily="Inter"
            >
              {/* <Box
                fontWeight={700}
                fontSize={['14px', '20px']}
                lineHeight={['16px', '24px']}
                mb={['10px', '20px']}
              >
                Invite immediately！
              </Box> */}
              <Box
                fontWeight={700}
                fontSize={['14px', '20px']}
                lineHeight={['16px', '24px']}
                mb={['10px', '20px']}
              >
                {t('invitationTitle')}
              </Box>

              <Formik<FormValueType>
                initialValues={{
                  description: '',
                  is_default: true,
                }}
                onSubmit={async (values) => {
                  const { description, is_default: isDefault } = values;
                  await joinmeReq.runAsync({
                    description,
                    is_default: isDefault ? 1 : 0,
                    url: `${window.location.origin}/agent/invite`,
                  });
                  refresh();
                }}
              >
                {({ isSubmitting, isValid }) => (
                  <>
                    <Form style={{ width: '100%' }}>
                      <VStack align="flex-start" spacing="20px">
                        <FormControl>
                          <Field
                            as={Input}
                            name="description"
                            border="none"
                            rounded="none"
                            borderBottom="1px solid #000"
                            _placeholder={{
                              color: '#000',
                            }}
                            size="lg"
                            fontSize="md"
                            placeholder={t('linkRemarks')}
                            validate={(val: string) => {
                              if (!val) {
                                return 'field is require!';
                              }
                            }}
                          />
                        </FormControl>
                        <Field as={Checkbox} defaultChecked name="is_default">
                          {t('defaultLink')}
                        </Field>
                      </VStack>
                      <Stack
                        mt={['40px', '50px']}
                        spacing={['14px', '30px']}
                        direction={['column', 'row']}
                      >
                        <Button
                          onClick={() => {
                            clickType.current = 'link';
                          }}
                          disabled={!isValid}
                          fontSize={{ base: '14px', md: '16px' }}
                          isLoading={
                            isSubmitting && clickType.current === 'link'
                          }
                          type="submit"
                          w="full"
                          variant={'outline'}
                          rounded="full"
                          size={['md', 'xl']}
                        >
                          {t('generateLinks')}
                        </Button>
                        <Button
                          onClick={() => {
                            clickType.current = 'poster';
                          }}
                          disabled={!isValid}
                          fontSize={{ base: '14px', md: '16px' }}
                          isLoading={
                            isSubmitting && clickType.current === 'poster'
                          }
                          type="submit"
                          w="full"
                          variant={'primary'}
                          rounded="full"
                          size={['md', 'xl']}
                        >
                          {t('generatePoster')}
                        </Button>
                      </Stack>
                    </Form>
                  </>
                )}
              </Formik>
            </ModalBody>
          </ModalContent>
        </Modal>

        <QrcodeModal ref={qrcodeModalRef} />
      </>
    );
  },
);
