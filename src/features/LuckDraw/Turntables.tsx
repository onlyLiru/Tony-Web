import {
  Box,
  useDisclosure,
  Slide,
  Flex,
  HStack,
  Text,
  Heading,
  ChakraProps,
  SimpleGrid,
  useToast,
  Button,
} from '@chakra-ui/react';
import {
  memo,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from 'react';
import {
  useUserDataValue,
  useFetchUuInfo,
  useUuInfo,
  useInviteCode,
  useShowInviteModal,
} from '@/store';
import Image from '@/components/Image';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useState, useRef } from 'react';
import { getResults, invite, getUstd } from '@/services/points';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import useCopy from '@/hooks/useCopy';
import { Rule, Manual, Progress, zoom } from './LuckDrawUi1';
import { ResultModal, ResultModalRef } from './ResultsModal';
import { diffTime } from '@/utils/index';
import { useRouter } from 'next/router';
import { RecordModalRef, RecordModal } from './RecordInfoModal';

export type TurntableRef = {
  open: () => void;
};

const CylinderIcon = memo((props: { contentProps: ChakraProps }) => {
  return (
    <Flex
      pos={'absolute'}
      w={'30px'}
      justify={'center'}
      {...props.contentProps}
    >
      <Box
        h={'45.83px'}
        w={'13px'}
        bg={'#FFFFFF'}
        rounded={'74px'}
        zIndex={10}
        pos={'relative'}
      />
      <Image
        src={'/images/points/oval.svg'}
        w={'30px'}
        h={'8px'}
        pos={'absolute'}
        top={'-1px'}
      />
      <Image
        src={'/images/points/oval.svg'}
        w={'30px'}
        h={'8px'}
        pos={'absolute'}
        bottom={'-3.33px'}
      />
    </Flex>
  );
});

/** 转盘元素 */
type GridItemProps = {
  children?: React.ReactNode;
  title?: string;
  contentProps?: ChakraProps;
};

const GridItem = memo((props: GridItemProps) => {
  return (
    <Flex
      w={{ md: '88px', base: '80px' }}
      h={'60px'}
      flexDirection={'column'}
      rounded={'6px'}
      {...props.contentProps}
      align={'center'}
      justify={'space-between'}
      boxShadow={'2px 2px 0px #ABA4FE;'}
      border={'1px solid #ABA4FE;'}
    >
      {props.children}
      {props?.title && (
        <Text
          mt={'-10px'}
          color={'#F39321'}
          fontSize={'12px'}
          fontWeight={'600'}
          transform={'scale(0.9)'}
        >
          {props.title}
        </Text>
      )}
    </Flex>
  );
});

