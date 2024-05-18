import { ModuleTitle } from '../components';
import {
  Text,
  Box,
  createIcon,
  Stack,
  HStack,
  Flex,
  useMediaQuery,
  Link,
  Center,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Image, { ShimmerImage } from '@/components/Image';
import { useRequest } from 'ahooks';
import { useTranslations } from 'next-intl';
import { getResearchList } from '@/services/home';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { sliceIntoChunks } from '@/utils';

const tagColorMap = [
  {
    borderColor: '#766DF6',
    fontColor: '#544AEC',
  },
  {
    borderColor: '#F5AD22',
    fontColor: '#F5AD22',
  },
  {
    borderColor: '#FE46B9',
    fontColor: '#FE46B9',
  },
];

const BlogIcon = createIcon({
  displayName: 'BlogIcon',
  viewBox: '0 0 24 24',
  path: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="-1.5"
        y="1.5"
        width="13"
        height="13"
        transform="matrix(-1 0 0 1 21 8)"
        stroke="#766DF6"
        strokeWidth="3"
      />
      <rect
        x="-1.5"
        y="1.5"
        width="5"
        height="5"
        transform="matrix(-1 0 0 1 5 0)"
        fill="#766DF6"
        stroke="#766DF6"
        strokeWidth="3"
      />
    </svg>
  ),
});

const BlogItem = ({ data }: { data: any }) => {
  const date = new Date(data?.date * 1000);
  return (
    <NextLink href={data?.link} passHref>
      <Link w="625px" mb="30px !important" target="_blank">
        <Flex
          w="625px"
          h="240px"
          p="24px 30px"
          bg="linear-gradient(135deg, #FBFBFC 0%, rgba(245,244,246,0.5) 100%);"
          border="1px solid rgba(0, 0, 0, 0.1)"
          rounded="30px"
        >
          <Flex direction="column" flex={1} mr="10px">
            <Text
              h="66px"
              fontSize="24px"
              fontWeight="500"
              color="#000000"
              lineHeight="33px"
              noOfLines={2}
              mb="24px"
            >
              {data?.title}
            </Text>
            <Box mb="36px">
              {data?.tags?.map((v: any, i: number) => (
                <Text
                  key={i}
                  display="inline-block"
                  minW="80px"
                  px="27px"
                  h="32px"
                  border={`1px solid ${
                    tagColorMap[i]?.borderColor ?? '#766DF6'
                  }`}
                  borderRadius="6px"
                  fontSize="14px"
                  color={tagColorMap[i]?.fontColor}
                  fontWeight="500"
                  lineHeight="30px"
                  textAlign="center"
                  mr="8px"
                >
                  {v}
                </Text>
              ))}
            </Box>
            <Text fontSize="18px" color="#777E90" lineHeight="22px">
              {format(date, 'yyyy/MM/dd')}
            </Text>
          </Flex>
          <ShimmerImage
            src={data.image_url || '/images/test/blogImg.png'}
            placeholder="blur"
            w="180px"
            h="180px"
            borderRadius="16px"
            objectFit={'cover'}
            border="1px solid rgba(0,0,0,0.1)"
          />
        </Flex>
      </Link>
    </NextLink>
  );
};

const BlogTab = ({
  active,
  onChange,
}: {
  active: number;
  onChange: (v: number) => void;
}) => {
  const t = useTranslations('index');
  const typeMap = [
    {
      text: t('DailySpotlights'),
      type: 1,
    },
    {
      text: t('weekly'),
      type: 2,
    },
    {
      text: t('researchDaily'),
      type: 3,
    },
  ];

  const onChangeTab = (type: number) => {
    return () => {
      onChange(type);
    };
  };

  return (
    <HStack
      spacing={{ md: '32px', base: '11px' }}
      mt={{ md: '40px', base: '0' }}
      mb={{ md: '30px', base: '20px' }}
      justify={{ md: 'flex-start' }}
    >
      {typeMap.map((v: any, i: number) => (
        <Center
          key={i}
          w="auto"
          h={{ md: '52px', base: '32px' }}
          py={{ md: '12px', base: '8px' }}
          px={{ md: '32px', base: '8px' }}
          whiteSpace="nowrap"
          cursor="pointer"
          background={{
            md: '#ffffff',
            base: v?.type === active ? 'rgba(84,74,236,0.12)' : '#F2F2F6',
          }}
          border={{
            md:
              v?.type === active
                ? '1px solid #766DF6'
                : '1px solid rgba(0, 0, 0, 0.2)',
            base: 'none',
          }}
          color={{
            md: v?.type === active ? '#544AEC' : '#000',
            base: v?.type === active ? '#544AEC' : '#777E90',
          }}
          rounded={{ md: '100px', base: '4px' }}
          onClick={onChangeTab(v?.type)}
          ml={{ md: 0, base: '20px' }}
        >
          <Text
            fontSize={{ md: '24px', base: '14px' }}
            lineHeight={{ md: '32px', base: '16px' }}
            fontFamily="PingFangSC-Medium"
          >
            {v?.text}
          </Text>
        </Center>
      ))}
    </HStack>
  );
};

