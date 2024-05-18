import React from 'react';
import { Box } from '@chakra-ui/react';
import { RevealList } from 'next-reveal';
import { Button } from '@chakra-ui/react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

function MobileIndex({
  current,
  currentUser,
  handleSelect,
  navigatePage,
  users,
}: {
  users: any;
  current: number;
  currentUser: any;
  handleSelect: (key: number) => void;
  navigatePage: (v: string) => void;
}) {
  const t = useTranslations('landingpage');

  return (
    <div className="bg-[url(/images/aiLandingPage/m_index_bg.png)] bg-cover overflow-hidden box-border relative">
      <div className="absolute z-10 left-0 top-4 w-full flex justify-end pr-4">
        <RevealList interval={60} delay={200}>
          <p
            className=" text-white px-2 py-1 flex"
            onClick={() => navigatePage('desc')}
          >
            {t('introductionT')}
            <img
              width={24}
              className="rotate-180 ml-1"
              src="/images/aiLandingPage/20240130-122721.png"
            />
          </p>
        </RevealList>
      </div>
      <div className="flex flex-col h-[80vh]">
        <div className="overflow-hidden">
          <img
            src={`/images/aiLandingPage/${currentUser.img_m}`}
            alt="Dan Abramov"
            className="relative w-full"
            style={{ top: current === 3 ? '-4rem' : '-4rem' }}
          />
        </div>

        <div className="flex-1 bg-black relative pb-[7rem] pt-4">
          <img
            src={`/images/aiLandingPage/squal.png`}
            alt="Dan Abramov"
            className="w-full h-[3rem] relative z-[2] mt-[-3rem]"
          />
          <RevealList interval={60} delay={400}>
            <h3 className="text-3xl text-center mb-4 font-RubikMonoOne-Regular bg-clip-text text-transparent bg-gradient-to-b from-[#FDFE75] to-[#FFB800]">
              {currentUser.name}
            </h3>
            <p
              className="px-[5vw] text-center text-white min-h-[60px]"
              dangerouslySetInnerHTML={{
                __html: currentUser?.words ?? '',
              }}
            />
          </RevealList>
          <RevealList interval={60} delay={500}>
            <div className="flex justify-center grayscale my-0">
              <Button
                colorScheme="twitter"
                style={{
                  background: 'url(/images/aiLandingPage/20240130-122714.png)',
                  backgroundSize: 'cover',
                  height: '60px',
                  width: '200px',
                }}
              >
                Comming Soon
              </Button>
            </div>
          </RevealList>

          <div className="w-full  text-white absolute bottom-[1rem]">
            <RevealList interval={60} delay={500}>
              <ul className="flex justify-around">
                {users.map((item: any, i: number) => (
                  <li
                    key={i}
                    onClick={() => handleSelect(i)}
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      listStyle: 'none',
                      margin: '0 0 .5rem 0',
                      padding: '0',
                    }}
                    className={classNames(
                      'cursor-pointer hover:scale-125 opacity-60 hover:opacity-100 bg-contain relative',
                      {
                        'opacity-90': current === i,
                        'scale-125': current === i,
                        'z-20': current === i,
                      },
                    )}
                  >
                    <div className="p-[2px]">
                      <img
                        className="w-full h-full relative"
                        src={`/images/aiLandingPage/${item.imgM}`}
                      />
                    </div>
                    <p
                      className={`bg-[url(/images/aiLandingPage/20240130-122746.png)] bg-cover w-full h-full absolute left-0 top-0`}
                    />
                  </li>
                ))}
              </ul>
            </RevealList>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileIndex;
