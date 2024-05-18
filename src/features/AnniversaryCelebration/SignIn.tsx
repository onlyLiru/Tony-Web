import { Flex, Text } from '@chakra-ui/react';
import Image from '@/components/Image';
import { useTranslations } from 'next-intl';
import ShareButton from './components/ShareButton';
import SwipeTip from './components/SwipeTip';

export const SignIn = (props: any) => {
  const t = useTranslations('anniversary');
  const { clientHeight = 0, anniversaryInfo } = props;
  const boldFont = {
    fontSize: '24px',
    fontWeight: 'bold',
  };
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
      <Flex mt="32px" pl="36px" direction="column">
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
          {t('page3Title')}
        </Text>
        <Text mt="44px">{t('page3Content')}</Text>
        <Flex mt="12px" {...boldFont} flexWrap="wrap">
          {t.rich('page3SignDays', {
            yellow: () => (
              <Text color="#FB9D42" m="0 4px">
                {anniversaryInfo?.sign_days || ''}
              </Text>
            ),
          })}
        </Flex>
        {/* <Text {...boldFont}>风雨无阻</Text> */}
        <Text mt="12px">
          {t('page3Percent', {
            percent: anniversaryInfo?.sign_percent || 0,
          })}
        </Text>
        <Flex mt="44px" flexWrap="wrap">
          {t.rich('page3Point', {
            yellow: () => (
              <Text color="#FB9D42" m="0 4px">
                {anniversaryInfo?.sign_score || 0}
              </Text>
            ),
          })}
        </Flex>
        <Text mt="12px">{t('page3Tip')}</Text>
        <Image
          src="/images/anniversary/sign-in-logo.png"
          alt=""
          w="118px"
          h="auto"
          mt="44px"
        />
      </Flex>
      {/* 滑动的提示文案 */}
      <SwipeTip />
    </Flex>
  );
};
