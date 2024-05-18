/* eslint-disable */
import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { serverSideTranslations } from '@/i18n';
import React from 'react';
import {
  Box,
  Text,
  HStack,
  Button,
  Center,
  useToast,
  Flex,
  useMediaQuery,
  SimpleGrid,
  Image,
  useDisclosure,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverCloseButton,
  PopoverArrow,
  PopoverContent,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Modal,
  Tooltip,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import CommonHead from '@/components/PageLayout/CommonHead';
import { ShimmerImage } from '@/components/Image';
import { useState, useMemo, useRef, useEffect } from 'react';
import { getMasonryRank } from '@/services/rebate';
import * as pointsApi from '@/services/points';

import InfoModal, { InfoModalRef } from './components/AnniversaryModel/index';
import {
  useUserDataValue,
  useUuInfoValue,
  useFetchUuInfo,
  useIsInvited,
  useInvitationCode,
} from '@/store';
import { Web2LoginModal } from '@/components/PageLayout/Header/Web2Login';
import * as userApis from '@/services/user';
import { useRouter } from 'next/router';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Contract, ContractTransaction } from 'ethers';
import abi from './abi.json';
import { isProd, isPre } from '@/utils';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

import { bsc as bscMain, bscTestnet } from 'wagmi/chains';

const bsc = isProd || isPre ? bscMain : bscTestnet;

const testAddresses = {
  claim: '0x52566bd42e1C21C8e309505190daA1C198B80908',
};

// TODO: 上线更改主网合约
const mainnetAddresses = {
  claim: '0xAfC122Cc69819519edeb5026313aEeb0249f56F3',
};

const CountdownTimer = React.memo(() => {
  const [countdown, setCountdown] = useState('');
  const t = useTranslations('anniversary');

  useEffect(() => {
    // 设置活动的结束时间
    const endTime: any = new Date('2023-11-10 22:59:59');
    endTime.setTime(endTime.getTime() + 48 * 60 * 60 * 1000);
    // 更新倒计时的函数
    const updateCountdown = () => {
      // 获取当前时间
      const currentTime: any = new Date();
      // 计算剩余时间（以毫秒为单位）
      const timeRemaining = endTime - currentTime;
      if (timeRemaining <= 0) {
        console.log('活动已结束');
        clearInterval(intervalId);
        return;
      }
      // 将剩余时间转换为天、小时、分钟和秒
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60),
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      // 将倒计时格式化为字符串
      const countdownString = `${hours}:${minutes}:${seconds}`;
      // 更新倒计时状态
      setCountdown(countdownString);
    };
    // 每秒钟更新一次倒计时
    const intervalId = setInterval(updateCountdown, 1000);
    // 组件卸载时清除定时器
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      {t.rich('celebration', {
        important: (chunks) => (
          <span className="text-[#FB9D42]">
            {countdown}
            {chunks}
          </span>
        ),
      })}
      {/* <span className="text-[#FB9D42]">{countdown}</span> */}
    </div>
  );
});

