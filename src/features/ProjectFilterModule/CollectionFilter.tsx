import { FallbackImage } from '@/components/Image';
import { NavBoldSeachIcon } from '@/components/PageLayout/Header/ProfileButton/Icons';
import {
  Box,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Flex,
  HStack,
  useDisclosure,
  Collapse,
  Icon,
  CheckboxGroup,
  VStack,
  Checkbox,
  FlexProps,
  Center,
  Spinner,
  InputRightElement,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { BiChevronDown } from 'react-icons/bi';
import { useDebounceFn, useInViewport, useRequest } from 'ahooks';
import * as marketApis from '@/services/market';
import React, { SetStateAction, useEffect, useMemo, useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { logosByNetwork } from '@/contract/constants/logos';
import { SupportedChainId } from '@/contract/types';
import { useIsRare } from '@/store';
import { darkBg, darkLabelColor } from '@/utils/darkColor';

/** 解析attrs */
export const parseAttrs = (
  attrs?: string,
): Array<{ trait_type: string; value: string[] }> => {
  if (!attrs) return [];
  return JSON.parse(decodeURIComponent(attrs));
};

/** stringify attrs 便于映射到url */
export const stringifyAttrs = (
  attrs: Array<{ trait_type: string; value: string[] }>,
): string => {
  if (!attrs.length) return '';
  return encodeURIComponent(JSON.stringify(attrs));
};

const CollectionItemPlaceholder = () => (
  <Flex w="full" mb="16px" overflow={'hidden'}>
    <Box
      className="shimmer"
      w="54px"
      h="54px"
      flexShrink={0}
      borderRadius={'4px'}
      mr="14px"
    />
    <Box py="8px" w="full">
      <Box className="shimmer" rounded="full" h="14px" mb="3px" />
      <Box className="shimmer" w="10%" rounded="full" h="12px" />
    </Box>
  </Flex>
);

/** 合集item */
const CollectionItem = ({
  item,
  closeable,
  currencyRender,
  ...props
}: FlexProps & {
  item: marketApis.ApiMarket.ExploreFilterCollectionItem;
  currencyRender: () => React.ReactNode;
  closeable?: boolean;
}) => (
  <Flex
    role="group"
    pos="relative"
    w="full"
    mb="16px"
    overflow={'hidden'}
    cursor="pointer"
    borderRadius={'4px'}
    bg="#C6C4E110"
    fontFamily="PingFang HK"
    _hover={{ bg: '#746AEE10' }}
    {...props}
  >
    <FallbackImage
      src={item.image_uri}
      w="54px"
      h="54px"
      flexShrink={0}
      borderRadius={'4px'}
      mr="14px"
      srcSuffix="s=54"
    />
    <Box py="8px" w="full">
      <Text noOfLines={1} fontSize={'14px'} fontWeight={'600'}>
        {item.name}
      </Text>
      <HStack
        spacing={'3px'}
        alignItems="center"
        color="typo.sec"
        fontSize={'14px'}
      >
        {currencyRender?.()}
        <Text>{+item.floor_price === 0 ? '-' : item.floor_price}</Text>
      </HStack>
    </Box>
    {closeable && (
      <CloseIcon
        opacity={0}
        color="primary.deepGray"
        w="10px"
        pos="absolute"
        right="20px"
        top="20px"
        _groupHover={{
          opacity: 1,
        }}
      />
    )}
  </Flex>
);

/** 合集属性子项 */
const PropItem = ({
  state,
  item,
  onChange,
}: {
  state: CollectionFilterProps['state'];
  item: marketApis.ApiMarket.ExploreFilterCollectionItemAttr;
  onChange?: (checked: string[]) => void;
}) => {
  const t = useTranslations('common');
  const [list, setList] = useState(item.value);

  const checkboxGroupValue = useMemo(() => {
    if (!state.attrs) return [];
    const attrs = parseAttrs(state.attrs);
    return attrs.find((el) => el.trait_type === item.trait_type)?.value || [];
  }, [state.attrs]);

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: checkboxGroupValue.length > 0,
  });

  const [inputValue, setInputValue] = useState('');

  const searchDebounce = useDebounceFn(
    (val: string) => {
      setList(
        item.value.filter((el) =>
          el.value.toLocaleLowerCase().includes(val.toLocaleLowerCase()),
        ),
      );
    },
    { wait: 500 },
  );
  const [isRare] = useIsRare();

  return (
    <Box
      color="primary.main"
      fontSize={'14px'}
      fontWeight={500}
      fontFamily="Inter"
      mb="25px"
    >
      {/* 属性展开 */}
      <Flex onClick={onToggle} cursor={'pointer'} justify={'space-between'}>
        <Text color={isRare ? darkLabelColor : ''}>{item.trait_type}</Text>
        <Icon
          w="24px"
          h="auto"
          as={BiChevronDown}
          color={isRare ? darkLabelColor : ''}
          transform={`rotate(${isOpen ? '180deg' : '0'})`}
        />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box pt="25px">
          <InputGroup w="full" mb="20px">
            <InputLeftElement
              pointerEvents="none"
              children={<NavBoldSeachIcon color="#b5b5b5" />}
            />
            <Input
              value={inputValue}
              onChange={({ target }) => {
                setInputValue(target.value);
                searchDebounce.run(target.value);
              }}
              placeholder={t('filter.filter')}
            />
            {!!inputValue && (
              <InputRightElement
                onClick={() => {
                  setInputValue('');
                  searchDebounce.run('');
                }}
                cursor={'pointer'}
                children={<CloseIcon w="10px" color="#b5b5b5" />}
              />
            )}
          </InputGroup>
          <CheckboxGroup onChange={onChange} value={checkboxGroupValue}>
            <VStack
              bg={`/* Shadow Cover TOP */
            linear-gradient(
              white 30%,
              rgba(255, 255, 255, 0)
            ) center top,
            
            /* Shadow Cover BOTTOM */
            linear-gradient(
              rgba(255, 255, 255, 0), 
              white 70%
            ) center bottom,
            
            /* Shadow TOP */
            linear-gradient(
              #eee, 
              #eee
            ) center top,
            
            /* Shadow BOTTOM */
            linear-gradient(
              #eee, 
              #eee
            ) center bottom`}
              bgSize={'100% 2px, 100% 2px, 100% 1px, 100% 1px'}
              bgRepeat="no-repeat"
              bgAttachment="local, local, scroll, scroll"
              maxH="300px"
              overflowY={'auto'}
              alignItems={'flex-start'}
              w="full"
              spacing={'5px'}
            >
              {list?.map((el, i) => (
                <Checkbox
                  key={`${el.value}-${i}`}
                  value={el.value}
                  variant={'row'}
                  py="10px"
                >
                  <Flex grow="1" align={'center'} justify={'space-between'}>
                    <Text
                      noOfLines={1}
                      wordBreak="break-all"
                      fontSize={'14px'}
                      color={isRare ? darkLabelColor : ''}
                    >
                      {el.value}
                    </Text>
                    <Text
                      flexShrink={0}
                      fontSize={'12px'}
                      color={isRare ? darkLabelColor : 'primary.deepGray'}
                    >
                      {el.Count}({el.Percent}%)
                    </Text>
                  </Flex>
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </Box>
      </Collapse>
    </Box>
  );
};

function getList(p: any) {
  return marketApis.collectionNamelike(p).then((r) => ({
    list: r.data?.unecollection_list,
    noMore:
      !r.data?.unecollection_list || r.data?.unecollection_list?.length === 0,
  }));
}

/** 合集列表 */
const CollectionList = (props: {
  params?: marketApis.ApiMarket.CollectionNamelinkQuery;
  handleItemClick?: (
    item: marketApis.ApiMarket.ExploreFilterCollectionItem,
  ) => void;
}) => {
  const t = useTranslations('common');
  const { data, isEmpty, isLoading, loadMore } = useInfiniteScroll(getList, {
    target: () => document.querySelector('#layout-container-left'),
    isNoMore: (d) => d?.noMore!,
    threshold: 100,
    reloadDeps: [props.params!],
    manual: true,
  });

  const [containerInView] = useInViewport(() =>
    document.querySelector('#layout-container-left'),
  );

  useEffect(() => {
    if (containerInView) {
      loadMore();
    }
  }, [containerInView]);

  return (
    <>
      <Box py="20px" w="full">
        {data?.list?.map((item) => (
          <CollectionItem
            key={item.address}
            currencyRender={() => {
              const Currency =
                logosByNetwork[props.params?.chain_id! as SupportedChainId];
              return <Currency.Local w="14px" h="auto" />;
            }}
            item={item}
            onClick={() => props.handleItemClick?.(item)}
          />
        ))}
        {isEmpty && (
          <Center h="20vh" fontWeight={'700'} fontFamily="Inter">
            <Text>{t('noItems')}</Text>
          </Center>
        )}
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <CollectionItemPlaceholder key={i} />
          ))}
      </Box>
    </>
  );
};

