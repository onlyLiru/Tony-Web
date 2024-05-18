import { Flex, Text } from '@chakra-ui/react';
import Image from '@/components/Image';
import { useTranslations } from 'next-intl';
import ShareButton from './components/ShareButton';
import SwipeTip from './components/SwipeTip';

export const UUUPoints = (props: any) => {
  const t = useTranslations('anniversary');
  const { clientHeight = 0, anniversaryInfo } = props;
  return (
    <Flex
      direction="column"
      position="relative"
      overflow="auto"
      fontWeight="bold"
      height={`${clientHeight}px`}
      paddingTop="12px"
      backgroundImage={`url('/images/anniversary/bg.jpeg')`}
      backgroundSize="100% 100%"
      color="white"
    >
      <ShareButton />
      <Flex fontSize="24px" mt="32px" pl="36px" direction="column">
        <Text
          fontSize="30px"
          fontWeight="bold"
          background="linear-gradient(180deg, rgba(255,255,255,0.46) 0%, #FFFFFF 100%)"
          backgroundClip="text"
          sx={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('page2Title')}
        </Text>
        <Text mt="44px">{t('page2InThisYear')}</Text>
        <Flex mt="0px" flexWrap="wrap">
          {t.rich('page2Point', {
            yellow: () => (
              <Text color="#FB9D42" m="0 4px">
                {anniversaryInfo?.in_score || ''}
              </Text>
            ),
          })}
        </Flex>
        <Text fontSize="14px" fontWeight="400">
          {t('page2Percent', {
            percent: anniversaryInfo?.in_percent || 0,
          })}
        </Text>
        <Flex mt="48px" flexWrap="wrap">
          {t.rich('page2UsedPoint', {
            yellow: () => (
              <Text color="#FB9D42" m="0 4px">
                {anniversaryInfo?.out_score || 0}
              </Text>
            ),
          })}
        </Flex>
        <Image
          src="/images/anniversary/UUU-point-logo.png"
          alt=""
          w="134px"
          h="auto"
          mt="44px"
        />
      </Flex>
      {/* 滑动的提示文案 */}
      <SwipeTip />
    </Flex>
  );
};
