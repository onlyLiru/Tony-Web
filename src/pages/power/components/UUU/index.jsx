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
import { useToggle, useRequest, useCountDown } from 'ahooks';
import * as pointsApi from '@/services/power';
import * as userApis from '@/services/user';
import { getuuInfo } from '@/services/points';

const UUUModal = forwardRef((props, ref) => {
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
    
    const [twFollowCode, setTwFollowCode] = useState('');
    const router = useRouter();
    const [redirectUrl, setRedirectUrl] = useState('');
    const [input, setInput] = React.useState('');
    const [integral, setIntegral] = useState('');

    const infoReq = useRequest(getuuInfo, { manual: true });
    

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    useImperativeHandle(ref, () => ({
        open: () => {
            onOpen();
        },
    }));
    
    const fetch = async () => {
        try {
            const { data } = await infoReq.runAsync({ location: 0 });
            setIntegral(data.integral)
            console.log(data)
        } catch (error) {
            toast({ status: 'error', title: error.message, variant: 'subtle' });
        }
    };

    const fetchReceiveFun = async () => {
        try {
            const dataQ = {
                uuu: +input
            }
            const { data } = await pointsApi.fetchReceive(dataQ);
            toast({ title: `Successfully redeemed ${data.compute_amount}uuu`, status: 'success' });
            fetch()
        } catch (error) {
            toast({ title: error.msg, status: 'error' });
        }
    };
    const exchange = async () => {
        if (input) {
            fetchReceiveFun()
        }
    };


    useEffect(() => {

        fetch();
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
                        {/* 绑定邮箱 */}
                    </ModalHeader>
                    <ModalCloseButton w="22px" h="22px" top="36px" right="32px" />
                    <ModalBody w={isLargerThan768 ? '560px' : 'auto'} px="28px">
                        <VStack background="#fff">
                            <Text
                                mt={'28px'}
                                color={'#1D2129'}
                                textAlign={'center'}
                                fontWeight={'900'}
                                fontSize={'16px'}
                            >
                                你可以将现有的积分兑换为算力值
                            </Text>
                            <Text
                                color={'#86909C'}
                                textAlign={'center'}
                                fontWeight={'400'}
                                fontSize={'14px'}
                            >
                                1uuu=10算力值
                            </Text>
                            <Input type='number' value={input} onChange={(event) => setInput(event.target.value)} placeholder='请输入uuu，必须为整数' />
                            <Text
                                color={'#1D2129'}
                                textAlign={'center'}
                                fontWeight={'400'}
                                fontSize={'14px'}
                            >
                                当前可用积分为<span style={{color: '#FB9D42'}}>{integral || 0}uuu</span>
                            </Text>
                            <Button
                                w="100%"
                                fontSize={'14px'}
                                bg={'#FB9D42'}
                                textAlign="center"
                                h={'42px'}
                                mt={'20px !important'}
                                lineHeight={'42px'}
                                borderRadius={'12px'}
                                onClick={async () => {
                                    exchange()
                                    onClose();
                                }}
                            >
                                {/* {t('Lianjieqianbao')} */}兑换
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </>
    );
});

export default UUUModal;
