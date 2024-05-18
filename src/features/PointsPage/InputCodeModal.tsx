import { forwardRef, useImperativeHandle, useState } from 'react';
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  Text,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useToast,
} from '@chakra-ui/react';
import { checkInviteCode, codeCallBack } from '@/services/points';
import { useTranslations } from 'next-intl';

export type InputCodeModalRef = {
  open: () => void;
};
export const InputCodeModal = forwardRef((props, ref) => {
  //   console.log(props, ref);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [code, setCode] = useState('');
  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
    },
  }));
  const toast = useToast();
  const t = useTranslations('points');
  const ct = useTranslations('common');
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> {t('InputCodeModal.title')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text color={'rgba(0,0,0,0.5)'} mb={'20px'}>
              {t('InputCodeModal.tips')}
            </Text>
            <FormControl>
              <FormLabel>{t('InputCodeModal.label')}</FormLabel>
              <Input
                placeholder={t('InputCodeModal.placeholder')}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button width={'200px'} onClick={onClose}>
              {t('InputCodeModal.skip')}
            </Button>
            <Button
              width={'200px'}
              bgColor="black"
              color={'#fff'}
              ml={3}
              _hover={{
                bgColor: 'black',
              }}
              onClick={async () => {
                // submitUserInfo(
                //     '中国',
                //     '410805964@qq.com'
                // )
                try {
                  const res = await checkInviteCode(code);
                  if (res.code === 200) {
                    const cRes = await codeCallBack(code);
                    console.log(cRes);
                    if (cRes.code === 200) {
                      toast({
                        status: 'success',
                        title: 'success',
                        variant: 'subtle',
                      });
                      onClose();
                    } else {
                      toast({
                        status: 'warning',
                        title: cRes.msg,
                        variant: 'subtle',
                      });
                    }
                  }
                } catch (error) {
                  toast({
                    status: 'error',
                    title: error.message,
                    variant: 'subtle',
                  });
                }
                // try {
                //   const { data } = await codeCallBack(code);
                //   console.log(data);
                // } catch (error) {
                //   toast({
                //     status: 'error',
                //     title: error.message,
                //     variant: 'subtle',
                //   });
                // }
              }}
            >
              {t('InputCodeModal.submit')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
