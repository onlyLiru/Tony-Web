import {
  Box,
  Flex,
  Text,
  Stack,
  Icon,
  Link,
  LinkProps,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useMediaQuery,
  createIcon,
  Image,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useUserData } from '@/store';
import PopoverSearch from './PopoverSearch';
import { ShimmerImage } from '@/components/Image';
import LocaleButton from './LocaleButton';
import MobileNav from './MobileNav';
import GasButton from './GasButton';
import RewardButton from './RewardBtn';
import BalanceButton from './BalanceBtn';
import ProfileButton from '../Header/ProfileButton';
import ChainButton from './ChainButton';
import { SpaceIdModal } from './SpaceIdModal';
import { useTranslations } from 'next-intl';
import { useScroll } from 'ahooks';
import { useMemo, useState, useEffect } from 'react';
import logo from '../../../../public/images/aiLandingPage/logo.png';
// import logoWithText from '../../../../public/images/aiLandingPage/logo.svg';
import { useRouter } from 'next/router';
import NotifyBoxButton from './NotifyBoxButton';

export const headerMdHeight = 64;
export const headerBaseHeight = 72;

export interface NavItem {
  label: string;
  children?: Array<NavItem>;
  href?: string;
  disabled?: boolean;
  extra?: React.ReactNode;
  linkProps?: LinkProps;
}

