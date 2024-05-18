import {
  Box,
  useDisclosure,
  Flex,
  Slide,
  Text,
  HStack,
  ChakraProps,
  SimpleGrid,
  Button,
  useToast,
} from '@chakra-ui/react';
import {
  memo,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { useUserDataValue, useFetchUuInfo, useUuInfo } from '@/store';
import Image from '@/components/Image';
import { RecordModalRef, RecordModal } from './RecordInfoModal';
import { ResultModal, ResultModalRef } from './ResultsModal';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useTranslations } from 'next-intl';
import { getResults } from '@/services/points';
import { HelpModal, HelpModalRef } from './HelpModal';
import { ShimmerImage } from '@/components/Image';

export type TurntableRef = {
  open: () => void;
};

/** 转盘元素 */
type GridItemProps = {
  children?: React.ReactNode;
  title?: string;
  contentProps?: ChakraProps;
};

const GridItem = memo((props: GridItemProps) => {
  return (
    <Flex
      w={'92.5px'}
      h={'78px'}
      flexDirection={'column'}
      rounded={'6px'}
      align={'center'}
      justify={'center'}
      boxShadow={'2px 2px 0px #EFD293;'}
      {...props.contentProps}
    >
      {props.children}
      {props?.title && (
        <Text color={'#F39321'} fontSize={'12px'} fontWeight={'600'} mt={'5px'}>
          {props.title}
        </Text>
      )}
    </Flex>
  );
});

