import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { event } from '@/features/Analytics';
import { eventClick } from '@/const/chatLog';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import './styles.css';

// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules';

export default function App() {
  const t = useTranslations('landingpage');
  const handleClick = (link: string) => {
    event(eventClick);
    // link && router.push(link);
    if (link) {
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = link;
      a.click();
      return a.remove();
    }
  };

  const data: Array<{ text: string; link: string; btnText: string }> =
    t.raw('events');

  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        loop
        navigation={{
          prevEl: '.preBtn2',
          nextEl: '.nextBtn2',
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        style={{ margin: '0 40px' }}
      >
        {data.map((item, i) => (
          <SwiperSlide
            key={i}
            style={{
              height: '380px',
              width: '303px',
              display: 'flex',
            }}
            className={classNames(
              'bg-[url(/images/aiLandingPage/20240130-122752.png)] bg-cover flex justify-center items-center text-white text-2xl relative',
            )}
          >
            <div className="w-[60%] text-center">
              <h3 className="font-RubikMonoOne-Regular text-base font-bold">
                {item.text}
              </h3>
              <div className="absolute bottom-9 left-[50%] translate-x-[-50%]">
                <button
                  style={{
                    backgroundColor: item.link.length ? '#72DCF7' : '#BCBBDB',
                    cursor: item.link.length ? 'pointer' : 'auto',
                    color: item.link.length ? '#3E0C5D' : 'gray',
                  }}
                  onClick={() => handleClick(item.link)}
                  className="font-RubikMonoOne-Regular rounded-md text-sm px-2 py-1 w-[150px]"
                >
                  {item.btnText}
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
