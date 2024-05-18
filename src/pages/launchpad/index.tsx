import {
  Center,
  Box,
  Text,
  Image as ChakraImage,
  Flex,
  Heading,
  HStack,
  Button,
  ButtonGroup,
  Icon,
  SimpleGrid,
  useMediaQuery,
  FlexProps,
  useToast,
} from '@chakra-ui/react';
import { serverSideTranslations } from '@/i18n';
import type { GetServerSidePropsContext } from 'next';
import 'keen-slider/keen-slider.min.css';
import { ShimmerImage, ShimmerImageProps } from '@/components/Image';
import { FiArrowUpRight } from 'react-icons/fi';
import { useRequest } from 'ahooks';
import * as launchpadApis from '@/services/launchpad';
import { useUrlState } from '@/hooks/useUrlState';
import Link from 'next/link';
import { Skeleton } from '@/components/Skeleton';
import { useTranslations } from 'next-intl';
import CountDown from '@/components/CountDown';
import { Footer } from '@/components/PageLayout';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { staticChainId } from '@/store';
import { headerMdHeight } from '@/components/PageLayout/Header';
import { bsc } from 'wagmi/chains';
import { GetUUU } from '@/features/Home';

const PLATFORM_TYPE = {
  1: '/images/launchpad/eth.svg',
  2: '/images/launchpad/bsc.svg',
} as const;

