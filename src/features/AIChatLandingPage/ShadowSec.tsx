import { RevealWrapper, RevealList } from 'next-reveal';
import { useTranslations } from 'next-intl';
import SliderShadow from './SliderShadow';

function VideoSec() {
  const t = useTranslations('landingpage');

  return (
    <div className=" overflow-hidden bg-[url(/images/aiLandingPage/bg.png)] bg-cover relative">
      <div className="w-[1440px] h-[740px] mx-auto">
        <img
          className="mx-auto w-[300px] relative top-[60px]"
          src={`/images/aiLandingPage/20240130-121945.png`}
        />

        <div className="flex justify-center items-center relative">
          <div className="relative p-12 w-[92%]">
            <SliderShadow />
            <div className="absolute w-full top-0 left-0 z-[1] flex justify-between items-center px-5">
              <div className="preBtn bg-[#DEE2EA] cursor-pointer w-10 h-10 rounded-full flex justify-center items-center translate-y-[300px]">
                <img src="/images/aiLandingPage/20240130-122721.png" />
              </div>
              <div className="nextBtn bg-[#DEE2EA] cursor-pointer w-10 h-10 rounded-full flex justify-center items-center translate-y-[300px]">
                <img
                  src="/images/aiLandingPage/20240130-122721.png"
                  className="rotate-180"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoSec;
