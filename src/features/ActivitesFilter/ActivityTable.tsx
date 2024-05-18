import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  Tooltip,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { ExploreActivityTable } from '@/features/Table';
import { shortAddress } from '@/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';
import Image from '@/components/Image';
import NextLink from 'next/link';
import * as marketApis from '@/services/market';
import LoadMore from '@/components/LoadMore';
import { useRequest, useSetState } from 'ahooks';
import { useContext, useMemo } from 'react';
import { formatPrice } from '@/utils/formatPrice';
import { ActivitesFilterForm } from './ActivitesFilterForm';
import { PopoverSelectOption } from '../Select';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { ceil } from 'lodash';
import {
  getCurrencyLogoByType,
  getCurrencySymbolByType,
  NftActivityCurrencyType,
} from '@/contract/constants/logos';

const renderPrice = (
  priceStr: string,
  type: NftActivityCurrencyType,
  decimals: number,
) => {
  const price = formatPrice(priceStr, decimals);
  if (+price === 0 || type === NftActivityCurrencyType.NULL)
    return <Text color="primary.deepGray">-</Text>;
  const CurrencyLogo = getCurrencyLogoByType(type);
  return (
    <HStack spacing={'4px'}>
      <CurrencyLogo w="18px" h="auto" />
      <Text>{ceil(+price, 4)}</Text>
    </HStack>
  );
};

