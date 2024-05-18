import { serverSideTranslations } from '@/i18n';
import CommonHead from '@/components/PageLayout/CommonHead';
import type { GetServerSidePropsContext } from 'next';
import {
  AgentContext,
  AgentBanner,
  YourNotPromoter,
  AgentTabs,
  HowToEarnCoins,
} from '@/features/Agent';
import { useRequest } from 'ahooks';
import { promoterHomepage } from '@/services/agent';
import { Center, Spinner } from '@chakra-ui/react';
import { useUserDataValue } from '@/store';
import { Footer } from '@/components/PageLayout';

function Content() {
  const userData = useUserDataValue();
  const { data, loading, refresh } = useRequest(promoterHomepage, {
    refreshDeps: [userData?.wallet_address],
  });

  if (!data?.data && loading)
    return (
      <Center minH={{ base: 'calc(100vh - 72px)', md: 'calc(100vh - 80px)' }}>
        <Spinner />
      </Center>
    );
  if (!userData?.wallet_address) return <HowToEarnCoins />;

  if (data?.data && !data.data.can_extension) return <YourNotPromoter />;
  return (
    <AgentContext.Provider value={{ data: data?.data!, refresh }}>
      <CommonHead title="Agent" />
      <AgentBanner />
      <AgentTabs />
    </AgentContext.Provider>
  );
}

export default function Agent() {
  return (
    <>
      <Content />
      <Footer />
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
  const messages = await serverSideTranslations(locale, ['promoter']);
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
      messages,
    },
  };
}
