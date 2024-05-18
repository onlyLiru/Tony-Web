import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';
import { useTranslations } from 'next-intl';

export default function App() {
  const t = useTranslations('landingpage');
  const data: Array<{
    img: string;
    imgC: string;
    director: string;
    name: string;
    bg?: 'long';
  }> = t.raw('personShadows');
  return (
    <>
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        navigation={{
          prevEl: '.preBtn',
          nextEl: '.nextBtn',
        }}
        pagination={{
          clickable: true,
        }}
        loop
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        style={{ margin: '0 40px' }}
      >
        {data.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="relative group">
              <img
                className="w-full"
                src={`/images/aiLandingPage/${item.img}`}
              />
              <div className="absolute top-[200px] left-0 group-hover:top-[320px] group-hover:left-[70px] font-RubikMonoOne-Regular font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                <h3 className="text-[#72DCF7] bg-[url(/images/aiLandingPage/20240130-121701.png)] bg-contain bg-no-repeat px-[10px] pt-[12px] mb-3 box-border w-[230px] h-[60px]">
                  <p
                    className="text-[10px] bg-[url(/images/aiLandingPage/star.png)] bg-no-repeat pl-[20px] bg-left"
                    style={{ backgroundSize: '16px' }}
                  >
                    CHARACTER INTRODUCTION
                  </p>
                  <p className="text-[#FDFE75] text-lg bg-clip-text text-transparent bg-gradient-to-b from-[#FDFE75] to-[#FFB800]">
                    {item.name.toUpperCase()}
                  </p>
                </h3>
                <h3
                  className="text-[#72DCF7] bg-[url(/images/aiLandingPage/20240131-135423.png)] bg-contain bg-no-repeat px-[14px] pt-[10px] pb-[6px] w-[230px] h-[60px]"
                  style={{
                    backgroundImage:
                      item.bg === 'long'
                        ? 'url(/images/aiLandingPage/20240130-121701.png)'
                        : 'url(/images/aiLandingPage/20240131-135423.png)',
                  }}
                >
                  <p
                    className="text-xs bg-[url(/images/aiLandingPage/star.png)] bg-no-repeat pl-[20px] bg-left mb-1"
                    style={{ backgroundSize: '16px' }}
                  >
                    DIRECTOR
                  </p>
                  <p
                    className="text-[#FDFE75] text-[11px] bg-clip-text text-transparent bg-gradient-to-b from-[#FDFE75] to-[#FFB800]"
                    style={{
                      fontSize: item.bg === 'long' ? '11px' : '14px',
                    }}
                  >
                    {item.director.toUpperCase()}
                  </p>
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
