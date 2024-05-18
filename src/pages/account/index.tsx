/**
 * 我的账户页面
 * 和 /user/:address ui一致
 */

import { useTranslations } from 'next-intl';
import { redirectLoginPage, serverSideTranslations } from '@/i18n';
import PageLayout from '@/components/PageLayout';
import { GetServerSideProps } from 'next';
import { useUserDataValue } from '@/store';
import { Box, Heading } from '@chakra-ui/react';
import { JWT_HEADER_KEY } from '@/utils/jwt';

export default function AccountSetting() {
  const t = useTranslations('index');
  const userData = useUserDataValue();

  return (
    <>
      <Heading>Account Page</Heading>
      <Box wordBreak={'break-all'}>{JSON.stringify(userData)}</Box>
    </>
  );
}
import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
  resolvedUrl,
}) => {
  if (!req.cookies?.[JWT_HEADER_KEY]) {
    // return redirectLoginPage({ locale, resolvedUrl });
    console.log('未登录不做重定向处理');
  }
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
      messages: await serverSideTranslations(locale, ['index']),
    },
  };
};
