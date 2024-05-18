import { Footer } from '@/components/PageLayout';
import { useEffect } from 'react';
import { Banner } from '../Banner';
import { PointUUU } from '../PointUUU';
import PartnersView from './partners';
import TextSwiper from './textSwiper';
import UUUPoint from './uuuPoint';

interface iNewHome {
  bannerList: any;
  recommondDataList: any;
  seoarticle: any;
}
const NewHome = ({ bannerList, recommondDataList, seoarticle }: iNewHome) => {
  useEffect(() => {
    const handleScroll = () => {
      const trueFanDom: any = document.querySelector('#trueFansText');
      if (trueFanDom) {
        const opacity =
          1 -
          scrollY /
            (document.documentElement.scrollHeight - window.innerHeight);
        const tempScrolly = window.scrollY;
        const scaleVal =
          1 -
          (tempScrolly - 300 > 0 ? tempScrolly - 300 : 0) /
            (document.documentElement.scrollHeight - window.innerHeight);
        console.log(opacity);
        trueFanDom.style.opacity = opacity.toString();
        trueFanDom.style.transform =
          'translate(-50%, -50%) scale(' + scaleVal + ')';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="">
      <div className="bg-[#000]">
        <div className="h-[250px] sticky top-[110px] z-[100] left-0 w-full pt-[0px] px-[40px] pb-[0px] text-[#ff0000] llg:h-[150px]">
          <div className="text-[44px] text-[#fff] font-[500] llg:text-[25px]">
            IP Centric Community Layer
          </div>
          <TextSwiper></TextSwiper>
        </div>
        {/* <Banner bannerList={bannerList} /> */}
        <div className="flex relative z-[1] w-full h-[100vh]">
          <video
            loop
            muted
            autoPlay
            key={'videos1'}
            // playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          >
            <source src={'/videos/banner1.mp4'} type="video/mp4" />
          </video>
        </div>
      </div>
      <div className="relative w-full h-min bg-[#000]">
        <div
          id="trueFansBg"
          className="overflow-hidden sticky top-0 w-full h-[100vh] z-[0] llg:h-[300px]"
        >
          <div className="flex rotate-[19deg] opacity-20">
            <video
              className="w-full h-full"
              autoPlay
              muted
              loop
              style={{ boxShadow: '0 0 60px rgba(0,0,0,1)' }}
            >
              <source src="/images/home/new/rotateBg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div
            id="trueFansText"
            className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  w-[80%]"
          >
            <div className="text-[65px] font-[500] text-[#fff] text-center llg:text-[40px] lmd:!text-[30px]">
              #BUIDL THE LAYER WITH{' '}
            </div>
            <div className="text-[65px] font-[500] text-[#ff8000] text-center skew-x-[-10deg] llg:text-[40px] lmd:!text-[30px]">
              TRUE FANS
            </div>
          </div>
        </div>
        <div
          className="relative z-[2] px-[30px] llg:px-[20px]"
          style={{
            background:
              'linear-gradient(180deg,rgba(0, 0, 0, 0) 0%,rgba(0, 0, 0, 0.72) 4.2017481348536005%)',
          }}
        >
          <div className="text-[48px] text-white font-[700] text-center mb-[24px] llg:text-[32px]">
            Proud IP Partners
          </div>

          <PartnersView></PartnersView>

          <div className="text-[#505050] text-[48px] font-[600] flex justify-center items-center mt-[40px] lmd:text-[32px]">
            More to come
          </div>
          <UUUPoint></UUUPoint>
          {/* <PointUUU recommondData={recommondDataList} /> */}
          <Footer bg="#000" seoarticle={seoarticle as any} />
        </div>
      </div>
    </div>
  );
};
export default NewHome;
