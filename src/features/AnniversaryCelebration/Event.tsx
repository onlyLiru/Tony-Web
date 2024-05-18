import { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import ShareButton from './components/ShareButton';
import SwipeTip from './components/SwipeTip';
import Slider from 'react-slick';
import { useTranslations } from 'next-intl';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export const Event = (props: any) => {
  const t = useTranslations('anniversary');
  const { clientHeight = 0, eventItem } = props;
  const { srcList, title, content } = eventItem;
  const [slider, setSlider] = useState<Slider | null>(null);

  const boldFont = {
    fontSize: '18px',
    fontWeight: 'bold',
  };

  useEffect(() => {
    console.log(slider);
  }, [slider]);
  return (
    <Flex
      direction="column"
      position="relative"
      overflow="auto"
      fontSize="14px"
      height={`${clientHeight}px`}
      paddingTop="12px"
      backgroundImage={`url('/images/anniversary/bg.jpeg')`}
      backgroundSize="100% 100%"
      color="white"
    >
      <ShareButton />
      <Flex mt="32px" pl="35px" pr="32px" direction="column">
        <Text
          fontSize="30px"
          fontWeight="bold"
          background="linear-gradient(180deg, rgba(0,0,0,0.46) 0%, #FFFFFF 100%)"
          backgroundClip="text"
          sx={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('page6Title')}
        </Text>
        <Text mt="44px" {...boldFont}>
          {title}
        </Text>
      </Flex>
      {/* 轮播图 */}
      <Box p="0 36px" mt="20px">
        <Box position={'relative'} width={'full'}>
          {/* Slider */}
          <Slider {...settings} ref={(slider: any) => setSlider(slider)}>
            {srcList.map((url: any, index: number) => (
              <Box
                borderRadius="8px"
                key={index}
                minHeight="195px"
                position="relative"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                backgroundImage={`url(${url})`}
              />
            ))}
          </Slider>
        </Box>
        <Text
          mt="46px"
          pb="8px"
          fontWeight="bold"
          color="rgba(255,255,255,0.8)"
        >
          {content}
        </Text>
        {/* {EVENTS_LIST[currentSlideIndex]?.milestone.map((item, index) => {
          return (
            <Box mt="12px" key={index}>
              <Text
                p="4px 6px"
                color="white"
                display="inline-block"
                backgroundColor="rgba(255,255,255,0.2)"
                borderRadius="4px"
              >
                {item.date}
              </Text>
              <Text mt="8px" color="rgba(255,255,255,0.6)">
                {item.desc}
              </Text>
            </Box>
          );
        })} */}
      </Box>
      {/* 滑动的提示文案 */}
      <SwipeTip />
    </Flex>
  );
};
