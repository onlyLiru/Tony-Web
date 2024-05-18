import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
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
    Image,
    useMediaQuery,
} from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import * as pointsApi from '@/services/power';

const Partners = forwardRef((props, ref) => {
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

    const { openConnectModal } = useConnectModal();
    const [collectionInfoData, setCollectionInfo] = useState([]);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    useImperativeHandle(ref, () => ({
        open: () => {
            onOpen();
        },
    }));

    // 获取任务的状态
    const collectionStatusInfo = async () => {
        try {
            const { data } = await pointsApi.collectionStatus();
            console.log(data, 'collectionStatusInfo');
            setCollectionInfo(data?.task_nft_list)
        } catch (error) {
            toast({ title: error.msg, status: 'error' });
        }
    };



    useEffect(() => {
        collectionStatusInfo()
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
                    <ModalHeader fontSize={'14px'}>
                        持有UneMeta合作伙伴NFT
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
                                可以获得算力值奖励
                            </Text>
                            <Text
                                color={'#86909C'}
                                textAlign={'center'}
                                fontWeight={'400'}
                                fontSize={'16px'}
                            >
                                （每周会公布新的NFT合作伙伴）
                            </Text>
                            <Box display={'grid'} gridTemplateColumns={'1fr 1fr'} gridGap={'27px'}>
                                {collectionInfoData?.map((val, index) =>
                                    <Box key={index} textAlign={'center'}>
                                        <Image src={val?.image} w={'120px'} h={'120px'}></Image>
                                        <Text my={'8px'}>花泽香菜</Text>
                                        <Button bg={'#FB9D42'} size="sm" w={'100%'}>去购买</Button>
                                    </Box>
                                )}
                            </Box>
                            {/* <Button
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
                                去绑定
                            </Button> */}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </>
    );
});

export default Partners;
