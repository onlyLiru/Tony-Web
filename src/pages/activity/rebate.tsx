import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { serverSideTranslations } from '@/i18n';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Center,
  useToast,
  Stack,
  createIcon,
  Container,
} from '@chakra-ui/react';
import CommonHead from '@/components/PageLayout/CommonHead';
import { ShimmerImage } from '@/components/Image';
import {
  GetRewards,
  DiamondRewards,
  SendTwitter,
  HoldList,
  SignIn,
} from '@/features/Rebate';
import { useState, useRef, useEffect } from 'react';
import { useUserDataValue } from '@/store';
import { useRouter } from 'next/router';
import { Footer } from '@/components/PageLayout';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { AiFillCheckCircle } from 'react-icons/ai';
import * as rebateApi from '@/services/rebate';
import { formatEther } from 'ethers/lib/utils.js';

const DiamondIcon = createIcon({
  displayName: 'DiamondIcon',
  viewBox: '0 0 20 20',
  path: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.6">
        <path
          d="M11.3333 10.0001H8.75L10.0833 13.0834L11.3333 10.0001ZM13 10.0001L11.8333 12.5001L14.4167 10.0001H13ZM7 10.0001H5.58333L8.16667 12.5001L7 10.0001ZM10.0833 5.83341H9.83333L8.41667 8.33341H11.5L10.0833 5.83341ZM11.75 5.83341L13.1667 8.33341H14.8333L13.25 5.83341H11.75ZM8.25 5.83341H6.75L5.16667 8.33341H6.83333L8.25 5.83341ZM10 16.6667L2.5 9.33341L5.83333 4.16675H14.1667L17.5 9.33341L10 16.6667Z"
          fill="#444444"
        />
      </g>
    </svg>
  ),
});

const Banner = () => {
  const t = useTranslations('rebate');
  return (
    <Box
      maxW={{ md: '1280px', base: '320px' }}
      w="full"
      h={{ md: '458px', base: '249px' }}
      mx="auto"
      mt={{ md: '90px', base: '17px' }}
      mb={{ md: '68px', base: '38px' }}
      rounded={{ md: '20px', base: '28px' }}
      bgImage={{
        md: '/images/activity/rebate/banner.png',
        base: '/images/activity/rebate/banner_small.png',
      }}
      bgColor="#2A1F31"
      bgSize="cover"
      overflow="hidden"
      pos="relative"
      pl={{ md: '55px', base: '28px' }}
      pr={{ md: '42px', base: '28px' }}
      color="#fff"
    >
      <HStack spacing={{ md: '36px', base: '0' }} align="center" h="full">
        <Box flex={1} pt={{ md: '112px', base: '32px' }} h="full">
          <Box
            fontSize={{ md: '56px', base: '26px' }}
            lineHeight={{ md: '50px', base: '28px' }}
            fontWeight={700}
            fontFamily="DIN Alternate"
            mb="13px"
            letterSpacing="0.02em"
            textTransform="capitalize"
            bg="linear-gradient(89.6deg, #FFFFFF -4.08%, #BEFDF9 28.08%, #FCCDF7 104.34%);"
            bgClip="text"
            sx={{
              textFillColor: 'transparent',
            }}
            pos="relative"
          >
            <Text
              w={{ md: 'auto', base: '244px' }}
              h={{ md: 'auto', base: '56px' }}
              textAlign={{ md: 'left', base: 'center' }}
              mx={{ md: 'unset', base: 'auto' }}
            >
              {t('banner.title')}
            </Text>
            <Text
              fontFamily="DIN Alternate"
              pos="absolute"
              top="-40px"
              left="0"
              textTransform="capitalize"
              bg="linear-gradient(89.6deg, #FFFFFF -4.08%, #BEFDF9 28.08%, #FCCDF7 104.34%);"
              bgClip="text"
              sx={{
                textFillColor: 'transparent',
              }}
              display={{ md: 'unset', base: 'none' }}
            >
              “
            </Text>
          </Box>
          <Text
            fontSize={{ md: '18px', base: '12px' }}
            lineHeight={{ md: '50px', base: '18px' }}
            fontWeight={{ md: 300, base: 600 }}
            color="#FBF3FF"
            textAlign={{ md: 'left', base: 'center' }}
          >
            {t('banner.pool')}
          </Text>
          <Stack
            spacing={{ md: '29px', base: '0' }}
            color={{ md: '#E4E2FF', base: '#fff' }}
            fontSize={{ md: '20px', base: '12px' }}
            lineHeight={{ md: '30px', base: '20px' }}
            fontWeight={600}
            direction={{ md: 'row', base: 'column' }}
            mt={{ md: '81px', base: '36px' }}
          >
            <Text textAlign={{ md: 'left', base: 'center' }}>
              {t('banner.tip')}
            </Text>
            <Text
              color="#E4E2FF"
              fontSize="14px"
              opacity={0.4}
              display={{ md: 'unset', base: 'none' }}
            >
              /
            </Text>
            <Text textAlign={{ md: 'left', base: 'center' }}>
              {t('banner.time')}
            </Text>
          </Stack>
          <Text
            fontSize="12px"
            lineHeight="20px"
            fontWeight={400}
            color={{ md: '#FBF3FF', base: '#fff' }}
            display={{ md: 'block', base: 'none' }}
            opacity={0.8}
          >
            {t('banner.desc')}
          </Text>
        </Box>
        <ShimmerImage
          w={{ md: '276px', base: '18px' }}
          h={{ md: '289px', base: '18px' }}
          objectFit="contain"
          display={{ md: 'unset', base: 'none' }}
          src="/images/activity/rebate/banner_img.png"
        />
      </HStack>
    </Box>
  );
};

