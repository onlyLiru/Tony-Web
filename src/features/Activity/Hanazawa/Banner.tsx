import { useRef, useContext, useEffect, useState, useMemo } from 'react';
import {
  Box,
  Text,
  Stack,
  VStack,
  HStack,
  Flex,
  Icon,
  Center,
  Button,
  Link,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useMediaQuery,
  useToast,
  Tooltip,
  Image as ChakraImage,
} from '@chakra-ui/react';
import Image from '@/components/Image';
import { useCountDown, useRequest } from 'ahooks';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from 'react-icons/md';
// eslint-disable-next-line no-restricted-imports
import { ListingModal } from '@/features/Activity/Hanazawa';
import { PageInfoContext } from './context';
import { defaultChainId, staticChainId, useUserDataValue } from '@/store';
import { itemMintStatus, ApiHanazawa } from './services';
import { useRouter } from 'next/router';
import { useMintEvent } from './useMintEvent';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useTranslations } from 'next-intl';
import { getErrorMessage } from '@/utils/error';
import { useUserWalletBalance } from '@/hooks/useUserWalletBalance';

const MintCountDown = () => {
  const { data } = useContext(PageInfoContext);
  const [_, formattedRes] = useCountDown({
    leftTime: data.end_time ? data.end_time * 1000 : 0,
  });
  const { days, hours, minutes, seconds } = formattedRes;

  return (
    <HStack justify="space-between" color="white">
      <Stack
        spacing={{ md: 0, base: '10px' }}
        direction={{ md: 'row', base: 'column' }}
      >
        <Flex align="flex-end" mr="22px">
          <Center
            w={{ md: '34px', base: '24px' }}
            h={{ md: '40px', base: '28px' }}
            bg="rgba(255,255,255, 0.3)"
            rounded="sm"
            fontSize={{ md: '22px', base: '17px' }}
            lineHeight={{ md: '30px', base: '24px' }}
            color="white"
            mr="10px"
          >
            {days * 1 < 10 ? `0${days}` : days}
          </Center>
          <Text
            fontSize={{ md: 'md', base: '11px' }}
            lineHeight={{ md: '18px', base: '12px' }}
          >
            Day
          </Text>
        </Flex>
        <HStack spacing={{ md: 4, base: '5px' }}>
          <Flex align="flex-end">
            <Center
              w={{ md: '34px', base: '24px' }}
              h={{ md: '40px', base: '28px' }}
              bg="rgba(255,255,255, 0.3)"
              rounded="sm"
              fontSize={{ md: '22px', base: '17px' }}
              lineHeight={{ md: '30px', base: '24px' }}
              color="white"
              mr={{ md: '10px', base: '3px' }}
            >
              {hours * 1 < 10 ? `0${hours}` : hours}
            </Center>
            <Text
              fontSize={{ md: 'md', base: '11px' }}
              lineHeight={{ md: '18px', base: '12px' }}
            >
              H
            </Text>
          </Flex>
          <Flex align="flex-end">
            <Center
              w={{ md: '34px', base: '24px' }}
              h={{ md: '40px', base: '28px' }}
              bg="rgba(255,255,255, 0.3)"
              rounded="sm"
              fontSize={{ md: '22px', base: '17px' }}
              lineHeight={{ md: '30px', base: '24px' }}
              color="white"
              mr={{ md: '10px', base: '3px' }}
            >
              {minutes * 1 < 10 ? `0${minutes}` : minutes}
            </Center>
            <Text
              fontSize={{ md: 'md', base: '11px' }}
              lineHeight={{ md: '18px', base: '12px' }}
            >
              M
            </Text>
          </Flex>
          <Flex align="flex-end">
            <Center
              w={{ md: '34px', base: '24px' }}
              h={{ md: '40px', base: '28px' }}
              bg="rgba(255,255,255, 0.3)"
              rounded="sm"
              fontSize={{ md: '22px', base: '17px' }}
              lineHeight={{ md: '30px', base: '24px' }}
              color="white"
              mr={{ md: '10px', base: '3px' }}
            >
              {seconds * 1 < 10 ? `0${seconds}` : seconds}
            </Center>
            <Text
              fontSize={{ md: 'md', base: '11px' }}
              lineHeight={{ md: '18px', base: '12px' }}
            >
              S
            </Text>
          </Flex>
        </HStack>
      </Stack>
    </HStack>
  );
};

