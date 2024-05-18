// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useAccount, useDisconnect, useProvider, useNetwork } from 'wagmi';
import * as globalApis from '@/services/global';
import {
  useFetchAuth,
  useFetchUser,
  useUserAuth,
  useUserData,
  useUuInfo,
} from '@/store';
import NextLink from 'next/link';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { Avatar } from '@/components/NftAvatar';
import { getuuInfo } from '@/services/points';
import {
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  HStack,
  Text,
  Flex,
  CloseButton,
  Box,
  Button,
  Icon,
  ModalFooter,
  VStack,
  useToast,
  keyframes,
  LinkProps,
  useMediaQuery,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import Image, { ShimmerImage } from '@/components/Image';
import { shortAddress } from '@/utils';
import { HiOutlineLogout } from 'react-icons/hi';
import { floor, toLower } from 'lodash';
import useSignHelper from '@/hooks/helper/useSignHelper';

import {
  jwtHelper,
  JWT_HEADER_KEY,
  WALLET_ADDRESS_KEY,
  EMAIL_KEY,
} from '@/utils/jwt';
import { useCookieState } from 'ahooks';
import { useCalender } from '@/hooks/useCalender';
import { CgArrowsExchange } from 'react-icons/cg';
import { useMounted } from '@/hooks/useMounted';
import { useUserWalletBalance } from '@/hooks/useUserWalletBalance';
import {
  SwapWethAndEthModal,
  SwapWethAndEthModalAction,
} from '@/features/AssetPage';
import {
  NavWallectIcon,
  NavWallectIconfff,
  SellIcon,
  SettingIcon,
  WallectIcon,
  ProjectIcon,
  CheckInIcon,
} from './Icons';
import { EditIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as SIDJS from '@siddomains/sidjs';
import { bsc as bscMain, bscTestnet } from 'wagmi/chains';
import { isProd } from '@/utils';
// import { CheckInModal } from '../CheckInModal';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { CheckInModal } from '../CheckInModal';
import { VipModal } from '../VipModal';
import {
  Web2LoginModal,
  BindWeb3WalletModal,
  BindWeb3WalletFailModal,
} from '../Web2Login';
// eslint-disable-next-line no-restricted-imports
import { useMint } from '@/features/Activity/Aki/useMint';

const { default: SID, getSidAddress } = SIDJS;
const bsc = isProd ? bscMain : bscTestnet;
const defaultAvatar =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA29JREFUeF7tnctpXUEUBOfhCLR1CsI4AoFWTsKJKAQn4r3BeyNQBMJhaGEnIKQgalG0Xml/Zlp96vZ8uNx3+XX77e2Av/vHB1B9zuP9D1S/Xmz7dwkAF6EAKAEQgTRBSwBkPy8uAUoARFEJgOzzi0uAEgBRWAIg+/ziEqAEQBSWAMg+v7gEKAEQhSUAss8vLgFKAERhCYDs84tLgBIAUVgCIPv8Yj0Bfn9+Qe8D3D3/VV2kTwAVTxtI53/6+gUNcQkA5N8JgBKAEQSrSwB5E1kClADwGWblJUAJgAhqE4jsO20COway1+Ihf6cloCUAMdQSgOxrCTgtAS0B8Bli5V0FdxXMCILVXQR1EQQRYuWdAjoFIII6BSD7PsAp4P/LH/Q+gL0J+/TvJ2whK3+9+c4GgNV0D3IJANaBAJDX4BKA3UOUACwATglQAkCEWHl7gDaBiKCWAGTfaQnoGNgxED5DrLxTQKcARhCs7hTQKQAixMo7BXQKQAR1CkD2dQrQP/bcJrBNIHyGWXmbwDaBjCBYjTeB9HPxUP+hEW4/gev68dfCA4C9kGIDHACQ4BLgyg0MgABADrQEwJs828ASAPF/OgXIbxW3CbxygAMgANgPR0L/WgJaArYvUtoEwghYN3Bdf3uAKwc4AAKgTSBhoCWAuHe6CLJvMuc/EAH5my+/+k/EzHcQ/gMBAA1cLw+A9Q5C/QEADVwvD4D1DkL9AQANXC8PgPUOQv0BAA1cLw+A9Q5C/QEADVwvD4D1DkL9AQANXC8PgPUOQv0BAA1cLw+A9Q5C/RiA9c/FQ//my/EHIgJgm4EA2O4fVh8A2MLtAQJgu39YfQBgC7cHCIDt/mH1AYAt3B4gALb7h9UHALZwe4AA2O4fVh8A2MLtAQJgu39YfQBgC7cHCIDt/mH1AYAt3B4AA0B/L4AK2LbfV09/uBN/IygAXAgCwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAIoAO9pKJKOnE328gAAAABJRU5ErkJggg==';

type ResgisterModalAction = {
  open: () => void;
  close?: () => void;
};
// 注册modal
const ResgisterModal = forwardRef<ResgisterModalAction>((_, ref) => {
  const t = useTranslations('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, connector } = useAccount();
  const { sign } = useSignHelper();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { fetchUser } = useFetchUser();
  const router = useRouter();

  const onRegisger = async () => {
    const wallets = (connector as any)?._wallets || null;
    try {
      setLoading(true);
      // 注册已删除
      // const signData = await sign();
      // await globalApis.resgister({
      //   wallet_address: address!,
      //   signData,
      //   // is_luck: connector?.id === 'okxWallet' ? 12 : undefined,
      //   okx: wallets[0]?.id === 'okx' ? true : undefined,
      //   metamask: wallets[0]?.id === 'metaMask' ? true : undefined,
      //   bitget: wallets[0]?.id === 'bitget' ? true : undefined,
      //   coinbase: wallets[0]?.id === 'coinbase' ? true : undefined,
      //   wallet_connect:
      //     wallets[0]?.id === 'okx' ||
      //     wallets[0]?.id === 'metaMask' ||
      //     wallets[0]?.id === 'bitget' ||
      //     wallets[0]?.id === 'coinbase'
      //       ? undefined
      //       : true,
      // });
      // 注册完成后登录获取token
      const signLoginData = await sign(1);
      await globalApis
        .login({
          wallet_address: address!,
          signData: signLoginData,
          okx: wallets[0]?.id === 'okx' ? true : undefined,
          metamask: wallets[0]?.id === 'metaMask' ? true : undefined,
          bitget: wallets[0]?.id === 'bitget' ? true : undefined,
          coinbase: wallets[0]?.id === 'coinbase' ? true : undefined,
          wallet_connect:
            wallets[0]?.id === 'okx' ||
            wallets[0]?.id === 'metaMask' ||
            wallets[0]?.id === 'bitget' ||
            wallets[0]?.id === 'coinbase'
              ? undefined
              : true,
        })
        .then(({ data }) => {
          jwtHelper.setWalletAddress(address!, {
            expires: new Date(+data.accessExpire * 1000),
          });
          jwtHelper.setToken(data.accessToken, {
            expires: new Date(+data.accessExpire * 1000),
          });
        });
      await fetchUser();
      onClose();
      if (router.route === '/login') {
        const oldRoute = window.sessionStorage.getItem('oldRoute');
        if (oldRoute) {
          router.replace(oldRoute);
        } else {
          router.replace(`/user/${address}`);
        }
      }
    } catch (error) {
      // 注册的时候拒绝签名
      toast({ status: 'error', title: error.message, variant: 'subtle' });
      window?.location?.reload();
    }
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
    },
  }));

  return (
    <Modal size={{ base: 'full', md: 'lg' }} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent shadow="none" rounded="2xl" px={5} py={3}>
        <ModalHeader textAlign={'center'} fontSize={'2xl'}>
          {t('welcomeTo')} UneMeta
        </ModalHeader>
        <ModalBody p={5}>
          <VStack spacing={10}>
            <Image
              src="/logo_t.png"
              w={'120px'}
              h="120px"
              objectFit={'contain'}
            />
            <Text fontWeight={'bold'} textAlign={'center'}>
              {t('registerDesc')}
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter display={'flex'} justifyContent="center">
          <Button
            onClick={() => {
              onClose();
              window?.location?.reload();
            }}
            mr="4"
            size="xl"
            rounded="lg"
          >
            {t('cancel')}
          </Button>
          <Button
            autoFocus
            isLoading={loading}
            onClick={onRegisger}
            size="xl"
            rounded="lg"
            variant={'primary'}
          >
            {t('accept')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

const hue = keyframes`
  0%{filter:hue-rotate(0deg);}
  100%{filter:hue-rotate(-1turn);
`;

/**
 * 钱包按钮
 */
const WalletButton = ({ isLoading }: { isLoading: boolean }) => {
  const web2LoginModal = useRef<ResgisterModalAction>(null);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const router = useRouter();
  return (
    <>
      <ConnectButton.Custom>
        {() =>
          // 此处页面改版之后需要区分PC端和移动端
          isLargerThan768 ? (
            <Button
              borderRadius="12px"
              fontSize="14px"
              leftIcon={
                <ShimmerImage
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAAMFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaPxwLAAAAD3RSTlMAnyDvv0CwEN+QYIB/X1BG+JRoAAAAd0lEQVQoz2OgCWBy/o8CvikABZX/owEjoGA+uuAXoOB/dPAZm+D/gRH87CgIBiiC2+FeRwj+YsAiKMA0MQBDMEDj/1cMQYb3/z9iCq7//w1TewVEO2GL/mJz0v/jCEFMbw54yNtjE/RHF/uGK4ExoaUwEwUGWgAAuoveKGlGscIAAAAASUVORK5CYII="
                  w="20px"
                  h="20px"
                />
              }
              variant="solid"
              backgroundColor="#FB9D42"
              isLoading={isLoading}
              onClick={() => {
                web2LoginModal?.current?.open();
              }}
            >
              Connect Wallet
            </Button>
          ) : (
            <IconButton
              className="Tn013"
              rounded="full"
              onClick={() => {
                web2LoginModal?.current?.open();
              }}
              bg={{
                base: 'transparent',
                md: 'conic-gradient(from 90deg at 50% 51.52%, #4589FF 0deg, #FF7EB6 141.23deg, #F1C21B 231.23deg, #49CD7A 287.48deg, #4589FF 360deg)',
              }}
              _hover={{
                opacity: 0.7,
              }}
              transition="all ease 0.3s"
              backgroundSize={{ base: 'auto', md: '350%' }}
              color={{ base: 'rgba(255, 255, 255, 0.8)', md: 'white' }}
              // color="rgba(255, 255, 255, 0.8)"
              animation={{ base: 'none', md: `${hue} 6s infinite alternate` }}
              aria-label=""
              isLoading={isLoading}
              icon={
                router?.pathname !== '/UneFieldLandingPage' ? (
                  <NavWallectIcon fontSize={20} />
                ) : (
                  <NavWallectIconfff fontSize={20} />
                )
              }
            />
          )
        }
      </ConnectButton.Custom>
      <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
    </>
  );
};

const WalletCard = () => {
  const isMounted = useMounted();
  const swapModalRef = useRef<SwapWethAndEthModalAction>(null);
  const {
    VisitChainLogo,
    localCurrency,
    localCurrencyAmount,
    wrapperCurrency,
    wrapperCurrencyAmount,
    stableCurrency,
    statbleCurrencyAmount,
  } = useUserWalletBalance();
  const t = useTranslations('common');
  if (!isMounted) return null;
  return (
    <Box
      border="1px solid"
      borderColor="primary.gray"
      rounded="xl"
      p={3}
      color={'rgba(255, 255, 255, 0.8)'}
    >
      <Flex
        pb={3}
        borderBottom={'1px solid'}
        borderColor="primary.gray"
        align={'center'}
        justify={'space-between'}
      >
        <Text as="strong">{t('wallet')}</Text>
        <Link
          color="accent.blue"
          display={'inline-flex'}
          alignItems="center"
          fontSize={'sm'}
          className="Sb005"
          onClick={() => swapModalRef.current?.open()}
        >
          {/* <Icon as={CgArrowsExchange} fontSize={20} /> {t('swap')}{' '} */}
          {/* {localCurrency.data?.symbol}/{wrapperCurrency.data?.symbol} */}
          {localCurrency.data?.symbol}
        </Link>
      </Flex>

      <VStack py={3} w="full" spacing={3}>
        <Flex w="full" align={'center'} justify="space-between">
          <HStack align={'center'}>
            <VisitChainLogo.Local fontSize={28} />{' '}
            <Text>{localCurrency.data?.symbol}</Text>
          </HStack>
          <Text as="strong">
            {/* 此处显示代币余额 */}
            {floor(localCurrencyAmount + wrapperCurrencyAmount, 4)}
          </Text>
        </Flex>
        {/* <Flex w="full" align={'center'} justify="space-between">
          <HStack align={'center'}>
            <VisitChainLogo.Wrapper fontSize={28} />
            <Text>{wrapperCurrency.data?.symbol}</Text>
          </HStack>
          <Text as="strong">{floor(wrapperCurrencyAmount, 4)}</Text>
        </Flex> */}
        <Flex w="full" align={'center'} justify="space-between">
          <HStack align={'center'}>
            <VisitChainLogo.Stable fontSize={28} />
            <Text>{stableCurrency.data?.symbol}</Text>
          </HStack>
          <Text as="strong">{floor(statbleCurrencyAmount, 4)}</Text>
        </Flex>
      </VStack>

      <SwapWethAndEthModal ref={swapModalRef} />
    </Box>
  );
};

const MobileProfileButton = ({
  loading,
  userData,
  links,
  disconnect,
  clearLoginData,
}: {
  loading: boolean;
  userData: globalApis.ApiGlobal.getUserInfo;
  links: {
    href?: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  }[];
  disconnect: () => void;
  clearLoginData: () => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('common');
  const [userAuth] = useUserAuth();
  const vipModalRef = useRef<ResgisterModalAction>(null);
  const { chain: currentChain } = useNetwork();
  const provider = useProvider();
  const { address, connector } = useAccount();
  const { isAkiHolder } = useMint();
  const wallets = (connector as any)?._wallets || null;
  const router = useRouter();
  useEffect(() => {
    if (wallets && wallets[0]?.id === 'bitget') {
      vipModalRef.current?.open();
      return;
    }
    if (userAuth?.auth_list) {
      const authList = userAuth?.auth_list;
      const authItem = authList?.filter(
        (item) => item.types === globalApis.AUTH_TYPE.VIP3,
      )[0];
      if (authItem?.is_auth) {
        // VIP弹窗和spaceID弹窗互斥
        if (currentChain?.id !== bsc.id) {
          vipModalRef.current?.open();
        } else {
          const sid = new SID({
            provider,
            sidAddress: getSidAddress(currentChain.id),
          });
          sid.getName(address).then((res: any) => {
            if (!res.name) {
              vipModalRef.current?.open();
            }
          });
        }
        isAkiHolder().then((akiNunmer) => {
          console.log(akiNunmer, 'akiNunmer');
          if (akiNunmer > 0) {
            console.log('akiholder');
          }
        });
      }
    }
  }, [userAuth]);

  // 退出登陆，除了调用钱包的disconnect还需要清除cookie中的email信息
  const handleLogout = () => {
    // 如果没有连接钱包说明是web2登陆，手动清除cookie
    if (!address) {
      clearLoginData();
    }
    // web3登陆直接调用disconnect
    else {
      disconnect();
    }
  };

  return (
    <>
      <VipModal ref={vipModalRef}>
        <Box px={{ base: 1, md: 0 }}>
          <IconButton
            className="Tn014"
            onClick={onOpen}
            isLoading={loading}
            bg="none"
            _hover={{
              bg: 'none',
              opacity: 0.5,
            }}
            aria-label=""
            icon={
              // <ShimmerImage
              //   className={
              //     userData.is_nft_avatar ? 'avatar-mask-hexagon' : undefined
              //   }
              //   rounded={!userData.is_nft_avatar ? 'full' : undefined}
              //   placeholder="blur"
              //   src={userData?.profile_image || defaultAvatar}
              //   width="40px"
              //   height="40px"
              //   objectFit={'cover'}
              // />
              <Avatar
                url={userData?.profile_image || defaultAvatar}
                {...{
                  placeholder: 'blur',
                  w: '40px',
                  h: '40px',
                  p: '8px',
                  objectFit: 'cover',
                }}
                notconfig={{ p: '0' }}
              />
            }
          />
        </Box>
      </VipModal>
      <Drawer
        closeOnEsc
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        isFullHeight
      >
        <DrawerOverlay bg="blackAlpha.300" backdropFilter="blur(20px)" />
        <DrawerContent
          maxW={{ base: 'full', md: '375px' }}
          fontFamily={'Urbanist'}
          bg={'#2B2B2B'}
        >
          <DrawerHeader>
            <Flex justifyContent={'flex-end'}>
              <CloseButton
                className="Sb008"
                onClick={onClose}
                color={'rgba(255, 255, 255, 0.8)'}
              />
            </Flex>
          </DrawerHeader>
          <DrawerBody p={0}>
            <Flex p={5} align={'center'} justify="space-between">
              <HStack spacing={4}>
                <IconButton
                  bg="none"
                  aria-label=""
                  icon={
                    <Avatar
                      url={userData?.profile_image || defaultAvatar}
                      {...{
                        placeholder: 'blur',
                        w: '40px',
                        h: '40px',
                        p: '8px',
                        objectFit: 'cover',
                      }}
                      notconfig={{ p: '0' }}
                    />
                  }
                  // icon={
                  //   <ShimmerImage
                  //     className={
                  //       userData.is_nft_avatar
                  //         ? 'avatar-mask-hexagon'
                  //         : undefined
                  //     }
                  //     placeholder="blur"
                  //     src={userData?.profile_image || defaultAvatar}
                  //     rounded={!userData.is_nft_avatar ? 'full' : undefined}
                  //     width="40px"
                  //     height="40px"
                  //     objectFit={'cover'}
                  //   />
                  // }
                />

                <Text
                  fontSize={'xl'}
                  fontWeight="bold"
                  color={'rgba(255, 255, 255, 0.8)'}
                >
                  {userData.username || shortAddress(userData.wallet_address)}
                </Text>
              </HStack>
            </Flex>
            <Box color="rgba(255, 255, 255, 0.8)">
              {links.map((item) => {
                const content = (
                  <Link
                    key={item.label}
                    role={'group'}
                    display={'flex'}
                    px={5}
                    py={3}
                    rounded={'md'}
                    fontWeight={500}
                    onClick={item.onClick ? item.onClick : onClose}
                    transition={'all .3s ease'}
                    _hover={{
                      bg: 'gray.50',
                      color: 'primary.main',
                    }}
                  >
                    {item.icon} <Text ml={2}>{item.label}</Text>
                  </Link>
                );
                if (!item.label) {
                  return null;
                }
                return item.href ? (
                  <NextLink key={item.label} href={item.href!} passHref>
                    {content}
                  </NextLink>
                ) : (
                  content
                );
              })}
            </Box>
            <Box p={5}>
              <WalletCard />
            </Box>
            <Box p={5}>
              {/* More features */}
              <Flex direction="column" mt="0" fontSize="14px">
                <Text color="rgba(255, 255, 255, 0.40)">More Features</Text>
                <Flex direction="row" color="#1D2129" mt="16px">
                  <Link
                    display="flex"
                    flexDirection="column"
                    flex="1"
                    borderRadius="12px"
                    backgroundColor="rgba(255, 255, 255, 0.10)"
                    h="66px"
                    justifyContent="center"
                    alignItems="center"
                    href={`/${router.locale}/stake`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 1.5C0 0.671572 0.671573 0 1.5 0H9.5C10.3284 0 11 0.671573 11 1.5V5.5C11 5.77614 10.7761 6 10.5 6C10.2239 6 10 5.77614 10 5.5V1.5C10 1.22386 9.77614 1 9.5 1H1.5C1.22386 1 1 1.22386 1 1.5V12.5C1 12.7761 1.22386 13 1.5 13H6.75C7.02614 13 7.25 13.2239 7.25 13.5C7.25 13.7761 7.02614 14 6.75 14H1.5C0.671573 14 0 13.3284 0 12.5V1.5ZM2 3.5C2 3.22386 2.22386 3 2.5 3H8.5C8.77614 3 9 3.22386 9 3.5C9 3.77614 8.77614 4 8.5 4H2.5C2.22386 4 2 3.77614 2 3.5ZM2.5 6.5C2.22386 6.5 2 6.72386 2 7C2 7.27614 2.22386 7.5 2.5 7.5H8.5C8.77614 7.5 9 7.27614 9 7C9 6.72386 8.77614 6.5 8.5 6.5H2.5ZM2 10.5C2 10.2239 2.22386 10 2.5 10H6.5C6.77614 10 7 10.2239 7 10.5C7 10.7761 6.77614 11 6.5 11H2.5C2.22386 11 2 10.7761 2 10.5ZM11 8C10.3907 8 10 8.42682 10 8.83334V9H12V8.83334C12 8.42682 11.6093 8 11 8ZM9 8.83334V9.08536C8.41742 9.29126 8 9.84689 8 10.5V12.5C8 13.3284 8.67157 14 9.5 14H12.5C13.3284 14 14 13.3284 14 12.5V10.5C14 9.84689 13.5826 9.29126 13 9.08536V8.83334C13 7.76706 12.0476 7 11 7C9.95239 7 9 7.76709 9 8.83334ZM9.5 10C9.22388 10 9 10.2238 9 10.5V12.5C9 12.7762 9.22388 13 9.5 13H12.5C12.7761 13 13 12.7762 13 12.5V10.5C13 10.2238 12.7761 10 12.5 10H9.5Z"
                        fill="white"
                        fillOpacity="0.8"
                      />
                    </svg>
                    <Text mt="4px" color={'rgba(255, 255, 255, 0.80)'}>
                      {t('header.nav.rewards.staking')}
                    </Text>
                  </Link>
                  <Link
                    display="flex"
                    ml="10px"
                    flexDirection="column"
                    flex="1"
                    borderRadius="12px"
                    backgroundColor="rgba(255, 255, 255, 0.10)"
                    h="66px"
                    justifyContent="center"
                    alignItems="center"
                    href={`/${router.locale}/launchpad`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="14"
                      viewBox="0 0 12 14"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 2.5C0 1.11929 1.11929 0 2.5 0H9.5C10.8807 0 12 1.11929 12 2.5V8.5C12 9.88071 10.8807 11 9.5 11H2.5C1.11929 11 0 9.88071 0 8.5V2.5ZM2.5 1C1.67157 1 1 1.67157 1 2.5V8.5C1 9.32843 1.67157 10 2.5 10H9.5C10.3284 10 11 9.32843 11 8.5V2.5C11 1.67157 10.3284 1 9.5 1H2.5ZM0 13.5C0 13.2239 0.223858 13 0.5 13H11.5C11.7761 13 12 13.2239 12 13.5C12 13.7761 11.7761 14 11.5 14H0.5C0.223858 14 0 13.7761 0 13.5ZM3.5 3C3.22386 3 3 3.22386 3 3.5C3 3.77614 3.22386 4 3.5 4H8.5C8.77614 4 9 3.77614 9 3.5C9 3.22386 8.77614 3 8.5 3H3.5ZM3 5.5C3 5.22386 3.22386 5 3.5 5H8.5C8.77614 5 9 5.22386 9 5.5C9 5.77614 8.77614 6 8.5 6H3.5C3.22386 6 3 5.77614 3 5.5ZM3.5 7C3.22386 7 3 7.22386 3 7.5C3 7.77614 3.22386 8 3.5 8H6.5C6.77614 8 7 7.77614 7 7.5C7 7.22386 6.77614 7 6.5 7H3.5Z"
                        fill="white"
                        fillOpacity="0.8"
                      />
                    </svg>
                    <Text mt="4px" color={'rgba(255, 255, 255, 0.80)'}>
                      {t('header.nav.launchpad.title')}
                    </Text>
                  </Link>
                </Flex>

                <Flex direction="row" color="#1D2129" mt="10px">
                  <Link
                    display="flex"
                    flexDirection="column"
                    flex="1"
                    borderRadius="12px"
                    backgroundColor="rgba(255, 255, 255, 0.10)"
                    h="66px"
                    justifyContent="center"
                    alignItems="center"
                    href={`/${router.locale}/explore`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1 7C1 3.85467 3.42023 1.27461 6.5 1.02054V3.03095C4.52684 3.277 3 4.96019 3 7C3 9.20914 4.79086 11 7 11C9.20914 11 11 9.20914 11 7C11 6.72386 10.7761 6.5 10.5 6.5C10.2239 6.5 10 6.72386 10 7C10 8.65685 8.65685 10 7 10C5.34315 10 4 8.65685 4 7C4 5.5135 5.08114 4.27952 6.5 4.04148V5.58535C5.9174 5.79127 5.5 6.34689 5.5 7C5.5 7.82843 6.17157 8.5 7 8.5C7.82843 8.5 8.5 7.82843 8.5 7C8.5 6.34689 8.0826 5.79127 7.5 5.58535V3.50049C7.5 3.50033 7.5 3.50016 7.5 3.5C7.5 3.49984 7.5 3.49967 7.5 3.49951V0.5C7.5 0.223858 7.27614 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 6.72386 13.7761 6.5 13.5 6.5C13.2239 6.5 13 6.72386 13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7Z"
                        fill="white"
                        fillOpacity="0.8"
                      />
                    </svg>
                    <Text mt="4px" color={'rgba(255, 255, 255, 0.80)'}>
                      {t('header.nav.explore')}
                    </Text>
                  </Link>
                  <Link
                    display="flex"
                    ml="10px"
                    flexDirection="column"
                    flex="1"
                    borderRadius="12px"
                    backgroundColor="rgba(255, 255, 255, 0.10)"
                    h="66px"
                    justifyContent="center"
                    alignItems="center"
                    href={`/${router.locale}/agent`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.51883 1.26349C5.99166 1.1418 6.48786 1.07692 7 1.07692H7.53846V0H7C6.39655 0 5.81019 0.0764831 5.2504 0.220562C2.23137 0.997607 0 3.73754 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7V6.46154H12.9231V7C12.9231 10.2712 10.2712 12.9231 7 12.9231C3.72878 12.9231 1.07692 10.2712 1.07692 7C1.07692 4.24082 2.96405 1.92105 5.51883 1.26349ZM12.9 5H9.00005L9.00001 1.10002C10.9591 1.49771 12.5023 3.04087 12.9 5ZM14 6H8.00006L8 0C8.34071 0 8.67479 0.0283988 9 0.0829586C11.5125 0.504477 13.4955 2.4875 13.917 5C13.9716 5.32521 14 5.65929 14 6Z"
                        fill="white"
                        fillOpacity="0.8"
                      />
                    </svg>
                    <Text mt="4px" color={'rgba(255, 255, 255, 0.80)'}>
                      {t('header.nav.rewards.commission')}
                    </Text>
                  </Link>
                </Flex>
              </Flex>
            </Box>
            <Box p={5}>
              <Button
                onClick={handleLogout}
                size="lg"
                w="full"
                bg={'transparent'}
                color={'rgba(255, 255, 255, 0.80)'}
                rounded="xl"
                _hover={'none'}
                border={'1px solid rgba(255, 255, 255, 0.10)'}
                rightIcon={<Icon as={HiOutlineLogout} fontSize={22} />}
              >
                {t('logout')}
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

type DrawerLinkItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  linkProps?: LinkProps;
  onClick?: () => void;
};

const Profile = () => {
  const isMounted = useMounted();
  const resgisterModalRef = useRef<ResgisterModalAction>(null);
  // const checkInModalRef = useRef<ResgisterModalAction>(null);
  const checkInModalRef = useRef<ResgisterModalAction>(null);
  const bindWeb3WalletModal = useRef<ResgisterModalAction>(null);
  const bindWeb3WalletFailModal = useRef<ResgisterModalAction>(null);
  const t = useTranslations('common');
  const [cookieToken, setCookieToken] = useCookieState(JWT_HEADER_KEY);
  const [loginWallectAddr, setLoginWallectAddr] =
    useCookieState(WALLET_ADDRESS_KEY);
  const [loginEmail, setLoginEmail] = useCookieState(EMAIL_KEY);
  const router = useRouter();
  const [userData, setUserData] = useUserData();
  const [loading, setLoading] = useState(false);
  const [checkAuth, setCheckAuth] = useState(false);
  const toast = useToast();
  const { disconnect } = useDisconnect();
  const {
    fetchUser,
    loading: fetchUserLoading,
    err: fetchUserErr,
  } = useFetchUser();
  const { dateInfo } = useCalender(2);

  const { fetchAuth } = useFetchAuth();
  const [uuInfo, setUuInfo] = useUuInfo();
  const { sign } = useSignHelper();
  const { connector } = useAccount();
  const wallets = (connector as any)?._wallets || null;

  // 清除登陆数据
  const clearLoginData = (showToast = true) => {
    setCookieToken('', {
      expires: -1,
    });
    setLoginWallectAddr('', {
      expires: -1,
    });
    setLoginEmail('', {
      expires: -1,
    });
    setUserData({} as globalApis.ApiGlobal.getUserInfo);
    showToast &&
      toast({
        status: 'success',
        title: 'You have been logged out successfully.',
        variant: 'subtle',
      });
  };

  const { address: accountAddress } = useAccount({
    onDisconnect: async () => {
      clearLoginData();
    },
  });

  async function login() {
    if (!accountAddress) return;
    try {
      setLoading(true);
      // 尝试登录
      const signData = await sign(1);
      const { data: loginRes } = await globalApis.login({
        wallet_address: accountAddress as string,
        signData: signData,
        okx: wallets[0]?.id === 'okx' ? true : undefined,
        metamask: wallets[0]?.id === 'metaMask' ? true : undefined,
        bitget: wallets[0]?.id === 'bitget' ? true : undefined,
        coinbase: wallets[0]?.id === 'coinbase' ? true : undefined,
        wallet_connect:
          wallets[0]?.id === 'okx' ||
          wallets[0]?.id === 'metaMask' ||
          wallets[0]?.id === 'bitget' ||
          wallets[0]?.id === 'coinbase'
            ? undefined
            : true,
      });
      const expires = new Date(+loginRes.accessExpire * 1000);
      setLoginWallectAddr(accountAddress, {
        expires,
      });
      setCookieToken(loginRes.accessToken, {
        expires,
      });
      setCheckAuth(true);
      if (router.route === '/login') {
        const oldRoute = window.sessionStorage.getItem('oldRoute');
        if (oldRoute) {
          router.replace(oldRoute);
        } else {
          router.replace(`/user/${accountAddress}`);
        }
      }
    } catch (error) {
      // 需要注册
      if (error.code === 200001) {
        resgisterModalRef.current?.open();
        return; // 退出登录逻辑 由注册流程接管
      }
      toast({ status: 'error', title: error.message, variant: 'subtle' });
      // clearLoginData(false); // 清空登录状态防止刷新页面后自动登录
      disconnect();
    } finally {
      setLoading(false);
      const referrer = router.query.referrer as string;
      if (referrer) {
        router.replace(referrer);
        return;
      }
    }
  }

  // 登录后校验用户权限
  useEffect(() => {
    if (checkAuth) {
      fetchAuth();
    }
  }, [checkAuth]);

  // 同步用户信息
  useEffect(() => {
    if (fetchUserLoading || fetchUserErr) return;
    // 如果登陆了web2钱包，且没有绑定web3钱包，那么在登陆了web3钱包之后将web2和web3钱包绑定起来
    if (userData?.login_email && !userData?.wallet_address && accountAddress) {
      bindWeb3WalletModal?.current?.open();
      return;
    }
    // 当使用web2钱包登陆之后，登陆了新的web3钱包，需要把web2钱包的登陆状态清除
    if (
      accountAddress &&
      userData?.login_email &&
      toLower(userData?.wallet_address) !== toLower(accountAddress)
    ) {
      clearLoginData(false);
    }
    if (
      // 当userData中已经有wallet_address数据并且和accountAddress相同就不用再同步了
      (userData?.wallet_address &&
        toLower(userData?.wallet_address) === toLower(accountAddress)) ||
      // 当userData中有email信息说明已经是web2登陆，也不用再同步了
      userData?.login_email
    ) {
      return;
    }
    // 没有token, 走登录流程
    if (!cookieToken && accountAddress) {
      login();
    }
    // 存在token
    if (cookieToken) {
      if (
        // 当前钱包地址对应一一对应, 获取用户信息, 否则登录
        (loginWallectAddr &&
          toLower(loginWallectAddr) === toLower(accountAddress)) ||
        // 当存在web2的email登陆时也直接获取用户信息
        loginEmail
      ) {
        fetchUser();
      } else {
        login();
      }
    }
  }, [
    cookieToken,
    loginWallectAddr,
    loginEmail,
    userData,
    fetchUserLoading,
    fetchUserErr,
    accountAddress,
  ]);

  useEffect(() => {
    getuuInfo({ location: 1 }).then(({ data }) => {
      setUuInfo({ ...uuInfo, ...data });
    });
  }, [userData?.wallet_address, userData?.login_email]);

  if (!isMounted) return <IconButton aria-label="" bg="none" isLoading />;
  const links: DrawerLinkItem[] = [
    (loginWallectAddr && {
      label: t('header.profile.menus.myItems'),
      href: userData?.wallet_address
        ? `/user/${userData?.wallet_address}`
        : '/login',
      icon: <WallectIcon fontSize={22} />,
      linkProps: {
        className: 'Sb001',
      },
    }) ||
      ({} as DrawerLinkItem),
    // {
    //   label: t('header.profile.menus.myProjects'),
    //   href: userData?.wallet_address
    //     ? `/user/${userData?.wallet_address}?tab=1`
    //     : '/login',
    //   icon: <ProjectIcon fontSize={22} />,
    //   linkProps: {
    //     className: 'Sb001',
    //   },
    // },
    {
      label: t('header.profile.menus.bulkList'),
      href: userData?.wallet_address
        ? `/user/${userData?.wallet_address}?bulkList=true`
        : '/login',
      icon: <SellIcon fontSize={22} />,
      linkProps: {
        className: 'Sb002',
      },
    },
    {
      label: t('header.profile.menus.invitationCode'),
      href: userData?.wallet_address
        ? `/rewards?invitationCode=${(Math.random() * 100).toFixed(1)}`
        : '/login',
      icon: <EditIcon fontSize={22} />,
    },
    {
      label: t('checkIn'),
      icon: <CheckInIcon fontSize={22} />,
      // href: '/rewards',
      // onClick: () => checkInModalRef.current?.open(),
      onClick: () => {
        // 登陆了邮箱但是没登陆web3钱包直接出rainow的钱包登陆插件
        if (userData?.login_email && !accountAddress) {
          openConnectModal && openConnectModal();
          return;
        }

        if (dateInfo?.today_sign_in_status) {
          router.push('/rewards');
        } else {
          checkInModalRef.current?.open();
          setTimeout(() => {
            router.push('/rewards');
          }, 3000);
        }
      },
    },
    {
      label: t('header.profile.menus.settings'),
      href: '/account/setting',
      icon: <SettingIcon fontSize={22} />,
      linkProps: {
        className: 'Sb003',
      },
    },
  ];

  // 绑定web3钱包
  const handleBindWeb3Wallet = () => {
    globalApis
      .loginBindEmail({
        wallet_address: accountAddress || '',
      })
      .then(async ({ data }) => {
        jwtHelper.setToken(data.accessToken, {
          expires: new Date(+data.accessExpire * 1000),
        });
        await fetchUser();
        toast({
          status: 'success',
          title: t('header.web2Login.bindSuccess'),
          variant: 'subtle',
        });
        bindWeb3WalletModal?.current?.close &&
          bindWeb3WalletModal?.current?.close();
      })
      .catch(async (e) => {
        if (e.code === 200022) {
          toast({
            status: 'error',
            title: t('header.web2Login.addressAlreadyBindTip'),
            variant: 'subtle',
          });
        } else {
          toast({
            status: 'error',
            title: t('header.web2Login.bindFail'),
            variant: 'subtle',
          });
        }
        // 绑定失败时，退出登陆或者切换到web3账号
        bindWeb3WalletFailModal?.current?.open();
      });
  };

  return (
    <>
      {userData?.wallet_address || userData?.login_email ? (
        <>
          <MobileProfileButton
            loading={loading || fetchUserLoading}
            userData={userData!}
            disconnect={disconnect}
            clearLoginData={clearLoginData}
            links={links}
          />
        </>
      ) : (
        <WalletButton isLoading={loading || fetchUserLoading} />
      )}
      <ResgisterModal ref={resgisterModalRef} />
      {/* <CheckInModal ref={checkInModalRef} /> */}
      <CheckInModal
        ref={checkInModalRef}
        onSignSuccess={() => {
          window.localStorage.setItem(
            `${format(new Date(), 'MM/dd/yyyy')}_${
              userData?.wallet_address
            }_checkin`,
            'true',
          );
        }}
      />
      <BindWeb3WalletModal
        ref={bindWeb3WalletModal}
        onConfirm={handleBindWeb3Wallet}
        onCancel={() => {
          bindWeb3WalletFailModal?.current?.open();
        }}
      />
      <BindWeb3WalletFailModal
        ref={bindWeb3WalletFailModal}
        onConfirm={() => {
          clearLoginData(false);
          toast({
            status: 'success',
            title: `${t('header.web2Login.accountSwitch')} ${accountAddress}`,
            variant: 'subtle',
          });
          bindWeb3WalletModal?.current?.close &&
            bindWeb3WalletModal?.current?.close();
          bindWeb3WalletFailModal?.current?.close &&
            bindWeb3WalletFailModal?.current?.close();
        }}
        onCancel={() => {
          disconnect();
          bindWeb3WalletModal?.current?.close &&
            bindWeb3WalletModal?.current?.close();
          bindWeb3WalletFailModal?.current?.close &&
            bindWeb3WalletFailModal?.current?.close();
        }}
      />
    </>
  );
};

export default memo(Profile, () => true);
