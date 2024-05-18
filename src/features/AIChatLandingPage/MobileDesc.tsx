import React from 'react';
import { Box } from '@chakra-ui/react';
import { RevealList } from 'next-reveal';
import { useTranslations } from 'next-intl';

function MobileDesc({
  currentUser,
  navigatePage,
  current,
}: {
  current: number;
  currentUser: any;
  handleSelect: (key: number) => void;
  navigatePage: (v: string) => void;
}) {
  const t = useTranslations('landingpage');

  return (
    <div className="bg-[url(/images/aiLandingPage/m_index_bg.png)] bg-contain">
      <Box w="100%" pos="relative">
        <div className="absolute z-10 left-0 top-4 w-full flex justify-start pl-4">
          <RevealList interval={60} delay={100}>
            <p
              className=" text-white px-2 py-1 flex"
              onClick={() => navigatePage('index')}
            >
              <img
                width={24}
                className="mr-1"
                src="/images/aiLandingPage/20240130-122721.png"
              />
              {t('returnT')}
            </p>
          </RevealList>
        </div>
      </Box>
      <RevealList interval={60} delay={200}>
        <div className="relative top-[40vw] h-[80vw] w-[100vw]  mx-auto z-10 ">
          <div
            className="h-[100vw] w-[100vw] absolute bottom-0 bg-[url(/images/aiLandingPage/person1.png)] bg-top bg-cover"
            style={{
              backgroundPosition: current === 3 ? 'center 80%' : 'center 10%',
              backgroundSize: current === 3 ? '130%' : '160%',
              backgroundImage: `url(/images/aiLandingPage/${currentUser.img})`,
            }}
          />
        </div>
      </RevealList>
      <RevealList interval={60} delay={300}>
        <div className="bg-[#000] text-white mt-[34vw] px-[10vw] py-[6vw] relative z-[11]">
          <h3 className="text-[#73DAF1] font-bold text-lg mb-2">
            {t('appearanceT')}
          </h3>
          {currentUser.appearance}
          <h3 className="text-[#73DAF1] font-bold text-lg my-2 mt-6">
            {t('characterT')}
          </h3>
          {currentUser.character}
        </div>
      </RevealList>
    </div>
  );
}

export default MobileDesc;
