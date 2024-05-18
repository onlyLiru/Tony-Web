import { useTranslations } from 'next-intl';
import { serverSideTranslations } from '@/i18n';
import { GetServerSideProps } from 'next';
import { Box, Button, Text } from '@chakra-ui/react';
import { JWT_HEADER_KEY, WALLET_ADDRESS_KEY } from '@/utils/jwt';
import { useDisconnect } from 'wagmi';
import { useEffect, useRef } from 'react';
import { useUserData } from '@/store';
import { ApiGlobal } from '@/services/global';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Footer } from '@/components/PageLayout';
import { Web2LoginModal } from '../components/PageLayout/Header/Web2Login';

export default function LoginPage() {
  const t = useTranslations('login');
  const { disconnectAsync } = useDisconnect();
  const [, setUserData] = useUserData();
  const web2LoginModal = useRef<{
    open: () => void;
  }>(null);

  useEffect(() => {
    disconnectAsync();
    setUserData({} as ApiGlobal.getUserInfo);
  }, []);

  return (
    <>
      <Box
        minH={'50vh'}
        mx="auto"
        px={5}
        my={20}
        textAlign="center"
        maxW={{ base: 'full', md: '680px' }}
      >
        <Text fontSize="3xl" mb={5}>
          {t('connectYourWallet')}
        </Text>
        <Text color="primary.sec" mb={5}>
          {t('desc')}
        </Text>
        <ConnectButton.Custom>
          {() => (
            <Button
              className="Lg001"
              onClick={() => {
                web2LoginModal?.current?.open();
              }}
              mt={{ base: 10, md: 20 }}
              size="xl"
              w={{ base: 'full', md: '240px' }}
              variant={'primary'}
            >
              {t('connectYourWallet')}
            </Button>
          )}
        </ConnectButton.Custom>
      </Box>
      <Footer />
      <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
    </>
  );
}
import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
}) => {
  if (req.cookies?.[JWT_HEADER_KEY]) {
    return {
      redirect: {
        destination: `/${locale}/user/${req.cookies?.[WALLET_ADDRESS_KEY]}`,
        permanent: false,
      },
    };
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
      messages: await serverSideTranslations(locale, ['login']),
    },
  };
};
