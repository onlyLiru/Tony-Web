import { namesByNetwork } from '@/contract/constants/logos';
import { SupportedChainId } from '@/contract/types';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
  Heading,
  CloseButton,
  VStack,
  Box,
  Center,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';

type ContentProps = {
  onOk: () => void;
  onClose: () => void;
  prevChainId: any;
  nextChainId: any;
};

const Content = (props: ContentProps) => {
  const { VisitChainLogo } = useSwitchChain({
    fixedChainId: props.nextChainId,
  });

  const prevChainName = useMemo(
    () => namesByNetwork[props.prevChainId as SupportedChainId],
    [props.prevChainId],
  );
  const nextChainName = useMemo(
    () => namesByNetwork[props.nextChainId as SupportedChainId],
    [props.prevChainId],
  );

  return (
    <>
      <ModalHeader
        display={'flex'}
        justifyContent="space-between"
        alignItems={'center'}
      >
        <Heading size="md">切换链市场</Heading>
        <CloseButton onClick={props.onClose} />
      </ModalHeader>
      <ModalBody p={8}>
        <VStack>
          <Center py={5}>
            <VisitChainLogo.Chain fontSize={'60px'} />
          </Center>
          <Box>
            您选择的NFT属于{nextChainName}链市场与当前链市场{prevChainName}
            不匹配，请切换至{nextChainName}链市场。
          </Box>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={props.onOk}
          className="Sb006"
          w="full"
          variant="primary"
          rounded="lg"
          size="xl"
          type="submit"
        >
          切换至{nextChainName}链市场
        </Button>
      </ModalFooter>
    </>
  );
};

export type SwitchChainModalOpenParams = {
  complete?: () => void;
} & Pick<ContentProps, 'nextChainId' | 'prevChainId'>;

export type SwitchChainModalAction = {
  open: (params?: SwitchChainModalOpenParams) => void;
};

export const SwitchChainModal = forwardRef<SwitchChainModalAction>((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paramsState, setParamsState] = useState<SwitchChainModalOpenParams>();
  useImperativeHandle(ref, () => ({
    open: (params?: SwitchChainModalOpenParams) => {
      setParamsState(params);
      onOpen();
    },
  }));

  const onOk = () => {
    paramsState?.complete?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(12px)" />
      <ModalContent rounded={'2xl'} maxW={{ base: '92vw', md: 'md' }}>
        <Content
          key={paramsState?.nextChainId}
          prevChainId={paramsState?.prevChainId}
          nextChainId={paramsState?.nextChainId}
          onClose={onClose}
          onOk={onOk}
        />
      </ModalContent>
    </Modal>
  );
});
