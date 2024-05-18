import { useEffect, useState } from 'react';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import Image from '@/components/Image';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import speakerIntro from './const/spakerIntro.json';

export const SpeakerIntro = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      loop: true,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
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
          timeout = setTimeout(() => {
            slider.next();
          }, 5000);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLargeScreen(document?.body?.offsetWidth >= 1280);
    }
  }, []);

  const speakerImageNameList = (() => {
    const tempSpeakerImageNameList = [];
    let index = 1;
    // 先构建文件名
    while (index <= 54) {
      tempSpeakerImageNameList.push(`speaker-${index}`);
      index++;
    }
    // 拆分成5个一组的二位数组
    const result = [];
    for (let i = 0, len = tempSpeakerImageNameList.length; i < len; i += 5) {
      result.push(tempSpeakerImageNameList.slice(i, i + 5));
    }
    return result;
  })();
  const tempSpeakerIntroList = [
    speakerIntro.slice(0, 16),
    speakerIntro.slice(16, speakerIntro.length),
  ];

  // UI渲染占位用
  if (isLargeScreen) {
    tempSpeakerIntroList[1]?.push({ name: '', organization: '' });
  }

  return (
    <Box
      boxSizing="content-box"
      pt={120}
      bgImage="url('/images/teamz/teamzSpeakerBg.png')"
      bgSize={{ base: '100% 375px', md: 'cover' }}
      justifyContent="space-around"
      paddingX={{
        md: '100px',
        lg: '160px',
        xl: '160px',
        '2xl': '240px',
        base: '24px',
      }}
      paddingY={{
        md: '60px',
        lg: '100px',
        xl: '110px',
        '2xl': '120px',
        base: '48px',
      }}
    >
      {/* WEB3 SPEAKER标题 */}
      <Text
        fontSize={{ md: '40px', lg: '50px', xl: '60px', base: '30px' }}
        fontWeight={'Bold'}
        textAlign="center"
        color="#AAFF01"
      >
        WEB3 SPEAKER
      </Text>
      {/* banner */}
      <Flex pos="relative" justifyContent="center" w="full" mt={50}>
        <Box ref={sliderRef} w="100%" mb="45px" className="keen-slider">
          {speakerImageNameList.map((item, index) => {
            return (
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                className="keen-slider__slide number-slide1"
                h={{
                  md: '258px',
                  lg: '323px',
                  xl: '340px',
                  '2xl': '388px',
                  base: '194px',
                }}
                w="100%"
                key={`speaker-banner-${index}`}
              >
                {item.map((speaker, speakerIndex) => {
                  return (
                    <Image
                      key={`speaker-${speakerIndex}`}
                      src={`/images/teamz/speakers/${speaker}.png`}
                      width={{
                        md: '164px',
                        lg: '206px',
                        xl: '200px',
                        '2xl': '248px',
                        base: '124px',
                      }}
                    ></Image>
                  );
                })}
              </Flex>
            );
          })}
        </Box>
        {loaded &&
          instanceRef?.current &&
          instanceRef?.current?.track?.details?.slides.length > 1 && (
            <>
              <HStack
                visibility={{
                  md: 'visible',
                  lg: 'visible',
                  '2xl': 'visible',
                  base: 'hidden',
                }}
                spacing={4}
                pos="absolute"
                bottom={{ md: '6px', base: '-10px' }}
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
          )}
      </Flex>
      {/* speaker的名字和组织构成的表格 */}
      <Box
        w="100%"
        maxW={1432}
        margin="0 auto"
        fontSize={{ md: '16px', lg: '16px', xl: '20px', base: '12px' }}
        mt={5}
        color="rgba(255,255,255,0.5)"
      >
        <Flex flexWrap="wrap">
          {tempSpeakerIntroList.map((speakerList, speakerListIndex) => {
            return (
              <Box
                key={`speakerList-${speakerListIndex}`}
                w={{
                  md: '100%',
                  lg: '100%',
                  xl: '50%',
                  '2xl': '50%',
                  base: '100%',
                }}
              >
                {/* 标题栏 */}
                <Flex
                  display={
                    !isLargeScreen && speakerListIndex === 1 ? 'none' : 'block'
                  }
                  flexDirection="row"
                  justifyContent="space-between"
                  h={16}
                  lineHeight="64px"
                  fontWeight="bold"
                >
                  <Flex>
                    <Box
                      overflow="hidden"
                      w={{
                        md: '85px',
                        lg: '133px',
                        xl: '176px',
                        base: '113px',
                      }}
                    >
                      NAME
                    </Box>
                    <Box
                      w={{
                        md: '258px',
                        lg: '329px',
                        xl: '300px',
                        '2xl': '400px',
                        base: '187px',
                      }}
                      ml={{
                        md: '64px',
                        lg: '64px',
                        xl: '32px',
                        '2xl': '50px',
                        base: '27px',
                      }}
                      flex="1"
                    >
                      Organization
                    </Box>
                  </Flex>
                </Flex>
                {/* 分割线 */}
                <Box h="1px" border="1px solid #979797"></Box>
                {/* 表格内容 */}
                {speakerList.map((speaker, speakerIndex) => {
                  return (
                    <Box key={`intro-column-${speakerIndex}`}>
                      <Flex
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        minHeight={16}
                      >
                        <Flex flexDirection="row">
                          <Box
                            w={{
                              md: '85px',
                              lg: '133px',
                              xl: '176px',
                              base: '113px',
                            }}
                            fontWeight="bold"
                          >
                            {speaker?.name}
                          </Box>
                          <Box
                            w={{
                              md: '258px',
                              lg: '329px',
                              xl: '300px',
                              '2xl': '400px',
                              base: '187px',
                            }}
                            ml={{
                              md: '64px',
                              lg: '64px',
                              xl: '32px',
                              '2xl': '50px',
                              base: '27px',
                            }}
                          >
                            {speaker?.organization}
                          </Box>
                        </Flex>
                      </Flex>
                      {/* 分割线 */}
                      <Box h="1px" border="1px solid #979797"></Box>
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};
