import { forwardRef, useImperativeHandle } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  useDisclosure,
} from '@chakra-ui/react';
import { ConnectWalletList } from '@/features/ConnectWalletList';

export type ConnectWalletModalRef = {
  open: () => void;
  close: () => void;
};

export const ConnectWalletModal = forwardRef((props, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
    },
    close: () => {
      onClose();
    },
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(20px)" />
      <ModalContent
        maxWidth={{ base: '90vw', md: '30vw' }}
        shadow="none"
        rounded="2xl"
        p={5}
      >
        <ModalHeader fontSize={'2xl'}>Connect Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={8}>
          <ConnectWalletList />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
