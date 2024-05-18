import { Box, Image as ChakraImage } from '@chakra-ui/react';
import { serverSideTranslations } from '@/i18n';
import type { GetServerSidePropsContext } from 'next';
// eslint-disable-next-line no-restricted-imports
import {
  Banner,
  CountDown,
  Dashboard,
  FmexInfo,
  PageContext,
  useMintInfo,
} from '@/features/Activity/Fmex';
import CommonHead from '@/components/PageLayout/CommonHead';
import { useScroll } from 'ahooks';
import { useEffect, useState } from 'react';
import { Footer } from '@/components/PageLayout';

const Fmex = () => {
  const { data, refresh } = useMintInfo();
  const scroll = useScroll();
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    if (scroll?.top! > document.documentElement.clientHeight - 80) {
      setShowArrow(true);
    } else {
      setShowArrow(false);
    }
  }, [scroll]);

  return (
    <>
      <CommonHead title="FMEX" />
      <PageContext.Provider value={{ data, refresh }}>
        <Box pos="relative" overflow="hidden">
          <Banner />
          <CountDown />
          <Dashboard />
          <FmexInfo />
          <ChakraImage
            pos="fixed"
            bottom={{ md: '100px', base: '30px' }}
            right={{ md: '100px', base: '30px' }}
            w="40px"
            h="auto"
            src="/images/activity/fmex/toTop.svg"
            hidden={!showArrow}
            onClick={() => window.scrollTo(0, 0)}
            cursor="pointer"
            _hover={{
              opacity: 0.9,
            }}
          />
        </Box>
      </PageContext.Provider>
      <Footer />
    </>
  );
};

export default Fmex;
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
      messages: await serverSideTranslations(locale, ['fmex']),
    },
  };
}
