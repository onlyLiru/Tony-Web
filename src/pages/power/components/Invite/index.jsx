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
import useCopy from '@/hooks/useCopy';
import * as pointsApi from '@/services/points';

const InviteModal = forwardRef((props, ref) => {
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
    const { userData, fetchUser } = useFetchUser();
    const [twFollowCode, setTwFollowCode] = useState('');
    const router = useRouter();
    const [redirectUrl, setRedirectUrl] = useState('');
    const [followStatus, setFollow] = useState('');

    const [invitationUrl, setInvitationUrl] = useState('');
    const [inviteMsg, updateInviteResult] = useState({});
    const { openConnectModal } = useConnectModal();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [_, copy] = useCopy();
    useImperativeHandle(ref, () => ({
        open: () => {
            onOpen();
        },
    }));


    // 获取自身邀请码
    const fetchInviteCode = async () => {
        try {
            const res = await pointsApi.getInviteCode();
            updateInviteResult(res.data);
        } catch (err) { }
    };


    useEffect(() => {
        setInvitationUrl(
            `${window.location.host}${window.location.pathname}?invitationCode=true`,
        );
        fetchInviteCode()
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
                        邀请注册得算力值
                    </ModalHeader>
                    <ModalCloseButton w="22px" h="22px" top="36px" right="32px" />
                    <ModalBody w={isLargerThan768 ? '560px' : 'auto'} px="28px">
                        <VStack background="#fff">
                            <Text
                                color={'#86909C'}
                                textAlign={'left'}
                                fontWeight={'400'}
                                fontSize={'16px'}
                            >
                                每次邀请好友且绑定推特后，都可以获得算力值。邀请者可以额外获得被邀请者算力值的 5%。
                            </Text>
                        </VStack>
                        <Box my='18px' p='15px' h={'158px'} w={'100%'} bg={'#F2F3F5'} borderRadius={'8px'}>
                            <Text textAlign="center" color={'#86909C'}>我的邀请码</Text>
                            <Text fontSize={'24px'} my={'10px'} fontWeight={'bold'} textAlign="center" >
                                {inviteMsg?.scode
                                    ? inviteMsg?.scode.split('').join(' ')
                                    : null}
                            </Text>
                            <Button
                                w="100%"
                                fontSize={'14px'}
                                bg={'#FB9D42'}
                                textAlign="center"
                                h={'42px'}
                                // mt={'40px !important'}
                                lineHeight={'42px'}
                                borderRadius={'12px'}
                                onClick={async () => {
                                    if (invitationUrl && inviteMsg)
                                        await copy(`${invitationUrl}\n${inviteMsg?.scode}`);
                                    toast({
                                        position: 'top',
                                        status: 'success',
                                        title: 'success!',
                                        duration: 2000,
                                        containerStyle: {
                                            marginTop: '30px',
                                        },
                                    });

                                    onClose();
                                }}
                            >
                                复制链接与邀请码
                            </Button>
                        </Box>
                        <Box textAlign={'left'} fontSize={'12px'} color={'#86909C'}>
                            <Text mb='20px' fontSize={'16px'}>邀请流程</Text>
                            <Box mb='12px' display={'flex'} alignItems={'center'}>
                                <Box color={'#FB9D42'} w={'24px'} h={'24px'} borderRadius={'50%'} border={'1px solid #FB9D42'} display={'flex'} justifyContent={'center'} alignItems={'center'}>1</Box>
                                <Text ml={'8px'}>分享邀请链接或邀请码</Text>
                            </Box>
                            <Box mb='12px' display={'flex'} alignItems={'center'}>
                                <Box color={'#FB9D42'} w={'24px'} h={'24px'} borderRadius={'50%'} border={'1px solid #FB9D42'} display={'flex'} justifyContent={'center'} alignItems={'center'}>2</Box>
                                <Text ml={'8px'}>对方登录UneMeta</Text>
                            </Box>
                            <Box mb='12px' display={'flex'} alignItems={'center'}>
                                <Box color={'#FB9D42'} w={'24px'} h={'24px'} borderRadius={'50%'} border={'1px solid #FB9D42'} display={'flex'} justifyContent={'center'} alignItems={'center'}>3</Box>
                                <Text ml={'8px'}>对方填写邀请码</Text>
                            </Box>
                            <Box mb='12px' display={'flex'} alignItems={'center'}>
                                <Box color={'#FB9D42'} w={'24px'} h={'24px'} borderRadius={'50%'} border={'1px solid #FB9D42'} display={'flex'} justifyContent={'center'} alignItems={'center'}>4</Box>
                                <Text ml={'8px'}>对方关联推特</Text>
                            </Box>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </>
    );
});

export default InviteModal;
