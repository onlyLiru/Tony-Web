import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { serverSideTranslations } from '@/i18n';
import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Rankings from './components/Rankings';
import Redemption from './components/Redemption';

const Footer = dynamic(
  () => import('@/components/PageLayout').then((module) => module.Footer),
  { ssr: false },
);

export default function PointsShop({
  data,
  initOrderList,
}: {
  data: any;
  initOrderList: any;
}) {
  return (
    <Box bg="#000" color="#fff" padding={{ md: '1rem', base: '1rem' }}>
      <Rankings />
      <Redemption {...{ initOrderList, data }} />
      <Footer />
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
  const messages = await serverSideTranslations(locale, ['points']);

  // 禁止国内ip
  let detectedIp = requestIp.getClientIp(req);

  if (detectedIp === '::1') {
    detectedIp = '156.146.56.115';
  }

  const xdbFilePath = path.join(process.cwd(), 'public', 'ip2region.xdb');
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

  try {
    return {
      props: {
        messages,
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
