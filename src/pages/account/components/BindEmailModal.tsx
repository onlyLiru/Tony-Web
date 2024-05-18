import React, { useImperativeHandle, forwardRef, useState } from 'react';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  Flex,
  PinInput,
  PinInputField,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import * as globalApi from '@/services/global';
import { useFetchUser, useUserData } from '@/store';
import { jwtHelper } from '@/utils/jwt';
import { useTranslations } from 'next-intl';

const BindEmailModal = forwardRef((_: any, ref) => {
  const t = useTranslations('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isLargerThan480] = useMediaQuery('(min-width: 480px)');
  const { fetchUser } = useFetchUser();
  const [email, setEmail] = React.useState('');
  const [buttonLoading, setButtonLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    open: onOpen,
    close: onClose,
  }));

  const handleModalClose = () => {
    setButtonLoading(false);
    setEmail('');
    onClose();
  };

  // 输入验证码
  const handlePinInputChange = (value: string) => {
    // 如果填满5位直接触发提交
    if (value?.length >= 5) {
      console.log(value);
      bindWithEmail(_.email, value);
    }
  };

  // 邮箱登陆
  const bindWithEmail = async (email: string, code: string) => {
    console.log(buttonLoading);
    if (buttonLoading) {
      return;
    }
    setButtonLoading(true);
    globalApi
      .loginBindEmailWithPointReward({
        email,
        code: Number(code),
      })
      .then(async ({ data }) => {
        if (data.status === 0) {
          await fetchUser();
          // 登陆成功后把邮箱在本地缓存一份，用于下次登陆时回填
          window.localStorage.setItem('UserEmail', email);
          toast({
            position: 'top',
            containerStyle: {
              top: '30px',
            },
            title: t('header.web2Login.bindSuccessReward'),
            status: 'success',
            isClosable: true,
          });
          handleModalClose();
        } else {
          throw new Error('bind failed');
        }
      })
      .catch(async (e) => {
        const code = e?.code;
        let errorText = '';
        switch (code) {
          case 200020:
            errorText = t('header.web2Login.bindValidCodeError');
            break;
          case 200021:
            errorText = t('header.web2Login.emailAlreadyUsedError');
            break;
          case 200022:
            errorText = t('header.web2Login.walletAlreadyUsedError');
            break;
          default:
            errorText = t('header.web2Login.bindFail');
        }
        toast({
          position: 'top',
          containerStyle: {
            top: '30px',
          },
          title: errorText,
          status: 'error',
          isClosable: true,
        });
      })
      .finally(() => {
        setButtonLoading(false);
      });
  };

  const styleMap = {
    titleFontSize: isLargerThan480 ? '24px' : '16px',
    tipFontSize: isLargerThan480 ? '16px' : '12px',
    contentFontSize: isLargerThan480 ? '20px' : '14px',
    pinInputFieldSize: {
      width: isLargerThan480 ? '56px' : '44px',
      height: isLargerThan480 ? '56px' : '44px',
    },
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        isCentered
        scrollBehavior="inside"
        variant={{ md: 'right', base: '' }}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent
          rounded="22px"
          maxWidth="528px"
          minHeight="240px"
          maxHeight="506px"
          bgColor="#FFFFFF"
          padding={isLargerThan480 ? '32px' : '16px 32px'}
          marginBottom={isLargerThan480 ? 'auto' : '0px'}
          borderBottomLeftRadius={isLargerThan480 ? '22px' : '0px'}
          borderBottomRightRadius={isLargerThan480 ? '22px' : '0px'}
        >
          <ModalCloseButton />
          <ModalBody padding="0" overflow="hidden">
            <Flex
              fontSize={styleMap.contentFontSize}
              flexDirection="column"
              justifyContent="space-between"
            >
              <Box>
                {/* 标题 */}
                <Text fontSize={styleMap.titleFontSize} fontWeight={600}>
                  {t('header.web2Login.enterVerifyCode')}
                </Text>
                <Text mt="8px" color="rgba(0,0,0,0.25);" fontSize="16px">
                  {t('header.web2Login.verifyCodeSended')} {_.email}
                </Text>
              </Box>
              {/* 输入验证码的6个框框 */}
              <Flex
                mt={isLargerThan480 ? '40px' : '36px'}
                justifyContent="space-between"
              >
                <PinInput placeholder="" onChange={handlePinInputChange}>
                  <PinInputField {...styleMap.pinInputFieldSize} />
                  <PinInputField {...styleMap.pinInputFieldSize} />
                  <PinInputField {...styleMap.pinInputFieldSize} />
                  <PinInputField {...styleMap.pinInputFieldSize} />
                  <PinInputField {...styleMap.pinInputFieldSize} />
                  {/* <PinInputField {...styleMap.pinInputFieldSize} /> */}
                </PinInput>
              </Flex>
              {/* <Button
                mt={isLargerThan480 ? '100px' : '24px'}
                lineHeight="56px"
                borderRadius="28px"
                backgroundColor="black"
                color="white"
                width="100%"
                _hover={{ bg: 'rgba(0,0,0,0.85)' }}
                isLoading={buttonLoading}
                onClick={handleClickLogin}
              >
                {t('header.web2Login.login')}
              </Button> */}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

export default BindEmailModal;
