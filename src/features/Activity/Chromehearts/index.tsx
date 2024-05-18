import Image from '@/components/Image';
import Marquee from 'react-fast-marquee';
import { useTranslations } from 'next-intl';
import { useChromeHeartseMint } from './useMint';

const list = [
  '/images/activity/chromeheart/card1.png',
  '/images/activity/chromeheart/card2.png',
  '/images/activity/chromeheart/card3.png',
  '/images/activity/chromeheart/card4.png',
  '/images/activity/chromeheart/card5.png',
];

const list2 = [
  '/images/activity/chromeheart/card6.png',
  '/images/activity/chromeheart/card7.png',
  '/images/activity/chromeheart/card8.png',
  '/images/activity/chromeheart/card9.png',
  '/images/activity/chromeheart/card10.png',
];

const LINKS = {
  twitter: 'https://twitter.com/MMMM_TEAM',
  discord: 'https://discord.gg/mmmm',
  website: 'https://mmmm.world',
};

const Page = () => {
  const t = useTranslations('chromeheart');
  const roadmaps = [
    {
      id: 1,
      title: t('roadmap.title1'),
      content: [t('roadmap.phase1')],
    },
    {
      id: 2,
      title: t('roadmap.title2'),
      content: [t('roadmap.phase2'), t('roadmap.phase3'), t('roadmap.phase4')],
    },
    {
      id: 3,
      title: t('roadmap.title3'),
      content: [t('roadmap.phase2'), t('roadmap.phase5'), t('roadmap.phase6')],
    },
    {
      id: 6,
      title: t('roadmap.title4'),
      content: [t('roadmap.phase7')],
    },
    {
      id: 5,
      title: t('roadmap.title5'),
      content: [t('roadmap.phase8'), t('roadmap.phase9')],
    },
    {
      id: 4,
      title: t('roadmap.title6'),
      content: [
        t('roadmap.phase10'),
        t('roadmap.phase11'),
        t('roadmap.phase12'),
      ],
    },
    {
      id: 7,
      title: t('roadmap.title7'),
      content: [
        t('roadmap.phase13'),
        t('roadmap.phase14'),
        t('roadmap.phase15'),
      ],
    },
  ];

  const {
    handleMint,
    isMinting2,
    isMinting,
    priceMicDollX,
    priceMicDollY,
    countX,
    countY,
  } = useChromeHeartseMint();

  return (
    <>
      <div className="bg-[#000] relative font-barlowcondensed w-full overflow-hidden">
        <Image
          src="/images/activity/chromeheart/bg_always.png"
          className="absolute top-0 left-1/2 -translate-x-[50%] min-w-[86rem] md:w-full"
        />
        <div className="w-full md:w-[64rem] px-5 md:px-0 m-auto text-white pt-16 md:pt-[8rem] font-semibold relative">
          <div className="relative z-10">
            <div className="text-trans text-4xl md:text-7xl">{t('title')}</div>
            <div className="text-3xl md:text-5xl pt-2">{t('desc')}</div>
            <div className="py-4 text-xs md:text-base">{t('time')}</div>
            <div className="md:flex grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] p-0.5 md:mr-10 relative">
                <div className="md:w-[16rem] bg-black pt-4 px-4">
                  <div className="mb-4 md:text-base">
                    {t('count')}:{countX}
                  </div>
                  <Image
                    src="/images/activity/chromeheart/capsule1.png"
                    className="w-20 md:w-[10rem] m-auto"
                  />
                  <div className="text-center">
                    {isMinting ? (
                      <button
                        className="m-auto flex text-black bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] px-4 md:px-6 py-1 md:py-4 font-semibold translate-y-[50%] text-xl md:text-3xl"
                        disabled
                      >
                        Minting<span className="dot">...</span>
                      </button>
                    ) : (
                      <button
                        className="text-black bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] px-4 md:px-6 py-1 md:py-4 font-semibold translate-y-[50%]"
                        onClick={() => handleMint(1)}
                      >
                        <span className="text-xl md:text-3xl">MINT</span>
                        <span className="text-base md:text-2xl">
                          /{priceMicDollX}
                        </span>
                        <span className="text-sm md:text-lg">ETH</span>
                      </button>
                    )}
                  </div>
                  <div className="absolute -bottom-12 md:-bottom-[4.5rem] py-2 text-center left-[50%] -translate-x-[50%] w-full text-xs md:text-base">
                    S:18% A:55% B: 27%
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] p-0.5 relative">
                <div className="md:w-[16rem] bg-black pt-4 px-4">
                  <div className="mb-4 md:text-base">
                    {t('count')}:{countY}
                  </div>
                  <Image
                    src="/images/activity/chromeheart/capsule2.png"
                    className="w-20 md:w-[10rem] m-auto"
                  />
                  <div className="text-center">
                    {isMinting2 ? (
                      <button
                        className="m-auto flex text-black bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] px-4 md:px-6 py-1 md:py-4 font-semibold translate-y-[50%] text-xl md:text-3xl"
                        disabled
                      >
                        Minting<span className="dot">...</span>
                      </button>
                    ) : (
                      <button
                        className="text-black bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] px-4 md:px-6 py-1 md:py-4 font-semibold translate-y-[50%]"
                        onClick={() => handleMint(2)}
                      >
                        <span className="text-xl md:text-3xl">MINT</span>
                        <span className="text-base md:text-2xl">
                          /{priceMicDollY}
                        </span>
                        <span className="text-sm md:text-lg">ETH</span>
                      </button>
                    )}
                  </div>
                  <div className="absolute -bottom-12 md:-bottom-[4.5rem] py-2 text-center left-[50%] -translate-x-[50%] w-full text-xs md:text-base">
                    A:27.5% B: 72.5%
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] h-0.5 mt-[21.6rem] md:mt-[11.8rem]" />
          <Image
            src="/images/activity/chromeheart/nft.png"
            className="absolute top-[25.9rem] md:top-[13rem] md:left-[30rem] md:w-[45rem] bottom-0 md:bottom-auto h-[18.9rem] md:h-auto left-[50%] -translate-x-[50%] md:translate-x-0"
          />
          <div className="hidden md:flex flex-col md:absolute top-96 -right-40">
            <a href={LINKS.twitter} target="_blank" rel="noreferrer">
              <Image
                src="/images/activity/chromeheart/twitter.svg"
                className="w-20 md:w-10"
              />
            </a>
            <a href={LINKS.discord} target="_blank" rel="noreferrer">
              <Image
                src="/images/activity/chromeheart/discord.svg"
                className="w-10 py-5"
              />
            </a>
            <a href={LINKS.website} target="_blank" rel="noreferrer">
              <Image
                src="/images/activity/chromeheart/icon.svg"
                className="w-10"
              />
            </a>
          </div>
          <div className="relative z-10">
            <div className="text-trans text-4xl md:text-7xl py-4 md:py-8">
              {t('intro.title')}
            </div>
            <div className="text-xl md:text-3xl mt-8 md:mt-20">
              {t('intro.desc')}
            </div>
          </div>
        </div>
        <Image
          src="/images/activity/chromeheart/bgwave.png"
          className="relative z-10 md:-top-[2rem] min-w-[60rem] md:w-full"
        />
        <div className="w-full md:w-[64rem]  px-5 md:px-0 m-auto -mt-[24rem] md:-mt-[24.5rem] lg:-mt-[42rem] relative z-10 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <Image
              src="/images/activity/chromeheart/img1.png"
              className="w-[13.8rem]"
            />
            <Image
              src="/images/activity/chromeheart/img2.png"
              className="w-[13.8rem]"
            />
            <Image
              src="/images/activity/chromeheart/img3.png"
              className="w-[13.8rem]"
            />
            <Image
              src="/images/activity/chromeheart/img4.png"
              className="w-[13.8rem]"
            />
          </div>
          <Image
            src="/images/activity/chromeheart/img.png"
            className="absolute w-[7.5rem] top-[12rem] -right-16 hidden md:block"
          />
          <div className="w-full bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] h-0.5 md:mt-[12rem]" />
          <div className="text-trans text-4xl md:text-7xl py-4 md:py-8">
            {t('intro.title2')}
          </div>
          <div className="text-xl md:text-3xl md:mt-20 mt-6">
            {t('intro.desc2')}
          </div>
        </div>
        <Marquee
          speed={100}
          gradientWidth={0}
          className="relative my-12 md:my-20"
        >
          {list.map((item, index) => {
            return (
              <Image key={index} src={item} className="md:h-[20rem] h-40" />
            );
          })}
        </Marquee>
        <div className="w-full md:w-[64rem]  px-5 md:px-0 m-auto relative z-10 text-white">
          <div className="w-full bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] h-0.5 md-16 md:mt-[8rem]" />
          <div className="text-trans text-4xl md:text-7xl py-4 md:py-8">
            {t('intro.title3')}
          </div>
          <div className="text-xl md:text-3xl mt-4 md:mt-20">
            <p className="mb-5 md:mb-10">{t('intro.desc3')}</p>
            <p>{t('intro.desc4')}</p>
          </div>
        </div>
        <Marquee
          speed={100}
          gradientWidth={0}
          className="relative my-6 md:my-20"
        >
          {list2.map((item, index) => {
            return (
              <Image key={index} src={item} className="md:h-[20rem] h-40" />
            );
          })}
        </Marquee>
        <div className="w-full md:w-[64rem]  px-5 md:px-0 m-auto relative z-10 text-white">
          <div className="w-full bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] h-0.5 mt-16 md:mt-[8rem]" />
          <div className="text-trans text-4xl md:text-7xl py-8">
            {t('team.title')}
          </div>
          <div className="text-xl md:text-3xl mt-4 md:mt-20 md:grid grid-cols-2 gap-x-16 gap-y-32">
            <div className="mb-8 md:mb-0">
              <div className="text-4xl text-trans">{t('team.name1')}</div>
              <div className="py-2 md:py-8">{t('team.subtitle1')}</div>
              <div>
                <p>{t('team.intro1')}</p>
                <p>{t('team.intro2')}</p>
              </div>
            </div>
            <div className="mb-8 md:mb-0">
              <div className="text-4xl text-trans">{t('team.name2')}</div>
              <div className="py-2 md:py-8">{t('team.subtitle1')}</div>
              <div>
                <p>{t('team.intro3')} </p>
                <p>{t('team.intro4')}</p>
              </div>
            </div>
            <div className="mb-8 md:mb-0">
              <div className="text-4xl text-trans">{t('team.name3')}</div>
              <div className="py-2 md:py-8">{t('team.subtitle2')}</div>
              <div>
                <p>{t('team.intro5')}</p>
                <p>{t('team.intro6')}</p>
              </div>
            </div>
            <div>
              <div className="text-4xl text-trans">{t('team.name4')}</div>
              <div className="py-2 md:py-8">{t('team.subtitle3')}</div>
              <div>
                <p>{t('team.intro7')}</p>
                <p>{t('team.intro8')}</p>
              </div>
            </div>
          </div>
          <div className="w-full bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] h-0.5 mt-16 md:mt-[8rem]" />
          <div className="text-trans text-4xl md:text-7xl py-8">
            {t('roadmap.map')}
          </div>

          <div className="relative">
            <div className="w-[76%] md:w-[45rem] bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] h-[1px] md:h-0.5 absolute top-[1rem] md:top-[2rem] left-[12%] md:left-[10rem]" />
            <div className="w-[76%] md:w-[45rem] bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] h-[1px] md:h-0.5 absolute top-[13rem] md:top-[22rem] left-[12%] md:left-[10rem]" />
            <div className="w-[1px] md:w-0.5 bg-[#38E5A7] h-[13rem] md:h-[20rem] absolute top-0 right-[15%] md:right-[9.5rem]" />
            <div className="w-[1px] md:w-0.5 bg-[#67CBEC] h-[13rem] md:h-[20rem] absolute top-[13rem] md:top-[22rem] left-[15%] md:left-[10.9rem]" />
            <div className="flex flex-wrap mt-20 md:pb-20 relative z-10">
              {roadmaps.map(({ id, title, content }) => {
                return (
                  <div
                    key={id}
                    className={`text-center h-[12rem] md:h-[20rem] ${
                      [1, 5].includes(id) ? 'md:px-16' : 'md:px-2'
                    } ${
                      [1, 6, 7].includes(id)
                        ? 'w-[30%] md:w-[22rem]'
                        : [2, 5].includes(id)
                        ? 'w-[30%] md:w-[16rem] md:mx-14 mx-4'
                        : 'w-[30%] md:w-[19rem]'
                    }`}
                  >
                    {id === 1 ? (
                      <Image
                        src="/images/activity/chromeheart/done.svg"
                        className="w-8 h-8 md:w-[3.75rem] md:h-[3.75rem] m-auto"
                      />
                    ) : (
                      <div className="bg-white rounded-full w-8 h-8 md:w-[3.75rem] md:h-[3.75rem] text-black text-sm md:text-4xl flex-center m-auto">
                        {id}
                      </div>
                    )}
                    <div className="font-semibold text-xs md:text-4xl py-4">
                      {title}
                    </div>
                    {content.map((i, subindex) => {
                      return (
                        <div
                          key={subindex}
                          className="font-semibold text-xs md:text-2xl relative"
                        >
                          <div className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-white inline-block mr-1 md:mr-2 mb-1" />
                          {i}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] h-0.5 mt-16 md:mt-[8rem]" />
          <div className="text-trans text-4xl md:text-7xl py-4 md:py-8">
            {t('intro.title4')}
          </div>
          <p className="text-xl md:text-3xl mt-10 md:mt-20">
            {t('intro.desc5')}
          </p>
          <div className="text-trans text-3xl md:text-5xl pt-10 md:pt-16 pb-4 md:pb-8">
            {t('intro.title5')}
          </div>
          <p className="text-xl md:text-3xl">{t('intro.desc6')}</p>
          <Image
            src="/images/activity/chromeheart/bg_procced.png"
            className="w-full mt-10"
          />
          <div className="text-trans text-4xl md:text-7xl py-8">
            {t('intro.title6')}
          </div>
          <p className="text-xl md:text-3xl">{t('intro.desc7')}</p>
        </div>
        <Image
          src="/images/activity/chromeheart/bg_ai.png"
          className="hidden md:block w-full mt-10"
        />
        <Image
          src="/images/activity/chromeheart/bg_aim.png"
          className="w-full md:hidden"
        />
        <div className="w-full md:w-[64rem]  px-5 md:px-0 m-auto relative z-10 text-white">
          <div className="text-trans text-4xl md:text-7xl py-8">
            {t('intro.title7')}
          </div>
          <p className="text-xl md:text-3xl">{t('intro.desc8')}</p>
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-6 md:mb-0">
            <Image
              src="/images/activity/chromeheart/img5.png"
              className="w-[18rem]"
            />
            <Image
              src="/images/activity/chromeheart/img6.png"
              className="w-[18rem]"
            />
            <Image
              src="/images/activity/chromeheart/img7.png"
              className="w-[18rem]"
            />
          </div>
          <div className="md:flex-between py-28">
            <div className="flex justify-between items-end md:block mb-4 md:mb-0">
              <div>
                <Image
                  src="/images/activity/chromeheart/logo.svg"
                  className="h-5 md:h-7"
                />
                <div className="text-sm md:text-base">{t('intro.title8')}</div>
              </div>
              <div className="md:hidden opacity-70 text-sm">
                MMMM © 2022, All rights reserved
              </div>
            </div>
            <a href={LINKS.discord} target="_blank" rel="noreferrer">
              <button className="w-full md:w-auto flex-between text-black bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] px-6 py-4 font-semibold">
                <span className="text-xl md:text-3xl">
                  {t('media.discord')}
                </span>
                <Image
                  src="/images/activity/chromeheart/arrow.svg"
                  className="w-5 md:w-7 ml-10"
                />
              </button>
            </a>
            <div className="md:hidden">
              <a href={LINKS.twitter} target="_blank" rel="noreferrer">
                <button className="mt-4 w-full md:w-auto flex-between text-black bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] px-6 py-4 font-semibold">
                  <span className="text-xl md:text-3xl">
                    {t('media.twitter')}
                  </span>
                  <Image
                    src="/images/activity/chromeheart/arrow.svg"
                    className="w-5 md:w-7 ml-10"
                  />
                </button>
              </a>
              <a href={LINKS.website} target="_blank" rel="noreferrer">
                <button className="mt-4 w-full md:w-auto flex-between text-black bg-gradient-to-r from-[#67CBEC] to-[#38E5A7] px-6 py-4 font-semibold">
                  <span className="text-xl md:text-3xl">
                    {t('media.website')}
                  </span>
                  <Image
                    src="/images/activity/chromeheart/arrow.svg"
                    className="w-5 md:w-7 ml-10"
                  />
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
