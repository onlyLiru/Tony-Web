import Image from '@/components/Image';
import {
  Box,
  Center,
  Flex,
  Heading,
  Image as ChakraImage,
  Link,
  SimpleGrid,
  Text,
  Tooltip,
  useMediaQuery,
} from '@chakra-ui/react';
import React from 'react';
import { PageInfoContext } from '../context';
import { useTranslations } from 'next-intl';

type EventItemProps = {
  id: number;
  date: string;
  title: string;
  link?: string;
  embed?: string;
  arrow?: React.ReactNode;
};

const eventItems: EventItemProps[] = [
  {
    id: 0,
    date: '6.4',
    title: '花泽香菜官宣',
    link: 'https://twitter.com/hanazawa_staff/status/1532965353097416704',
    arrow: (
      <ChakraImage
        src="/images/activity/hanazawa/tabs/dashboard_arrow_right.png"
        pos="absolute"
        top="31px"
        left="85px"
        w="283px"
      />
    ),
  },
  {
    id: 1,
    date: '6.24',
    title: '花泽香菜本人助力',
    link: 'https://twitter.com/UNE_METAVERSE/status/1540232199667982336',
    arrow: (
      <ChakraImage
        src="/images/activity/hanazawa/tabs/dashboard_arrow_right.png"
        pos="absolute"
        top="31px"
        left="85px"
      />
    ),
  },
  {
    id: 2,
    date: '8.24',
    title: '@cryptosimeji 合作',
    link: 'https://twitter.com/Cryptosimeji/status/1562391657513111553',
    arrow: (
      <ChakraImage
        src="/images/activity/hanazawa/tabs/dashboard_arrow_right_conner.png"
        pos="absolute"
        top="31px"
        left="85px"
      />
    ),
  },
  {
    id: 3,
    date: '9.26',
    title: '@CheersUp_NF 合作',
    link: 'https://twitter.com/CheersUP_NFT/status/1574370139570667520',
    arrow: (
      <ChakraImage
        src="/images/activity/hanazawa/tabs/dashboard_arrow_left_conner.png"
        pos="absolute"
        top="31px"
        left="-62px"
      />
    ),
  },
  {
    id: 4,
    date: '9.19',
    title: '@karafuruNFT',
    link: 'https://twitter.com/hanazawa_nft/status/1571707409110028288',
    arrow: (
      <ChakraImage
        src="/images/activity/hanazawa/tabs/dashboard_arrow_left.png"
        pos="absolute"
        top="31px"
        right="250px"
      />
    ),
  },
  {
    id: 5,
    date: '9.12',
    title: 'Simeji 键盘合作',
    link: 'https://twitter.com/hanazawa_staff/status/1569325244154003456',
    arrow: (
      <ChakraImage
        src="/images/activity/hanazawa/tabs/dashboard_arrow_left.png"
        pos="absolute"
        top="31px"
        right="250px"
      />
    ),
  },
  {
    id: 6,
    date: '10.1 ',
    title: 'Twitter粉丝达到5万',
    link: 'https://twitter.com/hanazawa_staff/status/1532965353097416704',
    arrow: (
      <ChakraImage
        src="/images/activity/hanazawa/tabs/dashboard_arrow_right.png"
        pos="absolute"
        top="31px"
        left="85px"
      />
    ),
  },
  {
    id: 7,
    date: '10.4',
    title: '宣布花泽香菜pass卡功能',
    link: 'https://twitter.com/hanazawa_nft/status/1577274835604209666?s=46&t=xFmRfx7QX7yOCymAScrbQA',
    arrow: (
      <ChakraImage
        src="/images/activity/hanazawa/tabs/dashboard_arrow_right.png"
        pos="absolute"
        top="31px"
        left="85px"
      />
    ),
  },
  {
    id: 8,
    date: '10.8',
    title: '@MindblowonNFT 合作',
    link: 'https://twitter.com/MindblowonNFT/status/1578762451176558593',
  },
];

