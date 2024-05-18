/* eslint-disable no-restricted-imports */
import type { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from '@/i18n';
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  useMediaQuery,
  Text,
  Flex,
  Image as ChakraImage,
  SimpleGrid,
} from '@chakra-ui/react';
import { useRequest } from 'ahooks';
import { useTranslations } from 'next-intl';
import {
  Recommond,
  Blogs,
  Introduce,
  GetUUU,
  MostWorthwhileCollectibleProjects,
} from '@/features/Home';
import Link from 'next/link';
import {
  getSeoArticleList,
  getQualityList,
  geBannerList,
  getResearchList,
  getCollectionsList,
} from '@/services/home';
import * as launchpadApis from '@/services/launchpad';
import { ShimmerImage, ShimmerImageProps } from '@/components/Image';
import { staticChainId } from '@/store';
import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
import dynamic from 'next/dynamic';
import NewHome from '@/features/Home/newHome';
import * as userApis from '@/services/user';
import { headerMdHeight } from '@/components/PageLayout/Header';
import Image from '@/components/Image';
import LoginModal from '@/components/LoginModal';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
const Banner = dynamic(
  () => import('@/features/Home').then((module) => module.Banner),
  { ssr: false },
);
const Ture = dynamic(
  () => import('@/features/Home').then((module) => module.Ture),
  { ssr: false },
);
const IPEcosystem = dynamic(() => import('@/components/Home/IPEcosystem'), {
  ssr: false,
});
const Home = dynamic(() => import('@/components/Home'), { ssr: false });
const PointUUU = dynamic(
  () => import('@/features/Home').then((module) => module.PointUUU),
  { ssr: false },
);
const Footer = dynamic(
  () => import('@/components/PageLayout').then((module) => module.Footer),
  { ssr: false },
);

type IProps = {
  // recommondItems?: marketApis.ApiMarket.HomeRecommendItem[];
  blogs: {
    daily: userApis.ApiUser.BlogItem[];
    week: userApis.ApiUser.BlogItem[];
  };
  seoarticle: any;
  recommondData: any;
  bannerListData: any;
  blogListData: any;
  collectionsList: any[];
  ip: any;
  geo: any;
  lauchpadData: any;
};

//原来在组件里使用的，为了seo加载一样的逻辑copy出来一份
interface IListItem {
  vol: string;
  vol_in_week: string;
  order: number;
}

// 排序，总量or7日总量
const handleSort = (
  targetList: Array<IListItem>,
  sortType: 'volIn7Days' | 'totalVol',
) => {
  const copyList = JSON.parse(JSON.stringify(targetList || '[]'));
  // 提取出带order和不带的item，先对不带order的list按照volIn7Days或totalVol进行排序，之后把带order的item插入指定位置
  const listWithOrder: Array<IListItem> = [],
    listWithoutOrder: Array<IListItem> = [];
  copyList.forEach((item: IListItem) => {
    if (item.order && item.order <= 1000) {
      // 把order映射到数组的下标上
      item.order -= 1;
      listWithOrder.push(item);
    } else {
      listWithoutOrder.push(item);
    }
  });
  // 对listWithOrder进行一次正序排序，便于根据order插入到listWithoutOrder中
  listWithOrder.sort((a, b) => {
    return a.order - b.order;
  });
  switch (sortType) {
    case 'volIn7Days':
      listWithoutOrder.sort((a: IListItem, b: IListItem) => {
        return Number(b.vol_in_week) - Number(a.vol_in_week);
      });
      break;
    case 'totalVol':
      listWithoutOrder.sort((a: IListItem, b: IListItem) => {
        return Number(b.vol) - Number(a.vol);
      });
      break;
  }
  // 遍历带order的数组插入到按照volIn7Days或totalVol排序完的数组中
  listWithOrder.forEach((item) => {
    listWithoutOrder.splice(item.order, 0, {
      ...item,
      order: item.order + 1,
    });
  });
  return listWithoutOrder.filter((item) => {
    return !!item;
  });
};
const PLATFORM_TYPE = {
  1: '/images/launchpad/eth.svg',
  2: '/images/launchpad/bsc.svg',
} as const;

