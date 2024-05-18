/**
 * Nft卡片组件
 */

import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { ApiMarket } from '@/services/market';
import { ApiUser } from '@/services/user';
import { formatPrice } from '@/utils/formatPrice';
import { useRootModalConsumer } from '../AssetPage';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useMemo, useEffect } from 'react';
import { useNftReflush } from '@/hooks/useNftReflush';
import { AssetImage } from './AssetImage';
import { AssetVideo } from './AssetVideo';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { SupportedChainId } from '@/contract/types';
import { useIsRare } from '@/store';
import { darkHover, darkBuy, darkBg } from '@/utils/darkColor';
import { useUserDataValue } from '@/store';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { ETH, BNB, ChainBERA } from '@/components/Icon';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils.js';

/**
 * Nft卡片数据属性
 */
export type NftItemDataType = ApiMarket.NftListType;
export type ProjectItemDataType = ApiUser.ProjectItemDataType;

type ExploreNftItemProps = {
  /** 是否隐藏购买按钮 */
  hideBuyButton?: boolean;
  /** 是否是small视图 */
  smallGrid?: boolean;
  /** nft数据 */
  data?: NftItemDataType;
  chainId: SupportedChainId;
  /** 封面额外自定义内容 */
  coverExtraRender?: () => React.ReactNode;
  onRendered?: () => void;
};

type ProjectItemProps = {
  /** 是否是small视图 */
  smallGrid?: boolean;
  /** nft数据 */
  data?: ProjectItemDataType;
  chainId: SupportedChainId;
};