export function ActivityTableContent(props: {
  params?: marketApis.ApiMarket.ActivityListQuery;
}) {
  const t = useTranslations('common');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const { visitChain } = useSwitchChain({
    fixedChainId: props.params?.chain_id,
  });
  const context = useContext(ActivitesFilterForm.Context);
  const req = useRequest(marketApis.activityList, {
    manual: true,
  });
  const [state, setState] = useSetState<{
    data: marketApis.ApiMarket.ActivityListItem[];
    hasMore: boolean;
    page: number;
  }>({
    data: [],
    hasMore: true,
    page: 1,
  });
  const onLoad = async () => {
    const {
      data: { item_activity_info: items },
    } = await req.runAsync({
      page: state.page,
      page_size: 10,
      type: context.state.events,
      ...props.params,
    });
    const hasMore = items?.length > 0;
    setState((prev) => ({
      page: prev.page + 1,
      data: [...prev.data, ...(items || [])],
      hasMore,
    }));
  };

  const eventOptions = useMemo<PopoverSelectOption[]>(
    () => t.raw('activites.filters' as any),
    [t],
  );

  const getDetailAdr = (record: any) => {
    return record?.collection_address && record?.token_id
      ? `/asset/${props.params?.chain_id}/${record.collection_address}/${record.token_id}`
      : `/asset/${props.params?.chain_id}/${record.item_id}`;
  };

  return (
    <Box>
      {!state.hasMore && !state.data.length ? (
        <Center h="200px">{t('noItems')}</Center>
      ) : (
        <ExploreActivityTable<marketApis.ApiMarket.ActivityListItem>
          loading={req.loading}
          dataSource={state.data}
          // rowKey="tx"
          columns={
            isLargerThan768
              ? [
                  {
                    title: t('activites.events'),
                    dataKey: 'event',
                    boxProps: {
                      pl: { base: 0, md: '62px' },
                      bg: 'transparent',
                      color: 'rgba(255, 255, 255, 0.40)',
                    },
                    render: (_, record) => {
                      if (+record.events < 5)
                        return eventOptions.find(
                          (el) => +el.value === +record.events,
                        )?.label;
                      return t('cancel');
                    },
                  },
                  {
                    title: t('activites.items'),
                    dataKey: 'item_title',
                    boxProps: {
                      bg: 'transparent',
                      color: 'rgba(255, 255, 255, 0.40)',
                    },
                    render: (_, record: any) => {
                      return (
                        <Flex align={'center'}>
                          <Image
                            rounded={'sm'}
                            src={record.item_image}
                            fallbackSrc={undefined}
                            srcSuffix="s=100"
                            fallback={
                              <Image.SkeletonFallback
                                w="48px"
                                h="48px"
                                rounded={'sm'}
                              />
                            }
                            w="48px"
                            h="48px"
                          />
                          <VStack ml="5px" align={'flex-start'} spacing={'8px'}>
                            <NextLink href={getDetailAdr(record)} passHref>
                              <Link>
                                <Heading
                                  maxW="240px"
                                  overflow={'hidden'}
                                  textOverflow="ellipsis"
                                  whiteSpace="nowrap"
                                  fontWeight={'500'}
                                  fontSize="16px"
                                  m="0"
                                  as="h4"
                                >
                                  {record.item_title}
                                </Heading>
                              </Link>
                            </NextLink>

                            <Text
                              maxW="240px"
                              overflow={'hidden'}
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              color="typo.sec"
                              fontSize={'12px'}
                            >
                              {record.item_name}
                            </Text>
                          </VStack>
                        </Flex>
                      );
                    },
                  },
                  {
                    title: t('price'),
                    dataKey: 'price',
                    boxProps: {
                      bg: 'transparent',
                      color: 'rgba(255, 255, 255, 0.40)',
                    },
                    render: (t, record) => {
                      return renderPrice(
                        t,
                        record.type,
                        visitChain.nativeCurrency.decimals,
                      );
                    },
                  },
                  {
                    title: t('type'),
                    dataKey: 'type',
                    boxProps: {
                      bg: 'transparent',
                      color: 'rgba(255, 255, 255, 0.40)',
                    },
                    render: (_, record) => {
                      if (+record.type === NftActivityCurrencyType.NULL)
                        return <Text color="primary.deepGray">-</Text>;
                      return getCurrencySymbolByType(record.type);
                    },
                  },
                  {
                    title: t('from'),
                    boxProps: {
                      bg: 'transparent',
                      color: 'rgba(255, 255, 255, 0.40)',
                    },
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
                    boxProps: {
                      bg: 'transparent',
                      color: 'rgba(255, 255, 255, 0.40)',
                    },
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
                    boxProps: {
                      bg: 'transparent',
                      color: 'rgba(255, 255, 255, 0.40)',
                      pr: { base: 0, md: '62px' },
                    },
                    dataKey: 'tx',
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
                ]
              : [
                  {
                    title: t('activites.items'),
                    dataKey: 'item_title',
                    boxProps: {
                      bg: 'transparent',
                      color: 'rgba(255, 255, 255, 0.40)',
                    },
                    render: (_, record) => (
                      <>
                        <Text color="black" fontSize={'14px'} mb="8px">
                          {(() => {
                            if (+record.events < 5)
                              return eventOptions.find(
                                (el) => +el.value === +record.events,
                              )?.label;
                            return t('cancel');
                          })()}
                        </Text>
                        <NextLink href={getDetailAdr(record)} passHref>
                          <Link display={'block'}>
                            <Flex
                              justify={'space-between'}
                              w="full"
                              px={'20px'}
                            >
                              <Flex align={'center'}>
                                <Image
                                  rounded={'sm'}
                                  src={record.item_image}
                                  w="48px"
                                  h="48px"
                                  fallback={
                                    <Image.SkeletonFallback
                                      w="48px"
                                      h="48px"
                                      rounded={'sm'}
                                    />
                                  }
                                />
                                <VStack
                                  ml="5px"
                                  align={'flex-start'}
                                  spacing={'8px'}
                                >
                                  <Heading
                                    fontWeight={'500'}
                                    fontSize="16px"
                                    m="0"
                                    as="h4"
                                    maxW="50vw"
                                    textOverflow={'ellipsis'}
                                    whiteSpace="nowrap"
                                    overflow={'hidden'}
                                  >
                                    {record.item_title}
                                  </Heading>
                                  <Text
                                    color="typo.sec"
                                    fontSize={'12px'}
                                    maxW="50vw"
                                    textOverflow={'ellipsis'}
                                    whiteSpace="nowrap"
                                    overflow={'hidden'}
                                  >
                                    {record.item_name}
                                  </Text>
                                </VStack>
                              </Flex>
                              {renderPrice(
                                record.price,
                                record.type,
                                visitChain.nativeCurrency.decimals,
                              )}
                            </Flex>
                          </Link>
                        </NextLink>
                      </>
                    ),
                  },
                ]
          }
        />
      )}
      <LoadMore onLoad={onLoad} hasMore={state.hasMore} />
    </Box>
  );
}

export function ActivityTable(props: {
  params?: marketApis.ApiMarket.ActivityListQuery;
}) {
  const context = useContext(ActivitesFilterForm.Context);
  const reloadDeps = `${JSON.stringify(context.state)}|${JSON.stringify(
    props.params,
  )}`;
  return <ActivityTableContent key={reloadDeps} {...props} />;
}