const LaunchpadItem = ({
  item,
  ...props
}: { item: launchpadApis.ApiLaunchpad.ListItem } & FlexProps) => {
  const t = useTranslations('launchpad');
  const renderContent = () => (
    <Flex
      as={!!item.name ? 'a' : undefined}
      bg="linear-gradient(94.85deg, #FBFBFC 0%, rgba(245, 244, 247, 0.5) 113.72%);"
      border="1px solid"
      borderColor={'rgba(0, 0, 0, 0.05)'}
      rounded={{ base: '12px', md: '14px' }}
      p={{ base: '12px 7px', md: '15px' }}
      pos="relative"
      {...props}
    >
      <Center
        top="0"
        right={{ base: '16px', md: '68px' }}
        pos="absolute"
        px={{ base: '10px', md: '20px' }}
        h={{ base: '25px', md: '50px' }}
        boxShadow={{
          base: 'none',
          md:
            item.sale_status === 1
              ? '0px 10px 20px rgba(118, 109, 246, 0.3);'
              : 'none',
        }}
        borderRadius={{ base: '0px 0px 4px 4px', md: '0px 0px 8px 8px' }}
        bg={item.sale_status === 1 ? '#766DF6' : '#C4C4C4'}
        fontWeight={500}
        fontSize={{ base: '10px', md: '18px' }}
        color="white"
      >
        {t.raw('status')[item.sale_status]}
      </Center>
      <Flex
        direction={{ base: 'row', md: 'column' }}
        align="center"
        pos="absolute"
        bottom={{ base: '12px', md: '30px' }}
        right={{ base: '16px', md: '36px' }}
      >
        {item.sale_status === 0 && (
          <Box
            mb={{ base: '0', md: '18px' }}
            mr={{ base: '8px', md: '0' }}
            fontSize={{ base: '12px', md: '16px' }}
            color="#7B7886"
          >
            <CountDown time={item.end_time * 1000} format="DD days HH:mm:ss" />
          </Box>
        )}

        <Button
          rounded="6px"
          px={{ base: '8px', md: '16px' }}
          minW={{ base: '96px', md: '140px' }}
          h={{ base: '28px', md: '48px' }}
          fontFamily="PingFang HK"
          fontSize={{ base: '12px', md: '18px' }}
          fontWeight={600}
          variant="primary"
          bg={item.sale_status === 1 ? 'primary.main' : '#8C8C96 !important'}
          rightIcon={
            <Icon
              as={FiArrowUpRight}
              color="white"
              w={{ base: '14px', md: '20px' }}
            />
          }
        >
          <Text mr={{ base: '8px', md: '12px' }}>{t('joinNow')}</Text>
          <Box
            w="1px"
            h={{ base: '12px', md: '24px' }}
            bg="#f0e7f5"
            pos="relative"
            opacity={0.5}
          >
            <Box
              pos="absolute"
              top="0"
              left="-1px"
              w="3px"
              h="3px"
              rounded="full"
              bg="#f0e7f5"
            />
            <Box
              pos="absolute"
              bottom="0"
              left="-1px"
              w="3px"
              h="3px"
              rounded="full"
              bg="#f0e7f5"
            />
          </Box>
        </Button>
      </Flex>
      <ShimmerImage
        border="1px solid"
        borderColor={'rgba(0, 0, 0, 0.05)'}
        rounded={{ base: '12px', md: '16px' }}
        w={{ base: '100px', md: '250px' }}
        h={{ base: '100px', md: '250px' }}
        flexShrink={0}
        src={item.img_url}
        placeholder="blur"
        objectFit="cover"
      />
      <Flex
        direction={'column'}
        flexGrow={1}
        justify={{ base: 'flex-start', md: 'flex-start' }}
        pl={{ base: '8px', md: '38px' }}
        pr={{ base: '68px', md: '300px' }}
        pt={{ base: '10px', md: '24px' }}
        pb="25px"
      >
        <Flex direction={'column'}>
          <Heading
            display="inline-flex"
            flexWrap="wrap"
            color="#000"
            alignItems="center"
            fontWeight={600}
            mb={{ base: '8px', md: '20px' }}
            fontSize={{ base: '12px', md: '22px' }}
          >
            {item.title}
            <ChakraImage
              ml={{ base: '5px', md: '16px' }}
              w={{ base: '12px', md: '24px' }}
              h="auto"
              src={PLATFORM_TYPE?.[item.type]}
            />
          </Heading>

          <ButtonGroup spacing={{ base: '8px', md: '12px' }}>
            {item.labels?.map((el, i) => (
              <Button
                key={i}
                fontWeight={400}
                fontFamily="PingFang HK"
                h={{ base: '24px', md: '32px' }}
                fontSize={{ base: '12px', md: '14px' }}
                border={{ base: 'none', md: '1px solid' }}
                px={{ base: 0, md: 5 }}
                minW={{ base: 0, md: 8 }}
                color={el.color}
                borderColor={el.color}
                cursor="default"
                size="sm"
                variant={'outline'}
                bg="none"
                rounded="6px"
              >
                {el.name}
              </Button>
            ))}
          </ButtonGroup>
        </Flex>
        <Box
          display={{ base: 'none', md: 'block' }}
          mt="38px"
          fontSize={'14px'}
          color="#7b7886"
          lineHeight={'30px'}
        >
          {item.desc}
        </Box>
      </Flex>
    </Flex>
  );
  return !!item.name ? (
    // 临时方案：只针对teamz做跳转路径的修改
    <Link
      passHref
      href={
        item?.name?.toLowerCase() === 'teamz'
          ? '/teamz'
          : `/projects/${item.name}`
      }
    >
      {renderContent()}
    </Link>
  ) : (
    renderContent()
  );
};

const Placeholder = (props: FlexProps) => {
  return (
    <Flex
      bg="white"
      rounded={{ base: '12px', md: '14px' }}
      p={{ base: '12px 7px', md: '15px' }}
      pos="relative"
      {...props}
    >
      <Skeleton
        rounded={{ base: '12px', md: '16px' }}
        w={{ base: '100px', md: '250px' }}
        h={{ base: '100px', md: '250px' }}
        flexShrink={0}
      />
      <Flex
        direction={'column'}
        flexGrow={1}
        justify={{ base: 'flex-start', md: 'space-between' }}
        pl={{ base: '8px', md: '38px' }}
        pr={{ base: '68px', md: '300px' }}
        pt={{ base: '10px', md: '24px' }}
        pb="25px"
      >
        <Flex direction={'column'}>
          <Skeleton.Title />
          <HStack spacing={{ base: '8px', md: '12px' }}>
            <Skeleton.Text w={{ base: '48px', md: '90px' }} />
            <Skeleton.Text w={{ base: '48px', md: '90px' }} />
          </HStack>
        </Flex>
      </Flex>
    </Flex>
  );
};

