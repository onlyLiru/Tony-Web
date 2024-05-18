import React, { useRef, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import { useTranslations } from 'next-intl';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

// import required modules
import { EffectCube } from 'swiper/modules';

export default function App({
  current,
  users,
  handleSelect,
  children,
}: {
  current: number;
  users: any;
  children: React.ReactNode;
  handleSelect: (key: number) => void;
}) {
  const swiperRef = useRef<any>(null);
  const t = useTranslations('landingpage');

  const scrollToSlide = (i: number) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(i);
    }
  };

  useEffect(() => {
    scrollToSlide(current);
  }, [current]);

  return (
    <div className="relative">
      <Swiper
        effect={'cube'}
        grabCursor={true}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        modules={[EffectCube]}
        ref={swiperRef}
        onSlideChange={(swiper: SwiperClass) => {
          handleSelect(swiper.activeIndex);
        }}
      >
        {users.map((item: any, index: number) => (
          <SwiperSlide key={index}>
            <div>
              <img
                className="mx-auto w-[50%] translate-y-32 relative z-[2]"
                src={`/images/aiLandingPage/${item.img}`}
                style={{
                  top: index === 3 ? '-80px' : 0,
                }}
              />
              <section
                className="absolute left-[60%] top-[220px] z-[1] text-white bg-[url(/images/aiLandingPage/20240130-122740.png)] bg-contain bg-no-repeat w-[320px] h-[350px] box-border pl-[60px] pt-[40px] pr-[40px]"
                style={{
                  zIndex: [2, 3].includes(index) ? 2 : 1,
                }}
              >
                <h2 className="text-2xl mb-5 bg-clip-text text-transparent bg-gradient-to-b from-[#FDFE75] to-[#FFB800] font-RubikMonoOne-Regular">
                  {item?.name}
                </h2>
                <section className="text-base font-bold mb-10 align-baseline">
                  <div className="flex">
                    <div className="text-[#72DCF7] mb-2 mr-3 text-xs">
                      {t('Age')}
                    </div>
                    <div className="text-lg relative bottom-[6px] font-RubikMonoOne-Regular">
                      {item?.age}
                    </div>
                  </div>
                  <div className="flex text-[#F0DCEF]">
                    <div className="text-[#72DCF7] mb-2 mr-3 text-xs">
                      {t('Birthday')}
                    </div>
                    <div className="text-lg relative bottom-[6px] font-RubikMonoOne-Regular">
                      {item?.birthday}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="text-[#72DCF7] mb-2 mr-3 text-xs">
                      {t('Height')}
                    </div>
                    <div className="text-lg relative bottom-[6px] font-RubikMonoOne-Regular">
                      {item?.height}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="text-[#72DCF7] mb-2 mr-3 text-xs">
                      {t('BloodType')}
                    </div>
                    <div className="text-lg relative bottom-[6px] font-RubikMonoOne-Regular">
                      {item?.bloodType}
                    </div>
                  </div>
                  <div
                    className="font-bold text-base text-[#F0DCEF] bg-[url(/images/aiLandingPage/star.png)] bg-no-repeat pl-[20px]"
                    style={{
                      backgroundSize: '16px',
                      backgroundPosition: 'left 5px',
                      // fontFamily: current === 3 ? 'serif' : 'unset',
                      // fontSize: current === 3 ? '14px' : '16px',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: item?.words.replace(/\<br \/\>/, '') ?? '',
                    }}
                  />
                </section>
              </section>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {children}
    </div>
  );
}
