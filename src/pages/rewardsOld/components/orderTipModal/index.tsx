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
  Box,
  Flex,
  useMediaQuery,
} from '@chakra-ui/react';
import { ShimmerImage } from '@/components/Image';

export type OrderTipModalRef = {
  open: (param: any) => void;
  close: () => void;
};

interface OrderTipModalProps {
  onExChange: (itemInfo: any) => void;
  type: string;
}

const OrderTipModal = forwardRef((props: OrderTipModalProps, ref) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const { onExChange, type } = props;
  const t = useTranslations('points');
  const [itemInfo, updateItemInfo] = useState<any>({});
  const { isOpen, onOpen, onClose } = useDisclosure({
    id: 'orderTip',
  });

  useImperativeHandle(ref, () => ({
    open: (param: any) => {
      updateItemInfo(param ?? {});
      onOpen();
    },
    close: () => {
      onClose();
    },
  }));

  return (
    <>
      {isLargerThan768 ? (
        <Modal onClose={onClose} isOpen={isOpen} motionPreset="slideInRight">
          <ModalOverlay />
          <ModalContent minW="33.33vw" rounded="0.83vw">
            <ModalHeader p={0}>
              <ShimmerImage
                src={itemInfo?.img_url}
                w="100%"
                h="18.75vw"
                rounded="0.83vw 0.83vw 0 0"
              />
            </ModalHeader>
            <ModalCloseButton w="40px" h="40px" top="36px" right="40px" />
            <ModalBody w="100%" px="2.08vw" py="1.25vw">
              <Text
                color="#000"
                fontSize="24px"
                fontFamily="PingFangSC-Medium"
                fontWeight="bold"
                mb="1.25vw"
              >
                {itemInfo?.title}
              </Text>
              <Box maxH="13.02vw" overflow="auto" mb="3.02vw">
                <Text
                  color="#000"
                  fontSize="16px"
                  fontFamily="PingFangSC-Medium"
                  fontWeight="bold"
                  mb="8px"
                >
                  {t('recordDialog.introTitle')}
                </Text>
                <Text
                  color="#777E90"
                  fontSize="16px"
                  wordBreak="break-all"
                  mb="16px"
                >
                  {itemInfo?.desc}
                </Text>
                <Text
                  color="#000"
                  fontSize="16px"
                  fontFamily="PingFangSC-Medium"
                  fontWeight="bold"
                  mb="8px"
                >
                  {t('recordDialog.addInfo')}
                </Text>
                <Text
                  color="#777E90"
                  fontSize="16px"
                  wordBreak="break-all"
                  mb="16ox"
                >
                  {itemInfo?.additional_desc}
                </Text>
              </Box>
              <Flex justifyContent="space-between">
                <Flex alignItems="center">
                  <ShimmerImage
                    w="18px"
                    h="18px"
                    src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                    mr="4px"
                  />
                  <Text
                    fontFamily="PingFangSC-Medium"
                    fontSize="18px"
                    color="#544AEC"
                    mr="8px"
                    lineHeight="20px"
                  >
                    {itemInfo?.integral}
                  </Text>
                  <Text fontSize="16px" color="#777E90" lineHeight="20px">
                    {itemInfo?.total}/{itemInfo?.total_real}
                  </Text>
                </Flex>
                <Box
                  w="190px"
                  h="44px"
                  lineHeight="44px"
                  textAlign="center"
                  background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                  color="#ffffff"
                  fontSize="16px"
                  rounded="8px"
                  cursor="pointer"
                  onClick={() => {
                    onClose();
                    onExChange(itemInfo);
                  }}
                >
                  {type === 'reserve' ? t('reserve') : t('exchangeBtn')}
                </Box>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      ) : (
        <Modal
          size="full"
          onClose={onClose}
          isOpen={isOpen}
          motionPreset="slideInRight"
        >
          <ModalOverlay />
          <ModalContent p={0}>
            <ModalHeader p={0}>
              <ShimmerImage src={itemInfo?.img_url} w="100%" h="210px" />
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody w="100%" px="16px" pt="24px" pb="16px">
              <Text
                color="#000"
                fontSize="20px"
                fontFamily="PingFangSC-Medium"
                fontWeight="bold"
                mb="16px"
              >
                {itemInfo?.title}
              </Text>
              <Box maxH="48vh" overflow="auto" mb="10vh">
                <Text
                  color="#000"
                  fontSize="14px"
                  fontFamily="PingFangSC-Medium"
                  fontWeight="bold"
                  mb="8px"
                >
                  {t('recordDialog.introTitle')}
                </Text>
                <Text
                  color="#777E90"
                  fontSize="14px"
                  wordBreak="break-all"
                  mb="24px"
                >
                  {itemInfo?.desc}
                </Text>
                <Text
                  color="#000"
                  fontSize="14px"
                  fontFamily="PingFangSC-Medium"
                  fontWeight="bold"
                  mb="8px"
                >
                  {t('recordDialog.addInfo')}
                </Text>
                <Text
                  color="#777E90"
                  fontSize="14px"
                  wordBreak="break-all"
                  mb="16ox"
                >
                  {itemInfo?.additional_desc}
                </Text>
              </Box>
              <Flex justifyContent="space-between">
                <Flex alignItems="center">
                  <ShimmerImage
                    w="18px"
                    h="18px"
                    src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                    mr="4px"
                  />
                  <Text
                    fontFamily="PingFangSC-Medium"
                    fontSize="18px"
                    color="#544AEC"
                    mr="8px"
                    lineHeight="20px"
                  >
                    {itemInfo?.integral}
                  </Text>
                  <Text fontSize="16px" color="#777E90" lineHeight="20px">
                    {itemInfo?.total}/{itemInfo?.total_real}
                  </Text>
                </Flex>
                <Box
                  w="126px"
                  h="432x"
                  lineHeight="32px"
                  textAlign="center"
                  background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                  color="#ffffff"
                  fontSize="14px"
                  rounded="4px"
                  cursor="pointer"
                  onClick={() => {
                    onExChange(itemInfo);
                  }}
                >
                  {type === 'reserve' ? t('reserve') : t('exchangeBtn')}
                </Box>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
});

export default OrderTipModal;
