import { Box, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { ShimmerImage } from '@/components/Image';
import 'keen-slider/keen-slider.min.css';
import { useTranslations } from 'next-intl';
import { BNB, ETH } from '@/components/Icon';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getBaseUrl } from '@/utils/getBaseUrl';
import { isProd } from '@/utils';
import * as chain from 'wagmi/chains';
import { getCollectionsList } from '@/services/home';
import { etherTestNet } from '@/contract';

export const MostWorthwhileCollectibleProjects = () => {
  const t = useTranslations('index');
  const [isLargerThan480] = useMediaQuery('(min-width: 480px)');
  const [justifyContentStyle, setJustifyContentStyle] = useState({
    justifyContent: 'flex-start',
  });
  const router = useRouter();
  const [collectionList, setCollectionList] = useState([]);
  const [enteredIndex, setEnteredIndex] = useState([-1, -1]);
  const chainInfo = isProd ? chain.mainnet : etherTestNet;

  useEffect(() => {
    getCollectionsList({
      page: 1,
      limit: 10, // 限制每个集合返回多少个collection项目，防止自定义某个集合项目过多
      page_size: 20,
    }).then((res) => {
      setCollectionList(res);
    });
  }, []);

  useEffect(() => {
    setJustifyContentStyle(
      isLargerThan480
        ? {
            justifyContent: 'flex-start',
          }
        : {
            justifyContent: 'space-around',
          },
    );
  }, [isLargerThan480]);

  return (
    <>
      {collectionList.map((wrapItem: any, wrapIndex) => {
        return (
          <Box
            key={wrapItem.collections_id}
            mt={isLargerThan480 ? '60px' : '32px'}
          >
            {/* <Text fontSize="12px" fontWeight="400">
              Ethereum chain
            </Text> */}
            <Text
              mt="10px"
              fontSize={{ base: '20px', md: '32px' }}
              fontWeight="bold"
            >
              {JSON.parse(wrapItem.collections_title)[router.locale as string]}
            </Text>

            {
              <Flex
                mt="6px"
                flexFlow="row"
                overflowX="scroll"
                // flexFlow={isLargerThan480 ? 'row' : 'wrap'}
                // overflowX={isLargerThan480 ? 'scroll' : 'hidden'}
                scrollBehavior="smooth"
                // {...justifyContentStyle}
              >
                {wrapItem?.collection_list?.map((v: any, index: any) => {
                  return (
                    <Flex
                      cursor="pointer"
                      w={{
                        base: '170px',
                        sm: '170px',
                        md: '170px',
                        xl: '256px',
                      }}
                      minWidth={{
                        base: '170px',
                        sm: '170px',
                        md: '170px',
                        xl: '256px',
                      }}
                      direction="column"
                      // ml={isLargerThan480 ? (index !== 0 ? '20px' : '0') : '0'}
                      ml={index === 0 ? '0' : { md: '16px', base: '10px' }}
                      mt="20px"
                      backgroundColor="#F7F8FA"
                      overflow="hidden"
                      borderBottomRadius="8px"
                      key={index}
                      _hover={{
                        boxShadow: '0px 20px 20px 0px rgba(0, 0, 0, 0.25)',
                      }}
                      onClick={() => {
                        location.href = `${getBaseUrl()}/${
                          router.locale
                        }/collection/${chainInfo.id}/${v?.address}`;
                      }}
                      onMouseEnter={() => {
                        setEnteredIndex([wrapIndex, index]);
                      }}
                      onMouseLeave={() => setEnteredIndex([-1, -1])}
                    >
                      <ShimmerImage
                        w={{
                          base: '170px',
                          sm: '170px',
                          md: '170px',
                          xl: '256px',
                        }}
                        h={{
                          base: '170px',
                          sm: '170px',
                          md: '170px',
                          xl: '256px',
                        }}
                        src={v.image || '/images/home/soldout.png'}
                        borderTopRadius="8px"
                      />
                      <Flex
                        direction="column"
                        px="8px"
                        pb="12px"
                        mb="10px"
                        borderBottomRadius="8px"
                        backgroundColor="#F7F8FA"
                        boxShadow={
                          enteredIndex[0] === wrapIndex &&
                          enteredIndex[1] === index
                            ? '10px 5px 10px rgba(0, 0, 0, 0.25)'
                            : ''
                        }
                      >
                        <Text
                          w="full"
                          h="24px"
                          wordBreak="unset"
                          fontSize="14px"
                          fontWeight="bold"
                          noOfLines={1}
                          mt="16px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {v?.collection_name}
                        </Text>

                        <div className="grid grid-cols-2 gap-1 text-xs text-slate-400 my-1">
                          <div>{t('floor')}</div>
                          <div className="whitespace-nowrap text-ellipsis overflow-hidden">
                            {t('vol')}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-xs font-bold text-slate-900">
                          <div className="whitespace-nowrap text-ellipsis overflow-hidden">
                            {v?.floor_price
                              ? `${parseFloat(v?.floor_price).toFixed(2)}${
                                  v.chain_id === 1 || v.chain_id === 5
                                    ? 'ETH'
                                    : 'BNB'
                                }`
                              : `${
                                  (+v.floor &&
                                    `${+v.floor}${
                                      v.chain_id === 1 || v.chain_id === 5
                                        ? 'ETH'
                                        : 'BNB'
                                    }`) ||
                                  '-'
                                }`}
                          </div>
                          <div className="whitespace-nowrap text-ellipsis overflow-hidden">
                            {v?.volume
                              ? `${parseFloat(v?.volume).toFixed(2)}${
                                  v.chain_id === 1 || v.chain_id === 5
                                    ? 'ETH'
                                    : 'BNB'
                                }`
                              : `${
                                  (+v.volume &&
                                    `${+v.volume}${
                                      v.chain_id === 1 || v.chain_id === 5
                                        ? 'ETH'
                                        : 'BNB'
                                    }`) ||
                                  '-'
                                }`}
                          </div>
                        </div>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            }
          </Box>
        );
      })}
    </>
  );
};
