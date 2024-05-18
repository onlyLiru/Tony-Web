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
  Spacer,
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

import BingLogin from './components/BingLogin';
import BingTw from './components/BingTw';
import EmailM from './components/EmailM';
import InviteModal from './components/Invite';
import Partners from './components/Partners';
import UUU from './components/UUU';
import * as pointsApi from '@/services/power';
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

type ResgisterModalAction = {
  open: () => void;
  close?: () => void;
};
export default function Power({}: {}) {
  // const web2LoginModal = useRef(null);

  const router = useRouter();
  const userData = useUserDataValue();
  const t = useTranslations('power');
  const [inTab, setTab] = useState('1');
  const [rankList, updateRankList] = useState([]);
  const [twFollowCode, setTwFollowCode] = useState<any>('');
  const [twRetweetCode, setTwRetweetCode] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [taskInfoData, setTaskInfo] = useState({
    twitter_follow_task: [],
    twitter_post_task: [],
  });
  const [followStatus, setFollow] = useState<any>('');
  const [rankMine, updateRankMine] = useState<any>({});
  const BingLoginModal = useRef<ResgisterModalAction>(null);
  const BingTwModal = useRef<ResgisterModalAction>(null);
  const EmailModal = useRef<ResgisterModalAction>(null);
  const InviteModalHandle = useRef<ResgisterModalAction>(null);
  const PartnersModal = useRef<ResgisterModalAction>(null);
  const uuuModal = useRef<ResgisterModalAction>(null);
  const {
    isOpen: rewardModalOpen,
    onOpen: onOpenRewardModel,
    onClose: onCloseRewardModel,
  } = useDisclosure({
    id: 'login',
  });
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const {
    isOpen: isRankModalOpen,
    onOpen: onOpenRankModel,
    onClose: onCloseRankModel,
  } = useDisclosure({
    id: 'rank',
  });
  const { openConnectModal } = useConnectModal();

  const toast = useToast();
  interface Iprops {
    [propName: string]: any;
  }

  useEffect(() => {
    console.log(userData?.wallet_address, 'userData?.wallet_address');
    // if (userData?.wallet_address) {
    // } else {
    //   BingLoginModal?.current?.open();
    // }
  }, [userData?.wallet_address]);

  const bgStyle = [
    'linear-gradient(135deg, #FFE400 0%, #FFC500 100%);',
    'linear-gradient(135deg, #0080FF 0%, #4A71FF 100%);',
    'linear-gradient(135deg, #FF9000 0%, #FF5300 100%)',
  ];

  const fetchScoreRank = async () => {
    const result = await getMasonryRank();
    console.log(result);
    updateRankList(result?.data?.user_list ?? []);
    updateRankMine(result?.data?.my_info);
  };

  // 获取任务的状态
  const fetchTaskInfo = async () => {
    try {
      const { data } = await userApis.getTaskInfo();
      console.log(data, 'fetchTaskInfo');
      setTaskInfo(data);
    } catch (error) {
      toast({ title: error.msg, status: 'error' });
    }
  };

  /** 获取twcode */
  const fetchTwCode = async (taskId: any) => {
    // type 1 follow 2 retweet
    try {
      const result = await userApis.newGetTwUrl({
        redirect_url: `${redirectUrl}`,
        state: taskId,
      });
      console.log(result);
      if (result.data.url) {
        // window.open(result.data.url, "_blank");
        window.location.replace(result.data.url);
      }
    } catch (error) {
      toast({ title: error.msg, status: 'error' });
    }
  };

  const handleBingTw = async (taskId: any) => {
    console.log(taskId);
    console.log(userData?.twitter_name);
    if (!userData?.twitter_name) {
      BingTwModal?.current?.open();
    } else {
      if (followStatus && followStatus !== 'state') {
        try {
          const result = await userApis.newFollowTw({
            code: twFollowCode,
            redirect_url: `${redirectUrl}`,
            task_id: +taskId,
          });
          console.log(result);
          if (result.data.status === 0) {
            toast({ title: 'Success!', status: 'success' });
            fetchTaskInfo();
            const { pathname } = window.location;
            setTwFollowCode('');
            router.replace(pathname);
          }
        } catch (error) {
          toast({ status: 'error', title: error.message, variant: 'subtle' });
        }
        return;
      }
      if (!twFollowCode) {
        // try {
        //   const { data } = await userApis.getTwitterUrl({ redirect_url: redirectUrl });
        //   console.log(data)
        //   // window.open(data?.url, "_blank");
        //   window.location.replace(data.url);
        // } catch (error) {
        //   toast({ status: 'error', title: error.message, variant: 'subtle' });
        // }
        await fetchTwCode(taskId);
      } else {
        // await fetchTwCode(taskId);
        //   await onTwitterReconnect();
      }
    }
  };

  useEffect(() => {
    // rewardInfo();
    // if (userData?.wallet_address) {
    //   fetchTaskInfo();
    // }
    // 获取积分排行榜
    fetchTaskInfo();
    fetchScoreRank();

    console.log(userData);
    const { origin, pathname } = window.location;
    const { code, state = '' } = router.query;
    setRedirectUrl(`${origin + pathname}`);
    console.log(state);
    setFollow(state);
    setTwFollowCode(code);
    // if (twType === '1') {
    //   setTwFollowCode(code as string);
    // } else if (twType === '2') {
    //   setTwRetweetCode(code as string);
    // }
  }, []);

  return (
    <Box>
      <CommonHead title="power" />

      {/* <Image w="100%" objectFit={'contain'} src={'/images/power/power_banner.png'} /> */}
      <Box
        h="427px"
        bgImage={
          isLargerThan768
            ? '/images/power/banner2.png'
            : '/images/power/power_banner.png'
        }
        bgPosition="center"
        bgSize={'100% 100%'}
        bgRepeat="no-repeat"
        px={'20px'}
        py={'10px'}
      >
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Box w={'125px'}>
            <Text>第一期</Text>
            <Text fontSize={'12px'}>集算力，瓜分 uuu 积分</Text>
          </Box>
          <Box>
            <Button
              borderRadius={'55px'}
              bg={'rgba(255,255,255,0.6)'}
              size="sm"
              leftIcon={<div>d</div>}
            >
              活动规则
            </Button>
            <Button
              borderRadius={'55px'}
              bg={'rgba(255,255,255,0.6)'}
              size="sm"
              leftIcon={<div>d</div>}
            >
              算力记录
            </Button>
          </Box>
        </Box>
        <Box
          h="260px"
          w="326px"
          margin={'0 auto'}
          mt={'68px'}
          bgImage={'/images/power/1000000uuu.png'}
          bgPosition="center"
          bgSize={'100% 100%'}
          bgRepeat="no-repeat"
          position={'relative'}
        >
          <Box
            position={'absolute'}
            bottom="92px"
            left="70px"
            fontSize={'12px'}
          >
            已有10086个用户参与瓜分奖金
          </Box>
        </Box>
      </Box>
      <Box px={'20px'}>
        <Box
          maxW={'1280px'}
          m="0 auto"
          mt="24px"
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Button
            flex={'1'}
            borderRadius={'8px'}
            bg={'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'}
            onClick={() => setTab('1')}
          >
            任务列表
          </Button>
          <Button
            onClick={() => setTab('2')}
            flex={'1'}
            ml={'8px'}
            borderRadius={'8px'}
            bg={'#FFBC6D'}
          >
            排行榜
          </Button>
        </Box>
        <Box
          maxW={'1280px'}
          m="0 auto"
          bg="#FFF0D6"
          borderRadius={'8px'}
          py="8px"
          mt="24px"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Text fontSize={'12px'} color="#FF782C">
            做任务集算力，累计获得算力越大，可瓜分积分越多
          </Text>
        </Box>
        {userData?.wallet_address && isLargerThan768 ? (
          <Flex
            key={userData?.wallet_address}
            alignItems="center"
            px="20px"
            py="12px"
            background="#FFFFFF"
            m="0 auto"
            mt="14px"
            maxW={'1280px'}
            // position="sticky"
            // bottom="0"
            justify={'space-between'}
            borderTopLeftRadius="4px"
            borderTopRightRadius="4px"
            boxShadow={'0px -4px 30px 0px rgba(0,0,0,0.12)'}
          >
            {/* <Box width="15.2vw">
            <Text
              width="28px"
              py="3px"
              fontSize="14px"
              textAlign="center"
              color="rgba(0,0,0,0.4)"
              whiteSpace="nowrap"
            >
              {rankMine?.rank <= 100 ? rankMine?.rank : '未上榜'}
            </Text>
          </Box> */}
            <Flex alignItems="center">
              {userData?.wallet_address ? (
                <ShimmerImage
                  w="32px"
                  h="32px"
                  src={userData?.profile_image}
                  mr="8px"
                  rounded="full"
                />
              ) : null}
              <Box>
                <Text fontSize="14px" color="#000">
                  {userData?.username}
                </Text>
                <Text
                  width="28px"
                  // py="3px"
                  fontSize="12px"
                  textAlign="center"
                  // color="rgba(0,0,0,0.4)"
                  whiteSpace="nowrap"
                >
                  {rankMine?.rank <= 100
                    ? `当前排名${rankMine?.rank}`
                    : '未上榜'}
                </Text>
              </Box>
            </Flex>
            {/* <Spacer /> */}
            <Box>
              <Text fontSize="12px" color="#000" textAlign="left">
                本期已获 {rankMine?.num} 算力
              </Text>
              <Text fontSize="12px" color="#000" textAlign="left">
                预估可以瓜分 {rankMine?.expect_score} 积分
              </Text>
            </Box>
          </Flex>
        ) : null}
        {!userData?.wallet_address && isLargerThan768 ? (
          <Flex
            key={Math.random() * 10000}
            alignItems="center"
            pl="30px"
            pr="48px"
            py="8px"
            background="rgba(226,225,239, 0.4)"
            borderTopLeftRadius="4px"
            borderTopRightRadius="4px"
            // onClick={onLogin}
          >
            <Box width="14.9vw">
              <Text
                width="28px"
                py="3px"
                fontSize="14px"
                textAlign="center"
                color="rgba(0,0,0,0.4)"
                whiteSpace="nowrap"
              >
                ???
              </Text>
            </Box>
            <Flex width="40vw" alignItems="center">
              {userData?.wallet_address ? (
                <ShimmerImage
                  w="32px"
                  h="32px"
                  src={userData?.profile_image}
                  mr="8px"
                  rounded="full"
                />
              ) : (
                <ShimmerImage
                  w="32px"
                  h="32px"
                  src="https://res.cloudinary.com/unemeta/image/upload/f_auto,q_auto/v1/samples/ai5v6ihpkkkkpybo4znl"
                  mr="8px"
                  rounded="full"
                />
              )}
              <Text fontSize="14px" color="#000">
                {/* {t('rank.mine')} */}
              </Text>
            </Flex>
            <Box flex="1">
              <Text
                fontSize="14px"
                color="#544AEC"
                textAlign="center"
                whiteSpace="nowrap"
              >
                {/* {t('rank.unlogin')} */}
              </Text>
            </Box>
          </Flex>
        ) : null}
        {inTab === '1' ? (
          <>
            {isLargerThan768 ? (
              <Box w="980px" m="0 auto" borderRadius={'8px'} py="8px">
                <Text color="#FFAA47" fontSize={'12px'}>
                  邀请好友
                </Text>

                <Box
                  display={'grid'}
                  gridGap={'10px'}
                  gridTemplateColumns={'1fr 1fr 1fr'}
                >
                  <Box
                    mt="8px"
                    p="15px"
                    borderRadius={'12px'}
                    bg="#FFF0D6"
                    display={'flex'}
                    alignItems={'center'}
                  >
                    <Box w="66%">
                      <Text fontSize={'14px'} fontWeight={'600'}>
                        邀请好友
                      </Text>
                      <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                        每次邀请好友且绑定推特后，都可以获得算力值。邀请者可以额外获得被邀请者算力值的
                        5%。
                      </Text>
                    </Box>
                    <Box flex={'1'} textAlign={'right'}>
                      <Button borderRadius={'59px'} size="sm" bg={'#FFDA9A'}>
                        已完成
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Text mt="16px" color="#FFAA47" fontSize={'12px'}>
                  绑定邮箱
                </Text>

                <Box
                  display={'grid'}
                  gridGap={'10px'}
                  gridTemplateColumns={'1fr 1fr 1fr'}
                >
                  <Box
                    mt="8px"
                    p="15px"
                    borderRadius={'12px'}
                    bg="#FFF0D6"
                    display={'flex'}
                    alignItems={'center'}
                  >
                    <Box w="66%">
                      <Text fontSize={'14px'} fontWeight={'600'}>
                        绑定邮箱
                      </Text>
                      <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                        绑定邮箱后可以获得10算力值，算力值奖励可领取时我们会发邮件提醒你
                      </Text>
                    </Box>
                    <Box flex={'1'} textAlign={'right'}>
                      <Button
                        borderRadius={'59px'}
                        size="sm"
                        bg={
                          userData?.login_email
                            ? '#FFDA9A'
                            : 'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'
                        }
                        onClick={() => EmailModal?.current?.open()}
                      >
                        {userData?.login_email ? '已完成' : '去完成'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Text mt="16px" color="#FFAA47" fontSize={'12px'}>
                  兑换算力值
                </Text>

                <Box
                  display={'grid'}
                  gridGap={'10px'}
                  gridTemplateColumns={'1fr 1fr 1fr'}
                >
                  <Box
                    mt="8px"
                    p="15px"
                    borderRadius={'12px'}
                    bg="#FFF0D6"
                    display={'flex'}
                    alignItems={'center'}
                  >
                    <Box w="66%">
                      <Text fontSize={'14px'} fontWeight={'600'}>
                        uuu兑换
                      </Text>
                      <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                        可以将uuu转化为算力值，1uuu可以转化为10算力值
                      </Text>
                    </Box>
                    <Box flex={'1'} textAlign={'right'}>
                      <Button
                        borderRadius={'59px'}
                        size="sm"
                        bg={'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'}
                      >
                        去完成
                      </Button>
                    </Box>
                  </Box>
                </Box>
                {taskInfoData?.twitter_follow_task?.length > 0 && (
                  <Box>
                    <Text mt="16px" color="#FFAA47" fontSize={'12px'}>
                      twitter任务
                    </Text>
                    <Box
                      display={'grid'}
                      gridGap={'10px'}
                      gridTemplateColumns={'1fr 1fr 1fr'}
                    >
                      {taskInfoData?.twitter_follow_task?.map(
                        (val: {
                          complete: any;
                          id: any;
                          username:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | React.ReactFragment
                            | React.ReactPortal
                            | null
                            | undefined;
                          amount:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | React.ReactFragment
                            | React.ReactPortal
                            | null
                            | undefined;
                        }) => (
                          <Box
                            mt="8px"
                            p="15px"
                            borderRadius={'12px'}
                            bg="#FFF0D6"
                            display={'flex'}
                            alignItems={'center'}
                          >
                            <Box w="66%">
                              <Text fontSize={'14px'} fontWeight={'600'}>
                                关注推特
                              </Text>
                              <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                                关注twitter@{val?.username}，+{val?.amount} 算力
                              </Text>
                            </Box>
                            <Box flex={'1'} textAlign={'right'}>
                              <Button
                                borderRadius={'59px'}
                                size="sm"
                                bg={
                                  val?.complete
                                    ? '#FFDA9A'
                                    : 'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'
                                }
                                onClick={() => handleBingTw(val?.id.toString())}
                              >
                                {val?.complete ? '已完成' : '去完成'}
                              </Button>
                            </Box>
                          </Box>
                        ),
                      )}
                      <Box
                        mt="8px"
                        p="15px"
                        borderRadius={'12px'}
                        bg="#FFF0D6"
                        display={'flex'}
                        alignItems={'center'}
                      >
                        <Box w="66%">
                          <Text fontSize={'14px'} fontWeight={'600'}>
                            发推特
                          </Text>
                          <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                            发 twitter 可以获得大量算力值，
                            我们将自动评估你的账号
                          </Text>
                        </Box>
                        <Box flex={'1'} textAlign={'right'}>
                          <Button
                            borderRadius={'59px'}
                            size="sm"
                            bg={
                              'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'
                            }
                          >
                            去完成
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}

                <Text mt="16px" color="#FFAA47" fontSize={'12px'}>
                  NFT 相关
                </Text>

                <Box
                  display={'grid'}
                  gridGap={'10px'}
                  gridTemplateColumns={'1fr 1fr 1fr'}
                >
                  <Box
                    mt="8px"
                    p="15px"
                    borderRadius={'12px'}
                    bg="#FFF0D6"
                    display={'flex'}
                    alignItems={'center'}
                  >
                    <Box w="66%">
                      <Text fontSize={'14px'} fontWeight={'600'}>
                        持有指定collection NFT
                      </Text>
                      <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                        每天可以来本页面领取算力值
                      </Text>
                    </Box>
                    <Box flex={'1'} textAlign={'right'}>
                      <Button
                        borderRadius={'59px'}
                        size="sm"
                        bg={'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'}
                        onClick={() => PartnersModal?.current?.open()}
                      >
                        去完成
                      </Button>
                    </Box>
                  </Box>
                  <Box
                    mt="8px"
                    p="15px"
                    borderRadius={'12px'}
                    bg="#FFF0D6"
                    display={'flex'}
                    alignItems={'center'}
                  >
                    <Box w="66%">
                      <Text fontSize={'14px'} fontWeight={'600'}>
                        在 une 完成挂单
                      </Text>
                      <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                        每日首次挂单得 x 算力，此后每次挂单得 x 算力
                      </Text>
                    </Box>
                    <Box flex={'1'} textAlign={'right'}>
                      <Button
                        borderRadius={'59px'}
                        size="sm"
                        bg={'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'}
                      >
                        去完成
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Box h={'30px'}></Box>
              </Box>
            ) : (
              <Box borderRadius={'8px'} py="8px">
                <Text color="#FFAA47" fontSize={'12px'}>
                  邀请好友
                </Text>
                <Box
                  mt="8px"
                  p="15px"
                  borderRadius={'12px'}
                  bg="#FFF0D6"
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Box w="66%">
                    <Text fontSize={'14px'} fontWeight={'600'}>
                      邀请好友
                    </Text>
                    <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                      每次邀请好友且绑定推特后，都可以获得算力值。邀请者可以额外获得被邀请者算力值的
                      5%。
                    </Text>
                  </Box>
                  <Box flex={'1'} textAlign={'right'}>
                    <Button
                      borderRadius={'59px'}
                      size="sm"
                      bg={'#FFDA9A'}
                      onClick={() => InviteModalHandle?.current?.open()}
                    >
                      已完成
                    </Button>
                  </Box>
                </Box>
                {taskInfoData?.twitter_follow_task?.length > 0 && (
                  <>
                    <Text mt="16px" color="#FFAA47" fontSize={'12px'}>
                      twitter任务
                    </Text>
                    {taskInfoData?.twitter_follow_task?.map(
                      (val: {
                        complete: any;
                        id: any;
                        username:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | React.ReactFragment
                          | React.ReactPortal
                          | null
                          | undefined;
                        amount:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | React.ReactFragment
                          | React.ReactPortal
                          | null
                          | undefined;
                      }) => (
                        <Box
                          mt="8px"
                          p="15px"
                          borderRadius={'12px'}
                          bg="#FFF0D6"
                          display={'flex'}
                          alignItems={'center'}
                        >
                          <Box w="66%">
                            <Text fontSize={'14px'} fontWeight={'600'}>
                              关注推特
                            </Text>
                            <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                              关注twitter@{val?.username}，+{val?.amount} 算力
                            </Text>
                          </Box>
                          <Box flex={'1'} textAlign={'right'}>
                            <Button
                              borderRadius={'59px'}
                              size="sm"
                              bg={
                                val?.complete
                                  ? '#FFDA9A'
                                  : 'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'
                              }
                              onClick={() => handleBingTw(val?.id.toString())}
                            >
                              {val?.complete ? '已完成' : '去完成'}
                            </Button>
                          </Box>
                        </Box>
                      ),
                    )}
                  </>
                )}
                <Box
                  mt="8px"
                  p="15px"
                  borderRadius={'12px'}
                  bg="#FFF0D6"
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Box w="66%">
                    <Text fontSize={'14px'} fontWeight={'600'}>
                      发推特
                    </Text>
                    <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                      发 twitter 可以获得大量算力值， 我们将自动评估你的账号
                    </Text>
                  </Box>
                  <Box flex={'1'} textAlign={'right'}>
                    <Button
                      borderRadius={'59px'}
                      size="sm"
                      bg={'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'}
                    >
                      去完成
                    </Button>
                  </Box>
                </Box>
                <Text mt="16px" color="#FFAA47" fontSize={'12px'}>
                  NFT 相关
                </Text>
                <Box
                  mt="8px"
                  p="15px"
                  borderRadius={'12px'}
                  bg="#FFF0D6"
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Box w="66%">
                    <Text fontSize={'14px'} fontWeight={'600'}>
                      持有指定collection NFT
                    </Text>
                    <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                      每天可以来本页面领取算力值
                    </Text>
                  </Box>
                  <Box flex={'1'} textAlign={'right'}>
                    <Button
                      borderRadius={'59px'}
                      size="sm"
                      bg={'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'}
                      onClick={() => PartnersModal?.current?.open()}
                    >
                      去完成
                    </Button>
                  </Box>
                </Box>
                <Box
                  mt="8px"
                  p="15px"
                  borderRadius={'12px'}
                  bg="#FFF0D6"
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Box w="66%">
                    <Text fontSize={'14px'} fontWeight={'600'}>
                      在 une 完成挂单
                    </Text>
                    <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                      每日首次挂单得 x 算力，此后每次挂单得 x 算力
                    </Text>
                  </Box>
                  <Box flex={'1'} textAlign={'right'}>
                    <Button
                      borderRadius={'59px'}
                      size="sm"
                      bg={'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'}
                    >
                      去完成
                    </Button>
                  </Box>
                </Box>
                <Text mt="16px" color="#FFAA47" fontSize={'12px'}>
                  绑定邮箱
                </Text>
                <Box
                  mt="8px"
                  p="15px"
                  borderRadius={'12px'}
                  bg="#FFF0D6"
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Box w="66%">
                    <Text fontSize={'14px'} fontWeight={'600'}>
                      绑定邮箱
                    </Text>
                    <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                      绑定邮箱后可以获得10算力值，算力值奖励可领取时我们会发邮件提醒你
                    </Text>
                  </Box>
                  <Box flex={'1'} textAlign={'right'}>
                    <Button
                      borderRadius={'59px'}
                      size="sm"
                      bg={
                        userData?.login_email
                          ? '#FFDA9A'
                          : 'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'
                      }
                      onClick={() => EmailModal?.current?.open()}
                    >
                      {userData?.login_email ? '已完成' : '去完成'}
                    </Button>
                  </Box>
                </Box>
                <Text mt="16px" color="#FFAA47" fontSize={'12px'}>
                  兑换算力值
                </Text>
                <Box
                  mt="8px"
                  p="15px"
                  borderRadius={'12px'}
                  bg="#FFF0D6"
                  display={'flex'}
                  alignItems={'center'}
                >
                  <Box w="66%">
                    <Text fontSize={'14px'} fontWeight={'600'}>
                      uuu兑换
                    </Text>
                    <Text color={'rgba(0,0,0,0.6)'} fontSize={'12px'}>
                      可以将uuu转化为算力值，1uuu可以转化为10算力值
                    </Text>
                  </Box>
                  <Box flex={'1'} textAlign={'right'}>
                    <Button
                      borderRadius={'59px'}
                      size="sm"
                      bg={'linear-gradient(125deg, #FFAB47 0%, #FF772B 100%)'}
                      onClick={() => uuuModal?.current?.open()}
                    >
                      去完成
                    </Button>
                  </Box>
                </Box>
                <Box h={'30px'}></Box>
              </Box>
            )}
          </>
        ) : (
          <Box maxW={'980px'} m="0 auto" mt="20px">
            <Flex mb="24px">
              <Text width="14.9vw" fontSize="14px" color="rgba(0,0,0,0.4)">
                Rank
              </Text>
              <Text width="52.6vw" fontSize="14px" color="rgba(0,0,0,0.4)">
                Nickname
              </Text>
              <Text
                flex="1"
                fontSize="14px"
                color="rgba(0,0,0,0.4)"
                textAlign="center"
                whiteSpace="nowrap"
              >
                当前算力值/uuu奖励
              </Text>
            </Flex>
            <Box>
              {rankList.map((v: any, index: number) => (
                <Flex
                  key={`${v?.wallet}${Math.random()}`}
                  py="8px"
                  // background={
                  //   index + 1 == rankMine?.level
                  //     ? 'rgba(226,225,239, 0.4)'
                  //     : 'transparent'
                  // }
                >
                  <Box width="14.9vw">
                    {index <= 2 ? (
                      <Text
                        width="28px"
                        py="3px"
                        fontSize="14px"
                        textAlign="center"
                        background={bgStyle[index]}
                        rounded="2px 8px 2px 2px"
                        color="#fff"
                      >
                        {v?.rank}
                      </Text>
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
                  <Flex width="52.6vw" alignItems="center">
                    {v?.image ? (
                      <ShimmerImage
                        w="32px"
                        h="32px"
                        src={v?.image}
                        // src="https://res.cloudinary.com/unemeta/image/upload/v1691297724/%E5%9B%BE%E7%89%87_2x_pmde6u.png"
                        mr="8px"
                        rounded="full"
                      />
                    ) : null}
                    <Text fontSize="14px" color="#000">
                      {v?.nick_name}
                    </Text>
                  </Flex>
                  <Box flex="1">
                    <Text fontSize="14px" color="#544AEC" textAlign="center">
                      {v?.num}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Box>
            <Box h={'30px'}></Box>
          </Box>
        )}
      </Box>
      {userData?.wallet_address && !isLargerThan768 ? (
        <Flex
          key={userData?.wallet_address}
          alignItems="center"
          px="20px"
          py="12px"
          background="#FFFFFF"
          position="sticky"
          bottom="0"
          justify={'space-between'}
          borderTopLeftRadius="4px"
          borderTopRightRadius="4px"
          boxShadow={'0px -4px 30px 0px rgba(0,0,0,0.12)'}
        >
          {/* <Box width="15.2vw">
            <Text
              width="28px"
              py="3px"
              fontSize="14px"
              textAlign="center"
              color="rgba(0,0,0,0.4)"
              whiteSpace="nowrap"
            >
              {rankMine?.rank <= 100 ? rankMine?.rank : '未上榜'}
            </Text>
          </Box> */}
          <Flex alignItems="center">
            {userData?.wallet_address ? (
              <ShimmerImage
                w="32px"
                h="32px"
                src={userData?.profile_image}
                mr="8px"
                rounded="full"
              />
            ) : null}
            <Box>
              <Text fontSize="14px" color="#000">
                {userData?.username}
              </Text>
              <Text
                width="28px"
                // py="3px"
                fontSize="12px"
                textAlign="center"
                // color="rgba(0,0,0,0.4)"
                whiteSpace="nowrap"
              >
                {rankMine?.rank <= 100 ? `当前排名${rankMine?.rank}` : '未上榜'}
              </Text>
            </Box>
          </Flex>
          {/* <Spacer /> */}
          <Box>
            <Text fontSize="12px" color="#000" textAlign="left">
              本期已获 {rankMine?.num} 算力
            </Text>
            <Text fontSize="12px" color="#000" textAlign="left">
              预估可以瓜分 {rankMine?.expect_score} 积分
            </Text>
          </Box>
        </Flex>
      ) : null}
      {!userData?.wallet_address && !isLargerThan768 ? (
        <Flex
          key={Math.random() * 10000}
          alignItems="center"
          pl="30px"
          pr="48px"
          py="8px"
          background="rgba(226,225,239, 0.4)"
          borderTopLeftRadius="4px"
          borderTopRightRadius="4px"
          // onClick={onLogin}
        >
          <Box width="14.9vw">
            <Text
              width="28px"
              py="3px"
              fontSize="14px"
              textAlign="center"
              color="rgba(0,0,0,0.4)"
              whiteSpace="nowrap"
            >
              ???
            </Text>
          </Box>
          <Flex width="40vw" alignItems="center">
            {userData?.wallet_address ? (
              <ShimmerImage
                w="32px"
                h="32px"
                src={userData?.profile_image}
                mr="8px"
                rounded="full"
              />
            ) : (
              <ShimmerImage
                w="32px"
                h="32px"
                src="https://res.cloudinary.com/unemeta/image/upload/f_auto,q_auto/v1/samples/ai5v6ihpkkkkpybo4znl"
                mr="8px"
                rounded="full"
              />
            )}
            <Text fontSize="14px" color="#000">
              {/* {t('rank.mine')} */}
            </Text>
          </Flex>
          <Box flex="1">
            <Text
              fontSize="14px"
              color="#544AEC"
              textAlign="center"
              whiteSpace="nowrap"
            >
              {/* {t('rank.unlogin')} */}
            </Text>
          </Box>
        </Flex>
      ) : null}

      <BingLogin ref={BingLoginModal} />
      <BingTw ref={BingTwModal} />
      <EmailM ref={EmailModal} />
      <InviteModal ref={InviteModalHandle} />
      <Partners ref={PartnersModal} />
      <UUU ref={uuuModal} />
    </Box>
  );
}

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  const messages = await serverSideTranslations(locale, ['power']);
  return {
    props: {
      messages,
    },
  };
}
