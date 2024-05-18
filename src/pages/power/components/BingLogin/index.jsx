import React, { forwardRef, useImperativeHandle, useState } from 'react';
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
    Input,
    Box,
    VStack,
    HStack,
    Button,
    useToast,
    useMediaQuery,
} from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const BingLogin = forwardRef((props, ref) => {
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

    const { openConnectModal } = useConnectModal();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    useImperativeHandle(ref, () => ({
        open: () => {
            onOpen();
        },
    }));
    return (
        <>
            <Modal
                onClose={onClose}
                isOpen={isOpen}
                isCentered
                motionPreset="slideInRight"
                size={isLargerThan768 ? 'sm' : 'xs'}>
                <ModalOverlay />
                <ModalContent
                    minW={isLargerThan768 ? '560px' : 'auto'}
                    rounded="22px"
                >
                    <ModalHeader>
                        活动简介
                    </ModalHeader>
                    <ModalCloseButton w="22px" h="22px" top="36px" right="32px" />
                    <ModalBody w={isLargerThan768 ? '560px' : 'auto'} px="28px">
                        <VStack background="#fff">
                            {/* <ShimmerImage
                src={userData?.profile_image}
                w={isLargerThan768 ? '56px' : '56px'}
                h={isLargerThan768 ? '56px' : '56px'}
                mb={'20px'}
              /> */}
                            <Text
                                color={'#86909C'}
                                textAlign={'center'}
                                fontWeight={'400'}
                                fontSize={'16px'}
                            >
                                完成活动任务可以获得算力值，算力值排名越高，可瓜分奖金池的uuu积分越多。 查看详细规则 算力值会持续累计，每超过3天不登录UneMeta将损失5%的算力值，每期活动都可以获得uuu积分分成。
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
                                {/* {t('Lianjieqianbao')} */}连接钱包登录
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </>
    );
});

export default BingLogin;
