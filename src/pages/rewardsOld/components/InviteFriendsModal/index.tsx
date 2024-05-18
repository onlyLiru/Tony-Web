import React, { forwardRef, useImperativeHandle } from 'react';
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
  Button,
  HStack,
  VStack,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { ShimmerImage } from '@/components/Image';
import useCopy from '@/hooks/useCopy';
import { CopyIcon } from '@chakra-ui/icons';

export type InviteFriendsModalRef = {
  open: () => void;
};

interface InviteFriendsModalProps {
  invitationUrl: string;
  dataSource: any;
}

const InviteFriendsModal = forwardRef((props: InviteFriendsModalProps, ref) => {
  const { invitationUrl, dataSource } = props;
  const [_, copy] = useCopy();
  const t = useTranslations('points');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure({
    id: 'invite',
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
    },
  }));

  return (
    <Modal onClose={onClose} isOpen={isOpen} motionPreset="slideInRight">
      <ModalOverlay />
      <ModalContent rounded="22px">
        {/* <ModalHeader
          w="480px"
          pl="40px"
          pt="35px"
          fontSize="20px"
          fontFamily="PingFangSC-Medium"
          fontWeight="600"
        >
         {t('invite.modalTitle_0')}{t('invite.modalTitle_1')}
        </ModalHeader> */}
        <ModalCloseButton w="22px" h="22px" top="36px" right="32px" />
        <ModalBody mt="20px">
          <VStack spacing={0} background="#fff" pt="10px" pb="2.55vw" px="12px">
            <ShimmerImage
              src="/images/home/research_icon.png"
              w={{ md: '122px', base: '80px' }}
              h={{ md: '122px', base: '80px' }}
              transform="rotate(15deg)"
              m="auto"
            />
            <Text
              fontSize="20px"
              color="#000"
              fontFamily="PingFangSC-Medium"
              fontWeight="400"
              lineHeight="40px"
            >
              {t('invite.myCode')}
            </Text>
            <Text
              fontSize="48px"
              color="#000"
              fontFamily="PingFangSC-Medium"
              fontWeight="600"
              lineHeight="40px"
              mt="25px !important"
            >
              {dataSource?.scode
                ? dataSource?.scode.split('').join(' ').toUpperCase()
                : null}
            </Text>
            <Button
              w="100%"
              h="48px"
              fontSize="14px"
              leftIcon={<CopyIcon />}
              colorScheme="teal"
              variant="solid"
              background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
              rounded="4px"
              mt="42px !important"
              _hover={{
                bg: 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);',
              }}
              onClick={async () => {
                if (invitationUrl && dataSource)
                  await copy(`${invitationUrl}\n${dataSource?.scode}`);
                toast({
                  status: 'success',
                  title: 'success!',
                  duration: 2000,
                  containerStyle: {
                    marginTop: '30px',
                  },
                });
              }}
            >
              {t('invite.copyCode')}
            </Button>
            <HStack w="100%" spacing="16px" mt="16px !important">
              <VStack
                justifyContent="center"
                h="78px"
                spacing="6px"
                flex={1}
                rounded="4px"
                border="1px solid rgba(0,0,0,0.12);"
              >
                <Text
                  fontFamily="PingFangSC-Medium"
                  fontWeight="500"
                  color="#000"
                  fontSize="24px"
                  lineHeight="20px"
                >
                  {dataSource?.invite_count}
                </Text>
                <Text
                  fontSize="14px"
                  color="rgba(0,0,0,0.45)"
                  fontWeight={400}
                  wordBreak="break-all"
                  textAlign="center"
                >
                  {t('invite.allNum')}
                </Text>
              </VStack>
              <VStack
                h="78px"
                justifyContent="center"
                spacing="2px"
                flex={1}
                rounded="4px"
                border="1px solid rgba(0,0,0,0.12);"
              >
                <Text
                  fontFamily="PingFangSC-Medium"
                  fontWeight="500"
                  color="#000"
                  fontSize="20px"
                  lineHeight="20px"
                >
                  {dataSource?.invite_count}
                </Text>
                <Text
                  fontSize="14px"
                  color="rgba(0,0,0,0.45)"
                  fontWeight={400}
                  wordBreak="break-all"
                  textAlign="center"
                >
                  {t('invite.allIntegral')}
                </Text>
              </VStack>
            </HStack>
            <Flex
              w="400px"
              h="52px"
              position="relative"
              mt="16px !important"
              rounded="4px"
              mb="2.55vw !important"
            >
              <VStack
                spacing={0}
                justifyContent="center"
                w="151px"
                h="100%"
                background={
                  dataSource?.invite_count >= 5
                    ? 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_4_wlzfrg.png) center center no-repeat'
                    : 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_mbejdp.png) center center no-repeat'
                }
                backgroundSize="cover"
                rounded="4px 0 0 4px"
                borderTop={
                  dataSource?.invite_count >= 5
                    ? '1px solid #CECBFF'
                    : '1px solid #E0E0E0'
                }
                borderBottom={
                  dataSource?.invite_count >= 5
                    ? '1px solid #CECBFF'
                    : '1px solid #E0E0E0'
                }
              >
                <HStack spacing={0} alignItems="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                    w="12px"
                    h="12px"
                    mr="4px"
                  />
                  <Text
                    fontSize="14px"
                    color="#544AEC"
                    fontFamily="PingFangSC-Medium"
                  >
                    +20
                  </Text>
                </HStack>
                <Text fontSize="12px" color="#6157FF" fontWeight={400}>
                  {t('invite.hasInviteFiveNum')}
                </Text>
              </VStack>
              <VStack
                spacing={0}
                justifyContent="center"
                w="148px"
                h="100%"
                background={
                  dataSource?.invite_count >= 10
                    ? 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_5_nbpbl3.png) center center no-repeat'
                    : 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_2_zpmua3.png) center center no-repeat'
                }
                backgroundSize="cover"
                ml="-17px"
                borderTop={
                  dataSource?.invite_count >= 10
                    ? '1px solid #CECBFF'
                    : '1px solid #E0E0E0'
                }
                borderBottom={
                  dataSource?.invite_count >= 10
                    ? '1px solid #CECBFF'
                    : '1px solid #E0E0E0'
                }
              >
                <HStack spacing={0} alignItems="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                    w="12px"
                    h="12px"
                    mr="4px"
                  />
                  <Text
                    fontSize="14px"
                    color="#544AEC"
                    fontFamily="PingFangSC-Medium"
                  >
                    +40
                  </Text>
                </HStack>
                <Text fontSize="12px" color="#6157FF" fontWeight={400}>
                  {t('invite.hasInviteTenNum')}
                </Text>
              </VStack>
              <VStack
                spacing={0}
                justifyContent="center"
                w="134px"
                h="100%"
                background={
                  dataSource?.invite_count >= 20
                    ? 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_6_gtoocm.png) center center no-repeat'
                    : 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_3_eukkva.png) center center no-repeat'
                }
                backgroundSize="cover"
                ml="-17px"
                rounded="0 4px 4px 0"
                borderTop={
                  dataSource?.invite_count >= 20
                    ? '1px solid #CECBFF'
                    : '1px solid #E0E0E0'
                }
                borderBottom={
                  dataSource?.invite_count >= 20
                    ? '1px solid #CECBFF'
                    : '1px solid #E0E0E0'
                }
              >
                <HStack spacing={0} alignItems="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                    w="12px"
                    h="12px"
                    mr="4px"
                  />
                  <Text
                    fontSize="14px"
                    color="#544AEC"
                    fontFamily="PingFangSC-Medium"
                  >
                    +100
                  </Text>
                </HStack>
                <Text fontSize="12px" color="#6157FF" fontWeight={400}>
                  {t('invite.hasInviteTwoNum')}
                </Text>
              </VStack>
            </Flex>
            <Box w="96%" margin="0 auto">
              <HStack mx="8px" justifyContent="space-betweeen">
                <HStack flex={1} spacing={0} justifyContent="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1691331280/%E7%BC%96%E7%BB%84_33_2x_vx701v.png"
                    w="56px"
                    h="56px"
                  />
                </HStack>
                <HStack flex={1} spacing={0} justifyContent="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1691417197/%E5%90%91%E4%B8%8B_2x_1_mhnuvw.png"
                    w="16px"
                    h="16px"
                  />
                </HStack>
                <HStack flex={1} spacing={0} justifyContent="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1691331280/%E7%BC%96%E7%BB%84_34_2x_z4y27j.png"
                    w="56px"
                    h="56px"
                  />
                </HStack>
                <HStack flex={1} spacing={0} justifyContent="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1691417197/%E5%90%91%E4%B8%8B_2x_1_mhnuvw.png"
                    w="16px"
                    h="16px"
                  />
                </HStack>
                <HStack flex={1} spacing={0} justifyContent="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1691331280/%E7%BC%96%E7%BB%84_35_2x_unbmem.png"
                    w="56px"
                    h="56px"
                  />
                </HStack>
              </HStack>
              <HStack
                w="100%"
                spacing={0}
                justifyContent="space-between"
                alignItems="flex-start"
                mt="14px"
              >
                <Text
                  maxW="84px"
                  fontSize="12px"
                  color="#000"
                  fontWeight={400}
                  textAlign="center"
                >
                  {t('invite.shareTip')}
                </Text>
                <Text
                  maxW="112px"
                  fontSize="12px"
                  color="#000"
                  fontWeight={400}
                  textAlign="center"
                  transform="translateX(8px)"
                >
                  {t('invite.relevantWallet')}
                </Text>
                <Text
                  maxW="98px"
                  fontSize="12px"
                  color="#000"
                  fontWeight={400}
                  textAlign="center"
                  transform="translateX(8px)"
                >
                  {t('invite.inputCode')}
                </Text>
              </HStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default InviteFriendsModal;