/** 合集属性列表 */
const CollectionAttrList = (
  props: {
    collection?: marketApis.ApiMarket.ExploreFilterCollectionItem;
    projectId: number;
  } & CollectionFilterProps,
) => {
  const t = useTranslations('common');
  const { state, dispatch, collectionAddress, ownerWalletAddress } = props;
  const [isRare] = useIsRare();
  const { loading, data, run } = useRequest(marketApis.projectAttributes, {
    defaultParams: [
      {
        collection_id: props.projectId,
        chain_id: props.chainId,
      },
    ],
    // refreshDeps: [isRare],
  });
  useEffect(() => {
    if (isRare) {
      run({
        chain_id: props.chainId,
        collection_id: props.projectId,
      });
    }
  }, [isRare]);

  const [inputValue, setInputValue] = useState('');

  const searchDebounce = useDebounceFn(
    (val: string) => {
      run({
        chain_id: props.chainId,
        collection_id: props.projectId,
        value_like: val?.trim(),
      });
    },
    { wait: 500 },
  );

  const currentCollection = useMemo(() => {
    if (props.collection) return props.collection;
    if (loading) return undefined;
    return {
      name: data?.data?.name,
      image_uri: data?.data?.image_url,
      floor_price: data?.data?.floor_price,
      address: data?.data?.address,
    } as marketApis.ApiMarket.ExploreFilterCollectionItem;
  }, [props.collection, data?.data]);

  /** 属性筛选checkbox事件 */
  const attrChangeHandle = (
    attr: marketApis.ApiMarket.ExploreFilterCollectionItemAttr,
    val: string[],
  ) => {
    dispatch((prev) => {
      const attrs = parseAttrs(prev.attrs || '[]');
      // 没有勾选值时 直接移除当前attr
      if (!val.length) {
        return {
          ...prev,
          attrs: stringifyAttrs(
            attrs.filter((el) => el.trait_type !== attr.trait_type),
          ),
        };
      }
      // 是否存在attr
      const parentIndex = attrs.findIndex(
        (el) => el.trait_type === attr.trait_type,
      );
      if (parentIndex === -1) {
        // 不存在 追加
        attrs.push({ trait_type: attr.trait_type, value: val });
      } else {
        // 否则更新attrs
        attrs[parentIndex!]!.value = val;
      }
      return {
        ...prev,
        attrs: stringifyAttrs(attrs),
      };
    });
  };

  return (
    <Box w="full">
      {/* <Box pb="10px" w="full">
        {!currentCollection && loading && <CollectionItemPlaceholder />}
        {!collectionAddress && currentCollection && (
          <CollectionItem
            closeable
            mb="0"
            currencyRender={() => {
              const Currency =
                logosByNetwork[props.chainId as SupportedChainId];
              return <Currency.Local w="14px" h="auto" />;
            }}
            onClick={() => {
              // 移除当前选择collection
              dispatch((prev) => ({ ...prev, address: undefined }));
            }}
            item={currentCollection}
          />
        )}
      </Box>
      <Box display={'none'} pt="20px">
        <InputGroup w="full">
          <InputLeftElement
            pointerEvents="none"
            children={<NavBoldSeachIcon color="#b5b5b5" />}
          />
          <Input
            borderWidth={1}
            rounded="10px"
            autoComplete="false"
            value={inputValue}
            onChange={({ target }) => {
              setInputValue(target.value);
              searchDebounce.run(target.value);
            }}
            placeholder={t('filter.filter')}
          />
          {!!inputValue && (
            <InputRightElement
              onClick={() => {
                setInputValue('');
                searchDebounce.run('');
              }}
              cursor={'pointer'}
              children={<CloseIcon w="10px" color="#b5b5b5" />}
            />
          )}
        </InputGroup>
      </Box> */}
      {(() => {
        if (loading)
          return (
            <Center w="full" h="20vh">
              <Spinner />
            </Center>
          );
        if (
          !data?.data?.attrs ||
          (Array.isArray(data?.data?.attrs) && !data.data.attrs.length)
        )
          return (
            <Center h="20vh" fontWeight={'700'} fontFamily="Inter">
              <Text color={isRare ? 'white' : ''}>{t('noItems')}</Text>
            </Center>
          );

        if (Array.isArray(data?.data?.attrs) && data.data.attrs.length > 0)
          return (
            <Box py="20px" w="full">
              {data?.data?.attrs.map((attr, i) => (
                <PropItem
                  key={i}
                  state={state}
                  item={attr}
                  onChange={(val) => {
                    attrChangeHandle(attr, val);
                  }}
                />
              ))}
            </Box>
          );
        return null;
      })()}
    </Box>
  );
};

export type CollectionFilterProps = {
  /** 合集地址
   * 若设置此项，则默认不展示合集列表筛选，直接展示此合集的attrs
   */
  collectionAddress?: string;
  chainId: any;
  projectId: any;
  /**
   * 用户钱包地址
   * 会按需透传到对应业务接口
   * */
  ownerWalletAddress?: string;
  state: Partial<marketApis.ApiMarket.NftCollectionQueryType>;
  dispatch: (
    s: SetStateAction<Partial<marketApis.ApiMarket.NftCollectionQueryType>>,
  ) => void;
};

export const CollectionFilter = (props: CollectionFilterProps) => {
  const t = useTranslations('common');
  const { state, dispatch, ownerWalletAddress, collectionAddress } = props;

  const [currentCollection, setCurrentCollection] =
    useState<marketApis.ApiMarket.ExploreFilterCollectionItem>();

  const [inputValue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState('');

  const searchDebounce = useDebounceFn(
    (val: string) => {
      setKeyword(val);
    },
    { wait: 500 },
  );
  const [isRare] = useIsRare();

  if (props.projectId) return <CollectionAttrList {...props} />;

  return <div></div>;
};