export const LargerBlogArea = (props: any) => {
  const { blogData = [], active = '' } = props;
  return (
    <Stack
      direction={['column', 'row']}
      w={{ md: '1280px', base: '344px' }}
      justifyContent="space-between"
      wrap="wrap"
      spacing="0"
      overflowX="scroll"
      sx={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {(blogData || []).slice(0, 6).map((v: any, i: number) => (
        <BlogItem key={i} data={v} />
      ))}
    </Stack>
  );
};

export const Blogs = ({ blogList }: any) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const t = useTranslations('index');
  const [active, setActive] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [list, updateList] = useState(blogList || []);
  const router = useRouter();
  const { runAsync } = useRequest(getResearchList, {
    manual: true,
  });

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: false,
    slides: {
      spacing: isLargerThan768 ? 0 : -130,
    },
  });

  const initData = async (active: number) => {
    await fetchTypeContent(active);
    setTimeout(() => {
      instanceRef?.current?.update(undefined, 0);
    }, 200);
  };

  /**
   * 获取研究院数据
   * @param type
   * @description type枚举值为1、2、3，分别代表资讯、活动和研报
   */
  const fetchTypeContent = async (type: any) => {
    let response: any = {};
    try {
      response = await runAsync({
        type: type ?? 1,
      });
    } catch (err) {
      console.log(err);
    }
    updateList(response?.data?.list ?? []);
  };

  useEffect(() => {
    if (router?.locale) {
      initData(active);
    }
  }, [active, router?.locale]);

  return (
    <Box maxW={{ md: '1280px' }} mx="auto" mb={{ md: '124px', base: '32px' }}>
      <ModuleTitle
        title={t('blog')}
        iconRender={<BlogIcon />}
        remark={
          isLargerThan768 ? (
            <Image
              position="absolute"
              top="-40px"
              right="80px"
              src="/images/home/research_icon.png"
              w="155px"
              height="135px"
              objectFit="cover"
            />
          ) : null
        }
      />
      {list?.length ? (
        <Box w="full" pt={{ lg: '40px', base: '16px' }}>
          <BlogTab active={active} onChange={setActive} />
          {isLargerThan768 ? (
            <LargerBlogArea blogData={list} active={active} />
          ) : (
            <Box
              ref={sliderRef}
              pos="relative"
              w="full"
              ml="20px"
              overflow="hidden"
            >
              <Box className="keen-slider" overflow="visible !important">
                {list.map((v: any, i: number) => {
                  const date = new Date(v?.date * 1000);
                  return (
                    <Box
                      className="keen-slider__slide"
                      key={i}
                      hidden={!loaded}
                    >
                      <NextLink key={i} href={v?.link} passHref>
                        <Link w="64vw">
                          <Flex
                            direction="column"
                            w="64vw"
                            h="225px"
                            bg="#FAFAFF"
                            rounded="16px"
                          >
                            <ShimmerImage
                              src={v.image_url || '/images/test/blogImg.png'}
                              placeholder="blur"
                              w="64vw"
                              h="135px"
                              objectFit={'cover'}
                              borderTopLeftRadius="16px"
                              borderTopRightRadius="16px"
                            />
                            <Text
                              h="36px"
                              fontSize="12px"
                              color="#000000"
                              lineHeight="18px"
                              noOfLines={2}
                              my="12px"
                              mx="12px"
                              fontWeight="600"
                              fontFamily="PingFangSC-Medium"
                            >
                              {v?.title}
                            </Text>
                            <Flex
                              justify="space-between"
                              align="center"
                              mb="18px"
                              mx="12px"
                            >
                              <Box>
                                {v?.tags?.map((text: any, i: number) => (
                                  <Text
                                    key={i}
                                    display="inline-block"
                                    minW="46px"
                                    h="18px"
                                    background="#F0EFFF"
                                    borderRadius="2px"
                                    fontSize="12px"
                                    color="#544AEC"
                                    fontWeight="500"
                                    lineHeight="18px"
                                    textAlign="center"
                                    mr="5px"
                                    px="4px"
                                    fontFamily="PingFangSC-Medium"
                                  >
                                    {text}
                                  </Text>
                                ))}
                              </Box>
                              <Text
                                fontSize="12px"
                                color="#777E90"
                                lineHeight="12px"
                                fontFamily="PingFangSC-Medium"
                              >
                                {format(date, 'yyyy/MM/dd')}
                              </Text>
                            </Flex>
                          </Flex>
                        </Link>
                      </NextLink>
                    </Box>
                  );
                })}
              </Box>
              {isLargerThan768 &&
                loaded &&
                instanceRef?.current &&
                instanceRef?.current?.track?.details?.slides.length > 1 && (
                  <>
                    <HStack
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
            </Box>
          )}
        </Box>
      ) : null}
    </Box>
  );
};