enum QueryType {
  All = '0',
  ETH = '1',
  BSC = '2',
}

const FilterBtns = [
  { text: 'ALL', value: QueryType.All },
  { text: 'ETH', value: QueryType.ETH },
  { text: 'BSC', value: QueryType.BSC },
];

type QueryValue = {
  type?: QueryType;
};

export default function Launchpad({ lauchpadData }: any) {
  const t = useTranslations('launchpad');
  const ct = useTranslations('common');
  const toast = useToast();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [state, setState] = useUrlState<QueryValue>({
    type: QueryType.All,
  });
  const [launchpadList, setLauchPadList] = useState([
    ...lauchpadData.launchpad_list,
  ]);
  const [loading, setLoading] = useState(false);
  const { locale } = useRouter();
  // const { data, loading, runAsync } = useRequest(launchpadApis.list, {
  //   defaultParams: [{ type: state.type }],
  //   refreshDeps: [locale],
  // });
  // 获取白名单
  const fetchLanuchpadList = async () => {
    try {
      setLoading(true);
      const { data } = await launchpadApis.list({
        type: state.type,
      });
      setLauchPadList(data.launchpad_list);
      setLoading(false);
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  // web端
  const { data: hqpListWebData } = useRequest(launchpadApis.hqpList, {
    defaultParams: [{ platform: 1 }],
  });
  // 移动端
  const { data: hqpListMobileData } = useRequest(launchpadApis.hqpList, {
    defaultParams: [{ platform: 2 }],
  });

  useEffect(() => {
    fetchLanuchpadList();
  }, [locale, state.type]);
  const banners = useMemo(() => {
    if (isLargerThan768) return hqpListWebData?.data.hqp_list.slice(0, 7);
    return hqpListMobileData?.data.hqp_list.slice(0, 11);
  }, [isLargerThan768, hqpListWebData, hqpListMobileData]);

  return (
    <Box mt={{ base: 0, md: `-${headerMdHeight}px` }} overflow="hidden">
      <Center
        pt={{ base: 0, md: `${headerMdHeight}px` }}
        h={{ base: '320px', md: '640px' }}
        pos="relative"
        bg="white"
      >
        <Flex
          pos="relative"
          zIndex={2}
          w="full"
          maxW={{ base: 'full', md: '1200px' }}
          align={{ base: 'center', md: 'flex-start' }}
          justify={{ base: 'center', md: 'space-between' }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Box mb={{ base: '25px', md: '0' }}>
            <Flex
              fontWeight={600}
              color="#000"
              wrap={'wrap'}
              align={{ base: 'center', md: 'flex-start' }}
              justify={{ base: 'center', md: 'space-between' }}
              direction={{ base: 'row', md: 'column' }}
              pr={{ base: 0, md: '12px' }}
            >
              <Heading
                mb={{ base: 0, md: '0' }}
                fontSize={{ base: '20px', md: '32px' }}
                lineHeight="1.8em"
                textAlign={{ base: 'center', md: 'left' }}
              >
                {t.raw('title')[0]}
              </Heading>
              <Text
                ml={{ base: '10px', md: 0 }}
                bg="linear-gradient(87.16deg, #5EA4F7 -13.23%, #5B8EFF 51.51%, #766DF6 88.77%);"
                bgClip="text"
                fontSize={{ base: '20px', md: '32px' }}
              >
                {t.raw('title')[1]}
              </Text>
            </Flex>
          </Box>

          <SimpleGrid
            spacing={{ base: '8px', md: '18px' }}
            templateColumns={{
              base: 'repeat(5, 60px)',
              md: 'repeat(5, 160px)',
            }}
            templateRows={{ base: 'repeat(3, 60px)', md: 'repeat(2, 160px)' }}
            gridAutoFlow="row dense"
          >
            {banners?.map((banner: any, i: any) => {
              const attrs: Omit<ShimmerImageProps, 'src'> = {};
              const image = banner.icon;
              if (isLargerThan768 && i === 0) {
                attrs.gridColumnStart = 'span 2';
                attrs.gridRowStart = 'span 2';
              }
              if (!isLargerThan768) {
                if (i === 1) {
                  attrs.gridRowStart = 'span 2';
                }
                if (i === 0) {
                  attrs.gridColumnStart = 'span 2';
                  attrs.gridRowStart = 'span 2';
                }
              }
              return !banner.outer_link ? (
                <Link
                  href={`/collection/${staticChainId}/${banner.address}`}
                  key={i}
                  passHref
                >
                  <ShimmerImage
                    key={i}
                    as="a"
                    h="full"
                    src={image}
                    rounded={{ base: '6px', md: '20px' }}
                    cursor="pointer"
                    transition="filter ease .3s"
                    border="1px solid"
                    borderColor="#ECECEC"
                    _hover={{
                      outline: '3px solid #766DF6',
                      outlineOffset: '-1px',
                      filter:
                        'drop-shadow(0px 50px 60px rgba(117, 116, 141, 0.6));',
                    }}
                    {...attrs}
                  />
                </Link>
              ) : (
                <Link href={banner.outer_link} target="_blank" key={i} passHref>
                  <ShimmerImage
                    as="a"
                    h="full"
                    src={image}
                    rounded={{ base: '6px', md: '20px' }}
                    cursor="pointer"
                    transition="filter ease .3s"
                    border="1px solid"
                    borderColor="#ECECEC"
                    _hover={{
                      outline: '3px solid #766DF6',
                      outlineOffset: '-1px',
                      filter:
                        'drop-shadow(0px 50px 60px rgba(117, 116, 141, 0.6));',
                    }}
                    {...attrs}
                  />
                </Link>
              );
            })}
          </SimpleGrid>
        </Flex>
        <Box
          display={{ base: 'none', md: 'block' }}
          w="345px"
          h="320px"
          pos="absolute"
          left="145px"
          bottom={'-60px'}
          bg="#E1CAE5"
          opacity={'0.7'}
          filter="blur(150px)"
          transform={'rotate(-26deg)'}
        />
        <Box
          w={{ base: '90px', md: '344px' }}
          h={{ base: '182px', md: '700px' }}
          pos="absolute"
          left={{ base: '-45px', md: '-120px' }}
          top={{ base: '230px', md: '24px' }}
          bg="#D4CBF7"
          opacity={'0.7'}
          filter={{ base: 'blur(26px)', md: 'blur(100px)' }}
          transform={'rotate(30deg)'}
        />
        <Box
          w={{ base: '82px', md: '344px' }}
          h={{ base: '173px', md: '700px' }}
          pos="absolute"
          top={{ base: '180px', md: '0' }}
          right={{ base: 0, md: '-20px' }}
          bg="linear-gradient(180deg, rgba(173, 255, 235, 0.33) 43.13%, rgba(255, 173, 222, 0.37) 84.79%);"
          opacity={'0.7'}
          filter={{ base: 'blur(26px)', md: 'blur(100px)' }}
          transform={'rotate(30deg)'}
        />
      </Center>
      <Box
        pos="relative"
        overflow={'hidden'}
        minH="42vh"
        pb={{ base: '30px', md: '120px' }}
      >
        <Box
          w={{ base: '110px', md: '344px' }}
          h={{ base: '224px', md: '700px' }}
          pos="absolute"
          top={{ base: '172px', md: '310px' }}
          left={{ base: '-100px', md: '-340px' }}
          bg="linear-gradient(180deg, #B79DF9 7.15%, #EFD1B7 46.62%);"
          opacity={'0.4'}
          filter={{ base: 'blur(32px)', md: 'blur(100px)' }}
          transform={'rotate(30deg)'}
        />

        <Box
          w={{ base: '110px', md: '344px' }}
          h={{ base: '224px', md: '700px' }}
          pos="absolute"
          top={{ base: '172px', md: '550px' }}
          right={{ base: '-100px', md: '-120px' }}
          bg="linear-gradient(180deg, #B095FF 0%, #80E0D0 47.42%);"
          opacity={'0.2'}
          filter={{ base: 'blur(32px)', md: 'blur(100px)' }}
          transform={'matrix(-0.86, 0.5, 0.5, 0.86, 0, 0);'}
        />

        <Box
          maxW={{ base: 'full', md: '1104px' }}
          mx="auto"
          px={{ base: '20px', md: '0' }}
        >
          <Box
            textAlign={'center'}
            mt={{ base: '15px', md: 0 }}
            py={{ base: '25px', md: '54px' }}
          >
            <HStack mb="15px" justifyContent={'center'} spacing={'8px'}>
              <ChakraImage
                display={{ base: 'block', md: 'none' }}
                src="/images/launchpad/title_icon.svg"
              />
              <Heading fontSize={{ base: '20px', md: '30px' }} fontWeight={600}>
                {ct('header.nav.launchpad.launchpad')}
              </Heading>
              <ChakraImage
                display={{ base: 'block', md: 'none' }}
                transform={'rotate(180deg)'}
                src="/images/launchpad/title_icon.svg"
              />
            </HStack>
            <Text color="#777E90" fontSize={{ base: '12px', md: '14px' }}>
              {t('subTitleDesc')}
            </Text>
            <ButtonGroup
              w="full"
              justifyContent={{ base: 'center', md: 'center' }}
              spacing={{ base: '12px', md: '16px' }}
              px={{ base: 0, md: '20px' }}
              mt={{ base: '40px', md: '40px' }}
            >
              {FilterBtns.map((el) => (
                <Button
                  key={el.value}
                  border="1px solid"
                  borderColor={'rgba(0, 0, 0, 0.2)'}
                  variant={'outline'}
                  fontFamily="PingFang HK"
                  rounded="full"
                  fontSize={{ base: '12px', md: '14px' }}
                  w={{ base: '65px', md: '100px' }}
                  h={{ base: '22px', md: '36px' }}
                  onClick={() => {
                    setState({ type: el.value });
                  }}
                  isActive={el.value === state.type}
                  _active={{
                    color: '#544AEC',
                    borderColor: '#766DF6',
                  }}
                >
                  {el.text}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          {/* {!loading &&
            data?.data?.launchpad_list?.map((item, i) => (
              <LaunchpadItem
                key={i}
                item={item}
                mb={{ base: '18px', md: '36px' }}
              />
            ))}
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Placeholder key={i} mb={{ base: '18px', md: '36px' }} />
            ))}

          {!loading && !data?.data?.launchpad_list?.length && (
            <Center h={'20vh'}>{ct('noItems')}</Center>
          )} */}
          {launchpadList?.map((item, i) => (
            <LaunchpadItem
              key={i}
              item={item}
              mb={{ base: '18px', md: '36px' }}
            />
          ))}
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <Placeholder key={i} mb={{ base: '18px', md: '36px' }} />
            ))}

          {!launchpadList?.length && (
            <Center h={'20vh'}>{ct('noItems')}</Center>
          )}
        </Box>
      </Box>
      <Footer bg="#000" />
      <GetUUU></GetUUU>
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
  const messages = await serverSideTranslations(locale, ['launchpad']);
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
    const [{ data: lauchpadData }] = await Promise.all([
      launchpadApis.list({ type: QueryType.All }), //获取特殊奖励
    ]);
    // console.log(lauchpadData, 'lauchpadData')
    return {
      props: {
        messages,
        lauchpadData,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        messages,
      },
    };
  }
}
