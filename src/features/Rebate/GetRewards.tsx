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
import { formatEther } from 'ethers/lib/utils.js';
import { useClaimEvent } from './useClaimEvent';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { defaultChainId } from '@/store';

export const GetRewards = forwardRef(
  (props: { data: any; refresh: () => void }, ref) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const t = useTranslations('rebate');
    const { data } = props;
    const { loading, claim } = useClaimEvent();

    const { needSwitchChain, switchChain } = useSwitchChain({
      fixedChainId: defaultChainId,
    });

    useImperativeHandle(ref, () => ({
      open: onOpen,
    }));

    const getRewards = async () => {
      if (needSwitchChain) return switchChain();
      const data = await claim();
      if (!data.status) {
        toast({
          status: 'error',
          title: data.msg || t('getRewardFailed'),
          variant: 'subtle',
        });
        return;
      }
      toast({
        status: 'success',
        title: t('getRewardSuccess'),
        variant: 'subtle',
      });
      props.refresh();
      onClose();
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
              {t('tips')}
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
              {`${t('tipsText1')} ${
                data?.remain_reward ? formatEther(data?.remain_reward) : '0'
              }ETH，${t('tipsText2')} ${
                data?.total_reward ? formatEther(data?.total_reward) : '0'
              }ETH。`}
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
                isLoading={loading}
                onClick={getRewards}
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
  },
);
