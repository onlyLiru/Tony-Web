import { serverSideTranslations } from '@/i18n';
import type { GetServerSidePropsContext } from 'next';
import { useRequest } from 'ahooks';
import { checkCode } from '@/services/agent';
import { Center, Spinner, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { InviteSignModal, InviteSignModalRef } from '@/features/Agent';
import { useRef } from 'react';
import { Footer } from '@/components/PageLayout';

export default function Agent() {
  const inviteSignModalRef = useRef<InviteSignModalRef>(null);
  const router = useRouter();
  const code = router.query.agentInviteCode as string;

  const checkReq = useRequest(checkCode, {
    manual: !code,
    defaultParams: [{ code }],
    refreshDeps: [code],
    onSuccess: () => {
      inviteSignModalRef.current?.open({ code });
    },
  });

  return (
    <>
      <Center minH={{ base: 'calc(100vh - 72px)', md: '75vh' }}>
        {(() => {
          if (!code)
            return (
              <Text color="#000" fontSize={['16px', '20px']} fontWeight={700}>
                Missing necessary parameters: CODE
              </Text>
            );
          if (checkReq.error)
            return (
              <Text color="#000" fontSize={['16px', '20px']} fontWeight={700}>
                {checkReq.error?.message}
              </Text>
            );
          if (!checkReq.data?.data && checkReq.loading) return <Spinner />;

          return null;
        })()}
      </Center>
      <InviteSignModal ref={inviteSignModalRef} />;
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
  const messages = await serverSideTranslations(locale, ['index']);
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
