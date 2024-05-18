import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { serverSideTranslations } from '@/i18n';
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
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Modal,
  Tooltip,
  Link,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import CommonHead from '@/components/PageLayout/CommonHead';
import { ShimmerImage } from '@/components/Image';
import { useState, useMemo, useRef, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import * as pointsApi from '@/services/points';
import { getSignedInDate, getScoreRank } from '@/services/rebate';
import dynamic from 'next/dynamic';
import {
  useUserDataValue,
  useUuInfoValue,
  useFetchUuInfo,
  useIsInvited,
  useInvitationCode,
} from '@/store';
import {
  HistoryModalRef,
  HistoryModal,
  ExchangeModal,
  ExchangeModalRef,
  TipsModal,
  TipsModalRef,
  InfoModal,
  InfoModalRef,
  InputCodeModal,
  InputCodeModalRef,
  CfxModalRef,
  CfxModal,
} from '@/features/PointsPage';
import InviteFriendsModal, {
  InviteFriendsModalRef,
} from './components/InviteFriendsModal';
import OrderTipModaModal, {
  OrderTipModalRef,
} from './components/orderTipModal';
import MailModal, { MailModalRef } from './components/mailModal';
import { CheckInModal } from '@/components/PageLayout/Header/CheckInModal';
import { Web2LoginModal } from '@/components/PageLayout/Header/Web2Login';
import { useRouter } from 'next/router';
import { GetUUU } from '@/features/Home';
import { useCookieState } from 'ahooks';
import { JWT_HEADER_KEY } from '@/utils/jwt';
import { Avatar } from '@/components/NftAvatar';
import ShimmerImageMemo from '@/components/Image/ShimmerImageMemo';
const Footer = dynamic(
  () => import('@/components/PageLayout').then((module) => module.Footer),
  { ssr: false },
);
const Banner = dynamic(() => import('./components/Banner'), { ssr: false });
const Mobile = dynamic(() => import('./mobile'), { ssr: false });

type ResgisterModalAction = {
  open: () => void;
  close?: () => void;
};
type GetUUURefAction = {
  open: () => void;
};

export default function PointsShop({
  data,
  initOrderList,
}: {
  data: any;
  initOrderList: any;
}) {
  const uuInfo = useUuInfoValue();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const historyModalRef = useRef<HistoryModalRef>(null);
  const toast = useToast();
  const router = useRouter();
  const [invitationUrl, setInvitationUrl] = useState('');
  const [inviteMsg, updateInviteResult] = useState<any>({});
  const [activeTab, setActiveTab] = useState(1);
  const [selectedRow, setSelectedRow] = useState<any>();
  const [list, setList] = useState<any>(data || []);
  const [orderList, setOrderList] = useState<any>(initOrderList);
  const [isSign, updateSignStatus] = useState(false);
  const [curRankTab, changeRankTab] = useState('month');
  const [rankList, updateRankList] = useState([]);
  const [rankMine, updateRankMine] = useState<any>({});
  const [signCount, updateSignCount] = useState(0);
  const [curOrderType, updateOrderType] = useState('');
  const tipsModalRef = useRef<TipsModalRef>(null);
  const infoModalRef = useRef<InfoModalRef>(null);
  const exchangeModalRef = useRef<ExchangeModalRef>(null);
  const CfxModalRef = useRef<CfxModalRef>(null);
  const InviteFriendsModalRef = useRef<InviteFriendsModalRef>(null);
  const OrderTipModalRef = useRef<OrderTipModalRef>(null);
  const MailModalRef = useRef<MailModalRef>(null);
  const web2LoginModal = useRef<ResgisterModalAction>(null);
  const GetUUURef = useRef<GetUUURefAction>(null);
  const CheckInModalRef = useRef<any>(null);
  const [cookieToken, setCookieToken] = useCookieState(JWT_HEADER_KEY);

  const userData = useUserDataValue();

  const t = useTranslations('points');
  const isConnected = useMemo(
    () => !!userData?.wallet_address,
    [userData?.wallet_address],
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fetchUuInfo } = useFetchUuInfo();
  const inputCodeModalRef = useRef<InputCodeModalRef>(null);
  const [invited] = useIsInvited();
  const tabs = [
    {
      name: t('tabs.whiteList'),
      key: 1,
    },
    {
      name: t('tabs.specialRewards'),
      key: 2,
    },
  ];

  const handleAllExchangeList = (list: any) => {
    const result: any = [];
    tabs.forEach((item) => {
      if (item.key === 3) {
        result.push(...list[item.key]);
      } else {
        const arr = list[item.key] ?? [];
        result.push(
          ...arr.filter((v: any) => {
            return !(
              (v.unlimit > 0 && v.already_exchange >= v.unlimit) ||
              v.toal <= 0 ||
              v.project_status * 1 === 2
            );
          }),
        );
      }
    });
    return result;
  };

  const getLocalTimeValue = () => {
    return window.localStorage.getItem(
      `${format(new Date(), 'MM/dd/yyyy')}_${userData?.wallet_address}_checkin`,
    );
  };

  const setLocalTimeValue = () => {
    return window.localStorage.setItem(
      `${format(new Date(), 'MM/dd/yyyy')}_${userData?.wallet_address}_checkin`,
      'true',
    );
  };

  const deleteBeforeValue = () => {
    window.localStorage.removeItem(
      `${format(subDays(new Date(), 1), 'MM/dd/yyyy')}_${
        userData?.wallet_address
      }_checkin`,
    );
  };

  // 获取白名单
  const fetchWhiteList = async () => {
    try {
      const { data: whiteListData } = await pointsApi.getExchangeList({
        type: 1,
      });
      setOrderList(whiteListData.can_order_list ?? []);
      setList((pre: any) => {
        return {
          ...pre,
          1: whiteListData.list,
        };
      });
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  const onWhiteListExchange = async (v: pointsApi.ApiPoints.ExchangeItem) => {
    try {
      await pointsApi.exchangeWhiteList({
        id: v.id,
      });
      toast({
        status: 'success',
        title: t('redeemSuccessully'),
        variant: 'subtle',
      });
      const { data: whiteListData } = await pointsApi.getExchangeList({
        type: 1,
      });
      setList((pre: any) => {
        return {
          ...pre,
          1: whiteListData.list,
        };
      });
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  const [specialId, setSpecialId] = useState(0);
  const [specialType, setSpecialType] = useState(4); // 后端返回的特殊奖品type

  const onExchange = async (v: pointsApi.ApiPoints.ExchangeItem) => {
    if (!userData?.wallet_address) {
      web2LoginModal?.current?.open();
      return;
    }
    await setSelectedRow(v);

    const activeTab =
      typeof v.type === 'number' ? (v.type == 4 ? 2 : v.type) : 3;
    switch (activeTab) {
      case 1:
        onWhiteListExchange(v);
        break;
      case 2:
        infoModalRef?.current?.open();
        setSpecialId(v.id);
        setSpecialType(v.type as number);
        break;
      case 3:
        tipsModalRef?.current?.open();
        break;
      default:
    }
  };

  InputCodeModal;

  const openInputModal = () => {
    inputCodeModalRef?.current?.open();
  };

  const { invitationCode, OpenInvite } = router.query;
  useEffect(() => {
    if (invitationCode && invited === false) {
      openInputModal();
    } else if (invitationCode && invited === true) {
      toast({
        status: 'warning',
        title: 'You have already accepted the invitation',
      });
    }
  }, [invitationCode, invited]);
  /** 跳转到当页面根据参数自动打开邀请框 */
  useEffect(() => {
    if (OpenInvite) {
      InviteFriendsModalRef?.current?.open();
    }
  }, [OpenInvite]);
  const refreshSpecialInfo = async () => {
    const { data: special } = await pointsApi.getExchangeList({
      type: 4,
    });
    setList((pre: any) => {
      return {
        ...pre,
        2: special.special_list,
      };
    });
  };

  const refreshCfxInfo = async () => {
    const { data: special } = await pointsApi.getExchangeList({
      type: 5,
    });
    fetchUuInfo();
    setList((pre: any) => {
      return {
        ...pre,
        5: special.cfx_list,
      };
    });
  };

  const onChangeRankTab = (active: string): void => {
    changeRankTab(active);
  };

  const onSureReserve = (itemInfo: any, email: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await pointsApi.submitReserve({
          launchpad_id: itemInfo?.id,
          email,
        });
        if (result?.data?.status) {
          resolve(null);
          toast({
            position: 'top',
            status: 'success',
            title: t('recordSuccessully'),
            duration: 2000,
            containerStyle: {
              marginTop: '30px',
            },
          });
        } else {
          toast({
            position: 'top',
            status: 'error',
            title: t('recordFail'),
            duration: 2000,
            containerStyle: {
              marginTop: '30px',
            },
          });
          reject();
        }
      } catch (err) {
        toast({
          position: 'top',
          status: 'error',
          title: t('recordFail'),
          duration: 2000,
          containerStyle: {
            marginTop: '30px',
          },
        });
        reject();
      }
    });
  };

  const getFun = () => {
    GetUUURef?.current?.open();
  };
  const getInvite = () => {
    // GetUUURef?.current?.open();
    if (!userData?.wallet_address) {
      return web2LoginModal?.current?.open();
    }
    InviteFriendsModalRef?.current?.open();
  };

  const renderLeftArea = () => {
    return (
      <Box w="330px">
        <Flex
          w="full"
          direction="column"
          alignItems="center"
          pt="71px"
          pb="40px"
        >
          {userData?.wallet_address ? (
            // <Image
            //   w="120px"
            //   h="120px"
            //   rounded="full"
            //   src={userData?.profile_image}
            //   p="3px"
            //   bg="linear-gradient(146deg, rgba(255, 74, 246, 1), rgba(54, 35, 251, 1), rgba(0, 153, 255, 1))"
            //   // sx={{ borderImage: 'linear-gradient(146deg, rgba(255, 74, 246, 1), rgba(54, 35, 251, 1), rgba(0, 153, 255, 1)) 3 3;' }}
            // />
            <Avatar
              url={userData?.profile_image}
              notconfig={{ p: '3px' }}
              isshowtipmodalonclick
            />
          ) : (
            <ShimmerImage
              w="120px"
              h="120px"
              rounded="full"
              cursor="pointer"
              // src="https://www.unemeta.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Funemeta%2Fimage%2Fupload%2Ff_auto%2Cq_auto%2Fv1%2Fsamples%2Fai5v6ihpkkkkpybo4znl&w=3840&q=75"
              src="/avatar.webp"
              onClick={() => {
                web2LoginModal?.current?.open();
              }}
            />
          )}
          <Text
            fontSize="24px"
            color="#000"
            mt="24px"
            fontWeight="700"
            fontFamily="MicrosoftYaHei"
          >
            {userData?.username ? userData?.username : t('disconnect')}
          </Text>
          <Flex alignItems="center" mt="16px">
            {userData?.wallet_address ? (
              <>
                <ShimmerImage
                  w="24px"
                  h="24px"
                  src="/images/points/uuu.png"
                  mr="8px"
                />
                <Text
                  fontSize="24px"
                  color="#544AEC"
                  fontFamily="PingFangSC-Medium"
                  fontWeight="500"
                >
                  {uuInfo?.integral || 0}
                </Text>
              </>
            ) : (
              <></>
              // <Box
              //   cursor="pointer"
              //   onClick={() => {
              //     web2LoginModal?.current?.open();
              //   }}
              // >
              //   Login to View
              // </Box>
            )}
            {/* <Text
              fontSize="24px"
              color="#544AEC"
              fontFamily="PingFangSC-Medium"
              fontWeight="500"
            >
              {userData?.wallet_address ? uuInfo?.integral || 0 : 0}
            </Text> */}
          </Flex>
          <Button
            w="270px"
            h="56px"
            fontSize="20px"
            bgColor="rgba(237, 234, 240, 0.5)"
            overflow="hidden"
            mt="36px"
            onClick={() => {
              !isConnected
                ? web2LoginModal?.current?.open()
                : historyModalRef?.current?.open();
            }}
          >
            {userData?.wallet_address ? t('uuuRecord') : t('loginToView')}
          </Button>
        </Flex>
        <Box pl="30px">
          <Text
            fontSize="18px"
            color="#000"
            fontFamily="MicrosoftYaHei"
            fontWeight="700"
            mb="20px"
          >
            {t('getuuuRecord')}
          </Text>
          <Box
            w="270px"
            position="relative"
            background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
            borderRadius="16px"
            p="12px 12px 14px 18px"
            mb="20px"
            cursor="pointer"
            onClick={() => {
              if (!userData?.wallet_address) {
                return web2LoginModal?.current?.open();
              }
              CheckInModalRef?.current?.open();
            }}
          >
            <Text
              fontSize="20px"
              color="#fff"
              fontFamily="MicrosoftYaHei"
              fontWeight="500"
              mb="5px"
            >
              {t('sign')}
            </Text>
            <Text fontSize="14px" color="rgba(255,255,255,0.64)" mb="12px">
              {isSign ? t('hasSign') : t('unSignTip')}
            </Text>
            <Flex mb="12px">
              <Box
                w="32px"
                h="32px"
                rounded="full"
                border="1px solid #FFFFFF;"
                mr="16px"
              >
                <ShimmerImage
                  w="100%"
                  h="100%"
                  src="/images/points/clflla1.png"
                  // src="https://res.cloudinary.com/unemeta/image/upload/v1691500467/76c8afdb7c991d7c01c1c93a278bed85_jygqcm.webp"
                  rounded="full"
                />
              </Box>
              <Box
                w="32px"
                h="32px"
                rounded="full"
                border="1px solid #FFFFFF;"
                mr="16px"
              >
                <ShimmerImage
                  w="100%"
                  h="100%"
                  src="/images/points/clflla2.png"
                  // src="https://res.cloudinary.com/unemeta/image/upload/v1691500467/0450a127ad7fef7c9cab3c1125f58dee_clflla.webp"
                  rounded="full"
                />
              </Box>
              <Box
                w="32px"
                h="32px"
                rounded="full"
                border="1px solid #FFFFFF;"
                mr="16px"
              >
                <ShimmerImage
                  w="100%"
                  h="100%"
                  src="/images/points/clflla3.png"
                  // src="https://res.cloudinary.com/unemeta/image/upload/v1691500467/2061_2023_07_25_11_12_24_yah3an.webp"
                  rounded="full"
                />
              </Box>
              <Box w="32px" h="32px" rounded="full" border="1px solid #FFFFFF;">
                <ShimmerImage
                  w="100%"
                  h="100%"
                  src="/images/points/clflla4.png"
                  // src="https://res.cloudinary.com/unemeta/image/upload/v1691500467/morekudasai_2023_07_25_11_30_12_rp2qu5.webp"
                  rounded="full"
                />
              </Box>
            </Flex>
            <Text fontSize="14px" color="rgba(255,255,255,0.64);">
              {userData?.wallet_address
                ? t('waitSignDesc').replace('xx', String(signCount ?? 0))
                : ''}
            </Text>
            <ShimmerImage
              position="absolute"
              top="34px"
              right="20px"
              w="18px"
              h="11px"
              src="/images/points/rigth111.png"
              // src="https://res.cloudinary.com/unemeta/image/upload/v1690610625/%E7%AE%AD%E5%A4%B4_%E5%90%91%E5%8F%B3_2x_zz4pac.png"
            />
          </Box>
          <Box
            w="270px"
            position="relative"
            background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
            borderRadius="16px"
            p="12px 12px 14px 18px"
            mb="20px"
            cursor="pointer"
            onClick={() => {
              if (!userData?.wallet_address) {
                return web2LoginModal?.current?.open();
              }
              router.push(`/user/${userData?.wallet_address}`);
            }}
          >
            <Text
              fontSize="20px"
              color="#fff"
              fontFamily="MicrosoftYaHei"
              fontWeight="500"
              mb="5px"
            >
              {t('gduu')}
            </Text>
            <Text fontSize="14px" color="rgba(255,255,255,0.64)">
              {t('gduuTip1').replace('xx', '10')}
              {t('firstgduuTip1')}
            </Text>
            <ShimmerImage
              position="absolute"
              top="34px"
              right="20px"
              w="18px"
              h="11px"
              src="/images/points/rigth111.png"
              // src="https://res.cloudinary.com/unemeta/image/upload/v1690610625/%E7%AE%AD%E5%A4%B4_%E5%90%91%E5%8F%B3_2x_zz4pac.png"
            />
          </Box>
          <Box
            position="relative"
            w="270px"
            background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
            borderRadius="16px"
            p="12px 12px 14px 18px"
            mb="20px"
            cursor="pointer"
            onClick={() => {
              if (!userData?.wallet_address) {
                return web2LoginModal?.current?.open();
              }
              router.push('/');
            }}
          >
            <Text
              fontSize="20px"
              color="#fff"
              fontFamily="MicrosoftYaHei"
              fontWeight="500"
              mb="5px"
            >
              {t('buyNft')}
            </Text>
            <Text fontSize="14px" color="rgba(255,255,255,0.64)">
              {t('highAward')}
            </Text>
            <ShimmerImage
              position="absolute"
              top="34px"
              right="20px"
              w="18px"
              h="11px"
              src="/images/points/rigth111.png"
              // src="https://res.cloudinary.com/unemeta/image/upload/v1690610625/%E7%AE%AD%E5%A4%B4_%E5%90%91%E5%8F%B3_2x_zz4pac.png"
            />
          </Box>
          <Box
            position="relative"
            w="270px"
            background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
            borderRadius="16px"
            p="12px 12px 14px 18px"
            mb="20px"
            cursor="pointer"
            onClick={() => {
              if (!userData?.wallet_address) {
                return web2LoginModal?.current?.open();
              }
              InviteFriendsModalRef?.current?.open();
            }}
          >
            <Text
              fontSize="20px"
              color="#fff"
              fontFamily="MicrosoftYaHei"
              fontWeight="500"
              mb="5px"
            >
              {t('inviteTitle')}
            </Text>
            <Text fontSize="14px" color="rgba(255,255,255,0.64)">
              {userData?.wallet_address
                ? t('remainInviteNum').replace(
                    'xx',
                    String(inviteMsg?.remain_invited ?? 0),
                  )
                : t('mostUuu')}
              {/* {t('remainInviteNum').replace(
                'xx',
                String(inviteMsg?.remain_invited ?? 0),
              )} */}
            </Text>
            <ShimmerImage
              position="absolute"
              top="34px"
              right="20px"
              w="18px"
              h="11px"
              src="/images/points/rigth111.png"
              // src="https://res.cloudinary.com/unemeta/image/upload/v1690610625/%E7%AE%AD%E5%A4%B4_%E5%90%91%E5%8F%B3_2x_zz4pac.png"
            />
          </Box>
          {!(userData?.wallet_address && userData.login_email) && (
            <NextLink href="" passHref>
              <Link>
                <Box
                  position="relative"
                  w="270px"
                  background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                  borderRadius="16px"
                  p="12px 12px 14px 18px"
                  cursor="pointer"
                  onClick={() => {
                    // 未登录或者web2登陆未连接钱包出登陆弹窗
                    if (!cookieToken || !userData?.wallet_address) {
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
                    fontSize="20px"
                    color="#fff"
                    fontFamily="MicrosoftYaHei"
                    fontWeight="500"
                    mb="5px"
                  >
                    {t('bindEmailTitle')}
                  </Text>
                  <Text fontSize="14px" color="rgba(255,255,255,0.64)">
                    {t('bindEmailDesc')}
                  </Text>
                  <ShimmerImage
                    position="absolute"
                    top="34px"
                    right="20px"
                    w="18px"
                    h="11px"
                    src="/images/points/rigth111.png"
                    // src="https://res.cloudinary.com/unemeta/image/upload/v1690610625/%E7%AE%AD%E5%A4%B4_%E5%90%91%E5%8F%B3_2x_zz4pac.png"
                  />
                </Box>
              </Link>
            </NextLink>
          )}
        </Box>
      </Box>
    );
  };

  const renderMainContentArea = () => {
    return (
      <Box
        flex="1"
        borderLeft="1px solid rgba(0,0,0,0.12)"
        borderRight="1px solid rgba(0,0,0,0.12)"
        py="40px"
        px="30px"
      >
        {handleAllExchangeList(list)?.length ? (
          <Box mb="24px">
            <Text
              fontFamily="MicrosoftYaHei"
              fontWeight="700"
              fontSize="24px"
              color="#000"
              mb="16px"
            >
              {t('exchangeTitle')}
            </Text>
            <SimpleGrid
              flex="1"
              templateColumns={{
                base: '1fr 1fr',
                md: `repeat(auto-fill, minmax(280px, 1fr))`,
              }}
              spacingX="22px"
              spacingY="16px"
            >
              {handleAllExchangeList(list).map((v: any, index: number) => {
                return (
                  <Box
                    key={v.id || v.tokenId}
                    rounded="8px"
                    border="1px solid rgba(0,0,0,0.12);"
                    overflow="hidden"
                    onClick={() => {
                      if (v?.user_type && userData?.is_new_user) {
                        if (userData?.wallet_address) {
                          OrderTipModalRef?.current?.open(v);
                        } else {
                          web2LoginModal?.current?.open();
                        }
                      } else if (!v?.user_type) {
                        if (userData?.wallet_address) {
                          OrderTipModalRef?.current?.open(v);
                        } else {
                          web2LoginModal?.current?.open();
                        }
                      } else {
                        onOpen();
                      }
                    }}
                    cursor="pointer"
                  >
                    <ShimmerImage
                      w="100%"
                      pb="100%"
                      src={v.img_url}
                      borderTopLeftRadius="8px"
                      borderTopRightRadius="8px"
                    />
                    <Box p="16px">
                      <Text
                        fontFamily="MicrosoftYaHei"
                        fontWeight="500"
                        fontSize="16px"
                        color="#000"
                        noOfLines={2}
                        mb="10px"
                      >
                        {v.title}
                      </Text>
                      <Flex mb="12px">
                        <ShimmerImage
                          w="18px"
                          h="18px"
                          src="/images/points/uuu.png"
                          // src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                          mr="4px"
                        />
                        <Text
                          fontFamily="MicrosoftYaHei"
                          fontWeight="500"
                          fontSize="16px"
                          color="#544AEC"
                          mr="12px"
                          lineHeight="20px"
                        >
                          {v.integral}
                        </Text>
                        <Text
                          fontSize="14px"
                          color="rgba(0,0,0,0.4);"
                          lineHeight="20px"
                          whiteSpace="nowrap"
                        >
                          {v.total}/{v.total_real} {t('remainTip')}
                        </Text>
                      </Flex>
                      <Button
                        variant={'primary'}
                        w="100%"
                        _hover={{
                          bg: 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);',
                        }}
                        height="40px"
                        textAlign="center"
                        lineHeight="40px"
                        color="#fff"
                        fontSize="14px"
                        fontFamily="PingFangSC-Medium"
                        fontWeight="bold"
                        background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                        rounded="4px"
                      >
                        {t('exchangeBtn')}
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        ) : null}
        {orderList?.length ? (
          <Box mb="24px">
            <Flex direction="column" mb="16px">
              <Text
                fontFamily="PingFangSC-Medium"
                fontWeight="bold"
                fontSize="24px"
                color="#000"
                mb="4px"
              >
                {t('reserveTitle')}
              </Text>
              <Text fontSize="16px" color="rgba(0,0,0,0.6)">
                {t('reserveTip')}
              </Text>
            </Flex>
            <SimpleGrid
              flex="1"
              templateColumns={{
                base: '1fr 1fr',
                md: `repeat(auto-fill, minmax(280px, 1fr))`,
              }}
              spacingX="22px"
              spacingY="16px"
            >
              {orderList.map((v: any) => {
                return (
                  <Box
                    key={v.id || v.tokenId}
                    rounded="8px"
                    border="1px solid rgba(0,0,0,0.12);"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => {
                      updateOrderType('reserve');
                      if (v?.user_type && userData?.is_new_user) {
                        if (userData?.wallet_address) {
                          OrderTipModalRef?.current?.open(v);
                        } else {
                          web2LoginModal?.current?.open();
                        }
                      } else if (!v?.user_type) {
                        if (userData?.wallet_address) {
                          OrderTipModalRef?.current?.open(v);
                        } else {
                          web2LoginModal?.current?.open();
                        }
                      } else {
                        onOpen();
                      }
                      // if (!userData?.wallet_address) {
                      //   web2LoginModal?.current?.open();
                      // } else {
                      //   OrderTipModalRef?.current?.open(v);
                      // }
                    }}
                  >
                    <ShimmerImage
                      w="100%"
                      pb="100%"
                      src={v.img_url}
                      borderTopLeftRadius="8px"
                      borderTopRightRadius="8px"
                    />
                    <Box p="16px">
                      <Text
                        fontFamily="MicrosoftYaHei"
                        fontWeight="500"
                        fontSize="16px"
                        color="#000"
                        noOfLines={2}
                        mb="10px"
                      >
                        {v.title}
                      </Text>
                      <Flex mb="12px">
                        <ShimmerImage
                          w="18px"
                          h="18px"
                          src="/images/points/uuu.png"
                          // src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                          mr="4px"
                        />
                        <Text
                          fontFamily="MicrosoftYaHei"
                          fontWeight="500"
                          fontSize="16px"
                          color="#544AEC"
                          mr="12px"
                          lineHeight="20px"
                        >
                          {v.integral}
                        </Text>
                        <Text
                          fontSize="14px"
                          color="rgba(0,0,0,0.4);"
                          lineHeight="20px"
                          whiteSpace="nowrap"
                        >
                          {v.total}/{v.total_real} {t('remainTip')}
                        </Text>
                      </Flex>
                      <Box
                        w="100%"
                        h="32px"
                        rounded="4px"
                        bg="linear-gradient(146deg, rgba(255, 74, 246, 1), rgba(54, 35, 251, 1), rgba(0, 153, 255, 1))"
                        p="2px"
                      >
                        <Button
                          variant={'primary'}
                          w="100%"
                          _hover={{
                            background: '#fffff',
                          }}
                          height="28px"
                          textAlign="center"
                          lineHeight="28px"
                          color="#544AEC"
                          fontSize="14px"
                          fontFamily="PingFangSC-Medium"
                          fontWeight="bold"
                          rounded="2px"
                          background="#ffffff"
                        >
                          {t('reserve')}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
          </Box>
        ) : null}
        <Box>
          <Flex direction="column" mb="16px">
            <HStack
              spacing="40px"
              px="11px"
              w="100%"
              overflowX="scroll"
              sx={{
                'scrollbar-width': 'none',
                '-ms-overflow-style': 'none',
                '::-webkit-scrollbar': {
                  display: 'none',
                },
              }}
            >
              {tabs.map((v) => (
                <Text
                  key={v.key}
                  h="auto"
                  py="14px"
                  fontSize="24px"
                  lineHeight="32px"
                  fontFamily="MicrosoftYaHei"
                  fontWeight="700"
                  color={activeTab === v.key ? '#000' : 'rgba(0,0,0,0.25)'}
                  pos="relative"
                  _after={{
                    content: '" "',
                    pos: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    w: '42px',
                    h: '4px',
                    bgColor: '#544AEC',
                    rounded: '2px',
                    display: activeTab === v.key ? 'block' : 'none',
                  }}
                  cursor="pointer"
                  onClick={() => setActiveTab(v.key)}
                >
                  {v.name}
                </Text>
              ))}
            </HStack>
          </Flex>
          <Box
            h={orderList?.length ? '40vw' : '60vw'}
            overflow={'auto'}
            sx={{
              '::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <SimpleGrid
              flex="1"
              templateColumns={{
                base: '1fr 1fr',
                md: `repeat(auto-fill, minmax(280px, 1fr))`,
              }}
              spacingX="22px"
              spacingY="16px"
            >
              {(list[String(activeTab)] || []).map((v: any, index: number) => {
                return (
                  <Box
                    key={v.id || v.tokenId}
                    rounded="8px"
                    border="1px solid rgba(0,0,0,0.12);"
                    overflow="hidden"
                    onClick={() => {
                      updateOrderType('exChange');
                      if (
                        !(
                          activeTab !== 3 &&
                          ((v.unlimit > 0 && v.already_exchange >= v.unlimit) ||
                            v.toal <= 0 ||
                            v.project_status * 1 === 2)
                        )
                      ) {
                        if (v?.user_type && userData?.is_new_user) {
                          if (userData?.wallet_address) {
                            OrderTipModalRef?.current?.open(v);
                          } else {
                            web2LoginModal?.current?.open();
                          }
                        } else if (!v?.user_type) {
                          if (userData?.wallet_address) {
                            OrderTipModalRef?.current?.open(v);
                          } else {
                            web2LoginModal?.current?.open();
                          }
                        } else {
                          onOpen();
                        }
                        // if (userData?.wallet_address) {
                        //   OrderTipModalRef?.current?.open(v);
                        // } else {
                        //   web2LoginModal?.current?.open();
                        // }
                      }
                    }}
                    cursor="pointer"
                  >
                    <ShimmerImageMemo
                      w="100%"
                      pb="100%"
                      src={v.img_url}
                      rounded="8px 8px 0px 0px"
                    />
                    <Box p="16px">
                      <Text
                        fontFamily="MicrosoftYaHei"
                        fontWeight="500"
                        fontSize="16px"
                        color="#000"
                        noOfLines={1}
                        mb="10px"
                      >
                        {v.title}
                      </Text>
                      <Flex mb="12px">
                        <ShimmerImage
                          w="18px"
                          h="18px"
                          src="/images/points/uuu.png"
                          // src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                          mr="4px"
                        />
                        <Text
                          fontFamily="MicrosoftYaHei"
                          fontWeight="500"
                          fontSize="16px"
                          color="#544AEC"
                          mr="12px"
                          lineHeight="20px"
                        >
                          {v.integral}
                        </Text>
                        <Text
                          fontSize="14px"
                          color="rgba(0,0,0,0.4);"
                          lineHeight="20px"
                          whiteSpace="nowrap"
                        >
                          {v.total}/{v.total_real} {t('remainTip')}
                        </Text>
                      </Flex>
                      <Button
                        variant={'primary'}
                        w="100%"
                        _hover={{
                          bg: 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);',
                        }}
                        _disabled={{
                          bg: 'rgba(0, 0, 0, 0.2)',
                        }}
                        height="40px"
                        textAlign="center"
                        lineHeight="40px"
                        color="#fff"
                        fontSize="14px"
                        fontFamily="PingFangSC-Medium"
                        fontWeight="bold"
                        background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                        rounded="4px"
                        isDisabled={
                          activeTab !== 3 &&
                          ((v.unlimit > 0 && v.already_exchange >= v.unlimit) ||
                            v.toal <= 0 ||
                            v.project_status * 1 === 2)
                        }
                      >
                        {activeTab === 1 && v.status
                          ? t('redeemed')
                          : t('exchangeBtn')}
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
            <Box
              bg={'blackAlpha.500'}
              w={'200px'}
              h={'8px'}
              m={'auto'}
              borderRadius={'15px'}
              mt="10px"
            ></Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderRightArea = () => {
    const tabStyle = {
      active: '1px solid #544AEC',
      regular: '1px solid rgba(0,0,0,0.2)',
    };

    const colorStyle = {
      active: '#6157FF',
      regular: 'rgba(0,0,0,0.4)',
    };

    const bgStyle = [
      'linear-gradient(135deg, #FFE400 0%, #FFC500 100%);',
      'linear-gradient(135deg, #0080FF 0%, #4A71FF 100%);',
      'linear-gradient(135deg, #FF9000 0%, #FF5300 100%)',
    ];

    return (
      <Box w="330px" py="40px">
        <Box px="20px" pb="30px" borderBottom="1px solid rgba(0,0,0,0.12)">
          <Flex alignItems={'center'} mb="16px">
            <Text
              fontFamily="MicrosoftYaHei"
              fontWeight="700"
              fontSize="24px"
              color="#000"
              mr="8px"
              whiteSpace="nowrap"
            >
              {t('rank.rankTitle')}
            </Text>
            <Tooltip label={t('rank.rankDesc')} hasArrow placement="top">
              <QuestionOutlineIcon />
            </Tooltip>
          </Flex>
          <Flex cursor="pointer" mb="8px">
            <Box
              height="32px"
              px="12px"
              lineHeight="30px"
              fontSize="14px"
              textAlign="center"
              color={
                curRankTab === 'month' ? colorStyle.active : colorStyle.regular
              }
              border={
                curRankTab === 'month' ? tabStyle.active : tabStyle.regular
              }
              borderRight={curRankTab === 'all' ? 'none' : tabStyle.active}
              borderTopLeftRadius="4px"
              borderBottomLeftRadius="4px"
              onClick={onChangeRankTab.bind(null, 'month')}
              w={'50%'}
            >
              {t('rank.month')}
            </Box>
            <Box
              height="32px"
              px="12px"
              lineHeight="30px"
              fontSize="14px"
              textAlign="center"
              color={
                curRankTab === 'all' ? colorStyle.active : colorStyle.regular
              }
              border={curRankTab === 'all' ? tabStyle.active : tabStyle.regular}
              borderLeft={curRankTab === 'month' ? 'none' : tabStyle.active}
              borderTopRightRadius="4px"
              borderBottomRightRadius="4px"
              onClick={onChangeRankTab.bind(null, 'all')}
              w={'50%'}
            >
              {t('rank.all')}
            </Box>
          </Flex>
          {curRankTab === 'month' ? (
            <Text
              py="6px"
              background="rgba(84,74,236,0.12);"
              rounded="4px"
              color="#6157FF;"
              fontSize="14px"
              mb="20px"
              textAlign="left"
              px="10px"
            >
              {t('rank.rankTip')}
            </Text>
          ) : (
            ''
          )}
          <Box>
            <Flex mb="24px" pl="11px">
              <Text width="66px" fontSize="14px" color="rgba(0,0,0,0.4)">
                {t('rank.rankNum')}
              </Text>
              <Text width="144px" fontSize="14px" color="rgba(0,0,0,0.4)">
                {t('rank.rankName')}
              </Text>
              <Text
                flex="1"
                fontSize="14px"
                color="rgba(0,0,0,0.4)"
                textAlign="center"
                whiteSpace="nowrap"
              >
                {t('rank.rankIntegral')}
              </Text>
            </Flex>
            {rankList.map((v: any, index: number) => (
              <Flex
                key={`${v?.wallet}${Math.random()}`}
                px="12px"
                py="8px"
                background={
                  index + 1 == rankMine?.level
                    ? 'rgba(226,225,239, 0.4)'
                    : 'transparent'
                }
              >
                <Box width="66px">
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
                      {index + 1}
                    </Text>
                  ) : (
                    <Text
                      width="28px"
                      py="3px"
                      fontSize="14px"
                      textAlign="center"
                      color="rgba(0,0,0,0.4)"
                    >
                      {index + 1}
                    </Text>
                  )}
                </Box>
                <Flex width="144px" alignItems="center">
                  {v?.icon ? (
                    <ShimmerImage
                      w="32px"
                      h="32px"
                      src={v?.icon}
                      mr="8px"
                      rounded="full"
                      border={'1px solid #F7F8FA'}
                    />
                  ) : null}
                  <Text fontSize="14px" color="#000">
                    {/* {'te262050d9Eca71291582C2c65ca6'} */}
                    {v?.nick_name?.slice(0, 10)}
                  </Text>
                </Flex>
                <Box flex="1">
                  <Text fontSize="14px" color="#544AEC" textAlign="center">
                    {v?.score}
                  </Text>
                </Box>
              </Flex>
            ))}
            {(rankMine?.level == 0 || rankMine?.level > 10) &&
            userData?.wallet_address ? (
              <Flex
                key={userData?.wallet_address}
                alignItems="center"
                px="12px"
                py="8px"
                background="rgba(226,225,239, 0.4)"
                borderTopLeftRadius="4px"
                borderTopRightRadius="4px"
              >
                <Box width="66px">
                  <Text
                    py="3px"
                    fontSize="14px"
                    textAlign="left"
                    color="rgba(0,0,0,0.4)"
                    whiteSpace="nowrap"
                  >
                    {rankMine?.level > 10 ? rankMine?.level : t('rank.unrank')}
                  </Text>
                </Box>
                <Flex width="144px" alignItems="center">
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
                  <Text fontSize="14px" color="#544AEC" textAlign="center">
                    {rankMine?.score}
                  </Text>
                </Box>
              </Flex>
            ) : null}
            {!userData?.wallet_address ? (
              <Flex
                key={Math.random() * 10000}
                alignItems="center"
                px="12px"
                py="4px"
                background="rgba(226,225,239, 0.4)"
                borderTopLeftRadius="4px"
                borderTopRightRadius="4px"
                cursor="pointer"
                onClick={() => {
                  web2LoginModal?.current?.open();
                }}
              >
                <Box width="66px">
                  <Text
                    width="28px"
                    py="3px"
                    fontSize="14px"
                    textAlign="center"
                    color="rgba(0,0,0,0.4)"
                  >
                    ???
                  </Text>
                </Box>
                <Flex width="60px" alignItems="center">
                  <ShimmerImage
                    w="32px"
                    h="32px"
                    src="https://res.cloudinary.com/unemeta/image/upload/f_auto,q_auto/v1/samples/ai5v6ihpkkkkpybo4znl"
                    mr="8px"
                    rounded="full"
                  />
                  <Text fontSize="14px" color="#000">
                    {t('rank.mine')}
                  </Text>
                </Flex>
                <Box flex="1">
                  <Text
                    fontSize="14px"
                    color="#544AEC"
                    textAlign="center"
                    whiteSpace="nowrap"
                  >
                    {t('rank.unlogin')}
                  </Text>
                </Box>
              </Flex>
            ) : null}
          </Box>
        </Box>
        <Box mt="30px" px="20px">
          <Text
            fontFamily="MicrosoftYaHei"
            fontWeight="700"
            fontSize="24px"
            color="#000"
            mb="23px"
          >
            {t('aboutIntegral')}
          </Text>
          <Text fontSize="14px" color="#000" mb="40px">
            {t('integralDesc')}
          </Text>
          <Box
            w="100%"
            rounded="16px"
            bg="linear-gradient(146deg, rgba(255, 74, 246, 1), rgba(54, 35, 251, 1), rgba(0, 153, 255, 1))"
            p="2px"
            mb="20px"
          >
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              w="100%"
              rounded="14px"
              background="#F7F7F7"
              py="10px"
              h="120px"
            >
              <Text
                fontFamily="MicrosoftYaHei"
                fontWeight="700"
                fontSize="32px"
                color="#544AEC"
                lineHeight="34px"
                mb="8px"
              >
                4000+
              </Text>
              <Text
                fontFamily="PingFangSC-Medium"
                fontSize="14px"
                color="rgba(0,0,0,0.4)"
                px="18px"
                wordBreak="break-all"
                textAlign="center"
              >
                {t('allExchangeWhiteList')}
              </Text>
            </Flex>
          </Box>
          <Box
            w="100%"
            rounded="16px"
            bg="linear-gradient(146deg, rgba(255, 74, 246, 1), rgba(54, 35, 251, 1), rgba(0, 153, 255, 1))"
            p="2px"
            mb="20px"
          >
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              w="100%"
              rounded="14px"
              background="#F7F7F7"
              py="10px"
              h="120px"
            >
              <Text
                fontFamily="MicrosoftYaHei"
                fontWeight="700"
                fontSize="32px"
                color="#544AEC"
                lineHeight="34px"
                mb="8px"
              >
                16000+ USDT
              </Text>
              <Text
                fontFamily="PingFangSC-Medium"
                fontSize="14px"
                color="rgba(0,0,0,0.4)"
                px="18px"
                wordBreak="break-all"
                textAlign="center"
              >
                {t('allExchangeAirdrop')}
              </Text>
            </Flex>
          </Box>
          <Box
            w="100%"
            rounded="16px"
            bg="linear-gradient(146deg, rgba(255, 74, 246, 1), rgba(54, 35, 251, 1), rgba(0, 153, 255, 1))"
            p="2px"
            mb="56px"
          >
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              w="100%"
              rounded="14px"
              background="#F7F7F7"
              py="10px"
              h="120px"
            >
              <Text
                fontFamily="MicrosoftYaHei"
                fontWeight="700"
                fontSize="32px"
                color="#544AEC"
                lineHeight="34px"
                mb="8px"
              >
                167%
              </Text>
              <Text
                fontFamily="PingFangSC-Medium"
                fontSize="14px"
                color="rgba(0,0,0,0.4)"
                px="18px"
                wordBreak="break-all"
                textAlign="center"
              >
                {t('exchangeSupremeRights')}
              </Text>
            </Flex>
          </Box>
          <Flex w="227px" margin="0 auto" justifyContent="space-between">
            <a
              href=" https://www.instagram.com/unemeta.verse/ "
              target="_blank"
              rel="noreferrer"
            >
              <ShimmerImage
                w="33px"
                h="33px"
                src="https://res.cloudinary.com/unemeta/image/upload/v1690908340/%E7%BC%96%E7%BB%84_2x_qpujox.png"
              />
            </a>
            <a
              href="https://twitter.com/UneWeb3"
              target="_blank"
              rel="noreferrer"
            >
              <ShimmerImage
                w="33px"
                h="33px"
                src="https://res.cloudinary.com/unemeta/image/upload/v1690908340/%E7%BC%96%E7%BB%84_2x_1_vwyfcn.png"
              />
            </a>
            <a
              href="https://discord.com/invite/YzztkC6ENe"
              target="_blank"
              rel="noreferrer"
            >
              <ShimmerImage
                w="33px"
                h="33px"
                src="https://res.cloudinary.com/unemeta/image/upload/v1690908340/%E7%BC%96%E7%BB%84_2x_2_cmvvad.png"
              />
            </a>
          </Flex>
        </Box>
      </Box>
    );
  };

  const init = () => {
    const date = new Date();
    // 获取自身邀请码
    const fetchInviteCode = async () => {
      try {
        const res = await pointsApi.getInviteCode();
        updateInviteResult(res.data);
        setInviteCode(res.data.scode);
        setInvited(res.data.is_invited);
      } catch (err) {}
    };

    // 获取签到状态
    const fetchSignStatus = async () => {
      const result = await getSignedInDate({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        source: 2,
      });
      updateSignStatus(result?.data?.today_sign_in_status);
      updateSignCount(result?.data?.today_sign_in_count);
    };

    const handleTimeStorage = () => {
      deleteBeforeValue();
      const time = getLocalTimeValue();
      if (!time) {
        CheckInModalRef?.current?.open('bg');
        setLocalTimeValue();
      }
    };
    fetchUuInfo();
    fetchWhiteList();
    fetchInviteCode();
    fetchSignStatus();
    handleTimeStorage();
    refreshSpecialInfo();
    refreshCfxInfo();
  };

  const onSign = () => {
    init();
  };

  useEffect(() => {
    setInvitationUrl(
      `${window.location.host}${window.location.pathname}?invitationCode=true`,
    );
  }, []);
  const [, setInviteCode] = useInvitationCode();
  const [, setInvited] = useIsInvited();

  useEffect(() => {
    if (userData?.wallet_address) {
      init();
    }
  }, [userData?.wallet_address]);

  useEffect(() => {
    // 获取积分排行榜
    const fetchScoreRank = async () => {
      const rankMap: any = {
        month: 1,
        all: 2,
      };

      const result = await getScoreRank({
        page: 1,
        page_size: 10,
        type: rankMap[curRankTab],
      });
      updateRankList(result?.data?.board_list ?? []);
      updateRankMine(result?.data?.my_info);
    };

    fetchScoreRank();
  }, [curRankTab]);

  useEffect(() => {
    if (userData?.wallet_address) {
      init();
    }
    init();
  }, [router?.locale]);

  return (
    <Box>
      <CommonHead title="Rewards" />
      {isLargerThan768 ? (
        <>
          <Banner />
          <Flex w="full" background="#fff">
            {renderLeftArea()}
            {renderMainContentArea()}
            {renderRightArea()}
          </Flex>
        </>
      ) : (
        <Mobile
          userData={userData}
          uuInfo={uuInfo}
          rankList={rankList}
          rankMine={rankMine}
          list={list}
          inviteMsg={inviteMsg}
          invitationUrl={invitationUrl}
          orderList={orderList}
          isSign={isSign}
          onTabChange={(key) => {
            onChangeRankTab(key);
          }}
          onReserve={(v) => {
            updateOrderType('reserve');
            if (v?.user_type && userData?.is_new_user) {
              if (userData?.wallet_address) {
                OrderTipModalRef?.current?.open(v);
              } else {
                web2LoginModal?.current?.open();
              }
            } else if (!v?.user_type) {
              if (userData?.wallet_address) {
                OrderTipModalRef?.current?.open(v);
              } else {
                web2LoginModal?.current?.open();
              }
            } else {
              onOpen();
            }
            // OrderTipModalRef?.current?.open(v);
          }}
          onExChange={(v) => {
            if (v?.user_type && userData?.is_new_user) {
              if (userData?.wallet_address) {
                OrderTipModalRef?.current?.open(v);
              } else {
                web2LoginModal?.current?.open();
              }
            } else if (!v?.user_type) {
              if (userData?.wallet_address) {
                OrderTipModalRef?.current?.open(v);
              } else {
                web2LoginModal?.current?.open();
              }
            } else {
              onOpen();
            }
            // OrderTipModalRef?.current?.open(v);
          }}
          onSign={() => {
            CheckInModalRef?.current?.open();
          }}
          onLogin={() => {
            web2LoginModal?.current?.open();
          }}
        />
      )}
      {/**货币兑换提示 */}
      <TipsModal
        ref={tipsModalRef}
        callback={() => exchangeModalRef?.current?.open()}
        type={activeTab}
        info={selectedRow}
      />
      {/**实物兑换提示填写邮箱和地址 */}
      <InfoModal
        ref={infoModalRef}
        callback={refreshSpecialInfo}
        type={activeTab}
        id={specialId}
        specialType={specialType}
        info={selectedRow}
      />
      {/* 兑换积分 */}
      <ExchangeModal
        ref={exchangeModalRef}
        info={selectedRow}
        refreshInfo={fetchUuInfo}
      />

      <CfxModal
        ref={CfxModalRef}
        callback={refreshCfxInfo}
        type={activeTab}
        id={specialId}
        specialType={specialType}
        info={selectedRow}
      />

      <InputCodeModal ref={inputCodeModalRef} />
      <Footer />
      <HistoryModal ref={historyModalRef} />

      <InviteFriendsModal
        invitationUrl={invitationUrl}
        dataSource={inviteMsg}
        ref={InviteFriendsModalRef}
      />

      <OrderTipModaModal
        onExChange={(itemInfo) => {
          if (curOrderType === 'reserve') {
            MailModalRef?.current?.open(itemInfo);
          } else {
            onExchange(itemInfo);
          }
        }}
        type={curOrderType}
        ref={OrderTipModalRef}
      />

      <MailModal
        onMailInput={onSureReserve}
        ref={MailModalRef}
        onMailModalClose={() => {
          if (!isLargerThan768) {
            OrderTipModalRef?.current?.close();
          }
        }}
      />

      <GetUUU ref={GetUUURef} getFun={getInvite}></GetUUU>
      <CheckInModal
        ref={CheckInModalRef}
        onSignSuccess={onSign}
        getFun={getFun}
      />
      <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {/* {overlay} */}
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box
              // w="382px"
              // color="#ffffff"
              // h="382px"
              // bgImage={bgImage}
              // bgRepeat="no-repeat"
              alignItems={'center'}
              flexDir={'column'}
              display={'flex'}
              fontFamily="Roboto-Regular, Roboto"
            >
              <Image src="/images/common/logo.png" h="120px" mt="80px" />
              <Text mt="30px">{t('modalTitle')}</Text>
              <Box
                // w={'240px'}
                py="8px"
                mt={'12px'}
                fontSize={'14px'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                opacity={'0.6'}
                lineHeight={'20px'}
                // boxShadow={'0px 2px 30px 0px rgba(52,151,233,0.12)'}
                borderRadius={'8px'}
                border={'1px solid rgba(255,255,255,0.09)'}
              >
                <Text
                  textAlign={'center'}
                  dangerouslySetInnerHTML={{
                    __html: t('modalDoc'),
                  }}
                />
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              _hover={{ bg: '#FB9D42' }}
              bgColor="#FB9D42"
              w="100%"
              onClick={onClose}
            >
              {t('modalOk')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
  const messages = await serverSideTranslations(locale, ['points']);
  // const [
  //   { data: whiteList },
  //   { data: special },
  //   { data: currency },
  //   { data: cfx },
  // ] = await Promise.all([
  //   pointsApi.getExchangeList({ type: 1 }), //获取特殊奖励
  //   pointsApi.getExchangeList({ type: 4 }), //获取特殊奖励
  //   pointsApi.fetchPrizeInfo(),
  //   pointsApi.getExchangeList({ type: 5 }), //获取cfx奖励
  // ]);

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

  try {
    return {
      props: {
        messages,
        // data: {
        //   1: whiteList.list || [],
        //   2: special.special_list || [],
        //   3: currency.brandList || [],
        //   5: cfx.cfx_list || [],
        // },
        // initOrderList: whiteList.can_order_list || [],
      },
    };
  } catch (error) {
    return {
      props: {
        messages,
      },
    };
  }
}
