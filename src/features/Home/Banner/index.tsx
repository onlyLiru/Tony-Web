import { useEffect, useState, useRef } from 'react';
import { Box, HStack, useMediaQuery } from '@chakra-ui/react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/router';
import { geBannerList } from '@/services/home';
import BannerItem from './BannerItem';

export const Banner = ({ bannerList }: any) => {
  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [list, updateList] = useState(bannerList || []);
  const router = useRouter();
  const { runAsync } = useRequest(geBannerList, {
    manual: true,
  });

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      loop: false,
      slides: {
        // spacing: isLargerThan768 ? 0 : -50,
      },
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
          if (slider.track.details.abs === 0) {
            timeout = setTimeout(() => {
              const abs = slider.track.details.abs;
              const maxIdx = slider.track.details.maxIdx;
              console.log(abs);
              console.log(maxIdx);
              if (abs === maxIdx) {
                slider.moveToIdx(0);
              } else {
                slider.next();
              }
            }, 10000);
          } else {
            timeout = setTimeout(() => {
              const abs = slider.track.details.abs;
              const maxIdx = slider.track.details.maxIdx;
              console.log(abs);
              console.log(maxIdx);
              if (abs === maxIdx) {
                slider.moveToIdx(0);
              } else {
                slider.next();
              }
            }, 3000);
          }
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
    const videoData = {
      video: '/videos/banner.mp4',
      image_url: '',
      link: '',
      logo: '',
      mobile_banner: '',
      mobile_desc: '',
      mobile_tag: '',
      mobile_title: '',
      offline: '',
      online: '',
      subtitle: '',
      title: '',
    };
    let data: any = [];
    try {
      data = await runAsync();
      data?.data?.list.unshift(videoData);
    } catch (err) {
      console.log(err);
    }
    updateList(data?.data?.list);
  };

  useEffect(() => {
    getList();
  }, [router?.locale]);

  console.log(list);

  return (
    <>
      {list?.length ? (
        <>
          {isLargerThan768 ? (
            <Box ref={sliderRef} pos="relative" w="full">
              <Box className="keen-slider" overflow="visible !important">
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
              <Box
                w={'600px'}
                position={'absolute'}
                left="22%"
                top="30%"
                color={'#fff'}
              >
                <Box fontSize={'60px'} lineHeight={'66px'} fontWeight={'600'}>
                  THE{' '}
                  <span style={{ color: 'rgba(228, 159, 92, 1)' }}>
                    IP CENTRIC
                  </span>{' '}
                  COMMUNITY LAYER
                </Box>
                <Box>
                  We aim to create a culturally infused{' '}
                  <span style={{ color: 'rgba(228, 159, 92, 1)' }}>
                    community layer
                  </span>{' '}
                  that fosters unity, inclusivity, and empowers users to freely
                  express themselves, collaborate, and unlock the limitless
                  potential of collective synergy.{' '}
                </Box>
                <Box
                  mt={'34px'}
                  color={'rgba(228, 159, 92, 1)'}
                  fontWeight={'900'}
                >
                  At UneMeta, We Celebrate Creativity and Share Culture with
                  Heart.
                </Box>
                <>
                  <HStack
                    spacing={4}
                    mt={'24px'}
                    // pos="absolute"
                    // bottom={'24%'}
                    // left={'22%'}
                    // bottom={{ md: '6px', base: '-10px' }}
                    w="full"
                    justify="left"
                  >
                    {[
                      ...Array(
                        instanceRef?.current?.track?.details?.slides.length,
                      ).keys(),
                    ].map((idx) => (
                      <Box
                        key={idx}
                        onClick={() => {
                          instanceRef?.current?.moveToIdx(idx);
                        }}
                        w="8px"
                        h="8px"
                        rounded="full"
                        bg="#BBB6C9"
                        opacity={currentSlide === idx ? 1 : 0.4}
                      />
                    ))}
                  </HStack>
                </>
                <Box
                  onClick={() =>
                    window.open(
                      'https://discord.com/invite/YzztkC6ENe',
                      '_blank',
                    )
                  }
                  mt={'34px'}
                  w={'264px'}
                  h={'48px'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  bg="rgba(228, 159, 92, 1)"
                  borderRadius={'12px'}
                  color={'#000'}
                  cursor={'pointer'}
                >
                  Join Community
                </Box>
              </Box>
              {/* {loaded &&
                isLargerThan768 &&
                instanceRef?.current &&
                instanceRef?.current?.track?.details?.slides.length > 1 && (
                  <>
                    <HStack
                      spacing={4}
                      pos="absolute"
                      bottom={'24%'}
                      left={'22%'}
                      // bottom={{ md: '6px', base: '-10px' }}
                      w="full"
                      justify="left"
                    >
                      {[
                        ...Array(
                          instanceRef?.current?.track?.details?.slides.length,
                        ).keys(),
                      ].map((idx) => (
                        <Box
                          key={idx}
                          onClick={() => {
                            instanceRef?.current?.moveToIdx(idx);
                          }}
                          w="8px"
                          h="8px"
                          rounded="full"
                          bg="#BBB6C9"
                          opacity={currentSlide === idx ? 1 : 0.4}
                        />
                      ))}
                    </HStack>
                  </>
                )} */}
              <Box
                display={{ md: 'block', base: 'none' }}
                pos="absolute"
                w="340px"
                h="700px"
                left="-81px"
                top="-30px"
                bgColor="#D4CBF7"
                opacity={0.7}
                filter="blur(100px)"
                transform="rotate(30.12deg);"
                zIndex={-1}
              ></Box>
              <Box
                display={{ md: 'block', base: 'none' }}
                pos="absolute"
                w="344px"
                h="321px"
                left="85px"
                top="340px"
                bgColor="#E1CAE5"
                opacity={0.7}
                filter="blur(100px)"
                transform="rotate(25.77deg);"
                zIndex={-1}
              ></Box>
              <Box
                display={{ md: 'block', base: 'none' }}
                pos="absolute"
                w="317px"
                h="663px"
                right="-81px"
                top="-30px"
                bgColor="#E4D6E3"
                opacity={0.5}
                filter="blur(100px)"
                transform="rotate(-20deg);"
                zIndex={-1}
              ></Box>
            </Box>
          ) : (
            <Box ref={sliderRef} pos="relative" w="full" h={'718px'}>
              <Box className="keen-slider" overflow="visible !important">
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
              <Box
                w={'100%'}
                position={'absolute'}
                left="0%"
                bottom="0"
                color={'#fff'}
                px={'10px'}
                textAlign={'center'}
              >
                <Box fontSize={'36px'} lineHeight={'40px'} fontWeight={'600'}>
                  THE{' '}
                  <span style={{ color: 'rgba(228, 159, 92, 1)' }}>
                    IP CENTRIC
                  </span>{' '}
                  COMMUNITY LAYER
                </Box>
                <Box>
                  We aim to create a culturally infused{' '}
                  <span style={{ color: 'rgba(228, 159, 92, 1)' }}>
                    community layer
                  </span>{' '}
                  that fosters unity, inclusivity, and empowers users to freely
                  express themselves, collaborate, and unlock the limitless
                  potential of collective synergy.{' '}
                </Box>
                <Box
                  mt={'24px'}
                  color={'rgba(228, 159, 92, 1)'}
                  fontWeight={'900'}
                >
                  At UneMeta, We Celebrate Creativity and Share Culture with
                  Heart.
                </Box>
                <Box
                  onClick={() =>
                    window.open(
                      'https://discord.com/invite/YzztkC6ENe',
                      '_blank',
                    )
                  }
                  m={'0 auto'}
                  mt={'34px'}
                  w={'264px'}
                  h={'48px'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  bg="rgba(228, 159, 92, 1)"
                  borderRadius={'12px'}
                  color={'#000'}
                  cursor={'pointer'}
                >
                  Join Community
                </Box>
                <>
                  <HStack
                    spacing={4}
                    mt={'24px'}
                    mb={'24px'}
                    // pos="absolute"
                    // bottom={'24%'}
                    // left={'22%'}
                    // bottom={{ md: '6px', base: '-10px' }}
                    w="full"
                    justify="center"
                  >
                    {[
                      ...Array(
                        instanceRef?.current?.track?.details?.slides.length,
                      ).keys(),
                    ].map((idx) => (
                      <Box
                        key={idx}
                        onClick={() => {
                          instanceRef?.current?.moveToIdx(idx);
                        }}
                        w="8px"
                        h="8px"
                        rounded="full"
                        bg="#BBB6C9"
                        opacity={currentSlide === idx ? 1 : 0.4}
                      />
                    ))}
                  </HStack>
                </>
              </Box>
              <Box
                display={{ md: 'block', base: 'none' }}
                pos="absolute"
                w="340px"
                h="700px"
                left="-81px"
                top="-30px"
                bgColor="#D4CBF7"
                opacity={0.7}
                filter="blur(100px)"
                transform="rotate(30.12deg);"
                zIndex={-1}
              ></Box>
              <Box
                display={{ md: 'block', base: 'none' }}
                pos="absolute"
                w="344px"
                h="321px"
                left="85px"
                top="340px"
                bgColor="#E1CAE5"
                opacity={0.7}
                filter="blur(100px)"
                transform="rotate(25.77deg);"
                zIndex={-1}
              ></Box>
              <Box
                display={{ md: 'block', base: 'none' }}
                pos="absolute"
                w="317px"
                h="663px"
                right="-81px"
                top="-30px"
                bgColor="#E4D6E3"
                opacity={0.5}
                filter="blur(100px)"
                transform="rotate(-20deg);"
                zIndex={-1}
              ></Box>
            </Box>
          )}
        </>
      ) : null}
    </>
  );
};
