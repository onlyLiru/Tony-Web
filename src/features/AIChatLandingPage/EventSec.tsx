import { useTranslations } from 'next-intl';
import Slider from './Slider';

function VideoSec() {
  const t = useTranslations('landingpage');

  return (
    <div className=" overflow-hidden bg-[url(/images/aiLandingPage/bg.png)] bg-cover relative">
      <div className="w-[1440px] h-[670px] mx-auto">
        <img
          className="mx-auto mt-[80px] w-[600px]"
          src={`/images/aiLandingPage/20240130-122708.png`}
        />
        <div className="relative top-[20px] px-9">
          <Slider />
          <div className="absolute w-full h-full top-0 left-0 z-[-1] flex justify-between items-center px-5">
            <div className="preBtn2 bg-[#DEE2EA] cursor-pointer w-10 h-10 rounded-full flex justify-center items-center">
              <img src="/images/aiLandingPage/20240130-122721.png" />
            </div>
            <div className="nextBtn2 bg-[#DEE2EA] cursor-pointer w-10 h-10 rounded-full flex justify-center items-center">
              <img
                src="/images/aiLandingPage/20240130-122721.png"
                className="rotate-180"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoSec;
