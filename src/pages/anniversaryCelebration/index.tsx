import { Box, Spinner, useMediaQuery, useToast } from '@chakra-ui/react';
import { serverSideTranslations } from '@/i18n';
import { GetServerSidePropsContext } from 'next/types';
import {
  Login,
  Web3Start,
  UUUPoints,
  SignIn,
  Invite,
  Order,
  Event,
  Share,
} from '@/features/AnniversaryCelebration';
import { useKeenSlider } from 'keen-slider/react';
import KeenSlider from 'keen-slider';
import 'keen-slider/keen-slider.min.css';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUserDataValue } from '@/store';
import { requestV1 } from '@/utils/request';
import Image from '@/components/Image';
import { useTranslations } from 'next-intl';

const getAnniversaryInfoUrl = '/api/project/v1/user/info';

export default function Anniversary() {
  const t = useTranslations('anniversary');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [clientHeight, setClientHeight] = useState(0);
  const toast = useToast();
  const [anniversaryInfo, setAnniversaryInfo] = useState<any>({});
  const sliderRef = useRef(null);

  // const [ref] = useKeenSlider<HTMLDivElement>({
  //   loop: false,
  //   slides: {},
  //   vertical: true,
  // });
  const { address } = useAccount();
  const userData = useUserDataValue();

  useEffect(() => {
    if (window?.document) {
      setClientHeight(document.querySelector('html')?.clientHeight || 0);
    }
    const observer = new MutationObserver(() => {
      if (sliderRef.current) {
        console.log(sliderRef);
        new KeenSlider(sliderRef.current, {
          loop: false,
          slides: {},
          vertical: true,
        });
      }
    });
    sliderRef?.current &&
      observer.observe(sliderRef?.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const anniversaryTipAddress: string[] = JSON.parse(
      window?.localStorage?.getItem('anniversaryTipAddress') || '[]',
    );
    if (address && anniversaryTipAddress.indexOf(address) === -1) {
      toast({
        status: 'success',
        title: `${t('visitSuccessTip')}`,
        variant: 'subtle',
      });
      anniversaryTipAddress.push(address);
      window?.localStorage?.setItem(
        'anniversaryTipAddress',
        JSON.stringify(anniversaryTipAddress),
      );
    }
  }, [address]);

  useEffect(() => {
    // 只有当登陆了之后才请求数据
    if (userData?.wallet_address) {
      requestV1(getAnniversaryInfoUrl, { method: 'GET' }).then((res) => {
        if (res?.code === 200) {
          console.log(res.data);
          setAnniversaryInfo(res.data);
        }
      });
    }
  }, [userData?.wallet_address]);

  const EVENTS_LIST = [
    {
      srcList: ['/images/anniversary/event-1.jpg'],
      title: t('event1Title'),
      content: t('event1Content'),
    },
    {
      srcList: ['/images/anniversary/event-5.jpg'],
      title: t('event2Title'),
      content: t('event2Content'),
    },
    {
      srcList: ['/images/anniversary/event-4.jpg'],
      title: t('event3Title'),
      content: t('event3Content'),
    },
    {
      srcList: ['/images/anniversary/event-2.jpg'],
      title: t('event4Title'),
      content: t('event4Content'),
    },
    {
      srcList: ['/images/anniversary/event-3.jpg'],
      title: t('event5Title'),
      content: t('event5Content'),
    },
  ];

  return isLargerThan768 ? (
    <Image
      draggable="false"
      src="/images/anniversary/top-section.png"
      alt=""
      w="100%"
      h="auto"
    />
  ) : (
    <Box
      w="full"
      ref={sliderRef}
      className="keen-slider"
      style={{ position: 'absolute', zIndex: 99, top: 0, height: '100vh' }}
    >
      {!address && (
        <Box className="keen-slider__slide">
          <Login clientHeight={clientHeight} />
        </Box>
      )}
      {address && !anniversaryInfo.first_login && (
        <Spinner
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          position="absolute"
          top="50%"
          left="46%"
          transform="translate(-50%, -50%)"
        />
      )}
      {address && anniversaryInfo.first_login && (
        <>
          <Box className="keen-slider__slide">
            <Web3Start
              clientHeight={clientHeight}
              anniversaryInfo={anniversaryInfo}
            />
          </Box>
          <Box className="keen-slider__slide">
            <UUUPoints
              clientHeight={clientHeight}
              anniversaryInfo={anniversaryInfo}
            />
          </Box>
          <Box className="keen-slider__slide">
            <SignIn
              clientHeight={clientHeight}
              anniversaryInfo={anniversaryInfo}
            />
          </Box>
          <Box className="keen-slider__slide">
            <Invite
              clientHeight={clientHeight}
              anniversaryInfo={anniversaryInfo}
            />
          </Box>
          <Box className="keen-slider__slide">
            <Order
              clientHeight={clientHeight}
              anniversaryInfo={anniversaryInfo}
            />
          </Box>
          {/* CSS files for react-slick */}
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
          {EVENTS_LIST.map((eventItem, index) => {
            return (
              <Box className="keen-slider__slide" key={`event-${index}`}>
                <Event
                  clientHeight={clientHeight}
                  anniversaryInfo={anniversaryInfo}
                  eventItem={eventItem}
                />
              </Box>
            );
          })}
          <Box className="keen-slider__slide">
            <Share
              clientHeight={clientHeight}
              anniversaryInfo={anniversaryInfo}
            />
          </Box>
        </>
      )}
    </Box>
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
