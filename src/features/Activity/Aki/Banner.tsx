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
  Step,
  StepDescription,
  // StepIcon,
  StepIndicator,
  // StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Divider,
  useMediaQuery,
  Progress,
  Center,
} from '@chakra-ui/react';
import { ShimmerImage } from '@/components/Image';
import { useEffect, useState } from 'react';
import { useCounter, useTimeout } from 'ahooks';
import { FaDiscord, FaTwitter, FaTelegramPlane } from 'react-icons/fa';
import { TbWorld } from 'react-icons/tb';
import CountDown from './CountDown';
import { useTranslations } from 'next-intl';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useUserDataValue } from '@/store';
import { Image as ChakraImage } from '@chakra-ui/react';
import { useMint } from './useMint';
import { format } from 'date-fns';

let hasRefresh = false;

export const Banner = () => {
  const t = useTranslations('aki');
  const {
    mint,
    mintStart,
    canMinted,
    hasWhiteList,
    publicMintStart,
    maxSupply,
    getSign,
    contract,
  } = useMint();
  const [steps, setSteps] = useState([
    { title: t('preSale'), description: 'August 3 at 12PM JST' },
    { title: t('publicSale'), description: 'August 3 at 2PM JST' },
  ]);
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const toast = useToast();
  const [timestamp, setTimestamp] = useState(0);
  const [mintLoading, setMintLoading] = useState(false);
  const onFinish = () => {
    if (!hasRefresh) {
      hasRefresh = true;
    }
  };
  const userData = useUserDataValue();
  const { openConnectModal } = useConnectModal();

  const [current, { inc, dec, reset }] = useCounter(0, { min: 0 });
  const [isAdding, updateAddStatus] = useState(false);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isOpenModal, updateModalStatus] = useState(false);

  const getTime = async () => {
    console.log(activeStep, 'activeStep');
    const wstartTime = await mintStart();
    const pstartTime = await publicMintStart();
    if (wstartTime && pstartTime) {
      console.log(wstartTime, pstartTime);
      setSteps([
        { title: t('preSale'), description: format(wstartTime * 1000, 'PPpp') },
        {
          title: t('publicSale'),
          description: format(pstartTime * 1000, 'PPpp'),
        },
      ]);
      // 阶段二进行中
      if (new Date().getTime() >= new Date(pstartTime * 1000).getTime()) {
        setTimestamp(0);
        setActiveStep(2);
      }
      // 阶段一进行中
      else if (new Date().getTime() >= new Date(wstartTime * 1000).getTime()) {
        setTimestamp(
          new Date(pstartTime * 1000).getTime() - new Date().getTime(),
        );
        setActiveStep(1);
      }
      // 阶段一未开始
      else if (new Date().getTime() < new Date(wstartTime * 1000).getTime()) {
        setTimestamp(
          new Date(wstartTime * 1000).getTime() - new Date().getTime(),
        );
      }
    }
  };
  const getSupply = async () => {
    const num = await maxSupply();
    setSupply(num);
  };
  const [supply, setSupply] = useState(300);

  useEffect(() => {
    if (userData?.wallet_address) {
      reset(0);
    } else {
      openConnectModal?.();
    }
  }, [userData?.wallet_address]);

  useEffect(() => {
    if (contract) {
      getTime();
      getSupply();
    }
  }, [contract]);

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
    // 未到时间
    if (activeStep === 0) {
      toast({
        containerStyle: {
          border: '20px solid transparent',
        },
        title: "it's not time yet",
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
    try {
      setMintLoading(true);
      const time = await mintStart();
      console.log(time);
      const canMintedRes = await canMinted();
      if (canMintedRes) {
        // 这里需要传时间类型是publicSale2 还是 白单的preSale 1
        if (activeStep === 1) {
          const isWhitelist = await hasWhiteList();
          console.log(isWhitelist, 'isWhitelist');
          if (isWhitelist) {
            const signRes = await getSign();
            if (signRes) {
              await mint(signRes);
              setMintLoading(false);
              updateModalStatus(true);
              getSupply();
            }
          } else {
            toast({
              containerStyle: {
                border: '20px solid transparent',
              },
              title: 'not in the whitelist',
              status: 'warning',
              position: 'top',
              isClosable: false,
              duration: 2000,
            });
            setMintLoading(false);
          }
        } else if (activeStep === 2) {
          const signRes = await getSign();
          if (signRes) {
            await mint(signRes);
            setMintLoading(false);
            updateModalStatus(true);
          }
        }
      } else {
        setMintLoading(false);
        toast({
          containerStyle: {
            border: '20px solid transparent',
          },
          title: t('mintLimit'),
          status: 'warning',
          position: 'top',
          isClosable: false,
          duration: 2000,
        });
        return;
      }
    } catch (error) {
      setMintLoading(false);
      console.log(error);
    }
  };
  const onCloseModal = () => {
    updateModalStatus(false);
  };
  return (
    <>
      {/* 头部 */}
      <Box
        bgColor={'#212F27'}
        h={{ md: '80px', base: '40px' }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        py={{ md: '20px', base: '10px' }}
        px={{ md: '40px', base: '20px' }}
      >
        <ShimmerImage
          src="/images/activity/aki/logo.png"
          w={{ md: '460px', base: '180px' }}
          h={{ md: '46px', base: '20px' }}
          objectFit="contain"
        ></ShimmerImage>
        <HStack
          spacing={{ md: '40px', base: '20px' }}
          fontSize={{ md: '35px', base: '21px' }}
          align="center"
          color="#fff"
        >
          <Link
            href="https://twitter.com/aki_protocol"
            target="_blank"
            h={{ md: '35px', base: '21px' }}
          >
            <Icon as={FaTwitter} />
          </Link>
          <Link
            href="https://discord.gg/9Vak5shkaQ"
            target="_blank"
            h={{ md: '35px', base: '21px' }}
          >
            <Icon as={FaDiscord} />
          </Link>
          <Link
            href="https://akiprotocol.io/"
            target="_blank"
            h={{ md: '35px', base: '21px' }}
          >
            <Icon as={TbWorld} />
          </Link>
          <Link
            href="https://t.me/akiprotocol"
            target="_blank"
            h={{ md: '35px', base: '21px' }}
          >
            <Icon as={FaTelegramPlane} />
          </Link>
        </HStack>
      </Box>
      {/* mint部分 */}
      <Box
        w="full"
        h={{ md: '838px', base: '441px' }}
        bg={{
          md: 'url(/images/activity/aki/banner.png)',
          base: 'url(/images/activity/aki/banner_small.png)',
        }}
        bgSize="cover!important"
        bgRepeat="no-repeat!important"
        position="relative"
      >
        {isLargerThan768 ? (
          <Box position={'absolute'} left="150px" top="100px">
            <Box mb="80px">
              <CountDown timestamp={timestamp} onFinish={onFinish} />
            </Box>
            <Box display={'flex'}>
              <Stack spacing={3} mr="90px">
                <Text fontSize="24px" color="#fff">
                  {t('leftCount')}
                </Text>
                <Text fontSize="48px" color="#fff">
                  {supply}
                </Text>
              </Stack>
              <Stack spacing={3} mr="90px">
                <Text fontSize="24px" color="#fff">
                  {t('price')}
                </Text>
                <Text fontSize="48px" color="#fff">
                  Freemint
                </Text>
              </Stack>
              <Stepper
                index={activeStep}
                orientation="vertical"
                height="180px"
                colorScheme={'whiteAlpha'}
                gap="0"
              >
                {steps.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={
                          <Box bg="#fff" h="20px" w="20px" rounded="full" />
                        }
                      />
                    </StepIndicator>
                    <Box flexShrink="0">
                      <StepTitle color="#fff" fontSize="20px">
                        {step.title}
                      </StepTitle>
                      <StepDescription fontSize="20px">
                        {step.description}
                      </StepDescription>
                    </Box>
                    <StepSeparator />
                  </Step>
                ))}
              </Stepper>
            </Box>
            <Box w="full">
              <Box>
                <Text fontSize="24px" color="#fff">
                  {t('buyCount')}
                </Text>
                <HStack
                  w={{ md: '400px', base: '121px' }}
                  h={{ md: '80px', base: '33px' }}
                  bgColor="rgba(255,255,255, 0.8)"
                  color="#1E1F25"
                  fontSize={{ md: '40px', base: ' 16px' }}
                  justify="space-between"
                  rounded="10px"
                  mb={'30px'}
                >
                  <Text
                    px={{ md: '30px', base: '13px' }}
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => dec()}
                  >
                    -
                  </Text>
                  <Text flex={1} textAlign="center">
                    {current}
                  </Text>
                  <Box
                    px={{ md: '30px', base: '13px' }}
                    cursor="pointer"
                    userSelect="none"
                    onClick={() => {
                      if (current < 1) inc();
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
                <Box pos="relative">
                  <Button
                    isActive={false}
                    w={{ md: '400px', base: '130px' }}
                    h={{ md: '80px', base: '33px' }}
                    rounded="10px"
                    bgColor={'rgb(59,116,64)'}
                    fontSize={{ md: '32px', base: '16px' }}
                    color="#fff"
                    zIndex={10}
                    onClick={() => {
                      onMint();
                    }}
                    isLoading={mintLoading}
                    _hover={{ bg: 'rgb(59,116,64)' }}
                  >
                    {t('mint')}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          ''
        )}
      </Box>
      {isLargerThan768 ? (
        ''
      ) : (
        <VStack
          alignItems="center"
          position={'absolute'}
          top={'450px'}
          w="full"
        >
          <CountDown timestamp={timestamp} onFinish={onFinish} />
          <HStack
            alignItems={'center'}
            w="320px"
            border="1px"
            borderColor="#979797"
            rounded={'11px'}
            py="10px"
            bgColor="#2C3C33"
            justifyContent={'center'}
          >
            <Box display={'flex'} alignItems={'center'}>
              <VStack alignItems={'center'} mr="10px">
                <Box
                  w="18px"
                  h="18px"
                  rounded={'full'}
                  border={'1px solid #fff'}
                  display="flex"
                  alignItems={'center'}
                  justifyContent="center"
                >
                  {activeStep === 1 ? (
                    <Box
                      margin={'0 auto'}
                      w="10px"
                      h="10px"
                      rounded={'full'}
                      bgColor="#fff"
                    ></Box>
                  ) : (
                    ''
                  )}
                </Box>
                <Box
                  w="2px"
                  h="28px"
                  bgColor={'#fff'}
                  mt="0px !important"
                ></Box>
                <Box
                  w="18px"
                  h="18px"
                  rounded={'full'}
                  border={'1px solid #fff'}
                  display="flex"
                  alignItems={'center'}
                  justifyContent="center"
                  mt="0px !important"
                >
                  {activeStep === 2 ? (
                    <Box
                      margin={'0 auto'}
                      w="10px"
                      h="10px"
                      rounded={'full'}
                      bgColor="#fff"
                    ></Box>
                  ) : (
                    ''
                  )}
                </Box>
              </VStack>
              <Box fontSize={'10px'} color="#fff">
                {steps.map((item) => {
                  return (
                    <Box key={item.title} mb="8px">
                      <Text>{item.title}</Text>
                      <Text>{item.description}</Text>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </HStack>

          <HStack alignItems="center" mt={'20px !important'}>
            <VStack spacing={0} alignItems="center">
              <Text fontSize="24px" color="#fff">
                {supply}
              </Text>
              <Text fontSize="12px" color="#fff">
                {t('leftCount')}
              </Text>
            </VStack>
            <VStack spacing={0} alignItems="center" ml="80px !important">
              <Text fontSize="24px" color="#fff">
                Freemint
              </Text>
              <Text fontSize="12px" color="#fff">
                {t('price')}
              </Text>
            </VStack>
          </HStack>
          <HStack
            w={'300px'}
            h={'41px'}
            bgColor="rgba(255,255,255, 0.8)"
            color="#1E1F25"
            fontSize={'16px'}
            justify="space-between"
            rounded="5px"
            mb={'15px !important'}
            mt={'20px !important'}
          >
            <Text
              px={{ md: '30px', base: '13px' }}
              cursor="pointer"
              userSelect="none"
              onClick={() => dec()}
            >
              -
            </Text>
            <Text flex={1} textAlign="center">
              {current}
            </Text>
            <Box
              px={{ md: '30px', base: '13px' }}
              cursor="pointer"
              userSelect="none"
              onClick={() => {
                if (current < 1) inc();
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
          <Box pos="relative">
            <Button
              w="300px"
              h="41px"
              rounded="5px"
              bgColor={'rgb(59,116,64)'}
              fontSize={'16px'}
              color="#fff"
              zIndex={10}
              onClick={() => {
                onMint();
              }}
              isLoading={mintLoading}
              _hover={{ bg: 'rgb(59,116,64)' }}
            >
              {t('mint')}
            </Button>
          </Box>
        </VStack>
      )}

      <Box
        bg={{ md: 'url(/images/activity/aki/contentBg.png)', base: '#212F27' }}
        backgroundSize="cover !important"
        p={{ md: '80px', base: '30px' }}
        pt={{ md: '80px', base: '300px' }}
        maxW={'full'}
        w="full"
        flexShrink={0}
      >
        {/* 喇叭 */}
        <Stack
          spacing={8}
          direction={['column', 'row']}
          alignItems="center"
          border="1px"
          borderColor="#979797"
          py={{ md: '80px', base: '25px' }}
          px={{ md: '100px', base: '15px' }}
          rounded={{ md: '22px', base: '11px' }}
          bgColor="#2C3C33"
          mb={{ md: '200px', base: '40px' }}
        >
          <ShimmerImage
            src="/images/activity/aki/speaker.png"
            minW={{ md: '213px', base: '106px' }}
            h={{ md: '169px', base: '85px' }}
            mr={{ md: '140px' }}
          ></ShimmerImage>
          <Box>
            <Text
              fontSize={{ md: '48px', base: '24px' }}
              fontWeight="bold"
              color="#fff"
              textAlign={{ md: 'left', base: 'center' }}
            >
              {t('pointsReward')}
            </Text>
            <Text fontSize={{ md: '32px', base: '16px' }} color="#fff">
              {t('100uuu')}
            </Text>
          </Box>
        </Stack>
        {/* 项目信息 */}
        <Stack
          direction={['column', 'row']}
          flexWrap="wrap"
          justifyContent="center"
          mb={{ md: '200px !important', base: '40px !important' }}
          w="full"
        >
          <Box
            width={{ mb: '', base: 'full' }}
            mr={{ md: '50px', base: '0' }}
            mb={{ md: '0', base: '40px' }}
          >
            <Text
              color="#fff"
              fontSize={{ md: '64px', base: '24px' }}
              mb={{ md: '100px', base: '20px' }}
              fontWeight="800"
            >
              {t('projectScore')}
            </Text>
            <Box
              //   pl={{ md: '88px', base: '60px' }}
              //   pt={{ md: '108px', base: '50px' }}
              //   pr={{ md: '131px', base: '60px' }}
              //   pb={{ md: '87px', base: '50px' }}
              w={{ md: '640px', base: 'full' }}
              h={{ md: '560px', base: '253px' }}
              pos="relative"
              className="akicard-bg"
            >
              <Text
                color="#fff"
                fontSize={{ md: '20px', base: '12px' }}
                pos="absolute"
                top={{ md: '50px', base: '15px' }}
                left={{ md: '300px', base: '153px' }}
              >
                {t('international')}
              </Text>
              <Text
                color="#fff"
                fontSize={{ md: '20px', base: '12px' }}
                pos="absolute"
                top={{ md: '220px', base: '90px' }}
                left={{ md: '520px', base: '270px' }}
                minW={'60px'}
              >
                {t('otherAspects')}
              </Text>
              <Text
                color="#fff"
                fontSize={{ md: '20px', base: '12px' }}
                pos="absolute"
                top={{ md: '470px', base: '220px' }}
                left={{ md: '400px', base: '208px' }}
              >
                {t('supporters')}
              </Text>
              <Text
                color="#fff"
                fontSize={{ md: '20px', base: '12px' }}
                pos="absolute"
                top={{ md: '470px', base: '220px' }}
                left={{ md: '140px', base: '78px' }}
              >
                {t('nftUsage')}
              </Text>
              <Text
                color="#fff"
                fontSize={{ md: '20px', base: '12px' }}
                pos="absolute"
                top={{ md: '220px', base: '90px' }}
                left={{ md: '50px', base: '20px' }}
              >
                {t('community')}
              </Text>
              <ShimmerImage
                src="/images/activity/aki/pointsChart.png"
                w={{ md: '383px', base: '192px' }}
                h={{ md: '365px', base: '182px' }}
                pos="absolute"
                transform={'translate(-50%,-50%)'}
                left="50%"
                top="50%"
              ></ShimmerImage>
            </Box>
          </Box>
          <Box w={{ mb: '', base: 'full' }}>
            <Text
              color="#fff"
              fontSize={{ md: '64px', base: '24px' }}
              mb={{ md: '100px', base: '20px' }}
              fontWeight="800"
            >
              {t('projectInformation')}
            </Text>
            <Box
              className="akicard-bg"
              pt={{ md: '69px', base: '32px' }}
              pl={{ md: '57px', base: '26px' }}
              pr={{ md: '55px', base: '25px' }}
              pb={{ md: '55px', base: '25px' }}
              w={{ md: '640px', base: 'full' }}
              h={{ md: '560px', base: '253px' }}
            >
              <Flex justifyContent="space-between" pos="relative">
                <Box>
                  <Text
                    fontSize={{ md: '20px', base: '9px' }}
                    color="grey"
                    mb={{ md: '30px', base: '12px' }}
                  >
                    {t('contractAddress')}
                  </Text>
                  <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                    0x430fe…3ff0
                  </Text>
                </Box>
                <Box w={{ base: '50px', md: '120px' }}>
                  <Text
                    fontSize={{ md: '20px', base: '9px' }}
                    color="grey"
                    mb={{ md: '30px', base: '12px' }}
                  >
                    {t('storageMethod')}
                  </Text>
                  <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                    IPFS
                  </Text>
                </Box>
              </Flex>
              <Divider
                mb={{ md: '31px', base: '15px' }}
                mt={{ md: '22px', base: '5px' }}
              />
              <Flex justifyContent="space-between" pos="relative">
                <Box>
                  <Text
                    fontSize={{ md: '20px', base: '9px' }}
                    color="grey"
                    mb={{ md: '30px', base: '12px' }}
                  >
                    {t('totalSupply')}
                  </Text>
                  <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                    300
                  </Text>
                </Box>
                <Box w={{ base: '50px', md: '120px' }}>
                  <Text
                    fontSize={{ md: '20px', base: '9px' }}
                    color="grey"
                    mb={{ md: '30px', base: '12px' }}
                  >
                    {t('tokenStandard')}
                  </Text>
                  <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                    ERC721
                  </Text>
                </Box>
              </Flex>
              <Divider
                mb={{ md: '31px', base: '15px' }}
                mt={{ md: '22px', base: '5px' }}
              />
              <Flex justifyContent="space-between" pos="relative">
                <Box>
                  <Text
                    fontSize={{ md: '20px', base: '9px' }}
                    color="grey"
                    mb={{ md: '30px', base: '12px' }}
                  >
                    {t('blockchain')}
                  </Text>
                  <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                    Ethereum
                  </Text>
                </Box>
                <Box w={{ base: '50px', md: '120px' }}>
                  <Text
                    fontSize={{ md: '20px', base: '9px' }}
                    color="grey"
                    mb={{ md: '30px', base: '12px' }}
                  >
                    {t('royalty')}
                  </Text>
                  <Text fontSize={{ md: '28px', base: '14px' }} color="#fff">
                    10%
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Box>
        </Stack>
        {/* Buddy Badge */}
        <Box mb={{ md: '200px !important', base: '40px !important' }}>
          <Text
            fontSize={{ md: '64px', base: '24px' }}
            fontWeight={800}
            color="#fff"
            mb={{ md: '100px', base: '20px' }}
          >
            {/* {t('akiT')} */}
            Buddy Badge
          </Text>
          <Box>
            <Text
              pos={'relative'}
              fontSize={{ md: '32px', base: '14px' }}
              color="#fff"
              textAlign={'left'}
            >
              {t('BuddyBadge')}
            </Text>
          </Box>
        </Box>
        {/* AKI introduction */}
        <Box mb={{ md: '200px !important', base: '40px !important' }}>
          <Text
            fontSize={{ md: '64px', base: '24px' }}
            fontWeight={800}
            color="#fff"
            mb={{ md: '100px', base: '20px' }}
          >
            {t('akiT')}
          </Text>
          <Stack spacing={8} direction={['column', 'row']} alignItems="center">
            <ShimmerImage
              src="/images/activity/aki/biglogo.png"
              minW={{ md: '320px', base: '100px' }}
              h={{ md: '321px', base: '101px' }}
            ></ShimmerImage>
            <Text
              fontSize={{ md: '32px', base: '14px' }}
              color="#fff"
              textAlign={'left'}
            >
              {t('akiC1')}
              {t('akiC2')}
              {t('akiC3')}
            </Text>
          </Stack>
        </Box>
        {/* 进一步了解AKI NETWORK */}
        <Box mb={{ md: '200px !important', base: '40px !important' }}>
          <Box mb={{ md: '100px', base: '20px' }}>
            <Text
              fontSize={{ md: '64px', base: '24px' }}
              fontWeight={800}
              color="#fff"
            >
              {t('akiMore')}
            </Text>
            <Text fontSize={{ md: '64px', base: '24px' }} color="#fff">
              {t('2021')}
            </Text>
          </Box>

          <Stack
            direction={'row'}
            alignItems="center"
            flexWrap="wrap"
            justifyContent={'space-between'}
          >
            <Box
              color={'#fff'}
              w={{ md: '23%', base: '40%' }}
              ml={'0 !important'}
            >
              <HStack fontSize={{ md: '70px', base: '24' }}>
                <Text>191,276</Text>
                <Text color={'#1EAF1D'}>+</Text>
              </HStack>
              <Box fontSize={{ md: '30px', base: '15px' }} color="#9BA59F">
                <Text>{t('oneAddressAll')}</Text>
                {/* <Text>Addresses</Text> */}
              </Box>
            </Box>
            <Box
              color={'#fff'}
              w={{ md: '23%', base: '40%' }}
              ml={'0 !important'}
            >
              <HStack fontSize={{ md: '70px', base: '24' }}>
                <Text>2,386</Text>
                <Text color={'#1EAF1D'}>+</Text>
              </HStack>
              <Box fontSize={{ md: '30px', base: '15px' }} color="#9BA59F">
                <Text>{t('influence')}</Text>
                {/* <Text>Addresses</Text> */}
              </Box>
            </Box>
            <Box
              color={'#fff'}
              w={{ md: '23%', base: '40%' }}
              ml={'0 !important'}
            >
              <HStack fontSize={{ md: '70px', base: '24' }}>
                <Text>358,565</Text>
                <Text color={'#1EAF1D'}>+</Text>
              </HStack>
              <Box fontSize={{ md: '30px', base: '15px' }} color="#9BA59F">
                <Text>{t('createReferral')}</Text>
                {/* <Text>Addresses</Text> */}
              </Box>
            </Box>
            <Box
              color={'#fff'}
              w={{ md: '23%', base: '40%' }}
              ml={'0 !important'}
            >
              <HStack fontSize={{ md: '70px', base: '24' }}>
                <Text>278</Text>
                <Text color={'#1EAF1D'}>+</Text>
              </HStack>
              <Box fontSize={{ md: '30px', base: '15px' }} color="#9BA59F">
                <Text>{t('createActivity')}</Text>
                {/* <Text>Addresses</Text> */}
              </Box>
            </Box>
          </Stack>
        </Box>
        {/* Partners */}
        <Box mb={{ md: '200px !important', base: '40px !important' }}>
          <Text
            fontSize={{ md: '64px', base: '24px' }}
            fontWeight={800}
            color="#fff"
            mb={{ md: '100px', base: '20px' }}
          >
            {t('partner')}
          </Text>
          <Box>
            <ChakraImage
              src="/images/activity/aki/partner.png"
              w={'full'}
              // w={{ md: '1619px', base: '321px' }}
              // h={{ md: '408px', base: '81px' }}
            ></ChakraImage>
          </Box>
        </Box>
        {/* AKI 的影响力 */}
        <Box mb={{ md: '200px !important', base: '40px !important' }}>
          <Text
            fontSize={{ md: '64px', base: '24px' }}
            fontWeight={800}
            color="#fff"
            mb={{ md: '100px', base: '20px' }}
          >
            {t('akiInfluence')}
          </Text>
          <Stack
            direction={['column', 'row']}
            alignItems="center"
            flexWrap="nowrap"
            justifyContent={'space-between'}
          >
            <Box
              className="akicard-bg"
              px={{ md: '58px', base: '29px' }}
              py={{ md: '100px', base: '50px' }}
              mb={'10px'}
              flex={1}
              h={{ md: '572px', base: '' }}
            >
              <VStack pos={'relative'}>
                <ShimmerImage
                  src="/images/activity/aki/people.png"
                  w={{ md: '120px', base: '60px' }}
                  mb={{ md: '57px', base: '29px' }}
                  h={{ md: '121px', base: '60px' }}
                ></ShimmerImage>
                <Text
                  color={'#fff'}
                  fontSize={{ md: '40px', base: '20px' }}
                  fontWeight={800}
                  mb={{ md: '35px', base: '18px' }}
                >
                  {t('actualParticipant')}
                </Text>
                <Text color={'#fff'} fontSize={{ md: '20px', base: '10px' }}>
                  {t('akiC4')}
                </Text>
              </VStack>
            </Box>
            <Box
              className="akicard-bg"
              px={{ md: '58px', base: '29px' }}
              py={{ md: '100px', base: '50px' }}
              mb={'10px !important'}
              flex={1}
              h={{ md: '572px', base: '' }}
            >
              <VStack pos={'relative'}>
                <ShimmerImage
                  src="/images/activity/aki/internet.png"
                  w={{ md: '120px', base: '60px' }}
                  mb={{ md: '57px', base: '29px' }}
                  h={{ md: '121px', base: '60px' }}
                ></ShimmerImage>
                <Text
                  color={'#fff'}
                  fontSize={{ md: '40px', base: '20px' }}
                  fontWeight={800}
                  mb={{ md: '35px', base: '18px' }}
                >
                  {t('communitySize')}
                </Text>
                <Text color={'#fff'} fontSize={{ md: '20px', base: '10px' }}>
                  {t('akiC5')}
                </Text>
              </VStack>
            </Box>
            <Box
              className="akicard-bg"
              px={{ md: '58px', base: '29px' }}
              py={{ md: '100px', base: '50px' }}
              mb={'10px !important'}
              flex={1}
              h={{ md: '572px', base: '' }}
            >
              <VStack pos={'relative'}>
                <ShimmerImage
                  src="/images/activity/aki/community.png"
                  w={{ md: '120px', base: '60px' }}
                  mb={{ md: '57px', base: '29px' }}
                  h={{ md: '121px', base: '60px' }}
                ></ShimmerImage>
                <Text
                  color={'#fff'}
                  fontSize={{ md: '40px', base: '20px' }}
                  fontWeight={800}
                  mb={{ md: '35px', base: '18px' }}
                >
                  {t('socialMedia')}
                </Text>
                <Text color={'#fff'} fontSize={{ md: '20px', base: '10px' }}>
                  {t('akiC6')}
                </Text>
              </VStack>
            </Box>
          </Stack>
        </Box>
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
          {t('platform')}
        </Text>
        <Text
          fontSize={{ md: '20px', base: '10px' }}
          color="#fff"
          textAlign={'center'}
          px={{ md: '150px', base: '30px' }}
          mb={{ md: '95px !important', base: '45px !important' }}
        >
          {t('unemeta')}
        </Text>
      </VStack>
      <Modal onClose={onCloseModal} isOpen={isOpenModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('mintSuccess')}</ModalHeader>
          <ModalFooter>
            <Button onClick={onCloseModal}>OK</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