const steps = [
  {
    key: 4,
    title: 'Allowlist',
    time: 'October 20 at 00:00 GTM+8',
    number: '2000',
    price: 'free',
  },
  {
    key: 2,
    title: 'Whitelist',
    time: 'October 21 at 00:00  GTM+8',
    number: '4666',
    price: '0.08 ETH',
  },
  {
    key: 1,
    title: 'Public Sale',
    time: 'October 22 at 00:00  GTM+8',
    number: 'TBD',
    price: '0.1 ETH',
  },
];

const mintInfo = [
  {
    label: 'items',
    key: 'items',
  },
  {
    label: 'uniqueOwners',
    key: 'unique_owners',
  },
  {
    label: 'listed',
    key: 'listed_rate',
  },
  {
    label: 'vol',
    key: 'vol',
  },
  {
    label: 'floor',
    key: 'floor',
  },
];

export const Banner = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const router = useRouter();
  const listingRef = useRef<any>();
  const toast = useToast();
  const userData = useUserDataValue();
  const [userMintData, setUserMintData] =
    useState<ApiHanazawa.ItemMintStatus>();
  const [mintCount, setMintCount] = useState(1);
  const [activeStep, setActiveStep] = useState(8);
  const { loading, freeMint, whitelistMint, publicMint } = useMintEvent();

  const { refresh, data } = useContext(PageInfoContext);

  const { openConnectModal } = useConnectModal();
  const { localCurrencyAmount: ethAmount, localCurrency: ethCurrency } =
    useUserWalletBalance({ fixedChainId: defaultChainId });
  const t = useTranslations('hz');

  const itemMintStatusReq = useRequest(itemMintStatus, {
    manual: true,
  });

  const mintData: any[] = data.mintData
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mintInfo.map((v) => ({ ...v, value: data.mintData[v.key] }))
    : [];

  const pageLoading = useMemo(
    () => !data?.address || (!userMintData && userData?.wallet_address),
    [data, userMintData],
  );

  // 用户能否mint
  const canMint = useMemo(
    () =>
      (!userData?.wallet_address && !pageLoading) ||
      (userMintData?.mint_status && !!data.left),
    [userMintData, data],
  );
  // 当前阶段是否售罄
  const isSoldout = useMemo(
    () => data.sales_stage === activeStep && data.left === 0,
    [activeStep, data],
  );

  const fetchUser = async () => {
    try {
      const userStatus = await itemMintStatusReq.runAsync({
        address: data?.address!,
      });
      setUserMintData(userStatus.data);
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  useEffect(() => {
    if (userData?.wallet_address && data?.address) {
      fetchUser();
    }
  }, [userData?.wallet_address, data?.address]);

  useEffect(() => {
    if (data.sales_stage) {
      setActiveStep(data.sales_stage === 8 ? 4 : data.sales_stage);
    }
  }, [data]);

  const changeStep = (key: number) => {
    if (Number(data.sales_stage) < key) return;
    setActiveStep(key);
  };

  const handleMint = async () => {
    if (!canMint) {
      router.push(`/collection/${staticChainId}/${data.address}?source=search`);
      return;
    }
    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }
    if (ethAmount < mintCount * data.price!) {
      toast({
        status: 'error',
        title: t('insufficientAmount'),
        variant: 'subtle',
      });
      return;
    }
    try {
      switch (data.sales_stage) {
        case 4:
          await freeMint({ count: mintCount });
          break;
        case 2:
          await whitelistMint({ count: mintCount });
          break;
        case 1:
          await publicMint({ count: mintCount });
          break;
        default:
      }
      listingRef.current?.open(data.address);
      refresh();
      fetchUser();
      ethCurrency?.refetch?.();
    } catch (error) {
      toast({
        status: 'error',
        title: getErrorMessage(error),
        variant: 'subtle',
      });
    }
  };

  return (
    <>
      <Box
        width="full"
        pt={{ md: '84px', base: '25px' }}
        bgImage={'/images/activity/hanazawa/image.png'}
        bgSize={{ md: '610px 640px', base: '226px 256px' }}
        bgRepeat="no-repeat"
        bgPosition={{
          md: 'top 100px right 56px',
          base: 'top 80px right -14px',
        }}
        mb={{ md: '50px', base: 0 }}
      >
        <Box pos="relative" w="full" maxW="1221px" mx="auto">
          <VStack
            spacing={{ md: '10px', base: '55px' }}
            align="flex-start"
            pl={{ md: '52px', base: '25px' }}
            mb={{ md: '50px', base: '28px' }}
          >
            <Flex direction={{ base: 'column', md: 'row' }} align="flex-start">
              <Image
                w={{ base: '295px', md: '483px' }}
                src={
                  isLargerThan768
                    ? '/images/activity/hanazawa/title.png'
                    : '/images/activity/hanazawa/mobileTitle.png'
                }
                fallbackSrc={undefined}
                fallback={
                  <Box
                    w={{ base: '295px', md: '483px' }}
                    h={{ base: '140px', md: '164px' }}
                  />
                }
              />
              <HStack
                spacing={5}
                pt="20px"
                ml={{ base: '0', md: '24px' }}
                color="white"
                fontSize={{ base: '18px', md: '24px' }}
                align="flex-start"
              >
                <Link href="https://twitter.com/hanazawa_nft" target="_blank">
                  <Icon as={FaTwitter} />
                </Link>
                <Link href="https://discord.gg/seconddimension" target="_blank">
                  <Icon as={FaDiscord} />
                </Link>
                <Link
                  href="https://etherscan.io/address/0x095dCcA826ef15c8ac06088BE7F5fF85c506191a"
                  target="_blank"
                >
                  <ChakraImage
                    w={{ md: '30px', base: '22px' }}
                    h="auto"
                    src="/images/activity/hanazawa/etherscan.png"
                  />
                </Link>
              </HStack>
            </Flex>
            <MintCountDown />
          </VStack>
          <Box
            maxW="690px"
            w={{ md: 'auto', base: '335px' }}
            mx={{ md: 0, base: 'auto' }}
            rounded="md"
            bg="rgba(0,0,0, 0.6)"
            px={{ md: '24px', base: '0' }}
            pb={{ md: '30px', base: '15px' }}
            zIndex={10}
          >
            <Stack
              direction={{ md: 'row', base: 'column' }}
              align="flex-start"
              spacing={0}
              h={{ md: '287px', base: 'auto' }}
            >
              <VStack
                maxW={{ md: '190px', base: '335px' }}
                w={{ md: 'auto', base: '335px' }}
                spacing={0}
                align="flex-start"
                pt={{ md: '24px', base: '32px' }}
                mb={{ md: '0', base: '30px' }}
                px={{ md: '0', base: '20px' }}
              >
                {steps.map((v, i) => (
                  <Flex
                    w="full"
                    key={i}
                    onClick={() => changeStep(v.key)}
                    cursor="pointer"
                    p={{ md: 1, base: 0 }}
                    rounded="4px"
                    _hover={
                      Number(data.sales_stage) < v.key || !isLargerThan768
                        ? {}
                        : { bgColor: 'rgba(255,255,255, 0.1)' }
                    }
                  >
                    <VStack spacing={0}>
                      <Box
                        w={{ md: '24px', base: '15px' }}
                        h={{ md: '24px', base: '15px' }}
                        rounded="full"
                        bg={
                          activeStep === v.key
                            ? 'linear-gradient(#6F9FF3 0%, #473874 100%)'
                            : Number(data.sales_stage) < v.key
                            ? '#454545'
                            : ''
                        }
                        border={
                          Number(data.sales_stage) < v.key
                            ? ''
                            : '1px solid #838383'
                        }
                      ></Box>
                      {v.key !== 1 && (
                        <Box
                          w="2px"
                          h={{ md: '54px', base: '18px' }}
                          bg="linear-gradient(to bottom, transparent 0%, transparent 50%, #838383 50%, #838383 100%)"
                          bgSize={{ md: '2px 11px', base: '2px 4px' }}
                          opacity={0.6}
                        ></Box>
                      )}
                    </VStack>
                    <Stack
                      flex={1}
                      w="full"
                      direction={{ md: 'column', base: 'row' }}
                      align="flex-start"
                      justify={{ md: 'flex-start', base: 'space-between' }}
                      pl="10px"
                      fontSize="14px"
                      fontWeight={400}
                      spacing={0}
                      color={
                        activeStep === v.key
                          ? 'white'
                          : Number(data.sales_stage) < v.key
                          ? '#454545'
                          : '#838383'
                      }
                      lineHeight="25px"
                      transform={{
                        md: 'translateY(-2px)',
                        base: 'translateY(-6px)',
                      }}
                    >
                      <Text
                        color={
                          activeStep === v.key
                            ? '#6F9FF3'
                            : Number(data.sales_stage) < v.key
                            ? '#454545'
                            : '#838383'
                        }
                      >
                        {v.title}
                      </Text>
                      <HStack spacing={0} wrap="wrap">
                        <Text>{v.time}</Text>
                      </HStack>
                    </Stack>
                  </Flex>
                ))}
              </VStack>
              <HStack align="flex-start" pb="20px">
                <Box pos="relative">
                  <Image
                    w={{ md: '250px', base: '179px' }}
                    h={{ md: '290px', base: '203px' }}
                    src={'/images/activity/hanazawa/item.png'}
                    fallbackSrc={undefined}
                    fallback={
                      <Box
                        w={{ md: '250px', base: '179px' }}
                        h={{ md: '290px', base: '203px' }}
                      />
                    }
                  />
                  {isSoldout && (
                    <Image
                      pos="absolute"
                      top="22px"
                      right="-14px"
                      w="111px"
                      h="72px"
                      src={'/images/activity/hanazawa/soldOut.png'}
                      fallbackSrc={undefined}
                    />
                  )}
                </Box>
                <VStack
                  w={{ md: '200px', base: '148px' }}
                  spacing={{ md: 10, base: 5 }}
                  color="#26262"
                  pt={{ md: '46px', base: '24px' }}
                  transform="translateX(-10px)"
                  align="flex-start"
                >
                  <VStack
                    h="102px"
                    spacing="12px"
                    align="flex-start"
                    color="white"
                    pl="10px"
                  >
                    <HStack spacing={0}>
                      <Text
                        w={{ md: '95px', base: '67px' }}
                        fontSize={{ md: '18px', base: '14px' }}
                      >
                        {t('left')}
                      </Text>
                      <Text
                        fontSize={{ md: '24px', base: '18px' }}
                        lineHeight={{ md: '28px', base: '21px' }}
                        fontWeight="600"
                      >
                        {data.sales_stage === activeStep
                          ? data.left
                          : steps.filter((v) => v.key === activeStep)[0]
                              ?.number}
                      </Text>
                    </HStack>
                    <HStack spacing={0} h="25px">
                      <Text
                        w={{ md: '95px', base: '67px' }}
                        fontSize={{ md: '18px', base: '14px' }}
                      >
                        {t('price')}
                      </Text>
                      <Text
                        fontSize={{ md: '22px', base: '18px' }}
                        lineHeight={{ md: '28px', base: '21px' }}
                        fontWeight="600"
                        whiteSpace="nowrap"
                      >
                        {data.sales_stage === activeStep
                          ? data.price
                            ? `${data.price} ETH`
                            : t('free')
                          : steps.filter((v) => v.key === activeStep)[0]?.price}
                      </Text>
                    </HStack>
                    {canMint && data.sales_stage === activeStep && (
                      <HStack spacing={0} h="25px">
                        <Text
                          w={{ md: '95px', base: '67px' }}
                          fontSize={{ md: '18px', base: '14px' }}
                        >
                          {t('num')}
                        </Text>
                        <NumberInput
                          min={1}
                          max={
                            userMintData?.max_mint_count! -
                            userMintData?.mint_count!
                          }
                          value={mintCount}
                          onChange={(v) => setMintCount(+v)}
                          w={{ md: '88px', base: '77px' }}
                          h={{ md: '32px', base: '26px' }}
                          variant="mint"
                          _focusVisible={{
                            borderColor: 'red',
                            bg: 'rgba(0,0,0, 0.6)',
                          }}
                          isDisabled={!userData?.wallet_address}
                        >
                          <NumberInputField h="32px" />
                          <NumberInputStepper
                            borderColor="rgba(235, 235, 235, 0.2)"
                            color="rgba(235, 235, 235, 0.2)"
                          >
                            <NumberIncrementStepper
                              children={
                                <Icon
                                  as={MdOutlineKeyboardArrowUp}
                                  fontSize="sm"
                                />
                              }
                            />
                            <NumberDecrementStepper
                              _disabled={{}}
                              borderColor="rgba(235, 235, 235, 0.2)"
                              color="rgba(235, 235, 235, 0.2)"
                              children={
                                <Icon
                                  as={MdOutlineKeyboardArrowDown}
                                  fontSize="sm"
                                />
                              }
                            />
                          </NumberInputStepper>
                        </NumberInput>
                      </HStack>
                    )}
                  </VStack>
                  <VStack spacing={1} color="white" fontSize="14px">
                    <Button
                      w={{ md: '200px', base: '148px' }}
                      h={{ md: '50px', base: '36px' }}
                      fontSize={{ md: 'md', base: '14px' }}
                      fontWeight={{ md: 600, base: 500 }}
                      color="white"
                      rounded={{ md: '25px', base: '18px' }}
                      bg="url(/images/activity/hanazawa/buy.png)"
                      bgSize="cover"
                      _hover={{
                        opacity: 0.8,
                      }}
                      isDisabled={
                        data.sales_stage === 8 ||
                        data.sales_stage !== activeStep
                      }
                      isLoading={loading}
                      onClick={handleMint}
                    >
                      {canMint || pageLoading ? t('mint') : t('viewCollection')}
                    </Button>
                    {!userData?.wallet_address ? null : data.sales_stage !==
                      activeStep ? null : isSoldout ? (
                      <Text fontSize={'12px'}>{t('soldOut')}</Text>
                    ) : userMintData?.max_mint_count === 0 ? (
                      <Text fontSize={'12px'} align="center">
                        {t('noPermission')}
                      </Text>
                    ) : (
                      <Text fontSize={'12px'}>{`${
                        userMintData?.max_mint_count! -
                        userMintData?.mint_count!
                      } ${t('unminted')}`}</Text>
                    )}
                  </VStack>
                </VStack>
              </HStack>
            </Stack>
            <HStack
              pt="25px"
              borderTop="1px solid"
              sx={{
                borderImage:
                  'linear-gradient(243deg, rgba(111, 159, 243, 0.3), rgba(71, 56, 116, 0.3)) 1 1;',
              }}
              wrap={{ md: 'nowrap', base: 'wrap' }}
              spacing={{ md: '40px', base: 0 }}
            >
              {mintData.map((v, i) => (
                <VStack
                  key={i}
                  w={{ md: 'auto', base: '33%' }}
                  mb={{ md: 0, base: '20px!important' }}
                >
                  <Tooltip
                    label={
                      v.key === 'listed_rate'
                        ? `${data.mintData?.listed} ${t('listed')}`
                        : ''
                    }
                    placement="top"
                  >
                    <Box
                      fontSize={{ md: '28px', base: '18px' }}
                      lineHeight={{ md: '32px', base: '21px' }}
                      color="#9A9A9A"
                      pos="relative"
                    >
                      {v.value}
                      {v.key === 'listed_rate' || v.key === 'unique_owners'
                        ? '%'
                        : ''}
                      {v.key === 'floor' && !!data.mintData?.floor_rate && (
                        <Text
                          color={
                            data.mintData?.floor_rate! > 0
                              ? '#60FFE8'
                              : '#EA4747'
                          }
                          fontSize="14px"
                          lineHeight="16px"
                          pos="absolute"
                          top="3px"
                          right="-110px"
                          w="100px"
                        >
                          {`${data.mintData?.floor_rate! > 0 ? '+' : ''}${
                            data.mintData?.floor_rate
                          }%`}
                        </Text>
                      )}
                    </Box>
                  </Tooltip>

                  <Text
                    fontSize="md"
                    lineHeight="18px"
                    color="#5F5F5F"
                    whiteSpace="nowrap"
                  >
                    {t(v.label as any)}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </Box>
        </Box>
      </Box>
      <ListingModal ref={listingRef} />
    </>
  );
};