const DashboradMainChart = () => {
  const t = useTranslations('hz');
  return (
    <Box pos="relative">
      <Tooltip label={t('teamTip')} placement="top">
        <Text
          color="#838383"
          fontSize={'14px'}
          pos="absolute"
          top="-28px"
          left="50%"
          transform={'translateX(-50%)'}
        >
          {t('team')}
        </Text>
      </Tooltip>
      <Tooltip label={t('otherFactorsTip')} placement="top">
        <Text
          color="#838383"
          fontSize={'14px'}
          pos="absolute"
          top="45px"
          right="-102px"
          w="100px"
          align="left"
        >
          {t('otherFactors')}
        </Text>
      </Tooltip>
      <Tooltip label={t('backersTip')} placement="top">
        <Text
          color="#838383"
          fontSize={'14px'}
          pos="absolute"
          bottom="-32px"
          right="-25px"
          transform={'translateX(-50%)'}
        >
          {t('backers')}
        </Text>
      </Tooltip>
      <Tooltip label={t('utilitiesTip')} placement="top">
        <Text
          color="#838383"
          fontSize={'14px'}
          pos="absolute"
          bottom="-32px"
          left="12px"
          transform={'translateX(-50%)'}
        >
          {t('utilities')}
        </Text>
      </Tooltip>
      <Tooltip label={t('communityTip')} placement="top">
        <Text
          color="#838383"
          fontSize={'14px'}
          pos="absolute"
          top="45px"
          left="-40px"
          transform={'translateX(-50%)'}
        >
          {t('community')}
        </Text>
      </Tooltip>
      <ChakraImage
        w="154px"
        src="/images/activity/hanazawa/tabs/dashboard_main_chart.svg"
      />
    </Box>
  );
};

