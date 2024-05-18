import { useContractSell } from '@/hooks/useContractSell';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { ContractStepItem } from '../ContractStep';
import { getErrorMessage } from '@/utils/error';
import { useSwitchChain } from '@/hooks/useSwitchChain';

type CancelOpenParams = { orderId: number };

export type CancelSellModalAction = {
  open: (p: CancelOpenParams) => void;
};

export const CancelSellModal = forwardRef<
  CancelSellModalAction,
  { refresh?: () => void }
>((props, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cancelSell, status: cancelStatus } = useContractSell();
  const paramsRef = useRef<CancelOpenParams>();
  const toast = useToast();
  const t = useTranslations('common');
  const { needSwitchChain, switchChain } = useSwitchChain();

  const onCancel = async () => {
    try {
      await cancelSell({
        orderId: paramsRef.current?.orderId!,
      });
      toast({
        status: 'success',
        title: 'Your listing canceled!',
        variant: 'subtle',
      });
      props.refresh?.();
      onClose();
    } catch (error) {
      toast({
        status: 'error',
        title: getErrorMessage(error),
        variant: 'subtle',
      });
    }
  };

  useImperativeHandle(ref, () => ({
    open: (params: CancelOpenParams) => {
      if (needSwitchChain) {
        return switchChain();
      }
      paramsRef.current = params;
      onOpen();
      onCancel();
    },
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(12px)" />
      <ModalContent maxW={{ base: '90vw', md: 'lg' }}>
        <ModalHeader>{t('steps.cancelListing')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={5} borderTopWidth={1} borderColor="primary.gray">
          <ContractStepItem
            status={cancelStatus}
            title={t('steps.confirmInWallet')}
            desc={t('steps.confirmInWalletDesc')}
            trigger={onCancel}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
