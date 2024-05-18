import { Flex, Text } from '@chakra-ui/react';
import Image from '@/components/Image';
import { useTranslations } from 'next-intl';
import ShareButton from './components/ShareButton';
import SwipeTip from './components/SwipeTip';
import { format } from 'date-fns';

export const Web3Start = (props: any) => {
  const t = useTranslations('anniversary');
  const { clientHeight = 0, anniversaryInfo } = props;

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
    >
      <ShareButton />
      <Flex mt="32px" color="white" pl="36px" direction="column">
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
          {t('page1Title')}
        </Text>
        <Text mt="44px" flexWrap="wrap">
          {anniversaryInfo.first_login &&
            t('page1FirstLogin', {
              date: `${format(
                new Date(anniversaryInfo.first_login * 1000),
                'yyyy-MM-dd ',
              )}`,
            })}
        </Text>
        <Flex mt="16px" flexWrap="wrap">
          {t.rich('page1Rank', {
            yellow: () => (
              <Text color="#FB9D42" m="0 4px">
                {anniversaryInfo?.rank || ''}
              </Text>
            ),
          })}
        </Flex>
        <Flex mt="16px" flexWrap="wrap">
          {t.rich('page1During', {
            yellow: () => (
              <Text color="#FB9D42" m="0 4px">
                {anniversaryInfo?.during || ''}
              </Text>
            ),
          })}
        </Flex>
        <Image
          src="/images/anniversary/web3-start-logo.png"
          alt=""
          w="117px"
          h="auto"
          mt="36px"
        />
      </Flex>
      {/* 滑动的提示文案 */}
      <SwipeTip />
    </Flex>
  );
};