type ResgisterModalAction = {
  open: () => void;
  close?: () => void;
};
export default function Anniversary({
  data,
  initOrderList,
}: {
  data: any;
  initOrderList: any;
}) {
  const web2LoginModal = useRef<ResgisterModalAction>(null);

  const userData = useUserDataValue();
  const t = useTranslations('anniversary');

  const [rankList, updateRankList] = useState([]);
  const [isClaim, showClaim] = useState(false);
  const [ButLoading, setButLoading] = useState(false);
  const [rankMine, updateRankMine] = useState<any>({});
  const infoModalRef = useRef<InfoModalRef>(null);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const {
    isOpen: isRankModalOpen,
    onOpen: onOpenRankModel,
    onClose: onCloseRankModel,
  } = useDisclosure({
    id: 'rank',
  });
  const {
    isOpen: rewardModalOpen,
    onOpen: onOpenRewardModel,
    onClose: onCloseRewardModel,
  } = useDisclosure({
    id: 'reward',
  });
  const { chain } = useNetwork();
  const addresses = isProd || isPre ? mainnetAddresses : testAddresses;

  const { signer } = useSignHelper();
  const { address } = useAccount();

  const needSwitchNetwork = useMemo(
    () => chain?.id !== bsc.id && signer,
    [chain, signer],
  );

  console.log(signer, 'signer');
  console.log(isProd, 'isProd');
  console.log(isPre, 'isPre');
  console.log(bsc, 'bsc');
  console.log(chain, 'chain');
  console.log(addresses, 'addresses');

  const { switchNetworkAsync } = useSwitchNetwork({ chainId: bsc.id });
  /** 切换到bsc */
  const switchNetwork = async () => {
    try {
      // setIsMinting(true);
      await switchNetworkAsync?.();
      // setIsMinting(false);
      window.location.reload();
    } catch (error) {
      // setIsMinting(false);
      throw error;
    }
  };

  const funHandle = async () => {
    console.log(needSwitchNetwork, 'needSwitchNetwork');
    if (needSwitchNetwork) {
      await switchNetwork();
      return toast({
        status: 'success',
        title: 'Switch successed!',
      });
    }
  };
  // funHandle()

  const contract = useMemo(
    () => (signer ? new Contract(addresses.claim, abi, signer!) : null),
    [signer],
  );

  const mint = async () => {
    try {
      const newRes: boolean = await contract?.canAddress(address);
      if (newRes === undefined) {
        return;
      }
      console.log('Result:', newRes);
      showClaim(newRes);
      onOpenRewardModel();
    } catch (error) {
      throw error;
      // console.error('Error:', error);
    }
  };
  const requestedAddress = async () => {
    try {
      const res: boolean = await contract?.requestedAddress(address);
      return res;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const requestTokens = async () => {
    try {
      const res: boolean = await contract?.requestTokens();
      toast({
        title: 'Success!',
        status: 'success',
      });
      setButLoading(false);
      return res;
    } catch (error) {
      console.error('Error:', error);
      setButLoading(false);
    }
  };

  const colorStyle = {
    active: '#6157FF',
    regular: 'rgba(0,0,0,0.4)',
  };
  const tabStyle = {
    active: '1px solid #544AEC',
    regular: '1px solid rgba(0,0,0,0.2)',
  };

  const bgStyle = [
    '/images/login/one.png',
    '/images/login/two.png',
    '/images/login/three.png',
  ];
  const news = [
    {
      img: '/images/login/a5.jpg',
      title: 'article5',
      readId: '1',
      subTitle: 'article5Sub',
    },
    {
      img: '/images/login/a1.png',
      title: 'article1',
      readId: '2',
    },
    {
      img: '/images/login/a2.png',
      title: 'article2',
      readId: '3',
    },
    {
      img: '/images/login/a3.png',
      title: 'article3',
      readId: '4',
    },
    {
      img: '/images/login/a4.jpg',
      title: 'article4',
      readId: '5',
    },
    {
      img: '/images/login/a6.png',
      title: 'article6',
      readId: '6',
    },
    {
      img: '/images/login/a7.png',
      title: 'article7',
      readId: '7',
    },
    {
      img: '/images/login/a8.png',
      title: 'article8',
      readId: '8',
    },
    {
      img: '/images/login/a9.png',
      title: 'article9',
      readId: '9',
    },
    {
      img: '/images/login/a10.png',
      title: 'article10',
      readId: '10',
    },
  ];
  const [twFollowCode, setTwFollowCode] = useState('');
  const [twRetweetCode, setTwRetweetCode] = useState('');
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState('');
  const { openConnectModal } = useConnectModal();
  const toast = useToast();
  interface Iprops {
    [propName: string]: any;
  }
  /** 阅读文章统计 */
  const [readProgress, setReadProgress] = useState({
    all: 0,
    complete: 0,
  });
  const [regularLength, setRegularLength] = useState(0);
  const [socialProgress, setSocialProgress] = useState({
    all: 0,
    complete: 0,
  });

  const [infoData, setInfoData] = useState({
    amount: 0,
    reward_status: false,
  });
  const [taskInfo, setTaskInfo] = useState<Iprops>({
    news_read: {
      '1': false,
      '10': false,
      '2': false,
      '3': false,
      '4': false,
      '5': false,
      '6': false,
      '7': false,
      '8': false,
      '9': false,
    },
    wallet_rating: false,
    today_check_in: false,
    check_in_nums: 0,
    invited: 0,
    listing: 0,
    twitter_follow: {
      follow1: false,
      follow2: false,
      follow3: false,
    },
    discord_guild_joined: false,
    twitter_retweet: {
      '1': false,
      '2': false,
      '3': false,
      '4': false,
      '5': false,
      '6': false,
      '7': false,
    },
  });
  // 获取任务的状态
  const fetchTaskInfo = async () => {
    try {
      const { data } = await userApis.getTaskInfo();
      console.log(data, 'fetchTaskInfo');
      if (data) {
        setTaskInfo(data);
        // 阅读进度计算
        const keys = Object.keys(data.news_read);
        const values = keys.filter((key) => data.news_read[key]);
        setReadProgress({
          all: keys.length,
          complete: values.length,
        });
        // Regular 任务计算 固定数量就是4，其它只要判断对应的逻辑即可
        const regularValues = [];
        if (data.check_in_nums === 14) {
          regularValues.push('check');
        }
        if (data.invited >= 20) {
          regularValues.push('invited');
        }
        if (data.listing > 0) {
          regularValues.push('listing');
        }
        if (data.wallet_rating) {
          regularValues.push('wallet_rating');
        }
        setRegularLength(regularValues.length);
        // 社交任务计算
        const retweetKeys = Object.keys(data.twitter_retweet);
        const socialValues = retweetKeys.filter(
          (key) => data.twitter_retweet[key],
        );
        if (data.discord_guild_joined) {
          socialValues.push('discord');
        }
        if (
          data.twitter_follow.follow1 &&
          data.twitter_follow.follow2 &&
          data.twitter_follow.follow3
        ) {
          socialValues.push('twitter_follow');
        }
        setSocialProgress({
          all: retweetKeys.length + 2,
          complete: socialValues.length,
        });
      }
    } catch (error) {
      toast({ title: error.msg, status: 'error' });
    }
  };
  useEffect(() => {
    onCloseRewardModel();
    if (userData?.wallet_address) {
      console.log(userData, 'userData');
      funHandle();
      fetchTaskInfo();
      mint();
    } else {
      onOpenRewardModel();
      // openConnectModal?.();
    }
  }, [userData?.wallet_address]);

  // const url = `${origin + pathname}?discord=true`;
  // const redirectUrl = `${origin + pathname}`
  /** 获取twcode */
  const fetchTwCode = async (type: number) => {
    // type 1 follow 2 retweet
    try {
      const result = await userApis.getTwUrl({
        redirect_url: `${redirectUrl}?twType=${type}`,
        type,
      });
      console.log(result);
      if (result.data.url) {
        window.location.replace(result.data.url);
      }
    } catch (error) {
      toast({ title: error.msg, status: 'error' });
    }
  };
  const twAction = async (type: number, id: number) => {
    if (twFollowCode && type === 1) {
      console.log('twFollowCode');
      try {
        toast({
          render: () => (
            <Flex
              color="white"
              p={3}
              bg="blue.500"
              borderRadius={'10px'}
              alignItems={'center'}
            >
              <Spinner size="lg" />
              <Text ml={'30px'}>Loading</Text>
            </Flex>
          ),
        });
        const result = await userApis.followTw({
          code: twFollowCode,
          redirect_url: `${redirectUrl}?twType=${type}`,
          follow_id: id,
        });
        if (result.data.status) {
          toast({ title: 'Success!', status: 'success' });
          fetchTaskInfo();
          const { pathname } = window.location;
          setTwFollowCode('');
          setTwRetweetCode('');
          router.replace(pathname);
        }
      } catch (error) {
        toast({ title: error.msg, status: 'error' });
      }
      // toast.closeAll();
    } else if (twRetweetCode && type === 2) {
      console.log('twRetweetCode');
      try {
        toast({
          render: () => (
            <Flex
              color="white"
              p={3}
              bg="blue.500"
              borderRadius={'10px'}
              alignItems={'center'}
            >
              <Spinner size="lg" />
              <Text ml={'30px'}>Loading</Text>
            </Flex>
          ),
        });
        const result = await userApis.retweetTw({
          code: twRetweetCode,
          redirect_url: `${redirectUrl}?twType=${type}`,
          retweet_id: id,
        });
        if (result.data.status) {
          toast({ title: 'Success!', status: 'success' });
          fetchTaskInfo();
          const { pathname } = window.location;
          setTwFollowCode('');
          setTwRetweetCode('');
          router.replace(pathname);
        }
        // toast.closeAll();
      } catch (error) {
        toast({ title: error.msg, status: 'error' });
        // toast.closeAll();
      }
    } else {
      await fetchTwCode(type);
    }
  };
  const checkIn = async () => {
    try {
      const res = await userApis.dayCheckIn();
      if (res.data.status) {
        toast({ title: 'Success!', status: 'success' });
        fetchTaskInfo();
      }
    } catch (error) {
      toast({ title: error.msg, status: 'error' });
    }
  };
  const toInvite = () => {
    router.push(`/rewards?OpenInvite=true`);
  };
  const toUser = () => {
    router.push(`/user/${userData?.wallet_address}`);
  };
  const toAnniversaryCelebration = async () => {
    if (!taskInfo.wallet_rating) {
      try {
        const res = await userApis.rating();
        if (res.data.status) {
          toast({ title: 'Success!', status: 'success' });
        }
      } catch (error) {
        toast({ title: error.msg, status: 'error' });
      }
    }
    router.push(`/anniversaryCelebration`);
  };
  const toArticles = (news_id: number) => {
    router.push(`/articles?newsId=${news_id}`);
  };
  const dcJoin = async () => {
    const { code, discord } = router.query;
    const { origin, pathname } = window.location;
    const redirectUrl = `${origin + pathname}?discord=true`;
    /**加入dc群组 */
    if (code && discord) {
      try {
        toast({
          render: () => (
            <Flex
              color="white"
              p={3}
              bg="blue.500"
              borderRadius={'10px'}
              alignItems={'center'}
            >
              <Spinner size="lg" />
              <Text ml={'30px'}>Loading</Text>
            </Flex>
          ),
        });
        await userApis.dcGuild({
          code: code as string,
          redirect_uri: redirectUrl,
        });
        toast({
          title: 'Success!',
          status: 'success',
        });
        fetchTaskInfo();
      } catch (error) {
        toast({
          status: 'error',
          title: error.msg,
          variant: 'subtle',
        });
      }
    } else {
      try {
        const url = `https://discord.com/api/oauth2/authorize?client_id=1124218433647685743&redirect_uri=${encodeURIComponent(
          redirectUrl,
        )}&response_type=code&scope=guilds.join%20identify`;
        window.location.replace(url);
      } catch (error) {
        toast({
          status: 'error',
          title: error.msg,
          variant: 'subtle',
        });
      }
    }
  };
  // 提交信息
  const rewardInfo = async () => {
    try {
      const { data } = await pointsApi.rewardInfo();
      setInfoData(data);
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  useEffect(() => {
    rewardInfo();
    // if (userData?.wallet_address) {
    //   fetchTaskInfo();
    // }
    // 获取积分排行榜
    const fetchScoreRank = async () => {
      const result = await getMasonryRank();
      console.log(result);
      updateRankList(result?.data?.user_list ?? []);
      updateRankMine(result?.data?.my_info);
    };

    fetchScoreRank();

    const { origin, pathname } = window.location;
    const { code, twType } = router.query;
    setRedirectUrl(`${origin + pathname}`);
    if (twType === '1') {
      setTwFollowCode(code as string);
    } else if (twType === '2') {
      setTwRetweetCode(code as string);
    }
  }, []);

  const openMFun = () => {
    infoModalRef?.current?.open();
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear(); // 获取当前年份
  const month = currentDate.getMonth(); // 获取当前月份（注意：月份从0开始，0表示一月）
  const day = currentDate.getDate(); // 获取当前日期
  // const hours = currentDate.getHours(); // 获取当前小时
  // const minutes = currentDate.getMinutes(); // 获取当前分钟
  // const seconds = currentDate.getSeconds(); // 获取当前秒数
  // const milliseconds = currentDate.getMilliseconds(); // 获取当前毫秒数
  const newDate = `${year}-${month + 1}-${day}`;

  const currentTimeOpen = new Date();
  const startTimeOpen = '2023-11-10T22:59:59';
  const endTimeOpen = '2023-11-12T22:59:59';

  const isTimeInRange = (time: any, startTime: any, endTime: any): boolean => {
    const currentTime = new Date(time);
    const start = new Date(startTime);
    const end = new Date(endTime);

    return currentTime >= start && currentTime <= end;
  };
  const resultOpen = isTimeInRange(currentTimeOpen, startTimeOpen, endTimeOpen);
  console.log(resultOpen, 'Open');
  const tooltipGet = () => {
    return (
      <Box p="12px" w="100%">
        <Box display="flex" justifyContent="space-between">
          <Text>{t('rank')}</Text>
          <Text>{rankMine?.rank}</Text>
        </Box>
        <Box display="flex" justifyContent="space-between" mt="12px">
          <Text>{t('UUU')}</Text>
          <Text>{rankMine?.num}</Text>
        </Box>
      </Box>
    );
  };

  function scrollToElement() {
    const element = document.getElementById('my-element');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <Box>
      <CommonHead title="anniversary" />
      <>
        <Image w="100%" objectFit={'contain'} src={'/images/login/Group.png'} />
        <Box mt="-13%" bg="#FB9D42">
          {!isLargerThan768 ? (
            <Box
              mb={'20px'}
              display="flex"
              gridColumnGap="20px"
              pl="20px"
              pr="20px"
            >
              <Box borderRadius={'8px'} bg="#FFE3C9" w={'100%'}>
                <Text
                  p="12px"
                  fontSize={14}
                  fontWeight="600"
                  borderBottom={'2px solid #FFCA97;'}
                >
                  {t('obtain')}
                </Text>
                <Text p="12px" fontSize={12}>
                  {t('obtainDos')}
                </Text>
              </Box>
            </Box>
          ) : (
            <Box
              mb={'20px'}
              display="flex"
              gridColumnGap="20px"
              pl="20px"
              pr="20px"
            >
              <Box borderRadius={'8px'} bg="#FFE3C9" w={'50%'}>
                <Text
                  p="20px"
                  fontSize={24}
                  fontWeight="600"
                  borderBottom={'2px solid #FFCA97;'}
                >
                  {t('obtain')}
                </Text>
                <Text p="20px">{t('obtainDos')}</Text>
              </Box>
              <Box borderRadius={'8px'} bg="#FFE3C9" w={'50%'}>
                <Text
                  p="20px"
                  fontSize={24}
                  fontWeight="600"
                  borderBottom={'2px solid #FFCA97;'}
                >
                  {t('itsvalue')}
                </Text>
                <Box p="20px">
                  <Text>{t('itsvalueDos')}</Text>
                  <Text>{t('itsvalueDos2')}</Text>
                </Box>
              </Box>
            </Box>
          )}

          <Box
            bg="#FB9D42"
            w="100%"
            display="flex"
            gridColumnGap="20px"
            pl="20px"
            pr="20px"
          >
            <Box
              bg="#FFE3C9"
              pos="relative"
              w={isLargerThan768 ? '70%' : '100%'}
              h="100%"
            >
              <Image
                w="100%"
                objectFit={'contain'}
                src={'/images/login/ann.png'}
              ></Image>
              {/* 7天 */}
              <>
                {isLargerThan768 ? (
                  <Box
                    w="280px"
                    boxShadow="4px 4px 0px 0px #BF5E00"
                    border="2px solid #000000"
                    h="54px"
                    bg="#FFE3C9"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="70px"
                    pos="absolute"
                    bottom="7%"
                    left="37%"
                    onClick={scrollToElement}
                  >
                    {t('ObtainNow')}
                  </Box>
                ) : null}

                {/* 1*/}

                {!isLargerThan768 && (
                  <Popover placement="top">
                    <PopoverTrigger>
                      <Button
                        pos="absolute"
                        zIndex={'9'}
                        w="12%"
                        h="12%"
                        bgColor="transparent"
                        top="15%"
                        left="28%"
                        _hover={{
                          bgColor: 'transparent',
                        }}
                      ></Button>
                    </PopoverTrigger>
                    <PopoverContent w="150px">
                      <PopoverArrow />
                      <PopoverBody>
                        <Box w="100%">
                          <Box display="flex" justifyContent="space-between">
                            <Text>{t('rank')}</Text>
                            <Text>{rankMine?.rank}</Text>
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mt="12px"
                          >
                            <Text>{t('UUU')}</Text>
                            <Text>{rankMine?.num}</Text>
                          </Box>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}

                <Tooltip
                  bg="#fff"
                  color="#000"
                  w="184px"
                  h="84px"
                  borderRadius="12px"
                  label={tooltipGet()}
                  hasArrow
                  placement="top"
                >
                  <Box
                    w="12%"
                    boxShadow="0px 4px 12px 0px rgba(0,0,0,0.25)"
                    border="4px solid #C46A10;"
                    h="12%"
                    bg="#FFEBBE"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="50% 50%"
                    pos="absolute"
                    top="15%"
                    left="28%"
                  >
                    <Image w="64%" src={'/images/login/UneMeta.png'}></Image>
                    <Image
                      w="64%"
                      src={'/images/login/gm.png'}
                      pos="absolute"
                      bottom="-10%"
                      right="-38%"
                    ></Image>
                    {isLargerThan768 ? (
                      <Box
                        w="50%"
                        h="25%"
                        bg={newDate === '2023-10-28' ? '#9B532B' : '#FF7223'}
                        pos="absolute"
                        border="1px solid #000000"
                        bottom="-10%"
                        borderRadius="44px"
                      >
                        <Text
                          textAlign="center"
                          color={newDate === '2023-10-28' ? '#C59D86' : '#fff'}
                        >
                          {'Day1'}
                        </Text>
                      </Box>
                    ) : (
                      <Text
                        pos="absolute"
                        bottom="-38%"
                        fontSize="12px"
                        textAlign="center"
                        color="#000"
                      >
                        {'Day1'}
                      </Text>
                    )}
                  </Box>
                </Tooltip>

                {/* 2 */}
                {!isLargerThan768 && (
                  <Popover placement="top">
                    <PopoverTrigger>
                      <Button
                        pos="absolute"
                        zIndex={'9'}
                        w="12%"
                        h="12%"
                        bgColor="transparent"
                        top="44%"
                        left="20%"
                        _hover={{
                          bgColor: 'transparent',
                        }}
                      ></Button>
                    </PopoverTrigger>
                    <PopoverContent w="150px">
                      <PopoverArrow />
                      <PopoverBody>
                        <Box w="100%">
                          <Box display="flex" justifyContent="space-between">
                            <Text>{t('rank')}</Text>
                            <Text>{rankMine?.rank}</Text>
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mt="12px"
                          >
                            <Text>{t('UUU')}</Text>
                            <Text>{rankMine?.num}</Text>
                          </Box>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}

                <Tooltip
                  bg="#fff"
                  color="#000"
                  w="184px"
                  h="84px"
                  borderRadius="12px"
                  label={tooltipGet()}
                  hasArrow
                  placement="top"
                >
                  <Box
                    w="12%"
                    boxShadow="0px 4px 12px 0px rgba(0,0,0,0.25)"
                    border="4px solid #C46A10;"
                    h="12%"
                    bg="#FFEBBE"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="50% 50%"
                    pos="absolute"
                    top="44%"
                    left="20%"
                  >
                    <Image w="64%" src={'/images/login/CrossSpace.png'}></Image>
                    <Image
                      w="64%"
                      src={'/images/login/DIanmond.png'}
                      pos="absolute"
                      bottom="-10%"
                      right="-38%"
                    ></Image>
                    {isLargerThan768 ? (
                      <Box
                        w="50%"
                        h="25%"
                        bg={newDate === '2023-10-29' ? '#9B532B' : '#FF7223'}
                        pos="absolute"
                        border="1px solid #000000"
                        bottom="-10%"
                        borderRadius="44px"
                      >
                        <Text
                          textAlign="center"
                          color={newDate === '2023-10-29' ? '#C59D86' : '#fff'}
                        >
                          {'Day2'}
                        </Text>
                      </Box>
                    ) : (
                      <Text
                        pos="absolute"
                        bottom="-38%"
                        fontSize="12px"
                        textAlign="center"
                        color="#000"
                      >
                        {'Day2'}
                      </Text>
                    )}
                  </Box>
                </Tooltip>
                {/* 3 */}

                {!isLargerThan768 && (
                  <Popover placement="top">
                    <PopoverTrigger>
                      <Button
                        pos="absolute"
                        zIndex={'9'}
                        w="12%"
                        h="12%"
                        bgColor="transparent"
                        top="69%"
                        left="20%"
                        _hover={{
                          bgColor: 'transparent',
                        }}
                      ></Button>
                    </PopoverTrigger>
                    <PopoverContent w="150px">
                      <PopoverArrow />
                      <PopoverBody>
                        <Box w="100%">
                          <Box display="flex" justifyContent="space-between">
                            <Text>{t('rank')}</Text>
                            <Text>{rankMine?.rank}</Text>
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mt="12px"
                          >
                            <Text>{t('UUU')}</Text>
                            <Text>{rankMine?.num}</Text>
                          </Box>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}

                <Tooltip
                  bg="#fff"
                  color="#000"
                  w="184px"
                  h="84px"
                  borderRadius="12px"
                  label={tooltipGet()}
                  hasArrow
                  placement="top"
                >
                  <Box
                    w="12%"
                    boxShadow="0px 4px 12px 0px rgba(0,0,0,0.25)"
                    border="4px solid #C46A10;"
                    h="12%"
                    bg="#FFEBBE"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="50% 50%"
                    pos="absolute"
                    top="69%"
                    left="20%"
                  >
                    <Image w="64%" src={'/images/login/Ultiverse.png'}></Image>
                    <Image
                      w="64%"
                      src={'/images/login/minted.png'}
                      pos="absolute"
                      bottom="-10%"
                      right="-38%"
                    ></Image>
                    {isLargerThan768 ? (
                      <Box
                        w="50%"
                        h="25%"
                        bg={newDate === '2023-10-30' ? '#9B532B' : '#FF7223'}
                        pos="absolute"
                        border="1px solid #000000"
                        bottom="-10%"
                        borderRadius="44px"
                      >
                        <Text
                          textAlign="center"
                          color={newDate === '2023-10-30' ? '#C59D86' : '#fff'}
                        >
                          {'Day3'}
                        </Text>
                      </Box>
                    ) : (
                      <Text
                        pos="absolute"
                        bottom="-38%"
                        fontSize="12px"
                        textAlign="center"
                        color="#000"
                      >
                        {'Day3'}
                      </Text>
                    )}
                  </Box>
                </Tooltip>
                {/* 4 */}

                {!isLargerThan768 && (
                  <Popover placement="top">
                    <PopoverTrigger>
                      <Button
                        pos="absolute"
                        zIndex={'9'}
                        w="12%"
                        h="12%"
                        bgColor="transparent"
                        top="69%"
                        left="55%"
                        _hover={{
                          bgColor: 'transparent',
                        }}
                      ></Button>
                    </PopoverTrigger>
                    <PopoverContent w="150px">
                      <PopoverArrow />
                      <PopoverBody>
                        <Box w="100%">
                          <Box display="flex" justifyContent="space-between">
                            <Text>{t('rank')}</Text>
                            <Text>{rankMine?.rank}</Text>
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mt="12px"
                          >
                            <Text>{t('UUU')}</Text>
                            <Text>{rankMine?.num}</Text>
                          </Box>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}

                <Tooltip
                  bg="#fff"
                  color="#000"
                  w="184px"
                  h="84px"
                  borderRadius="12px"
                  label={tooltipGet()}
                  hasArrow
                  placement="top"
                >
                  <Box
                    w="12%"
                    boxShadow="0px 4px 12px 0px rgba(0,0,0,0.25)"
                    border="4px solid #C46A10;"
                    h="12%"
                    bg="#FFEBBE"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="50% 50%"
                    pos="absolute"
                    top="69%"
                    left="55%"
                  >
                    <Image w="64%" src={'/images/login/MIXMARVEL.png'}></Image>
                    <Image
                      w="64%"
                      src={'/images/login/HODL.png'}
                      pos="absolute"
                      bottom="-10%"
                      right="-38%"
                    ></Image>
                    {isLargerThan768 ? (
                      <Box
                        w="50%"
                        h="25%"
                        bg={newDate === '2023-10-31' ? '#9B532B' : '#FF7223'}
                        pos="absolute"
                        border="1px solid #000000"
                        bottom="-10%"
                        borderRadius="44px"
                      >
                        <Text
                          textAlign="center"
                          color={newDate === '2023-10-31' ? '#C59D86' : '#fff'}
                        >
                          {'Day4'}
                        </Text>
                      </Box>
                    ) : (
                      <Text
                        pos="absolute"
                        bottom="-38%"
                        fontSize="12px"
                        textAlign="center"
                        color="#000"
                      >
                        {'Day4'}
                      </Text>
                    )}
                  </Box>
                </Tooltip>
                {/* 5 */}
                {!isLargerThan768 && (
                  <Popover placement="top">
                    <PopoverTrigger>
                      <Button
                        pos="absolute"
                        zIndex={'9'}
                        w="12%"
                        h="12%"
                        bgColor="transparent"
                        top="56%"
                        left="74%"
                        _hover={{
                          bgColor: 'transparent',
                        }}
                      ></Button>
                    </PopoverTrigger>
                    <PopoverContent w="150px">
                      <PopoverArrow />
                      <PopoverBody>
                        <Box w="100%">
                          <Box display="flex" justifyContent="space-between">
                            <Text>{t('rank')}</Text>
                            <Text>{rankMine?.rank}</Text>
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mt="12px"
                          >
                            <Text>{t('UUU')}</Text>
                            <Text>{rankMine?.num}</Text>
                          </Box>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}

                <Tooltip
                  bg="#fff"
                  color="#000"
                  w="184px"
                  h="84px"
                  borderRadius="12px"
                  label={tooltipGet()}
                  hasArrow
                  placement="top"
                >
                  <Box
                    w="12%"
                    boxShadow="0px 4px 12px 0px rgba(0,0,0,0.25)"
                    border="4px solid #C46A10;"
                    h="12%"
                    bg="#FFEBBE"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="50% 50%"
                    pos="absolute"
                    top="56%"
                    left="74%"
                  >
                    <Image w="64%" src={'/images/login/Relation.png'}></Image>
                    <Image
                      w="64%"
                      src={'/images/login/dance.png'}
                      pos="absolute"
                      bottom="-10%"
                      right="-38%"
                    ></Image>
                    {isLargerThan768 ? (
                      <Box
                        w="50%"
                        h="25%"
                        bg={newDate === '2023-11-1' ? '#9B532B' : '#FF7223'}
                        pos="absolute"
                        border="1px solid #000000"
                        bottom="-10%"
                        borderRadius="44px"
                      >
                        <Text
                          textAlign="center"
                          color={newDate === '2023-11-1' ? '#C59D86' : '#fff'}
                        >
                          {'Day5'}
                        </Text>
                      </Box>
                    ) : (
                      <Text
                        pos="absolute"
                        bottom="-38%"
                        fontSize="12px"
                        textAlign="center"
                        color="#000"
                      >
                        {'Day5'}
                      </Text>
                    )}
                  </Box>
                </Tooltip>
                {/* 6 */}

                {!isLargerThan768 && (
                  <Popover placement="top">
                    <PopoverTrigger>
                      <Button
                        pos="absolute"
                        zIndex={'9'}
                        w="12%"
                        h="12%"
                        bgColor="transparent"
                        top="41%"
                        left="41%"
                        _hover={{
                          bgColor: 'transparent',
                        }}
                      ></Button>
                    </PopoverTrigger>
                    <PopoverContent w="150px">
                      <PopoverArrow />
                      <PopoverBody>
                        <Box w="100%">
                          <Box display="flex" justifyContent="space-between">
                            <Text>{t('rank')}</Text>
                            <Text>{rankMine?.rank}</Text>
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mt="12px"
                          >
                            <Text>{t('UUU')}</Text>
                            <Text>{rankMine?.num}</Text>
                          </Box>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}

                <Tooltip
                  bg="#fff"
                  color="#000"
                  w="184px"
                  h="84px"
                  borderRadius="12px"
                  label={tooltipGet()}
                  hasArrow
                  placement="top"
                >
                  <Box
                    w="12%"
                    boxShadow="0px 4px 12px 0px rgba(0,0,0,0.25)"
                    border="4px solid #C46A10;"
                    h="12%"
                    bg="#FFEBBE"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="50% 50%"
                    pos="absolute"
                    top="41%"
                    left="41%"
                  >
                    <Image w="64%" src={'/images/login/yuliverse.png'}></Image>
                    <Image
                      w="64%"
                      src={'/images/login/biu.png'}
                      pos="absolute"
                      bottom="-10%"
                      right="-38%"
                    ></Image>
                    {isLargerThan768 ? (
                      <Box
                        w="50%"
                        h="25%"
                        bg={newDate === '2023-11-2' ? '#9B532B' : '#FF7223'}
                        pos="absolute"
                        border="1px solid #000000"
                        bottom="-10%"
                        borderRadius="44px"
                      >
                        <Text
                          textAlign="center"
                          color={newDate === '2023-11-2' ? '#C59D86' : '#fff'}
                        >
                          {'Day6'}
                        </Text>
                      </Box>
                    ) : (
                      <Text
                        pos="absolute"
                        bottom="-38%"
                        fontSize="12px"
                        textAlign="center"
                        color="#000"
                      >
                        {'Day6'}
                      </Text>
                    )}
                  </Box>
                </Tooltip>
                {/* 7 */}
                {!isLargerThan768 && (
                  <Popover placement="top">
                    <PopoverTrigger>
                      <Button
                        pos="absolute"
                        zIndex={'9'}
                        w="12%"
                        h="12%"
                        bgColor="transparent"
                        top="16%"
                        left="60%"
                        _hover={{
                          bgColor: 'transparent',
                        }}
                      ></Button>
                    </PopoverTrigger>
                    <PopoverContent w="150px">
                      <PopoverArrow />
                      <PopoverBody>
                        <Box w="100%">
                          <Box display="flex" justifyContent="space-between">
                            <Text>{t('rank')}</Text>
                            <Text>{rankMine?.rank}</Text>
                          </Box>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            mt="12px"
                          >
                            <Text>{t('UUU')}</Text>
                            <Text>{rankMine?.num}</Text>
                          </Box>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )}

                <Tooltip
                  bg="#fff"
                  color="#000"
                  w="184px"
                  h="84px"
                  borderRadius="12px"
                  label={tooltipGet()}
                  hasArrow
                  placement="top"
                >
                  <Box
                    w="12%"
                    boxShadow="0px 4px 12px 0px rgba(0,0,0,0.25)"
                    border="4px solid #C46A10;"
                    h="12%"
                    bg="#FFEBBE"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="50% 50%"
                    pos="absolute"
                    top="16%"
                    left="60%"
                  >
                    <Image w="64%" src={'/images/login/C-Cubed.png'}></Image>
                    <Image
                      w="64%"
                      src={'/images/login/Thank.png'}
                      pos="absolute"
                      bottom="-10%"
                      right="-38%"
                    ></Image>
                    {isLargerThan768 ? (
                      <Box
                        w="50%"
                        h="25%"
                        bg={newDate === '2023-11-3' ? '#9B532B' : '#FF7223'}
                        pos="absolute"
                        border="1px solid #000000"
                        bottom="-10%"
                        borderRadius="44px"
                      >
                        <Text
                          textAlign="center"
                          color={newDate === '2023-11-3' ? '#C59D86' : '#fff'}
                        >
                          {'Day7'}
                        </Text>
                      </Box>
                    ) : (
                      <Text
                        pos="absolute"
                        bottom="-38%"
                        fontSize="12px"
                        textAlign="center"
                        color="#000"
                      >
                        {'Day7'}
                      </Text>
                    )}
                  </Box>
                </Tooltip>
                {/* 领奖 */}
                {/* {rankMine?.status && resultOpen && (
                  <Popover isOpen placement="top">
                    <PopoverTrigger>
                      <Box pos="absolute" top="17%" left="66%"></Box>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <Box textAlign={'center'}>
                          <CountdownTimer />
                        </Box>
                        <Box display="flex" justifyContent="center" mt="8px">
                          <Button
                            isDisabled={infoData?.reward_status ? true : false}
                            bg="#FB9D42"
                            w={'120px'}
                            h={'32px'}
                            borderColor={'#FB9D42'}
                            _hover={{
                              bg: '#FB9D42',
                            }}
                            color={'white'}
                            onClick={openMFun}
                          >
                            {t('infoModal.submit')}
                          </Button>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                )} */}
              </>
            </Box>
            {isLargerThan768 ? (
              <Box bg="#FFE3C9" borderRadius="1%" flex="1" h="100%">
                <Text
                  fontFamily="MicrosoftYaHei"
                  fontWeight="700"
                  fontSize="24px"
                  color="#000"
                  whiteSpace="nowrap"
                  textAlign="center"
                  p="20px 0"
                  borderBottom="2px solid #FFCA97"
                >
                  {t('leaderboard')}
                </Text>
                <Box
                  px="20px"
                  pb="30px"
                  borderBottom="1px solid rgba(0,0,0,0.12)"
                >
                  <Flex alignItems={'center'} mb="16px"></Flex>
                  <Text
                    py="6px"
                    border="2px solid #FFCA97;"
                    background="#FFCA97"
                    rounded="4px"
                    fontSize="14px"
                    mb="20px"
                    textAlign="left"
                    px="10px"
                  >
                    {t('doc')}
                  </Text>
                  <Box>
                    <Flex pb="24px" borderBottom="1px solid rgba(0,0,0,.2)">
                      <Text width="18%" fontSize="14px" color="rgba(0,0,0,0.8)">
                        {t('rank')}
                      </Text>
                      <Text width="60%" fontSize="14px" color="rgba(0,0,0,0.8)">
                        {t('name')}
                      </Text>
                      <Text
                        flex="1"
                        fontSize="14px"
                        color="rgba(0,0,0,0.8)"
                        textAlign="right"
                        whiteSpace="nowrap"
                      >
                        {t('UUU')}
                      </Text>
                    </Flex>
                    {rankList.map((v: any, index: number) => (
                      <Flex
                        key={`${v?.wallet}${Math.random()}`}
                        // px="12px"
                        py="18px"
                        borderBottom="1px solid rgba(0,0,0,.2)"
                        background={
                          index + 1 == rankMine?.rank
                            ? 'rgba(226,225,239, 0.4)'
                            : 'transparent'
                        }
                      >
                        <Box width="18%">
                          {index <= 2 ? (
                            <Image
                              width="28px"
                              objectFit={'contain'}
                              src={bgStyle[index]}
                            ></Image>
                          ) : (
                            <Text
                              width="28px"
                              py="3px"
                              fontSize="14px"
                              textAlign="center"
                              color="rgba(0,0,0,0.4)"
                            >
                              {v?.rank}
                            </Text>
                          )}
                        </Box>
                        <Flex width="60%" alignItems="center">
                          {
                            <ShimmerImage
                              w="32px"
                              h="32px"
                              src={
                                v?.image
                                  ? v?.image
                                  : 'https://res.cloudinary.com/unemeta/image/upload/f_auto,q_auto/v1/samples/ai5v6ihpkkkkpybo4znl'
                              }
                              mr="8px"
                              rounded="full"
                              border={'1px solid #F7F8FA'}
                            />
                          }
                          <Text fontSize="14px" color="#000">
                            {v?.nick_name?.slice(0, 10)}
                          </Text>
                        </Flex>
                        <Box flex="1">
                          <Text fontSize="14px" textAlign="right">
                            {v?.num}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                    {/* 已登录 */}
                    {userData?.wallet_address ? (
                      <Box bg="#FC9E43" px="10px" borderRadius="8px">
                        <Flex
                          key={userData?.wallet_address}
                          alignItems="center"
                          mt="16px"
                          borderBottom="1px solid rgba(0,0,0,.2)"
                          py="10px"
                          borderTopLeftRadius="4px"
                          borderTopRightRadius="4px"
                        >
                          <Box width="18%">
                            <Text
                              py="3px"
                              fontSize="14px"
                              textAlign="left"
                              color="rgba(0,0,0,0.4)"
                            >
                              {rankMine?.status ? rankMine?.rank : null}
                              {!rankMine?.status && rankMine?.diff > 0
                                ? t('unrank')
                                : null}
                              {!rankMine?.status && rankMine?.diff <= 0
                                ? t('ranked')
                                : null}
                            </Text>
                          </Box>
                          <Flex width="60%" alignItems="center">
                            <ShimmerImage
                              w="32px"
                              h="32px"
                              src={userData?.profile_image}
                              mr="8px"
                              rounded="full"
                            />
                            <Text fontSize="14px" color="#000">
                              {userData?.username}
                            </Text>
                          </Flex>
                          <Box flex="1">
                            <Text fontSize="14px" textAlign="right">
                              {rankMine?.num}
                            </Text>
                          </Box>
                        </Flex>
                        {!rankMine?.status ? (
                          <Box p="10px" textAlign="center">
                            {rankMine?.diff > 0
                              ? t('gitOn', { x: rankMine?.diff })
                              : null}
                            {rankMine?.diff <= 0 ? t('gitIn') : null}
                            {/* // Need {rankMine?.diff} more diamonds to make it onto
                          // the list. */}
                          </Box>
                        ) : null}
                      </Box>
                    ) : null}
                    {/* 未登录 */}
                    {!userData?.wallet_address ? (
                      <Box
                        width="100%"
                        bg="#FC9E43"
                        borderRadius="8px"
                        p="10px"
                        mt="16px"
                        onClick={() => {
                          web2LoginModal?.current?.open();
                        }}
                      >
                        <Text
                          width="100%"
                          py="3px"
                          fontSize="14px"
                          textAlign="center"
                          color="rgba(0,0,0)"
                        >
                          {t('loginRank')}
                        </Text>
                      </Box>
                    ) : null}
                  </Box>
                </Box>
              </Box>
            ) : (
              <Modal
                size="full"
                onClose={onCloseRankModel}
                isOpen={isRankModalOpen}
                motionPreset="slideInRight"
              >
                <ModalContent>
                  <ModalBody px={0}>
                    <Box bg="#FFE3C9" borderRadius="1%" flex="1" h="100%">
                      <ShimmerImage
                        w="20px"
                        h="20px"
                        pos="absolute"
                        top="24px"
                        left="20px"
                        src="https://res.cloudinary.com/unemeta/image/upload/v1691323217/%E5%90%91%E4%B8%8B_2x_sgrq8n.png"
                        onClick={onCloseRankModel}
                      />
                      <Text
                        fontFamily="MicrosoftYaHei"
                        fontWeight="700"
                        fontSize="24px"
                        color="#000"
                        whiteSpace="nowrap"
                        textAlign="center"
                        p="20px 0"
                        borderBottom="2px solid #FFCA97"
                      >
                        {t('leaderboard')}
                      </Text>
                      <Box
                        px="20px"
                        pb="30px"
                        borderBottom="1px solid rgba(0,0,0,0.12)"
                      >
                        <Flex alignItems={'center'} mb="16px"></Flex>
                        <Text
                          py="6px"
                          border="2px solid #FFCA97;"
                          background="#FFCA97"
                          rounded="4px"
                          fontSize="14px"
                          mb="20px"
                          textAlign="left"
                          px="10px"
                        >
                          {t('doc')}
                        </Text>
                        <Box>
                          <Flex
                            pb="24px"
                            borderBottom="1px solid rgba(0,0,0,.2)"
                          >
                            <Text
                              width="18%"
                              fontSize="14px"
                              color="rgba(0,0,0,0.8)"
                            >
                              {t('rank')}
                            </Text>
                            <Text
                              width="60%"
                              fontSize="14px"
                              color="rgba(0,0,0,0.8)"
                            >
                              {t('name')}
                            </Text>
                            <Text
                              flex="1"
                              fontSize="14px"
                              color="rgba(0,0,0,0.8)"
                              textAlign="right"
                              whiteSpace="nowrap"
                            >
                              {t('UUU')}
                            </Text>
                          </Flex>
                          {rankList.map((v: any, index: number) => (
                            <Flex
                              key={`${v?.wallet}${Math.random()}`}
                              py="18px"
                              borderBottom="1px solid rgba(0,0,0,.2)"
                              background={
                                index + 1 == rankMine?.rank
                                  ? 'rgba(226,225,239, 0.4)'
                                  : 'transparent'
                              }
                            >
                              <Box width="18%">
                                {index <= 2 ? (
                                  <Image
                                    width="28px"
                                    objectFit={'contain'}
                                    src={bgStyle[index]}
                                  ></Image>
                                ) : (
                                  <Text
                                    width="28px"
                                    py="3px"
                                    fontSize="14px"
                                    textAlign="center"
                                    color="rgba(0,0,0,0.4)"
                                  >
                                    {v?.rank}
                                  </Text>
                                )}
                              </Box>
                              <Flex width="60%" alignItems="center">
                                {
                                  <ShimmerImage
                                    w="32px"
                                    h="32px"
                                    src={
                                      v?.image
                                        ? v?.image
                                        : 'https://res.cloudinary.com/unemeta/image/upload/f_auto,q_auto/v1/samples/ai5v6ihpkkkkpybo4znl'
                                    }
                                    mr="8px"
                                    rounded="full"
                                    border={'1px solid #F7F8FA'}
                                  />
                                }
                                <Text fontSize="14px" color="#000">
                                  {v?.nick_name?.slice(0, 10)}
                                </Text>
                              </Flex>
                              <Box flex="1">
                                <Text fontSize="14px" textAlign="right">
                                  {v?.num}
                                </Text>
                              </Box>
                            </Flex>
                          ))}
                          {/* 已登录 */}
                          {userData?.wallet_address ? (
                            <Box bg="#FC9E43" px="10px" borderRadius="8px">
                              <Flex
                                key={userData?.wallet_address}
                                alignItems="center"
                                mt="16px"
                                borderBottom="1px solid rgba(0,0,0,.2)"
                                py="10px"
                                borderTopLeftRadius="4px"
                                borderTopRightRadius="4px"
                              >
                                <Box width="18%">
                                  <Text
                                    py="3px"
                                    fontSize="14px"
                                    textAlign="left"
                                    color="rgba(0,0,0,0.4)"
                                  >
                                    {rankMine?.status ? rankMine?.rank : null}
                                    {!rankMine?.status && rankMine?.diff > 0
                                      ? t('unrank')
                                      : null}
                                    {!rankMine?.status && rankMine?.diff <= 0
                                      ? t('ranked')
                                      : null}
                                  </Text>
                                </Box>
                                <Flex width="60%" alignItems="center">
                                  <ShimmerImage
                                    w="32px"
                                    h="32px"
                                    src={userData?.profile_image}
                                    mr="8px"
                                    rounded="full"
                                  />
                                  <Text fontSize="14px" color="#000">
                                    {userData?.username}
                                  </Text>
                                </Flex>
                                <Box flex="1">
                                  <Text fontSize="14px" textAlign="right">
                                    {rankMine?.num}
                                  </Text>
                                </Box>
                              </Flex>
                              {!rankMine?.status ? (
                                <Box p="10px" textAlign="center">
                                  {rankMine?.diff > 0
                                    ? t('gitOn', { x: rankMine?.diff })
                                    : null}
                                  {rankMine?.diff <= 0 ? t('gitIn') : null}
                                  {/* Need {rankMine?.diff} more diamonds to make it
                                onto the list. */}
                                </Box>
                              ) : null}
                            </Box>
                          ) : null}
                          {/* 未登录 */}
                          {!userData?.wallet_address ? (
                            <Box
                              width="100%"
                              bg="#FC9E43"
                              borderRadius="8px"
                              p="10px"
                              mt="16px"
                              onClick={() => {
                                web2LoginModal?.current?.open();
                              }}
                            >
                              <Text
                                width="100%"
                                py="3px"
                                fontSize="14px"
                                textAlign="center"
                                color="rgba(0,0,0)"
                              >
                                {t('loginRank')}
                              </Text>
                            </Box>
                          ) : null}
                        </Box>
                      </Box>
                    </Box>
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
          </Box>
          {!isLargerThan768 ? (
            <Box
              mt={'20px'}
              display="flex"
              gridColumnGap="20px"
              pl="20px"
              pr="20px"
            >
              <Box borderRadius={'8px'} bg="#FFE3C9" w={'100%'}>
                <Text
                  p="12px"
                  fontSize={14}
                  fontWeight="600"
                  borderBottom={'2px solid #FFCA97;'}
                >
                  {t('itsvalue')}
                </Text>
                <Box p="12px">
                  <Text fontSize={12}>{t('itsvalueDos')}</Text>
                  <Text fontSize={12}>{t('itsvalueDos2')}</Text>
                </Box>
              </Box>
            </Box>
          ) : null}
        </Box>

        {!isLargerThan768 ? (
          <Box
            display="flex"
            justifyContent="space-between"
            p="16px"
            bg="#FB9D42"
            gridColumnGap="20px"
          >
            <Box
              w="50%"
              boxShadow="4px 4px 0px 0px #BF5E00"
              border="2px solid #000000"
              h="40px"
              bg="#FFE3C9"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="70px"
              onClick={scrollToElement}
            >
              {t('ObtainNow')}
            </Box>
            <Box
              w="50%"
              boxShadow="4px 4px 0px 0px #BF5E00"
              border="2px solid #000000"
              h="40px"
              bg="#FFE3C9"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="70px"
              onClick={onOpenRankModel}
            >
              {t('viewLeaderboard')}
            </Box>
          </Box>
        ) : null}
        <Box px={'20px'} bg={'#FB9D42'} py={'40px'}>
          <div id="my-element"></div>
          <Text fontSize={'24px'} mb={'32px'} color={'#fff'}>
            {t('Readexcitingarticles')} ({readProgress.complete}/{'10'})
          </Text>
          <SimpleGrid columns={{ sm: 1, md: 4 }} spacing="40px" mb={'40px'}>
            {news.map((item) => {
              return (
                <Box bg="#502700" height="457px" borderRadius={'20px'}>
                  <ShimmerImage
                    objectFit="cover"
                    src={item.img}
                    h={'254px'}
                    borderRadius={'20px 20px 0 0'}
                  ></ShimmerImage>
                  <Box padding={'16px'}>
                    <Text
                      fontSize={'16px'}
                      fontWeight={'bold'}
                      color={'#fff'}
                      noOfLines={2}
                      h={'48px'}
                    >
                      {t(item.title as any)}
                    </Text>
                    <Text
                      fontSize={'14px'}
                      color={'#fff'}
                      noOfLines={2}
                      mt={'4px'}
                    >
                      {item.subTitle ? t(item.subTitle as any) : ''}
                      {/* I apologize for any confusion. As an AI language model, I
                    don't have the capability to grant or provide permissions for
                    accessing specific attachments or files. Permission to access
                    an attachment is typically granted by the owner or sender of
                    the file. */}
                    </Text>
                    <HStack align={'center'} mt={'16px'}>
                      <Image
                        src={'/images/login/ucoin.png'}
                        width={'24px'}
                        height={'24px'}
                      ></Image>
                      <Text
                        color={'#fff'}
                        fontSize={'20px'}
                        fontWeight={'bold'}
                      >
                        +1
                      </Text>
                    </HStack>
                    <Button
                      color={'#fff'}
                      fontSize={'14px'}
                      bg={'#FB9D42'}
                      textAlign="center"
                      h={'42px'}
                      mt={'16px'}
                      lineHeight={'42px'}
                      borderRadius={'12px'}
                      w={'100%'}
                      onClick={() => {
                        toArticles(Number(item.readId));
                      }}
                      opacity={taskInfo.news_read[item.readId] ? '0.4' : '1'}
                    >
                      {taskInfo.news_read[item.readId]
                        ? t('Completed')
                        : t('Gotocomplete')}
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
          <Text fontSize={'24px'} mb={'32px'} color={'#fff'}>
            Regular tasks ({regularLength}/4)
          </Text>
          <SimpleGrid columns={{ sm: 1, md: 4 }} spacing="20px" mb={'40px'}>
            <Box bg="#502700" height="528px" borderRadius={'20px'}>
              <Image
                src="/images/login/c1.png"
                h={'254px'}
                borderRadius={'20px 20px 0 0'}
                w={'100%'}
                objectFit="cover"
              ></Image>
              <Box padding={'16px'}>
                <Box height={'140px'}>
                  <Text
                    fontSize={'16px'}
                    fontWeight={'bold'}
                    color={'#fff'}
                    noOfLines={1}
                  >
                    {t('Pwra')}
                  </Text>
                  <Text
                    fontSize={'14px'}
                    color={'#fff'}
                    noOfLines={2}
                    mt={'4px'}
                  >
                    {t('Pwra2')}
                  </Text>
                </Box>

                <HStack align={'center'} mt={'16px'}>
                  <Image
                    src={'/images/login/ucoin.png'}
                    width={'24px'}
                    height={'24px'}
                  ></Image>
                  <Text color={'#fff'} fontSize={'20px'} fontWeight={'bold'}>
                    +2
                  </Text>
                </HStack>
                <Button
                  color={'#fff'}
                  fontSize={'14px'}
                  bg={'#FB9D42'}
                  textAlign="center"
                  h={'42px'}
                  mt={'16px'}
                  lineHeight={'42px'}
                  borderRadius={'12px'}
                  w={'100%'}
                  opacity={taskInfo.wallet_rating ? '0.4' : '1'}
                  // isDisabled={taskInfo.wallet_rating}
                  onClick={() => {
                    toAnniversaryCelebration();
                  }}
                >
                  {taskInfo.wallet_rating ? t('Completed') : t('Gotocomplete')}
                </Button>
              </Box>
            </Box>
            <Box bg="#502700" height="528px" borderRadius={'20px'}>
              <Image
                src="/images/login/c2.png"
                h={'254px'}
                borderRadius={'20px 20px 0 0'}
                w={'100%'}
                objectFit="cover"
              ></Image>
              <Box padding={'16px'}>
                <Box height={'140px'}>
                  <Text
                    fontSize={'16px'}
                    fontWeight={'bold'}
                    color={'#fff'}
                    noOfLines={1}
                  >
                    {t('DailycheckIn')} ({taskInfo.check_in_nums}/14)
                  </Text>
                  <Text fontSize={'14px'} color={'#fff'} mt={'4px'}>
                    {t('DailycheckInC')}
                  </Text>
                </Box>

                <HStack align={'center'} mt={'16px'}>
                  <Image
                    src={'/images/login/ucoin.png'}
                    width={'24px'}
                    height={'24px'}
                  ></Image>
                  <Text color={'#fff'} fontSize={'20px'} fontWeight={'bold'}>
                    +1
                  </Text>
                  <Text color={'#fff'} fontSize={'12px'}>
                    （Once a day）
                  </Text>
                </HStack>
                <Button
                  color={'#fff'}
                  fontSize={'14px'}
                  bg={'#FB9D42'}
                  textAlign="center"
                  h={'42px'}
                  mt={'16px'}
                  lineHeight={'42px'}
                  borderRadius={'12px'}
                  w={'100%'}
                  onClick={() => {
                    checkIn();
                  }}
                  isDisabled={taskInfo.today_check_in}
                >
                  {taskInfo.today_check_in ? (
                    <Box>
                      {t('Completed')}({taskInfo.check_in_nums}/14)
                    </Box>
                  ) : (
                    <Box>
                      {t('Gotocomplete')} ({taskInfo.check_in_nums}/14)
                    </Box>
                  )}
                </Button>
              </Box>
            </Box>
            <Box bg="#502700" height="528px" borderRadius={'20px'}>
              <Image
                src="/images/login/c3.png"
                h={'254px'}
                borderRadius={'20px 20px 0 0'}
                w={'100%'}
                objectFit="cover"
              ></Image>
              <Box padding={'16px'}>
                <Box height={'140px'}>
                  <Text
                    fontSize={'16px'}
                    fontWeight={'bold'}
                    color={'#fff'}
                    noOfLines={1}
                  >
                    {t('InvitefriendsT')}
                  </Text>
                  <Text fontSize={'14px'} color={'#fff'} mt={'4px'}>
                    {t('InvitefriendsC')}
                  </Text>
                </Box>

                <HStack align={'center'} mt={'16px'}>
                  <Image
                    src={'/images/login/ucoin.png'}
                    width={'24px'}
                    height={'24px'}
                  ></Image>
                  <Text color={'#fff'} fontSize={'20px'} fontWeight={'bold'}>
                    +1
                  </Text>
                  <Text color={'#fff'} fontSize={'12px'}>
                    （Limit of 20）
                  </Text>
                </HStack>
                <Button
                  color={'#fff'}
                  fontSize={'14px'}
                  bg={'#FB9D42'}
                  textAlign="center"
                  h={'42px'}
                  mt={'16px'}
                  lineHeight={'42px'}
                  borderRadius={'12px'}
                  w={'100%'}
                  onClick={() => {
                    toInvite();
                  }}
                >
                  {t('Gotocomplete')} ({taskInfo.invited}/20)
                </Button>
              </Box>
            </Box>
            <Box bg="#502700" height="528px" borderRadius={'20px'}>
              <Image
                src="/images/login/c4.png"
                h={'254px'}
                borderRadius={'20px 20px 0 0'}
                w={'100%'}
                objectFit="cover"
              ></Image>
              <Box padding={'16px'}>
                <Box height={'140px'}>
                  <Text
                    fontSize={'16px'}
                    fontWeight={'bold'}
                    color={'#fff'}
                    noOfLines={1}
                  >
                    {t('list')}
                  </Text>
                  <Text fontSize={'14px'} color={'#fff'} mt={'4px'}>
                    {t('CompletedListing2')}
                  </Text>
                </Box>
                <HStack align={'center'} mt={'16px'}>
                  <Image
                    src={'/images/login/ucoin.png'}
                    width={'24px'}
                    height={'24px'}
                  ></Image>
                  <Text color={'#fff'} fontSize={'20px'} fontWeight={'bold'}>
                    +2
                  </Text>
                  <Text color={'#fff'} fontSize={'12px'}>
                    （Unlimited）
                  </Text>
                </HStack>
                <Button
                  color={'#fff'}
                  fontSize={'14px'}
                  bg={'#FB9D42'}
                  textAlign="center"
                  h={'42px'}
                  mt={'16px'}
                  lineHeight={'42px'}
                  borderRadius={'12px'}
                  w={'100%'}
                  onClick={() => {
                    toUser();
                  }}
                >
                  {t('Gotocomplete')}
                </Button>
              </Box>
            </Box>
          </SimpleGrid>
          <Text fontSize={'24px'} mb={'32px'} color={'#fff'}>
            {t('CompleteSocialTasks')} ({socialProgress.complete}/{'7'})
          </Text>
          <SimpleGrid columns={{ sm: 1, md: 4 }} spacing="40px">
            <Box bg="#502700" height="496px" borderRadius={'20px'}>
              <Image
                src="/images/login/ctw.png"
                h={'254px'}
                borderRadius={'20px 20px 0 0'}
                w={'100%'}
                objectFit="cover"
              ></Image>
              <Box padding={'16px'}>
                <Text
                  fontSize={'16px'}
                  fontWeight={'bold'}
                  color={'#fff'}
                  noOfLines={1}
                >
                  {t('FollowTwitterAccount')}
                </Text>
                <HStack align={'center'} mt={'16px'}>
                  <Image
                    src={'/images/login/ucoin.png'}
                    width={'24px'}
                    height={'24px'}
                  ></Image>
                  <Text color={'#fff'} fontSize={'20px'} fontWeight={'bold'}>
                    +1
                  </Text>
                  {/* <Text color={'#fff'} fontSize={'12px'}>
                    (0/1)
                  </Text> */}
                </HStack>
                <HStack justify={'space-between'} mb={'16px'}>
                  <Text fontSize={'14px'} color={'#fff'}>
                    Follow @UNE_METAVERSE
                  </Text>
                  <Button
                    color={'#fff'}
                    fontSize={'12px'}
                    bg={'#FB9D42'}
                    textAlign="center"
                    h={'32px'}
                    lineHeight={'32px'}
                    borderRadius={'8px'}
                    w={'120px'}
                    onClick={() => twAction(1, 1)}
                    isDisabled={taskInfo.twitter_follow.follow1}
                  >
                    {taskInfo.twitter_follow.follow1 ? (
                      <Box>{t('Completed')}</Box>
                    ) : (
                      <Box>{t('Gotocomplete')}</Box>
                    )}
                  </Button>
                </HStack>
                <HStack justify={'space-between'} mb={'16px'}>
                  <Text fontSize={'14px'} color={'#fff'}>
                    Follow @UneMeta_Japan
                  </Text>
                  <Button
                    color={'#fff'}
                    fontSize={'12px'}
                    bg={'#FB9D42'}
                    textAlign="center"
                    h={'32px'}
                    lineHeight={'32px'}
                    borderRadius={'8px'}
                    w={'120px'}
                    isDisabled={taskInfo.twitter_follow.follow2}
                    onClick={() => twAction(1, 2)}
                  >
                    {taskInfo.twitter_follow.follow2 ? (
                      <Box>{t('Completed')}</Box>
                    ) : (
                      <Box>{t('Gotocomplete')}</Box>
                    )}
                  </Button>
                </HStack>
                <HStack justify={'space-between'} mb={'16px'}>
                  <Text fontSize={'14px'} color={'#fff'}>
                    Follow @UneMeta_Mascot
                  </Text>
                  <Button
                    color={'#fff'}
                    fontSize={'12px'}
                    bg={'#FB9D42'}
                    textAlign="center"
                    h={'32px'}
                    lineHeight={'32px'}
                    borderRadius={'8px'}
                    w={'120px'}
                    onClick={() => twAction(1, 3)}
                    isDisabled={taskInfo.twitter_follow.follow3}
                  >
                    {taskInfo.twitter_follow.follow3 ? (
                      <Box>{t('Completed')}</Box>
                    ) : (
                      <Box>{t('Gotocomplete')}</Box>
                    )}
                  </Button>
                </HStack>
              </Box>
            </Box>
            <Box bg="#502700" height="496px" borderRadius={'20px'}>
              <Image
                src="/images/login/cdc.png"
                h={'254px'}
                borderRadius={'20px 20px 0 0'}
                w={'100%'}
                objectFit="cover"
              ></Image>
              <Box padding={'16px'}>
                <Text
                  fontSize={'16px'}
                  fontWeight={'bold'}
                  color={'#fff'}
                  noOfLines={1}
                >
                  {t('JoinDC')}
                </Text>
                <Text
                  fontSize={'14px'}
                  color={'#fff'}
                  noOfLines={2}
                  mt={'4px'}
                ></Text>
                <HStack align={'center'} mt={'16px'}>
                  <Image
                    src={'/images/login/ucoin.png'}
                    width={'24px'}
                    height={'24px'}
                  ></Image>
                  <Text color={'#fff'} fontSize={'20px'} fontWeight={'bold'}>
                    +1
                  </Text>
                  {/* <Text color={'#fff'} fontSize={'12px'}>
                    (0/1)
                  </Text> */}
                </HStack>
                <Button
                  color={'#fff'}
                  fontSize={'14px'}
                  bg={'#FB9D42'}
                  textAlign="center"
                  h={'42px'}
                  mt={'55px'}
                  lineHeight={'42px'}
                  borderRadius={'12px'}
                  w={'100%'}
                  onClick={() => {
                    dcJoin();
                  }}
                  isDisabled={taskInfo.discord_guild_joined}
                >
                  {taskInfo.discord_guild_joined ? (
                    <Box>{t('Completed')}</Box>
                  ) : (
                    <Box>{t('Gotocomplete')}</Box>
                  )}
                </Button>
              </Box>
            </Box>
            <Box bg="#502700" height="496px" borderRadius={'20px'}>
              <Image
                src="/images/login/ctw.png"
                h={'254px'}
                borderRadius={'20px 20px 0 0'}
                w={'100%'}
                objectFit="cover"
              ></Image>
              <Box padding={'16px'}>
                <Text
                  fontSize={'16px'}
                  fontWeight={'bold'}
                  color={'#fff'}
                  noOfLines={1}
                >
                  {t('LikeRetweet')} Twitter1 post
                </Text>
                <Text
                  fontSize={'14px'}
                  color={'#fff'}
                  noOfLines={2}
                  mt={'4px'}
                ></Text>
                <HStack align={'center'} mt={'16px'}>
                  <Image
                    src={'/images/login/ucoin.png'}
                    width={'24px'}
                    height={'24px'}
                  ></Image>
                  <Text color={'#fff'} fontSize={'20px'} fontWeight={'bold'}>
                    +1
                  </Text>
                  {/* <Text color={'#fff'} fontSize={'12px'}>
                    (0/1)
                  </Text> */}
                </HStack>
                <Text color={'#fff'} fontSize={'12px'} noOfLines={3}>
                  / UneMeta is 1 year old !!! \ In the past year, we have met
                  many trustworthy partners and witnessed the changes in the
                  industry together. We sincerely thank everyone who supports
                  us! To commemorate this historic moment, UneMeta has prepared
                  four fun events to give back to our loyal community
                </Text>
                <Button
                  color={'#fff'}
                  fontSize={'14px'}
                  bg={'#FB9D42'}
                  textAlign="center"
                  h={'42px'}
                  mt={'40px'}
                  lineHeight={'42px'}
                  borderRadius={'12px'}
                  w={'100%'}
                  isDisabled={taskInfo.twitter_retweet['1']}
                  onClick={() => twAction(2, 1)}
                >
                  {taskInfo.twitter_retweet['1'] ? (
                    <Box>{t('Completed')}</Box>
                  ) : (
                    <Box>{t('Gotocomplete')}</Box>
                  )}
                </Button>
              </Box>
            </Box>
            <Box bg="#502700" height="496px" borderRadius={'20px'}>
              <Image
                src="/images/login/ctw.png"
                h={'254px'}
                borderRadius={'20px 20px 0 0'}
                w={'100%'}
                objectFit="cover"
              ></Image>
              <Box padding={'16px'}>
                <Text
                  fontSize={'16px'}
                  fontWeight={'bold'}
                  color={'#fff'}
                  noOfLines={1}
                >
                  {t('LikeRetweet')} Twitter2 post
                </Text>
                <Text
                  fontSize={'14px'}
                  color={'#fff'}
                  noOfLines={2}
                  mt={'4px'}
                ></Text>
                <HStack align={'center'} mt={'16px'}>
                  <Image
                    src={'/images/login/ucoin.png'}
                    width={'24px'}
                    height={'24px'}
                  ></Image>
                  <Text color={'#fff'} fontSize={'20px'} fontWeight={'bold'}>
                    +1
                  </Text>
                  {/* <Text color={'#fff'} fontSize={'12px'}>
                    (0/1)
                  </Text> */}
                </HStack>
                <Text color={'#fff'} fontSize={'12px'} noOfLines={3}>
                  UneMeta 1st Anniversary Celebration Series Event 1/4 UneMeta
                  is officially year old!!! To express our gratitude to our
                  loyal supporters, we sincerely invite you to participate in
                  the UneMeta Treasure Carnival~
                </Text>
                <Button
                  color={'#fff'}
                  fontSize={'14px'}
                  bg={'#FB9D42'}
                  textAlign="center"
                  h={'42px'}
                  mt={'40px'}
                  lineHeight={'42px'}
                  borderRadius={'12px'}
                  w={'100%'}
                  isDisabled={taskInfo.twitter_retweet['2']}
                  onClick={() => twAction(2, 2)}
                >
                  {taskInfo.twitter_retweet['2'] ? (
                    <Box>{t('Completed')}</Box>
                  ) : (
                    <Box>{t('Gotocomplete')}</Box>
                  )}
                </Button>
              </Box>
            </Box>
            <Box bg="#502700" height="496px" borderRadius={'20px'}>
              <Image
                src="/images/login/ctw.png"
                h={'254px'}
                borderRadius={'20px 20px 0 0'}
                w={'100%'}
                objectFit="cover"
              ></Image>
              <Box padding={'16px'}>
                <Text
                  fontSize={'16px'}
                  fontWeight={'bold'}
                  color={'#fff'}
                  noOfLines={1}
                >
                  {t('LikeRetweet')} Twitter3 post
                </Text>
                <Text
                  fontSize={'14px'}
                  color={'#fff'}
                  noOfLines={2}
                  mt={'4px'}
                ></Text>
                <HStack align={'center'} mt={'16px'}>
                  <Image
                    src={'/images/login/ucoin.png'}
                    width={'24px'}
                    height={'24px'}
                  ></Image>
                  <Text color={'#fff'} fontSize={'20px'} fontWeight={'bold'}>
                    +1
                  </Text>
                  {/* <Text color={'#fff'} fontSize={'12px'}>
                    (0/1)
                  </Text> */}
                </HStack>
                <Text color={'#fff'} fontSize={'12px'} noOfLines={3}>
                  / Demo Day Party is Coming ~ \ We will discuss the current
                  opportunities and challenges faced by Web3 with 16
                  high-quality Partners and more than 15 Kol Guests.
                </Text>
                <Button
                  color={'#fff'}
                  fontSize={'14px'}
                  bg={'#FB9D42'}
                  textAlign="center"
                  h={'42px'}
                  mt={'40px'}
                  lineHeight={'42px'}
                  borderRadius={'12px'}
                  w={'100%'}
                  isDisabled={taskInfo.twitter_retweet['3']}
                  onClick={() => twAction(2, 3)}
                >
                  {taskInfo.twitter_retweet['3'] ? (
                    <Box>{t('Completed')}</Box>
                  ) : (
                    <Box>{t('Gotocomplete')}</Box>
                  )}
                </Button>
              </Box>
            </Box>
            <Box bg="#502700" height="496px" borderRadius={'20px'}>
              <Image
                src="/images/login/ctw.png"
                h={'254px'}
                borderRadius={'20px 20px 0 0'}
                w={'100%'}
                objectFit="cover"
              ></Image>
              <Box padding={'16px'}>
                <Text
                  fontSize={'16px'}
                  fontWeight={'bold'}
                  color={'#fff'}
                  noOfLines={1}
                >
                  {t('LikeRetweet')} Twitter4 post
                </Text>
                <Text
                  fontSize={'14px'}
                  color={'#fff'}
                  noOfLines={2}
                  mt={'4px'}
                ></Text>
                <HStack align={'center'} mt={'16px'}>
                  <Image
                    src={'/images/login/ucoin.png'}
                    width={'24px'}
                    height={'24px'}
                  ></Image>
                  <Text color={'#fff'} fontSize={'20px'} fontWeight={'bold'}>
                    +1
                  </Text>
                  {/* <Text color={'#fff'} fontSize={'12px'}>
                    (0/1)
                  </Text> */}
                </HStack>
                <Text color={'#fff'} fontSize={'12px'} noOfLines={3}>
                  Welcome to our Birthday Party! Join UneMeta's Discord and
                  spend this unforgettable night with the community, we have
                  prepared prizes worth 2000U , just play simple games to
                  participate! Time: October 28, 7pm to 10pm Singapore time
                </Text>
                <Button
                  color={'#fff'}
                  fontSize={'14px'}
                  bg={'#FB9D42'}
                  textAlign="center"
                  h={'42px'}
                  mt={'40px'}
                  lineHeight={'42px'}
                  borderRadius={'12px'}
                  w={'100%'}
                  isDisabled={taskInfo.twitter_retweet['4']}
                  onClick={() => twAction(2, 4)}
                >
                  {taskInfo.twitter_retweet['4'] ? (
                    <Box>{t('Completed')}</Box>
                  ) : (
                    <Box>{t('Gotocomplete')}</Box>
                  )}
                </Button>
              </Box>
            </Box>
            <Box bg="#502700" height="496px" borderRadius={'20px'}>
              <Image
                src="/images/login/ctw.png"
                h={'254px'}
                borderRadius={'20px 20px 0 0'}
                w={'100%'}
                objectFit="cover"
              ></Image>
              <Box padding={'16px'}>
                <Text
                  fontSize={'16px'}
                  fontWeight={'bold'}
                  color={'#fff'}
                  noOfLines={1}
                >
                  {t('LikeRetweet')} Twitter5 post
                </Text>
                <Text
                  fontSize={'14px'}
                  color={'#fff'}
                  noOfLines={2}
                  mt={'4px'}
                ></Text>
                <HStack align={'center'} mt={'16px'}>
                  <Image
                    src={'/images/login/ucoin.png'}
                    width={'24px'}
                    height={'24px'}
                  ></Image>
                  <Text color={'#fff'} fontSize={'20px'} fontWeight={'bold'}>
                    +1
                  </Text>
                  {/* <Text color={'#fff'} fontSize={'12px'}>
                    (0/1)
                  </Text> */}
                </HStack>
                <Text color={'#fff'} fontSize={'12px'} noOfLines={3}>
                  The Anniversary Carnival has officially begun! Enter our
                  official website and you will have 7 days to discover the
                  Treasures we have buried together with our partners!
                </Text>
                <Button
                  color={'#fff'}
                  fontSize={'14px'}
                  bg={'#FB9D42'}
                  textAlign="center"
                  h={'42px'}
                  mt={'40px'}
                  lineHeight={'42px'}
                  borderRadius={'12px'}
                  w={'100%'}
                  isDisabled={taskInfo.twitter_retweet['5']}
                  onClick={() => twAction(2, 5)}
                >
                  {taskInfo.twitter_retweet['5'] ? (
                    <Box>{t('Completed')}</Box>
                  ) : (
                    <Box>{t('Gotocomplete')}</Box>
                  )}
                </Button>
              </Box>
            </Box>
          </SimpleGrid>
        </Box>
      </>
      <InfoModal
        ref={infoModalRef}
        callback={() => {
          rewardInfo();
        }}
      />
      <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
      <Modal
        onClose={onCloseRewardModel}
        isOpen={rewardModalOpen}
        isCentered
        motionPreset="slideInRight"
      >
        <ModalOverlay />
        {userData?.wallet_address ? (
          <ModalContent
            minW={isLargerThan768 ? '560px' : 'auto'}
            rounded="22px"
          >
            <ModalHeader> {t('exchangeModel')}</ModalHeader>
            <ModalCloseButton w="22px" h="22px" top="36px" right="32px" />
            <ModalBody w={isLargerThan768 ? '560px' : 'auto'} px="28px">
              <VStack background="#fff" pt="10px" pb="2.55vw" px="12px">
                <Box
                  display="flex"
                  justifyContent={'center'}
                  alignItems={'center'}
                  mb={'20px'}
                >
                  <ShimmerImage
                    src={userData?.profile_image}
                    w={isLargerThan768 ? '56px' : '56px'}
                    h={isLargerThan768 ? '56px' : '56px'}
                    // mb={'20px'}
                  />
                  <Text ml="8px">{userData?.username}</Text>
                </Box>
                {isClaim ? (
                  <Text
                    color={'#FB9D42'}
                    textAlign={'center'}
                    fontWeight={'bold'}
                    fontSize={'16px'}
                  >
                    {t('Congratulations')}
                  </Text>
                ) : (
                  <Text
                    color={'#FB9D42'}
                    textAlign={'center'}
                    fontWeight={'bold'}
                    fontSize={'16px'}
                  >
                    {t('Unfortunately')}
                  </Text>
                )}
                {/* <Text  color={'#FB9D42'} textAlign={'center'} fontWeight={'bold'} fontSize={'16px'}>
              {t('Unfortunately')}
              </Text> */}
                {isClaim && (
                  <Button
                    w="100%"
                    fontSize={'14px'}
                    bg={'#FB9D42'}
                    textAlign="center"
                    h={'42px'}
                    isLoading={ButLoading}
                    mt={'40px !important'}
                    lineHeight={'42px'}
                    borderRadius={'12px'}
                    onClick={async () => {
                      setButLoading(true);
                      const claimReq = await requestedAddress();
                      if (!claimReq) {
                        await requestTokens();
                      } else {
                        setButLoading(false);
                        toast({
                          status: 'error',
                          title: 'Received',
                          variant: 'subtle',
                        });
                      }
                      onCloseRewardModel();
                    }}
                  >
                    {t('ClaimReward')}
                  </Button>
                )}
              </VStack>
            </ModalBody>
          </ModalContent>
        ) : (
          <ModalContent
            minW={isLargerThan768 ? '560px' : 'auto'}
            rounded="22px"
          >
            <ModalHeader> {t('exchangeModel')}</ModalHeader>
            <ModalCloseButton w="22px" h="22px" top="36px" right="32px" />
            <ModalBody w={isLargerThan768 ? '560px' : 'auto'} px="28px">
              <VStack background="#fff" pt="10px" pb="2.55vw" px="12px">
                {/* <ShimmerImage
                src={userData?.profile_image}
                w={isLargerThan768 ? '56px' : '56px'}
                h={isLargerThan768 ? '56px' : '56px'}
                mb={'20px'}
              /> */}
                <Text
                  color={'#FB9D42'}
                  textAlign={'center'}
                  fontWeight={'bold'}
                  fontSize={'16px'}
                >
                  {t('LianjieqianbaoLook')}
                </Text>
                <Button
                  w="100%"
                  fontSize={'14px'}
                  bg={'#FB9D42'}
                  textAlign="center"
                  h={'42px'}
                  mt={'40px !important'}
                  lineHeight={'42px'}
                  borderRadius={'12px'}
                  onClick={async () => {
                    openConnectModal?.();
                    onCloseRewardModel();
                  }}
                >
                  {t('Lianjieqianbao')}
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
    </Box>
  );
}

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  const messages = await serverSideTranslations(locale, ['anniversary']);
  return {
    props: {
      messages,
    },
  };
}
