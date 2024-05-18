import { joinmeSucceed } from '@/services/agent';
import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/router';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useUserDataValue } from '@/store';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useTranslations } from 'next-intl';

type OpenParams = { code: string };
export type InviteSignModalRef = {
  open: (p: OpenParams) => void;
};

export const InviteSignModal = forwardRef<InviteSignModalRef>((_, ref) => {
  const router = useRouter();
  const [state, setState] = useState<OpenParams>({ code: '' });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const userData = useUserDataValue();
  const { openConnectModal } = useConnectModal();
  const t = useTranslations('promoter');
  const joinmeSucceedReq = useRequest(joinmeSucceed, {
    manual: true,
    onSuccess: () => {
      toast({ status: 'success', title: 'Join succeed!' });
      router.replace('/');
    },
    onError: (e) => toast({ status: 'error', title: e.message }),
  });

  useImperativeHandle(ref, () => ({
    open: (p: OpenParams) => {
      setState(p);
      onOpen();
    },
  }));

  const onConfirm = async () => {
    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }
    await joinmeSucceedReq.runAsync({ code: state.code });
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
      size={['full', 'md']}
    >
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent>
        <ModalBody
          mx="auto"
          p="50px 38px"
          color="#000"
          w="full"
          maxWidth={{ base: 'full', md: '360px' }}
          bgSize="cover"
          fontFamily="Outfit"
          fontWeight={500}
        >
          <Box fontSize={'28px'} lineHeight={'36px'} mb="20px">
            Invite you
          </Box>
          <Box fontSize="14px" fontWeight={500}>
            {t('signupTitle')}
          </Box>
          <Flex align="center" direction="column" mx="auto" w="full">
            <Image
              src="/images/agent/invite_eth.svg"
              w="88px"
              mt="60px"
              mb="40px"
            />
            <Box
              lineHeight="18px"
              mt="20px"
              mb="0"
              fontWeight={500}
              fontSize="14px"
            >
              {t('inviteId')}
            </Box>
            <Box fontWeight={500} fontSize="28px" textTransform="uppercase">
              {state.code}
            </Box>
            <Button
              w="140px"
              h="38px"
              rounded="full"
              mt="120px"
              variant="primary"
              fontSize={'12px'}
              textTransform="uppercase"
              isLoading={joinmeSucceedReq.loading}
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </Flex>

          <Flex
            opacity={[1, 0]}
            pos="absolute"
            right="20px"
            bottom="0px"
            align="center"
            mb="20px"
          >
            <Image w="24px" mr="5px" src="/logo_l.png" />
            <Text>UNEMETA</Text>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
