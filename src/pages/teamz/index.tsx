import { Box } from '@chakra-ui/react';
import { serverSideTranslations } from '@/i18n';
import { GetServerSidePropsContext } from 'next/types';
import {
  Ticket,
  PointsReward,
  AboutTeamz,
  SpeakerIntro,
  HowToUseNFTickets,
  QuestionAndAnswer,
  CollectionInfo,
} from '@/features/Teamz';

export default function TEAMZ() {
  return (
    <Box w="full">
      <Ticket />
      {/* <CollectionInfo /> */}
      <PointsReward />
      <AboutTeamz />
      {/* <SpeakerIntro /> */}
      <HowToUseNFTickets />
      <QuestionAndAnswer />
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
  const messages = await serverSideTranslations(locale, ['teamz']);
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
