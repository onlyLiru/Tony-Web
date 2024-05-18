// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  Button,
  Link,
  Icon,
  Stack,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useToast,
  useMediaQuery,
  Progress,
  Center,
  Image,
} from '@chakra-ui/react';
import { ShimmerImage } from '@/components/Image';
import { useEffect, useState } from 'react';
import { useCounter, useTimeout } from 'ahooks';
import { FaDiscord, FaTwitter, FaTelegramPlane } from 'react-icons/fa';
import { TbWorld } from 'react-icons/tb';
import CountDown from './CountDown';
import { useTranslations } from 'next-intl';
import { useUserDataValue } from '@/store';
import { useMint } from './useMint';
import { format } from 'date-fns';
import { useConnectModal, useChainModal } from '@rainbow-me/rainbowkit';
import retry from 'retry-as-promised';

let hasRefresh = false;
const maxRetryT = 2;
export const Banner = () => {
  const t = useTranslations('anime');
  const { openConnectModal } = useConnectModal();

  const {
    canMinted,
    hasWhiteList,
    maxSupply,
    getSign,
    getPrice,
    contract,
    mintByUsdt,
    initBalc,
    balc,
    // wrongNet,
  } = useMint();

  const toast = useToast();
  const [mintLoading, setMintLoading] = useState(false);
  const [price, setPrice] = useState(3.8);
  const [text, setText] = useState('Total Supply');
  const onFinish = () => {
    if (!hasRefresh) {
      hasRefresh = true;
    }
  };
  const userData = useUserDataValue();

  const [current, { inc, dec, reset }] = useCounter(1, { min: 0 });
  const [isAdding, updateAddStatus] = useState(false);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isOpenModal, updateModalStatus] = useState(false);
  const [canFree, setCanFree] = useState(false);
  const [supply, setSupply] = useState(500);
  const [isWhitelist, setWhitelist] = useState(false);

  const getCanFree = async () => {
    const canMintedRes = await canMinted();
    setCanFree(canMintedRes);
  };
  const getSupply = async () => {
    const num = await maxSupply();
    setSupply(num);
  };
  const getNftPrice = async () => {
    const price = await getPrice();
    setPrice(price);
  };
  const getHasWhitelist = async () => {
    const bool = await hasWhiteList();
    setWhitelist(bool);
    console.log(bool, 'getHasWhitelist');
  };
  useEffect(() => {
    if (userData?.wallet_address) {
      reset(1);
      getHasWhitelist();
      retry(() => initBalc(), {
        max: maxRetryT,
        timeout: 5000,
      });
      setText('Remaining Quantity');
    } else {
      openConnectModal?.();
    }
  }, [userData?.wallet_address]);

  useEffect(() => {
    if (contract) {
      getSupply();
      getNftPrice();
      getCanFree();
    }
  }, [contract]);

  const onCloseModal = () => {
    updateModalStatus(false);
  };

  const onMint = async () => {
    if (current <= 0) {
      toast({
        containerStyle: {
          border: '20px solid transparent',
        },
        title: 'Please select the quantity',
        status: 'warning',
        position: 'top',
        isClosable: false,
        duration: 2000,
      });
      return;
    }
    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }
    console.log(balc, 'balc');
    if (!balc) {
      await initBalc();
    }
    try {
      setMintLoading(true);
      if (isWhitelist && canFree) {
        const signRes = await getSign();
        if (signRes) {
          const res = await mintByUsdt('AllowMint', signRes);
          if (res) {
            updateModalStatus(true);
            getSupply();
            getCanFree();
          }
          setMintLoading(false);
        }
      } else {
        // 公售
        const res = await mintByUsdt('PublicMint', 'none', current);
        if (res) {
          updateModalStatus(true);
          getSupply();
        }
        setMintLoading(false);
      }
    } catch (error) {
      setMintLoading(false);
      console.log(error);
    }
  };
  return (
    <>
      {/* 头部 */}
      <Box
        pt={{ md: '43px', base: '20px' }}
        px={{ md: '100px', base: '16px' }}
        pb={'85px'}
        bg={'#FEF200'}
      >
        <Image
          src={'/images/activity/anime/logo.png'}
          w={{ base: '237px', md: '' }}
        ></Image>
        <Box
          w={'full'}
          h={'2px'}
          my={'20px'}
          bg={'#000000'}
          display={{ md: 'none', base: 'block' }}
        ></Box>
        <Flex justify={'space-between'}>
          <Box
            color={'#000000'}
            fontSize={{ md: '60px', base: '24px' }}
            fontFamily={'HelveticaNeue-CondensedBlack, HelveticaNeue'}
            pos={'relative'}
          >
            <Text>From Sketch to Screen</Text>
            <Text>Japanese Anime Art</Text>
            <Text>And Manuscript Grand Exhibition</Text>
            <Text>NFT TICKET</Text>
          </Box>
          <Box display={{ md: 'block', base: 'none' }}>
            <Image
              src={'/images/activity/anime/cartoon3.png'}
              w={'352px'}
              h={'204px'}
              pos="relative"
              left={'-150px'}
            ></Image>
            <Image
              src={'/images/activity/anime/cartoon2.png'}
              w={'443px'}
              h={'254px'}
            ></Image>
          </Box>
        </Flex>

        <Text
          fontSize={{ md: '24px', base: '14px' }}
          mt={{ md: '44px', base: '5px' }}
        >
          Mint Period: 2023.8.21-2023.9.25
        </Text>
        <Text
          fontSize={{ md: '24px', base: '14px' }}
          mt={{ md: '44px', base: '5px' }}
        >
          Exhibition Time: 2023.9.11-2023.9.25 (XM Studio, Singapore)
        </Text>
        <Box
          w={'full'}
          h={'2px'}
          my={{ md: '50px', base: '19px' }}
          bg={'#000000'}
        ></Box>
        <HStack justify={'space-between'} flexFlow={'wrap'}>
          <Image
            src={'/images/activity/anime/cartoon1.png'}
            w={{ md: '45%', base: 'full' }}
            mt={{ base: '10px !important', md: '0px' }}
          ></Image>
          <Box
            w={{ md: '45%', base: 'full' }}
            style={{ 'margin-left': 0, 'margin-top': '10px' }}
          >
            <HStack
              w={'full'}
              h={{ md: '175px', base: '73px' }}
              border={'1px solid #000000'}
              borderRadius={'8px'}
              justify="space-around"
            >
              <Box textAlign={'center'}>
                <Text
                  fontSize={{ md: '40px', base: '16px' }}
                  fontWeight={'bold'}
                  fontFamily={'DIN-Bold, DIN'}
                >
                  {supply}
                </Text>
                <Text
                  fontSize={{ md: '16px', base: '10px' }}
                  fontWeight={800}
                  fontFamily={'PingFangSC-Heavy, PingFang SC;'}
                >
                  {text}
                </Text>
              </Box>
              <Box textAlign={'center'}>
                <Text
                  fontSize={{ md: '40px', base: '16px' }}
                  fontWeight={'bold'}
                  fontFamily={'DIN-Bold, DIN'}
                >
                  {isWhitelist && canFree
                    ? 'Free Mint'
                    : (price * current).toFixed(1) + 'USDT'}
                </Text>
                <Text
                  fontSize={{ md: '16px', base: '10px' }}
                  fontWeight={800}
                  fontFamily={'PingFangSC-Heavy, PingFang SC;'}
                >
                  Price
                </Text>
              </Box>
            </HStack>
            <Flex mt={'32px'} justify="space-between">
              <HStack
                w={{ md: '400px', base: '160px' }}
                h={{ md: '80px', base: '34px' }}
                bgColor="rgba(255,255,255, 0.8)"
                color="#1E1F25"
                fontSize={{ md: '40px', base: ' 16px' }}
                justify="space-between"
                rounded={{ md: '10px', base: '5px' }}
                mr={'10px'}
              >
                <Text
                  px={{ md: '30px', base: '13px' }}
                  cursor="pointer"
                  userSelect="none"
                  onClick={() => dec()}
                >
                  -
                </Text>
                <Text
                  flex={1}
                  textAlign="center"
                  fontWeight={'bold'}
                  fontFamily={'DIN-Bold, DIN'}
                >
                  {current}
                </Text>
                <Box
                  px={{ md: '30px', base: '13px' }}
                  cursor="pointer"
                  userSelect="none"
                  onClick={() => {
                    if (isWhitelist && canFree) {
                      if (current < 1) {
                        inc();
                      }
                    } else {
                      inc();
                    }
                  }}
                >
                  {isAdding ? (
                    <Spinner
                      size={{ md: 'md', base: 'xs' }}
                      ml={{ md: '12px', base: '6px' }}
                    />
                  ) : (
                    <span>+</span>
                  )}
                </Box>
              </HStack>
              <Button
                w={{ md: '400px', base: '160px' }}
                h={{ md: '80px', base: '34px' }}
                bgColor="#000"
                color="#1E1F25"
                justify="space-between"
                rounded={{ md: '10px', base: '5px' }}
                justifyContent={'center'}
                onClick={() => {
                  onMint();
                }}
                isActive={false}
                isLoading={mintLoading}
              >
                {isLargerThan768 ? (
                  <>
                    {/* <Text fontSize={'16px'} color={'rgba(255,255,255,0.45);'}>
                      Start Minting Time
                    </Text>
                    <Text fontSize={'20px'} color={'#fff'}>
                      2023-08-19 18:00
                    </Text> */}
                    <Text fontSize={'20px'} color="#fff">
                      Mint
                    </Text>
                  </>
                ) : (
                  <Text fontSize={'12px'} color="#fff">
                    Mint
                  </Text>
                )}
              </Button>
            </Flex>
            <Text
              fontSize={{ md: '24px', base: '14px' }}
              color="red"
              mt={{ md: '20px', base: '10px' }}
            >
              Note: This NFT can only be used to redeem admission for the
              Singapore onsite exhibition.
            </Text>
          </Box>
        </HStack>
      </Box>
      <Box
        bg={'url(/images/activity/anime/gradientBg.png)'}
        w="full"
        bgSize="cover"
        color={'#fff'}
        px={{ md: '100px', base: '16px' }}
        pb={{ md: '120px', base: '30px' }}
      >
        <Text
          fontSize={{ md: '40px', base: '20px' }}
          fontWeight={800}
          fontFamily={'SourceHanSansCN-Heavy, SourceHanSansCN;'}
          pt={{ md: '120px', base: '40px' }}
        >
          From Sketch to Screen: Japanese Anime Art, and Manuscript Grand
          Exhibition
        </Text>
        <Text
          fontFamily={'MicrosoftYaHei-Bold, MicrosoftYaHei;'}
          fontSize={{ md: '20px', base: '14px' }}
          fontWeight={'bold'}
          mt={'30px'}
          mb={'50px'}
          display={{ md: 'block', base: 'none' }}
        >
          Exhibition Producer: UneMeta,Virtual Idol Ltd ; Web3 Special Buddy :
          OKX ; Title Sponsor : Pure Art Studio
        </Text>
        <Box display={{ md: 'none', base: 'block' }}>
          <Box my={'16px'}>
            <Text fontSize={'14px'} color={'rgba(255,255,255,0.6)'}>
              Exhibition Producer:
            </Text>
            <Text fontSize={'14px'} color={'#fff'} fontWeight={'bold'}>
              UneMeta,Virtual Idol Ltd.
            </Text>
          </Box>
          <Box mb={'16px'}>
            <Text fontSize={'14px'} color={'rgba(255,255,255,0.6)'}>
              Web3 Special Buddy:
            </Text>
            <Text fontSize={'14px'} color={'#fff'} fontWeight={'bold'}>
              OKX
            </Text>
          </Box>
          <Box mb={'16px'}>
            <Text fontSize={'14px'} color={'rgba(255,255,255,0.6)'}>
              Title Sponsor:
            </Text>
            <Text fontSize={'14px'} color={'#fff'} fontWeight={'bold'}>
              Pure Art Studio
            </Text>
          </Box>
        </Box>
        <Box fontSize={{ md: '16px', base: '12px' }}>
          <Text fontFamily={'HelveticaNeue;'} mb={'20px'}>
            This is the first-ever exhibition in Singapore showcasing the
            original manuscripts of manga masters such as Hayao Miyazaki and
            Akira Toriyama. Among the extensive display of nearly 600 pieces of
            artwork, a significant portion, 50%, belongs to the renowned
            Japanese filmmaker and manga artist, Hayao Miyazaki.
          </Text>
          <Text fontFamily={'HelveticaNeue;'} mb={'20px'}>
            Hayao Miyazaki is widely regarded as one of the most influential
            figures in the world of animation and manga. He co-founded Studio
            Ghibli, a renowned animation studio known for producing critically
            acclaimed films such as "Spirited Away," "My Neighbor Totoro," and
            "Princess Mononoke." Miyazaki's work often explores themes of
            environmentalism, fantasy, and the human condition, captivating
            audiences of all ages with his imaginative storytelling and visually
            stunning illustrations.
          </Text>
          <Text fontFamily={'HelveticaNeue;'} mb={'60px'}>
            This exhibition offers a unique opportunity to delve into the
            artistic brilliance of Hayao Miyazaki and other manga masters,
            providing visitors with a captivating journey through the realms of
            Japanese manga and animation
          </Text>
        </Box>

        <Box w={'full'} h={'1px'} bg="#fff" mb={'60px'}></Box>
        <Box fontSize={{ md: '16px', base: '12px' }}>
          <Text fontWeight={'bold'} mb={'20px'}>
            Other feature artist:
          </Text>
          <Text>
            1. Naoko Takeuchi: The creator of "Sailor Moon," a beloved magical
            girl manga series that gained worldwide popularity for its
            empowering themes and captivating characters.
          </Text>
          <Text>
            2. Osamu Tezuka: Often referred to as the "God of Manga," Osamu
            Tezuka is a pioneering manga artist who created iconic works such as
            "Astro Boy" and "Black Jack."
          </Text>
          <Text>
            3. Rumiko Takahashi: Known for her contributions to the manga world
            with series like "Urusei Yatsura," "Maison Ikkoku," and "Inuyasha,"
            capturing the hearts of diverse audiences.
          </Text>
          <Text>
            4. CLAMP: A group of four female manga artists known for their
            collaborative works, including "Cardcaptor Sakura" and "Tsubasa:
            Reservoir Chronicle."
          </Text>
          <Text>
            5. Eiichiro Oda: The mastermind behind the long-running and
            immensely popular series "One Piece," a tale of adventure and
            camaraderie on the high seas.
          </Text>
          <Text>
            6. Masashi Kishimoto: Renowned for creating "Naruto," a widely
            acclaimed manga series featuring ninja-themed adventures and
            coming-of-age themes.
          </Text>
        </Box>
      </Box>
      <Box
        bg={'#FEF200'}
        p={{ md: '120px', base: '16px' }}
        pb={{ md: '', base: '45px' }}
      >
        <Text
          fontSize={{ md: '40px', base: '20px' }}
          fontFamily={'SourceHanSansCN-Heavy, SourceHanSansCN'}
          fontWeight={'bold'}
          textAlign={'center'}
          mb={{ md: '90px', base: '33px' }}
        >
          Sponsors and Partners
        </Text>
        <Flex justify={'center'}>
          {isLargerThan768 ? (
            <Image src={'/images/activity/anime/others.png'}></Image>
          ) : (
            <Image src={'/images/activity/anime/othersM.png'}></Image>
          )}
        </Flex>
      </Box>
      <Box
        bg={'#050505;'}
        px={{ md: '100px', base: '16px' }}
        pt={{ md: '120px', base: '30px' }}
        pb={{ md: '40px', base: '0' }}
      >
        {isLargerThan768 ? (
          <>
            <Text
              fontSize={{ md: '40px', base: '20px' }}
              fontFamily={'SourceHanSansCN-Heavy, SourceHanSansCN;'}
              color={'#fff'}
              fontWeight={'800'}
              mb={'108px'}
            >
              How to mint an NFT Ticket with a Web3 Wallet?
            </Text>
            <HStack justify={'space-between'} flexFlow={'nowrap'}>
              <Box w={'40%'} mr={'100px'}>
                <Box
                  color={'#fff'}
                  fontSize={{ md: '16px', base: '12px' }}
                  fontWeight={'800'}
                >
                  <Text mb={'20px'}>
                    Embark on an extraordinary journey with our "From Sketch to
                    Screen" exhibition by minting an NFT ticket! The key to
                    unlocking this experience starts with owning a Web3 wallet
                    capable of safeguarding your NFT. Click the “Create a
                    Wallet” button below to download the OKX wallet or browse
                    the user guide for step-by-step instructions.
                  </Text>
                  <Text>
                    OKX Wallet is a non-custodial and decentralized multi-chain
                    wallet that provides one-stop asset management, secure
                    storage, transfer, and other features for global users.
                    Using a seed phrase to create an on-chain identity, users
                    can secure and conveniently manage their assets on various
                    networks, such as Bitcoin and Ethereum etc, across multiple
                    platforms (iOS, Android, and web extension), and also
                    supports multi-seed phrase import and derivation of
                    addresses.
                  </Text>
                </Box>
                <Flex alignItems={'center'} mt={'108px'}>
                  <Button
                    bg={'rgb(252,242,81)'}
                    w={'262px'}
                    h={'80px'}
                    rounded={'10px'}
                    fontSize={'24px'}
                    fontFamily={'PingFangSC-Heavy, PingFang SC;'}
                    fontWeight={'800'}
                    _hover={{ background: 'rgb(252,242,81)' }}
                    mr={'40px'}
                    onClick={() => {
                      window.location.href =
                        'https://www.okx.com/help-center/13810974034317';
                    }}
                  >
                    View Guidelines
                  </Button>
                  <Button
                    bg={'rgb(252,242,81)'}
                    w={'262px'}
                    h={'80px'}
                    rounded={'10px'}
                    fontSize={'24px'}
                    fontFamily={'PingFangSC-Heavy, PingFang SC;'}
                    fontWeight={'800'}
                    _hover={{ background: 'rgb(252,242,81)' }}
                    onClick={() => {
                      window.location.href =
                        'https://www.okx.com/download?channelid=ACE519023';
                    }}
                  >
                    Create a Wallet
                  </Button>
                </Flex>
              </Box>
              <Box pos={'relative'} bottom={'-20px'}>
                <HStack pos={'relative'} bottom={'0'}>
                  <Box>
                    <Image src={'/images/activity/anime/phone3.png'}></Image>
                  </Box>
                  <Box style={{ marginLeft: '66px' }}>
                    <Image src={'/images/activity/anime/phone4.png'}></Image>
                  </Box>
                </HStack>
              </Box>
            </HStack>
          </>
        ) : (
          <>
            <Flex direction={'column'} justify="center" alignItems={'center'}>
              <Text
                fontSize={{ md: '40px', base: '20px' }}
                fontFamily={'SourceHanSansCN-Heavy, SourceHanSansCN;'}
                color={'#fff'}
                fontWeight={'800'}
                textAlign={'center'}
                mb={'30px'}
              >
                How to use NFT Tickets?
              </Text>
              <Box>
                <Box
                  color={'#fff'}
                  fontSize={{ md: '16px', base: '12px' }}
                  fontWeight={'800'}
                >
                  <Text>
                    Embark on an extraordinary journey with our "From Sketch to
                    Screen" exhibition by minting an NFT ticket! The key to
                    unlocking this experience starts with owning a Web3 wallet
                    capable of safeguarding your NFT. Click the “Create a
                    Wallet” button below to download the OKX wallet or browse
                    the user guide for step-by-step instructions.
                  </Text>
                  <Text>
                    OKX Wallet is a non-custodial and decentralized multi-chain
                    wallet that provides one-stop asset management, secure
                    storage, transfer, and other features for global users.
                    Using a seed phrase to create an on-chain identity, users
                    can secure and conveniently manage their assets on various
                    networks, such as Bitcoin and Ethereum etc, across multiple
                    platforms (iOS, Android, and web extension), and also
                    supports multi-seed phrase import and derivation of
                    addresses.
                  </Text>
                </Box>
                <Flex
                  alignItems={'center'}
                  mt={'36px'}
                  justify={'space-around'}
                >
                  <Button
                    bg={'rgb(252,242,81)'}
                    w={'159px'}
                    h={'40px'}
                    rounded={'10px'}
                    fontSize={'12px'}
                    fontFamily={'PingFangSC-Heavy, PingFang SC;'}
                    fontWeight={'800'}
                    _hover={{ background: 'rgb(252,242,81)' }}
                    onClick={() => {
                      window.location.href =
                        'https://www.okx.com/help-center/13810974034317';
                    }}
                  >
                    View Guideline
                  </Button>
                  <Button
                    bg={'rgb(252,242,81)'}
                    w={'159px'}
                    h={'40px'}
                    rounded={'10px'}
                    fontSize={'12px'}
                    fontFamily={'PingFangSC-Heavy, PingFang SC;'}
                    fontWeight={'800'}
                    _hover={{ background: 'rgb(252,242,81)' }}
                    onClick={() => {
                      window.location.href =
                        'https://www.okx.com/download?channelid=ACE519023';
                    }}
                  >
                    Create a Wallet
                  </Button>
                </Flex>
              </Box>
              <HStack pos={'relative'} bottom={'-55px'}>
                <Box>
                  <Image src={'/images/activity/anime/phone3.png'}></Image>
                </Box>
                <Box style={{ marginLeft: '10px' }}>
                  <Image src={'/images/activity/anime/phone4.png'}></Image>
                </Box>
              </HStack>
            </Flex>
          </>
        )}
      </Box>
      <Box
        bg={'#1A1A1A;'}
        px={{ md: '100px', base: '16px' }}
        pt={{ md: '120px', base: '30px' }}
        pb={{ md: '40px', base: '0' }}
      >
        {isLargerThan768 ? (
          <>
            <Text
              fontSize={{ md: '40px', base: '20px' }}
              fontFamily={'SourceHanSansCN-Heavy, SourceHanSansCN;'}
              color={'#fff'}
              fontWeight={'800'}
              mb={'30px'}
            >
              How to use NFT Tickets?
            </Text>
            <HStack justify={'space-between'} flexFlow={'nowrap'}>
              <Box w={'40%'} mr={'100px'}>
                <Box
                  color={'#fff'}
                  fontSize={{ md: '22px', base: '12px' }}
                  fontWeight={'800'}
                >
                  <Text>
                    Step 1: Open your Web3 Wallet or scan the QR code to
                    download the OKX App
                  </Text>
                  <Text>
                    Step 2: Click “Scan” on your wallet homepage and scan the
                    verification code at the entrance of the exhibition
                  </Text>
                  <Text>
                    Step 3: You will be directed to your minted NFT ticket after
                    scanning, Click "Confirm"
                  </Text>
                  <Text>
                    Step 4: Enter the wallet password, Click “confirm” again,
                    then your NFT ticket verification is completed
                  </Text>
                </Box>
                <Flex alignItems={'top'} mt={'20px'}>
                  <Box mr={'20px'}>
                    <Image
                      src={'/images/activity/anime/qrcode.jpeg'}
                      // mt={'20px'}
                      mb={'10px'}
                      w={{ md: '130px', base: '119px' }}
                      h={{ md: '130px', base: '119px' }}
                    ></Image>
                    <Text color={'#fff'} fontSize={'16px'} fontWeight={'800'}>
                      Scan to download
                    </Text>
                  </Box>
                  <Text
                    fontSize={{ md: '16px', base: '14px' }}
                    fontFamily={'SourceHanSansCN-Heavy, SourceHanSansCN;'}
                    color={'#FEF200'}
                    fontWeight={'800'}
                    w={'250px'}
                    // mt={'40px'}
                  >
                    Use OKX Web3 wallet for ticket verification and receive
                    exquisite event merchandise as gifts. Gifts are limited and
                    will be presented on a first-come, first-served basis!
                  </Text>
                </Flex>
              </Box>
              <Box pos={'relative'} bottom={'-38px'}>
                <HStack pos={'relative'} bottom={'0'}>
                  <Box>
                    <Image src={'/images/activity/anime/phone1.png'}></Image>
                  </Box>
                  <Box style={{ marginLeft: '66px' }}>
                    <Image src={'/images/activity/anime/phone2.png'}></Image>
                  </Box>
                </HStack>
              </Box>
            </HStack>
          </>
        ) : (
          <>
            <Flex direction={'column'} justify="center" alignItems={'center'}>
              <Text
                fontSize={{ md: '40px', base: '20px' }}
                fontFamily={'SourceHanSansCN-Heavy, SourceHanSansCN;'}
                color={'#fff'}
                fontWeight={'800'}
                textAlign={'center'}
                mb={'30px'}
              >
                How to use NFT Tickets?
              </Text>
              <Box>
                <Box
                  color={'#fff'}
                  fontSize={{ md: '16px', base: '12px' }}
                  fontWeight={'800'}
                >
                  <Text>
                    Step 1: Open your Web3 Wallet or scan the QR code to
                    download the OKX App
                  </Text>
                  <Text>
                    Step 2: Click “Scan” on your wallet homepage and scan the
                    verification code at the entrance of the exhibition
                  </Text>
                  <Text>
                    Step 3: You will be directed to your minted NFT ticket after
                    scanning, Click “Confirm”
                  </Text>
                  <Text>
                    Step 4: Enter the wallet password, Click “confirm” again,
                    then your NFT ticket verification is completed
                  </Text>
                </Box>
              </Box>
              <Image
                src={'/images/activity/anime/qrcode.jpeg'}
                mt={'38px'}
                mb={'10px'}
                w={{ md: '', base: '119px' }}
                h={{ md: '', base: '119px' }}
              ></Image>
              <Text
                fontSize={{ md: '24px', base: '14px' }}
                fontFamily={'SourceHanSansCN-Heavy, SourceHanSansCN;'}
                color={'#FEF200'}
                fontWeight={'800'}
                mt={'24px'}
                mb={'55px'}
                textAlign={'center'}
              >
                Use OKX Web3 wallet for ticket verification and receive
                exquisite event merchandise as gifts. Gifts are limited and will
                be presented on a first-come, first-served basis!
              </Text>
              <HStack pos={'relative'} bottom={'-20px'}>
                <Box>
                  <Image src={'/images/activity/anime/phone1.png'}></Image>
                </Box>
                <Box style={{ marginLeft: '10px' }}>
                  <Image src={'/images/activity/anime/phone2.png'}></Image>
                </Box>
              </HStack>
            </Flex>
          </>
        )}
      </Box>
      {/* 独家发行平台 */}
      <VStack alignItems="center" bgColor={'black'}>
        <ShimmerImage
          src="/images/activity/aki/unemeta.png"
          minW={{ md: '106px', base: '70px' }}
          h={{ md: '122px', base: '80px' }}
          mt={{ md: '100px', base: '50px' }}
          mb={{ md: '77px', base: '30px' }}
        ></ShimmerImage>
        <Text
          color={'#fff'}
          fontSize={{ md: '40px', base: '24px' }}
          fontWeight={800}
          mb={{ md: '62px !important', base: '30px !important' }}
        >
          Exclusive Distribution Platform
        </Text>
        <Text
          fontSize={{ md: '20px', base: '10px' }}
          color="#fff"
          textAlign={'center'}
          px={{ md: '150px', base: '30px' }}
          mb={{ md: '95px !important', base: '45px !important' }}
        >
          UneMeta is Japan's largest high-quality IP NFT incubator, trading and
          social finance platform, focusing on excellent IP services based on
          Japanese culture. So far, we have released the NFT "Second Dimension"
          in cooperation with the popular Japanese voice actress Hanazawa Kana,
          and the NFT of Mushi Production's classic art IP "BELLADONNA OF
          SADNESS". The UneMeta platform aims to attract many users by
          developing a unique point system and providing an NFT experience that
          blends with real life. In addition, we aim to be a bridge connecting
          Web2 and Web3, and are committed to bringing more high-quality Web2
          IPs to Web3 to promote a sustainable NFT ecosystem.
        </Text>
      </VStack>
      <Modal onClose={onCloseModal} isOpen={isOpenModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint Success</ModalHeader>
          <ModalFooter>
            <Button onClick={onCloseModal}>OK</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
