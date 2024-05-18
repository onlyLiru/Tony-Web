import {
  Box,
  ChakraProps,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useToast,
  VStack,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverAnchor,
  Heading,
  useMediaQuery,
  Flex,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  useDisclosure,
  useBoolean,
  Spinner,
  Center,
  HStack,
  IconButton,
  Text,
} from '@chakra-ui/react';
import Image from '@/components/Image';
import { CloseIcon } from '@chakra-ui/icons';
import { NavSeachIcon, NavBoldSeachIcon } from '../ProfileButton/Icons';
import { useDebounceEffect, useRequest, useClickAway } from 'ahooks';
import {
  collectionSearch,
  hotCollectionSearch,
  ApiMarket,
} from '@/services/market';
import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { useMounted } from '@/hooks/useMounted';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { ETH, BNB } from '@/components/Icon';

type PopoverSearchProps = ChakraProps;

const SearchMain = () => {
  const [search, setSearch] = useState('');
  const [collections, setCollections] = useState<
    ApiMarket.CollectionSearchItem[]
  >([]);
  // 历史搜索collection，拆成多个字段的原因是移动端需要同时显示历史搜索和热门，一个collections无法满足需求
  const [historyCollections, setHistoryCollections] = useState<
    ApiMarket.CollectionSearchItem[]
  >([]);
  // 热门collection，当移动端时需要一直显示
  const [hotCollections, setHotCollections] = useState<
    ApiMarket.CollectionSearchItem[]
  >([]);

  const [projects, setProjects] = useState<ApiMarket.ProjectSearchs[]>([]);
  const t = useTranslations('common');
  const toast = useToast();
  const [isEditing, setIsEditing] = useBoolean();
  const initialFocusRef = useRef(null);
  const popoverref = useRef(null);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const { visitChain } = useSwitchChain();

  useClickAway(() => {
    setIsEditing.off();
  }, [popoverref, initialFocusRef]);

  // 初始化搜索历史及热门NFT
  useEffect(() => {
    const localStorageSearchHistory = localStorage.getItem(
      'searchCollectionsHistory',
    );
    localStorageSearchHistory &&
      setHistoryCollections(JSON.parse(localStorageSearchHistory));
    hotCollectionSearch().then((res) => {
      if (res.data && Array.isArray(res.data.nft_list)) {
        setHotCollections(res.data.nft_list);
      } else {
        toast({ status: 'error', title: res.msg, variant: 'subtle' });
      }
    });
  }, []);

  const searchReq = useRequest(collectionSearch, { manual: true });

  const onSearch = async () => {
    try {
      const { data } = await searchReq.runAsync({
        search,
      });
      setCollections(data?.contract_list || []);
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  useDebounceEffect(
    () => {
      if (!search) {
        setCollections([]);
        setProjects([]);
        return;
      }
      onSearch();
    },
    [search],
    { wait: 300 },
  );

  // 清空搜索历史
  const handleClearSearchHistory = (index: number | '') => {
    const tempSearchCollectionsHistory: ApiMarket.CollectionSearchItem[] =
      JSON.parse(JSON.stringify(historyCollections));
    Number.isFinite(index) &&
      tempSearchCollectionsHistory.splice(index as number, 1);
    localStorage.setItem(
      'searchCollectionsHistory',
      JSON.stringify(tempSearchCollectionsHistory),
    );
    setHistoryCollections(
      Number.isFinite(index) ? tempSearchCollectionsHistory : [],
    );
    setTimeout(() => {
      setIsEditing.on();
    }, 50);
  };

  // 集合点击，缓存点击的集合数据
  const handleCollectionClick = (item: ApiMarket.CollectionSearchItem) => {
    // 缓存点击数据用于回显
    const historyCollections: ApiMarket.CollectionSearchItem[] = JSON.parse(
      localStorage.getItem('searchCollectionsHistory') || '[]',
    );
    historyCollections.unshift(item);
    localStorage.setItem(
      'searchCollectionsHistory',
      JSON.stringify(historyCollections.slice(0, 10)),
    );
  };

  const scrollbarStyles = `
  /* 隐藏纵向滚动条 */
  ::-webkit-scrollbar {
    width: 0;
  }
  /* 隐藏纵向滚动条（如果需要的话） */
  ::-webkit-scrollbar-vertical {
    display: none;
  }
  /* 隐藏滚动条的轨道 */
  ::-webkit-scrollbar-track {
    display: none;
  }
`;

  // 根据传入的nft list渲染出相应的元素
  const renderCollectionList = (
    collectionsList: ApiMarket.CollectionSearchItem[],
    mode: 'hot' | 'history' | 'search',
  ) => {
    return (
      collectionsList &&
      collectionsList.map((option, optionIndex) => (
        <NextLink
          key={option.contract_address}
          href={`/collection/${option.chain_id}/${option.contract_address}?source=search`}
          passHref
        >
          <Link w="full" className="Tn006" target="_blank">
            <HStack
              padding={`${mode !== 'history' ? '24px' : '0'} 24px`}
              mt="16px"
              w="full"
              h={mode !== 'history' ? '48px' : 'auto'}
              rounded="none"
              justifyContent="flex-start"
              borderRadius="8px"
              _hover={{
                bg: '#f6f6f6',
              }}
              _active={{
                bg: '#f6f6f6',
              }}
              overflow="hidden"
              onClick={() => {
                handleCollectionClick(option);
              }}
            >
              {/* logo,搜索历史时没有 */}
              {mode !== 'history' && (
                <Image
                  borderRadius="8px"
                  src={option.logo || option.icon}
                  w="48px"
                  fallbackSrc="https://res.cloudinary.com/unemeta/image/upload/f_auto/f_auto/f_auto,q_auto/v1/samples/i6sqns3vhvez0m54bk9u"
                  srcSuffix="s=100"
                />
              )}
              {/* 名字及数量,搜索历史时没有数量 */}
              <Flex direction="column">
                <Flex alignItems="center">
                  <Text
                    w="full"
                    fontSize="14px"
                    fontWeight="bold"
                    noOfLines={1}
                    textAlign={'left'}
                    size={{ base: 'xs', md: 'sm' }}
                  >
                    {option.name || option.title}
                  </Text>
                  {(option.is_buddy && (
                    <Image
                      src="https://imagedelivery.net/RZ7_BH6WYhwzv4Ay_WNEsw/6ab850f4-1cfc-469a-3aae-6affdd1b8f00/public"
                      w="16px"
                      h="16px"
                      ml="8px"
                    ></Image>
                  )) ||
                    null}
                </Flex>

                {mode !== 'history' && (
                  <Flex mt="2px" alignItems="center">
                    {option.chain_id === 1 || option.chain_id === 5 ? (
                      <ETH ml="-5px" />
                    ) : (
                      <></>
                    )}
                    {option.chain_id === 97 || option.chain_id === 56 ? (
                      <BNB ml="-5px" />
                    ) : (
                      <></>
                    )}
                    <Text
                      fontSize="14px"
                      fontWeight={isLargerThan768 ? 'bold' : 400}
                      color="rgba(0,0,0,0.45)"
                    >
                      {option.total_supply || '--'} items
                    </Text>
                  </Flex>
                )}
              </Flex>
              {/* 价格,仅当搜索时有 */}
              {mode === 'search' && (
                <Text
                  flex="1"
                  textAlign="right"
                  fontSize="14px"
                  color="rgba(0,0,0,0.45)"
                >
                  {option.floor_price && option.floor_price > 0
                    ? `${option.floor_price} ${
                        option.chain_id === 1 || option.chain_id === 5
                          ? 'ETH'
                          : 'BNB'
                      }`
                    : ''}
                </Text>
              )}
              {/* 清除按钮，仅当显示搜索历史时有 */}
              {mode === 'history' && (
                <Box flex="1" textAlign="right">
                  <Box
                    display="inline-block"
                    pl={2}
                    pr={2}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleClearSearchHistory(optionIndex);
                    }}
                  >
                    <Image
                      w="10px"
                      h="10px"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAeCAYAAAEz5ozFAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAJKADAAQAAAABAAAAHgAAAADiV2HhAAACXUlEQVRYCa1Xu24cMQy8vGDASKpUKQK4MxDAnZEiFdt8RH4yTVp9QH4gnQEXW7lLlSozMuei5UpaaXMEyJH4GNJa3d75dNqKRdclHOTc8Iw5a2U1H9lyj2ZQCUSKZVuYjSPGegm3SH6rgloiE6grsWK3SnhRBLg06MIF5NcznE4vtXBkwmfoOSHEc3/NYDHI/WoGTzDHDLUExXPiK+2AdNxAH6AjQvI76BX0KZ4ACYwGkrLdGhJ8gC7Q8yHUiFRqvkiOVQKPnXpEyvmGxXvoD+h5AgWFPaI4gXlRUnGJNaJIUOZzbe5IjhlKoj2Cso5rc0ci8vG/g36BXkGfoDNiSL6BPpDoD5QkfKQzZIZ8SqLRheQkM2TGYkjKFkZE3I+SGZMhKVs3JRFde2TmdcnxDJGIgRaZeVVyXMHr1e7fRjeYD4AiTHlXMbWJlKbJvsLxBvpdgRr2iJh/ByXJI7R7NXpEhmIKJ9m9Gi0iIwMkZdt+AB5e3yM5zRdJDkedWfUTECcyL0qOEZpkJZF5VYrVYV8lE5F5cgpFre2GrPY+UvGChS6mfJfCWxDpkpPz3KscSM2ayUr4D9zlrg2kfrvFShzAYa7eQOozTKaCAqdrRwYS/wz5TK74M84MpMJes15M9V08MpAIy+Yf3fnouAAPfUL1/lCTGdQ75BOK+AvsGspvCA5yaBjUDf3kY16U8nQY44lQqu+W59CYnX1ktUHiaYzkNKcbHehIkyM1u4/sEGn486c4Wic0RRIGaG2HOONAQ0WtjoP+bg8NxP+f7wvCBet4WYvwRZZxsJ9g/f0XzVaAVUPnVhEAAAAASUVORK5CYII="
                      alt="clear"
                      display="inline"
                    />
                  </Box>
                </Box>
              )}
            </HStack>
          </Link>
        </NextLink>
      ))
    );
  };

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      isOpen={isEditing}
      onClose={setIsEditing.off}
      closeOnBlur
    >
      <PopoverAnchor>
        <InputGroup w="full">
          {/* <InputLeftElement
      pointerEvents='none'
      // color='gray.300'
      // fontSize='1.2em'
    >
      <Image src='../../../../../public/images/aiLandingPage/search.svg'></Image>
    </InputLeftElement> */}
          <Input
            border="1px solid #404040 !important"
            backgroundColor="#404040"
            color={'#fff'}
            ref={initialFocusRef}
            w="full"
            fontFamily="Inter"
            fontSize="16px"
            _placeholder={{
              fontFamily: 'Inter',
              color: '#828282',
              fontWeight: 400,
              fontSize: '14px',
            }}
            placeholder={`🔍  ${t('header.search')}`}
            borderRadius="12px"
            h="40px"
            textAlign="center"
            value={search}
            onChange={(e) => setSearch(e.target.value.toString())}
            onFocus={setIsEditing.on}
          />
        </InputGroup>
      </PopoverAnchor>
      <PopoverContent
        border="none"
        p="0"
        shadow="lg"
        borderRadius="16px"
        overflow="hidden"
        w={isLargerThan768 ? '440px' : 'calc(100vw - 32px)'}
        ref={popoverref}
        maxH={isLargerThan768 ? '500px' : 'calc(100vh - 200px)'}
        overflowY="scroll"
      >
        <style>{scrollbarStyles}</style>
        <PopoverBody p="0">
          <VStack
            w="full"
            h="auto"
            borderRadius="4px"
            bg="white"
            boxShadow="0px 2px 20px 0px rgba(0,0,0,0.12)"
            overflow="hidden"
            paddingBottom="24px"
          >
            {searchReq.loading ? (
              <Center w="full" py={2}>
                <Spinner />
              </Center>
            ) : (
              <>
                <Box w="full">
                  {/* 搜索历史，当没有搜索结果并且本地有缓存时显示 */}
                  {(collections.length === 0 && historyCollections.length && (
                    <>
                      <Flex
                        color="rgba(0,0,0,.25)"
                        mt="24px"
                        padding="0 24px"
                        fontSize="14px"
                        justifyContent="space-between"
                      >
                        <>
                          <Text>Search History</Text>
                          <Text
                            cursor="pointer"
                            onClick={() => {
                              handleClearSearchHistory('');
                            }}
                          >
                            clear
                          </Text>
                        </>
                      </Flex>
                      {renderCollectionList(historyCollections, 'history')}
                    </>
                  )) ||
                    null}
                  {/* 搜索文案，当有搜索结果时显示 */}
                  {(collections.length && (
                    <Text
                      color="rgba(0,0,0,.25)"
                      mt="24px"
                      padding="0 24px"
                      fontSize="14px"
                      justifyContent="space-between"
                      fontWeight={isLargerThan768 ? 'bold' : 400}
                    >
                      Searching
                    </Text>
                  )) ||
                    null}
                  {/* 热门搜索，当没有搜索结果并且没有本地缓存时显示 */}
                  {/* but 当移动端的时候，需要同时显示搜索历史和热门 */}
                  {(collections.length === 0 &&
                    (historyCollections.length === 0 || !isLargerThan768) &&
                    hotCollections.length && (
                      <>
                        <Flex
                          color="rgba(0,0,0,.25)"
                          mt="24px"
                          padding="0 24px"
                          fontSize="14px"
                          justifyContent="space-between"
                        >
                          <Text fontWeight={isLargerThan768 ? 'bold' : 400}>
                            Top Searches
                          </Text>
                        </Flex>
                        {renderCollectionList(hotCollections, 'hot')}
                      </>
                    )) ||
                    null}
                  {/* 主动触发的搜索结果 */}
                  {(collections.length &&
                    renderCollectionList(collections, 'search')) ||
                    null}
                </Box>
              </>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

type ModalRef = {
  open: () => void;
  close: () => void;
};

const MobileSearchModal = forwardRef((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useImperativeHandle(ref, () => ({
    open: onOpen,
    close: onClose,
  }));

  return (
    <Modal
      size="full"
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInRight"
    >
      <ModalOverlay />
      <ModalContent
        py={2}
        fontFamily="Inter"
        color="primary.main"
        fontWeight={'bold'}
      >
        <ModalHeader>
          <Image
            w="120px"
            h="auto"
            objectFit={'contain'}
            src={'/logo_text.svg'}
            alt="unemeta logo"
          />
        </ModalHeader>
        <ModalCloseButton top={4} right={4} fontSize="md" />
        <ModalBody p={4}>
          <SearchMain />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

const PopoverSearch: React.FC<PopoverSearchProps> = (props) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const modalRef = useRef<ModalRef>();
  const isMounted = useMounted();

  if (!isMounted) return null;

  return (
    <Box {...props}>
      {isLargerThan768 ? (
        <SearchMain />
      ) : (
        <>
          <Flex>
            <IconButton
              bg="none"
              aria-label=""
              fontSize={{ base: '24px', md: '28px' }}
              _hover={{ opacity: 0.6 }}
              onClick={modalRef.current?.open}
              color="primary.main"
              icon={<NavSeachIcon />}
            />
          </Flex>
          <MobileSearchModal ref={modalRef} />
        </>
      )}
    </Box>
  );
};

export default PopoverSearch;
