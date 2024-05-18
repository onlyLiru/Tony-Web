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
  ModalCloseButton,
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
              color={{ base: 'primary.main', md: 'white' }}
              animation={{ base: 'none', md: `${hue} 6s infinite alternate` }}
              aria-label=""
              isLoading={isLoading}
              icon={
                router?.pathname !== '/UneFieldLandingPage' ? (
                  <NavWallectIcon fontSize={24} />
                ) : (
                  <NavWallectIconfff fontSize={24} />
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
    <Box border="1px solid" borderColor="primary.gray" rounded="xl" p={3}>
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

import LocaleButton from '../LocaleButton';
import ChainButton from '../ChainButton';
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
    window.location.reload();
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
                notConfig={{ p: '0' }}
              />
            }
          />
        </Box>
      </VipModal>

      <Modal
        size="full"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInRight"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(20px)" />
        <ModalContent
          maxW={{ base: 'full', md: '375px' }}
          fontFamily={'Urbanist'}
        >
          <HStack p={5} spacing={5} pl="0px">
            <LocaleButton
              border={'2px  solid'}
              borderColor="primary.gray"
              rounded="full"
            />
            <ChainButton />
          </HStack>
          <ModalCloseButton top={6} right={4} fontSize="md" />
          <ModalBody p={0}>
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
                      notConfig={{ p: '0' }}
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

                <Text fontSize={'xl'} fontWeight="bold">
                  {userData.username || shortAddress(userData.wallet_address)}
                </Text>
              </HStack>
            </Flex>
            <Box color="typo.sec">
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
                <Text color="#86909C">More Features</Text>
                <Flex direction="row" color="#1D2129" mt="16px">
                  <Link
                    display="flex"
                    flexDirection="column"
                    flex="1"
                    borderRadius="12px"
                    backgroundColor="#F7F8FA"
                    h="66px"
                    justifyContent="center"
                    alignItems="center"
                    href={`/${router.locale}/stake`}
                  >
                    <Image
                      w="16px"
                      h="16px"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAKlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKE86IAAAADXRSTlMA3+8ggJCPv2AwEM9Aq2av7AAAAIVJREFUKM9jIAKw6N6FgEsJEIHcuzBwBSKgawBVynwJQt+Fa75LvIAs2MiLeASggBwBQXQBBjRbMAQ4i64boGiZe/fuHRSBvVGm1+ECEAbXXWQBFpBBCUgCueBAg9tyERxyzJeQBCD6EVqIFkBEA8JQX0gsNYDpq0ABVl2IAIi+5EBE3AMApTV1CHedkxwAAAAASUVORK5CYII="
                      fallbackSrc={undefined}
                      alt="staking"
                    />
                    <Text mt="4px">{t('header.nav.rewards.staking')}</Text>
                  </Link>
                  <Link
                    display="flex"
                    ml="10px"
                    flexDirection="column"
                    flex="1"
                    borderRadius="12px"
                    backgroundColor="#F7F8FA"
                    h="66px"
                    justifyContent="center"
                    alignItems="center"
                    href={`/${router.locale}/launchpad`}
                  >
                    <Image
                      w="16px"
                      h="16px"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAHlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3KG9qAAAACXRSTlMA37+AEO9wYEDN+FALAAAAbklEQVQoz2MgCjRFzoQAdQifeSYcGIAFKic7QGRYMmeAac0EmF7mSWBqpgNMgGUqRABh/EwYKQkycSIeAYQWWpsxEUMAj5ZIhOcgApoGMAE2iPc7p8ECyHI69iBkKIJyp2owUA1IImyZiClABAAALVBLtX1/n3QAAAAASUVORK5CYII="
                      fallbackSrc={undefined}
                      alt="title"
                    />
                    <Text mt="4px">{t('header.nav.launchpad.title')}</Text>
                  </Link>
                </Flex>

                <Flex direction="row" color="#1D2129" mt="10px">
                  <Link
                    display="flex"
                    flexDirection="column"
                    flex="1"
                    borderRadius="12px"
                    backgroundColor="#F7F8FA"
                    h="66px"
                    justifyContent="center"
                    alignItems="center"
                    href={`/${router.locale}/explore`}
                  >
                    <Image
                      w="16px"
                      h="16px"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAMFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaPxwLAAAAD3RSTlMA35DvQCAQz2CAn3+/UDDKGM1fAAABDElEQVQoz42RTUrDQBTH/42TUAU1nmACFt0I7aZgVxncukjAnZsGj+AFRvAAduEBvIELD9AjKHiBHsExSvoFr/MIaV53/TMM837M+8aeUpdpLO2uJvoRdmjL17EEz87gVIBjusAOuFtgF+gEuNEt6LoCDzJLZ47IjrIWZDECl4sY/QTjfwjwafD+hunvFqQF7CwgmjSA+BwQDXAGfyTgF7vk0OaQKDmpEJUeWIP+BOcjHC2h1gBb2RAAJw84VzbgwoDQ99T5A/iK7HKmPqoCL3HbHPmpRPoJHDUB7q3rwbvWA1o1NU6H9UD8Z5Z3/Kof345dofR1swbtekV4m1a5WJQX/2ukrtLy0WA/bQBdfGJ2zNlJXAAAAABJRU5ErkJggg=="
                      fallbackSrc={undefined}
                      alt="explore"
                    />
                    <Text mt="4px">{t('header.nav.explore')}</Text>
                  </Link>
                  <Link
                    display="flex"
                    ml="10px"
                    flexDirection="column"
                    flex="1"
                    borderRadius="12px"
                    backgroundColor="#F7F8FA"
                    h="66px"
                    justifyContent="center"
                    alignItems="center"
                    href={`/${router.locale}/agent`}
                  >
                    <Image
                      w="16px"
                      h="16px"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEXRSTlMAIO/fv0AQcM+AYJBQr6AwX+QkSfoAAADlSURBVDjLrZNbEsIgFEPvg3epNfvfrMpcUcCOPz0fZQaSkLZAl+K3JABDXGRaKYoGt+dtlnDCy+mZCag3QOKwfhdIDtQAiPgpyfShAqlnAvQkA58MFrhAo4AipHsUGmgW0A737g8wrYIgMJtan0lAm817C1gEFc6EO42CjrYJh3gisCyBp98wm+M4WbcE67hy/NvCQ9qYrORC7K/ZxpUd2zspnHT0w6eeydD+s4R/BhQyEtKySVDodGAGghtiC6A8n+FKX1QBMnd7FkiZKimAPfqDfXRiZ3i5OB0tJ1fv5ZW0ebqSB2SgDAIyJ0a1AAAAAElFTkSuQmCC"
                      fallbackSrc={undefined}
                      alt="commission"
                    />
                    <Text mt="4px">{t('header.nav.rewards.commission')}</Text>
                  </Link>
                </Flex>
              </Flex>
            </Box>
            <Box p={5}>
              <Button
                className="Sb007"
                onClick={handleLogout}
                size="lg"
                w="full"
                variant={'primary'}
                rounded="xl"
                rightIcon={<Icon as={HiOutlineLogout} fontSize={22} />}
              >
                {t('logout')}
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
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
      // window?.location?.reload();
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
