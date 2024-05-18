import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  VStack,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useTranslations } from 'next-intl';
import { useRequest } from 'ahooks';
import NexLink from 'next/link';
import { useRouter } from 'next/router';
import useCopy from '@/hooks/useCopy';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { ShimmerImage } from '@/components/Image';
import { geBannerList } from '@/services/home';
import { format } from 'date-fns';
import { Avatar } from '@/components/NftAvatar';

interface MobielProps {
  userData: any;
  uuInfo: any;
  rankList: any;
  rankMine: any;
  list: any;
  inviteMsg: any;
  invitationUrl: string;
  orderList: any;
  isSign: boolean;
  onTabChange: (v: any) => void;
  onReserve: (v: any) => void;
  onExChange: (v: any) => void;
  onSign: () => void;
  onLogin: () => void;
}

function Mobile(props: MobielProps) {
  const {
    userData = {},
    uuInfo = {},
    rankList = [],
    rankMine = {},
    list = [],
    inviteMsg = {},
    invitationUrl = '',
    orderList = [],
    isSign = false,
    onTabChange = () => void {},
    onReserve = () => void {},
    onExChange = () => void {},
    onSign = () => void {},
    onLogin = () => void {},
  } = props;
  const [loaded, setLoaded] = useState(false);
  const [bannerList, updateBannerList] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { runAsync } = useRequest(geBannerList, {
    manual: true,
  });
  const t = useTranslations('points');
  const router = useRouter();
  const [_, copy] = useCopy();
  const toast = useToast();
  const {
    isOpen: isRankModalOpen,
    onOpen: onOpenRankModel,
    onClose: onCloseRankModel,
  } = useDisclosure({
    id: 'rank',
  });
  const {
    isOpen: isInviteModelOpen,
    onOpen: onOpenInviteModal,
    onClose: onCloseInviteModal,
  } = useDisclosure({
    id: 'invite',
  });
  const [activeTab, setActiveTab] = useState(1);
  const [activeRankTab, setRankActiveTab] = useState(1);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      loop: false,
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            const abs = slider.track.details.abs;
            const maxIdx = slider.track.details.maxIdx;
            if (abs === maxIdx) {
              slider.moveToIdx(0);
            } else {
              slider.next();
            }
          }, 300000000);
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ],
  );

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

  const rankTabs = [
    {
      name: t('rank.month'),
      key: 1,
    },
    {
      name: t('rank.all'),
      key: 2,
    },
  ];

  const getList = async () => {
    let data: any = [];
    try {
      data = await runAsync({
        type: 1,
      });
    } catch (err) {
      console.log(err);
    }
    updateBannerList(data?.data?.list);
  };

  useEffect(() => {
    getList();
  }, [router?.locale]);

  const renderBannerList = () => {
    return (
      <>
        {orderList.length >= 1 || bannerList.length >= 1 ? (
          <Box ref={sliderRef} position="relative">
            <Box
              className="keen-slider"
              overflow="hidden"
              h="116px"
              pt="16px"
              pb="30px"
              boxSizing="content-box"
            >
              {orderList.map((v: any) => (
                <Box
                  key={v?.id}
                  className="keen-slider__slide"
                  overflow="visible !important"
                  minW="100% !important"
                  maxW="100% !important"
                  h="100%"
                  px="20px"
                  onClick={() => {
                    if (!userData?.wallet_address) {
                      return onLogin();
                    }
                    onReserve(v);
                  }}
                >
                  <Box
                    position="relative"
                    background="#fff"
                    boxShadow=" 0px 2px 30px 4px rgba(7,0,255,0.08);"
                    px="20px"
                    pt="40px"
                    rounded="8px"
                    h="100%"
                  >
                    <Flex alignItems="center" justifyContent="space-between">
                      <Flex alignItems="center">
                        <ShimmerImage
                          w="56px"
                          h="56px"
                          src={userData?.profile_image}
                          rounded="8px"
                          mr="16px"
                        />
                        <Flex direction="column" pt="6px">
                          <Text
                            fontSize="14px"
                            fontFamily="PingFangSC-Medium"
                            fontWeight="600"
                            color="#000"
                            mb="2px"
                          >
                            {v.title}
                          </Text>
                          <Flex alignItems="center">
                            <ShimmerImage
                              w="16px"
                              h="16px"
                              src="/images/points/uuu.png"
                              // src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                              mr="4px"
                            />
                            <Text fontSize="14px" color="#544AEC" mr="8px">
                              {v.integral}
                            </Text>
                            <Text fontSize="12px" color="rgba(0,0,0,0.4)">
                              {t('allTitle')} {v.total_real}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                      <Box
                        w="80px"
                        h="28px"
                        rounded="4px"
                        bg="linear-gradient(146deg, rgba(255, 74, 246, 1), rgba(54, 35, 251, 1), rgba(0, 153, 255, 1))"
                        p="2px"
                      >
                        <Flex
                          direction="column"
                          alignItems="center"
                          justifyContent="center"
                          w="100%"
                          h="24px"
                          rounded="2px"
                          background="#F7F7F7"
                          fontSize="14px"
                          fontFamily="PingFangSC-Medium"
                          fontWeight="bold"
                          color="#544AEC"
                        >
                          {t('reserve')}
                        </Flex>
                      </Box>
                    </Flex>
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      w="147px"
                      h="22px"
                      position="absolute"
                      left="0"
                      top="0"
                      background="url('https://res.cloudinary.com/unemeta/image/upload/v1691303298/%E7%9F%A9%E5%BD%A2_2x_yzg2tm.png') no-repeat center center"
                      backgroundSize="cover"
                      fontSize="12px"
                      color="#fff"
                    >
                      {format(
                        new Date(v?.start_time * 1000),
                        'yyyy-MM-dd HH:mm',
                      )}{' '}
                      {t('pushTop')}
                    </Flex>
                  </Box>
                </Box>
              ))}
              {bannerList.map((v: any, index: number) => (
                <Box
                  key={index}
                  className="keen-slider__slide"
                  minW="100% !important"
                  maxW="100% !important"
                  overflow="visible !important"
                  px="20px"
                >
                  <NexLink href={v?.link ?? ''}>
                    <Box w="100%" h="116px" pos={'relative'}>
                      <ShimmerImage
                        w="100%"
                        h="100%"
                        src={v?.mobile_banner}
                        objectFit="cover"
                        rounded="8px"
                        boxShadow="0px 2px 30px 4px rgba(7,0,255,0.08);"
                      />
                      <Flex
                        position="absolute"
                        bottom="0"
                        left="0"
                        width="100%"
                        h="40px"
                        background="linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);"
                        rounded="0px 0px 8px 8px;"
                        px="14px"
                        justify="space-between"
                      >
                        <Text
                          color="#fff"
                          fontSize="14px"
                          fontFamily="PingFangSC-Medium"
                          fontWeight="600"
                          noOfLines={2}
                        >
                          {v?.title}
                        </Text>
                        {v?.mobile_desc ? (
                          <Button
                            variant={'primary'}
                            _hover={{
                              bg: 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);',
                            }}
                            _disabled={{
                              bg: 'rgba(0, 0, 0, 0.2)',
                            }}
                            px="12px"
                            py="2px"
                            maxW="30vw"
                            overflow="hidden"
                            height="24px"
                            textAlign="center"
                            lineHeight="24px"
                            color="#fff"
                            fontSize="14px"
                            fontFamily="PingFangSC-Medium"
                            fontWeight="bold"
                            background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                            rounded="4px"
                          >
                            {v?.mobile_desc}
                          </Button>
                        ) : null}
                      </Flex>
                    </Box>
                  </NexLink>
                </Box>
              ))}
            </Box>
            {loaded &&
              instanceRef?.current &&
              instanceRef?.current?.track?.details?.slides.length > 1 && (
                <>
                  <HStack
                    spacing={2}
                    pos="absolute"
                    bottom="6px"
                    w="full"
                    justify="center"
                  >
                    {[
                      ...Array(
                        instanceRef?.current?.track?.details?.slides.length,
                      ).keys(),
                    ].map((idx) => (
                      <>
                        {currentSlide === idx ? (
                          <ShimmerImage
                            key={idx}
                            w="14px"
                            h="4px"
                            src="https://res.cloudinary.com/unemeta/image/upload/v1691317079/%E7%9F%A9%E5%BD%A2_2x_1_pp3vac.png"
                            onClick={() => {
                              instanceRef?.current?.moveToIdx(idx);
                            }}
                          />
                        ) : (
                          <Box
                            key={idx}
                            onClick={() => {
                              instanceRef?.current?.moveToIdx(idx);
                            }}
                            w="14px"
                            h="4px"
                            rounded="2px"
                            bg="#D1D1E0"
                          />
                        )}
                      </>
                    ))}
                  </HStack>
                </>
              )}
          </Box>
        ) : null}
      </>
    );
  };

  const renderRankModel = () => {
    const bgStyle = [
      'linear-gradient(135deg, #FFE400 0%, #FFC500 100%);',
      'linear-gradient(135deg, #0080FF 0%, #4A71FF 100%);',
      'linear-gradient(135deg, #FF9000 0%, #FF5300 100%)',
    ];
    return (
      <>
        <Flex alignItems="center" onClick={onOpenRankModel}>
          <ShimmerImage
            w="16px"
            h="16px"
            src="/images/points/rank111.png"
            mr="4px"
          />
          <Text fontSize="14px" color="#FF9D00">
            {t('rank.rankMobileTitle')}
          </Text>
        </Flex>
        <Modal
          size="full"
          onClose={onCloseRankModel}
          isOpen={isRankModalOpen}
          motionPreset="slideInRight"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex justifyContent="space-between" alignItems="center">
                <ShimmerImage
                  w="16px"
                  h="16px"
                  src="https://res.cloudinary.com/unemeta/image/upload/v1691323217/%E5%90%91%E4%B8%8B_2x_sgrq8n.png"
                  onClick={onCloseRankModel}
                />
                <Text
                  fontSize="16px"
                  color="#000"
                  fontFamily="PingFangSC-Medium"
                  fontWeight="bold"
                  ml="22.82vw"
                >
                  {t('rank.rankTitle')}
                </Text>
                <Text fontSize="12px" color="rgba(0,0,0,0.4)">
                  {t('rank.rankDesc')}
                </Text>
              </Flex>
            </ModalHeader>
            <ModalBody px={0}>
              <HStack w="100%">
                {rankTabs.map((v) => (
                  <Text
                    key={v.key}
                    w="50vw"
                    h="auto"
                    py="11px"
                    textAlign="center"
                    fontSize="16px"
                    lineHeight="22px"
                    fontFamily="PingFangSC-Medium"
                    fontWeight={600}
                    color={activeRankTab === v.key ? '#6157FF' : '#000'}
                    pos="relative"
                    _after={{
                      content: '" "',
                      pos: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      w: '50vw',
                      h: '2px',
                      background:
                        'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);',
                      display: activeRankTab === v.key ? 'block' : 'none',
                    }}
                    onClick={() => {
                      setRankActiveTab(v.key);
                      onTabChange(v.key);
                    }}
                  >
                    {v.name}
                  </Text>
                ))}
              </HStack>
              <Text
                py="6px"
                textAlign="center"
                fontSize="14px"
                color="#6157FF"
                background="rgba(84,74,236,0.12)"
                mb="12px"
              >
                {t('rank.rankTip')}
              </Text>
              <Box>
                <Flex mb="24px" px="28px">
                  <Text width="14.9vw" fontSize="14px" color="rgba(0,0,0,0.4)">
                    {t('rank.rankNum')}
                  </Text>
                  <Text width="52.6vw" fontSize="14px" color="rgba(0,0,0,0.4)">
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
                <Box>
                  {rankList.map((v: any, index: number) => (
                    <Flex
                      key={`${v?.wallet}${Math.random()}`}
                      py="8px"
                      px="28px"
                      background={
                        index + 1 == rankMine?.level
                          ? 'rgba(226,225,239, 0.4)'
                          : 'transparent'
                      }
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
                      <Flex width="52.6vw" alignItems="center">
                        {v?.icon ? (
                          <ShimmerImage
                            w="32px"
                            h="32px"
                            // src={v?.icon}
                            src="https://res.cloudinary.com/unemeta/image/upload/v1691297724/%E5%9B%BE%E7%89%87_2x_pmde6u.png"
                            mr="8px"
                            rounded="full"
                          />
                        ) : null}
                        <Text fontSize="14px" color="#000">
                          {v?.nick_name}
                        </Text>
                      </Flex>
                      <Box flex="1">
                        <Text
                          fontSize="14px"
                          color="#544AEC"
                          textAlign="center"
                        >
                          {v?.score}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </Box>
                {(rankMine?.level == 0 || rankMine?.level > 10) &&
                userData?.wallet_address ? (
                  <Flex
                    key={userData?.wallet_address}
                    alignItems="center"
                    pl="26px"
                    py="8px"
                    background="rgba(226,225,239, 0.4)"
                    borderTopLeftRadius="4px"
                    borderTopRightRadius="4px"
                  >
                    <Box width="15.2vw">
                      <Text
                        width="28px"
                        py="3px"
                        fontSize="14px"
                        textAlign="center"
                        color="rgba(0,0,0,0.4)"
                        whiteSpace="nowrap"
                      >
                        {rankMine?.level > 10 ? rankMine?.level : '未上榜'}
                      </Text>
                    </Box>
                    <Flex width="46vw" alignItems="center">
                      {userData?.wallet_address ? (
                        <ShimmerImage
                          w="32px"
                          h="32px"
                          src={userData?.profile_image}
                          mr="8px"
                          rounded="full"
                        />
                      ) : null}
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
                    pl="30px"
                    pr="48px"
                    py="8px"
                    background="rgba(226,225,239, 0.4)"
                    borderTopLeftRadius="4px"
                    borderTopRightRadius="4px"
                    onClick={onLogin}
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
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };

  const renderInviteModal = () => {
    return (
      <>
        <Box
          onClick={() => {
            if (!userData?.wallet_address) {
              return onLogin();
            }
            onOpenInviteModal();
          }}
        >
          <Text
            fontSize="14px"
            color="#fff"
            fontFamily="PingFangSC-Medium"
            fontWeight="bold"
            mb="2px"
          >
            {t('invite.common')}
          </Text>
          <Text fontSize="12px" color="rgba(255,255,255,0.64)">
            {t('invite.remainInviteTitle').replace(
              'xx',
              String(inviteMsg?.remain_invited ?? 0),
            )}
          </Text>
        </Box>
        <Modal
          size="full"
          onClose={onCloseInviteModal}
          isOpen={isInviteModelOpen}
          motionPreset="slideInRight"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader background="linear-gradient(180deg, #EDF4FF 0%, #FFFFFF 100%);">
              <ShimmerImage
                w="16px"
                h="16px"
                src="https://res.cloudinary.com/unemeta/image/upload/v1691323217/%E5%90%91%E4%B8%8B_2x_sgrq8n.png"
                onClick={onCloseInviteModal}
              />
              <VStack spacing="16px">
                <ShimmerImage
                  w="81px"
                  h="81px"
                  src="https://res.cloudinary.com/unemeta/image/upload/v1689601858/vkbsmiclvospqwe5wzzi.png"
                  mt="24px"
                />
                <Text
                  fontSize="28px"
                  fontFamily="PingFangSC-Medium"
                  fontWeight="600"
                  color="#000"
                  mb="35px"
                >
                  {t('invite.modalTitle_0')}
                  <Text display="inline-block" color="#0662FE">
                    {t('invite.modalTitle_1')}
                  </Text>
                </Text>
              </VStack>
            </ModalHeader>
            <ModalBody px="28px">
              <VStack
                spacing="16px"
                background="#fff"
                boxShadow="0px 2px 30px 0px rgba(33,0,255,0.08);"
                rounded="8px"
                pt="32px"
                pb="20px"
                px="20px"
                mb="34px"
              >
                <Text fontSize="14px" color="#000">
                  {t('invite.myCode')}
                </Text>
                <Text
                  fontSize="32px"
                  color="#000"
                  fontFamily="PingFangSC-Medium"
                  fontWeight="600"
                  lineHeight="32px"
                >
                  {inviteMsg?.scode
                    ? inviteMsg?.scode.split('').join(' ')
                    : null}
                </Text>
                <Button
                  w="100%"
                  leftIcon={<CopyIcon />}
                  colorScheme="teal"
                  variant="solid"
                  background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                  border={0}
                  rounded="4px"
                  mt="24px !important"
                  _hover={{
                    bg: 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);',
                    border: 0,
                  }}
                  onClick={async () => {
                    if (invitationUrl && inviteMsg)
                      await copy(`${invitationUrl}\n${inviteMsg?.scode}`);
                    toast({
                      position: 'top',
                      status: 'success',
                      title: 'success!',
                      duration: 2000,
                      containerStyle: {
                        marginTop: '30px',
                      },
                    });
                  }}
                >
                  {t('invite.copyCode')}
                </Button>
                <HStack w="100%" spacing="16px">
                  <VStack
                    justifyContent="center"
                    h="78px"
                    spacing="2px"
                    flex={1}
                    rounded="4px"
                    border="1px solid rgba(0,0,0,0.12);"
                  >
                    <Text
                      fontFamily="PingFangSC-Medium"
                      fontWeight="500"
                      color="#000"
                      fontSize="20px"
                    >
                      {inviteMsg?.invite_count}
                    </Text>
                    <Text
                      fontSize="14px"
                      color="rgba(0,0,0,0.45)"
                      fontWeight={400}
                    >
                      {t('invite.allNum')}
                    </Text>
                  </VStack>
                  <VStack
                    h="78px"
                    justifyContent="center"
                    spacing="2px"
                    flex={1}
                    rounded="4px"
                    border="1px solid rgba(0,0,0,0.12);"
                  >
                    <Text
                      fontFamily="PingFangSC-Medium"
                      fontWeight="500"
                      color="#000"
                      fontSize="20px"
                    >
                      {inviteMsg?.invite_count}
                    </Text>
                    <Text
                      fontSize="14px"
                      color="rgba(0,0,0,0.45)"
                      fontWeight={400}
                    >
                      {t('invite.allIntegral')}
                    </Text>
                  </VStack>
                </HStack>
                <Flex
                  w="100%"
                  h="52px"
                  background="url('https://res.cloudinary.com/unemeta/image/upload/v1691418236/%E7%9F%A9%E5%BD%A2_2_rqeakx.png') center center no-repeat"
                  backgroundSize="cover"
                >
                  <VStack
                    spacing={0}
                    justifyContent="center"
                    w="38%"
                    h="100%"
                    background={
                      inviteMsg?.invite_count >= 5
                        ? 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_4_wlzfrg.png) center center no-repeat'
                        : 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_mbejdp.png) center center no-repeat'
                    }
                    backgroundSize="cover"
                    rounded="4px 0 0 4px"
                    borderTop={
                      inviteMsg?.invite_count >= 5
                        ? '1px solid #CECBFF'
                        : '1px solid #E0E0E0'
                    }
                    borderBottom={
                      inviteMsg?.invite_count >= 5
                        ? '1px solid #CECBFF'
                        : '1px solid #E0E0E0'
                    }
                  >
                    <HStack spacing={0} alignItems="center">
                      <ShimmerImage
                        src="/images/points/uuu.png"
                        // src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                        w="12px"
                        h="12px"
                        mr="4px"
                      />
                      <Text
                        fontSize="14px"
                        color="#544AEC"
                        fontFamily="PingFangSC-Medium"
                      >
                        +20
                      </Text>
                    </HStack>
                    <Text fontSize="12px" color="#6157FF" fontWeight={400}>
                      {t('invite.hasInviteFiveNum')}
                    </Text>
                  </VStack>
                  <VStack
                    spacing={0}
                    justifyContent="center"
                    w="38%"
                    h="100%"
                    background={
                      inviteMsg?.invite_count >= 10
                        ? 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_5_nbpbl3.png) center center no-repeat'
                        : 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_2_zpmua3.png) center center no-repeat'
                    }
                    backgroundSize="cover"
                    ml="-17px"
                    borderTop={
                      inviteMsg?.invite_count >= 10
                        ? '1px solid #CECBFF'
                        : '1px solid #E0E0E0'
                    }
                    borderBottom={
                      inviteMsg?.invite_count >= 10
                        ? '1px solid #CECBFF'
                        : '1px solid #E0E0E0'
                    }
                  >
                    <HStack spacing={0} alignItems="center">
                      <ShimmerImage
                        src="/images/points/uuu.png"
                        // src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                        w="12px"
                        h="12px"
                        mr="4px"
                      />
                      <Text
                        fontSize="14px"
                        color="#544AEC"
                        fontFamily="PingFangSC-Medium"
                      >
                        +40
                      </Text>
                    </HStack>
                    <Text fontSize="12px" color="#6157FF" fontWeight={400}>
                      {t('invite.hasInviteTenNum')}
                    </Text>
                  </VStack>
                  <VStack
                    spacing={0}
                    justifyContent="center"
                    flex={1}
                    h="100%"
                    background={
                      inviteMsg?.invite_count >= 20
                        ? 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_6_gtoocm.png) center center no-repeat'
                        : 'url(https://res.cloudinary.com/unemeta/image/upload/v1691895891/%E7%9F%A9%E5%BD%A2_3_eukkva.png) center center no-repeat'
                    }
                    backgroundSize="cover"
                    ml="-17px"
                    rounded="0 4px 4px 0"
                    borderTop={
                      inviteMsg?.invite_count >= 20
                        ? '1px solid #CECBFF'
                        : '1px solid #E0E0E0'
                    }
                    borderBottom={
                      inviteMsg?.invite_count >= 20
                        ? '1px solid #CECBFF'
                        : '1px solid #E0E0E0'
                    }
                  >
                    <HStack spacing={0} alignItems="center">
                      <ShimmerImage
                        src="/images/points/uuu.png"
                        // src="https://res.cloudinary.com/unemeta/image/upload/v1690614177/%E7%BC%96%E7%BB%84_11_2x_1_dnv6xw.png"
                        w="12px"
                        h="12px"
                        mr="4px"
                      />
                      <Text
                        fontSize="14px"
                        color="#544AEC"
                        fontFamily="PingFangSC-Medium"
                      >
                        +100
                      </Text>
                    </HStack>
                    <Text fontSize="12px" color="#6157FF" fontWeight={400}>
                      {t('invite.hasInviteTwoNum')}
                    </Text>
                  </VStack>
                </Flex>
              </VStack>
              <HStack w="95%" margin="0 auto" justifyContent="space-betweeen">
                <HStack flex={1} spacing={0} justifyContent="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1691331280/%E7%BC%96%E7%BB%84_33_2x_vx701v.png"
                    w="56px"
                    h="56px"
                  />
                </HStack>
                <HStack flex={1} spacing={0} justifyContent="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1691417197/%E5%90%91%E4%B8%8B_2x_1_mhnuvw.png"
                    w="16px"
                    h="16px"
                  />
                </HStack>
                <HStack flex={1} spacing={0} justifyContent="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1691331280/%E7%BC%96%E7%BB%84_34_2x_z4y27j.png"
                    w="56px"
                    h="56px"
                  />
                </HStack>
                <HStack flex={1} spacing={0} justifyContent="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1691417197/%E5%90%91%E4%B8%8B_2x_1_mhnuvw.png"
                    w="16px"
                    h="16px"
                  />
                </HStack>
                <HStack flex={1} spacing={0} justifyContent="center">
                  <ShimmerImage
                    src="https://res.cloudinary.com/unemeta/image/upload/v1691331280/%E7%BC%96%E7%BB%84_35_2x_unbmem.png"
                    w="56px"
                    h="56px"
                  />
                </HStack>
              </HStack>
              <HStack
                w="100%"
                spacing={0}
                justifyContent="space-between"
                alignItems="flex-start"
                mt="16px"
              >
                <Text
                  maxW="72px"
                  fontSize="12px"
                  color="#000"
                  fontWeight={400}
                  textAlign="center"
                >
                  {t('invite.shareTip')}
                </Text>
                <Text
                  maxW="96px"
                  fontSize="12px"
                  color="#000"
                  fontWeight={400}
                  textAlign="center"
                  transform="translateX(8px)"
                >
                  {t('invite.relevantWallet')}
                </Text>
                <Text
                  maxW="84px"
                  fontSize="12px"
                  color="#000"
                  fontWeight={400}
                  textAlign="center"
                  transform="translateX(8px)"
                >
                  {t('invite.inputCode')}
                </Text>
              </HStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };

  return (
    <Box>
      <Box p="20px" background="#000">
        <Flex alignItems="center" justifyContent="space-between">
          <HStack spacing="8px">
            {/* <ShimmerImage
              w="40px"
              h="40px"
              rounded="full"
              src={userData?.profile_image}
            /> */}
            <Avatar
              url={userData?.profile_image}
              {...{ w: '40px', h: '40px', p: '9px' }}
              notconfig={{ p: '0' }}
              isshowtipmodalonclick
            />
            <VStack alignItems="flex-start" spacing="0">
              <Text
                fontSize="14px"
                color="#fff"
                fontFamily="PingFangSC-Medium"
                fontWeight="bold"
              >
                {userData?.username ? userData?.username : t('disconnect')}
              </Text>
              <HStack spacing="0">
                <ShimmerImage
                  w="16px"
                  h="16px"
                  src="/images/points/uuu.png"
                  mr="4px"
                />
                <Text
                  fontSize="14px"
                  color="#544AEC"
                  fontFamily="PingFangSC-Medium"
                  fontWeight="500"
                >
                  {userData?.wallet_address ? uuInfo?.integral || 0 : 0}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          {renderRankModel()}
        </Flex>
        <Flex flexWrap="wrap" justifyContent="space-between" mt="14px">
          <Flex
            alignItems="center"
            position="relative"
            pl="16px"
            pt="6px"
            w="42.7vw"
            height="56px"
            mb="16px"
            background="#262637"
            rounded="4px"
            border="1px solid #333349;"
            onClick={() => {
              if (!userData?.wallet_address) {
                return onLogin();
              }
              onSign();
            }}
          >
            <ShimmerImage
              w="18px"
              h="18px"
              src="/images/points/reward1.png"
              mr="12px"
            />
            <Box>
              <Text
                fontSize="14px"
                color="#fff"
                fontFamily="PingFangSC-Medium"
                fontWeight="bold"
                mb="2px"
              >
                {t('sign')}
              </Text>
              <Text fontSize="12px" color="rgba(255,255,255,0.64)">
                {isSign ? t('hasSign') : t('unSignTip')}
              </Text>
            </Box>
            <ShimmerImage
              w="16px"
              h="16px"
              src="/images/points/rigth111.png"
              position="absolute"
              right="10px"
              top="10px"
            />
          </Flex>
          <Flex
            alignItems="center"
            position="relative"
            pl="16px"
            pt="6px"
            w="42.7vw"
            height="56px"
            mb="16px"
            background="#262637"
            rounded="4px"
            border="1px solid #333349;"
          >
            <ShimmerImage
              w="18px"
              h="18px"
              src="/images/points/reward2.png"
              mr="12px"
            />
            <Box
              onClick={() => {
                if (!userData?.wallet_address) {
                  return onLogin();
                }
                router.push(`/user/${userData?.wallet_address}`);
              }}
            >
              <Text
                fontSize="14px"
                color="#fff"
                fontFamily="PingFangSC-Medium"
                fontWeight="bold"
                mb="2px"
              >
                {t('gduu')}
              </Text>
              <Text fontSize="12px" color="rgba(255,255,255,0.64)">
                {t('highAward')}
              </Text>
            </Box>
            <ShimmerImage
              w="16px"
              h="16px"
              src="/images/points/rigth111.png"
              position="absolute"
              right="10px"
              top="10px"
            />
          </Flex>
          <Flex
            alignItems="center"
            position="relative"
            pl="16px"
            pt="6px"
            w="42.7vw"
            height="56px"
            mb="16px"
            background="#262637"
            rounded="4px"
            border="1px solid #333349;"
          >
            <ShimmerImage
              w="18px"
              h="18px"
              src="/images/points/reward3.png"
              mr="12px"
            />
            <Box
              onClick={() => {
                if (!userData?.wallet_address) {
                  return onLogin();
                }
                router.push('/');
              }}
            >
              <Text
                fontSize="14px"
                color="#fff"
                fontFamily="PingFangSC-Medium"
                fontWeight="bold"
                mb="2px"
              >
                {t('buyNft')}
              </Text>
              <Text fontSize="12px" color="rgba(255,255,255,0.64)">
                {t('highAward')}
              </Text>
            </Box>
            <ShimmerImage
              w="16px"
              h="16px"
              src="/images/points/rigth111.png"
              position="absolute"
              right="10px"
              top="10px"
            />
          </Flex>
          <Flex
            alignItems="center"
            position="relative"
            pl="16px"
            pt="6px"
            w="42.7vw"
            height="56px"
            mb="16px"
            background="#262637"
            rounded="4px"
            border="1px solid #333349;"
          >
            <ShimmerImage
              w="18px"
              h="18px"
              src="/images/points/reward4.png"
              mr="12px"
            />
            {renderInviteModal()}
            <ShimmerImage
              w="16px"
              h="16px"
              src="/images/points/rigth111.png"
              position="absolute"
              right="10px"
              top="10px"
            />
          </Flex>
        </Flex>
      </Box>
      {renderBannerList()}
      <Box px="20px">
        <Box
          position="sticky"
          top="72px"
          left={0}
          zIndex={10}
          background="#fff"
        >
          <HStack
            spacing="16px"
            px="11px"
            pb="16px"
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
                py="11px"
                fontSize="16px"
                lineHeight="22px"
                fontFamily="PingFangSC-Medium"
                fontWeight={600}
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
                onClick={() => setActiveTab(v.key)}
              >
                {v.name}
              </Text>
            ))}
          </HStack>
        </Box>
        <Flex justifyContent="space-between" flexWrap="wrap" mb="20px">
          {(list[String(activeTab)] || []).map((v: any) => (
            <Box
              key={v.id || v.tokenId}
              w="42.7vw"
              border="1px solid rgba(0,0,0,0.12)"
              rounded="8px;"
              mb="18px"
              onClick={() => {
                if (!userData?.wallet_address) {
                  return onLogin();
                }
                if (
                  !(
                    activeTab !== 3 &&
                    ((v.unlimit > 0 && v.already_exchange >= v.unlimit) ||
                      v.toal <= 0 ||
                      v.project_status * 1 === 2)
                  )
                ) {
                  onExChange(v);
                }
              }}
            >
              <Box w="100%" h="42.7vw" position="relative">
                <ShimmerImage
                  w="100%"
                  h="100%"
                  src={v.img_url}
                  rounded="8px 8px 0px 0px"
                />
                <Flex
                  alignItems="center"
                  pl="16px"
                  position="absolute"
                  bottom="0"
                  left="0"
                  w="100%"
                  h="32px"
                  background="linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.64) 100%);"
                >
                  <Text fontSize="12px" color="#fff">
                    {v.total}/{v.total_real}
                    {t('remainTip')}
                  </Text>
                </Flex>
              </Box>
              <Box p="16px">
                <Text
                  fontSize="14px"
                  color="#000"
                  fontFamily="PingFangSC-Medium"
                  fontWeight="600"
                  noOfLines={2}
                  mb="2px"
                >
                  {v.title}
                </Text>
                <Flex alignItems="center" mb="10px">
                  <ShimmerImage
                    w="18px"
                    h="18px"
                    src="/images/points/uuu.png"
                    mr="4px"
                  />
                  <Text
                    fontSize="12px"
                    fontFamily="PingFangSC-Medium"
                    fontWeight="600"
                    color="#544AEC"
                  >
                    {v.integral}
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
                  py="4px"
                  textAlign="center"
                  fontSize="12px"
                  color="#fff"
                  fontFamily="PingFangSC-Medium"
                  fontWeight="600"
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
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

export default Mobile;
