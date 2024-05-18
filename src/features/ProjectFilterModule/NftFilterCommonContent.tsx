import { ExploreNftItem } from '@/features/AssetItem';
import { useUserDataValue } from '@/store';
import { toLower } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import useInfiniteScroll, { Service, Data } from '@/hooks/useInfiniteScroll';
import {
  Box,
  Text,
  Center,
  SimpleGrid,
  Button,
  Flex,
  Square,
  Avatar,
  Image,
  Tooltip,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  FilterContainer,
  NftFilterForm,
  NftTopFilterBar,
} from '@/features/ProjectFilterModule';
import { NftFilterStatusBar } from './NftFilterStatusBar';
import { useUpdateEffect, useRequest } from 'ahooks';
import { darkText } from '@/utils/darkColor';
import { useIsRare } from '@/store';
import * as marketApis from '@/services/market';
import NexLink from 'next/link';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { useChainId } from 'wagmi';

export function parseCommonContentRequestParams(p: any) {
  if (p.is_sell) {
    p.is_sell = p.is_sell === 'true';
  }
  if (p.order_type) {
    p.order_type = Number(p.order_type);
  }
  if (p.low) {
    p.low = Number(p.low);
  }
  if (p.high) {
    p.high = Number(p.high);
  }
  if (p.attrs) {
    p.attrs = JSON.parse(decodeURIComponent(p.attrs));
  }
}
interface AvatarData {
  name: string;
  description: string;
  link: string;
  icon: string;
  wallet: string;
}

export function NftFilterCommonContent({
  request,
  params = {},
}: {
  request: Service<Data>;
  params?: Record<string, any>;
}) {
  const t = useTranslations('common');
  const { state } = useContext(NftFilterForm.Context);
  const chainId = useChainId();
  const { data, isEmpty, loadMoreWhenError, isError, isLoading, pageSize } =
    useInfiniteScroll(request, {
      isNoMore: (d) => d?.noMore!,
      reloadDeps: [state, params, { chain_id: chainId }],
      pageSize: 20,
      threshold: 248,
    });

  const userData = useUserDataValue();

  const hideBuyButton = useCallback(
    (ownerAddress: string) =>
      toLower(userData?.wallet_address) === toLower(ownerAddress),
    [userData?.wallet_address],
  );

  const { isSmallCard, isOpen } = useContext(FilterContainer.Context);

  const { reset } = useContext(NftFilterForm.Context);
  const { visitChain } = useSwitchChain();
  useUpdateEffect(() => {
    reset();
    window.scrollTo(0, 0);
  }, [chainId]);

  // 稀有信息展示数据
  const [hoverData, setHoverData] = useState({
    icon: '',
    title: '',
    link: '',
    description: '',
  });
  const [topOwners, setTopOwners] = useState<any>([]);
  const [isRare] = useIsRare();

  const { run } = useRequest(marketApis.collectionRareInfo, {
    manual: true,
    defaultParams: [
      {
        address: params.address,
        rare_type: [], //type数据从state.attrs获取
        chain_id: visitChain.id,
      },
    ],
    onSuccess: ({ data }) => {
      if (data.rare_info_list && data.rare_info_list[0]) {
        setHoverData(data.rare_info_list[0]);
      }
      if (data.user_list) {
        setTopOwners(data.user_list);
      }
    },
  });
  useEffect(() => {
    if (isRare) {
      const { attrs } = state;
      let formatArrts: string[] = [];
      if (attrs && typeof attrs === 'string') {
        formatArrts = JSON.parse(decodeURIComponent(attrs)).map(
          (item: any) => item.trait_type,
        );
      }
      run({
        address: params.address,
        rare_type: formatArrts || [],
        chain_id: visitChain.id,
      });
    }
  }, [isRare, state]);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  return (
    <FilterContainer
      topExtraContent={<NftTopFilterBar />}
      filterContent={<NftFilterForm />}
      onModalClose={reset}
    >
      <NftFilterStatusBar
        px={{ base: 5, md: isOpen ? 0 : 8 }}
        mb={{ base: '10px', md: 0 }}
      />
      {/* 稀有模式下显示简介 start*/}
      {isRare ? (
        <Flex
          color="white"
          px={{ base: 5, md: isOpen ? 5 : 8 }}
          pt={{ base: 0, md: '20px' }}
          pb={{ base: '64px', md: 0 }}
          hidden={!isLargerThan768}
          // visibility={isRare?'visible':'hidden'}
        >
          <Square>
            <Image
              boxSize="150px"
              objectFit="cover"
              src={hoverData.icon}
              borderRadius="15px"
            ></Image>
          </Square>
          <Flex flex="1" direction="column" pl="20px">
            <Text sx={darkText} fontSize="24px" fontWeight={600}>
              {hoverData.title}
            </Text>
            <Box>
              <Text
                noOfLines={2}
                fontSize="16px"
                color="#8C8C8C"
                maxW={'500px'}
                wordBreak="break-all"
              >
                {hoverData.description}
              </Text>
              <NexLink color="#8C8C8C" href={hoverData.link}>
                Read More
              </NexLink>
            </Box>
            <Flex alignItems={'center'} mt="20px" wrap={'wrap'}>
              <Text fontSize={'16px'} fontWeight={600}>
                Top Owners
              </Text>
              {topOwners?.map((item: AvatarData) => {
                return (
                  <Tooltip label={item.wallet} key={item.wallet}>
                    {/* <NexLink href={'/user/' + item.wallet}> */}
                    <Avatar
                      size="sm"
                      name={item.name}
                      src={item.icon}
                      ml="15px"
                      mt="5px"
                    />
                    {/* </NexLink> */}
                  </Tooltip>
                );
              })}
            </Flex>
          </Flex>
        </Flex>
      ) : (
        ''
      )}
      {/* 稀有模式下显示简介 end*/}
      <Box
        px={{ base: 5, md: isOpen ? 5 : 8 }}
        pt={{ base: 0, md: '20px' }}
        pb={{ base: '64px', md: 0 }}
      >
        <SimpleGrid
          w="full"
          templateColumns={{
            base: '1fr 1fr',
            md: `repeat(auto-fill, minmax(${
              isSmallCard ? '170px' : '214px'
            }, 1fr))`,
          }}
          spacingX={{ base: '15px', md: isSmallCard ? '20px' : '25px' }}
          spacingY={{ base: '15px', md: isSmallCard ? '28px' : '36px' }}
          fontSize="sm"
        >
          {data?.list?.map((item) => (
            <ExploreNftItem
              chainId={chainId}
              key={item.item_id}
              data={item}
              smallGrid={isSmallCard}
              hideBuyButton={hideBuyButton(item.owner)}
            />
          ))}

          {isLoading &&
            Array.from({ length: pageSize }).map((_, i) => (
              <ExploreNftItem.Placeholder key={i} />
            ))}
        </SimpleGrid>
        {isEmpty && (
          <Center h="45vh" fontWeight={'700'} fontFamily="Inter">
            <Text>{t('noItems')}</Text>
          </Center>
        )}
        {isError && (
          <Center p={5}>
            <Button
              opacity={0.7}
              variant="outline"
              borderWidth={2}
              borderColor="primary.main"
              color="primary.main"
              onClick={() => loadMoreWhenError()}
            >
              {t('someThingWrong')}
            </Button>
          </Center>
        )}
      </Box>
    </FilterContainer>
  );
}
