import React, { useImperativeHandle, forwardRef } from 'react';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import * as userApis from '@/services/user';

export const BindTwitter = forwardRef((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('rebate');
  const toast = useToast();

  useImperativeHandle(ref, () => ({
    open: onOpen,
  }));

  const onBind = async () => {
    try {
      const { origin, pathname } = window.location;
      const redirectUrl = `${origin + pathname}`;
      const { data } = await userApis.getTwitterUrl({
        redirect_url: redirectUrl,
      });
      onClose();
      window.open(data.url);
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          rounded={{ md: '16px', base: '10px' }}
          maxWidth={{ base: '362px', md: '800px' }}
          pb={{ md: '42px', base: '28px' }}
        >
          <ModalCloseButton />
          <ModalHeader
            fontSize={{ md: '24px', base: '16px' }}
            lineHeight="50px"
            fontWeight={400}
            px={{ md: '68px', base: '20px' }}
            py={{ md: '28px', base: '4px' }}
          >
            {t('bindTwitter')}
          </ModalHeader>
          <ModalBody
            px={{ md: '68px', base: '42px' }}
            pt={{ md: '35px', base: '75px' }}
            pb={{ md: '44px', base: '85px' }}
            fontSize={{ base: '14px', md: '18px' }}
            lineHeight={{ base: '20px', md: '30px' }}
            fontWeight={400}
          >
            {t('bindTwitterContent')}
          </ModalBody>
          <ModalFooter py="0" pr={{ md: '47px', base: '15px' }}>
            <Button
              onClick={onClose}
              mr="4px"
              w="110px"
              h={{ md: '36px', base: '28px' }}
              rounded="6px"
              bgColor="transparent"
              fontSize={{ md: '17px', base: '12px' }}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={onBind}
              w="110px"
              h={{ md: '36px', base: '28px' }}
              rounded="6px"
              variant={'primary'}
              fontSize={{ md: '17px', base: '12px' }}
            >
              {t('confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
