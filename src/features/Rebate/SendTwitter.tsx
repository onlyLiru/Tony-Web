import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
} from 'react';
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
  VStack,
  useToast,
  Container,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { BindTwitter } from './BindTwitter';
import { useUserDataValue } from '@/store';
import * as rebateApi from '@/services/rebate';
import { getCookie } from 'cookies-next';
import { NEXT_LOCALE_KEY } from '@/const/cookie';

export const SendTwitter = forwardRef((props: { refresh: () => void }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('rebate');
  const bindTwitterRef = useRef<any>();
  const userData = useUserDataValue();
  const toast = useToast();
  const [type, setType] = useState(1);
  const [complete, setComplete] = useState(0);

  useImperativeHandle(ref, () => ({
    open: ({ num, status }: { num: number; status: number }) => {
      setType(num);
      setComplete(status);
      onOpen();
    },
  }));

  const checkTwitterBindStatus = async () => {
    try {
      const { data } = await rebateApi.getTwittwerBindStatus();
      return data.is_auth;
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
      return false;
    }
  };

  const onSend = async () => {
    if (!userData?.twitter_name) {
      const isBind = await checkTwitterBindStatus();
      if (!isBind) {
        bindTwitterRef.current.open();
        return;
      }
    }
    try {
      const { data } = await rebateApi.retweet({
        task_id: type === 1 ? 2 : 4,
        locale: (getCookie(NEXT_LOCALE_KEY) as string) || 'en',
      });
      if (data.status === 1) {
        toast({ status: 'success', title: data.msg, variant: 'subtle' });
        props.refresh();
      }
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
            lineHeight="30px"
            fontWeight={400}
            px={{ md: '30px', base: '20px' }}
            py={{ md: '28px', base: '10px' }}
            display="flex"
          >
            <Container px="0">
              {type === 1 ? t('sendTwitter1') : t('sendTwitter2')}
              {complete === 1 && (
                <Text
                  display="inline-block"
                  fontSize={{ md: '20px', base: '14px' }}
                  fontWeight={600}
                  color="#564DE9"
                  ml={{ md: '25px', base: '7px' }}
                >
                  {t('complete')}
                </Text>
              )}
            </Container>
          </ModalHeader>
          <ModalBody
            px={{ md: '68px', base: '20px' }}
            pt="14px"
            pb="25px"
            fontSize={{ base: '14px', md: '20px' }}
            lineHeight={{ base: '18px', md: '30px' }}
            fontWeight={400}
          >
            <VStack spacing={{ md: '48px', base: '20px' }} align="flex-start">
              <VStack
                spacing={{ md: '12px', base: '8px' }}
                align="flex-start"
                lineHeight="30px"
              >
                <Text fontSize={{ md: '20px', base: '14px' }} fontWeight={600}>
                  {t('detail')}：
                </Text>
                <Text
                  fontSize={{ md: '16px', base: '14px' }}
                  fontWeight={400}
                  color="#646464"
                  dangerouslySetInnerHTML={{
                    __html:
                      type === 1
                        ? t.raw('detailContent1')
                        : t.raw('detailContent2'),
                  }}
                ></Text>
              </VStack>
              <VStack spacing={{ md: '8px', base: '20px' }} align="flex-start">
                <Text fontSize={{ md: '20px', base: '14px' }} fontWeight={600}>
                  {t('textAndImg')}
                </Text>
                <VStack
                  spacing="4px"
                  align="flex-start"
                  fontSize={{ md: '16px', base: '14px' }}
                  fontWeight={400}
                  color="#646464"
                  lineHeight="30px"
                >
                  <Text display="inline">
                    {type === 1 ? t('sendTwitterText1') : t('sendTwitterText2')}
                  </Text>
                  <Text>{t('sendTwitterText3')}</Text>
                </VStack>
              </VStack>
            </VStack>
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
              onClick={onSend}
              w="110px"
              h={{ md: '36px', base: '28px' }}
              rounded="6px"
              variant={'primary'}
              fontSize={{ md: '17px', base: '12px' }}
              disabled={!!complete}
            >
              {t('confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <BindTwitter ref={bindTwitterRef} />
    </>
  );
});