export default function TabDashboard() {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const {
    data: { blueChip },
  } = React.useContext(PageInfoContext);
  const t = useTranslations('hz');

  return (
    <>
      <SimpleGrid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        spacing={{ base: '20px', md: '40px' }}
        mb={{ base: '20px', md: '40px' }}
      >
        <Box
          bgColor="rgba(255,255,255,0.05)"
          borderRadius={'8px'}
          p={{ base: '20px', md: '50px 34px' }}
        >
          <Heading
            display={'flex'}
            fontWeight={'semibold'}
            fontSize={{ base: '18px', md: '28px' }}
            as="h2"
          >
            <Tooltip label={t('collectionScoreTip')} placement="top">
              {t('collectionScore')}
            </Tooltip>
            <ChakraImage
              ml="10px"
              w="22px"
              h="auto"
              src="/images/activity/hanazawa/tabs/dashboard_diamond.svg"
            />
          </Heading>
          <Flex
            justify={{ base: 'center', md: 'flex-end' }}
            p={{ base: '40px 0', md: '30px 96px 45px 0' }}
          >
            <DashboradMainChart />
          </Flex>
        </Box>
        <Box
          bgColor="rgba(255,255,255,0.05)"
          borderRadius={'8px'}
          p={{ base: '20px', md: '50px 34px' }}
        >
          <Heading
            display={'flex'}
            fontWeight={'semibold'}
            fontSize={{ base: '18px', md: '28px' }}
            as="h2"
          >
            {t('blueChipPotential')}
            <ChakraImage
              ml="10px"
              w="22px"
              h="auto"
              src="/images/activity/hanazawa/tabs/dashboard_line_chart.svg"
            />
          </Heading>
          <SimpleGrid
            mt={{ base: '40px', md: '50px' }}
            pl={{ base: '26px', md: 0 }}
            spacing={{ base: '36px', md: '50px' }}
            templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          >
            <Flex direction={'column'}>
              <Text fontSize={'16px'} mb={{ base: '0', md: '30px' }}>
                {t('blueChipHolders')}
              </Text>
              <Flex align={'center'}>
                <Text fontSize={'32px'} fontWeight="semibold" mr={'20px'}>
                  {blueChip?.holders}
                </Text>
                {!!blueChip?.holder_up_rate && (
                  <Text
                    fontSize={'14px'}
                    fontWeight="bold"
                    color={
                      blueChip?.holder_up_rate! > 0 ? '#60FFE8' : '#EA4747'
                    }
                  >
                    {`${blueChip?.holder_up_rate! > 0 ? '+' : ''}${
                      blueChip?.holder_up_rate
                    }%`}
                  </Text>
                )}
              </Flex>
              <Text fontSize={'14px'} color="#838383" mt={'4px'}>
                {t('holding')} {blueChip?.total_holders}({blueChip?.holder_rate}
                %) NFTS
              </Text>
            </Flex>
            <Flex
              direction={'column'}
              pl={{ base: 0, md: '50px' }}
              borderLeft={{
                base: 'none',
                md: '2px dashed rgba(255,255,255,.6)',
              }}
            >
              <Text fontSize={'16px'} mb={{ base: '0', md: '30px' }}>
                {t('whales')}
              </Text>
              <Flex align={'center'}>
                <Text fontSize={'32px'} fontWeight="semibold" mr={'20px'}>
                  {blueChip?.whales}
                </Text>
                {!!blueChip?.whales_up_rate && (
                  <Text
                    fontSize={'14px'}
                    fontWeight="bold"
                    color={
                      blueChip?.whales_up_rate! > 0 ? '#60FFE8' : '#EA4747'
                    }
                  >
                    {`${blueChip?.whales_up_rate! > 0 ? '+' : ''}${
                      blueChip?.whales_up_rate
                    }%`}
                  </Text>
                )}
              </Flex>
              <Text fontSize={'14px'} color="#838383" mt={'4px'}>
                {t('holding')} {blueChip?.total_whales}({blueChip?.whales_rate}
                %) NFTS
              </Text>
            </Flex>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
      <Box
        bgColor="rgba(255,255,255,0.05)"
        borderRadius={'8px'}
        p={{ base: '20px 20px 50px', md: '50px 34px' }}
        w="full"
      >
        <Heading
          display={'flex'}
          fontWeight={'semibold'}
          fontSize={{ base: '18px', md: '28px' }}
          as="h2"
        >
          {t('majorEvents')}
          <ChakraImage
            ml="10px"
            w="22px"
            h="auto"
            src="/images/activity/hanazawa/tabs/dashboard_location.svg"
          />
        </Heading>
        <Box pl={{ base: '14px', md: 0 }} w="full">
          <SimpleGrid
            mt={{ base: '30px', md: '42px' }}
            p={{ base: '0 0 0 20px', md: '0 62px' }}
            templateColumns={{ base: '1fr', md: 'repeat(3, 240px)' }}
            justifyContent="space-between"
            borderLeft={{ base: '1px  dashed #979797', md: 'none' }}
          >
            {eventItems.map((el, idx) => (
              <Flex
                pos="relative"
                mb={idx === eventItems.length - 1 ? 0 : '30px'}
                direction={'column'}
                key={idx}
              >
                <Center
                  mb="20px"
                  bgImage={{
                    base: '/images/activity/hanazawa/tabs/dashboard_event_item_bg_h5.svg',
                    md: '/images/activity/hanazawa/tabs/dashboard_event_item_bg.svg',
                  }}
                  bgSize="cover"
                  w={{ base: '28px', md: '74px' }}
                  h={{ base: '28px', md: '74px' }}
                  color="#6585D3"
                  fontSize={'18px'}
                  fontWeight="bold"
                  pos={{ base: 'absolute', md: 'relative' }}
                  top={{ base: '-5px', md: '0' }}
                  left={{ base: '-35px', md: '0' }}
                >
                  {isLargerThan768 ? el.date : null}
                </Center>
                <Link
                  zIndex={2}
                  display={'block'}
                  target="_blank"
                  href={el.link}
                >
                  <Heading
                    as="h4"
                    display={'flex'}
                    mb="16px"
                    fontWeight={'normal'}
                    fontSize={{ base: '12px', md: '18px' }}
                    whiteSpace="nowrap"
                  >
                    {!isLargerThan768 && <Text mr="24px">{el.date}</Text>}
                    {[...t.raw('majorEventsTitle')][idx]}
                    <ChakraImage
                      ml="10px"
                      w={{ base: '8px', md: '10px' }}
                      h="auto"
                      src="/images/activity/hanazawa/tabs/dashboard_event_item_link.svg"
                    />
                  </Heading>
                  <Box
                    w={{ base: '266px', md: '240px' }}
                    h={{ base: '177px', md: '160px' }}
                    p="1px"
                    borderRadius={'8px'}
                    bg="linear-gradient(to bottom, #6F9FF3, #473874)"
                  >
                    <Center
                      w="full"
                      h="full"
                      borderRadius={'8px'}
                      bgColor="#272938"
                      p="10px"
                    >
                      <Image
                        maxW="100%"
                        maxH="100%"
                        objectFit={'contain'}
                        src={`/images/activity/hanazawa/tabs/dashboard_tweet_${
                          idx + 1
                        }.png`}
                        fallbackSrc={undefined}
                        fallback={<Image.SkeletonFallback />}
                      />
                    </Center>
                  </Box>
                </Link>
                {isLargerThan768 && el.arrow}
              </Flex>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
}
