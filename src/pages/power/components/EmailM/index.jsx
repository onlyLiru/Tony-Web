import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
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
    Spinner,
    Flex,
    useToast,
    useMediaQuery,
} from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useFetchUser } from '@/store';
import { useRouter } from 'next/router';
import * as userApis from '@/services/user';

const EmailModal = forwardRef((props, ref) => {
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
    const { userData, fetchUser } = useFetchUser();
    const [twFollowCode, setTwFollowCode] = useState('');
    const router = useRouter();
    const [redirectUrl, setRedirectUrl] = useState('');
    const [followStatus, setFollow] = useState('');

    const { openConnectModal } = useConnectModal();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    useImperativeHandle(ref, () => ({
        open: () => {
            onOpen();
        },
    }));



    const onTwitterLogin = async () => {
        router.replace('/account/setting');
    };



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
                        绑定邮箱
                    </ModalHeader>
                    <ModalCloseButton w="22px" h="22px" top="36px" right="32px" />
                    <ModalBody w={isLargerThan768 ? '560px' : 'auto'} px="28px">
                        <VStack background="#fff">
                            <Text
                                color={'#86909C'}
                                textAlign={'center'}
                                fontWeight={'400'}
                                fontSize={'16px'}
                            >
                                绑定邮箱后，可获得10算力值
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
                                    onTwitterLogin();
                                    onClose();
                                }}
                            >
                                {/* {t('Lianjieqianbao')} */}去绑定
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </>
    );
});

export default EmailModal;
