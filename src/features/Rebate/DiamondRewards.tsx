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
  Text,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { formatEther } from 'ethers/lib/utils.js';

export const DiamondRewards = forwardRef((props: { data: any }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('rebate');
  const { data } = props;
  useImperativeHandle(ref, () => ({
    open: onOpen,
  }));

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
            display="flex"
          >
            {t('diamond')}
            <Text
              fontSize="20px"
              fontWeight={600}
              color="#564DE9"
              ml="18px"
              display={{ md: 'unset', base: 'none' }}
            >
              {t('complete')}
            </Text>
          </ModalHeader>
          <ModalBody
            px={{ md: '68px', base: '42px' }}
            pt={{ md: '35px', base: '75px' }}
            pb={{ md: '44px', base: '85px' }}
            fontSize={{ base: '14px', md: '18px' }}
            lineHeight={{ base: '20px', md: '30px' }}
            fontWeight={400}
            textAlign="center"
          >
            {`${t('diamondText1')} ${
              data?.diamonds_reward ? formatEther(data?.diamonds_reward) : '0'
            } ETH，${t('diamondText2')}`}
          </ModalBody>
          <ModalFooter
            py="0"
            pr={{ md: '47px', base: '15px' }}
            fontWeight={600}
          >
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
              // isLoading={loading}
              // onClick={onRegisger}
              w="110px"
              h={{ md: '36px', base: '28px' }}
              rounded="6px"
              variant={'primary'}
              fontSize={{ md: '17px', base: '12px' }}
            >
              {t('claim')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
