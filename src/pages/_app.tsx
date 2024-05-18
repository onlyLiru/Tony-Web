import '@/styles/globals.css';
import { NextIntlProvider } from 'next-intl';
import { WagmiConfigProvider } from '@/contract';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/styles/theme';
import PageLoader from '@/features/PageLoader';
// import { RootModalProvider } from '@/features/AssetPage';
import React, { ReactElement, ReactNode, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Head from 'next/head';
import CommonHead from '@/components/PageLayout/CommonHead';
import NftAvatar from '@/components/NftAvatar';
import Analytics from '@/features/Analytics';
import CloseRareMode from '@/features/CloseRareMode';

import { NextPage } from 'next';
import { AppProps } from 'next/app';
import '../styles/fonts';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const RootModalProvider = dynamic(() =>
  import('@/features/AssetPage').then((module) => module.RootModalProvider),
);

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<any> & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter();
  console.log('router', router.pathname);

  const getLayout =
    Component.getLayout ||
    ((page: React.ReactNode) => <PageLayout>{page}</PageLayout>);
  return (
    <>
      <WagmiConfigProvider>
        <NextIntlProvider
          formats={{
            dateTime: {
              short: {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              },
            },
          }}
          messages={pageProps.messages}
          now={new Date(pageProps.now)}
          onError={(err: any) => console.log(err)}
          getMessageFallback={() => ''}
        >
          {/* <ThirdwebProvider
            activeChain={activeChain ?? (isProd ? 'ethereum' : 'goerli')}
          > */}
          <ChakraProvider theme={theme}>
            <PageLoader />
            {process.env.NODE_ENV === 'production' && <Analytics />}
            <CloseRareMode></CloseRareMode>
            {['/', '/rewards'].indexOf(router.pathname) > -1 ? (
              <div className="">
                <CommonHead />
                <Head>
                  <link rel="icon" href="/favicon.ico" />
                </Head>
                {getLayout(<Component {...pageProps} />)}
                <NftAvatar />
              </div>
            ) : (
              <RootModalProvider>
                <CommonHead />
                <Head>
                  <link rel="icon" href="/favicon.ico" />
                </Head>
                {getLayout(<Component {...pageProps} />)}
                <NftAvatar />
              </RootModalProvider>
            )}
          </ChakraProvider>
          {/* </ThirdwebProvider> */}
        </NextIntlProvider>
      </WagmiConfigProvider>
    </>
  );
};

export default App;
