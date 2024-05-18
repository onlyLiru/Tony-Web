import React, { forwardRef, useImperativeHandle } from 'react';
import { useEffect, useRef } from 'react';

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
  useMediaQuery,
  Box,
  Button,
  VStack,
} from '@chakra-ui/react';
import { ShimmerImage } from '@/components/Image';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useUserDataValue, useIsShowLogin } from '@/store';

export type InviteFriendsModalRef = {
  open: () => void;
};
const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const LoginModal = forwardRef((props, ref) => {
  const t = useTranslations('common');
  const userData = useUserDataValue();

  const [isShowLogin, setIsShowLogin] = useIsShowLogin();

  const { openConnectModal } = useConnectModal();
  const { isOpen, onOpen, onClose } = useDisclosure({
    id: 'loginmodal',
  });
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const userDataWalletRef: any = useRef();
  const showLogin = async () => {
    await sleep(1000);
    userDataWalletRef.current = userData?.wallet_address;
    if (!userDataWalletRef.current) {
      onOpen();
      setIsShowLogin(true);
    }
  };
  useEffect(() => {
    // console.log('55555888888')
    userDataWalletRef.current = userData?.wallet_address;
    console.log(userDataWalletRef.current);
    if (!userDataWalletRef.current && !isShowLogin) {
      showLogin();
    }
  }, [userData?.wallet_address]);
  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
    },
  }));

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      motionPreset="slideInRight"
    >
      <ModalOverlay />
      <ModalContent minW={isLargerThan768 ? '560px' : 'auto'} rounded="22px">
        <ModalHeader> {t('header.web2Login.loginUne')}</ModalHeader>
        <ModalCloseButton w="22px" h="22px" top="36px" right="32px" />
        <ModalBody w={isLargerThan768 ? '560px' : 'auto'} px="28px">
          <VStack background="#fff" pt="10px" pb="2.55vw" px="12px">
            <ShimmerImage
              src="/images/login/login.png"
              w={isLargerThan768 ? '480px' : '340px'}
              h={isLargerThan768 ? '200px' : '130px'}
              mb={'20px'}
            />
            <Text color={'grey'} fontSize={'14px'}>
              {t('header.web2Login.loginUneContent')}
            </Text>
            <Button
              w="100%"
              fontSize={'14px'}
              bg={'#FB9D42'}
              textAlign="center"
              h={'42px'}
              mt={'40px !important'}
              lineHeight={'42px'}
              borderRadius={'12px'}
              onClick={async () => {
                openConnectModal?.();
                onClose();
              }}
            >
              Login
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default LoginModal;