const UserInfo = ({
  data,
  refresh,
}: {
  data: rebateApi.ApiRebate.RebateInfo;
  refresh: () => void;
}) => {
  const userData = useUserDataValue();
  const { openConnectModal } = useConnectModal();
  const t = useTranslations('rebate');
  const getRewardsRef = useRef<any>();
  const diamondRewardsRef = useRef<any>();

  const getRewards = () => {
    getRewardsRef.current?.open();
  };

  return (
    <>
      <Box w={{ md: '498px', base: '335px' }}>
        <Box
          textAlign={{ md: 'left', base: 'center' }}
          fontSize={{ md: '30px', base: '16px' }}
          fontWeight={600}
          mb={{ md: '30px', base: '16px' }}
          lineHeight="30px"
        >
          {t('user.title')}
        </Box>
        <VStack
          w="full"
          bg="linear-gradient(180deg, #F0EDFC 0%, rgba(251, 232, 218, 0) 100%)"
          rounded="10px"
          border="1px solid rgba(0,0,0,0.2)"
          pt={{ md: '48px', base: '37px' }}
          pb={{ md: '56px', base: '36px' }}
          spacing="0"
        >
          {userData?.wallet_address ? (
            <ShimmerImage
              w={{ md: '106px', base: '86px' }}
              h={{ md: '106px', base: '86px' }}
              mb={{ md: '20px', base: '10px ' }}
              rounded="full"
              src={userData?.profile_image!}
            />
          ) : (
            <Center
              w={{ md: '106px', base: '86px' }}
              h={{ md: '106px', base: '86px' }}
              rounded="full"
              border="1px solid rgba(0, 0, 0, 0.2);"
              bgColor="rgba(255, 255, 255, 0.2);"
              cursor="pointer"
              onClick={() => openConnectModal?.()}
              mb={{ md: '20px', base: '10px ' }}
            >
              <ShimmerImage
                w={{ md: '26px', base: '18px' }}
                h={{ md: '26px', base: '18px' }}
                src="/images/user/addImg.png"
              />
            </Center>
          )}
          {userData?.wallet_address ? (
            <Text
              fontSize="20px"
              color="#000"
              pb={{ md: '16px', base: '12px' }}
            >{`${userData?.wallet_address.slice(0, 6)}`}</Text>
          ) : (
            <Text fontSize="20px" pb="14px">
              {t('user.unLogin')}
            </Text>
          )}
          <HStack
            fontSize={{ md: 'md', base: '14px' }}
            lineHeight="30px"
            fontWeight={600}
            pb={{ md: '5px', base: '0' }}
          >
            <ShimmerImage
              w="17px"
              h="18px"
              src="/images/activity/rebate/signedDay.png"
            />
            <Text>
              {t('user.unclaimed')}{' '}
              {userData?.wallet_address
                ? data?.reward.total_reward
                  ? formatEther(data.reward.total_reward)
                  : 0
                : 0.02}{' '}
              eth
            </Text>
          </HStack>
          <Box
            h="30px"
            fontSize={{ md: 'md', base: '14px' }}
            lineHeight="30px"
            fontWeight={400}
            color="#8A8A8F"
          >
            {userData?.wallet_address
              ? `${t('user.claimed')}：${
                  data?.reward.received_reward
                    ? `${
                        Math.floor(
                          Number(formatEther(data.reward.received_reward)) *
                            1000000,
                        ) / 1000000
                      } eth / `
                    : ''
                }${data?.received_score || 0} uuu`
              : ''}
          </Box>
          <Button
            w={{ md: '318px', base: '248px' }}
            h="auto"
            minH={{ md: '56px', base: '42px' }}
            bgColor="#544AEC"
            rounded="10px"
            fontSize={{ md: '20px', base: '16px' }}
            color="#fff"
            whiteSpace="normal"
            mt={{ md: '20px!important', base: '15px!important' }}
            _hover={{
              opacity: 0.8,
            }}
            disabled={!data?.can_receive || !userData?.wallet_address}
            onClick={getRewards}
          >
            {t('user.unclaimed')}（{t('user.missionAccomplished')}{' '}
            {data?.task_done_num || 0}/7）
          </Button>
        </VStack>
      </Box>
      <GetRewards ref={getRewardsRef} data={data?.reward} refresh={refresh} />
      <DiamondRewards ref={diamondRewardsRef} data={data?.reward} />
    </>
  );
};