export const Turntable = memo(
  forwardRef((props: { data?: any }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [cardIdx, setCardIdx] = useState(0);
    const recordModalRef = useRef<RecordModalRef>(null);
    const resultModalRef = useRef<ResultModalRef>(null);
    const helpModalRef = useRef<HelpModalRef>(null);
    const { openConnectModal } = useConnectModal();
    const userData = useUserDataValue();
    const { fetchUuInfo, uuInfo } = useFetchUuInfo();
    const t = useTranslations('points');
    const loading = useRef(false);
    const audioRef = useRef<any>(null);
    const [__, setUninfo] = useUuInfo();
    const interval = useRef<any>();
    const toast = useToast();

    useEffect(() => {
      // onOpen();
      // document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);

    useEffect(() => {
      if (userData?.wallet_address) {
        fetchUuInfo();
      }
    }, [userData?.wallet_address]);

    useImperativeHandle(ref, () => ({
      open: () => {
        onOpen();
        document.body.style.overflow = 'hidden';
      },
    }));

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
          console.log('出去');
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
              resultModalRef.current?.open(results + 99);
              clearInterval(interval.current);
              loading.current = false;
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
        }, 250);
        const { data } = await getResults({
          raffle_type: 1,
          whitelist_id: props.data && props.data.id,
        });
        finish = true;
        results = +data.results - 99;
      } catch (error) {
        clearInterval(interval.current);
        setCardIdx(0);
        fetchUuInfo();
        loading.current = false;
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    };

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
          fontFamily={'Inter'}
        >
          <Slide
            direction={'bottom'}
            in={isOpen}
            style={{
              zIndex: 100,
              width: '100%',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              top: 0,
            }}
          >
            <Flex
              w={'357px'}
              flexDirection="column"
              align={'center'}
              position="relative"
            >
              <Flex
                bg="linear-gradient(90deg, #9C2008 0%, #E94244 100%);"
                rounded={'8px'}
                justify={'center'}
                align="center"
                w={'225px'}
                h={'56px'}
                fontSize="24px"
                fontWeight={'700'}
              >
                <Text
                  color={'transparent'}
                  bgImage={'linear-gradient(180deg, #FFFFFF 0%, #F7E0AE 100%);'}
                  bgClip={'text'}
                >
                  {t('zbTitle')}
                </Text>
              </Flex>
              <Box
                bg={'linear-gradient(90deg, #9C2008 0%, #E94244 100%);'}
                p={'32px 19px 25px'}
                transform="translateY(-10px)"
                w={'full'}
                rounded={'10px'}
                position={'relative'}
              >
                <Box p={'12px'} bg={'#FFFFFF'} rounded="10px" mb={'12px'}>
                  <SimpleGrid
                    spacing={'8.5px'}
                    templateColumns={{
                      md: `1fr  1fr  1fr`,
                      base: '1fr  1fr  1fr',
                    }}
                  >
                    <GridItem
                      contentProps={{
                        pt: '0px',
                        bg: cardIdx === 1 ? '#FAC736' : '#FFEFCC',
                      }}
                      title={'50 USDT'}
                    >
                      <Image
                        src={'/images/points/c1.png'}
                        w={'38px'}
                        h={'38px'}
                      />
                    </GridItem>
                    <GridItem
                      contentProps={{
                        bg: cardIdx === 2 ? '#FAC736' : '#FFEFCC',
                      }}
                      title={'Whitelist'}
                    >
                      <Image
                        src={'/images/points/c2.png'}
                        w={'36px'}
                        h={'36px'}
                        mb={'3px'}
                      />
                    </GridItem>
                    <GridItem
                      contentProps={{
                        bg: cardIdx === 3 ? '#FAC736' : '#FFEFCC',
                      }}
                      title={'NFT'}
                    >
                      <Image
                        src={'/images/points/c3.png'}
                        w={'36px'}
                        h={'36px'}
                      />
                    </GridItem>

                    <GridItem
                      contentProps={{
                        bg: cardIdx === 8 ? '#FAC736' : '#FFEFCC',
                      }}
                      title={'30 uuu'}
                    >
                      <Image
                        src={'/images/points/c4.png'}
                        w={'37px'}
                        h={'37px'}
                        mb={'2px'}
                      />
                    </GridItem>
                    <Flex
                      bg={'#FFFFFF'}
                      cursor={'pointer'}
                      w={'92.5px'}
                      h={'78px'}
                      flexDirection={'column'}
                      rounded={'6px'}
                      align={'center'}
                      justify={'center'}
                    >
                      <Image src="/logo_l.png" w="30.5px" h="33.px" mb="12px" />
                      <Image w="64px" h="9px" src="/logo_text.svg" />
                    </Flex>
                    <GridItem
                      contentProps={{
                        bg: cardIdx === 4 ? '#FAC736' : '#FFEFCC',
                      }}
                      title={'50 uuu'}
                    >
                      <Image
                        src={'/images/points/c4.png'}
                        w={'37px'}
                        h={'37px'}
                        mb={'2px'}
                      />
                    </GridItem>

                    <GridItem
                      contentProps={{
                        pt: '5px',
                        bg: cardIdx === 7 ? '#FAC736' : '#FFEFCC',
                      }}
                      title={'NFT'}
                    >
                      <Image
                        src={'/images/points/c3.png'}
                        w={'36px'}
                        h={'36px'}
                      />
                    </GridItem>
                    <GridItem
                      contentProps={{
                        bg: cardIdx === 6 ? '#FAC736' : '#FFEFCC',
                      }}
                      title={'100 uuu'}
                    >
                      <Image
                        src={'/images/points/c4.png'}
                        w={'37px'}
                        h={'37px'}
                        mb={'3px'}
                      />
                    </GridItem>
                    <GridItem
                      contentProps={{
                        bg: cardIdx === 5 ? '#FAC736' : '#FFEFCC',
                        justifyContent: 'center',
                      }}
                      title={'Whitelist'}
                    >
                      <Image
                        src={'/images/points/c2.png'}
                        w={'36px'}
                        h={'36px'}
                        mb={'3px'}
                      />
                    </GridItem>
                  </SimpleGrid>
                </Box>
                {/* 底部 */}
                <Flex align="flex-end">
                  <Text
                    flex="1"
                    fontSize={'18px'}
                    color={'#FFFFFF'}
                    fontWeight="700"
                  >
                    uuu: {uuInfo.integral || 0}
                  </Text>
                  <Box flex="1" textAlign={'center'}>
                    <Button
                      rounded={'90px'}
                      w={'102px'}
                      h={'102px'}
                      p={'3px'}
                      bg={'#C55747'}
                      className="Re010"
                      position={'relative'}
                      transition={'all .3s'}
                      _hover={{ transform: 'scale(0.95, 0.95)' }}
                      disabled={loading.current}
                      onClick={() => {
                        if (userData?.wallet_address) {
                          StartTurntable();
                        } else {
                          openConnectModal?.();
                        }
                      }}
                    >
                      <Flex
                        align="center"
                        flexDirection="column"
                        position={'relative'}
                        h="full"
                        w="full"
                        bg="#F43A3E"
                        rounded={'90px'}
                        overflow="hidden"
                      >
                        <Image
                          src="/images/luckDraw/big_halo.png"
                          w="66px"
                          h="43px"
                          position={'relative'}
                          top="-1px"
                        />
                        <Image
                          src="/images/luckDraw/s_halo.png"
                          w="18px"
                          h="11px"
                          position={'absolute'}
                          left="50%"
                          transform="translateX(-50%)"
                          top="0"
                        />
                        <Box transform="translateY(-10px)">
                          <Text
                            lineHeight={'25px'}
                            textShadow={'0px 2px 8px rgba(0, 0, 0, 0.2);'}
                            fontWeight="900"
                            fontSize={'36px'}
                            color="#FFED7D"
                          >
                            GO
                          </Text>
                          <Text
                            color={'#FFCC3A'}
                            fontSize="12px"
                            lineHeight={'25px'}
                          >
                            {t('etime')}
                          </Text>
                        </Box>
                      </Flex>
                    </Button>
                  </Box>
                  <HStack spacing={'16px'} flex="1" justify={'flex-end'}>
                    {/* <HStack
                    w='24px'
                    h='24px'
                    rounded={'50%'}
                    bg='#FAC736'
                    boxShadow={'1px 2px 0px #D09A00;'}
                    justifyContent='center'
                    onClick={() => {console.log('分享')}}
                    cursor="pointer"
                  >
                    <Image 
                      src="/images/luckDraw/share.png"
                      w="22.5px"
                      h="22px"
                    />
                  </HStack> */}
                    <HStack
                      w="24px"
                      h="24px"
                      rounded={'50%'}
                      bg="#FAC736"
                      boxShadow={'1px 2px 0px #D09A00;'}
                      justifyContent="center"
                      onClick={() => {
                        if (userData?.wallet_address) {
                          recordModalRef?.current?.open();
                        } else {
                          openConnectModal?.();
                        }
                      }}
                      cursor="pointer"
                    >
                      <Image
                        src="/images/luckDraw/history.png"
                        w="16.5px"
                        h="16px"
                      />
                    </HStack>
                    <HStack
                      w="24px"
                      h="24px"
                      rounded={'50%'}
                      bg="#FAC736"
                      boxShadow={'1px 2px 0px #D09A00;'}
                      justifyContent="center"
                      onClick={() => {
                        helpModalRef.current?.open();
                      }}
                      cursor="pointer"
                    >
                      <Image
                        src="/images/luckDraw/help.png"
                        w="16.5px"
                        h="16px"
                      />
                    </HStack>
                  </HStack>
                </Flex>
                {/* 星星 */}
                <ShimmerImage
                  src="/images/luckDraw/star.png"
                  position="absolute"
                  top={'293px'}
                  left={'18px'}
                  objectFit="cover"
                  w="40px"
                  h="40px"
                  zIndex={-1}
                />
                <ShimmerImage
                  src="/images/luckDraw/star.png"
                  position="absolute"
                  top={'10px'}
                  right={'42px'}
                  objectFit="cover"
                  w="38px"
                  h="38px"
                  zIndex={-1}
                />
                {/* 树 */}
                <ShimmerImage
                  src="/images/luckDraw/tree.png"
                  position="absolute"
                  top={'-40px'}
                  left={'40px'}
                  objectFit="cover"
                  w="86px"
                  h="86px"
                  zIndex={-1}
                />
              </Box>
              {/* close */}
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
                top={'5px'}
                right={0}
              />
            </Flex>
          </Slide>
        </Flex>
        {/* 结果 */}
        <ResultModal openTurntable={onOpen} ref={resultModalRef} />
        {/* 积分记录 */}
        <RecordModal ref={recordModalRef} />
        {useMemo(
          () => (
            <audio
              style={{ opacity: 0 }}
              ref={audioRef}
              src={'/sounds/turntable.mp3'}
            ></audio>
          ),
          [],
        )}
        {/* 帮助说明 */}
        <HelpModal ref={helpModalRef} />
      </>
    );
  }),
);
