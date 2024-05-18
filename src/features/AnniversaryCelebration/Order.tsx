import { Box, Flex, Text } from '@chakra-ui/react';
import Image from '@/components/Image';
import { useTranslations } from 'next-intl';
import ShareButton from './components/ShareButton';
import SwipeTip from './components/SwipeTip';
import { useEffect, useState } from 'react';

export const Order = (props: any) => {
  const t = useTranslations('anniversary');
  const { clientHeight = 0, anniversaryInfo } = props;
  const [dealNFTsList, setDealNFTsList] = useState<[any[], any[]]>([[], []]);
  useEffect(() => {
    if (Array.isArray(anniversaryInfo?.deal_nfts)) {
      // 只显示前6个挂单
      setDealNFTsList([
        anniversaryInfo.deal_nfts.slice(0, 3),
        anniversaryInfo.deal_nfts.slice(3, 6),
      ]);
    }
  }, [anniversaryInfo?.deal_nfts]);

  const boldFont = {
    fontSize: '22px',
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
      <Flex mt="32px" pl="35px" pr="32px" direction="column">
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
          {t('page5Title')}
        </Text>
        <Flex mt="44px" wrap="wrap" {...boldFont}>
          {t.rich('page5OrderCount', {
            yellow: () => (
              <Text color="#FB9D42" m="0 4px">
                {anniversaryInfo?.make_order_count || 0}
              </Text>
            ),
          })}
        </Flex>
        <Text mt="0">
          {t('page5Percent', {
            percent: anniversaryInfo?.make_order_percent || 0,
          })}
        </Text>
        {anniversaryInfo?.deal_nfts?.length > 0 && (
          <Text mt="50px">{t('page5Tip')}</Text>
        )}
      </Flex>
      {/* 挂单的NFT */}
      <Flex direction="column" pl="35px" pr="23px">
        {dealNFTsList.map((deals, dealsIndex) => {
          return (
            <Flex justifyContent="space-between" mt="24px" key={dealsIndex}>
              {deals.map((deal, dealIndex) => {
                return (
                  <Box w="100px" key={dealIndex}>
                    <Image
                      src={deal?.image}
                      alt=""
                      borderRadius="4px"
                      fallbackSrc="https://res.cloudinary.com/unemeta/image/upload/f_auto/f_auto/f_auto,q_auto/v1/samples/i6sqns3vhvez0m54bk9u"
                    />
                    <Text mt="2px" className="ellipsis" fontWeight="bold">
                      {deal?.title}
                    </Text>
                    <Text className="ellipsis">{deal?.collection}</Text>
                  </Box>
                );
              })}
            </Flex>
          );
        })}
      </Flex>
      {/* 滑动的提示文案 */}
      <SwipeTip />
    </Flex>
  );
};
