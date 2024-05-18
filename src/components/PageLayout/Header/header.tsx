import { ShimmerImage } from '@/components/Image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import logoWithText from '../../../../public/logo_l_n.png';
import { Link } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import LocaleButton from './LocaleButton';
import NotifyBoxButton from './NotifyBoxButton';
import IconView from '@/components/iconView';
import { useUserData } from '@/store';
import RewardButton from './RewardBtn';
import ProfileButton from './ProfileButton';
import NavView from './newHeader/nav';
import NextLink from 'next/link';
import MobileNav from './MobileNav';
import ChainButton from './ChainButton';
import SwitchChainView from './ChainButton/switchBtn';

const MainHeader = () => {
  const router = useRouter();

  const [userData, setUserData] = useUserData();

  return (
    <div className="flex justify-between items-center bg-[#0A0A0A] px-[40px] py-[21px] sticky left-0 top-0 z-[70] llg:px-[10px]">
      <div
        className="cursor-pointer select-none"
        onClick={() => {
          router.push('/');
        }}
      >
        <ShimmerImage
          w={'142.47px'}
          h={'32px'}
          src={logoWithText}
          alt="unemeta logo"
        />
      </div>
      <div className="grow"></div>
      <div className="">
        <NavView className="llg:hidden"></NavView>
      </div>
      <div className="grow"></div>
      <div className="flex justify-start items-center">
        {/* <ConnectButton
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
          showBalance={false}
        /> */}
        {/* 网络 */}
        {/* <ChainButton /> */}
        <SwitchChainView></SwitchChainView>
        <div className="llg:hidden mx-[16px]">
          <LocaleButton className="" />
        </div>
        <div className="llg:hidden">
          <NotifyBoxButton />
        </div>
        <div className="llg:hidden flex justify-center items-center">
          <NextLink href="https://discord.com/invite/YzztkC6ENe" passHref>
            <Link className="mr-[20px]">
              <IconView
                className="text-white/40 w-[18px] h-auto"
                type="disco"
              ></IconView>
            </Link>
          </NextLink>
        </div>
        <div className="llg:hidden flex justify-center items-center">
          <NextLink href="https://twitter.com/UneWeb3" passHref>
            <Link className="mr-[20px]">
              <IconView
                className="text-white/40 w-[15px] h-auto"
                type="twitter"
              ></IconView>
            </Link>
          </NextLink>
        </div>
        {userData?.wallet_address || userData?.login_email ? (
          <>
            <div className="mr-[16px]">
              <RewardButton />
            </div>
          </>
        ) : null}
        <ProfileButton />
        <div className="hidden llg:block">
          <MobileNav />
        </div>
      </div>
    </div>
  );
};
export default MainHeader;