export default function Header_landing() {
  const scroll = useScroll();
  const hasScroll = useMemo(() => scroll && scroll.top > 0, [scroll?.top]);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [userData, setUserData] = useUserData();
  const [showLogin, setShowLogin] = useState(false);
  const t = useTranslations('common');
  const router = useRouter();

  const navList = [
    {
      name: 'Home',
      href: '/',
    },
    // {
    //   name: 'News',
    //   href: '/',
    // },
    {
      name: 'Reward',
      href: `/${router.locale}/rewards`,
    },
    {
      name: 'Explore',
      href: `/${router.locale}/explore`,
    },
    // {
    //   name: 'Une',
    //   href: '/',
    // },
    {
      name: 'Profile',
      href: `/${router.locale}/account/setting`,
    },
    {
      name: 'Une Field',
      href: `/${router.locale}/UneFieldLandingPage`,
    },
  ];

  const links: Array<NavItem> = [
    {
      label: t('header.nav.explore'),
      href: '/explore',
      linkProps: {
        className: 'Tn007',
      },
    },
    {
      label: t('header.nav.launchpad.title'),
      children: [
        {
          label: t('header.nav.launchpad.launchpad'),
          href: '/launchpad',
          linkProps: {},
        },
        // {
        //   label: t('header.nav.launchpad.giveback'),
        //   href: '/activity/rebate',
        // },
      ],
    },
    {
      label: t('header.nav.rewards.title'),
      children: [
        {
          label: t('header.nav.rewards.uuu'),
          href: '/rewards',
          linkProps: {
            className: 'Tn008',
          },
        },
        {
          label: t('header.nav.rewards.staking'),
          href: '/stake',
        },
        {
          label: t('header.nav.rewards.commission'),
          href: '/agent',
        },
      ],
    },
  ];
  // 选中的导航
  const [selectedNav, setSelectedNav] = useState('Home');
  useEffect(() => {
    setTimeout(() => {
      if (
        !(router?.pathname === '/err' || router?.pathname === '/anniversary')
      ) {
        setShowLogin(true);
      }
    }, 8000);
    /**
     * 设置菜单初始值
     */
    navList.forEach((item) => {
      if (router.route !== '/' && item.href.includes(router.route)) {
        setSelectedNav(item.name);
        console.log(router.route, item);
      }
    });
  }, []);
  return (
    <Box
      id="header-container"
      zIndex={60}
      position={'sticky'}
      top="0"
      left={'0'}
      right={'0'}
      backdropFilter="blur(12px)"
      transition="all ease 0.2s"
      boxShadow={hasScroll ? '0px 4px 8px rgba(0, 0, 0, 0.05)' : 'none'}
      bg={hasScroll ? 'rgba(0, 0, 0, 0.8)' : '#2b2b2b'}
    >
      {!isLargerThan768 && (
        <Flex
          maxW="full"
          m="auto"
          color="primary.main"
          h={`${headerBaseHeight}px`}
          // py={{ base: 2 }}
          px="5"
          align={'center'}
          justifyContent="space-between"
        >
          {/* logo */}
          <Flex align="center">
            <NextLink href="/" passHref>
              <Link
                className="Tn004"
                display={'flex'}
                alignItems="center"
                flex="0 0 145px"
              >
                <ShimmerImage
                  src={logo}
                  w="142px"
                  h="32px"
                  alt="logo"
                  mr={'6px'}
                />

                {/* <ShimmerImage
                  w={'75px'}
                  h={'10px'}
                  src={logoWithText}
                  alt="unemeta logo"
                /> */}
                {/* <BetaIcon ml={'5px'} fontSize={32} /> */}
              </Link>
            </NextLink>
          </Flex>
          <Flex align="center">
            {/* <GasButton /> */}
            {/* 一个分割线 */}
            <Text color="#F2F3F5" padding="0 16px">
              |
            </Text>
            <PopoverSearch />
            <ProfileButton />
            <MobileNav />
          </Flex>
        </Flex>
      )}
      {/* 第一栏，包括社交媒体、搜索栏、gas、网络、国际化 */}
      {isLargerThan768 ? (
        <Flex
          maxW={{ base: 'full', md: 'full' }}
          m="auto"
          color="primary.main"
          h={{ md: `${headerMdHeight}px`, base: `${headerBaseHeight}px` }}
          // py={{ base: 2 }}
          px={{ base: 5, lg: 10 }}
          align={'center'}
        >
          {/* 社交媒体的外链 */}
          <Flex>
            {/* 邮件 */}
            <NextLink href="mailto:UneMeta_JP@outlook.com" passHref>
              <Link>
                <ShimmerImage
                  w="34px"
                  h="34px"
                  src="/images/aiLandingPage/email.svg"
                />
              </Link>
            </NextLink>
            {/* discord */}
            <NextLink href="https://discord.com/invite/YzztkC6ENe" passHref>
              <Link>
                <ShimmerImage
                  w="34px"
                  h="34px"
                  src="/images/aiLandingPage/discord.svg"
                />
              </Link>
            </NextLink>
            {/* twitter */}
            <NextLink href="https://twitter.com/UneWeb3" passHref>
              <Link>
                <ShimmerImage
                  w="34px"
                  h="34px"
                  src="/images/aiLandingPage/twitter.svg"
                />
              </Link>
            </NextLink>
            {/* ins */}
            <NextLink href="https://www.instagram.com/unemeta.verse/" passHref>
              <Link>
                <ShimmerImage
                  w="34px"
                  h="34px"
                  src="/images/aiLandingPage/ins.svg"
                />
              </Link>
            </NextLink>
          </Flex>

          {/* 搜索框 */}
          <Flex
            flex={1}
            justify={isLargerThan768 ? 'flex-start' : 'flex-end'}
            className="Tn005"
            mx={{ base: 0, md: '16px' }}
          >
            <PopoverSearch w="full" />
          </Flex>

          <Stack
            justify={'flex-end'}
            direction={'row'}
            align="center"
            spacing={{ md: 0, xl: 0 }}
          >
            {/* gas */}
            <Box display={{ base: 'none', lg: 'inline-flex' }}>
              <GasButton />
            </Box>

            {/* 网络 */}
            <Box display={{ base: 'none', lg: 'inline-flex' }}>
              <ChainButton />
            </Box>

            {/* 切换语言 */}
            <Box display={{ base: 'none', lg: 'inline-flex' }}>
              <LocaleButton />
            </Box>
            <NotifyBoxButton />
          </Stack>
        </Flex>
      ) : null}
      {/* 第二栏，包括logo、Home/News/Portal/Une/Profile的切换tab、连接钱包按钮 */}
      {isLargerThan768 ? (
        <Flex h="96px" px={{ base: 5, lg: 10 }} align="center">
          {/* logo */}
          <Flex align="center">
            <NextLink href="/" passHref>
              <Link
                className="Tn004"
                display={'flex'}
                alignItems="center"
                flex="0 0 145px"
              >
                <ShimmerImage
                  src={logo}
                  w="142px"
                  h="32px"
                  alt="logo"
                  mr={'6px'}
                />

                {/* <ShimmerImage
                  w={'75px'}
                  h={'10px'}
                  src={logoWithText}
                  alt="unemeta logo"
                /> */}
                {/* <BetaIcon ml={'5px'} fontSize={32} /> */}
              </Link>
            </NextLink>
          </Flex>
          {/* 各个导航 */}
          <Box flex="1" textAlign="center">
            <Flex
              display="inline-flex"
              align="center"
              h="56px"
              borderRadius="12px"
              border="1px solid #404040"
              paddingX="12px"
              position={'relative'}
            >
              {navList.map((nav, navIndex) => {
                return (
                  <NextLink passHref href={nav.href} key={nav.name}>
                    <Link
                      display="flex"
                      alignItems="center"
                      // w="75px"
                      h="38px"
                      ml={navIndex !== 0 ? '60px' : '0'}
                      onClick={() => setSelectedNav(nav.name)}
                    >
                      <Text
                        w="100%"
                        h="100%"
                        px={'14px'}
                        color={nav.name === selectedNav ? '#000' : '#808080'}
                        lineHeight="38px"
                        fontWeight="500"
                        borderRadius="12px"
                        background={
                          nav.name === selectedNav ? '#FB9D42' : 'none'
                        }
                      >
                        {nav.name}
                      </Text>
                      {/* {selectedNav === 'Une Field' && (
                        <Image
                          src="/images/aiLandingPage/ai.png"
                          position={'absolute'}
                          right={'0'}
                          top={'0'}
                          w={'30px'}
                          h={'22px'}
                        />
                      )} */}
                    </Link>
                  </NextLink>
                );
              })}
              <Image
                src="/images/aiLandingPage/ai.png"
                position={'absolute'}
                right={'0'}
                top={'0'}
                w={'30px'}
                h={'22px'}
              />
            </Flex>
          </Box>
          {/* 连接钱包按钮和一堆的modal */}
          {/* <Box display={{ base: 'none', lg: 'inline-flex' }}>
          <DesktopNav links={links} />
        </Box> */}

          {/* 积分数 */}
          {userData?.wallet_address || userData?.login_email ? (
            <>
              <Box display={{ base: 'none', lg: 'inline-flex' }}>
                <RewardButton />
              </Box>

              {/* 帐户余额 */}
              <Box display={{ base: 'none', lg: 'inline-flex' }} ml="16px">
                <BalanceButton />
              </Box>
            </>
          ) : null}

          <Box ml="16px">
            <ProfileButton />
          </Box>
          <SpaceIdModal />
        </Flex>
      ) : null}
    </Box>
  );
}