export default function Rebate() {
  const toast = useToast();
  const router = useRouter();
  const sendTwitterRef = useRef<any>();
  const holdListRef = useRef<any>();
  const signInRef = useRef<any>();
  const [info, setInfo] = useState<rebateApi.ApiRebate.RebateInfo>();

  const userData = useUserDataValue();
  const { openConnectModal } = useConnectModal();
  const t = useTranslations('rebate');

  const fetchInfo = async () => {
    try {
      const { data } = await rebateApi.getTaskStatus();
      setInfo(data);
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  useEffect(() => {
    if (userData?.wallet_address) {
      fetchInfo();
    }
  }, [userData?.wallet_address]);

  const onSignInClick = () => {
    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }
    signInRef.current.open();
  };

  const handleTwitterSend = (type: number) => {
    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }
    sendTwitterRef.current.open({
      num: type,
      status: type === 1 ? info?.task8 : info?.task6,
    });
  };

  const openHoldList = () => {
    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }
    holdListRef.current?.open();
  };

  const goToPage = (url: string) => {
    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }
    router.push(url);
  };

  return (
    <Box fontFamily="PingFang HK">
      <CommonHead title="Rebate" />
      <Box px="20px" pb="80px">
        <Banner />
        <Stack
          direction={{ md: 'row', base: 'column' }}
          spacing={{ md: '75px', base: '48px' }}
          maxW={{ md: '1260px', base: 'full' }}
          mx="auto"
          align={{ md: 'flex-start', base: 'center' }}
        >
          <UserInfo data={info!} refresh={fetchInfo} />
          <VStack
            fontSize="14px"
            lineHeight="30px"
            spacing="38px"
            align="flex-start"
            color="#464646"
          >
            <Box w="full" px={{ md: '0', base: '6px' }}>
              <Text
                w="full"
                fontSize={{ md: '30px', base: '16px' }}
                fontWeight={600}
                color="#000"
                textAlign={{ md: 'left', base: 'center' }}
              >
                {t('taskTitle1')}
              </Text>
              <VStack
                spacing={{ md: '10px', base: '8px' }}
                mt={{ md: '28px', base: '16px' }}
                align="flex-start"
              >
                <HStack spacing="12px" align="flex-start">
                  <Icon
                    as={AiFillCheckCircle}
                    color={info?.task3 === 1 ? '#695FF3' : '#CCCCCC'}
                    fontSize="12px"
                    mt="9px"
                  />
                  <Container px="0">
                    <Text display="inline-block">1.{t('task1')}</Text>
                    <Text
                      display="inline-block"
                      fontSize={{ md: '12px', base: '10px' }}
                      lineHeight={{ md: '25px', base: '18px' }}
                      fontWeight={400}
                      px={{ md: '12px', base: '9px' }}
                      bgColor="#544AEC"
                      rounded={{ md: '4px', base: '3px' }}
                      color="#fff"
                      ml={{ md: '18px', base: '10px' }}
                      cursor="pointer"
                      onClick={onSignInClick}
                    >
                      {t('checkIn')}
                    </Text>
                  </Container>
                </HStack>
                <HStack spacing="12px" align="flex-start">
                  <Icon
                    as={AiFillCheckCircle}
                    color={info?.task4 === 1 ? '#695FF3' : '#CCCCCC'}
                    fontSize="12px"
                    mt="9px"
                  />
                  <Container px="0">
                    2.{t('task2')}
                    <Text
                      display="inline-block"
                      fontSize={{ md: '12px', base: '10px' }}
                      lineHeight={{ md: '25px', base: '18px' }}
                      fontWeight={400}
                      px={{ md: '12px', base: '9px' }}
                      bgColor="#544AEC"
                      rounded={{ md: '4px', base: '3px' }}
                      color="#fff"
                      ml={{ md: '18px', base: '10px' }}
                      cursor="pointer"
                      onClick={() => handleTwitterSend(1)}
                    >
                      {t('task2Btn')}
                    </Text>
                  </Container>
                </HStack>
                <HStack spacing="12px" align="flex-start">
                  <Icon
                    as={AiFillCheckCircle}
                    color={info?.task5 === 1 ? '#695FF3' : '#CCCCCC'}
                    fontSize="12px"
                    mt="9px"
                  />
                  <Text
                    cursor="pointer"
                    onClick={openHoldList}
                    dangerouslySetInnerHTML={{ __html: t.raw('task3') }}
                  ></Text>
                </HStack>
                <HStack spacing="12px" align="flex-start">
                  <Icon
                    as={AiFillCheckCircle}
                    color={info?.task6 === 1 ? '#695FF3' : '#CCCCCC'}
                    fontSize="12px"
                    mt="9px"
                  />
                  <Container px="0">
                    4.{t('task4')}
                    <Text
                      display="inline-block"
                      fontSize={{ md: '12px', base: '10px' }}
                      lineHeight={{ md: '25px', base: '18px' }}
                      fontWeight={400}
                      px={{ md: '12px', base: '9px' }}
                      bgColor="#544AEC"
                      rounded={{ md: '4px', base: '3px' }}
                      color="#fff"
                      cursor={'pointer'}
                      ml={{ md: '18px', base: '10px' }}
                      opacity={
                        info?.reward.total_reward &&
                        info?.task3 &&
                        info?.task4 &&
                        info?.task5
                          ? 1
                          : 0.5
                      }
                      onClick={() =>
                        info?.reward.total_reward &&
                        info?.task3 &&
                        info?.task4 &&
                        info?.task5
                          ? handleTwitterSend(2)
                          : null
                      }
                    >
                      {t('task4Btn')}
                    </Text>
                  </Container>
                </HStack>
              </VStack>
            </Box>
            <Box w="full">
              <Text
                w="full"
                fontSize={{ md: '30px', base: '16px' }}
                fontWeight={600}
                color="#000"
                textAlign={{ md: 'left', base: 'center' }}
              >
                {t('taskTitle2')}
              </Text>
              <HStack
                spacing={{ md: '12px', base: '10px' }}
                mt={{ md: '28px', base: '16px' }}
                align="flex-start"
              >
                <Icon
                  as={AiFillCheckCircle}
                  color={info?.task7 === 1 ? '#695FF3' : '#CCCCCC'}
                  fontSize="12px"
                  mt="10px"
                />
                <Container px="0">
                  <Text display="inline">1.</Text>
                  <Icon as={DiamondIcon} fontSize="20px" />
                  <Text display="inline">{t('task5')}</Text>
                </Container>
              </HStack>
            </Box>
            <Box w="full">
              <Text
                w="full"
                fontSize={{ md: '30px', base: '16px' }}
                fontWeight={600}
                color="#000"
                textAlign={{ md: 'left', base: 'center' }}
              >
                {t('taskTitle3')}
              </Text>
              <VStack
                spacing={{ md: '10px', base: '8px' }}
                mt={{ md: '28px', base: '16px' }}
                align="flex-start"
              >
                <HStack spacing="12px" align="flex-start">
                  <Icon
                    as={AiFillCheckCircle}
                    color={info?.task2 === 1 ? '#695FF3' : '#CCCCCC'}
                    fontSize="12px"
                    mt="9px"
                  />
                  <Box
                    fontWeight={400}
                    display="inline"
                    cursor="pointer"
                    onClick={() =>
                      goToPage(`/user/${userData?.wallet_address}`)
                    }
                    dangerouslySetInnerHTML={{ __html: t.raw('task6') }}
                  ></Box>
                </HStack>
                <HStack spacing="12px" align="flex-start">
                  <Icon
                    as={AiFillCheckCircle}
                    color={info?.task1 === 1 ? '#695FF3' : '#CCCCCC'}
                    fontSize="12px"
                    mt="9px"
                  />
                  <Box
                    fontWeight={400}
                    display="inline"
                    cursor="pointer"
                    onClick={() => goToPage('/rewards')}
                    dangerouslySetInnerHTML={{ __html: t.raw('task7') }}
                  ></Box>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Stack>
      </Box>
      <SendTwitter ref={sendTwitterRef} refresh={fetchInfo} />
      <HoldList ref={holdListRef} />
      {userData?.wallet_address && info?.local_time ? (
        <SignIn
          ref={signInRef}
          refresh={fetchInfo}
          timestamp={info?.local_time}
        />
      ) : null}
      <Footer />
    </Box>
  );
}
import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext) {
  const messages = await serverSideTranslations(locale, ['rebate']);
  // 禁止国内ip
  let detectedIp = requestIp.getClientIp(req);
  // console.log(detectedIp, 'ip');
  // console.log(req.url, 'ip');
  // const ip = '156.146.56.115';

  if (detectedIp === '::1') {
    detectedIp = '156.146.56.115';
  }

  const xdbFilePath = path.join(process.cwd(), 'public', 'ip2region.xdb');
  // const dbPath = './ip2region.xdb';
  // or 'path/to/ip2region.xdb file path'
  const searcher = Searcher.newWithFileOnly(xdbFilePath);
  // 查询
  const geo = await searcher.search(detectedIp || '');

  if (geo && geo?.region?.split('|')[0] === '中国') {
    if (
      !(
        geo?.region?.split('|')[2] === '台湾省' ||
        geo?.region?.split('|')[2] === '香港'
      )
    ) {
      return {
        redirect: {
          permanent: false,
          destination: '/err',
        },
      };
    }
  }
  // console.log(geo, 'geo1');
  return {
    props: {
      messages,
    },
  };
}
