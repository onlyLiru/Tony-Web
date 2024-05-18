import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import React, { useImperativeHandle, forwardRef } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
  confirmRedeem: () => void;
  modalType: 'confirm' | 'tips';
  tipsWording?: string;
};

const ConfModal = forwardRef((props: Props, ref) => {
  const { confirmRedeem, modalType = 'confirm', tipsWording } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const handleClose = () => onClose();
  const t = useTranslations('activityTeamz');

  useImperativeHandle(ref, () => ({
    open: () => onOpen(),
    close: () => onClose(),
  }));

  const redeemConfirmModal = (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xs">
        <ModalOverlay />
        <ModalContent padding="0px" w={{ base: '88vw', md: 'auto' }}>
          <ModalBody p={{ base: '5vw', md: '15px' }}>
            <Text
              p={{ base: '4vw', md: '15px' }}
              fontSize={{ base: '4.5vw', md: '20px' }}
              lineHeight={{ base: '7vw', md: '25px' }}
            >
              {t('redeemConfirm')}
            </Text>
          </ModalBody>
          <ModalFooter mb={{ base: '5vw', md: '15px' }}>
            <Button
              flex="1"
              colorScheme="whiteAlpha"
              onClick={handleClose}
              variant="outline"
            >
              {t('cancel')}
            </Button>
            <Button
              flex="1"
              ml="3vw"
              _hover={{ bgColor: '#2a2727' }}
              _active={{ bgColor: '#2a2727' }}
              bg="black"
              variant="outline"
              onClick={confirmRedeem}
              color="white"
            >
              {t('confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );

  const redeemTipsModal = (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xs">
        <ModalOverlay />
        <ModalContent padding="0px" w={{ base: '88vw', md: 'auto' }}>
          <ModalBody p={{ base: '5vw', md: '15px' }}>
            <Text
              p={{ base: '5vw', md: '15px' }}
              fontSize={{ base: '4.5vw', md: '20px' }}
              lineHeight={{ base: '7vw', md: '25px' }}
              textAlign="center"
            >
              {tipsWording || t('noTicket')}
            </Text>
          </ModalBody>
          <ModalFooter mb={{ base: '5vw', md: '15px' }}>
            <Button
              flex="1"
              ml={{ base: '3vw', md: '15px' }}
              _hover={{ bgColor: '#2a2727' }}
              _active={{ bgColor: '#2a2727' }}
              bg="black"
              variant="outline"
              onClick={onClose}
              color="white"
            >
              {t('confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );

  return (
    <>
      {modalType === 'confirm' && redeemConfirmModal}
      {modalType === 'tips' && redeemTipsModal}
    </>
  );
});

export default ConfModal;
