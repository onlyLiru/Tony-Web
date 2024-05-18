/* eslint-disable no-restricted-imports */
import type { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from '@/i18n';
import { Box } from '@chakra-ui/react';
import CommonHead from '@/components/PageLayout/CommonHead';
import { Footer } from '@/components/PageLayout';
import { ConfHeader } from '@/features/Activity/Teamz/Comps/ConfHeader';
import { Connect } from '@/features/Activity/Teamz/Comps/Connect';
import { Pass } from '@/features/Activity/Teamz/Comps/Pass';
import { useUserDataValue } from '@/store';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect, useRef, useState } from 'react';
import { requestV1 } from '@/utils/request';
import { encode } from 'js-base64';
import ConfModal from '@/features/Activity/Teamz/Comps/ConfModal';
import { isProd } from '@/utils';
import { useTranslations } from 'next-intl';

const connectBgImg = '/images/activity/teamz/bg-site.png';
const getTicketInfoUrl = '/api/project/v1/teamz/tickets/get';
const prodRedeemPrefix =
  'https://unemeta.com/activity/teamz/ticket-redeem?redeemInfo';
const testRedeemPrefix =
  'https://test.unemeta.com/activity/teamz/ticket-redeem?redeemInfo';
const redeemUrlPrefix = isProd ? prodRedeemPrefix : testRedeemPrefix;

export type redeemInfo = {
  wallet: string;
  list: any[];
};

export default function TicketConnect() {
  const { wallet_address: waltAddr } = useUserDataValue() as any;
  const { openConnectModal } = useConnectModal();
  const confModalRef = useRef<any>();
  if (!waltAddr) openConnectModal?.();

  const t = useTranslations('activityTeamz');
  const [mintList, setMintList] = useState([]);
  const [redeemList, setRedeemList] = useState([] as any[]);
  const [hasRedeem, setHasRedeem] = useState(false);
  const [codeUrl, setCodeUrl] = useState('');
  const [tipsWording, setTipsWording] = useState(t('connectTips.empty'));

  function handleRedeem(checkedTicket: ['ticket' | 'red' | 'vip']) {
    console.info('[checkedTicket]:', checkedTicket);
    const checkedList: any[] = [];
    checkedTicket.map((item) =>
      redeemList.push({
        id: JSON.parse(item).item_id,
        type: JSON.parse(item).type,
      }),
    );
    setRedeemList(checkedList);
    const redeemInfo: redeemInfo = { list: redeemList, wallet: waltAddr };
    const str = encode(JSON.stringify(redeemInfo));
    const url = `${redeemUrlPrefix}=${str}`;

    if (!mintList || (mintList as any).length === 0) {
      setTipsWording(t('connectTips.empty'));
      confModalRef.current.open();
      return;
    } else if (redeemList.length === 0) {
      setTipsWording(t('connectTips.select'));
      confModalRef.current.open();
      return;
    }
    console.info('[ticketConnect]redeemInfo:', redeemInfo);
    console.info('[ticketConnect]codeUrl:', url);
    setCodeUrl(url);
    setHasRedeem(true);
  }

  async function getTikcetInfo() {
    try {
      const rsp = await requestV1(getTicketInfoUrl, { method: 'GET' });
      console.info('[getTikcetInfo]', rsp);
      const { code, data } = rsp || {};
      const { item_list: itemList = [] } = data || {};
      if (code === 200 && itemList.length) {
        itemList.map((item: any) => {
          if (item.value.indexOf('Day One') !== -1) {
            item.type = 'ticket';
          } else if (item.value.indexOf('Red') !== -1) {
            item.type = 'red';
          } else if (item.value.indexOf('VIP') !== -1) {
            item.type = 'vip';
          } else {
            item.type = 'unknow';
          }
        });
        console.info('[ticketList]:', itemList);
        setMintList(itemList || []);
      } else {
        setTipsWording(t('connectTips.empty'));
        confModalRef.current.open();
      }
    } catch (err) {
      console.error('[getTikcetInfo]err:', err);
      setTipsWording(t('connectTips.error'));
      confModalRef.current.open();
    }
  }

  useEffect(() => {
    if (waltAddr) getTikcetInfo();
  }, [waltAddr]);

  return (
    <Box
      fontFamily="PingFang HK"
      bgColor="black"
      bgImage={connectBgImg}
      bgSize="cover"
      h={{ base: '100vh' }}
      w={{ base: '100vw', md: '50vw' }}
      display="flex"
      flexDir="column"
      maxWidth="500px"
      margin="auto"
    >
      <ConfModal
        ref={confModalRef}
        confirmRedeem={() => ({})}
        modalType="tips"
        tipsWording={tipsWording}
      />
      <CommonHead title="Connect" />
      <ConfHeader />
      {hasRedeem ? (
        <Pass codeUrl={codeUrl} />
      ) : (
        <Connect ticketList={mintList} handleRedeem={handleRedeem} />
      )}
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
