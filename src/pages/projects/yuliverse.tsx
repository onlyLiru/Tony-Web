/* eslint-disable @next/next/no-page-custom-font */
import { ShimmerImage } from '@/components/Image';
import { Footer } from '@/components/PageLayout';
import CommonHead from '@/components/PageLayout/CommonHead';
// eslint-disable-next-line no-restricted-imports
import {
  BoxType,
  SaleStatus,
  useYuliverseMint,
} from '@/features/Activity/Yuliverse';
import { serverSideTranslations } from '@/i18n';
import { useUserDataValue } from '@/store';
import { getErrorMessage } from '@/utils/error';
import { AddIcon, createIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  SimpleGrid,
  Text,
  Tooltip,
  useMediaQuery,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { format } from 'date-fns';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { BsTwitter } from 'react-icons/bs';
import { MdAdd, MdRemove } from 'react-icons/md';

type UseStepperProps = {
  step?: number;
  min?: number;
  max?: number;
  initialValue?: number;
  disabled?: boolean;
};
const useStepper = (props?: UseStepperProps) => {
  const {
    step = 1,
    min = 1,
    initialValue = 1,
    max = Number.MAX_VALUE,
    disabled,
  } = props || {};
  const [value, setValue] = useState(initialValue);

  const getValidValue = (val?: number) => {
    if (val === undefined) return 0;
    if (val > max) return max;
    if (val < min) return min;
    return val;
  };

  const add = () => {
    if (disabled) return;
    setValue((prev) => {
      const next = prev + step;
      return getValidValue(next);
    });
  };

  const minus = () => {
    if (disabled) return;
    setValue((prev) => {
      const next = prev - step;
      return getValidValue(next);
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setValue(getValidValue(+e.target.value));
  };
  const onBlur = () => {
    if (disabled) return;
    setValue((prev) => getValidValue(prev));
  };

  return { value, mutate: setValue, minus, add, onChange, onBlur };
};

const WebsiteIcon = createIcon({
  displayName: 'Website Icon',
  viewBox: '0 0 40 40',
  defaultProps: {
    fill: 'none',
  },
  path: (
    <path
      d="M20 40C14.6957 40 9.60859 37.8929 5.85786 34.1421C2.10714 30.3914 0 25.3043 0 20C0 14.6957 2.10714 9.60859 5.85786 5.85786C9.60859 2.10714 14.6957 0 20 0C25.3043 0 30.3914 2.10714 34.1421 5.85786C37.8929 9.60859 40 14.6957 40 20C40 25.3043 37.8929 30.3914 34.1421 34.1421C30.3914 37.8929 25.3043 40 20 40ZM15.4187 35.3333C13.4458 31.1481 12.3029 26.6202 12.0533 22H4.12533C4.51463 25.0777 5.78935 27.9761 7.79464 30.343C9.79992 32.71 12.4495 34.4436 15.4213 35.3333H15.4187ZM16.0587 22C16.3627 26.88 17.7547 31.4587 20 35.504C22.3042 31.353 23.6499 26.7388 23.9387 22H16.0587ZM35.8747 22H27.9467C27.6962 26.6203 26.5524 31.1483 24.5787 35.3333C27.5505 34.4436 30.2001 32.71 32.2054 30.343C34.2106 27.9761 35.4854 25.0777 35.8747 22ZM4.12533 18H12.0533C12.304 13.3787 13.448 8.85333 15.4213 4.66667C12.449 5.55594 9.79886 7.2894 7.79307 9.65639C5.78728 12.0234 4.51216 14.922 4.12267 18H4.12533ZM16.0613 18H23.9387C23.6499 13.2611 22.3042 8.64702 20 4.496C17.6949 8.6468 16.3482 13.2609 16.0587 18H16.0613ZM24.5787 4.66667C26.5524 8.85169 27.6962 13.3797 27.9467 18H35.8747C35.4854 14.9223 34.2106 12.0239 32.2054 9.65698C30.2001 7.29002 27.5505 5.55638 24.5787 4.66667Z"
      fill="currentColor"
    />
  ),
});

const BscScanIcon = createIcon({
  displayName: 'BscScan Icon',
  viewBox: '0 0 48 48',
  defaultProps: {
    fill: 'none',
  },
  path: [
    <path
      key="d1"
      d="M9.97447 22.8147C9.97452 22.5463 10.0275 22.2805 10.1303 22.0327C10.2332 21.7848 10.3839 21.5598 10.5738 21.3704C10.7637 21.1811 10.989 21.0312 11.2369 20.9294C11.4848 20.8275 11.7503 20.7758 12.0182 20.777L15.4064 20.7881C15.9467 20.7881 16.4648 21.0031 16.8468 21.3858C17.2288 21.7686 17.4434 22.2877 17.4434 22.8289V35.666C17.825 35.5527 18.3134 35.4318 18.8509 35.305C19.2232 35.2173 19.555 35.0061 19.7925 34.7057C20.03 34.4053 20.1593 34.0333 20.1594 33.6501V17.7278C20.1594 17.1865 20.374 16.6674 20.756 16.2846C21.138 15.9018 21.6561 15.6867 22.1964 15.6866H25.5949C26.1352 15.6867 26.6533 15.9018 27.0353 16.2846C27.4173 16.6674 27.6319 17.1865 27.6319 17.7278V32.5063C27.6319 32.5063 28.4822 32.1616 29.3098 31.8113C29.6174 31.681 29.8799 31.4628 30.0645 31.184C30.2491 30.9052 30.3477 30.5781 30.3479 30.2435V12.6255C30.3479 12.0843 30.5625 11.5652 30.9444 11.1825C31.3263 10.7998 31.8443 10.5847 32.3845 10.5846H35.7795C36.3194 10.5852 36.837 10.8004 37.2186 11.1831C37.6002 11.5658 37.8145 12.0846 37.8145 12.6255V27.1333C40.7579 24.9962 43.7408 22.4256 46.108 19.3348C46.4514 18.8862 46.6787 18.3593 46.7695 17.8013C46.8603 17.2432 46.8118 16.6714 46.6284 16.1367C45.5326 12.9782 43.7908 10.0836 41.5144 7.63827C39.238 5.19292 36.4772 3.25062 33.4086 1.93563C30.3399 0.62065 27.0311 -0.0380465 23.6938 0.00169713C20.3565 0.0414408 17.0643 0.778747 14.0277 2.16644C10.9911 3.55413 8.27715 5.56164 6.05942 8.06051C3.84168 10.5594 2.16902 13.4946 1.14849 16.6783C0.127961 19.862 -0.217974 23.2241 0.132822 26.5494C0.483618 29.8747 1.52342 33.0901 3.18569 35.9897C3.4753 36.4899 3.90137 36.8969 4.41386 37.1629C4.92635 37.4289 5.50396 37.5428 6.07884 37.4913C6.72106 37.4347 7.52067 37.3546 8.47134 37.2429C8.8851 37.1957 9.26709 36.9977 9.54456 36.6866C9.82204 36.3755 9.97562 35.9731 9.97605 35.5558V22.8147"
      fill="#12161C"
    />,
    <path
      key="d2"
      d="M9.90234 43.4016C13.4809 46.0099 17.7099 47.5755 22.1214 47.9252C26.533 48.2749 30.9551 47.3951 34.8985 45.3831C38.8419 43.3711 42.1529 40.3053 44.4652 36.525C46.7775 32.7447 48.0009 28.3971 48.0001 23.9634C48.0001 23.4087 47.9744 22.8627 47.9376 22.3184C39.1731 35.4149 22.9903 41.5375 9.90234 43.4016Z"
      fill="#F0B90B"
    />,
  ],
});

const sites = {
  projext: 'https://www.yuliverse.com/',
  twitter: 'https://twitter.com/TheYuliverse',
  bscscan:
    'https://bscscan.com/address/0xe3CFa5B7eC6f3b72d648Ce6b4b7cD6bb3aaE8cd8',
  openBox: 'https://presale.yuliverse.com/sales/YuliMint',
};

const Characters = () => {
  return (
    <Box
      mt={{ base: '38px', md: '150px' }}
      pos="relative"
      mx="auto"
      w="full"
      fontFamily={'Josefin Sans'}
      color="white"
      maxW={{ base: 'full', md: '1230px' }}
    >
      <Heading
        textAlign={'center'}
        px="24px"
        mb={{ base: '20px', md: '70px' }}
        fontSize={{ base: '20px', md: '45px' }}
        fontWeight={700}
        fontFamily={'Josefin Sans'}
        textShadow={{
          base: 'rgba(255, 255, 255, 0.38) 0 3.5px 13px,rgba(161, 0, 255, 0.28) 0 3px 38px;',
          md: 'rgba(255, 255, 255, 0.38) 0 5px 18px,rgba(161, 0, 255, 0.28) 0 5px 52px;',
        }}
      >
        6 RARITIES OF YULIVERSE CHARACTERS
      </Heading>

      <SimpleGrid
        templateColumns={'1fr 1fr 1fr 1fr'}
        w="full"
        fontSize={{ base: '12px', md: '24px' }}
        color="#9999BE"
        textAlign={'center'}
        alignItems="center"
        lineHeight={'1em'}
        mb={{ base: '10px', md: '20px' }}
      >
        <Text></Text>
        <Text>ATTRIBUTE</Text>
        <Text>GROWTH REWARD</Text>
        <Text>BREED</Text>
      </SimpleGrid>
      <Box
        mx="auto"
        w={{ base: '356px', md: 'full' }}
        rounded={{ base: '10px', md: '18px' }}
        fontSize={{ base: '12px', md: '24px' }}
        fontWeight={700}
        overflow="hidden"
        textAlign="center"
        lineHeight={'1em'}
      >
        <SimpleGrid
          w="full"
          color="#D2D2E7"
          bg="#343968"
          h={{ base: '61px', md: '118px' }}
          px={{ base: '10px', md: '40px' }}
          templateColumns={'repeat(4, 1fr)'}
          spacing={{ base: '10px', md: '90px' }}
          alignItems="center"
        >
          <Center
            fontSize={{ base: '12px', md: '28px' }}
            justifyContent="flex-start"
          >
            COMMON
          </Center>
          <Center>Common Skills And Attributes</Center>
          <Center>12,500 ARG</Center>
          <Center>Chance To Get Normal Box</Center>
        </SimpleGrid>

        <SimpleGrid
          w="full"
          color="#49D0AB"
          bg="#22536D"
          h={{ base: '61px', md: '118px' }}
          px={{ base: '10px', md: '40px' }}
          templateColumns={'repeat(4, 1fr)'}
          spacing={{ base: '10px', md: '90px' }}
          alignItems="center"
        >
          <Center
            fontSize={{ base: '12px', md: '28px' }}
            justifyContent="flex-start"
          >
            UNCOMMON
          </Center>
          <Center>4 Times Stronger Than Common</Center>
          <Center>53,000 ARG</Center>
          <Center>Chance To Get Rare Box</Center>
        </SimpleGrid>

        <SimpleGrid
          w="full"
          color="#3CC4FF"
          bg="#284594"
          h={{ base: '61px', md: '118px' }}
          px={{ base: '10px', md: '40px' }}
          templateColumns={'repeat(4, 1fr)'}
          spacing={{ base: '10px', md: '90px' }}
          alignItems="center"
        >
          <Center
            fontSize={{ base: '12px', md: '28px' }}
            justifyContent="flex-start"
          >
            SUPERIOR
          </Center>
          <Center>4 Times Stronger Than Uncommon</Center>
          <Center>270,000 ARG</Center>
          <Center>Chance To Get Super Rare Box</Center>
        </SimpleGrid>

        <SimpleGrid
          w="full"
          color="#BC88FF"
          bg="#3D1989"
          h={{ base: '61px', md: '118px' }}
          px={{ base: '10px', md: '40px' }}
          templateColumns={'repeat(4, 1fr)'}
          spacing={{ base: '10px', md: '90px' }}
          alignItems="center"
        >
          <Center
            fontSize={{ base: '12px', md: '28px' }}
            justifyContent="flex-start"
          >
            EPIC
          </Center>
          <Center>4 Times Stronger Than Superior</Center>
          <Center>1,500,000 ARG</Center>
          <Center>Chance To Get Epic Box</Center>
        </SimpleGrid>

        <SimpleGrid
          w="full"
          color="#FFDB77"
          bg="#81542B"
          h={{ base: '61px', md: '118px' }}
          px={{ base: '10px', md: '40px' }}
          templateColumns={'repeat(4, 1fr)'}
          spacing={{ base: '10px', md: '90px' }}
          alignItems="center"
        >
          <Center
            fontSize={{ base: '12px', md: '28px' }}
            justifyContent="flex-start"
          >
            LEGENDARY
          </Center>
          <Center>4 Times Stronger Than Epic</Center>
          <Center>3,580,000 ARG</Center>
          <Center>Chance To Get Legendary Box</Center>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

const ScoreChart = () => {
  return (
    <Center
      fontFamily={'Josefin Sans'}
      fontSize={{ base: '10px', md: '16px' }}
      pos="relative"
      color="white"
      mt={{ base: '20px', md: '50px' }}
    >
      <Tooltip
        label="Team: anonymous team, but with successful related past experience"
        placement="top"
      >
        <Text
          pos="absolute"
          top={{ base: '-18px', md: '-28px' }}
          left="50%"
          transform={'translateX(-50%)'}
        >
          Team
        </Text>
      </Tooltip>
      <Tooltip
        label="Other factors: First of its kind, teams are active in community, discord vibe is active"
        placement="top"
      >
        <Text
          pos="absolute"
          top={{ base: '30px', md: '45px' }}
          right={{ base: '-105px', md: '-110px' }}
          w="100px"
          align="left"
        >
          Other Factors
        </Text>
      </Tooltip>
      <Tooltip label="Backers: influencers backed" placement="top">
        <Text
          pos="absolute"
          bottom={{ base: '-12px', md: '-32px' }}
          right={{ base: '-50px', md: '-60px' }}
          transform={'translateX(-50%)'}
        >
          Backers
        </Text>
      </Tooltip>
      <Tooltip label="Utilities：Return yield with ERC20 token" placement="top">
        <Text
          pos="absolute"
          bottom={{ base: '-12px', md: '-32px' }}
          left={{ base: '-10px', md: '-20px' }}
          transform={'translateX(-50%)'}
        >
          Utilities
        </Text>
      </Tooltip>
      <Tooltip label="Community: community size of over 15k" placement="top">
        <Text
          pos="absolute"
          top={{ base: '30px', md: '45px' }}
          left={{ base: '-38px', md: '-50px' }}
          transform={'translateX(-50%)'}
        >
          Community
        </Text>
      </Tooltip>
      <ShimmerImage
        w={{ base: '94px', md: '154px' }}
        h={{ base: '94px', md: '154px' }}
        src="/images/activity/yuliverse/score_chart.svg"
      />
    </Center>
  );
};

const Banner = () => {
  const { value: amount, add, minus, mutate, ...inputRest } = useStepper();
  const {
    saleTime,
    userBuyCount,
    isInWhitelist,
    saleStatus,
    mounted,
    totalSupplyNum,
    mintedNum,
    price,
    currentBox,
    setCurrentBox,
    mint,
    switchNetwork,
    needSwitchNetwork,
    isMinting,
  } = useYuliverseMint();

  const userData = useUserDataValue();

  const { openConnectModal } = useConnectModal();

  const toast = useToast();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  return (
    <Box
      mx="auto"
      maxW={{ base: 'full', md: '1920px' }}
      w="full"
      bgImage={{
        base: 'url(/images/activity/yuliverse/h5/bg_main.webp)',
        md: 'url(/images/activity/yuliverse/bg_main.webp)',
      }}
      h={{ base: '1224px', md: '1620px' }}
      bgSize="cover"
      bgRepeat="no-repeat"
      bgPosition="center bottom"
    >
      <Box
        pos="relative"
        h={{ base: '710px', md: '1000px' }}
        pt={{ base: '10px', md: '130px' }}
        mx="auto"
        w="full"
        maxW={{ base: '375px', md: '1710px' }}
        bgImage={{
          base: 'url(/images/activity/yuliverse/h5/banner_bg.webp)',
          md: 'url(/images/activity/yuliverse/people.webp)',
        }}
        bgSize={{ base: 'contain', md: 'cover' }}
        bgRepeat="no-repeat"
        bgPosition="bottom center"
      >
        <ShimmerImage
          onClick={() => {
            mutate(1);
            setCurrentBox(BoxType.GREEN);
          }}
          display={{
            base: currentBox === BoxType.GREEN ? 'block' : 'none',
            md: 'none',
          }}
          pos="absolute"
          left="0"
          bottom="56px"
          w="66px"
          h="42px"
          zIndex={2}
          src="/images/activity/yuliverse/h5/banner_arrow_left.webp"
          transform={`rotateY(${
            currentBox === BoxType.GREEN ? '0' : '180deg'
          })`}
        />
        <ShimmerImage
          onClick={() => {
            mutate(1);
            setCurrentBox(BoxType.GREEN);
          }}
          display={{
            base: currentBox === BoxType.GREEN ? 'none' : 'block',
            md: 'none',
          }}
          pos="absolute"
          left="0"
          bottom="56px"
          w="66px"
          h="42px"
          zIndex={2}
          src="/images/activity/yuliverse/h5/banner_arrow_right.webp"
          transform="rotateY(180deg)"
        />
        <ShimmerImage
          onClick={() => {
            mutate(1);
            setCurrentBox(BoxType.WHITE);
          }}
          display={{
            base: currentBox === BoxType.WHITE ? 'none' : 'block',
            md: 'none',
          }}
          pos="absolute"
          right="0"
          bottom="56px"
          w="66px"
          h="42px"
          zIndex={2}
          src="/images/activity/yuliverse/h5/banner_arrow_right.webp"
        />
        <ShimmerImage
          onClick={() => {
            mutate(1);
            setCurrentBox(BoxType.WHITE);
          }}
          display={{
            base: currentBox === BoxType.WHITE ? 'block' : 'none',
            md: 'none',
          }}
          pos="absolute"
          right="0"
          bottom="56px"
          w="66px"
          h="42px"
          zIndex={2}
          src="/images/activity/yuliverse/h5/banner_arrow_left.webp"
          transform="rotateY(180deg)"
        />

        <Box
          pos="relative"
          mx="auto"
          w="full"
          maxW={{ base: 'full', md: 'draft' }}
        >
          <ShimmerImage
            w={{ base: '375px', md: '630px' }}
            h="252px"
            placeholder="blur"
            src={
              isLargerThan768
                ? '/images/activity/yuliverse/logo2x.webp'
                : '/images/activity/yuliverse/h5/logo.webp'
            }
          />

          <Flex
            align={'center'}
            direction={{ base: 'column', md: 'row' }}
            pl={{ base: '0', md: '60px' }}
            mt={{ base: '-36px', md: '0' }}
          >
            <Flex
              display={{ base: 'none', md: 'flex' }}
              pos="relative"
              flexShrink={0}
              justify="center"
              w="100px"
              h="324px"
              direction={'column'}
              align="center"
              fontFamily={'Josefin Sans'}
              bgImage={'url(/images/activity/yuliverse/box_container_bg.png)'}
              bgSize="contain"
              bgRepeat="no-repeat"
              mt="30px"
              bgPosition="center"
            >
              <Flex
                onClick={() => {
                  mutate(1);
                  setCurrentBox(BoxType.WHITE);
                }}
                cursor={'pointer'}
                w="100px"
                h="100px"
                direction="column"
                bgImage={`url(/images/activity/yuliverse/${
                  currentBox === BoxType.WHITE
                    ? 'box_wrapper_ac'
                    : 'box_wrapper'
                }.png)`}
                bgSize="contain"
                bgRepeat="no-repeat"
                bgPosition="center"
                mb="10px"
                align={'center'}
                justify="center"
              >
                <ShimmerImage
                  w="66px"
                  h="66px"
                  placeholder="blur"
                  filter="grayscale(1)"
                  src="/images/activity/yuliverse/box.webp"
                />
                <Box
                  fontSize={'12px'}
                  fontWeight={700}
                  color="white"
                  opacity={currentBox === BoxType.WHITE ? 1 : 0.5}
                  lineHeight={'12px'}
                  mb="6px"
                >
                  Normal Box
                </Box>
              </Flex>

              <Flex
                onClick={() => {
                  setCurrentBox(BoxType.GREEN);
                }}
                cursor={'pointer'}
                w="100px"
                h="100px"
                direction="column"
                bgImage={`url(/images/activity/yuliverse/${
                  currentBox === BoxType.GREEN
                    ? 'box_wrapper_ac'
                    : 'box_wrapper'
                }.png)`}
                bgSize="contain"
                bgRepeat="no-repeat"
                bgPosition="center"
                align={'center'}
                justify="center"
              >
                <ShimmerImage
                  w="66px"
                  h="66px"
                  placeholder="blur"
                  src="/images/activity/yuliverse/box.webp"
                />
                <Box
                  opacity={currentBox === BoxType.GREEN ? 1 : 0.5}
                  fontSize={'12px'}
                  lineHeight={'12px'}
                  mb="6px"
                  fontWeight={700}
                  color="white"
                >
                  Rare Box
                </Box>
              </Flex>
            </Flex>

            <ShimmerImage
              ml={{ base: '0', md: '35px' }}
              flexShrink={0}
              w={{ base: '312px', md: '390px' }}
              h={{ base: '288px', md: '360px' }}
              transition="all 0.2s ease"
              filter={`grayscale(${currentBox === BoxType.WHITE ? 0.92 : 0})`}
              src="/images/activity/yuliverse/box_flash.webp"
            />

            <Flex
              mt={{ base: '-34px', md: 0 }}
              direction={'column'}
              w="200px"
              pl={{ base: '0', md: '10px' }}
            >
              <VStack
                w="full"
                spacing={{ base: '5px', md: '20px' }}
                fontSize={'14px'}
                color="white"
                mb={{ base: '10px', md: '28px' }}
              >
                <Flex w="full" align={'center'} justify="space-between">
                  <Box>Total Supply</Box>
                  <Box fontSize={'18px'} fontWeight={700}>
                    {totalSupplyNum}
                  </Box>
                </Flex>
                <Flex w="full" align={'center'} justify="space-between">
                  <Box>Minted</Box>
                  <Box fontSize={'18px'} fontWeight={700}>
                    {mintedNum}
                  </Box>
                </Flex>
                <Flex w="full" align={'center'} justify="space-between">
                  <Box>Price</Box>
                  <Box fontSize={'18px'} fontWeight={700}>
                    {+price}BUSD
                  </Box>
                </Flex>
                <Flex w="full" align={'center'} justify="space-between">
                  <Box>Amout</Box>
                  <Flex fontWeight={700} color="white" align={'center'}>
                    <MinusIcon
                      fontSize={'18px'}
                      as={MdRemove}
                      onClick={minus}
                      cursor="pointer"
                    />
                    <Input
                      type="number"
                      color="white"
                      bg="none"
                      w="62px"
                      rounded="full"
                      h="24]px"
                      border="1px solid"
                      textAlign={'center'}
                      fontWeight={700}
                      _focus={{ borderColor: 'white' }}
                      value={amount}
                      {...inputRest}
                    />
                    <AddIcon
                      fontSize={'18px'}
                      as={MdAdd}
                      onClick={add}
                      cursor="pointer"
                    />
                  </Flex>
                </Flex>
              </VStack>
              <Button
                disabled={
                  saleStatus === SaleStatus.Expired ||
                  saleStatus === SaleStatus.Soldout
                }
                isLoading={isMinting}
                fontFamily={'Josefin Sans'}
                fontSize="18px"
                fontWeight={700}
                color="white"
                bg="#595FDD"
                _hover={{
                  bg: '#4a50c4',
                }}
                w="full"
                rounded="full"
                onClick={async () => {
                  try {
                    if (!userData?.wallet_address) {
                      return openConnectModal?.();
                    }

                    if (needSwitchNetwork) {
                      await switchNetwork();
                      return toast({
                        status: 'success',
                        title: 'Switch successed!',
                      });
                    }

                    // if (
                    //   saleStatus !== SaleStatus.Mint &&
                    //   saleStatus !== SaleStatus.WhiteMint
                    // ) {
                    //   return toast({
                    //     status: 'warning',
                    //     title: `Sales time: ${format(
                    //       new Date(saleTime[0] * 1000),
                    //       'LLL d,yyy HH:mm',
                    //     )}`,
                    //   });
                    // }

                    // 白单mint阶段
                    if (saleStatus === SaleStatus.WhiteMint) {
                      // 非白单 无法mint
                      if (!isInWhitelist) {
                        toast({
                          status: 'warning',
                          title: "Sorry you're not on the white list",
                        });
                        return;
                      }
                      // 白单mint阶段，限制mint一次
                      if (userBuyCount > 0 || +amount > 1) {
                        toast({
                          status: 'warning',
                          title: 'Sorry, Exceed the purchase limit',
                        });
                        return;
                      }
                    }
                    await mint(currentBox, amount);
                    toast({ status: 'success', title: 'Mint successed!' });
                  } catch (error) {
                    if (!error.message) return;
                    toast({ status: 'error', title: getErrorMessage(error) });
                  }
                }}
              >
                {needSwitchNetwork && mounted && userData?.wallet_address
                  ? 'Switch to BSC'
                  : saleStatus}
              </Button>
            </Flex>
          </Flex>

          <Flex
            mt={{ base: '68px', md: '250px' }}
            justify="center"
            align={'center'}
            fontFamily={'Josefin Sans'}
            color="white"
            direction={{ base: 'column', md: 'row' }}
          >
            <Flex
              w={{ base: '295px', md: '590px' }}
              h={{ base: '201px', md: '424px' }}
              mr={{ base: 0, md: '50px' }}
              mb={{ base: '42px', md: 0 }}
              align={'center'}
              bgImage="url(/images/activity/yuliverse/box_frame.png)"
              bgSize="contain"
              bgRepeat="no-repeat"
              bgPosition="center"
              direction={'column'}
            >
              <Box
                py={{ base: '8px', md: '20px' }}
                fontSize={{ base: '19px', md: '38px' }}
                fontWeight={700}
              >
                Collection Score
              </Box>

              <ScoreChart />
            </Flex>
            <Flex
              align={'center'}
              w={{ base: '295px', md: '590px' }}
              h={{ base: '201px', md: '424px' }}
              bgImage="url(/images/activity/yuliverse/box_frame.png)"
              bgSize="contain"
              bgRepeat="no-repeat"
              bgPosition="center"
              direction={'column'}
            >
              <Box
                py={{ base: '8px', md: '20px' }}
                fontSize={{ base: '19px', md: '38px' }}
                fontWeight={700}
              >
                Social Links
              </Box>
              <Flex direction={'column'} align="center">
                <HStack
                  spacing={{ base: '20px', md: '30px' }}
                  mt={{ base: '10px', md: '40px' }}
                  mb={{ base: '30px', md: '80px' }}
                >
                  <NextLink passHref href={sites.projext}>
                    <a target="_blank">
                      <WebsiteIcon
                        w={{ base: '30px', md: '40px' }}
                        h={{ base: '30px', md: '40px' }}
                        color="white"
                      />
                    </a>
                  </NextLink>
                  <NextLink passHref href={sites.bscscan}>
                    <a target="_blank">
                      <BscScanIcon
                        w={{ base: '30px', md: '40px' }}
                        h={{ base: '30px', md: '40px' }}
                      />
                    </a>
                  </NextLink>
                  <NextLink passHref href={sites.twitter}>
                    <a target="_blank">
                      <Icon
                        display={'block'}
                        as={BsTwitter}
                        w={{ base: '30px', md: '40px' }}
                        h={{ base: '30px', md: '40px' }}
                        color="#4285F4"
                      />
                    </a>
                  </NextLink>
                </HStack>
                <NextLink passHref href={sites.openBox}>
                  <a target="_blank">
                    <Button
                      w={{ base: '180px', md: '240px' }}
                      h={{ base: '42px', md: '60px' }}
                      rounded="10px"
                      bg="#595FDD"
                      _hover={{
                        bg: '#4a50c4',
                      }}
                      color="white"
                      fontSize={{ base: '16px', md: '24px' }}
                    >
                      Open Mystery Box
                    </Button>
                  </a>
                </NextLink>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default function YuliversePage() {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  return (
    <>
      <CommonHead title="Yuliverse Mystery Box NFT" />
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Courier+Prime&family=Josefin+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Box bg="#393885" minH="100vh">
        <Banner />

        <Box
          mx="auto"
          maxW={{ base: 'full', md: '1920px' }}
          w="full"
          bgImage={{
            base: 'url(/images/activity/yuliverse/h5/bg_main_2.webp)',
            md: 'url(/images/activity/yuliverse/bg_main_2.webp)',
          }}
          h={{ base: '1027px', md: '2477px' }}
          bgSize="cover"
          bgRepeat="no-repeat"
          bgPosition="center bottom"
          pt={{ base: '46px', md: '170px' }}
        >
          <Box
            pos="relative"
            mx="auto"
            w="full"
            fontFamily={'Josefin Sans'}
            color="white"
            maxW={{ base: 'full', md: 'draft' }}
          >
            <Flex
              mx="auto"
              bgImage={{
                base: 'url(/images/activity/yuliverse/h5/normal_box_board.webp)',
                md: 'url(/images/activity/yuliverse/normal_box_board.webp)',
              }}
              maxW={{ base: 'full', md: '1154px' }}
              w="full"
              h={{ base: '222px', md: '550px' }}
              bgSize="cover"
              bgRepeat="no-repeat"
              bgPosition="center"
              justify={'space-between'}
              align="center"
              pl={{ base: '24px', md: '162px' }}
              pr={{ base: 0, md: '88px' }}
            >
              <Flex direction="column" align={'center'}>
                <Text
                  mb={{ base: '5px', md: '10px' }}
                  fontSize={{ base: '26px', md: '56px' }}
                  fontWeight={700}
                  lineHeight="1em"
                  textShadow={{
                    base: 'rgba(255, 255, 255, 0.38) 0 2px 9px,rgba(161, 0, 255, 0.28) 0 2px 22px;',
                    md: 'rgba(255, 255, 255, 0.38) 0 5px 18px,rgba(161, 0, 255, 0.28) 0 5px 52px;',
                  }}
                >
                  Normal Box
                </Text>
                <Box
                  pt={{ base: '4px', md: '5px' }}
                  mb={{ base: 0, md: '50px' }}
                  bgImage="url(/images/activity/yuliverse/normal_box_content_bg.png)"
                  w={{ base: '152px', md: '342px' }}
                  h={{ base: '92px', md: '148px' }}
                  bgSize="100% 100%"
                  bgRepeat="no-repeat"
                  bgPosition="center"
                  textAlign={'center'}
                >
                  <Text
                    fontSize={{ base: '18px', md: '30px' }}
                    fontWeight={700}
                  >
                    Drop rate
                  </Text>
                  <VStack
                    mt={{ base: '5px', md: '10px' }}
                    px={{ base: '8px', md: '20px' }}
                    w="full"
                    fontSize={{ base: '16px', md: '24px' }}
                    spacing="0px"
                  >
                    <Flex w="full" align={'center'} justify="space-between">
                      <Text>Common</Text>
                      <Text>95%</Text>
                    </Flex>
                    <Flex
                      w="full"
                      color="#4DD6B0"
                      align={'center'}
                      justify="space-between"
                    >
                      <Text>Uncommon</Text>
                      <Text>5%</Text>
                    </Flex>
                  </VStack>
                </Box>
              </Flex>

              <ShimmerImage
                display={{ base: 'none', md: 'block' }}
                flexShrink={0}
                w="398px"
                h="398px"
                src="/images/activity/yuliverse/magic_normal_box.webp"
              />
            </Flex>

            <Flex
              mx="auto"
              bgImage={{
                base: 'url(/images/activity/yuliverse/h5/rare_box_board.webp)',
                md: 'url(/images/activity/yuliverse/rare_box_board.webp)',
              }}
              maxW={{ base: 'full', md: '1154px' }}
              w="full"
              h={{ base: '222px', md: '550px' }}
              bgSize="cover"
              bgRepeat="no-repeat"
              bgPosition="center"
              justify={{ base: 'flex-end', md: 'space-between' }}
              align="center"
              pl={{ base: 0, md: '84px' }}
              pr={{ base: '24px', md: '164px' }}
            >
              <ShimmerImage
                flexShrink={0}
                display={{ base: 'none', md: 'block' }}
                w="398px"
                h="398px"
                src="/images/activity/yuliverse/magic_box.webp"
              />

              <Flex direction="column" align={'center'}>
                <Text
                  mb={{ base: '5px', md: '10px' }}
                  fontSize={{ base: '26px', md: '56px' }}
                  fontWeight={700}
                  lineHeight="1em"
                  textShadow={{
                    base: 'rgba(255, 255, 255, 0.38) 0 2px 9px,rgba(161, 0, 255, 0.28) 0 2px 22px;',
                    md: 'rgba(255, 255, 255, 0.38) 0 5px 18px,rgba(161, 0, 255, 0.28) 0 5px 52px;',
                  }}
                >
                  Rare Box
                </Text>
                <Box
                  pt={{ base: '4px', md: '5px' }}
                  mb={{ base: 0, md: '50px' }}
                  bgImage="url(/images/activity/yuliverse/rare_box_content_bg.png)"
                  w={{ base: '152px', md: '342px' }}
                  h={{ base: '116px', md: '182px' }}
                  bgSize="100% 100%"
                  bgRepeat="no-repeat"
                  bgPosition="center"
                  textAlign={'center'}
                >
                  <Text
                    fontSize={{ base: '18px', md: '30px' }}
                    fontWeight={700}
                  >
                    Drop rate
                  </Text>
                  <VStack
                    mt={{ base: '5px', md: '10px' }}
                    px={{ base: '8px', md: '20px' }}
                    w="full"
                    fontSize={{ base: '16px', md: '24px' }}
                    spacing="0px"
                  >
                    <Flex w="full" align={'center'} justify="space-between">
                      <Text>Common</Text>
                      <Text>10%</Text>
                    </Flex>
                    <Flex
                      w="full"
                      color="#4DD6B0"
                      align={'center'}
                      justify="space-between"
                    >
                      <Text>Uncommon</Text>
                      <Text>85%</Text>
                    </Flex>
                    <Flex
                      w="full"
                      color="#4DD6B0"
                      align={'center'}
                      justify="space-between"
                    >
                      <Text>Superior</Text>
                      <Text>5%</Text>
                    </Flex>
                  </VStack>
                </Box>
              </Flex>
            </Flex>
          </Box>

          <Characters />
        </Box>

        <Box mt={{ base: '-54px', md: '-114px' }}>
          {isLargerThan768 ? (
            <>
              <ShimmerImage
                mx="auto"
                maxW={'1920px'}
                w="full"
                h="1372px"
                src="/images/activity/yuliverse/examples_1.webp"
                objectFit="cover"
              />
              <ShimmerImage
                mx="auto"
                maxW={'1920px'}
                w="full"
                h="1372px"
                src="/images/activity/yuliverse/examples_2.webp"
                objectFit="cover"
              />
            </>
          ) : (
            <>
              <ShimmerImage
                mx="auto"
                maxW="375px"
                w="full"
                h="975px"
                src="/images/activity/yuliverse/h5/examples_1.webp"
                objectFit="cover"
              />
              <ShimmerImage
                mx="auto"
                maxW="375px"
                w="full"
                h="990px"
                src="/images/activity/yuliverse/h5/examples_2.webp"
                objectFit="cover"
              />
            </>
          )}
        </Box>
      </Box>
      <Footer bg="#000" />
    </>
  );
}
import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext) {
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
      messages: await serverSideTranslations(locale, ['hz']),
    },
  };
}
