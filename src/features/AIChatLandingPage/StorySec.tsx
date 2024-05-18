import { useTranslations } from 'next-intl';

function StorySec() {
  const t = useTranslations('landingpage');
  const storyImgT = t.raw('storyImgT');

  return (
    <div className="overflow-hidden bg-[url(/images/aiLandingPage/storyBg.png)] bg-cover relative bg-[rgba(0,0,0,0.9)]">
      <div className="w-[1440px] mx-auto h-[740px]">
        <div className="flex flex-col items-center justify-around mt-[18rem]">
          <img
            className="mx-auto"
            src={`/images/aiLandingPage/${storyImgT.src}`}
            style={{
              height: storyImgT.height,
            }}
          />
          <div
            className="w-[640px] h-[410px] text-[#DFE5FF] text-center flex jusitfy-center items-center bg-[url(/images/aiLandingPage/20240130-122733.png)] "
            style={{
              backgroundSize: '110%',
              backgroundPosition: '-14px -40px',
            }}
          >
            <p className="mx-[60px] text-left overflow-x-scroll">
              {t('story')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StorySec;
