import { RevealWrapper, RevealList } from 'next-reveal';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
// import Link from 'next/link';
import { Button } from '@chakra-ui/react';
import SliderPerson from './SliderPerson';

function VideoSec({
  current,
  users,
  handleSelect,
}: {
  current: number;
  users: any;
  handleSelect: (key: number) => void;
}) {
  const t = useTranslations('landingpage');
  const characterImgT = t.raw('characterImgT');

  return (
    <div className="bg-[url(/images/aiLandingPage/bg.png)] bg-cover overflow-hidden relative">
      <div className="w-[1440px] h-[740px] mx-auto">
        <div className="absolute left-1/2 z-50 translate-x-[-50%] translate-y-[30px]">
          <img
            className="mx-auto h-[70px]"
            src={`/images/aiLandingPage/${characterImgT.src}`}
            style={{
              height: characterImgT.height,
            }}
          />
        </div>
        <RevealWrapper
          className="load-hidden"
          rotate={{ x: 12, y: 40, z: 0 }}
          origin="left"
          delay={200}
          duration={1000}
          distance="500px"
          reset={true}
          viewOffset={{ top: 25, right: 0, bottom: 10, left: 5 }}
        >
          <SliderPerson {...{ current, handleSelect, users }}>
            <div className="absolute left-[200px] top-[18%] z-50">
              <RevealList interval={60} delay={500} reset>
                <ul>
                  {users.map((item: any, i: number) => (
                    <li
                      key={i}
                      onClick={() => handleSelect(i)}
                      style={{
                        width: '100px',
                        height: '100px',
                        listStyle: 'none',
                        margin: '0 0 30px 0',
                        padding: '0',
                      }}
                      className={classNames(
                        'cursor-pointer hover:scale-125 opacity-60 hover:opacity-100 bg-contain relative',
                        {
                          'opacity-90': current === i,
                          'scale-125': current === i,
                          'z-20': current === i,
                        },
                      )}
                    >
                      <div className="p-[2px]">
                        <img
                          className="w-full h-full relative"
                          src={`/images/aiLandingPage/${item.imgM}`}
                        />
                      </div>
                      <p
                        className={`bg-[url(/images/aiLandingPage/20240130-122746.png)] bg-cover w-full h-full absolute left-0 top-0`}
                      />
                      <h3
                        className="absolute right-0 bottom-2 translate-x-[50%] w-[90px] px-2 py-[3px] text-white text-center bg-[url(/images/aiLandingPage/nameBg.svg)] bg-cover bg-no-repeat scale-[80%] font-RubikMonoOne-Regular"
                        style={{ display: current === i ? 'block' : 'none' }}
                      >
                        {item.name.toUpperCase()}
                      </h3>
                    </li>
                  ))}
                </ul>
              </RevealList>
            </div>
          </SliderPerson>
        </RevealWrapper>

        <div className="absolute z-10 left-0 bottom-12 w-full flex justify-center grayscale">
          <RevealList interval={60} delay={500} reset>
            <Button
              colorScheme="twitter"
              style={{
                background: 'url(/images/aiLandingPage/20240130-122714.png)',
                backgroundSize: 'cover',
                height: '60px',
                width: '200px',
              }}
            >
              Comming Soon
              {/* <Link href={`/chat?id=${current}`}>{t('chatWithMe')}</Link> */}
            </Button>
          </RevealList>
        </div>
      </div>
    </div>
  );
}

export default VideoSec;