const ExploreNftItemRoot = ({
  coverExtraRender,
  hideBuyButton,
  smallGrid,
  data,
  chainId,
  onRendered,
}: ExploreNftItemProps) => {
  const item = data || ({} as NftItemDataType);
  const hasPrice = +item.price > 0;
  const hasFloorPrice = +item.floor_price > 0;
  const hasTopBidPrice = +item.top_bid > 0;
  const { query } = useRouter();
  const { openBuyModal } = useRootModalConsumer();
  const {
    visitChain,
    VisitChainLogo,
    needSwitchChain,
    visitChainId,
    switchChain,
  } = useSwitchChain({});
  const userData = useUserDataValue();
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();

  const t = useTranslations('common');
  const router = useRouter();
  const { reflushed, reflush, reflushing, reflushText } = useNftReflush();

  const canReflush = useMemo(
    () => item.can_reflush && item.ass_type === -1,
    [item.can_reflush, item.ass_type],
  );
  const [isRare] = useIsRare();
  let hoverStyle = null;
  if (isRare) {
    hoverStyle = darkHover;
  } else {
    hoverStyle = {
      boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.25)',
    };
  }

  useEffect(() => {
    if (onRendered) {
      onRendered();
    }
  }, []);

  const getDetailAdr = () => {
    if (item?.collection_address && item?.token_id) {
      // 3333333333 nft tokenid
      const tokenIdNum = Number(item.token_id);
      return `/asset/${visitChainId}/${item.collection_address}/${tokenIdNum}`;
    } else {
      return `/asset/${visitChainId}/${item.item_id}`;
    }
  };

  // 点击立即购买按钮
  const handleClickBuyNow = (item: ApiMarket.NftListType) => {
    // 登陆了邮箱但是没登陆web3钱包直接出rainow的钱包登陆插件
    if (userData?.login_email && !address) {
      openConnectModal && openConnectModal();
      return;
    }
    if (needSwitchChain) {
      return switchChain();
    }
    openBuyModal({
      token_id: item.token_id,
      chainId: item.chain_id,
      collection_address: item.collection_address,
    });
  };

  // 格式化挂单价和地板价
  const formatPriceHandler = (item: any, priceItem: any) => {
    const itemValue = item?.[priceItem.key];
    if (itemValue && itemValue !== '0') {
      return priceItem.key === 'floor_price'
        ? Math.floor(
            parseFloat(String(item[priceItem.key as 'floor_price'])) * 10000,
          ) / 10000
        : formatEther(BigNumber.from(item[priceItem.key as 'price']));
    }
    return '--';
  };

  return (
    <Box
      cursor={'default'}
      className="Ex011"
      position="relative"
      role="group"
      w="100%"
      transition={'all .3s ease'}
      overflow="hidden"
      rounded={{ md: '14px', base: '12px' }}
      borderWidth={1}
      borderColor="rgba(255, 255, 255, 0.10)"
      _hover={hoverStyle}
      onClick={() => router.push(getDetailAdr())}
      style={{
        cursor: 'pointer',
      }}
    >
      {/* 333333 brower item */}
      <AspectRatio maxW={'full'} ratio={1} overflow="hidden">
        <Box w="full" h="full" pos={'relative'}>
          {coverExtraRender?.()}
          {/* {canReflush && (
            <Button
              isLoading={reflushing}
              isDisabled={reflushed}
              onClick={(e) => {
                e.stopPropagation();
                reflush({ item_id: item.item_id, chain_id: chainId });
              }}
              pos="absolute"
              bottom={'8%'}
              left="50%"
              zIndex={2}
              transform="translateX(-50%)"
              w={{ md: '140px', base: '90px' }}
              h={{ md: '40px', base: '32px' }}
              bgColor="rgba(25, 28, 32, 0.73);"
              fontSize={{ md: '16px', base: '14px' }}
              color={reflushed ? '#5B5C5E' : 'white'}
              _hover={{
                bgColor: 'rgba(255, 225, 255, 0.1);',
              }}
            >
              {reflushText}
            </Button>
          )} */}
          {item.ass_type === 1 ? (
            <AssetVideo src={item.logo} cover={item.thumbnail} />
          ) : (
            <AssetImage
              transition="all ease 0.3s"
              // _hover={{
              //   transform: 'scale(1.05)',
              // }}
              src={item.logo}
              srcSuffix="s=350"
            />
          )}
        </Box>
      </AspectRatio>
      <Box
        p={{
          md: smallGrid ? '10px 14px' : '16px 16px',
          base: '7px 10px 10px',
        }}
        pos="relative"
        fontFamily={'PingFang HK'}
        overflow="hidden"
        bg={isRare ? darkBg : '#2B2B2B'}
        _groupHover={{
          marginTop: !hideBuyButton && item.is_sell ? '-42px' : '',
        }}
        transition={'all ease 0.3s'}
      >
        {/* 3333333333 nft item */}
        <Flex align="center" justify="space-between" mb={'4px'}>
          <Text
            fontSize={{ md: smallGrid ? '14px' : '16px', base: '14px' }}
            noOfLines={1}
            fontWeight={{ md: 'bold', base: '500' }}
            wordBreak="break-all"
            color={isRare ? 'white' : 'rgba(255, 255, 255, 0.80)'}
          >
            {item.name || item.token_id}
          </Text>
        </Flex>
        {/* 项目名 */}
        <Text
          mt={{ md: smallGrid ? '-4px' : '0px', base: '7px' }}
          fontSize={{ md: smallGrid ? '12px' : '14px', base: '13px' }}
          fontWeight={500}
          noOfLines={1}
          color={isRare ? 'white' : 'rgba(255, 255, 255, 0.40)'}
          visibility={item.collection_name ? 'visible' : 'hidden'}
        >
          {item.collection_name || 'Unamed Collection'}
        </Text>
        {/* 地板价和挂单价 */}
        <Flex marginTop={smallGrid ? '12px' : '16px'}>
          {[
            { key: 'price', label: 'price' },
            { key: 'floor_price', label: 'floorPrice' },
          ].map((priceItem) => {
            return (
              // (priceItem.key !== 'price' || item.is_sell) &&
              <Stat
                key={priceItem.key}
                flex={{ base: '0 1 50%', md: 'auto' }}
                mt={{ base: '10px !important', md: '0 !important' }}
                marginInlineStart="0px !important"
              >
                <StatLabel
                  color="#fff"
                  fontSize={{ md: smallGrid ? '12px' : '14px', base: '13px' }}
                >
                  {t(priceItem.label as 'price' | 'floorPrice')}
                </StatLabel>
                <StatNumber color={isRare ? 'white' : '#fff'} fontWeight={800}>
                  <HStack spacing={'2px'}>
                    {item.chain_id === 1 ||
                    item.chain_id === 5 ||
                    item.chain_id === 11155111 ? (
                      <ETH width="20px" height="20px" />
                    ) : (
                      <></>
                    )}
                    {item.chain_id === 97 || item.chain_id === 56 ? (
                      <BNB width="20px" height="20px" />
                    ) : (
                      <></>
                    )}
                    {item.chain_id === 80085 || item.chain_id === 80085 ? (
                      <ChainBERA width="20px" height="20px" />
                    ) : (
                      <></>
                    )}
                    <Text
                      fontWeight="bold"
                      color="#fff"
                      fontSize={{
                        md: smallGrid ? '18px' : '20px',
                        base: '16px',
                      }}
                    >
                      {formatPriceHandler(item, priceItem) &&
                      Number(formatPriceHandler(item, priceItem)) > 0
                        ? Number(formatPriceHandler(item, priceItem))
                        : formatPriceHandler(item, priceItem)}
                    </Text>
                  </HStack>
                </StatNumber>
              </Stat>
            );
          })}
        </Flex>
      </Box>
      {!hideBuyButton && item.is_sell && (
        <Center
          cursor={'pointer'}
          className="Ex012"
          width="auto"
          display={{ base: 'none', sm: 'inline-flex' }}
          pos="absolute"
          bottom="0"
          left="0"
          right="0"
          margin="0 16px"
          fontSize={smallGrid ? '12px' : '14px'}
          transform={{ base: 'translateY(38px)', md: 'translateY(40px)' }}
          _groupHover={{
            transform: 'translateY(-8px)',
          }}
          background="#E49F5C"
          fontWeight={500}
          transition={'all ease 0.3s'}
          h="40px"
          bg="#E49F5C"
          color="#000"
          sx={isRare ? darkBuy : {}}
          borderRadius="4px"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            (window as any)?.dataLayer?.push({
              event: 'buy_now_click',
              position:
                window?.location?.pathname?.indexOf('explore') > -1
                  ? 'explore'
                  : 'collection',
              from: query.from, // 渠道 url取
              source: query.source, // 来源 也从url取，从跳转加 search/banner/buddyproject
              collection_id: item.collection_address,
              asset_id: item.token_id,
            });
            handleClickBuyNow(item);
            if (needSwitchChain) {
              return switchChain();
            }
            // debugger;
            openBuyModal({
              token_id: item.token_id,
              chainId: item.chain_id,
              collection_address: item.collection_address,
            });
          }}
        >
          {t('buynow')}
        </Center>
      )}
    </Box>
  );
};

