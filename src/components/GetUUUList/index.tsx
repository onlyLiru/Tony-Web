import React, { useState, useEffect, useRef } from 'react';
import { Flex, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { useUserDataValue, useInvitationCode, useIsInvited } from '@/store';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { getSignedInDate } from '@/services/rebate';
import { ShimmerImage } from '@/components/Image';
import { Web2LoginModal } from '@/components/PageLayout/Header/Web2Login';
import InviteFriendsModal, {
  InviteFriendsModalRef,
} from '@/pages/rewardsOld/components/InviteFriendsModal';
import * as pointsApi from '@/services/points';

type ResgisterModalAction = {
  open: () => void;
  close?: () => void;
};

function ContentList() {
  const router = useRouter();
  const t = useTranslations('common');
  const userData = useUserDataValue();
  const [isSign, updateSignStatus] = useState(false);
  const web2LoginModal = useRef<ResgisterModalAction>(null);
  const { openConnectModal } = useConnectModal();
  const [invitationUrl, setInvitationUrl] = useState('');
  const [inviteMsg, updateInviteResult] = useState<any>({});
  const InviteFriendsModalRef = useRef<InviteFriendsModalRef>(null);
  const [, setInviteCode] = useInvitationCode();
  const [, setInvited] = useIsInvited();

  const getInvite = () => {
    // GetUUURef?.current?.open();
    if (!userData?.wallet_address) {
      return web2LoginModal?.current?.open();
    }
    InviteFriendsModalRef?.current?.open();
  };

  const init = () => {
    // 获取自身邀请码
    const fetchInviteCode = async () => {
      try {
        const res = await pointsApi.getInviteCode();
        updateInviteResult(res.data);
        setInviteCode(res.data.scode);
        setInvited(res.data.is_invited);
      } catch (err) {}
    };

    fetchInviteCode();
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

  useEffect(() => {
    setInvitationUrl(
      `${window.location.host}${window.location.pathname}?invitationCode=true`,
    );
  }, []);

  useEffect(() => {
    if (userData?.wallet_address) {
      init();
    }
  }, [userData?.wallet_address]);

  return (
    <div>
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
            align="left"
          >
            {t('rewardsModal.desc1')}
          </Text>
          <Flex alignItems="center">
            <Text color="#544AEC" fontSize="14px" mr="6px" align="left">
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
            align="left"
          >
            {t('rewardsModal.desc2')}
          </Text>
          <Flex alignItems="center">
            <Text color="#544AEC" fontSize="14px" mr="6px" align="left">
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
          align="left"
        >
          {t('rewardsModal.desc3')}
        </Text>
        <Flex alignItems="center">
          <Text color="#544AEC" fontSize="14px" mr="6px" align="left">
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
          align="left"
        >
          {t('rewardsModal.desc4')}
        </Text>
        <Flex alignItems="center">
          <Text color="#544AEC" fontSize="14px" mr="6px" align="left">
            {t('rewardsModal.show')}
          </Text>
          <ShimmerImage
            w="14px"
            h="14px"
            src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
          />
        </Flex>
      </Flex>
      {/* <div className="hidden md:block"> */}
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
          if (router?.route?.includes('rewards') && getInvite) {
            return getInvite();
          }
          router.push(`/rewards`);
        }}
      >
        <Text
          fontSize="14px"
          color="#000"
          fontWeight="500"
          fontFamily="PingFangSC-Medium"
          align="left"
        >
          {t('rewardsModal.desc5')}
        </Text>
        <Flex alignItems="center">
          <Text color="#544AEC" fontSize="14px" mr="6px" align="left">
            {t('rewardsModal.invite')}
          </Text>
          <ShimmerImage
            w="14px"
            h="14px"
            src="https://res.cloudinary.com/unemeta/image/upload/v1692420988/20230819-125435_xksngs.png"
          />
        </Flex>
      </Flex>
      {/* </div> */}

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
                align="left"
              >
                {t('rewardsModal.desc6')}
              </Text>
              <Flex alignItems="center">
                <Text color="#544AEC" fontSize="14px" mr="6px" align="left">
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
      <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
      <InviteFriendsModal
        invitationUrl={invitationUrl}
        dataSource={inviteMsg}
        ref={InviteFriendsModalRef}
      />
    </div>
  );
}

export default ContentList;