export default function Index({
  seoarticle,
  recommondData,
  bannerListData,
  blogListData,
  ip,
  geo,
}: // lauchpadData,
IProps) {
  // const [launchpadList, setLauchPadList] = useState([]);
  const t = useTranslations('index');
  const recommondDataList = handleSort(recommondData?.list || [], 'volIn7Days');
  const { data: lauchpadData } = useRequest(launchpadApis.list, {
    defaultParams: [{ type: QueryType.All }],
  });
  const router = useRouter();
  // if (lauchpadData) {
  //   setLauchPadList(lauchpadData?.data.launchpad_list.slice(0,3) as any);
  // }
  const launchpadList = useMemo(() => {
    return lauchpadData?.data.launchpad_list;
  }, [lauchpadData]);
  // web端
  const { data: hqpListWebData } = useRequest(launchpadApis.hqpList, {
    defaultParams: [{ platform: 1 }],
  });
  // 移动端
  const { data: hqpListMobileData } = useRequest(launchpadApis.hqpList, {
    defaultParams: [{ platform: 2 }],
  });
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const banners = useMemo(() => {
    // if (isLargerThan768) return hqpListWebData?.data.hqp_list.slice(0, 7);
    // return hqpListMobileData?.data.hqp_list.slice(0, 11);
    if (isLargerThan768) return hqpListWebData?.data?.hqp_list?.slice(0, 24);
    return hqpListMobileData?.data?.hqp_list?.slice(0, 9);
  }, [isLargerThan768, hqpListWebData, hqpListMobileData]);
  // console.log(ip, 'ip');
  // console.log(geo, 'geo');
  return (
    <Box
      // overflow="hidden"
      // mt={{ base: 0, md: `-${96}px` }}
      // pt={{ base: 0, md: `${headerMdHeight}px` }}
      backgroundColor="white"
    >
      <NewHome
        bannerList={bannerListData?.list}
        recommondDataList={recommondDataList}
        seoarticle={seoarticle}
      ></NewHome>
      {/* <Banner bannerList={bannerListData?.list} />
      <Ture />
      <IPEcosystem />
      <PointUUU recommondData={recommondDataList} /> */}
      {/* <Home /> */}
      {/* <GetUUU /> */}
      {/* <Footer bg="#000" seoarticle={seoarticle as any} /> */}
    </Box>
  );
}
enum QueryType {
  All = '0',
  ETH = '1',
  BSC = '2',
}

// const FilterBtns = [
//   { text: 'ALL', value: QueryType.All },
//   { text: 'ETH', value: QueryType.ETH },
//   { text: 'BSC', value: QueryType.BSC },
// ];

type QueryValue = {
  type?: QueryType;
};

export async function getServerSideProps({
  locale,
  req,
  res,
}: GetServerSidePropsContext) {
  const messages = await serverSideTranslations(locale, ['index']);
  // 禁止国内ip
  let detectedIp = requestIp.getClientIp(req);
  // console.log(detectedIp, 'ip');
  // console.log(req.url, 'ip');
  // const ip = '14.212.2.64';

  if (detectedIp === '::1') {
    detectedIp = '156.146.56.115';
  }

  const xdbFilePath = path.join(process.cwd(), 'public', 'ip2region.xdb');
  // const dbPath = './ip2region.xdb';
  // or 'path/to/ip2region.xdb file path'
  const searcher = Searcher.newWithFileOnly(xdbFilePath);
  // 查询
  const geo = await searcher.search(detectedIp || '');

  // console.log(geo, 'geo1');
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

  try {
    const [
      { data: daliyBlogs },
      { data: weekBlogs },
      { data: seoarticle },
      { data: recommondData },
      { data: bannerListData },
      { data: blogListData },
      // { data: lauchpadData },
    ] = await Promise.all([
      userApis.blogList({ locale: locale || 'en', section: 0 }),
      userApis.blogList({ locale: locale || 'en', section: 1 }),
      getSeoArticleList(),
      getQualityList(),
      geBannerList(),
      getResearchList({ type: 1 }),
      // launchpadApis.list({ type: QueryType.All }),
    ]);

    const videoData = {
      video: '/videos/banner.mp4',
      image_url: '',
      link: '',
      logo: '',
      mobile_banner: '',
      mobile_desc: '',
      mobile_tag: '',
      mobile_title: '',
      offline: '',
      online: '',
      subtitle: '',
      title: '',
    };
    bannerListData.unshift(videoData);
    // console.log(bannerListData, 'bannerList')
    // console.log(recommondData, 'recommondData')
    // console.log(blogListData, 'blogListData')
    // console.log(lauchpadData, 'lauchpadData')
    return {
      props: {
        ip: detectedIp,
        geo: geo,
        messages,
        blogs: {
          daily: daliyBlogs.publication_list,
          week: weekBlogs.publication_list,
        },
        seoarticle,
        recommondData,
        bannerListData,
        blogListData,
        // lauchpadData,
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
