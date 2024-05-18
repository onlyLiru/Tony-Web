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

const BingTw = forwardRef((props, ref) => {
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


    /** 获取twcode */
    const fetchTwCode = async (state) => {
        // type 1 follow 2 retweet
        try {
            const result = await userApis.newGetTwUrl({
                redirect_url: `${redirectUrl}`,
                state,
            });
            console.log(result);
            if (result.data.url) {
                window.open(result.data.url, "_blank");
                // window.location.replace(result.data.url);
            }
        } catch (error) {
            toast({ title: error.msg, status: 'error' });
        }
    };

    const onTwitterLogin = async () => {
        router.replace('/account/setting');
        // if (followStatus === 'follow') {
        //     const result = await userApis.newFollowTw({
        //         code: twFollowCode,
        //         redirect_url: `${redirectUrl}`,
        //         task_id: 1,
        //     });
        //     console.log(result)
        //     if (result.data.status) {
        //         toast({ title: 'Success!', status: 'success' });
        //         // fetchTaskInfo();
        //         const { pathname } = window.location;
        //         setTwFollowCode('');
        //         router.replace(pathname);
        //     }
        //     return
        // }
        // // if (formRef.current?.values.twitter_name || userData?.twitter_name) return;
        // if (!userData?.twitter_name && !twFollowCode) {
        //     try {
        //         const { data } = await userApis.getTwitterUrl({ redirect_url: redirectUrl });
        //         console.log(data)
        //         window.open(data?.url, "_blank");
        //         //   s
        //     } catch (error) {
        //         toast({ status: 'error', title: error.message, variant: 'subtle' });
        //     }
        // } else {
        //     await fetchTwCode('follow');
        //     //   await onTwitterReconnect();

        // }

    };


    useEffect(() => {


        const { origin, pathname } = window.location;
        const { code, state } = router.query;
        setRedirectUrl(`${origin + pathname}`);
        // setRedirectUrl(`${origin + pathname}`);
        console.log(code)
        setFollow(state);
        setTwFollowCode(code);
    }, []);



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
                        请先绑定twitter
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
                                绑定twitter后，才可以完成发Twitter的任务。绑定后，我们将自动评估你的账号，给予算力值。
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
                                    // openConnectModal?.();
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

export default BingTw;
