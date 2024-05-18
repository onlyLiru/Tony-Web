import { useEffect, useState } from 'react';
import { ModuleTitle } from '../components';
import {
  Box,
  Text,
  createIcon,
  Flex,
  Stack,
  HStack,
  useMediaQuery,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { ShimmerImage } from '@/components/Image';

const TitleIcon = createIcon({
  displayName: 'RecommondIcon',
  viewBox: '0 0 30 22',
  path: (
    <svg
      width="30"
      height="22"
      viewBox="0 0 30 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        r="6.52533"
        transform="matrix(0.919626 -0.392796 -0.392796 -0.919626 11.0288 11.4554)"
        stroke="#766DF6"
        strokeWidth="3"
      />
      <circle
        r="3.45852"
        transform="matrix(0.919626 -0.392796 -0.392796 -0.919626 24.1487 5.85143)"
        stroke="#766DF6"
        strokeWidth="2"
      />
    </svg>
  ),
});

export const Introduce = () => {
  const [loaded, setLoaded] = useState(false);
  const t = useTranslations('index');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      loop: true,
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

  const renderContent = (t: any) => (
    <>
      {t.raw('Buddy.item')?.map((el: any, i: number) => (
        <Flex
          className="keen-slider__slide"
          key={i}
          direction="row"
          align="center"
          zIndex={10}
          justify="center"
        >
          <ShimmerImage
            placeholder="blur"
            src={el.image}
            w={'100px'}
            h={'100px'}
            bgColor="#fff"
            objectFit={'cover'}
            rounded="full"
            mr={{ md: '16px', base: '22px' }}
            border={{ md: '1px solid #DCD2F8', base: '' }}
          />
          <Flex direction="column">
            <Text
              fontSize={{ md: '22px', base: '16px' }}
              fontWeight={700}
              lineHeight={{ md: '30px', base: '24px' }}
              mb={{ md: '12px', base: '10px' }}
              w={{ md: '200px', base: '100px' }}
            >
              {el.title}
            </Text>
            <Text
              fontSize={{ md: '16px', base: '12px' }}
              fontWeight={400}
              lineHeight={{ md: '28px', base: '16px' }}
              color="#9895A7"
              align="left"
              w={{ md: '160px', base: '120px' }}
            >
              {el.desc}
            </Text>
          </Flex>
        </Flex>
      ))}
    </>
  );
  return (
    <Box
      bg="linear-gradient(180deg, #F7F5FD 0%, #FDFCFD 79.31%)"
      w="full"
      pt={{ md: '72px', base: '40px' }}
      pb={{ md: '125px', base: '54px' }}
      rounded={{ md: '50px 50px 0 0', base: '32px 32px 0 0' }}
    >
      <ModuleTitle
        title={`UneMeta-${t('Buddy.title')}`}
        iconRender={<TitleIcon />}
      />
      <Box
        w="full"
        mt={{ md: '40px', base: '0' }}
        px={{ xl: '160px', lg: '80px', md: '40px' }}
      >
        <Stack
          w="full"
          justify="space-between"
          pos="relative"
          maxW="1090px"
          mx="auto"
          px={{ md: '40px', base: '0' }}
          pt={{ md: '40px', base: '0' }}
          direction={{ md: 'row', base: 'column' }}
          spacing={{ md: '0', base: '30px' }}
        >
          <Box
            pos="absolute"
            top="0"
            left="0"
            right="0"
            h="260px"
            rounded="400px"
            bg="linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.3) 100%)"
            display={{ md: 'block', base: 'none' }}
          >
            <ShimmerImage
              pos="absolute"
              left={{ lg: '-65px', md: '-40px' }}
              top="0"
              placeholder="blur"
              src="/images/home/dashed.png"
              w="340px"
              h="260px"
              objectFit={'cover'}
            />
            <ShimmerImage
              pos="absolute"
              right={{ lg: '-65px', md: '-40px' }}
              top="0"
              transform="rotateY(180deg)"
              placeholder="blur"
              src="/images/home/dashed.png"
              w="340px"
              h="260px"
              objectFit={'cover'}
            />
          </Box>
          {isLargerThan768 ? (
            renderContent(t)
          ) : (
            <Box ref={sliderRef} pos="relative" w="full">
              <Box className="keen-slider" overflow="visible !important">
                {renderContent(t)}
              </Box>
              {loaded &&
                instanceRef?.current &&
                instanceRef?.current?.track?.details?.slides.length > 1 && (
                  <>
                    <HStack
                      spacing={4}
                      pos="absolute"
                      bottom={{ md: '6px', base: '-20px' }}
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
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
