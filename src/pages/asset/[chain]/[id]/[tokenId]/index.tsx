import React, { useMemo, useRef, useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  TabIndicator,
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

// const RelateItems = ({
//   collectionUrl,
//   items,
//   chainId,
// }: {
//   collectionUrl: string;
//   items: ApiCollection.CollectionItemInfo[];
//   chainId: SupportedChainId;
// }) => {
//   const t = useTranslations('common');
//   if (!items || !items.length) return <Box h={20} />;
//   return (
//     <Box mb={20}>
//       <SimpleGrid
//         p={{ base: 5, md: 10 }}
//         mb={5}
//         maxW="draft"
//         mx="auto"
//         templateColumns={{ base: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }}
//         spacing={5}
//         fontSize="sm"
//       >
//         {items.map((item, i) => (
//           <ExploreNftItem
//             key={`${item.item_id}-${i}`}
//             data={item as any}
//             chainId={chainId}
//           />
//         ))}
//       </SimpleGrid>
//       <Center px={5}>
//         <NextLink href={`/collection/${chainId}/${collectionUrl}`}>
//           <Button
//             w={{ base: 'full', md: '240px' }}
//             h={'60px'}
//             variant="primary"
//             rounded="lg"
//           >
//             {t('viewMore')}
//           </Button>
//         </NextLink>
//       </Center>
//     </Box>
//   );
// };

const RelateItemsNew = ({
  items,
  chainId,
}: {
  items: marketApis.ApiMarket.NftListType[];
  chainId: SupportedChainId;
}) => {
  const t = useTranslations('common');
  if (!items || !items.length) return <Box h={20} />;
  return (
    <Box mb={10}>
      <SimpleGrid
        p={{ base: 5, md: 10 }}
        mb={5}
        // maxW="draft"
        mx="auto"
        templateColumns={{ base: '1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr 1fr' }}
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

  const { id, chain, tokenId } = router.query;

  const getDetailAdr = () => {
    return id && tokenId
      ? `${getBaseUrl()}/${router.locale}/asset/${chain}/${id}/${tokenId}`
      : `${getBaseUrl()}/${router.locale}/asset/${chain}/${Number(
          data.item_info.token_id,
        )}`;
  };

  return (
    <HStack spacing={{ base: 0, md: 4 }}>
      <ShareButton
        fontSize={{ base: '22px', md: '24px' }}
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
    // <AssetCollapse
    //   title={t('description')}
    //   headerProps={{ className: 'As004' }}
    // >
    <Ellipsis
      rows={4}
      color={'rgba(255, 255, 255, 0.8)'}
      content={description || t('noDescription')}
      renderToggle={(isToggle, action) => (
        <Text
          display={'inline-block'}
          cursor="pointer"
          onClick={action}
          color={'rgba(255, 255, 255, 0.8)'}
        >
          {isToggle ? commonT('close') : commonT('readMore')}
        </Text>
      )}
    />
    // </AssetCollapse>
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
    // <AssetCollapse title={t('details')} headerProps={{ className: 'As005' }}>
    <VStack color="primary.black" fontFamily={'Inter'} spacing={3}>
      <Flex w="full" align={'center'} justify="space-between">
        <Text color={'rgba(255, 255, 255, 0.8)'}>{ct('contractAddress')}</Text>
        <Link
          className="As006"
          color={'rgba(255, 255, 255, 0.8)'}
          href={`${visitChain.blockExplorers?.default.url}/address/${data.contract_metadata.contract_address}`}
          target="_blank"
        >
          {shortCollectionAddress(data.contract_metadata.contract_address)}
        </Link>
      </Flex>
      <Flex w="full" align={'center'} justify="space-between">
        <Text color={'rgba(255, 255, 255, 0.8)'}>{ct('tokenID')}</Text>
        <Tooltip
          padding={4}
          rounded="lg"
          bg="primary.main"
          color="white"
          hasArrow
          placement="top"
          label={data.item_info.token_id}
        >
          <Text color={'rgba(255, 255, 255, 0.8)'} maxW={'50%'} noOfLines={1}>
            {data.item_info.token_id}
          </Text>
        </Tooltip>
      </Flex>
      <Flex w="full" align={'center'} justify="space-between">
        <Text color={'rgba(255, 255, 255, 0.8)'}>{ct('tokenStandard')}</Text>
        <Text color={'rgba(255, 255, 255, 0.8)'}>
          {+data.contract_metadata.token_type === 1 ? 'ERC-1155' : 'ERC-721'}
        </Text>
      </Flex>
      <Flex w="full" align={'center'} justify="space-between">
        <Text color={'rgba(255, 255, 255, 0.8)'}>{ct('blockchain')}</Text>
        <Text color={'rgba(255, 255, 255, 0.8)'}>{visitChain.name}</Text>
      </Flex>
      <Flex w="full" align={'center'} justify="space-between">
        <Text color={'rgba(255, 255, 255, 0.8)'}>{ct('creatorFee')}</Text>
        <Text color={'rgba(255, 255, 255, 0.8)'}>{data.royalty}%</Text>
      </Flex>
    </VStack>
    // </AssetCollapse>
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
    // <AssetCollapse
    //   disabled={!hasData}
    //   title={t('properties')}
    //   headerProps={{ className: 'As008' }}
    // >
    <>
      {hasData ? (
        <SimpleGrid
          maxW={'100%'}
          // templateColumns={{ base: '1fr 1fr', md: '1fr 1fr 1fr' }}
          columns={{ base: 2, md: 2 }}
          spacing={{ base: 3, md: 6 }}
        >
          {arr.map((p, i) => (
            <Box key={i} p={4} bg="rgba(255, 255, 255, 0.10)" rounded="lg">
              <VStack
                spacing={{ md: '4px', base: 2 }}
                color="typo.sec"
                fontSize="xs"
                textAlign={'center'}
                w="full"
              >
                <Text
                  color="rgba(255, 255, 255, 0.45)"
                  fontSize={16}
                  w="auto"
                  size="xs"
                  noOfLines={1}
                  wordBreak="break-all"
                >
                  {p.type}
                </Text>
                <Tooltip label={p.name} placement="top">
                  <Text
                    w="full"
                    noOfLines={1}
                    cursor="pointer"
                    fontSize={16}
                    color="rgba(255, 255, 255, 0.8)"
                    fontWeight={'bold'}
                  >
                    {p.name}
                  </Text>
                </Tooltip>
                <Text fontSize={16} color="rgba(255, 255, 255, 0.8)">
                  {p.traits || '0'}%
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Center h="full">
          {loading ? (
            <Spinner />
          ) : (
            <Text color={'rgba(255, 255, 255, 0.8)'}>{t('noProperties')}</Text>
          )}
        </Center>
      )}
    </>

    // </AssetCollapse>
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
    // <AssetCollapse
    //   disabled={!hasData}
    //   title={paget('itemActivities')}
    //   bodyProps={{ p: 0 }}
    //   headerProps={{
    //     className: 'As007',
    //   }}
    // >
    <Box
      width={'full'}
      rounded="lg"
      border={'1px solid rgba(255, 255, 255, 0.12)'}
      overflow="hidden"
    >
      <Text
        fontSize={{ base: '16px', md: '20px' }}
        borderBottomWidth={1}
        borderColor="rgba(255, 255, 255, 0.12)"
        fontWeight={700}
        p={4}
        wordBreak="break-all"
        color={'rgba(255, 255, 255, 0.80)'}
      >
        {paget('itemActivities')}
      </Text>
      <Table<marketApis.ApiMarket.ItemActivityInfo>
        dataSource={tableData}
        rowKey={(record, index) => `${record.events}-${record.tx}-${index}`}
        columns={[
          {
            title: 'Events',
            dataKey: 'event',
            boxProps: {
              textAlign: 'center',
              background: 'transparent',
            },
            render: (_, record) => {
              if (+record.events < 5)
                return (
                  <Text color={'rgba(255, 255, 255, 0.80)'}>
                    {
                      eventOptions.find((el) => +el.value === +record.events)
                        ?.label
                    }
                  </Text>
                );
              return (
                <Text color={'rgba(255, 255, 255, 0.80)'}>{t('cancel')}</Text>
              );
            },
          },
          {
            title: t('price'),
            dataKey: 'price',
            boxProps: {
              textAlign: 'center',
              background: 'transparent',
            },
            render: (t, record) => {
              const price = formatPrice(t, visitChain.nativeCurrency.decimals);
              if (+price === 0 || record.type === NftActivityCurrencyType.NULL)
                return <Text color="primary.deepGray">-</Text>;
              const CurrencyLogo = getCurrencyLogoByType(record.type);
              return (
                <HStack spacing={'4px'}>
                  <CurrencyLogo w="18px" h="auto" />
                  <Text color={'rgba(255, 255, 255, 0.80)'}>
                    {formatPrice(t, visitChain.nativeCurrency.decimals)}
                  </Text>
                </HStack>
              );
            },
          },
          {
            title: t('type'),
            dataKey: 'type',
            boxProps: {
              textAlign: 'center',
              background: 'transparent',
            },
            render: (_, record) => {
              if (record.type === NftActivityCurrencyType.NULL)
                return <Text color={'rgba(255, 255, 255, 0.80)'}>-</Text>;
              return (
                <Text color={'rgba(255, 255, 255, 0.80)'}>
                  {getCurrencySymbolByType(record.type)}
                </Text>
              );
            },
          },
          {
            title: paget('sender'),
            dataKey: 'from',
            maxWidth: '110px',
            boxProps: {
              textAlign: 'center',
              background: 'transparent',
            },
            render: (t: string) => (
              <NextLink href={`/user/${t}`} passHref>
                <Link
                  _hover={{ textDecoration: 'underline !important' }}
                  color={'rgba(255, 255, 255, 0.80)'}
                >
                  {shortAddress(t)}
                </Link>
              </NextLink>
            ),
          },
          {
            title: paget('receiver'),
            dataKey: 'to',
            maxWidth: '110px',
            boxProps: {
              textAlign: 'center',
              background: 'transparent',
            },
            render: (t: string) =>
              t ? (
                <NextLink href={`/user/${t}`} passHref>
                  <Link
                    _hover={{ textDecoration: 'underline !important' }}
                    color={'rgba(255, 255, 255, 0.80)'}
                  >
                    {shortAddress(t)}
                  </Link>
                </NextLink>
              ) : (
                <Text color="primary.deepGray">-</Text>
              ),
          },
          {
            title: paget('time'),
            dataKey: 'tx',
            boxProps: {
              pr: { base: 0, md: '62px' },
              background: 'transparent',
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
                  <Text color={'rgba(255, 255, 255, 0.80)'}>
                    {formatDistanceToNow(d, {
                      addSuffix: true,
                    })}
                  </Text>
                </Tooltip>
              );
            },
          },
        ]}
      />
    </Box>
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
        {/* <Heading
          size={{ base: 'sm', md: 'lg' }}
          noOfLines={1}
          overflow="hidden"
          wordBreak={'break-all'}
        >
          {data.item_info.name || ct('noNamed')}
        </Heading> */}
        <Text
          fontSize={{ base: '24px', md: '40px' }}
          fontWeight={'bold'}
          noOfLines={1}
          overflow="hidden"
          wordBreak={'break-all'}
          color={'rgba(255, 255, 255, 0.80)'}
        >
          {data.item_info.name || ct('noNamed')}
        </Text>
        {/* <HStack>
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
                              itemId: Number(data.item_info.token_id),
                chain_id: +router.query.chain!,
                owner: data.owmer_info.wallet_address,
              });
            }}
          />
          <ShareWithLikeButton data={data} />
        </HStack> */}
      </Flex>
      {/* <NextLink
        href={`/collection/${+router.query?.chain!}/${data.contract_metadata.contract_address
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
      </NextLink> */}
    </VStack>
  );
};

export default function AssetDetail({
  data: serverData = {
    owmer_info: {},
    item_info: {},
    contract_metadata: {},
  } as marketApis.ApiMarket.ItemDetail,
  relateRes = { item: [], total: 0 },
}: {
  data: marketApis.ApiMarket.ItemDetail;
  relateRes: { item: marketApis.ApiMarket.NftListType[]; total: number };
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
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };
  useUpdateEffect(() => {
    if (serverData && JSON.stringify(serverData) !== JSON.stringify(data)) {
      setData(serverData);
    }
  }, [serverData]);

  useEffect(() => {
    let num = tabIndex + 1;
    if (num === 3) {
      num = 0;
    }
    setTabIndex(num);
  }, [router?.locale]);
  // 刷新页面信息
  const refresh = () => {
    pageReq
      .runAsync({
        collection_address: data.contract_metadata.contract_address,
        token_id: data.item_info.token_id,
        chain_id: router.query.chain as string,
      })
      .catch((err) => {
        console.log(err);
        window?.location?.reload();
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
      format: ['days', 'hours', 'minutes'],
      delimiter: ' ',
    })
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' minutes', 'm');
  }, [data?.order_info, isListing]);

  // 点击立即购买按钮
  const handleClickBuyNow = () => {
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
      <div key={data.item_info.token_id} style={{ background: '#2B2B2B' }}>
        <CommonHead
          title={`${data.item_info.name} - ${data.item_info.collection_name}`}
          image={data.item_info.logo}
          description={data.contract_metadata.description}
        />
        <Box background={'rgba(64,64,64)'} pt={'16px'} pb={'40px'}>
          <SimpleGrid
            p={{ md: '40px', base: '20px' }}
            maxW="draft"
            mx="auto"
            templateColumns={{
              base: 'minmax(auto, 100%)',
              md: 'minmax(300px, 540px) 1fr',
            }}
            background="#2B2B2B"
            borderRadius={'32px'}
            spacing={{ md: '40px', base: 5 }}
          >
            <VStack spacing={5}>
              {!isLargerThan768 && <ItemHeader data={data} />}
              <AspectRatio
                maxW={{ base: 'full', md: '540px' }}
                w="full"
                ratio={1}
                rounded="12px"
                border={'1px solid rgba(0,0,0,0.12)'}
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
                  {/* {data.item_info.logo} */}
                  {ownedBySelf && (
                    <></>
                    // <QuickSettingButton
                    //   chainId={router.query.chain as string}
                    //   token_id={data.item_info.token_id}
                    //   collection_address={data.contract_metadata.contract_address}
                    //   pos="absolute"
                    //   right={{ md: '10px', base: '14px' }}
                    //   top={{ md: '10px', base: '14px' }}
                    //   zIndex={2}
                    // />
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
              <Flex>
                {/* <Flex w={{base:'48px',md:'64px'}} h={{base:'48px',md:'64px'}} bg={'#F6F6F6'} borderRadius={'50%'} justifyContent="center" alignItems={'center'} mr={{base:'24px',md:'32px'}}>
              <Image src='/images/item/like.png' w={{base:'18px',md:'24px'}} h={{base:'18px',md:'24px'}}></Image>
            </Flex> */}
                <Flex
                  w={{ base: '48px', md: '64px' }}
                  h={{ base: '48px', md: '64px' }}
                  bg={'rgba(255, 255, 255, 0.10)'}
                  borderRadius={'50%'}
                  justifyContent="center"
                  alignItems={'center'}
                  mr={{ base: '24px', md: '32px' }}
                >
                  {/* <Image src='/images/item/resend.png' w={{ base: '18px', md: '24px' }} h={{ base: '18px', md: '24px' }}></Image> */}
                  <ShareWithLikeButton data={data} />
                </Flex>
                {/* <Flex w={{base:'48px',md:'64px'}} h={{base:'48px',md:'64px'}} bg={'#F6F6F6'} borderRadius={'50%'} justifyContent="center" alignItems={'center'} mr={{base:'24px',md:'32px'}}>
              <Image src='/images/item/setAvatar.png' w={{base:'18px',md:'24px'}} h={{base:'18px',md:'24px'}}></Image>
            </Flex> */}
                <Flex
                  w={{ base: '48px', md: '64px' }}
                  h={{ base: '48px', md: '64px' }}
                  bg={'rgba(255, 255, 255, 0.1)'}
                  borderRadius={'50%'}
                  justifyContent="center"
                  alignItems={'center'}
                  cursor={'pointer'}
                >
                  <IconButton
                    isLoading={reflushing}
                    aria-label=""
                    bg="none"
                    color="r"
                    _hover={{
                      bg: 'blackAlpha.50',
                    }}
                    // icon={<Icon as={AiOutlineReload} fontSize="30px" />}
                    icon={
                      <Icon fontSize={{ base: '22px', md: '24px' }}>
                        <g
                          id="item"
                          stroke="none"
                          strokeWidth="1"
                          fill="none"
                          fillRule="evenodd"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <g
                            id="商城备份-2"
                            transform="translate(-776.000000, -691.000000)"
                            stroke="rgba(255, 255, 255, 0.8)"
                            strokeWidth="2.25"
                          >
                            <g
                              id="编组-30"
                              transform="translate(468.000000, 671.000000)"
                            >
                              <g
                                id="编组-29"
                                transform="translate(288.000000, 0.000000)"
                              >
                                <g
                                  id="画板备份-9"
                                  transform="translate(20.000000, 20.000000)"
                                >
                                  <path
                                    d="M18.8851826,2.25 L18.8851826,5.09661231 C17.121504,3.33755579 14.6877581,2.25 12,2.25 C6.61522369,2.25 2.25,6.61522369 2.25,12 C2.25,17.3847763 6.61522369,21.75 12,21.75 C17.3847763,21.75 21.75,17.3847763 21.75,12"
                                    id="路径"
                                  ></path>
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </Icon>
                    }
                    onClick={() => {
                      console.log('reflushing', data);
                      reflush({
                        collection_address:
                          data.contract_metadata.contract_address,
                        token_id: data.item_info.token_id,
                        chain_id: +router.query.chain!,
                      });
                    }}
                  />
                </Flex>
              </Flex>
              <Card
                w="full"
                sx={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: 'none',
                }}
                rounded={'12px'}
                bgColor={'transparent'}
              >
                <CardBody>
                  <Tabs
                    variant="unstyled"
                    index={tabIndex}
                    onChange={handleTabsChange}
                  >
                    <TabList
                      borderBottomWidth={1}
                      borderColor="rgba(255, 255, 255, 0.10)"
                    >
                      <Tab
                        _selected={{ color: '#E49F5C' }}
                        fontSize={{ md: '20px', base: '16px' }}
                        fontWeight={700}
                        color={'rgba(255, 255, 255, 0.80)'}
                      >
                        {t('properties')}
                      </Tab>
                      <Tab
                        _selected={{ color: '#E49F5C' }}
                        fontSize={{ md: '20px', base: '16px' }}
                        fontWeight={700}
                        color={'rgba(255, 255, 255, 0.80)'}
                      >
                        {t('description')}
                      </Tab>
                      <Tab
                        _selected={{ color: '#E49F5C' }}
                        fontSize={{ md: '20px', base: '16px' }}
                        fontWeight={700}
                        color={'rgba(255, 255, 255, 0.80)'}
                      >
                        {t('details')}
                      </Tab>
                    </TabList>
                    <TabIndicator
                      height="4px"
                      bg="#E49F5C"
                      borderRadius={'12px'}
                    />
                    <Box h={'1px'} bg={'rgba(0,0,0,0.1)'}></Box>
                    <TabPanels>
                      <TabPanel h={'340px'} overflow="scroll">
                        <Properties data={data} />
                      </TabPanel>
                      <TabPanel h={'340px'} overflow="scroll">
                        <Description description={data.item_info.description} />
                      </TabPanel>
                      <TabPanel h={'340px'} overflow="scroll">
                        <ContractDetail data={data} />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>
            </VStack>
            <VStack align="flex-start" spacing={{ md: '10px', base: 5 }}>
              {isLargerThan768 && <ItemHeader data={data} />}
              <HStack spacing={6}>
                <HStack spacing={2}>
                  <Image w="16px" h="16px" src={'/images/item/contract.svg'} />
                  <NextLink
                    href={`/collection/${+router.query?.chain!}/${
                      data.contract_metadata.contract_address
                    }`}
                    passHref
                  >
                    <Link
                      color="rgba(255, 255, 255, 0.85)"
                      className="As002"
                      _hover={{ textDecoration: 'underline !important' }}
                    >
                      {data.item_info.collection_name ||
                        `${ct('noNamed')}${ct('collection')}`}
                    </Link>
                  </NextLink>
                </HStack>
                <HStack spacing={2}>
                  <Image w="16px" h="16px" src={'/images/item/people.svg'} />
                  <NextLink
                    href={`/user/${data.owmer_info.wallet_address}`}
                    passHref
                  >
                    <Link
                      className="As002"
                      color="rgba(255, 255, 255, 0.85)"
                      _hover={{ textDecoration: 'underline !important' }}
                    >
                      {owner || '0x0000'}
                    </Link>
                  </NextLink>
                </HStack>
              </HStack>
              <VStack
                spacing={{ md: '40px', base: 5 }}
                w="full"
                marginTop={{ md: '40px !important', base: '' }}
              >
                {!isListing && !ownedBySelf && (
                  <Flex
                    align={'center'}
                    h={{ base: '50px', md: '80px' }}
                    border={'1px solid rgba(0,0,0,0.12)'}
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
                    border={'1px solid rgba(255, 255, 255, 0.12)'}
                    overflow="hidden"
                  >
                    <Heading
                      size={{ base: 'sm', md: 'md' }}
                      borderBottomWidth={1}
                      borderColor="rgba(255, 255, 255, 0.12)"
                      fontWeight={'normal'}
                      p={4}
                      wordBreak="break-all"
                    >
                      {isListing ? (
                        <Flex justify={'space-between'}>
                          <HStack>
                            <Image
                              src="/images/item/clock.svg"
                              w={'16px'}
                              h={'16px'}
                            ></Image>
                            <Text
                              fontSize={'16px'}
                              color={'rgba(255, 255, 255, 0.45)'}
                              fontWeight={300}
                            >
                              {t('saleEnds')}
                            </Text>
                            <Tooltip
                              padding={4}
                              rounded="lg"
                              bg="primary.main"
                              color="rgba(255, 255, 255, 0.85)"
                              hasArrow
                              placement="top"
                              label={format(
                                data.order_info?.endTime! * 1000,
                                'MM/dd/yyyy',
                              )}
                            >
                              <Text
                                fontSize={'16px'}
                                cursor={'pointer'}
                                color={'rgba(255, 255, 255, 0.85)'}
                              >
                                {timeLeft}
                              </Text>
                            </Tooltip>
                          </HStack>
                          {data!.order_info?.amount! > 1 && (
                            <Text>{`Remaining: ${
                              data!.order_info?.amount
                            }`}</Text>
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
                              <StatLabel
                                mb={5}
                                fontSize="md"
                                color={'rgba(255, 255, 255, 0.45)'}
                                fontWeight={300}
                              >
                                {t('currentPrice')}
                              </StatLabel>
                              <StatNumber color="primary.main" fontSize="3xl">
                                <HStack spacing={5}>
                                  <Flex align={'center'}>
                                    <VisitChainLogo.Local
                                      fontSize={{ base: '32px', md: '32px' }}
                                    />
                                    <Flex alignItems={'flex-end'}>
                                      <Text
                                        fontWeight="bold"
                                        lineHeight={{
                                          base: '20px',
                                          md: '32px',
                                        }}
                                        mr={{ base: '8px', md: '15px' }}
                                        fontSize={{ base: '20px', md: '32px' }}
                                        color={'rgba(255, 255, 255, 0.8)'}
                                      >
                                        {formatUnits(
                                          BigNumber.from(
                                            data!.order_info?.price!,
                                          ),
                                          visitChain.nativeCurrency.decimals,
                                        )}
                                      </Text>
                                      <Text
                                        fontSize={{ base: '14px', md: '16px' }}
                                        lineHeight={{
                                          base: '18px',
                                          md: '23px',
                                        }}
                                        // fontFamily={'MicrosoftYaHei'}
                                        color={'rgba(255, 255, 255, 0.45)'}
                                        fontWeight={300}
                                      >
                                        {'$' +
                                          data!.order_info?.usdtPrice?.toFixed(
                                            2,
                                          )}
                                      </Text>
                                    </Flex>
                                  </Flex>
                                </HStack>
                              </StatNumber>
                            </>
                          )}
                        </Stat>
                      </Flex>
                    </Box>
                  </Box>
                )}
                <Box width={'full'}>
                  {(() => {
                    // 可购买
                    if (isListing && !ownedBySelf)
                      return (
                        <Button
                          color={'#000000'}
                          _hover={{
                            bg: '#FB9D42',
                          }}
                          bg={'#FB9D42'}
                          onClick={() => {
                            if (needSwitchChain) {
                              return switchChain();
                            }
                            // 333333333
                            openBuyModal({
                              token_id: data.item_info.token_id,
                              chainId: +router.query.chain!,
                              collection_address:
                                data.contract_metadata.contract_address,
                            });
                          }}
                          rounded="lg"
                          size="lg"
                          h="60px"
                          w={{ base: 'full', md: 'full' }}
                        >
                          <Image
                            src={'/images/item/lightning.svg'}
                            w={{ base: '13px', md: '16.5px' }}
                            h={{ base: '17.5px', md: '22px' }}
                            mr={{ base: '', md: '10px' }}
                          ></Image>
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
                          // className="As009"
                          color={'#fff'}
                          _hover={{
                            bg: 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);',
                          }}
                          bg={
                            'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);'
                          }
                          w={{ base: 'full', md: 'full' }}
                          size="lg"
                          rounded="lg"
                          // variant={'primary'}
                          h="60px"
                          onClick={() => {
                            if (needSwitchChain) {
                              return switchChain();
                            }
                            console.log(data);
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
                </Box>
                {/* <Box w="full" display={{ base: 'block', md: 'none' }}>
              <Properties data={data} />
            </Box> */}
                {/* <PriceHistory data={data.historical_price_info || []} /> */}
                <ItemActivities tableData={data.item_activity_info || []} />
                {/* <ItemListings
              data={data.order_list || []}
              cancelSellModalRef={cancelSellModalRef}
            /> */}
              </VStack>
            </VStack>
          </SimpleGrid>
        </Box>
        {/* 推荐nft */}
        <Text
          px={{ base: 5, md: 10 }}
          mx="auto"
          mt={'37px'}
          fontSize={'30px'}
          fontWeight="bold"
          color={'rgba(255, 255, 255, 0.80)'}
        >
          {t('moreCollection')}
        </Text>
        <RelateItemsNew chainId={visitChain.id} items={relateRes.item} />
        <Footer />
        <CancelSellModal ref={cancelSellModalRef} refresh={refresh} />
      </div>
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
      { collection_address: id!, chain_id: chain as string, token_id: tokenId },
      jwtHelper.getServerToken(req),
    );
    console.log(data);
    const { data: relateRes } = await marketApis.itemsRelate(
      { address: id!, page: 1, page_size: 12, token_id: tokenId },
      jwtHelper.getServerToken(req),
    );
    return {
      props: {
        messages,
        data,
        relateRes,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        messages,
      },
    };
  }
}
