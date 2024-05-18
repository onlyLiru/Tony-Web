import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { serverSideTranslations } from '@/i18n';
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Center,
  ChakraProps,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Link,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useMediaQuery,
  useToast,
  VStack,
  Card,
  CardBody,
} from '@chakra-ui/react';
import Image from '@/components/Image';
import { AreaWithBarChart, ChartDataType } from '@/features/Chart';
import { Table } from '@/features/Table';
import { AssetImage, AssetVideo, ExploreNftItem } from '@/features/AssetItem';
import * as marketApis from '@/services/market';
import {
  format,
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from 'date-fns';
import { CURRENCT_TYPE, getCurrenySymbol } from '@/const/currency';
import { shortAddress, shortCollectionAddress } from '@/utils';
import { useUserDataValue } from '@/store';
import useCopy from '@/hooks/useCopy';
import { useRequest, useUpdateEffect } from 'ahooks';
import { AssetCollapse } from '@/features/Collapse';
import { useRouter } from 'next/router';
import {
  CancelSellModal,
  CancelSellModalAction,
  ShareButton,
  useRootModalConsumer,
} from '@/features/AssetPage';
import { shareUtil } from '@/utils/share';
import { jwtHelper } from '@/utils/jwt';
import { ApiCollection } from '@/services/collection';
import * as ApiUser from '@/services/user';
import { formatUnits } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { formatPrice } from '@/utils/formatPrice';
import { getBaseUrl } from '@/utils/getBaseUrl';
import { toLower } from 'lodash';
import CommonHead from '@/components/PageLayout/CommonHead';
import { Ellipsis } from '@/components/Ellipsis';
import { Footer } from '@/components/PageLayout';
import { PopoverSelectOption } from '@/features/Select';
import { AiOutlineReload } from 'react-icons/ai';
import { useNftReflush } from '@/hooks/useNftReflush';
import { useFetchUser } from '@/store';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { SupportedChainId } from '@/contract/types';
import {
  getCurrencyLogoByType,
  getCurrencySymbolByType,
  NftActivityCurrencyType,
} from '@/contract/constants/logos';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Web2LoginModal } from '@/components/PageLayout/Header/Web2Login';

const RelateItems = ({
  collectionUrl,
  items,
  chainId,
}: {
  collectionUrl: string;
  items: ApiCollection.CollectionItemInfo[];
  chainId: SupportedChainId;
}) => {
  const t = useTranslations('common');
  if (!items || !items.length) return <Box h={20} />;
  return (
    <Box mb={20}>
      <SimpleGrid
        p={{ base: 5, md: 10 }}
        mb={5}
        maxW="draft"
        mx="auto"
        templateColumns={{ base: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }}
        spacing={5}
        fontSize="sm"
      >
        {items.map((item, i) => (
          <ExploreNftItem
            key={`${item.item_id}-${i}`}
            data={item as any}
            chainId={chainId}
          />
        ))}
      </SimpleGrid>
      <Center px={5}>
        <NextLink href={`/collection/${chainId}/${collectionUrl}`}>
          <Button
            w={{ base: 'full', md: '240px' }}
            h={'60px'}
            variant="primary"
            rounded="lg"
          >
            {t('viewMore')}
          </Button>
        </NextLink>
      </Center>
    </Box>
  );
};

const ShareWithLikeButton = ({
  data,
}: {
  data: marketApis.ApiMarket.ItemDetail;
}) => {
  const toast = useToast();
  const router = useRouter();
  const [_, onCopy] = useCopy();

  return (
    <HStack color="primary.deepGray" spacing={{ base: 0, md: 4 }}>
      <ShareButton
        fontSize={{ base: '22px', md: '26px' }}
        onTwitter={() => {
          window.open(
            shareUtil.getTwitterShareUrl({
              url: `${getBaseUrl()}/${router.locale}/asset/${
                router.query.chain
              }/${data.item_info.token_id}`,
              text: data.item_info.name,
            }),
            '_blank',
          );
        }}
        onCopy={async () => {
          await onCopy(location.href);
          toast({
            status: 'success',
            title: 'Link Copied!',
            variant: 'subtle',
          });
        }}
      />
      {/* <IconButton
        isLoading={state.loading}
        onClick={toggleLike}
        aria-label=""
        bg="none"
        color={state.like ? 'accent.yellow' : undefined}
        fontSize={{ base: '22px', md: '26px' }}
        icon={state.like ? <Icon as={BsStarFill} /> : <Icon as={BsStar} />}
      /> */}
    </HStack>
  );
};

