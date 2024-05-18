import { requestV1 } from '@/utils/request';
import { Box, Text } from '@chakra-ui/react';
import { decode } from 'js-base64';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { redeemInfo } from '@/pages/activity/anime/ticket-connect';
import { useTranslations } from 'next-intl';
type Props = {
  codeUrl: string;
};

const checkRedeemStatusUrl = '/api/project/v1/anime/tickets/callback';

export const Pass = (props: Props) => {
  const { codeUrl } = props;
  const [succRedeem, setSuccRedeem] = useState(false);
  const [earnScore, setScore] = useState(0);
  const [interval, setInterVal] = useState();
  const t = useTranslations('activityTeamz');

  const textEle = (
    <>
      <Box
        h="100vw"
        maxH="100vw"
        overflow="scroll"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Text textAlign="center" color="#FFFF3AB4" fontSize="4.5vw">
          {t('coinRewardWording').replace('$1', String(earnScore))}
        </Text>
      </Box>
    </>
  );
  const codeEle = (
    <>
      <Box
        bgColor="rgba(255,58,180,0.3)"
        p={{ base: '2vw', md: '10px' }}
        mb={{ base: '20vw', md: '60px' }}
        mt={{ base: '5vw', md: '20px' }}
        borderRadius={{ base: '1vw', md: '10px' }}
        border="1px solid #FF3AB4"
      >
        <Text
          textAlign="center"
          color="#FFFF3AB4"
          fontSize={{ base: '4vw', md: '18px' }}
        >
          {t('saveCodeTips')}
        </Text>
      </Box>
      <QRCodeCanvas
        value={codeUrl}
        bgColor="#383838FF"
        fgColor="#ffffffe3"
        size={260}
      />
    </>
  );
  async function getRedeemStatus() {
    try {
      const b64 = (codeUrl.split('?')[1] || '').split('=')[1] || '';
      const redeemInfo: redeemInfo = JSON.parse(decode(b64));
      console.info('[ticket-verify]redeemInfo:', redeemInfo);
      const { list } = redeemInfo;
      console.info('[Pass]list:', list);
      if (!list.length) return;
      if (earnScore !== 0 && interval) (interval as any).clear();
      const request: { item_id_list: any[] } = { item_id_list: [] };
      list.map((item) => request.item_id_list.push(item.id));
      console.info('[getRedeemStatus]Req', request);
      const rsp = await requestV1(checkRedeemStatusUrl, {
        method: 'POST',
        body: JSON.stringify(request),
      });
      console.info('[getRedeemStatus]Rsp', rsp);
      const { code, data } = rsp;
      const { score } = data;

      if (code === 200) {
        setScore(score);
        setSuccRedeem(true);
      } else {
        console.info('[getRedeemStatus][errCode]', rsp);
      }
    } catch (err) {
      console.error('[getRedeemStatus][err]', err);
    }
  }

  useEffect(() => {
    const interval: any = setInterval(() => getRedeemStatus(), 1000 * 3);
    setInterVal(interval);
  }, []);

  return (
    <>
      <Box
        p={{ base: '4vw', md: '20px' }}
        pb={{ base: '20vw', md: '30px' }}
        flex="1"
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
      >
        {codeEle}
      </Box>
    </>
  );
};
