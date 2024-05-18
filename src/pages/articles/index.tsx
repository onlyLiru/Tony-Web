import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { serverSideTranslations } from '@/i18n';

import { Button, useToast } from '@chakra-ui/react';
import CommonHead from '@/components/PageLayout/CommonHead';
import { useEffect, useState } from 'react';
import * as userApis from '@/services/user';
import { useRouter } from 'next/router';
import { clearInterval } from 'timers';
import { useUserDataValue } from '@/store';
export default function Articles() {
  const router = useRouter();
  interface articleLan {
    [key: string]: string;
    jp: string;
    zh: string;
    en: string;
  }
  interface article {
    [key: string]: articleLan;
  }
  // const [second, setSecond] = useState(10);
  const articleList: article = {
    // 1是bitget限定文章
    '1': {
      jp: 'https://unemeta.wordpress.com/2023/10/20/unemeta%e3%81%a8bitget-wallet%e3%81%af%e5%8d%94%e5%8a%9b%e3%81%97%e3%80%81%e5%85%b1%e3%81%abweb3%e3%82%92%e6%8e%a2%e6%b1%82%e3%81%97%e3%81%be%e3%81%99%e3%80%82/',
      zh: 'https://unemeta.wordpress.com/2023/10/20/unemeta-%e8%88%87-bitget-wallet-%e8%81%af%e6%89%8b%ef%bc%8c%e5%85%b1%e5%90%8c%e6%8e%a2%e7%b4%a2-web3/',
      en: 'https://unemeta.wordpress.com/2023/10/20/unemeta-teams-up-with-bitget-wallet-to-jointly-explore-web3/',
    },
    '2': {
      jp: 'https://unemeta.wordpress.com/2023/10/20/unemeta%e3%81%af%e3%80%81%e6%97%a5%e6%9c%ac%e3%81%ae%e6%9c%89%e5%90%8d%e5%a3%b0%e5%84%aa%e3%80%8c%e8%8a%b1%e6%be%a4%e9%a6%99%e8%8f%9c%e3%80%8d%e3%81%a8%e3%81%ae%e3%82%b3%e3%83%a9%e3%83%9c%e3%83%ac/',
      zh: 'https://unemeta.wordpress.com/2023/08/14/unemeta%e5%a4%a7%e4%ba%8b%e8%ae%b0%e4%b9%8b%e3%80%8cunemeta-%e4%b8%8e%e6%97%a5%e6%9c%ac%e7%9f%a5%e5%90%8d%e5%a3%b0%e4%bc%98%e6%bc%94%e5%91%98%e8%8a%b1%e6%b3%bd%e9%a6%99%e8%8f%9c%e8%81%94/',
      en: 'https://unemeta.wordpress.com/2023/10/20/unemeta-cooperates-with-the-well-known-japanese-voice-actor-hanazawa-kana-to-jointly-issue-nft-collectibles/',
    },
    '3': {
      jp: 'https://unemeta.wordpress.com/2023/10/20/unemeta%e3%81%a8studio-mushi%e3%81%af%e3%80%81%e3%80%8c%e6%82%b2%e3%81%97%e3%81%bf%e3%81%ae%e3%83%99%e3%83%a9%e3%83%89%e3%83%b3%e3%83%8a%e3%80%8d50%e5%91%a8%e5%b9%b4%e8%a8%98%e5%bf%b5%e5%b1%95/',
      zh: 'https://unemeta.wordpress.com/2023/08/14/unemeta-%e5%a4%a7%e4%ba%8b%e8%ae%b0%e4%b9%8b%e3%80%8cunemeta%e4%ba%8e%e6%97%a5%e6%9c%ac%e4%b8%9c%e4%ba%ac%e4%b8%be%e5%8a%9e-%e7%ba%bf%e4%b8%8b%e4%b8%bb%e9%a2%98%e7%94%bb%e5%b1%95%e3%80%8d/',
      en: 'https://unemeta.wordpress.com/2023/10/20/unemeta-collaborates-with-studio-mushi-to-jointly-host-the-sad-belladonna-50th-anniversary-exhibition/',
    },
    '4': {
      jp: 'https://unemeta.wordpress.com/2023/10/20/unemeta%e3%81%af%e3%80%81%e6%97%a5%e6%9c%ac%e3%81%ae%e6%9c%89%e5%90%8d%e3%81%aaip%e3%80%8c%e3%81%8f%e3%81%be%e3%83%a2%e3%83%b3%e3%80%8d%e3%81%a8%e3%81%ae%e5%85%b1%e5%90%8c%e4%bc%81%e7%94%bb%e3%81%a7/',
      zh: 'https://unemeta.wordpress.com/2023/10/19/unemeta-%e4%b8%8e%e7%9f%a5%e5%90%8d%e6%97%a5%e6%9c%ac-ip%e3%80%8ckumamon%e3%80%8d%e8%be%be%e6%88%90%e5%90%88%e4%bd%9c%ef%bc%8c%e5%8f%8c%e6%96%b9%e5%b0%86%e5%85%b1%e5%90%8c%e6%8e%a8%e5%87%ba-nft/',
      en: 'https://unemeta.wordpress.com/2023/10/19/unemeta-%e4%b8%8e%e7%9f%a5%e5%90%8d%e6%97%a5%e6%9c%ac-ip%e3%80%8ckumamon%e3%80%8d%e8%be%be%e6%88%90%e5%90%88%e4%bd%9c%ef%bc%8c%e5%8f%8c%e6%96%b9%e5%b0%86%e5%85%b1%e5%90%8c%e6%8e%a8%e5%87%ba-nft/',
    },
    '5': {
      jp: 'https://unemeta.wordpress.com/2023/10/07/%e3%82%b7%e3%83%b3%e3%82%ac%e3%83%9d%e3%83%bc%e3%83%ab%e3%81%a7%e9%96%8b%e5%82%ac%e3%81%95%e3%82%8c%e3%81%9funemeta%e3%81%ae%e3%80%8cfrom-sketch-to-screen%e3%80%8d%e5%b1%95%e3%81%a7%e3%81%af%e4%bd%95/',
      zh: 'https://unemeta.wordpress.com/2023/10/03/%e5%9c%a8-unemeta-%e7%9a%84%e6%96%b0%e5%8a%a0%e5%9d%a1%e3%80%8cfrom-sketch-to-screen%e3%80%8d%e7%94%bb%e5%b1%95%e4%b8%8a%ef%bc%8c%e5%8f%91%e7%94%9f%e4%ba%86%e4%bb%80%e4%b9%88%ef%bc%9f/',
      en: 'https://unemeta.wordpress.com/2023/10/05/what-happened-at-unemetas-from-sketch-to-screen-art-exhibition-in-singapore/',
    },
    '6': {
      jp: 'https://unemeta.wordpress.com/2023/06/16/what-is-an-nft/',
      zh: 'https://unemeta.wordpress.com/2023/06/16/what-is-an-nft/',
      en: 'https://unemeta.wordpress.com/2023/06/16/what-is-an-nft/',
    },
    '7': {
      jp: 'https://unemeta.wordpress.com/2023/06/16/how-to-create-an-nft/',
      zh: 'https://unemeta.wordpress.com/2023/06/16/how-to-create-an-nft/',
      en: 'https://unemeta.wordpress.com/2023/06/16/how-to-create-an-nft/',
    },
    '8': {
      jp: 'https://unemeta.wordpress.com/2023/06/18/what-is-minting/',
      zh: 'https://unemeta.wordpress.com/2023/06/18/what-is-minting/',
      en: 'https://unemeta.wordpress.com/2023/06/18/what-is-minting/',
    },
    '9': {
      jp: 'https://unemeta.wordpress.com/2023/06/16/what-are-gaming-nfts/',
      zh: 'https://unemeta.wordpress.com/2023/06/16/what-are-gaming-nfts/',
      en: 'https://unemeta.wordpress.com/2023/06/16/what-are-gaming-nfts/',
    },
    '10': {
      jp: 'https://unemeta.wordpress.com/2023/06/16/what-are-profile-picture-pfp-nfts/',
      zh: 'https://unemeta.wordpress.com/2023/06/16/what-are-profile-picture-pfp-nfts/',
      en: 'https://unemeta.wordpress.com/2023/06/16/what-are-profile-picture-pfp-nfts/',
    },
  };
  const [url, setUrl] = useState('');
  const toast = useToast();
  const userData = useUserDataValue();

  const { newsId } = router.query;
  const newsRead = async () => {
    console.log('newsRead');
    try {
      if (newsId) {
        // if (userData?.source !== 5 && newsId === '1') {
        //   toast({ title: 'Exclusive for bitget users', status: 'warning' });
        //   return;
        // }
        const result = await userApis.newsRead({ news_id: Number(newsId) });
        toast({
          title: 'Success!',
          status: 'success',
        });
        console.log(result, 'result');
      }
    } catch (error) {
      toast({ title: error.msg, status: 'error' });
    }
    router.back();
  };
  let timer: any = null;
  const [sec, setSec] = useState<number | null>(10);
  useEffect(() => {
    if (newsId && typeof newsId === 'string' && router?.locale) {
      const getUrlObj = articleList[newsId];
      if (getUrlObj) {
        const aurl = getUrlObj[router?.locale];
        if (aurl) {
          setUrl(aurl);
        }
      }
    }
    timer = setInterval(() => {
      setSec((sec) => {
        if (sec && sec - 1 > 0) {
          return sec - 1;
        } else {
          return null;
        }
      });
    }, 1000);
    return () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };
  }, []);

  return (
    <>
      <CommonHead title="articles" />
      <Button
        colorScheme="yellow"
        isDisabled={sec ? true : false}
        onClick={() => {
          newsRead();
        }}
        size="lg"
        float={'right'}
      >
        Complete{sec ? `(${sec}s)` : ''}
      </Button>
      <iframe src={url} style={{ width: '100vw', height: '100vh' }}></iframe>
    </>
  );
}

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  const messages = await serverSideTranslations(locale, ['anniversary']);
  return {
    props: {
      messages,
    },
  };
}
