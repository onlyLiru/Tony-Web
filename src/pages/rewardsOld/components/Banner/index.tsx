import { useEffect, useState } from 'react';
import { Box, HStack, useMediaQuery } from '@chakra-ui/react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/router';
import { geBannerList } from '@/services/home';
import BannerItem from './BannerRewardsItem';

const Banner = () => {
  const [list, updateList] = useState([]);
  const router = useRouter();
  const { runAsync } = useRequest(geBannerList, {
    manual: true,
  });

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      loop: false,
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            const abs = slider.track.details.abs;
            const maxIdx = slider.track.details.maxIdx;
            if (abs === maxIdx) {
              slider.moveToIdx(0);
            } else {
              slider.next();
            }
          }, 3000);
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ],
  );

  const getList = async () => {
    let data: any = [];
    try {
      data = await runAsync({
        type: 1,
      });
    } catch (err) {
      console.log(err);
    }
    updateList(data?.data?.list);
  };

  useEffect(() => {
    getList();
  }, [router?.locale]);

  return (
    <>
      {list?.length ? (
        <Box ref={sliderRef} pos="relative" w="full">
          <Box className="keen-slider">
            {list.map((item: any, index: number) => (
              <BannerItem
                key={index}
                data={item}
                styles={{
                  className: 'keen-slider__slide',
                }}
              />
            ))}
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default Banner;