const Description = ({ description }: { description: string }) => {
  const t = useTranslations('assetDetail');
  const commonT = useTranslations('common');
  return (
    <AssetCollapse
      title={t('description')}
      headerProps={{ className: 'As004' }}
    >
      <Ellipsis
        rows={4}
        content={description || t('noDescription')}
        renderToggle={(isToggle, action) => (
          <Text
            display={'inline-block'}
            cursor="pointer"
            onClick={action}
            color="accent.blue"
          >
            {isToggle ? commonT('close') : commonT('readMore')}
          </Text>
        )}
      />
    </AssetCollapse>
  );
};

const ContractDetail = ({
  data,
}: {
  data: marketApis.ApiMarket.ItemDetail;
}) => {
  const ct = useTranslations('common');
  const t = useTranslations('assetDetail');
  const router = useRouter();
  const { visitChain } = useSwitchChain({
    fixedChainId: +router.query?.chain! as SupportedChainId,
  });
  return (
    <AssetCollapse title={t('details')} headerProps={{ className: 'As005' }}>
      <VStack color="primary.black" fontFamily={'Inter'} spacing={3}>
        <Flex w="full" align={'center'} justify="space-between">
          <Text>{ct('contractAddress')}</Text>
          <Link
            className="As006"
            color="accent.blue"
            href={`${visitChain.blockExplorers?.default.url}/address/${data.contract_metadata.contract_address}`}
            target="_blank"
          >
            {shortCollectionAddress(data.contract_metadata.contract_address)}
          </Link>
        </Flex>
        <Flex w="full" align={'center'} justify="space-between">
          <Text>{ct('tokenID')}</Text>
          <Tooltip
            padding={4}
            rounded="lg"
            bg="primary.main"
            color="white"
            hasArrow
            placement="top"
            label={data.item_info.token_id}
          >
            <Text color="typo.sec" maxW={'50%'} noOfLines={1}>
              {data.item_info.token_id}
            </Text>
          </Tooltip>
        </Flex>
        <Flex w="full" align={'center'} justify="space-between">
          <Text>{ct('tokenStandard')}</Text>
          <Text color="typo.sec">
            {+data.contract_metadata.token_type === 1 ? 'ERC-1155' : 'ERC-721'}
          </Text>
        </Flex>
        <Flex w="full" align={'center'} justify="space-between">
          <Text>{ct('blockchain')}</Text>
          <Text color="typo.sec">{visitChain.name}</Text>
        </Flex>
        <Flex w="full" align={'center'} justify="space-between">
          <Text>{ct('creatorFee')}</Text>
          <Text color="typo.sec">{data.royalty}%</Text>
        </Flex>
      </VStack>
    </AssetCollapse>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PriceHistory = ({
  data,
}: {
  data: marketApis.ApiMarket.HistoricalPriceInfo[];
}) => {
  const t = useTranslations('assetDetail');
  const ct = useTranslations('common');
  const router = useRouter();
  const { visitChain, visitChainSymbols } = useSwitchChain({
    fixedChainId: +router.query?.chain! as SupportedChainId,
  });

  const chartData = useMemo<ChartDataType[]>(() => {
    return data
      .filter((el) => el.item_activity_id)
      .map((el) => ({
        timestamp: +el.created_at * 1000,
        value: formatPrice(el.price, visitChain.nativeCurrency.decimals),
        unit:
          +el.currency_type === CURRENCT_TYPE.ETH
            ? visitChainSymbols.Local
            : visitChainSymbols.Stable,
      }));
  }, [data]);
  const hasData = Array.isArray(chartData) && chartData.length > 0;
  return (
    <AssetCollapse disabled={!hasData} title={t('pirceHistory')}>
      {chartData.length ? (
        <AreaWithBarChart data={chartData} />
      ) : (
        <Center h="full">{ct('noItems')}</Center>
      )}
    </AssetCollapse>
  );
};

const Properties = ({ data }: { data: marketApis.ApiMarket.ItemDetail }) => {
  const router = useRouter();
  const t = useTranslations('assetDetail');
  const { loading, data: res } = useRequest(marketApis.itemProperties, {
    defaultParams: [
      {
        token_id: Number(data.item_info.token_id),
        collection_address: data.contract_metadata.contract_address,
        chain_id: router.query.chain,
      },
    ],
    refreshDeps: [router.query.chain],
  });
  const arr = res && res.data.propertiesTraits;
  const hasData = Array.isArray(arr) && arr.length > 0;
  return (
    <AssetCollapse
      disabled={!hasData}
      title={t('properties')}
      headerProps={{ className: 'As008' }}
    >
      {hasData ? (
        <SimpleGrid
          maxW={'100%'}
          // templateColumns={{ base: '1fr 1fr', md: '1fr 1fr 1fr' }}
          columns={{ base: 2, md: 3 }}
          spacing={{ base: 3, md: 6 }}
        >
          {arr.map((p, i) => (
            <Box
              key={i}
              p={4}
              bg="gray.50"
              borderWidth={1}
              borderColor="primary.gray"
              rounded="lg"
            >
              <VStack
                spacing={2}
                color="typo.sec"
                fontSize="xs"
                textAlign={'center'}
                w="full"
              >
                <Heading
                  color="accent.indigo"
                  w="auto"
                  size="xs"
                  noOfLines={1}
                  wordBreak="break-all"
                >
                  {p.type}
                </Heading>
                <Tooltip label={p.name} placement="top">
                  <Text w="full" noOfLines={1} cursor="pointer">
                    {p.name}
                  </Text>
                </Tooltip>
                <Text>{p.traits || '0'}%</Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Center h="full">{loading ? <Spinner /> : t('noProperties')}</Center>
      )}
    </AssetCollapse>
  );
};

const ItemActivities = ({
  tableData,
}: {
  tableData: marketApis.ApiMarket.ItemActivityInfo[];
}) => {
  const router = useRouter();
  const { visitChain } = useSwitchChain({
    fixedChainId: +router.query?.chain! as SupportedChainId,
  });
  const hasData = Array.isArray(tableData) && tableData.length > 0;
  const paget = useTranslations('assetDetail');
  const t = useTranslations('common');
  const eventOptions = useMemo<PopoverSelectOption[]>(
    () => t.raw('activites.filters' as any),
    [t],
  );
  return (
    <AssetCollapse
      disabled={!hasData}
      title={paget('itemActivities')}
      bodyProps={{ p: 0 }}
      headerProps={{
        className: 'As007',
      }}
    >
      <Table<marketApis.ApiMarket.ItemActivityInfo>
        dataSource={tableData}
        rowKey={(record, index) => `${record.events}-${record.tx}-${index}`}
        columns={[
          {
            title: 'Events',
            dataKey: 'event',
            render: (_, record) => {
              if (+record.events < 5)
                return eventOptions.find((el) => +el.value === +record.events)
                  ?.label;
              return t('cancel');
            },
          },
          {
            title: t('price'),
            dataKey: 'price',
            boxProps: {
              textAlign: 'center',
            },
            render: (t, record) => {
              const price = formatPrice(t, visitChain.nativeCurrency.decimals);
              if (+price === 0 || record.type === NftActivityCurrencyType.NULL)
                return <Text color="primary.deepGray">-</Text>;
              const CurrencyLogo = getCurrencyLogoByType(record.type);
              return (
                <HStack spacing={'4px'}>
                  <CurrencyLogo w="18px" h="auto" />
                  <Text>
                    {formatPrice(t, visitChain.nativeCurrency.decimals)}
                  </Text>
                </HStack>
              );
            },
          },
          {
            title: t('type'),
            dataKey: 'type',
            render: (_, record) => {
              if (record.type === NftActivityCurrencyType.NULL)
                return <Text color="primary.deepGray">-</Text>;
              return getCurrencySymbolByType(record.type);
            },
          },
          {
            title: t('from'),
            dataKey: 'from',
            maxWidth: '110px',
            render: (t: string) => (
              <NextLink href={`/user/${t}`} passHref>
                <Link color="accent.blue">{shortAddress(t)}</Link>
              </NextLink>
            ),
          },
          {
            title: t('to'),
            dataKey: 'to',
            maxWidth: '110px',
            render: (t: string) =>
              t ? (
                <NextLink href={`/user/${t}`} passHref>
                  <Link color="accent.blue">{shortAddress(t)}</Link>
                </NextLink>
              ) : (
                <Text color="primary.deepGray">-</Text>
              ),
          },
          {
            title: 'Tx',
            dataKey: 'tx',
            boxProps: {
              pr: { base: 0, md: '62px' },
            },
            render: (t: string) => {
              const d = new Date(+t * 1000);
              return (
                <Tooltip
                  hasArrow
                  placement="top"
                  padding={4}
                  rounded="lg"
                  bg="primary.main"
                  color="white"
                  label={format(d, 'PPp')}
                >
                  {formatDistanceToNow(d, {
                    addSuffix: true,
                  })}
                </Tooltip>
              );
            },
          },
        ]}
      />
    </AssetCollapse>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ItemListings = ({
  data,
  cancelSellModalRef,
}: {
  data: marketApis.ApiMarket.ItemDetail['order_list'];
  cancelSellModalRef: React.RefObject<CancelSellModalAction>;
}) => {
  const userData = useUserDataValue();
  const ct = useTranslations('common');
  return (
    <>
      <AssetCollapse title={ct('listing')} bodyProps={{ p: 0 }}>
        <Table<marketApis.ApiMarket.OrderList>
          rowKey="id"
          columns={[
            {
              title: ct('price'),
              dataKey: 'price',
              render: (_, record) => (
                <>
                  <Text>
                    {record.price}
                    {getCurrenySymbol(record.currency_type)}
                  </Text>
                </>
              ),
            },
            { title: 'Stock', dataKey: 'stock' },
            {
              title: ct('from'),
              dataKey: 'wallet_address',
              maxWidth: '110px',
              render: (_, record) => (
                <NextLink href={`/user/${record.offerUser}`} passHref>
                  <Link color="accent.blue">
                    {userData?.wallet_address === record.offerUser
                      ? 'you'
                      : shortAddress(record.offerUser)}
                  </Link>
                </NextLink>
              ),
            },
            {
              title: ct('duration'),
              dataKey: 'duration',
              render: (t: string) => format(new Date(t), 'Pp'),
            },
            {
              title: ct('action'),
              dataKey: 'is_seller',
              render: (_, record) => {
                return (
                  <>
                    <Button
                      className="As010"
                      borderWidth={2}
                      borderColor="primary.gray"
                      size={'sm'}
                      variant={'outline'}
                      rounded="lg"
                      onClick={async () => {
                        cancelSellModalRef.current?.open({
                          orderId: record.sell_id,
                        });
                      }}
                    >
                      {ct('cancel')}
                    </Button>
                    <Button
                      borderWidth={2}
                      borderColor="primary.gray"
                      size={'sm'}
                      variant={'outline'}
                      rounded="lg"
                    >
                      {ct('accept')}
                    </Button>
                  </>
                );
              },
            },
          ]}
          dataSource={data}
        />
      </AssetCollapse>
    </>
  );
};

const QuickSettingButton = ({
  chainId,
  token_id,
  collection_address,
  ...props
}: {
  token_id: string;
  collection_address: string;
  chainId: string;
} & ChakraProps) => {
  const ct = useTranslations('common');
  const { fetchUser } = useFetchUser();
  const updateAvatar = async () => {
    await ApiUser.setNFTAvatar({
      token_id,
      collection_address,
      chain_id: +chainId,
    });
    await fetchUser();
  };
  return (
    <Tooltip label={ct('setAvatar')} placement="top">
      <Center
        {...props}
        w={{ md: '48px', base: 'auto' }}
        h={{ md: '48px', base: 'auto' }}
        cursor="pointer"
        rounded={{ md: 'md', base: 'full' }}
        _hover={{
          md: {
            bg: 'white',
          },
          base: {},
        }}
        overflow="hidden"
        onClick={updateAvatar}
      >
        <Image
          w={{ md: '36px', base: '24px' }}
          h={{ md: '36px', base: '24px' }}
          src="/images/user/avatar.png"
        />
      </Center>
    </Tooltip>
  );
};

const ItemHeader = ({ data }: { data: marketApis.ApiMarket.ItemDetail }) => {
  const ct = useTranslations('common');
  const router = useRouter();
  const { reflush, reflushing } = useNftReflush();
  return (
    <VStack alignItems={'flex-start'} spacing={{ base: 0, md: 4 }} w="full">
      <Flex w="full" align="center" justify="space-between" direction={'row'}>
        <Heading
          size={{ base: 'sm', md: 'lg' }}
          noOfLines={1}
          overflow="hidden"
          wordBreak={'break-all'}
        >
          {data.item_info.name || ct('noNamed')}
        </Heading>
        <HStack>
          <IconButton
            isLoading={reflushing}
            aria-label=""
            bg="none"
            color="primary.deepGray"
            _hover={{
              bg: 'blackAlpha.50',
            }}
            icon={<Icon as={AiOutlineReload} fontSize="30px" />}
            onClick={() => {
              reflush({
                chain_id: +router.query.chain!,
                collection_address: data.contract_metadata.contract_address,
                token_id: data.item_info.token_id,
              });
            }}
          />
          <ShareWithLikeButton data={data} />
        </HStack>
      </Flex>
      <NextLink
        href={`/collection/${+router.query?.chain!}/${
          data.contract_metadata.contract_address
        }`}
        passHref
      >
        <Link
          className="As001"
          display={'inline-block'}
          color="accent.blue"
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="bold"
        >
          {data.item_info.collection_name ||
            `${ct('noNamed')}${ct('collection')}`}
        </Link>
      </NextLink>
    </VStack>
  );
};

export default function AssetDetail({
  data: serverData = {
    owmer_info: {},
    item_info: {},
    contract_metadata: {},
  } as marketApis.ApiMarket.ItemDetail,
}: {
  data: marketApis.ApiMarket.ItemDetail;
}) {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [data, setData] = useState(serverData);
  const t = useTranslations('assetDetail');
  const ct = useTranslations('common');
  const userData = useUserDataValue();
  const { openBuyModal, openListModal } = useRootModalConsumer();
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const web2LoginModal = useRef<{ open: () => void }>(null);
  const router = useRouter();
  const cancelSellModalRef = useRef<CancelSellModalAction>(null);
  const { query } = useRouter();
  const { visitChain, VisitChainLogo, needSwitchChain, switchChain } =
    useSwitchChain({
      fixedChainId: +router.query?.chain! as SupportedChainId,
    });
  const { reflushed, reflushing, reflush, reflushText } = useNftReflush();

  const canReflush = useMemo(
    () => data?.can_reflush && data?.item_info?.ass_type === -1,
    [data?.item_info],
  );

  const pageReq = useRequest(marketApis.itemDetail, {
    manual: true,
    onSuccess: (res) => {
      setData(res.data);
    },
  });

  useUpdateEffect(() => {
    if (serverData && JSON.stringify(serverData) !== JSON.stringify(data)) {
      setData(serverData);
    }
  }, [serverData]);
  // 刷新页面信息
  const refresh = () => {
    pageReq.runAsync({
      token_id: router.query.token_id as string,
      chain_id: router.query.chain as string,
    });
  };

  // 是否归当前用户所有
  const ownedBySelf = useMemo(
    () =>
      userData?.wallet_address &&
      toLower(userData?.wallet_address) ===
        toLower(data.owmer_info.wallet_address),
    [userData?.wallet_address, data.owmer_info],
  );

  // owner显示文本
  const owner = useMemo(() => {
    if (ownedBySelf) return 'you';
    return (
      data.owmer_info.username || shortAddress(data.owmer_info.wallet_address)
    );
  }, [ownedBySelf]);

  // 可挂单
  const canListing = useMemo(
    () => ownedBySelf && !data.order_info?.price,
    [data.order_info, ownedBySelf],
  );
  // 挂单中
  const isListing = useMemo(() => !!data.order_info?.price, [data.order_info]);

  // 剩余时间
  const timeLeft = useMemo(() => {
    if (!isListing) return '';
    const duration = intervalToDuration({
      start: new Date(data.order_info?.endTime! * 1000),
      end: new Date(),
    });

    return formatDuration(duration, {
      format: ['days', 'hours'],
      delimiter: ' ',
    })
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' hours', 'h')
      .replace(' hour', 'h');
  }, [data?.order_info, isListing]);

  // 点击立即购买按钮
  const handleClickBuyNow = () => {
    (window as any)?.dataLayer?.push({
      event: 'buy_now_click',
      position: 'asset',
      from: query.from, // 渠道 url取
      source: query.source, // 来源 也从url取，从跳转加 search/banner/buddyproject
      collection_id: data.item_info.collection_id,
      asset_id: Number(data.item_info.token_id),
    });
    // 登陆了邮箱但是没登陆web3钱包直接出rainow的钱包登陆插件
    if (userData?.login_email && !address) {
      openConnectModal && openConnectModal();
      return;
    }
    if (needSwitchChain) {
      return switchChain();
    }
    openBuyModal({
      token_id: data.item_info.token_id,
      chainId: +router.query.chain!,
      collection_address: data.contract_metadata.contract_address,
    });
  };

  return (
    <>
      <CommonHead
        title={`${data.item_info.name} - ${data.item_info.collection_name}`}
        image={data.item_info.logo}
        description={data.contract_metadata.description}
      />
      <SimpleGrid
        p={5}
        maxW="draft"
        mx="auto"
        templateColumns={{
          base: 'minmax(auto, 100%)',
          md: 'minmax(300px, 540px) 1fr',
        }}
        spacing={5}
      >
        <VStack spacing={5}>
          {!isLargerThan768 && <ItemHeader data={data} />}
          <AspectRatio
            maxW={{ base: 'full', md: '540px' }}
            w="full"
            ratio={1}
            rounded="xl"
            borderWidth={2}
            borderColor="primary.gray"
            overflow="hidden"
          >
            <Box w="full" h="full" pos={'relative'}>
              {data.item_info.ass_type === 1 ? (
                <AssetVideo src={data.item_info.logo} />
              ) : (
                <AssetImage
                  objectFit="contain"
                  srcSuffix="s=800"
                  src={data.item_info.logo}
                  w="full"
                  h="full"
                />
              )}
              {ownedBySelf && (
                <QuickSettingButton
                  chainId={router.query.chain as string}
                  token_id={data.item_info.token_id}
                  collection_address={data.contract_metadata.contract_address}
                  pos="absolute"
                  right={{ md: '10px', base: '14px' }}
                  top={{ md: '10px', base: '14px' }}
                  zIndex={2}
                />
              )}
              {canReflush && (
                <Button
                  isLoading={reflushing}
                  isDisabled={reflushed}
                  onClick={(e) => {
                    e.stopPropagation();
                    reflush({
                      chain_id: +router.query.chain!,
                      collection_address:
                        data.contract_metadata.contract_address,
                      token_id: data.item_info.token_id,
                    });
                  }}
                  pos="absolute"
                  bottom={{ base: '68px', md: '96px' }}
                  left="50%"
                  zIndex={2}
                  transform="translateX(-50%)"
                  w={{ md: '160px', base: '120px' }}
                  h={{ md: '48px', base: '32px' }}
                  bgColor="rgba(25, 28, 32, 0.73);"
                  fontSize={{ md: '16px', base: '14px' }}
                  color={reflushed ? '#5B5C5E' : 'white'}
                  _hover={{
                    bgColor: 'rgba(255, 225, 255, 0.1);',
                  }}
                >
                  {reflushText}
                </Button>
              )}
            </Box>
          </AspectRatio>
          <Box w="full" display={{ base: 'none', md: 'block' }}>
            <Properties data={data} />
          </Box>
          <Box w="full" display={{ base: 'none', md: 'block' }}>
            <Description description={data.item_info.description} />
          </Box>
          <Box w="full" display={{ base: 'none', md: 'block' }}>
            <ContractDetail data={data} />
          </Box>
          <Card>
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
          </Card>
        </VStack>
        <VStack align="flex-start" spacing={5}>
          {isLargerThan768 && <ItemHeader data={data} />}
          <HStack spacing={2}>
            <Image
              bg="blackAlpha.100"
              rounded={'full'}
              w="40px"
              h="40px"
              src={data.owmer_info.profile_image}
            />
            <VStack align={'flex-start'} spacing={0}>
              <Text color="typo.sec" fontSize={'sm'}>
                {ct('owner')}
              </Text>
              <NextLink
                href={`/user/${data.owmer_info.wallet_address}`}
                passHref
              >
                <Link className="As002" color="accent.blue">
                  {owner || '0x0000'}
                </Link>
              </NextLink>
            </VStack>
          </HStack>
          <VStack spacing={5} w="full">
            {!isListing && !ownedBySelf && (
              <Flex
                align={'center'}
                h={{ base: '50px', md: '80px' }}
                borderWidth={2}
                borderColor="primary.gray"
                rounded="xl"
                w="full"
                bg="gray.50"
                color="primary.sec"
                overflow="hidden"
                p={5}
                fontSize={{ base: 'md', md: 'lg' }}
              >
                {t('noListed')}
              </Flex>
            )}
            {(isListing || ownedBySelf) && (
              <Box
                w="full"
                rounded="lg"
                borderWidth={2}
                borderColor="primary.gray"
                overflow="hidden"
              >
                <Heading
                  size={{ base: 'sm', md: 'md' }}
                  borderBottomWidth={2}
                  borderColor="primary.gray"
                  fontWeight={'normal'}
                  p={4}
                  wordBreak="break-all"
                >
                  {isListing ? (
                    <Flex justify={'space-between'}>
                      <HStack>
                        <Text>{t('saleEnds')}</Text>
                        <Tooltip
                          padding={4}
                          rounded="lg"
                          bg="primary.main"
                          color="white"
                          hasArrow
                          placement="top"
                          label={format(
                            data.order_info?.endTime! * 1000,
                            'PPPp',
                          )}
                        >
                          <Text fontWeight={'700'} cursor={'pointer'}>
                            {timeLeft}
                          </Text>
                        </Tooltip>
                      </HStack>
                      {data!.order_info?.amount! > 1 && (
                        <Text>{`Remaining: ${data!.order_info?.amount}`}</Text>
                      )}
                    </Flex>
                  ) : (
                    t('noListed')
                  )}
                </Heading>

                <Box px={4} py={{ base: 4, md: 8 }}>
                  <Flex
                    w="full"
                    align={{ base: 'flex-start', md: 'center' }}
                    justify="space-between"
                    direction={{ base: 'column', md: 'row' }}
                  >
                    <Stat mb={{ base: 5, md: 0 }}>
                      {isListing && (
                        <>
                          <StatLabel color="typo.sec" mb={5} fontSize="md">
                            {t('currentPrice')}
                          </StatLabel>
                          <StatNumber color="primary.main" fontSize="3xl">
                            <HStack spacing={5}>
                              <Flex align={'center'}>
                                <VisitChainLogo.Local
                                  fontSize={{ base: '32px', md: '54px' }}
                                />
                                <Text fontWeight="bold">
                                  {formatUnits(
                                    BigNumber.from(data!.order_info?.price!),
                                    visitChain.nativeCurrency.decimals,
                                  )}
                                </Text>
                              </Flex>
                            </HStack>
                          </StatNumber>
                        </>
                      )}
                    </Stat>

                    {(() => {
                      // 可购买
                      if (isListing && !ownedBySelf)
                        return (
                          <Button
                            className="As003"
                            onClick={handleClickBuyNow}
                            variant="primary"
                            rounded="lg"
                            size="lg"
                            h="60px"
                            w={{ base: 'full', md: '240px' }}
                          >
                            {ct('buynow')}
                          </Button>
                        );
                      // 可调整挂单信息
                      if (isListing && ownedBySelf) {
                        return (
                          <ButtonGroup
                            w={{ base: 'full', md: 'auto' }}
                            size="xl"
                            spacing={4}
                          >
                            <Button
                              w="full"
                              flex="1"
                              minW={{ base: 'auto', md: '160px' }}
                              borderWidth={2}
                              borderColor="primary.gray"
                              rounded="lg"
                              h="60px"
                              variant={'outline'}
                              onClick={() => {
                                if (needSwitchChain) {
                                  return switchChain();
                                }
                                cancelSellModalRef.current?.open({
                                  orderId: data?.item_info.order_id!,
                                });
                              }}
                            >
                              {ct('cancel')}
                            </Button>

                            <Button
                              className="As012"
                              flex="1"
                              minW={{ base: 'auto', md: '160px' }}
                              h="60px"
                              variant={'primary'}
                              rounded="lg"
                              onClick={() => {
                                if (needSwitchChain) {
                                  return switchChain();
                                }
                                // debugger
                                openListModal({
                                  chain_id: +router.query.chain!,
                                  collection_address:
                                    data.contract_metadata.contract_address,
                                  token_id: data.item_info.token_id,
                                  openType: 'adjustListing',
                                  close: refresh,
                                });
                              }}
                            >
                              {ct('edit')}
                            </Button>
                          </ButtonGroup>
                        );
                      }
                      // 可挂单
                      if (canListing) {
                        return (
                          <Button
                            className="As009"
                            w={{ base: 'full', md: '240px' }}
                            size="lg"
                            rounded="lg"
                            variant={'primary'}
                            h="60px"
                            onClick={() => {
                              (window as any)?.dataLayer?.push({
                                event: 'list_click',
                                position: 'asset',
                                from: query.from, // 渠道 url取
                                source: query.source, // 来源 也从url取，从跳转加 search/banner/buddyproject
                                collection_name: data.item_info.collection_name,
                                collection_id: data.item_info.collection_id,
                                asset_id: Number(data.item_info.token_id),
                                asset_name: data.item_info.name,
                              });
                              if (needSwitchChain) {
                                return switchChain();
                              }
                              // debugger
                              openListModal({
                                chain_id: +router.query.chain!,
                                collection_address:
                                  data.contract_metadata.contract_address,
                                token_id: data.item_info.token_id,
                                openType: 'listing',
                                close: refresh,
                              });
                            }}
                          >
                            {ct('list')}
                          </Button>
                        );
                      }

                      // 可报价
                      if (!isListing && !ownedBySelf) {
                      }

                      return null;
                    })()}
                  </Flex>
                </Box>
              </Box>
            )}
            <Box w="full" display={{ base: 'block', md: 'none' }}>
              <Properties data={data} />
            </Box>
            {/* <PriceHistory data={data.historical_price_info || []} /> */}
            <ItemActivities tableData={data.item_activity_info || []} />
            {/* <ItemListings
              data={data.order_list || []}
              cancelSellModalRef={cancelSellModalRef}
            /> */}
          </VStack>
        </VStack>
      </SimpleGrid>
      <RelateItems
        chainId={visitChain.id}
        collectionUrl={data.customize_url}
        items={data.all_item_info}
      />
      <Footer />
      <CancelSellModal ref={cancelSellModalRef} refresh={refresh} />
      {/* web2登陆弹窗 */}
      <Web2LoginModal ref={web2LoginModal}></Web2LoginModal>
    </>
  );
}

import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export async function getServerSideProps({
  locale,
  query,
  req,
}: GetServerSidePropsContext) {
  const { id, chain, tokenId } = query as Record<string, string>;
  const messages = await serverSideTranslations(locale, [
    'assetDetail',
    'teamz',
  ]);
  // 禁止国内ip
  let detectedIp = requestIp.getClientIp(req);
  // console.log(detectedIp, 'ip');
  // console.log(req.url, 'ip');
  // const ip = '156.146.56.115';

  if (detectedIp === '::1') {
    detectedIp = '156.146.56.115';
  }

  const xdbFilePath = path.join(process.cwd(), 'public', 'ip2region.xdb');
  // const dbPath = './ip2region.xdb';
  // or 'path/to/ip2region.xdb file path'
  const searcher = Searcher.newWithFileOnly(xdbFilePath);
  // 查询
  const geo = await searcher.search(detectedIp || '');

  if (geo && geo?.region?.split('|')[0] === '中国') {
    if (
      !(
        geo?.region?.split('|')[2] === '台湾省' ||
        geo?.region?.split('|')[2] === '香港'
      )
    ) {
      return {
        redirect: {
          permanent: false,
          destination: '/err',
        },
      };
    }
  }
  // console.log(geo, 'geo1');

  try {
    const { data } = await marketApis.itemDetail(
      // { item_id: +id!, chain_id: chain as string },
      { collection_address: id!, chain_id: chain as string, token_id: tokenId },
      jwtHelper.getServerToken(req),
    );
    return {
      props: {
        messages,
        data,
      },
    };
  } catch (error) {
    return {
      props: {
        messages,
      },
    };
  }
}
