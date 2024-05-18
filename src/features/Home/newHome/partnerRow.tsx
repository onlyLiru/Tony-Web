import IconView from '@/components/iconView';
import classNames from 'classnames';
import { Mousewheel, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

/* eslint-disable @next/next/no-img-element */
interface iPartnersRow {
  topImgUrl?: string;
  rowClassName?: string;
  link?: string;
  swiperArr: {
    imgUrl: string;
  }[];
}
const PartnersRow = ({
  topImgUrl,
  rowClassName,
  swiperArr,
  link,
}: iPartnersRow) => {
  return (
    <div
      className={classNames(
        'p-[16px] w-full opacity-[100] shadow-xl hover:partnersShadow duration-300 rounded-[40px] hover:scale-105',
        rowClassName,
      )}
    >
      <div className="flex justify-center items-center mb-[40px] w-full lmd:mb-[10px]">
        <img
          className="object-contain w-full h-[75px] max-w-[500px] lmd:h-[38px]"
          src={topImgUrl}
          alt=""
        />
      </div>
      <div className="">
        <Swiper
          modules={[Pagination, Mousewheel, Navigation, Scrollbar]}
          onSwiper={(swiper: any) => ((window as any).swiper = swiper)}
          threshold={2}
          spaceBetween={10}
          scrollbar
          autoPlay
          className="w-full h-[526px] rounded-[20px] llg:h-[300px] lmd:!h-[213px]"
          slidesPerView={1}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          pagination={{
            clickable: true,
            // el: '.my-swiper-pagination',
            // type: 'custom',
          }}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 0.1,
            releaseOnEdges: true,
          }}
        >
          {swiperArr?.map((item: any, index: number) => {
            return (
              <SwiperSlide className={classNames('w-full h-full')} key={index}>
                <img
                  src={item?.imgUrl}
                  alt=""
                  className="object-cover w-full h-full cursor-pointer select-none"
                  onClick={() => {
                    debugger;
                    if (link) {
                      window.open(link, '_blank');
                    }
                  }}
                ></img>
              </SwiperSlide>
            );
          })}
          <IconView
            className="swiper-button-prev"
            type="swiperArrowLeft"
          ></IconView>
          <IconView
            className="swiper-button-next"
            type="swiperArrowRight"
          ></IconView>
        </Swiper>
      </div>
    </div>
  );
};
export default PartnersRow;
