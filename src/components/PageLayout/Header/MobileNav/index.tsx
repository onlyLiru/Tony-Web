import Image, { ShimmerImage } from '@/components/Image';
import {
  IconButton,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  HStack,
  Flex,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Avatar } from '@/components/NftAvatar';
import NextLink from 'next/link';
import LocaleButton from '../LocaleButton';
import ChainButton from '../ChainButton';
import { NavMenuIcon } from '../ProfileButton/Icons';
import { useUserData } from '@/store';
import { useUserWalletBalance } from '@/hooks/useUserWalletBalance';
import { shortAddress } from '@/utils';
import { useEffect, useRef, useState } from 'react';
import { floor } from 'lodash';
import { useRouter } from 'next/router';
import { useCalender } from '@/hooks/useCalender';
import { CheckInModal } from '../CheckInModal';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useCookieState } from 'ahooks';
import * as globalApis from '@/services/global';
import { JWT_HEADER_KEY, WALLET_ADDRESS_KEY, EMAIL_KEY } from '@/utils/jwt';
import { useDisconnect, useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import useCopy from '@/hooks/useCopy';
import IconView from '@/components/iconView';

type ResgisterModalAction = {
  open: () => void;
  close?: () => void;
};

const defaultAvatar =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA29JREFUeF7tnctpXUEUBOfhCLR1CsI4AoFWTsKJKAQn4r3BeyNQBMJhaGEnIKQgalG0Xml/Zlp96vZ8uNx3+XX77e2Av/vHB1B9zuP9D1S/Xmz7dwkAF6EAKAEQgTRBSwBkPy8uAUoARFEJgOzzi0uAEgBRWAIg+/ziEqAEQBSWAMg+v7gEKAEQhSUAss8vLgFKAERhCYDs84tLgBIAUVgCIPv8Yj0Bfn9+Qe8D3D3/VV2kTwAVTxtI53/6+gUNcQkA5N8JgBKAEQSrSwB5E1kClADwGWblJUAJgAhqE4jsO20COway1+Ihf6cloCUAMdQSgOxrCTgtAS0B8Bli5V0FdxXMCILVXQR1EQQRYuWdAjoFIII6BSD7PsAp4P/LH/Q+gL0J+/TvJ2whK3+9+c4GgNV0D3IJANaBAJDX4BKA3UOUACwATglQAkCEWHl7gDaBiKCWAGTfaQnoGNgxED5DrLxTQKcARhCs7hTQKQAixMo7BXQKQAR1CkD2dQrQP/bcJrBNIHyGWXmbwDaBjCBYjTeB9HPxUP+hEW4/gev68dfCA4C9kGIDHACQ4BLgyg0MgABADrQEwJs828ASAPF/OgXIbxW3CbxygAMgANgPR0L/WgJaArYvUtoEwghYN3Bdf3uAKwc4AAKgTSBhoCWAuHe6CLJvMuc/EAH5my+/+k/EzHcQ/gMBAA1cLw+A9Q5C/QEADVwvD4D1DkL9AQANXC8PgPUOQv0BAA1cLw+A9Q5C/QEADVwvD4D1DkL9AQANXC8PgPUOQv0BAA1cLw+A9Q5C/RiA9c/FQ//my/EHIgJgm4EA2O4fVh8A2MLtAQJgu39YfQBgC7cHCIDt/mH1AYAt3B4gALb7h9UHALZwe4AA2O4fVh8A2MLtAQJgu39YfQBgC7cHCIDt/mH1AYAt3B4AA0B/L4AK2LbfV09/uBN/IygAXAgCwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAICwPVfnz0A9Ba4AgLA9V+fPQD0FrgCAsD1X589APQWuAIoAO9pKJKOnE328gAAAABJRU5ErkJggg==';

const MobileNav = () => {
  const t = useTranslations('common');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    VisitChainLogo,
    localCurrencyAmount,
    wrapperCurrencyAmount,
    statbleCurrencyAmount,
  } = useUserWalletBalance();
  const [userData, setUserData] = useUserData();
  const [uuuBalance, setUuuBalance] = useState(0);
  const router = useRouter();
  const { dateInfo } = useCalender(2);
  const checkInModalRef = useRef<ResgisterModalAction>(null);
  const [cookieToken, setCookieToken] = useCookieState(JWT_HEADER_KEY);
  const [loginWallectAddr, setLoginWallectAddr] =
    useCookieState(WALLET_ADDRESS_KEY);
  const [loginEmail, setLoginEmail] = useCookieState(EMAIL_KEY);
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [, setCopy] = useCopy();

  useEffect(() => {
    setUuuBalance(Number(window?.localStorage?.getItem('unemata_uuu_balance')));
  }, []);

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

  // 退出登陆，除了调用钱包的disconnect还需要清除cookie中的email信息
  const handleLogout = () => {
    // web3登陆直接调用disconnect
    if (address) {
      disconnect();
    }
    clearLoginData();
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        fontSize={18}
        icon={<NavMenuIcon />}
        variant={'ghost'}
        aria-label={'Toggle Navigation'}
        color="rgba(255, 255, 255, 0.8)"
      />
      <Modal
        size="full"
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInRight"
      >
        <ModalOverlay />
        <ModalContent
          p={0}
          fontFamily="Inter"
          color="primary.main"
          fontWeight={'bold'}
          bg={'#2B2B2B'}
        >
          <HStack p={5} spacing={5} pl="0px" bg={'#0A0A0A'}>
            <LocaleButton
              border={'2px  solid'}
              borderColor="primary.gray"
              rounded="full"
            />
            <ChainButton />
          </HStack>
          <ModalCloseButton
            top={6}
            right={4}
            fontSize="md"
            color={'rgba(255, 255, 255, 0.8)'}
          />
          <ModalBody px="16px" py="0" mt="10px">
            <Flex>
              {/* <Image
                w="48px"
                h="48px"
                borderRadius="48px"
                src={userData?.profile_image || defaultAvatar}
                fallbackSrc={defaultAvatar}
                alt="Avatar"
              /> */}
              <Avatar
                url={userData?.profile_image || defaultAvatar}
                {...{
                  placeholder: 'blur',
                  w: '48px',
                  h: '48px',
                  p: '8px',
                  objectFit: 'cover',
                }}
                notconfig={{ p: '0' }}
              />
              <Flex
                direction="column"
                color="rgba(255, 255, 255, 0.80)"
                ml="12px"
                justify="center"
              >
                {(userData?.wallet_address || userData?.login_email) && (
                  <>
                    <Text fontSize="14px" fontWeight="bold">
                      {userData?.username ||
                        shortAddress(userData?.wallet_address || '')}
                    </Text>
                    <Flex fontSize="12px" direction="row" align="center">
                      <Text>wallet address: </Text>
                      <Text color="rgba(255, 255, 255, 0.40)">
                        {userData?.wallet_address
                          ? `${userData?.wallet_address.slice(0, 15)}...`
                          : ''}
                      </Text>
                      <Flex
                        align="center"
                        h="16px"
                        px="4px"
                        ml="8px"
                        backgroundColor="rgba(255, 255, 255, 0.10)"
                        borderRadius="2px"
                        onClick={async () => {
                          await setCopy(userData?.wallet_address);
                          toast({
                            status: 'success',
                            title: 'Address copied',
                            variant: 'subtle',
                          });
                        }}
                      >
                        <Image
                          w="10px"
                          h="10px"
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAAJ1BMVEUAAACHj5+HkJ2GkJ2Fj5yIkJyGkJyGkJyGj5yGkJyGj5uFj52GkJwQ/mYkAAAADHRSTlMAIJ/fkK/vgFCvcGAxIMkfAAAATElEQVQI12PAAcrOAMFhARDzhCAQSDqAmAdBBJMCgmnkiGAGIxTIkM80VQIC5Q0gpoiykZKSFoMM3FIIkyUQ5KAeEJPRBuTMdBx+AABk5BcQRE0grgAAAABJRU5ErkJggg=="
                          fallbackSrc={undefined}
                          alt="Copy"
                        />
                        <Text
                          fontSize="10px"
                          color="rgba(255, 255, 255, 0.40)"
                          fontWeight="400"
                          ml="2px"
                        >
                          Copy
                        </Text>
                      </Flex>
                    </Flex>
                  </>
                )}
                {!(userData?.wallet_address || userData?.login_email) && (
                  <Text onClick={openConnectModal}>
                    {t('header.web2Login.connectWallet')}
                  </Text>
                )}
              </Flex>
            </Flex>

            {/* 积分，ETH和USDT余额 */}
            {(userData?.login_email || userData?.wallet_address) && (
              <Flex
                justify="space-between"
                fontWeight="bold"
                fontSize="14px"
                mt="36px"
                color={'rgba(255, 255, 255, 0.80)'}
              >
                <Flex
                  border="1px solid rgba(255, 255, 255, 0.10)"
                  borderRadius="12px"
                  flex="1"
                  h="48px"
                  align="center"
                  justify="center"
                >
                  <Image
                    w="16px"
                    h="16px"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABIFBMVEUAAAD/z43fgCDfexv/x4Tfexv/y4jfehv/1Y/fgCDgfR7ffBzfexv/0o7/y4nffBz/v4DfeBj/0o//0I3/1JD/0I7/z4z/0o/gfBz/x4T/v37/wYDfexv/x4ffexv/0Y77nUL////jgyffexv/wH3/0Iz/vHn/zor/yoT+uXP7o0v/y4j/yYb/xIH/woD/vnv+u3X/0o//0Y7/xoP9smX/xX/+vXf+uGz2rWP7oEj4lDP0iB/zhRr/8+f98OP7y5z/yIH/v3r9tWv9rVr9qVT8pVHvnUzsmEP2jSf72bj81K36u33+xHr7wHr+unD3s3Dyqlv7qVrnjTT2jyzhgCH/+fP/7dv+7dv94MT92rj9won9rl/1p1z1m0brkz71lDcpD/QGAAAAIHRSTlMAICDf34BgYBAQ77+ff0BAICDv79+/v6+voKCQj4Bwb977HiEAAAFhSURBVDjLrZLXdoJAFEVtMUbTe89cIqB0KYKIGrvRaCzp9f//IiwQSUZceXG/zZy91rkPJ7RswocGsR5ZGCc2SJqmh8T5AuVqj6T1Acv229HVgHjzgCTvGggxeZbrj6NbePmRTGbqyKGuccrQPcUv35XpWgF5qLyitB5W1rw8vp+TJQb9gtF5Pjs7JZzL2eUYTFUQiOvIVMigAKr/CXlfkF3hDaCE0AtA1xXSuPAKcFtEJQBjggmkKzwD3HdGAPBtIhtpTrCjT7MHULZQsPAIUGk+OT24cOP8VMDB7nGeWXEm0K7AlJy8YpkLBDTqlqHcsybIFShf0NCUTtEqmmhOYDWEgQusxuBxs0Y5gkM8xnH6H6WgUlTty19e4oLjeNWP3ykq20p6g3FrThSlOp1cQxLFD+J4Bx9tjOcHBbtcF0VjnMJH654iCKqaTkvt5GUokO2ztI231mDl1CBSdvky+QFUklm/vMpMpQAAAABJRU5ErkJggg=="
                    fallbackSrc={undefined}
                    alt="uuuBalance"
                  />
                  <Text ml="8px">{uuuBalance}</Text>
                </Flex>
                <Flex
                  border="1px solid rgba(255, 255, 255, 0.10)"
                  borderRadius="12px"
                  flex="1"
                  h="48px"
                  align="center"
                  justify="center"
                  ml="10px"
                >
                  <VisitChainLogo.Local fontSize={16} />
                  <Text ml="8px">
                    {floor(localCurrencyAmount + wrapperCurrencyAmount, 4)}
                  </Text>
                </Flex>
                <Flex
                  border="1px solid rgba(255, 255, 255, 0.10)"
                  borderRadius="12px"
                  flex="1"
                  h="48px"
                  align="center"
                  justify="center"
                  ml="10px"
                >
                  <VisitChainLogo.Stable fontSize={16} />
                  <Text ml="8px">{floor(statbleCurrencyAmount, 4)}</Text>
                </Flex>
              </Flex>
            )}

            {/* 我的NFT，订单，签到，个人中心等 */}
            <Flex direction="column" mt="16px" py="20px">
              <Link
                display="flex"
                flexDirection="row"
                alignItems="center"
                href={
                  userData?.wallet_address
                    ? `/user/${userData?.wallet_address}`
                    : '/login'
                }
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
                    d="M10 1H2C1.44772 1 1 1.44772 1 2V12C1 12.3709 1.20196 12.6947 1.50192 12.8673C1.55892 10.8986 2.88036 9.24692 4.68246 8.69595C3.6861 8.2081 3 7.18417 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6C9 7.18418 8.3139 8.20811 7.31753 8.69595C9.11963 9.24693 10.4411 10.8986 10.4981 12.8673C10.798 12.6947 11 12.3709 11 12V2C11 1.44772 10.5523 1 10 1ZM9.5 13C9.5 11.067 7.933 9.5 6 9.5C4.067 9.5 2.5 11.067 2.5 13H9.5ZM2 0C0.895431 0 0 0.89543 0 2V12C0 13.1046 0.895431 14 2 14H10C11.1046 14 12 13.1046 12 12V2C12 0.895431 11.1046 0 10 0H2ZM6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
                <Text
                  fontSize="14px"
                  fontWeight="500"
                  ml="6px"
                  color="rgba(255, 255, 255, 0.80)"
                >
                  {t('header.profile.menus.myItems')}
                </Text>
              </Link>

              <Link
                display="flex"
                mt="24px"
                flexDirection="row"
                alignItems="center"
                href={
                  userData?.wallet_address
                    ? `/user/${userData?.wallet_address}?bulkList=true`
                    : '/login'
                }
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
                    d="M2 1H10C10.5523 1 11 1.44772 11 2V12C11 12.5523 10.5523 13 10 13H2C1.44772 13 1 12.5523 1 12V2C1 1.44772 1.44772 1 2 1ZM0 2C0 0.89543 0.895431 0 2 0H10C11.1046 0 12 0.895431 12 2V12C12 13.1046 11.1046 14 10 14H2C0.895431 14 0 13.1046 0 12V2ZM2.5 4C2.5 3.72386 2.72386 3.5 3 3.5H3.5C3.77614 3.5 4 3.72386 4 4C4 4.27614 3.77614 4.5 3.5 4.5H3C2.72386 4.5 2.5 4.27614 2.5 4ZM4.5 4C4.5 3.72386 4.72386 3.5 5 3.5H9C9.27614 3.5 9.5 3.72386 9.5 4C9.5 4.27614 9.27614 4.5 9 4.5H5C4.72386 4.5 4.5 4.27614 4.5 4ZM4.5 7C4.5 6.72386 4.72386 6.5 5 6.5H9C9.27614 6.5 9.5 6.72386 9.5 7C9.5 7.27614 9.27614 7.5 9 7.5H5C4.72386 7.5 4.5 7.27614 4.5 7ZM5 9.5C4.72386 9.5 4.5 9.72386 4.5 10C4.5 10.2761 4.72386 10.5 5 10.5H9C9.27614 10.5 9.5 10.2761 9.5 10C9.5 9.72386 9.27614 9.5 9 9.5H5ZM3 6.5C2.72386 6.5 2.5 6.72386 2.5 7C2.5 7.27614 2.72386 7.5 3 7.5H3.5C3.77614 7.5 4 7.27614 4 7C4 6.72386 3.77614 6.5 3.5 6.5H3ZM2.5 10C2.5 9.72386 2.72386 9.5 3 9.5H3.5C3.77614 9.5 4 9.72386 4 10C4 10.2761 3.77614 10.5 3.5 10.5H3C2.72386 10.5 2.5 10.2761 2.5 10Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
                <Text
                  fontSize="14px"
                  fontWeight="500"
                  ml="6px"
                  color="rgba(255, 255, 255, 0.80)"
                >
                  {t('header.profile.menus.bulkList')}
                </Text>
              </Link>

              <Link
                display="flex"
                mt="24px"
                flexDirection="row"
                alignItems="center"
                href={`${
                  userData?.wallet_address
                    ? `/rewards?invitationCode=${(Math.random() * 100).toFixed(
                        1,
                      )}`
                    : '/login'
                }`}
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
                    d="M3 0C2.17157 0 1.5 0.671573 1.5 1.5V6.96561C0.840091 6.58223 0 7.0566 0 7.83171V12C0 13.1046 0.89543 14 2 14H12C13.1046 14 14 13.1046 14 12V7.83171C14 7.0566 13.1599 6.58223 12.5 6.96561V1.5C12.5 0.671573 11.8284 0 11 0H3ZM11.5 7.60719V1.5C11.5 1.22386 11.2761 1 11 1H3C2.72386 1 2.5 1.22386 2.5 1.5V7.60719L6.45924 10.1524C6.78865 10.3642 7.21135 10.3642 7.54076 10.1524L11.5 7.60719ZM13 7.83171V12C13 12.5523 12.5523 13 12 13H2C1.44772 13 1 12.5523 1 12V7.83171L5.91848 10.9936C6.5773 11.4171 7.4227 11.4171 8.08152 10.9936L13 7.83171ZM4 3.5C4 3.22386 4.22386 3 4.5 3H9.5C9.77614 3 10 3.22386 10 3.5C10 3.77614 9.77614 4 9.5 4H4.5C4.22386 4 4 3.77614 4 3.5ZM4.5 5C4.22386 5 4 5.22386 4 5.5C4 5.77614 4.22386 6 4.5 6H7.5C7.77614 6 8 5.77614 8 5.5C8 5.22386 7.77614 5 7.5 5H4.5Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
                <Text
                  fontSize="14px"
                  fontWeight="500"
                  ml="6px"
                  color="rgba(255, 255, 255, 0.80)"
                >
                  {t('header.profile.menus.invitationCode')}
                </Text>
              </Link>

              <Link
                display="flex"
                mt="24px"
                flexDirection="row"
                alignItems="center"
                onClick={() => {
                  // 登陆了邮箱但是没登陆web3钱包直接出rainow的钱包登陆插件
                  if (userData?.login_email && !userData?.wallet_address) {
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
                }}
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
                    d="M4.5 0.5C4.5 0.223858 4.27614 0 4 0C3.72386 0 3.5 0.223858 3.5 0.5V1H2C0.895431 1 0 1.89543 0 3V12C0 13.1046 0.89543 14 2 14H12C13.1046 14 14 13.1046 14 12V3C14 1.89543 13.1046 1 12 1H10.5V0.5C10.5 0.223858 10.2761 0 10 0C9.72386 0 9.5 0.223858 9.5 0.5V1H4.5V0.5ZM9.5 2H4.5V2.5C4.5 2.77614 4.27614 3 4 3C3.72386 3 3.5 2.77614 3.5 2.5V2H2C1.44772 2 1 2.44772 1 3V12C1 12.5523 1.44772 13 2 13H12C12.5523 13 13 12.5523 13 12V3C13 2.44772 12.5523 2 12 2H10.5V2.5C10.5 2.77614 10.2761 3 10 3C9.72386 3 9.5 2.77614 9.5 2.5V2ZM10.3535 5.47487C10.5488 5.67014 10.5488 5.98672 10.3535 6.18198L6.818 9.71751C6.62274 9.91278 6.30616 9.91278 6.1109 9.71751L3.98957 7.59619C3.79431 7.40093 3.79431 7.08435 3.98957 6.88909C4.18484 6.69382 4.50142 6.69383 4.69668 6.88909L6.46445 8.65685L9.64643 5.47487C9.84169 5.27961 10.1583 5.27961 10.3535 5.47487Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
                <Text
                  fontSize="14px"
                  fontWeight="500"
                  ml="6px"
                  color="rgba(255, 255, 255, 0.80)"
                >
                  {t('checkIn')}
                </Text>
              </Link>

              <Link
                display="flex"
                mt="24px"
                flexDirection="row"
                alignItems="center"
                href={`/${router.locale}/account/setting`}
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
                    d="M0.191515 6.25711C-0.0638381 6.71681 -0.0638385 7.28319 0.191515 7.74289L2.97677 12.7571C3.23213 13.2168 3.70404 13.5 4.21474 13.5H9.78526C10.296 13.5 10.7679 13.2168 11.0232 12.7571L13.8085 7.74289C14.0638 7.28319 14.0638 6.71681 13.8085 6.2571L11.0232 1.24289C10.7679 0.783189 10.296 0.5 9.78526 0.5L4.21474 0.5C3.70404 0.5 3.23213 0.78319 2.97677 1.24289L0.191515 6.25711ZM1.01683 7.24763C0.931711 7.0944 0.931711 6.9056 1.01683 6.75237L3.80209 1.73816C3.8872 1.58492 4.04451 1.49052 4.21474 1.49052L9.78526 1.49052C9.95549 1.49052 10.1128 1.58492 10.1979 1.73816L12.9832 6.75237C13.0683 6.9056 13.0683 7.09439 12.9832 7.24763L10.1979 12.2618C10.1128 12.4151 9.9555 12.5095 9.78526 12.5095H4.21474C4.04451 12.5095 3.8872 12.4151 3.80209 12.2618L1.01683 7.24763ZM8.42949 6.99993C8.42949 7.82051 7.78948 8.48572 7 8.48572C6.21052 8.48572 5.57051 7.82051 5.57051 6.99993C5.57051 6.17935 6.21052 5.51414 7 5.51414C7.78948 5.51414 8.42949 6.17935 8.42949 6.99993ZM9.38248 6.99993C9.38248 8.36756 8.31581 9.47624 7 9.47624C5.68419 9.47624 4.61752 8.36756 4.61752 6.99993C4.61752 5.6323 5.68419 4.52362 7 4.52362C8.31581 4.52362 9.38248 5.6323 9.38248 6.99993Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
                <Text
                  fontSize="14px"
                  fontWeight="500"
                  ml="6px"
                  color="rgba(255, 255, 255, 0.80)"
                >
                  {t('header.profile.menus.settings')}
                </Text>
              </Link>
            </Flex>

            {/* More features */}
            <Flex direction="column" mt="36px" fontSize="14px">
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

            {/* 社交媒体的外链 */}
            <Flex justify="space-between" margin="0 auto" mt="40px" w="224px">
              {/* ins */}
              <NextLink
                href="https://www.instagram.com/unemeta.verse/"
                passHref
              >
                <Link>
                  <IconView
                    className="text-white w-[15px] h-auto"
                    type="ins"
                  ></IconView>
                </Link>
              </NextLink>
              {/* twitter */}
              <NextLink href="https://twitter.com/UneWeb3" passHref>
                <Link>
                  <IconView
                    className="text-white w-[15px] h-auto"
                    type="twitter"
                  ></IconView>
                </Link>
              </NextLink>
              {/* discord */}
              <NextLink href="https://discord.com/invite/YzztkC6ENe" passHref>
                <Link>
                  <IconView
                    className="text-white w-[17px] h-auto"
                    type="disco"
                  ></IconView>
                </Link>
              </NextLink>
              {/* threads */}
              {/* <NextLink href="https://www.threads.net/@unemeta.verse" passHref>
                <Link>
                  <ShimmerImage
                    w="32px"
                    h="32px"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAABACAMAAAByderSAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEXRSTlMAIN/vkBCAv0BwYJ/PMK9QoDmEJw4AAAEpSURBVFjD7ZVLjsQgDAXBxnxDyLv/ZSdDoKfVqzizaonaIZHCNsYxi8Vi8a1EFwjgbc/22fcBf7gHDgeAg/Pe7wSA7AMBe5nhHABXncAD2/upSRuFBUjMOxnYNYYCXCfG5JudacX7AgGKOWmEX8qvQxjuvqFd5yV0RkYOdFswNyemLKYegD9XNcp9QxhVs3Ys2SgheDOxVhpQlQYgjTsMjE5TG3K/koAXTp4YCkAu53SM+1BnIbMNIxCAoKuku1o7zkchupY0G/bL4Hs5CMEIo6ieNo8+SNXGrZflABl1V1dGp+fkVYYZst1wwr05dl0p3XzdteUqXaaow9i/yaczGg3pY8p5oBgdB0B5OmJ4Mqw9Tvq0L4wekZpMeMH+X389KknMYrFYfCU/LZkQgxz03ugAAAAASUVORK5CYII="
                  />
                </Link>
              </NextLink> */}
              {/* 邮件 */}
              <NextLink href="mailto:UneMeta_JP@outlook.com" passHref>
                <Link>
                  <IconView
                    className="text-white w-[15px] h-auto"
                    type="email"
                  ></IconView>
                </Link>
              </NextLink>
            </Flex>

            {/* 登陆/登出按钮 */}
            {(userData?.wallet_address || userData?.login_email) && (
              <Flex
                mt="40px"
                mb="20px"
                direction="row"
                w="full"
                h="42px"
                borderRadius="200px"
                border="1px solid rgba(255, 255, 255, 0.10)"
                align="center"
                justify="center"
                onClick={handleLogout}
                color={'rgba(255, 255, 255, 0.80)'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.79756 0C1.97637 0 0.5 1.43908 0.5 3.21429V14.7857C0.5 16.5609 1.97637 18 3.79756 18H9.73317C10.0974 18 10.3927 17.7122 10.3927 17.3571C10.3927 17.0021 10.0974 16.7143 9.73317 16.7143H3.79756C2.70485 16.7143 1.81902 15.8508 1.81902 14.7857V3.21429C1.81902 2.14917 2.70485 1.28571 3.79756 1.28571H9.73317C10.0974 1.28571 10.3927 0.997897 10.3927 0.642857C10.3927 0.287817 10.0974 0 9.73317 0H3.79756ZM18.3069 8.49976L14.1098 4.40864C13.8522 4.15759 13.4346 4.15759 13.1771 4.40864C12.9195 4.6597 12.9195 5.06673 13.1771 5.31778L16.2483 8.31147L7.28832 8.31147C6.92409 8.31147 6.62881 8.59929 6.62881 8.95433C6.62881 9.30937 6.92409 9.59719 7.28832 9.59719L16.2483 9.59719L13.1771 12.5909C12.9195 12.8419 12.9195 13.249 13.1771 13.5C13.4346 13.7511 13.8522 13.7511 14.1098 13.5L18.3069 9.4089C18.5644 9.15785 18.5644 8.75081 18.3069 8.49976Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
                <Text ml="4px" fontWeight="400" fontSize="14px">
                  {t('logout')}
                </Text>
              </Flex>
            )}
            {!(userData?.wallet_address || userData?.login_email) && (
              <Flex
                mt="40px"
                mb="20px"
                direction="row"
                w="full"
                h="42px"
                borderRadius="200px"
                border="1px solid rgba(255, 255, 255, 0.10)"
                align="center"
                justify="center"
                onClick={openConnectModal}
                color={'rgba(255, 255, 255, 0.80)'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="16"
                  viewBox="0 0 18 16"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.4286 1.33333H2.57143C1.86135 1.33333 1.28571 1.93029 1.28571 2.66667V13.3333C1.28571 14.0697 1.86135 14.6667 2.57143 14.6667H15.4286C16.1387 14.6667 16.7143 14.0697 16.7143 13.3333V12.6667V11.3333H9.72321C7.94801 11.3333 6.50893 9.84095 6.50893 8C6.50893 6.15905 7.94801 4.66667 9.72321 4.66667H16.7143V2.66667C16.7143 1.93029 16.1387 1.33333 15.4286 1.33333ZM9.72321 6H16.7143V10H9.72321C8.65809 10 7.79464 9.10457 7.79464 8C7.79464 6.89543 8.65809 6 9.72321 6ZM2.57143 0C1.15127 0 0 1.19391 0 2.66667V13.3333C0 14.8061 1.15127 16 2.57143 16H15.4286C16.8487 16 18 14.8061 18 13.3333V12.6667V4.66667V2.66667C18 1.19391 16.8487 0 15.4286 0H2.57143ZM10.0446 9C10.5772 9 11.0089 8.55229 11.0089 8C11.0089 7.44772 10.5772 7 10.0446 7C9.51208 7 9.08036 7.44772 9.08036 8C9.08036 8.55229 9.51208 9 10.0446 9Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
                <Text ml="4px" fontWeight="400" fontSize="14px">
                  {t('header.web2Login.connectWallet')}
                </Text>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
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
      </Modal>
    </>
  );
};

export default MobileNav;
