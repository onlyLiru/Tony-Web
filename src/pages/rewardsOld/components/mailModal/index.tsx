import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Text,
  Input,
  Box,
  HStack,
  useToast,
  useMediaQuery,
} from '@chakra-ui/react';

const isValidEmail = (email: string) => {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email);
};

export type MailModalRef = {
  open: (param: any) => void;
};

interface MailModalProps {
  onMailInput: (itemInfo: any, email: any) => void;
  onMailModalClose: () => void;
}

const MailModal = forwardRef((props: MailModalProps, ref) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const { onMailInput, onMailModalClose } = props;
  const [itemInfo, updateItemInfo] = useState<any>({});
  const [email, setEmail] = useState('');
  const t = useTranslations('points');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure({
    id: 'mail',
  });

  useImperativeHandle(ref, () => ({
    open: (param: any) => {
      updateItemInfo(param);
      onOpen();
    },
  }));

  const onSureMail = async () => {
    if (isValidEmail(email)) {
      try {
        await onMailInput(itemInfo, email);
        onClose();
        onMailModalClose();
      } catch (err) {
        setEmail('');
      }
    } else {
      toast({
        position: 'top',
        title: t('recordDialog.errorEmailTip'),
        status: 'error',
        duration: 2000,
      });
    }
  };

  return (
    <>
      {isLargerThan768 ? (
        <Modal onClose={onClose} isOpen={isOpen} motionPreset="slideInRight">
          <ModalOverlay />
          <ModalContent minW="25vw" rounded="1.14vw">
            <ModalHeader
              pl="2.08vw"
              pt="1.77vw"
              pb="0.62vw"
              fontSize="24px"
              color="#000"
              fontFamily="PingFangSC-Medium"
              fontWeight="bold"
            >
              {t('recordDialog.reservation')}
            </ModalHeader>
            <ModalCloseButton w="22px" h="22px" top="2.4vw" right="2.08vw" />
            <ModalBody w="100%" pt={0} px="2.08vw" pb="2.08vw">
              <Text
                fontSize="14px"
                color="rgba(0, 0, 0, 0.4)"
                wordBreak="break-all"
                mb="24px"
              >
                {t('recordDialog.reservation_desc')}
              </Text>
              <Text
                color="#000"
                fontSize="16px"
                fontFamily="PingFangSC-Medium"
                mb="8px"
                fontWeight="500"
              >
                {t('recordDialog.email')}
              </Text>
              <Input
                w="100%"
                h="2.91vw"
                placeholder="Default email addres"
                border="1px solid rgba(0, 0, 0, 0.2)"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                mb="24px"
              />
              <HStack spacing="20px" justify="space-between">
                <Box
                  flex={1}
                  py="14px"
                  textAlign="center"
                  color="#000000"
                  fontSize="16px"
                  border="1px solid rgba(0, 0, 0, 0.2)"
                  rounded="8px"
                  cursor="pointer"
                  onClick={onClose}
                >
                  {t('recordDialog.cancel')}
                </Box>
                <Box
                  flex={1}
                  py="14px"
                  textAlign="center"
                  color="#ffffff"
                  fontSize="16px"
                  rounded="8px"
                  background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                  cursor="pointer"
                  onClick={onSureMail}
                >
                  {t('recordDialog.ok')}
                </Box>
              </HStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : (
        <Modal onClose={onClose} isOpen={isOpen} motionPreset="slideInRight">
          <ModalOverlay />
          <ModalContent top="10%" w="100%" mx="16px" px="32px" rounded="16px">
            <ModalHeader
              px={0}
              pt="36px"
              pb="12px"
              fontSize="20px"
              color="#000"
              fontFamily="PingFangSC-Medium"
              fontWeight="bold"
            >
              {t('recordDialog.reservation')}
            </ModalHeader>
            <ModalCloseButton w="22px" h="22px" top="40px" right="32px" />
            <ModalBody w="100%" px={0} pt={0} pb="32px">
              <Text
                fontSize="14px"
                color="rgba(0, 0, 0, 0.4)"
                wordBreak="break-all"
                mb="16px"
              >
                {t('recordDialog.reservation_desc')}
              </Text>
              <Text
                color="#000"
                fontSize="14px"
                fontFamily="PingFangSC-Medium"
                mb="8px"
                fontWeight="500"
              >
                {t('recordDialog.email')}
              </Text>
              <Input
                w="100%"
                h="48px"
                placeholder="Default email addres"
                border="1px solid rgba(0, 0, 0, 0.2)"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                mb="16px"
              />
              <HStack spacing="12px" justify="space-between">
                <Box
                  flex={1}
                  py="14px"
                  textAlign="center"
                  color="#000000"
                  fontSize="16px"
                  border="1px solid rgba(0, 0, 0, 0.2)"
                  rounded="4px"
                  cursor="pointer"
                  onClick={onClose}
                >
                  {t('recordDialog.cancel')}
                </Box>
                <Box
                  flex={1}
                  py="14px"
                  textAlign="center"
                  color="#ffffff"
                  fontSize="16px"
                  rounded="4px"
                  background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                  cursor="pointer"
                  onClick={onSureMail}
                >
                  {t('recordDialog.ok')}
                </Box>
              </HStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
});

export default MailModal;
