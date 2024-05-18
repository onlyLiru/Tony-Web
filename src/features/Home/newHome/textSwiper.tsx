import { Swiper, SwiperSlide } from 'swiper/react';
import {
  A11y,
  Navigation,
  Pagination,
  Scrollbar,
  Mousewheel,
  Autoplay,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRef } from 'react';

const TextSwiper = () => {
  const textArr = [
    {
      text: 'Kumamon',
    },
    {
      text: 'TAISU Project',
    },
    {
      text: 'One Piece',
    },
    {
      text: 'Mushi Production',
    },
    {
      text: 'Dragon Ball Z',
    },
    {
      text: 'Slum Dunk',
    },
    {
      text: 'Ultraman',
    },
    {
      text: 'Hanazawa Kana',
    },
    {
      text: 'Belladona of Sadness',
    },
  ];
  return (
    <div className="">
      <Swiper
        modules={[Pagination, Mousewheel, Scrollbar, Autoplay]}
        onSwiper={(swiper: any) => ((window as any).swiper = swiper)}
        threshold={2}
        spaceBetween={10}
        scrollbar
        className="w-full h-[53px]"
        slidesPerView={1}
        direction="vertical"
        autoplay={{
          delay: 1500,
          stopOnLastSlide: false,
          disableOnInteraction: true,
          reverseDirection: false,
        }}
      >
        {textArr?.map((item: any, index: number) => {
          return (
            <div className="" key={index}>
              <SwiperSlide className="">
                <div className="text-[44px] text-[#fff] font-[500] llg:text-[30px]">
                  {item?.text}
                </div>
              </SwiperSlide>
              ;
            </div>
          );
        })}
      </Swiper>
    </div>
  );
};
export default TextSwiper;