export const Turntable = forwardRef((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { fetchUuInfo, uuInfo } = useFetchUuInfo();
  const [copyText, copy] = useCopy();
  const [__, setUninfo] = useUuInfo();
  const [cardIdx, setCardIdx] = useState(0);
  const interval = useRef<any>();
  const timer = useRef<any>();
  const toast = useToast();
  const loading = useRef(false);
  const t = useTranslations('points');
  const userData = useUserDataValue();
  const [showRule, setShowRule] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const resultModalRef = useRef<ResultModalRef>(null);
  const audioRef = useRef<any>(null);
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  const recordModalRef = useRef<RecordModalRef>(null);
  const [traceId, setTraceId] = useState('');
  const [inviteCode, setInviteCode] = useInviteCode();
  const [inviteModal, showInviteModal] = useShowInviteModal();

  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
      document.body.style.overflow = 'hidden';
      if (userData?.wallet_address) {
        fetchUuInfo();
      }
    },
  }));

  useEffect(() => {
    if (!router.query.inviteCode && !inviteCode && !inviteModal) {
      onOpen();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [router.query.inviteCode, inviteCode, inviteModal]);

  useEffect(() => {
    if (userData?.wallet_address) {
      fetchUuInfo();
    }
  }, [userData?.wallet_address]);

  useEffect(() => {
    if (isOpen && userData?.wallet_address && !inviteCode) {
      fetchInviteCode();
    }
  }, [isOpen, userData?.wallet_address, inviteCode]);

  useEffect(() => {
    if (uuInfo?.count_down <= 0) {
      setCountdown(0);
    } else {
      setCountdown(uuInfo?.count_down);
      timer.current = setInterval(() => {
        setCountdown((countdown) => {
          if (countdown <= 0) {
            clearTimeout(timer.current);
            return 0;
          } else {
            return countdown - 1;
          }
        });
      }, 1000);
    }
    return () => {
      clearTimeout(timer.current);
    };
  }, [uuInfo?.count_down]);

  // 开始抽奖
  const StartTurntable = async () => {
    try {
      if (uuInfo.integral < 100) {
        return toast({
          status: 'error',
          title: t('noIntegration'),
          variant: 'subtle',
        });
      }
      if (loading.current) {
        return false;
      }
      audioRef.current.play();
      loading.current = true;
      let round = 0; // 跑的次数
      let finish = false;
      let results = 10;
      setUninfo({ ...uuInfo, integral: uuInfo.integral - 100 });
      interval.current = setInterval(() => {
        setCardIdx((cardIdx) => {
          if (finish && cardIdx === results && round > 3) {
            resultModalRef.current?.open(results);
            clearInterval(interval.current);
            fetchUuInfo();
            return cardIdx;
          }
          if (cardIdx === 8) {
            round++;
            return 1;
          } else {
            return cardIdx + 1;
          }
        });
        audioRef.current.pause();
        audioRef.current.play();
      }, 100);
      const { data } = await getResults({
        raffle_type: 1,
      });
      finish = true;
      results = data.results;
      loading.current = false;
    } catch (error) {
      clearInterval(interval.current);
      setCardIdx(0);
      fetchUuInfo();
      loading.current = false;
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  const fetchInviteCode = useCallback(async () => {
    const { data } = await invite();
    setTraceId(data.trace_id);
  }, []);

  // 邀请
  const InviteNow = useCallback(async () => {
    try {
      if (!userData?.wallet_address) {
        openConnectModal?.();
        return;
      }
      await copy(
        `${location.origin}/${router.locale}${router.pathname}?inviteCode=${traceId}`,
      );
      toast({
        status: 'success',
        title: 'Link copied!',
        variant: 'subtle',
      });
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  }, [userData?.wallet_address, router, traceId]);

  // 提现
  const cashout = useCallback(async () => {
    try {
      const { data } = await getUstd();
      fetchUuInfo();
      toast({ status: 'success', title: t('cashSuccess'), variant: 'subtle' });
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  }, [uuInfo?.schedule, countdown]);

  console.log('uuInfo', uuInfo);

  return (
    <>
      <Flex
        visibility={isOpen ? 'visible' : 'hidden'}
        pos={'fixed'}
        left={0}
        top={0}
        right={0}
        h={'100vh'}
        zIndex={100}
        bg={'blackAlpha.700'}
        align={'center'}
      >
        <Slide
          direction={'bottom'}
          in={isOpen}
          style={{ zIndex: 100, width: '100%' }}
        >
          <Flex
            h={'full'}
            minH={'100vh'}
            w={'full'}
            bg={'transparent'}
            onTouchStart={(e) => {
              e.preventDefault();
            }}
            mx={{ base: 'auto', md: '0' }}
            justify={{ md: 'center', base: 'flex-end' }}
            align={'center'}
            fontFamily={'Inter'}
            flexDirection={'column'}
            onClick={() => {
              setShowManual(false);
              setShowRule(false);
            }}
            pb={{ md: 0, base: '20px' }}
          >
            <Box
              pt={{ md: '51px', base: '30px' }}
              bg="transparent"
              className="zoom87 md:zoom"
            >
              <Box
                w={'380px'}
                bg={'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%);'}
                rounded={'20px'}
                p={'28px 20px 17px'}
                position={'relative'}
              >
                <Box
                  w={'full'}
                  bg={'rgb(166,221,254, 0.8)'}
                  rounded={'10px'}
                  p={'10px'}
                  pos={'relative'}
                  mb={'5px'}
                >
                  <Box
                    p={'13px 10px 21px'}
                    bg={'rgb(165,122,255, 0.8)'}
                    rounded={'10px'}
                    position={'relative'}
                  >
                    <Flex
                      opacity={1}
                      bg={'#FFF9B8'}
                      rounded={'10px'}
                      p={'13px 10px 10px'}
                      align={'center'}
                      flexDirection={'column'}
                    >
                      <HStack
                        fontWeight={'600'}
                        mb={'22px'}
                        fontSize={'12px'}
                        color={'#000000'}
                        lineHeight={'15px'}
                      >
                        <Text
                          dangerouslySetInnerHTML={{ __html: t.raw('uTitle') }}
                        />
                        {/* <Text color={'rgba(255, 145, 2, 1)'}>100u,still:</Text> */}
                      </HStack>
                      <HStack
                        mb={'22px'}
                        fontWeight={'900'}
                        fontSize={'40px'}
                        color={'#FF7A00'}
                        align={'flex-end'}
                      >
                        <Text
                          animation={`${zoom} 1s linear infinite`}
                          lineHeight={'25px'}
                        >
                          {!uuInfo?.schedule
                            ? 99.0
                            : `${uuInfo?.schedule / 100}${
                                uuInfo?.schedule == 9900 ? '.0' : ''
                              }`}
                        </Text>
                        <Text pos={'relative'} top={'5px'} fontSize={'20px'}>
                          U
                        </Text>
                        <Image
                          cursor={'pointer'}
                          src={'/images/points/q1.png'}
                          w={'15px'}
                          h={'15px'}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowRule(!showRule);
                            setShowManual(false);
                          }}
                        />
                      </HStack>
                      <Progress schedule={uuInfo?.schedule} />
                      <Button
                        className="Re009"
                        w={'280px'}
                        h={'30px'}
                        bg={'#FAC736'}
                        mt={'6px'}
                        rounded={'100px'}
                        color={
                          uuInfo?.schedule >= 10000 && countdown > 0
                            ? '#000000'
                            : '#FFFFFF'
                        }
                        fontSize={'14px'}
                        fontWeight={'600'}
                        fontFamily={'Inter'}
                        onClick={cashout}
                        _hover={{
                          bg:
                            uuInfo?.schedule >= 10000 &&
                            countdown > 0 &&
                            !uuInfo?.isOrderUstd
                              ? '#FAC736'
                              : '#C4C4C4',
                          opacity: 0.8,
                        }}
                        _disabled={{ bg: '#C4C4C4', cursor: 'not-allowed' }}
                        disabled={
                          uuInfo?.schedule >= 10000 &&
                          countdown > 0 &&
                          !uuInfo?.isOrderUstd
                            ? false
                            : true
                        }
                      >
                        {t('Cashout')}
                      </Button>
                    </Flex>
                    <HStack
                      justifyContent={'center'}
                      alignItems={'center'}
                      bg={'#A98FFF'}
                      rounded={'8px'}
                      position={'absolute'}
                      w={'140px'}
                      h={'30px'}
                      left={'50%'}
                      transform={'translateX(-50%)'}
                      top={'-23px'}
                    >
                      <Image
                        src={'/images/points/t.png'}
                        w={'15px'}
                        h={'15px'}
                      />
                      <Text
                        fontSize={'12px'}
                        fontWeight={'700'}
                        color={'#FFFFFF'}
                      >
                        {countdown > 0 ? diffTime(countdown) : '00:00:00'}{' '}
                        {t('expire')}
                      </Text>
                    </HStack>
                    <CylinderIcon
                      contentProps={{
                        left: '48px',
                        bottom: '-35px',
                      }}
                    />
                    <CylinderIcon
                      contentProps={{
                        right: '48px',
                        bottom: '-35px',
                      }}
                    />
                  </Box>
                </Box>
                {/* 转盘 */}
                <Box
                  w={'full'}
                  bg={'rgb(166,221,254, 0.8)'}
                  rounded={'10px'}
                  p={'10px'}
                >
                  <Box
                    p={'15px 10px'}
                    bg={'rgb(165,122,255, 0.8)'}
                    rounded={'10px'}
                  >
                    <Box p={'8px 12px 10px'} bg={'#FFFFFF'} rounded={'10px'}>
                      <Heading
                        textAlign={'center'}
                        color={'#000000'}
                        fontSize={'12px'}
                        fontWeight={'600'}
                        mb={'12px'}
                      >
                        {t('zTitle')}
                      </Heading>
                      <SimpleGrid
                        spacing={'6px'}
                        templateColumns={{
                          md: `1fr  1fr  1fr`,
                          base: '1fr  1fr  1fr',
                        }}
                      >
                        <GridItem
                          contentProps={{
                            pt: '0px',
                            bg: cardIdx === 1 ? '#FFF59A' : '#FFFFFF',
                          }}
                          title={'0.1U'}
                        >
                          <Image
                            src={'/images/points/c1.png'}
                            w={'44px'}
                            h={'44px'}
                          />
                        </GridItem>
                        <GridItem
                          contentProps={{
                            bg: cardIdx === 2 ? '#FFF59A' : '#FFFFFF',
                          }}
                          title={'white list'}
                        >
                          <Image
                            src={'/images/points/c2.png'}
                            w={'65px'}
                            h={'30px'}
                            mt={'9px'}
                          />
                        </GridItem>
                        <GridItem
                          contentProps={{
                            bg: cardIdx === 3 ? '#FFF59A' : '#FFFFFF',
                          }}
                          title={'Pen'}
                        >
                          <Image
                            src={'/images/points/c3.png'}
                            w={'44px'}
                            h={'44px'}
                            mt={'-5px'}
                          />
                        </GridItem>

                        <GridItem
                          contentProps={{
                            bg: cardIdx === 8 ? '#FFF59A' : '#FFFFFF',
                          }}
                          title={'30 uuu'}
                        >
                          <Image
                            src={'/images/points/c4.png'}
                            w={'44px'}
                            h={'44px'}
                          />
                        </GridItem>
                        <ConnectButton.Custom>
                          {({ openConnectModal, account }) => (
                            <Flex
                              className="Re010"
                              onClick={() => {
                                if (account && account.address) {
                                  StartTurntable();
                                } else {
                                  openConnectModal();
                                }
                              }}
                              bg={'#FFC112'}
                              cursor={'pointer'}
                              w={{ md: '88px', base: '80px' }}
                              h={'60px'}
                              flexDirection={'column'}
                              rounded={'6px'}
                              align={'center'}
                              justify={'center'}
                              boxShadow={'2px 2px 0px #ABA4FE;'}
                              transition={'all .3s'}
                              _hover={{ transform: 'scale(0.95, 0.95)' }}
                              pt={'11px'}
                            >
                              <Text
                                fontWeight={'600'}
                                fontSize={'12px'}
                                color={'#000000'}
                              >
                                100 UUU
                              </Text>
                              <Text
                                fontWeight={'900'}
                                fontSize={'20px'}
                                color={'#000000'}
                              >
                                GO
                              </Text>
                            </Flex>
                          )}
                        </ConnectButton.Custom>
                        <GridItem
                          contentProps={{
                            bg: cardIdx === 4 ? '#FFF59A' : '#FFFFFF',
                          }}
                          title={'200 uuu'}
                        >
                          <Image
                            src={'/images/points/c4.png'}
                            w={'44px'}
                            h={'44px'}
                          />
                        </GridItem>

                        <GridItem
                          contentProps={{
                            pt: '5px',
                            bg: cardIdx === 7 ? '#FFF59A' : '#FFFFFF',
                          }}
                          title={'White list'}
                        >
                          <Image
                            src={'/images/points/c7.png'}
                            w={'44px'}
                            h={'44px'}
                            mt={'-5px'}
                          />
                        </GridItem>
                        <GridItem
                          contentProps={{
                            bg: cardIdx === 6 ? '#FFF59A' : '#FFFFFF',
                          }}
                          title={'Bag'}
                        >
                          <Image
                            src={'/images/points/c6.png'}
                            w={'44px'}
                            h={'44px'}
                          />
                        </GridItem>
                        <GridItem
                          contentProps={{
                            bg: cardIdx === 5 ? '#FFF59A' : '#FFFFFF',
                            justifyContent: 'center',
                          }}
                        >
                          <Image
                            src={'/images/points/c5.png'}
                            w={'44px'}
                            h={'44px'}
                          />
                        </GridItem>
                      </SimpleGrid>
                      <HStack
                        className="Re011"
                        align={'center'}
                        justifyContent={'space-between'}
                        mt={'8px'}
                        spacing={'5px'}
                        lineHeight={'15px'}
                        fontSize={'12px'}
                        fontWeight={'500'}
                        color={'#000000'}
                      >
                        <Text
                          onClick={() => {
                            if (userData?.wallet_address) {
                              recordModalRef?.current?.open();
                            } else {
                              openConnectModal?.();
                            }
                          }}
                          cursor={'pointer'}
                          textDecorationLine={'underline'}
                          color={'#4285F4'}
                          fontSize={'12px'}
                          fontWeight={'500'}
                          lineHeight={'15px'}
                        >
                          {t('history')}
                        </Text>
                        <HStack>
                          <Text>uuu: {uuInfo.integral}</Text>
                          <Image
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowRule(false);
                              setShowManual(!showManual);
                            }}
                            src={'/images/points/q1.png'}
                            w={'15px'}
                            h={'15px'}
                            cursor={'pointer'}
                          />
                        </HStack>
                      </HStack>
                    </Box>
                  </Box>
                </Box>
                {/* 规则 */}
                <Rule visible={showRule} />
                <Manual visible={showManual} />
                <Box
                  display={{
                    md: 'none',
                    base: showRule || showManual ? 'block' : 'none',
                  }}
                  pos={'fixed'}
                  right={0}
                  bottom={0}
                  top={0}
                  left={0}
                  bg={'blackAlpha.700'}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowManual(false);
                    setShowRule(false);
                  }}
                  zIndex={11}
                />
                {/* <Image
                  src={'/images/points/mat.png'}
                  position={'absolute'}
                  w={'158px'}
                  h={'160px'}
                  top={'-60px'}
                  left={'-65px'}
                /> */}
                <Image
                  src={'/images/points/close.svg'}
                  w={'30px'}
                  h={'30px'}
                  position={'absolute'}
                  cursor={'pointer'}
                  onClick={() => {
                    document.body.style.overflow = 'auto';
                    onClose();
                  }}
                  top={{ md: '-51px', base: '-30px' }}
                  right={0}
                />
              </Box>
              <Flex mt={'20px'} justify={'space-between'} w={'380px'}>
                <NextLink
                  href={`/user/${userData?.wallet_address}?bulkList=true`}
                >
                  <Button
                    className="Re012"
                    bg={'#FAC736'}
                    rounded={'100px'}
                    boxShadow={'2px 4px 0px #AB7F00;'}
                    w={'174px'}
                    h={'40px'}
                    _hover={{ bg: '#FAC736', opacity: 0.8 }}
                    color={'#000000'}
                    fontWeight={'600'}
                    fontSize={'14px'}
                  >
                    {t('listNow')}
                  </Button>
                </NextLink>
                <Button
                  className="Re013"
                  bg={'#FAC736'}
                  rounded={'100px'}
                  boxShadow={'2px 4px 0px #AB7F00;'}
                  w={'174px'}
                  h={'40px'}
                  onClick={InviteNow}
                  _hover={{ bg: '#FAC736', opacity: 0.8 }}
                  color={'#000000'}
                  fontWeight={'600'}
                  fontSize={'14px'}
                >
                  {t('inviteNow')}
                </Button>
              </Flex>
            </Box>
          </Flex>
        </Slide>
        {/* 结果 */}
        <ResultModal openTurntable={onOpen} ref={resultModalRef} />
        {/* 积分记录 */}
        <RecordModal ref={recordModalRef} />
      </Flex>
      <audio
        style={{ opacity: 0 }}
        ref={audioRef}
        src={'/sounds/turntable.mp3'}
      ></audio>
    </>
  );
});