const Placeholder = () => (
  <Box
    w="100%"
    rounded={{ md: '14px', base: '6px' }}
    overflow="hidden"
    borderWidth={1}
    borderColor="#00000010"
  >
    <AspectRatio maxW={'full'} ratio={1} overflow="hidden">
      <Box w="full" h="full" className="shimmer" />
    </AspectRatio>
    <Box p={{ md: 4, base: '7px 10px 10px' }} pos="relative" overflow="hidden">
      <Box className="shimmer" rounded="full" h={'18px'} w="100%" />
      <Box
        mt={{ md: 4, base: '7px' }}
        className="shimmer"
        rounded="full"
        h={'18px'}
        w="40%"
      />
    </Box>
  </Box>
);

const ProjectItemRoot = ({ smallGrid, data, chainId }: ProjectItemProps) => {
  const item = data || ({} as ProjectItemDataType);
  const router = useRouter();
  const t = useTranslations('common');
  return (
    <Box
      cursor={'default'}
      className="Ex011"
      role="group"
      w={{ md: '100%', base: '43vw' }}
      transition={'all .3s ease'}
      overflow="hidden"
      rounded={{ md: '14px', base: '12px' }}
      borderWidth={1}
      borderColor="#00000010"
      _hover={{ boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.25)' }}
      onClick={() =>
        router.push(`/user/project/${chainId}/${item.collection_address}`)
      }
    >
      <AssetImage
        transition="all ease 0.3s"
        _hover={{
          transform: 'scale(1.05)',
        }}
        src={item.logo}
        srcSuffix="s=350"
        w="100%"
      />
      <Box
        p={{ md: smallGrid ? '10px 14px' : '12px 18px', base: '7px 10px 10px' }}
        pos="relative"
        fontFamily={'PingFang HK'}
        overflow="hidden"
      >
        <Flex align="center" justify="space-between" mb={'4px'}>
          <Text
            fontSize={{ md: smallGrid ? '14px' : '16px', base: '14px' }}
            noOfLines={1}
            fontWeight={{ md: '600', base: '500' }}
            wordBreak="break-all"
            color={'rgba(255, 255, 255, 0.80)'}
          >
            <div className="ellipsis h-6 text-base md:text-xl">{item.name}</div>
          </Text>
        </Flex>
      </Box>
      <div className="px-4 pb-4">
        <Button
          // variant={'primary'}
          bg={'#E49F5C'}
          color={'#000'}
          w="100%"
          onClick={() =>
            router.push(`/user/project/${chainId}/${item.collection_address}`)
          }
        >
          {t('editProject')}
        </Button>
      </div>
    </Box>
  );
};

export const ExploreNftItem = Object.assign(ExploreNftItemRoot, {
  Placeholder,
});

export const ProjectItem = Object.assign(ProjectItemRoot, {
  Placeholder,
});
