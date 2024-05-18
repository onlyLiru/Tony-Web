import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from 'react';
import {
  Box,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Popover,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
  PopoverTrigger,
  useMediaQuery,
  useDisclosure,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { useUserDataValue } from '@/store';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { getSignedInDate } from '@/services/rebate';
import { ShimmerImage } from '@/components/Image';
import { useCookieState } from 'ahooks';
import { JWT_HEADER_KEY } from '@/utils/jwt';
import { Web2LoginModal } from '@/components/PageLayout/Header/Web2Login';

type ResgisterModalAction = {
  open: () => void;
  close?: () => void;
};

export const GetUUU = forwardRef<any, any>((props, ref) => {
  const { getFun } = props;
  const [isOpen, updateOpenStatus] = useState(false);
  const [isSign, updateSignStatus] = useState(false);
  const t = useTranslations('common');
  const {
    isOpen: isPopOpen,
    onOpen: onPopOpen,
    onClose: onPopClose,
  } = useDisclosure();
  const userData = useUserDataValue();
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [cookieToken, setCookieToken] = useCookieState(JWT_HEADER_KEY);
  const web2LoginModal = useRef<ResgisterModalAction>(null);

  useImperativeHandle(ref, () => ({
    open: onOpen,
  }));

  const onOpen = () => {
    updateOpenStatus(true);
  };

  const onClose = () => {
    updateOpenStatus(false);
  };

  const renderModal = () => {
    return (
      <Modal size="full" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody px="16px" pt="40px">
            <ShimmerImage
              src="/images/reward/dance.min.png"
              w="80px"
              h="80px"
              m="auto"
            />
            <Text
              fontSize="24px"
              color="#000"
              fontFamily="PingFangSC-Medium"
              fontWeight="bold"
              textAlign="center"
              mt="12px"
              mb="22px"
            >
              {t('rewardsModal.desc')}
            </Text>
            {!userData?.wallet_address ? (
              <Flex
                h="64px"
                px="20px"
                alignItems="center"
                justifyContent="space-between"
                mb="16px"
                backgroundColor="#F7F7F7"
                rounded="8px"
                onClick={() => {
                  openConnectModal?.();
                }}
              >
                <Text
                  fontSize="14px"
                  color="#000"
                  fontWeight="500"
                  fontFamily="PingFangSC-Medium"
                >
                  {t('rewardsModal.desc1')}
                </Text>
                <Flex alignItems="center">
                  <Text color="#544AEC" fontSize="14px" mr="6px">
                    {t('rewardsModal.login')}
                  </Text>
                  <ShimmerImage
                    w="14px"
                    h="14px"
                    src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                  />
                </Flex>
              </Flex>
            ) : null}
            {!isSign ? (
              <Flex
                h="64px"
                px="20px"
                alignItems="center"
                justifyContent="space-between"
                mb="16px"
                backgroundColor="#F7F7F7"
                rounded="8px"
                onClick={() => {
                  router.push(`/rewards`);
                }}
              >
                <Text
                  fontSize="14px"
                  color="#000"
                  fontWeight="500"
                  fontFamily="PingFangSC-Medium"
                >
                  {t('rewardsModal.desc2')}
                </Text>
                <Flex alignItems="center">
                  <Text color="#544AEC" fontSize="14px" mr="6px">
                    {t('rewardsModal.sign')}
                  </Text>
                  <ShimmerImage
                    w="14px"
                    h="14px"
                    src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                  />
                </Flex>
              </Flex>
            ) : null}
            <Flex
              h="64px"
              px="20px"
              alignItems="center"
              justifyContent="space-between"
              mb="16px"
              backgroundColor="#F7F7F7"
              rounded="8px"
              onClick={() => {
                router.push('/');
              }}
            >
              <Text
                fontSize="14px"
                color="#000"
                fontWeight="500"
                fontFamily="PingFangSC-Medium"
              >
                {t('rewardsModal.desc3')}
              </Text>
              <Flex alignItems="center">
                <Text color="#544AEC" fontSize="14px" mr="6px">
                  {t('rewardsModal.buy')}
                </Text>
                <ShimmerImage
                  w="14px"
                  h="14px"
                  src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                />
              </Flex>
            </Flex>
            <Flex
              h="64px"
              px="20px"
              alignItems="center"
              justifyContent="space-between"
              mb="16px"
              backgroundColor="#F7F7F7"
              rounded="8px"
              onClick={() => {
                router.push(`/user/${userData?.wallet_address}`);
              }}
            >
              <Text
                fontSize="14px"
                color="#000"
                fontWeight="500"
                w={'250px'}
                fontFamily="PingFangSC-Medium"
              >
                {t('rewardsModal.desc4')}
              </Text>
              <Flex alignItems="center">
                <Text color="#544AEC" fontSize="14px" mr="6px">
                  {t('rewardsModal.show')}
                </Text>
                <ShimmerImage
                  w="14px"
                  h="14px"
                  src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                />
              </Flex>
            </Flex>
            <Flex
              h="64px"
              px="20px"
              alignItems="center"
              justifyContent="space-between"
              mb="16px"
              backgroundColor="#F7F7F7"
              rounded="8px"
              onClick={() => {
                router.push(`/rewards`);
              }}
            >
              <Text
                fontSize="14px"
                color="#000"
                fontWeight="500"
                fontFamily="PingFangSC-Medium"
              >
                {t('rewardsModal.desc5')}
              </Text>
              <Flex alignItems="center">
                <Text color="#544AEC" fontSize="14px" mr="6px">
                  {t('rewardsModal.invite')}
                </Text>
                <ShimmerImage
                  w="14px"
                  h="14px"
                  src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                />
              </Flex>
            </Flex>

            {!(userData?.wallet_address && userData.login_email) && (
              <NextLink href="" passHref>
                <Link>
                  <Flex
                    h="64px"
                    px="20px"
                    alignItems="center"
                    justifyContent="space-between"
                    mb="16px"
                    backgroundColor="#F7F7F7"
                    rounded="8px"
                    onClick={() => {
                      // 未登录或者web2登陆未连接钱包出登陆弹窗
                      if (!userData?.wallet_address) {
                        return web2LoginModal?.current?.open();
                      }
                      // web3登陆未绑定邮箱跳转个人设置
                      if (userData?.wallet_address && !userData.login_email) {
                        return (window.location.href = `${
                          router?.locale && `/${router?.locale}`
                        }/account/setting`);
                      }
                    }}
                  >
                    <Text
                      fontSize="14px"
                      color="#000"
                      fontWeight="500"
                      fontFamily="PingFangSC-Medium"
                    >
                      {t('rewardsModal.desc6')}
                    </Text>
                    <Flex alignItems="center">
                      <Text color="#544AEC" fontSize="14px" mr="6px">
                        {t('rewardsModal.bind')}
                      </Text>
                      <ShimmerImage
                        w="14px"
                        h="14px"
                        src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                      />
                    </Flex>
                  </Flex>
                </Link>
              </NextLink>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  useEffect(() => {
    const date = new Date();
    // 获取签到状态
    const fetchSignStatus = async () => {
      const result = await getSignedInDate({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        source: 2,
      });
      updateSignStatus(result?.data?.today_sign_in_status);
    };

    fetchSignStatus();
  }, [userData?.wallet_address]);

  return !isLargerThan768 ? (
    <Box position="fixed" right="10%" bottom="15%" zIndex={10} onClick={onOpen}>
      <ShimmerImage w="82px" h="82px" src="/images/reward/dance.min.png" />
      <Text
        w="82px"
        h="23px"
        lineHeight="23px"
        textAlign="center"
        background="#544AEC"
        rounded="12px"
        color="#fff"
        fontSize="12px"
        mt="-20px"
        transform="translateZ(1px)"
      >
        {t('rewardsModal.title')}
      </Text>
      {renderModal()}
      <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
    </Box>
  ) : (
    <>
      <Popover
        trigger={'click'}
        placement="top-start"
        isOpen={isOpen}
        onClose={onClose}
        closeOnBlur={false}
        autoFocus={false}
      >
        <PopoverTrigger>
          <Box
            position="fixed"
            right="40px"
            bottom="40px"
            cursor="pointer"
            onClick={onOpen}
          >
            <ShimmerImage
              w="82px"
              h="82px"
              src="https://images.unemeta.com/console/dance.png"
            />
            <Text
              w="82px"
              h="23px"
              lineHeight="23px"
              textAlign="center"
              background="#544AEC"
              rounded="12px"
              color="#fff"
              fontSize="12px"
              mt="-20px"
              transform="translateZ(1px)"
            >
              {t('rewardsModal.title')}
            </Text>
          </Box>
        </PopoverTrigger>
        <PopoverContent
          w="27.77vw"
          rounded="22px"
          border={0}
          boxShadow="0px 4px 16px 0px rgba(0,0,0,0.12)"
          _focus={{
            outline: '0px',
            boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.12);',
          }}
        >
          <PopoverCloseButton top="22px" right="22px" />
          <PopoverBody pt="16px" px="32px">
            <ShimmerImage
              src="/images/reward/dance.min.png"
              w="80px"
              h="80px"
              m="auto"
            />
            <Text
              fontSize="20px"
              color="#000"
              fontFamily="PingFangSC-Medium"
              fontWeight="bold"
              textAlign="center"
              mt="6px"
              mb="15px"
            >
              {t('rewardsModal.desc')}
            </Text>
            {/* <Text
              color={'#544AEC'}
              fontSize={'14px'}
              bg="rgba(84,74,236,0.12)"
              m="auto"
              textAlign="center"
              borderRadius={'4px'}
              py={'5px'}
            >
              {t('rewardsModal.newplayer')}
            </Text> */}
            {/* <Text fontSize={'14px'} mb="16px" mt="12px">
              {t('rewardsModal.newcontent')}
            </Text> */}
            {!userData?.wallet_address ? (
              <Flex
                h="46px"
                px="20px"
                alignItems="center"
                justifyContent="space-between"
                mb="16px"
                backgroundColor="#F7F7F7"
                rounded="8px"
                cursor="pointer"
                onClick={() => {
                  openConnectModal?.();
                }}
              >
                <Text
                  fontSize="14px"
                  color="#000"
                  fontWeight="500"
                  fontFamily="PingFangSC-Medium"
                >
                  {t('rewardsModal.desc1')}
                </Text>
                <Flex alignItems="center">
                  <Text color="#544AEC" fontSize="14px" mr="6px">
                    {t('rewardsModal.login')}
                  </Text>
                  <ShimmerImage
                    w="14px"
                    h="14px"
                    src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                  />
                </Flex>
              </Flex>
            ) : null}
            {!isSign ? (
              <Flex
                h="46px"
                px="20px"
                alignItems="center"
                justifyContent="space-between"
                mb="16px"
                backgroundColor="#F7F7F7"
                rounded="8px"
                cursor="pointer"
                onClick={() => {
                  router.push(`/rewards`);
                }}
              >
                <Text
                  fontSize="14px"
                  color="#000"
                  fontWeight="500"
                  fontFamily="PingFangSC-Medium"
                >
                  {t('rewardsModal.desc2')}
                </Text>
                <Flex alignItems="center">
                  <Text color="#544AEC" fontSize="14px" mr="6px">
                    {t('rewardsModal.sign')}
                  </Text>
                  <ShimmerImage
                    w="14px"
                    h="14px"
                    src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                  />
                </Flex>
              </Flex>
            ) : null}
            <Flex
              h="46px"
              px="20px"
              alignItems="center"
              justifyContent="space-between"
              mb="16px"
              backgroundColor="#F7F7F7"
              rounded="8px"
              cursor="pointer"
              onClick={() => {
                router.push('/');
              }}
            >
              <Text
                fontSize="14px"
                color="#000"
                fontWeight="500"
                fontFamily="PingFangSC-Medium"
              >
                {t('rewardsModal.desc3')}
              </Text>
              <Flex alignItems="center">
                <Text color="#544AEC" fontSize="14px" mr="6px">
                  {t('rewardsModal.buy')}
                </Text>
                <ShimmerImage
                  w="14px"
                  h="14px"
                  src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                />
              </Flex>
            </Flex>
            <Flex
              minH="46px"
              px="20px"
              alignItems="center"
              justifyContent="space-between"
              mb="16px"
              backgroundColor="#F7F7F7"
              rounded="8px"
              cursor="pointer"
              onClick={() => {
                router.push(`/user/${userData?.wallet_address}`);
              }}
            >
              <Text
                fontSize="14px"
                color="#000"
                fontWeight="500"
                w={'220px'}
                fontFamily="PingFangSC-Medium"
              >
                {t('rewardsModal.desc4')}
              </Text>
              <Flex alignItems="center">
                <Text color="#544AEC" fontSize="14px" mr="6px">
                  {t('rewardsModal.show')}
                </Text>
                <ShimmerImage
                  w="14px"
                  h="14px"
                  src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                />
              </Flex>
            </Flex>
            <Flex
              h="46px"
              px="20px"
              alignItems="center"
              justifyContent="space-between"
              mb="16px"
              backgroundColor="#F7F7F7"
              rounded="8px"
              cursor="pointer"
              onClick={() => {
                console.log();
                if (router?.route?.includes('rewards') && getFun) {
                  return getFun();
                }
                router.push(`/rewards`);
              }}
            >
              <Text
                fontSize="14px"
                color="#000"
                fontWeight="500"
                fontFamily="PingFangSC-Medium"
              >
                {t('rewardsModal.desc5')}
              </Text>
              <Flex alignItems="center">
                <Text color="#544AEC" fontSize="14px" mr="6px">
                  {t('rewardsModal.invite')}
                </Text>
                <ShimmerImage
                  w="14px"
                  h="14px"
                  src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                />
              </Flex>
            </Flex>

            {!(userData?.wallet_address && userData.login_email) && (
              <NextLink href="" passHref>
                <Link>
                  <Flex
                    h="46px"
                    px="20px"
                    alignItems="center"
                    justifyContent="space-between"
                    mb="16px"
                    backgroundColor="#F7F7F7"
                    rounded="8px"
                    cursor="pointer"
                    onClick={() => {
                      // 未登录或者web2登陆未连接钱包出登陆弹窗
                      if (!userData?.wallet_address) {
                        return web2LoginModal?.current?.open();
                      }
                      // web3登陆未绑定邮箱跳转个人设置
                      if (userData?.wallet_address && !userData.login_email) {
                        return (window.location.href = `${
                          router?.locale && `/${router?.locale}`
                        }/account/setting`);
                      }
                    }}
                  >
                    <Text
                      fontSize="14px"
                      color="#000"
                      fontWeight="500"
                      fontFamily="PingFangSC-Medium"
                    >
                      {t('rewardsModal.desc6')}
                    </Text>
                    <Flex alignItems="center">
                      <Text color="#544AEC" fontSize="14px" mr="6px">
                        {t('rewardsModal.bind')}
                      </Text>
                      <ShimmerImage
                        w="14px"
                        h="14px"
                        src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
                      />
                    </Flex>
                  </Flex>
                </Link>
              </NextLink>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
    </>
  );
});
