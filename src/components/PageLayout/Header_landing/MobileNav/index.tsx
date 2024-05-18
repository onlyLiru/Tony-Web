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
        fontSize={20}
        icon={<NavMenuIcon />}
        variant={'ghost'}
        aria-label={'Toggle Navigation'}
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
        >
          <HStack p={5} spacing={5} pl="0px">
            <LocaleButton
              border={'2px  solid'}
              borderColor="primary.gray"
              rounded="full"
              color="#fff"
            />
            <ChainButton color="#fff" />
          </HStack>
          <ModalCloseButton top={6} right={4} fontSize="md" />
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
                color="#1D2129"
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
                      <Text color="#86909C">
                        {userData?.wallet_address
                          ? `${userData?.wallet_address.slice(0, 15)}...`
                          : ''}
                      </Text>
                      <Flex
                        align="center"
                        h="16px"
                        px="4px"
                        ml="8px"
                        backgroundColor="#F2F3F5"
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
                          color="#86909C"
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
              >
                <Flex
                  border="1px solid #F2F3F5"
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
                  border="1px solid #F2F3F5"
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
                  border="1px solid #F2F3F5"
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
                <Image
                  w="16px"
                  h="16px"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAM1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACjBUbJAAAAEHRSTlMA3yAQ77+gYEBQz6+AMJB/kN2RBAAAAMNJREFUOMut09mKAyEQhWFrcesl87//004zCa20NkNCzk1R1oeIaPhSNDrXrNrNnUm8iZVkw6aJeDagYYjhHQiTwPvAfiIs+Rao8BfRGyBIsVCPYlOQXwMTtilYqM+2EEfQLxjcAOv7EUTKs60sU7C1Q+YBvAZSg5WjfHpRoThHPIc50AhtixHsjm961Cz4PgL181nZA9cBCI9wJhGvoCLWgDnlAhI5dNlIPXBsYe+BItqBSILrg0ys/3+cJtZxHDV8J7/ZkRCdSyDguwAAAABJRU5ErkJggg=="
                  fallbackSrc={undefined}
                  alt="myItems"
                />
                <Text fontSize="14px" fontWeight="500" ml="6px" color="#1D2129">
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
                <Image
                  w="16px"
                  h="16px"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAHlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3KG9qAAAACXRSTlMA3yDvv68QoJ/R+GgAAAAAVElEQVQoz2MgBjA5z4SCqQpgAeWZcGAEFogsg6lVnwKmZirABNgmQwQQxs0kWoBxIiPIDgFMAUwtI9AWywR4DEEEPJtgAhlTsUcUUySMb6JATNQDAGHNR8LJb2X/AAAAAElFTkSuQmCC"
                  fallbackSrc={undefined}
                  alt="bulkList"
                />
                <Text fontSize="14px" fontWeight="500" ml="6px" color="#1D2129">
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
                <Image
                  w="16px"
                  h="16px"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEXRSTlMA3yDvQIAQj5/Pv5BwsGBQMCH69BgAAACuSURBVDjLtZHtDsMgCEUrWLVf2+77v+wwvemcoVmytOcPCgfFOFzFqOjQ3NYzHMZGUMjQIdBmB3DR5a4WAg7CT+HeGcL/wvkVMfpCjMdPuYKRuQr8upYVUICCFJOkLb8mYEkUanh+HZIyECLnZEhjzXHoUNtZ+QSxdJG9fTK1F4x6yLoGKC9rBCITjFkGRyCPpXAQVyC9oEh+XSjMdXiHVLDtouIEZaNsftmecwVve6QRb49nJvQAAAAASUVORK5CYII="
                  fallbackSrc={undefined}
                  alt="invitationCode"
                />
                <Text fontSize="14px" fontWeight="500" ml="6px" color="#1D2129">
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
                <Image
                  w="16px"
                  h="16px"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAKlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKE86IAAAADXRSTlMAIN/voIBfv68QcECQ0EA9MAAAAIpJREFUKM9jIA4wKUBJGOC9ACXBgLH4LhzcEAAKCN9FAoZAgV5PhBaR60D6rgDCUM7LIAFk++5SKMAtgCaQa4AqwHY3ACGwEKTgKsIM7ksCYAUIFb6KYAUIAZZLYmAFCEN9da+iuoMFrADZ2lMYLqVIwHYCgs8IEqh1RAhMuYEtGhh7EXxzASIiHgDG9mAmagvDOAAAAABJRU5ErkJggg=="
                  fallbackSrc={undefined}
                  alt="checkIn"
                />
                <Text fontSize="14px" fontWeight="500" ml="6px" color="#1D2129">
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
                <Image
                  w="16px"
                  h="16px"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAMFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABaPxwLAAAAD3RSTlMA7yCQgBDfv59gMEDPr1DGXelvAAAA5ElEQVQoz2MgE6z5DwanYHwmeYjAxwCoAMcPCG1vABXQT4LQgb+gAv0OEJrlO4Tm+waVYM3fAKbZfsJMn18AoRJgAuwQKZBC7kJZBSAJtpjlB0jV//8g2XqQ8YqfgE77b6ryEahEXxRkaQMDA/NnoLMcgPQXoIA8UIYd6KT1F4AWCwIFBIEG8YIECoBaPwIF/A2ABoO0GEB9FQgyVN4p+D/IUCGwD6DWwnzFKr8BqOSiOMh53xA+gPoK4QOEr0AKYUGX/wBIwHwA8RUErBeF0GqfwBTEJwxgX8GCDhYNChgRRR4AAChnWg25syS+AAAAAElFTkSuQmCC"
                  fallbackSrc={undefined}
                  alt="settings"
                />
                <Text fontSize="14px" fontWeight="500" ml="6px" color="#1D2129">
                  {t('header.profile.menus.settings')}
                </Text>
              </Link>
            </Flex>

            {/* More features */}
            <Flex direction="column" mt="36px" fontSize="14px">
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

            {/* 社交媒体的外链 */}
            <Flex justify="space-between" margin="0 auto" mt="40px" w="224px">
              {/* ins */}
              <NextLink
                href="https://www.instagram.com/unemeta.verse/"
                passHref
              >
                <Link>
                  <ShimmerImage
                    w="32px"
                    h="32px"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEXRSTlMA33AQ789AIL+fkK+AYKBvMHqKP4UAAADlSURBVFjD7dVbbsQgEETRaprnYCdT+99syEgZUIQlIJLzw1nAFTQ2YNu2bbufHlmEb9ZFE2YTD3Y8MMWxyynG1XWsryWwQ/hNMcp0Gk94FgdGRVZWxJJ0AIRkXhhr9Ch8pg14shCMsj8N02zQcS7SNNSkdLZjmo0kIAgLCUBcjHio8EUUfi1igbPZmF2KCPDBujP5v4htzuQE/j5YwC9GYnvEuUbmP7YzJaPAJ2cjUisvTcPOR5g8Cl9/a4dR+fdVUEWMOnjJYJTyUrj3ooZePRmY0n+8FHOCiU74JpIPxbZt23a7LwbrJxzPp6jNAAAAAElFTkSuQmCC"
                  />
                </Link>
              </NextLink>
              {/* twitter */}
              <NextLink href="https://twitter.com/UneWeb3" passHref>
                <Link>
                  <ShimmerImage
                    w="32px"
                    h="32px"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABDCAMAAAAI9LO2AAAAOVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8dlA9AAAAEnRSTlMA32DvIL8QcIBAn1Awz7CgkH+KC9AVAAAAzUlEQVRYw+3S24oDIRCE4bJtdXQOmdT7P+yGJcuOCULay9DfvT9aCOecc24glxS5N8VDhUFBRwN/RcmSmqGz8v7S+RfUEDrZldq1U0XwsRvJpnhSdoLaQgzy99DpDgp5SUnXyTDI8XksNtn6UIJJ4UWcDy31xoEDFoFDp+1GHFphHHtEYbJyIMGoDmYSGOXtjHwX0JlfSWBWaLiQ9QtExQx527tgkiZeLZhU97mhe9s99TtvsFtTYC8uGVNkf81MUzlSfDTCUSqcc859lR/05yGjQck0fgAAAABJRU5ErkJggg=="
                  />
                </Link>
              </NextLink>
              {/* discord */}
              <NextLink href="https://discord.com/invite/YzztkC6ENe" passHref>
                <Link>
                  <ShimmerImage
                    w="32px"
                    h="32px"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABCCAMAAADDqGATAAAAOVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8dlA9AAAAEnRSTlMA379AkK8gEGDvz58wf3BQoF+OOu2mAAAA80lEQVRYw+3Vy7KCMAwG4FwKvXHRvP/DHrWQ44A4Bhdu8q2STaf5JwVwzjnnNmJcqx7O45EE1waFwnDqLmORu1A7Iqr10WACs1FeCmDUywHreJ0cIGPOcoi/vJCiEwl9n1KQN0bDQUXeQPtkyNAvaXUDzCjN568lSTPfG9RbsDTJGlFeGl1otG43PYcx/QdcljHNWUddKWrRWdPO0tRbfW3l9VZW0ZE/JCustJZd0FJsB+398CBcBsPNc0Vr2FNLuzCHonEF5tbkyfBGLroxkeeU0hD100I9WDDtHkN6HMNgNVwybRY+B4ZT4u5v6Zxz7of+AL9YJRzYiw6bAAAAAElFTkSuQmCC"
                  />
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
                  <ShimmerImage
                    w="32px"
                    h="32px"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABABAMAAABRrMyXAAAAHlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3KG9qAAAACXRSTlMAIO/fkHAQv68fuakBAAAAgklEQVRIx2MYBaNg6APGoplwMEMAqxKhmUhAEauSTmQl07EqmYkMJhFWMpOmSiYKQ6QNJXErYfMEqZiSgFvJpABWTQiJQwlYvzDQGqBZOJWApUHKcCsBWwK0Bo8SsFVsnoTCxVCYiKAbIko0CSupRFYxg9zkzYiUvtUFGEbBKBjyAAAiX7UYMnLrawAAAABJRU5ErkJggg=="
                  />
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
                border="1px solid #F2F3F5"
                align="center"
                justify="center"
                onClick={handleLogout}
              >
                <Image
                  w="20px"
                  h="20px"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAMAAABU4iNhAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEXRSTlMAn0Ag32C/EM/voJCwgDBwUEdPlykAAACkSURBVDjLvdTLEoMgDIXhSBAEwfa8/8vWXRhTmmzKv/5mUC6h/xVawdhrBk88Sj9g2oZOniwNxIs8NYDJVUEiX8C2TobOTglE9skk1JD5EGr9URUq0qAiDSrSolrmXRWFjnLD16KW3S3pCo/eRa1u7L4l+YZHJltyFCjSglpqaMsbpkweWVCdd573BW/TPxkSEHwyyMlK7qnonrRt/gG1YKzTkj6HrhA0dnpypQAAAABJRU5ErkJggg=="
                  fallbackSrc={undefined}
                  alt="Logout"
                />
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
                border="1px solid #F2F3F5"
                align="center"
                justify="center"
                onClick={openConnectModal}
              >
                <Image
                  w="20px"
                  h="20px"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAANlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC3dmhyAAAAEXRSTlMAn6Dvv9+AQLBgIDCQX89QEAOaHLcAAACqSURBVDjL1ZTLDoNACACxsO5DbTv//7NtaHoxutiedC5wmIRdIMhVyKbsojZ9vZGAUZwG2LCLAdnFAlU6VDBPlCJdDPUIQ1+8wdnEZ101KG2LObFmU3zAIbElmNuBN86fycbinSQyaVoiEYqIgUaiMriY4tL6Lp20RuJ49DNPhSFoT9DwP0fo1Hm1FOdb3F1Rsb5YUI8GS89boHiS45PSfjhSztQ/e1kuwgszKRfSHu1tzwAAAABJRU5ErkJggg=="
                  fallbackSrc={undefined}
                  alt="connectWallet"
                />
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
