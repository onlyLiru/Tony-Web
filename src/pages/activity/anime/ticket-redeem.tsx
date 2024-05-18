/* eslint-disable no-restricted-imports */
import type { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from '@/i18n';
import { Box } from '@chakra-ui/react';
import CommonHead from '@/components/PageLayout/CommonHead';
import { Footer } from '@/components/PageLayout';
import { ConfHeader } from '@/features/Activity/Anime/Comps/ConfHeader';
import Verify from '@/features/Activity/Anime/Comps/Verify';
import ConfModal from '@/features/Activity/Anime/Comps/ConfModal';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { decode } from 'js-base64';
import { redeemInfo } from './ticket-connect';
import { requestV1 } from '@/utils/request';
import { useTranslations } from 'next-intl';

const connectBgImg = '/images/activity/anime/bg-site.png';
const redeemTicketUrl = '/api/project/v1/anime/tickets/submit';

export default function TicketVerify() {
  const confModalRef = useRef<any>();
  const router = useRouter();
  const [modalType, setModalType] = useState<'confirm' | 'tips'>('confirm');
  const [tipsWording, setTipsWording] = useState<string>('');
  const [redeemList, setRedeemList] = useState<any[]>([]);
  const t = useTranslations('activityTeamz');

  function handleRedeem() {
    setModalType('confirm');
    confModalRef.current.open();
  }

  function confirmRedeem() {
    confModalRef.current.close();
    const itemIdList: any[] = [];
    redeemList.map((item) => itemIdList.push(item.id));
    submitRedeem(itemIdList);
  }

  async function submitRedeem(list: any) {
    try {
      const request = { item_id_list: list };
      console.info('[submitRedeem]Req', request);
      const rsp = await requestV1(redeemTicketUrl, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      console.info('[submitRedeem]Rsp', rsp);
      const { code } = rsp;
      if (code === 200) {
        setModalType('tips');
        setTipsWording(t('redeemTips.success'));
      } else {
        setModalType('tips');
        setTipsWording(t('redeemTips.invalid'));
      }
    } catch (err) {
      console.error('[submitRedeem]err:', err);
      const { code = -1 } = err;
      if (code === 900015) {
        setModalType('tips');
        setTipsWording(t('redeemTips.duplication'));
      } else {
        setModalType('tips');
        setTipsWording(t('redeemTips.error'));
      }
    }
    confModalRef.current.open();
  }

  useEffect(() => {
    try {
      const b64 = router.query && (router.query.redeemInfo as any);
      const redeemInfo: redeemInfo = JSON.parse(decode(b64));
      console.info('[ticket-verify]redeemInfo:', redeemInfo);
      const { list: redeemList } = redeemInfo;
      setRedeemList(redeemList);
    } catch (err) {
      setModalType('tips');
      setTipsWording(t('redeemTips.invalid'));
      confModalRef.current.open();
    }
  }, [router.query]);

  return (
    <Box
      fontFamily="PingFang HK"
      bgColor="black"
      bgImage={connectBgImg}
      bgSize="cover"
      h={{ base: '100vh' }}
      w={{ base: '100vw', md: '50vw' }}
      maxWidth="450px"
      display="flex"
      flexDir="column"
      margin="auto"
    >
      <ConfModal
        ref={confModalRef}
        confirmRedeem={confirmRedeem}
        modalType={modalType}
        tipsWording={tipsWording}
      />
      <CommonHead title="Redeem" />
      <ConfHeader />
      <Verify redeemList={redeemList} handleRedeem={handleRedeem} />
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
  const messages = await serverSideTranslations(locale, ['activityTeamz']);
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
  return { props: { messages } };
}
