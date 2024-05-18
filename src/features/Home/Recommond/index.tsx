import {
  Box,
  Flex,
  Text,
  createIcon,
  HStack,
  Stack,
  Link,
  Divider,
  useMediaQuery,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import Image, { ShimmerImage } from '@/components/Image';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import { ETH, BNB } from '@/components/Icon';
import { ModuleTitle } from '../components';
import { staticChainId } from '@/store';
import { getQualityList } from '@/services/home';
import { sliceIntoChunks } from '@/utils';

const RecommondIcon = createIcon({
  displayName: 'RecommondIcon',
  viewBox: '0 0 34 18',
  path: (
    <svg
      width="34"
      height="18"
      viewBox="0 0 34 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32.2322 8.75024L25.2497 1.76773L18.2672 8.75024L25.2497 15.7328L32.2322 8.75024Z"
        stroke="#766DF6"
        strokeWidth="2.5"
      />
      <path
        d="M11.6082 8.75024L6.68816 3.83019L1.7681 8.75024L6.68816 13.6703L11.6082 8.75024Z"
        stroke="url(#paint0_radial_727_791)"
        strokeWidth="2.5"
      />
      <defs>
        <radialGradient
          id="paint0_radial_727_791"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(6.68816 8.75024) rotate(-133.208) scale(8.65087)"
        >
          <stop stopColor="#766DF6" />
          <stop offset="1" stopColor="#766DF6" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  ),
});

const getExtraText = (lang: any) => {
  if (lang === 'ja') {
    return `<br />&nbsp&nbsp加えて, <a style="text-decoration: underline" href="https://www.unemeta.com/ja/collection/1/0x9178A6a8b057210E28B3a7931dD825b04f69703b?source=search" target="_blank">TAG</a>や<a style="text-decoration: underline" href="https://www.unemeta.com/ja/collection/1/0x9178A6a8b057210E28B3a7931dD825b04f69703b?source=search" target="_blank">花澤香菜</a>のNFT所有者は、保有数における上昇ポイントが加算されます。※(最大15%)ポイント換算は変わる場合がる。詳細は下記まで：<a style="text-decoration: underline; color: #3182CE" href=" https://unemeta.wordpress.com/2023/06/05/%e3%80%8eunemeta%e3%80%8f%e3%83%9d%e3%82%a4%e3%83%b3%e3%83%88%e3%82%92%e7%8d%b2%e5%be%97%e3%81%99%e3%82%8b%e6%96%b9%e6%b3%95/" target="_blank">ウェブリンク</a>`;
  }
  if (lang === 'en') {
    return `<br />&nbsp&nbspIn addition, <a style="text-decoration: underline" href="https://www.unemeta.com/ja/collection/1/0x9178A6a8b057210E28B3a7931dD825b04f69703b?source=search" target="_blank">TAG</a> and <a style="text-decoration: underline" href="https://www.unemeta.com/ja/collection/1/0x9178A6a8b057210E28B3a7931dD825b04f69703b?source=search" target="_blank">Kanae Hanazawa</a> NFT holders can earn extra UUU points (up to 15%).`;
  }
  if (lang === 'zh') {
    return `<br />&nbsp&nbsp此外，<a style="text-decoration: underline" href="https://www.unemeta.com/ja/collection/1/0x9178A6a8b057210E28B3a7931dD825b04f69703b?source=search" target="_blank">TAG</a>和<a style="text-decoration: underline" href="https://www.unemeta.com/ja/collection/1/0x9178A6a8b057210E28B3a7931dD825b04f69703b?source=search" target="_blank">花澤香菜</a>NFT的持有者可以獲得額外的UUU積分（最高15%）。`;
  }
};

const ArrowIcon = createIcon({
  displayName: 'RecommondArrowIcon',
  viewBox: '0 0 16 16',
  path: (
    <g id="首页" stroke="none">
      <g
        id="首页备份"
        transform="translate(-658.000000, -1190.000000)"
        fill="#FFFFFF"
      >
        <g id="编组-13" transform="translate(80.000000, 834.000000)">
          <g id="编组-6" transform="translate(0.000000, 164.000000)">
            <g id="编组-8" transform="translate(472.000000, 176.000000)">
              <path
                d="M107.333336,16.666664 C107.333336,17.034856 107.631808,17.333336 108,17.333336 C108,17.333336 109.241285,17.333336 111.723856,17.333336 L106.195264,22.861928 C105.934912,23.12228 105.934912,23.544392 106.195264,23.804736 C106.455608,24.065088 106.87772,24.065088 107.138072,23.804736 C107.138072,23.804736 108.980936,21.961872 112.666664,18.276144 L112.666664,22 C112.666664,22.368192 112.965144,22.666664 113.333336,22.666664 C113.70152,22.666664 114,22.368192 114,22 C114,22 114,20.2222213 114,16.666664 C114,16.29848 113.70152,16 113.333336,16 C113.333336,16 111.555557,16 108,16 C107.631808,16 107.333336,16.29848 107.333336,16.666664 C107.333336,16.666664 107.333336,16.666664 107.333336,16.666664 Z"
                id="Icon"
              ></path>
            </g>
          </g>
        </g>
      </g>
    </g>
  ),
});

interface IListItem {
  vol: string;
  vol_in_week: string;
  order: number;
}

export const Recommond = (props: any) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const t = useTranslations('index');
  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [list, updateList] = useState(props.recommondData || []);
  const [currentSort, setCurrentSort] = useState('volIn7Days');
  const [isOpen, updateOpenStatus] = useState(false);
  const router = useRouter();
  const { runAsync } = useRequest(getQualityList, {
    manual: true,
  });

  const getList = async () => {
    let data: any = [];
    try {
      data = await runAsync();
    } catch (err) {
      console.log(err);
    }
    data?.data?.list && updateList(handleSort(data.data.list, 'volIn7Days'));
  };

  useEffect(() => {
    getList();
  }, [router?.locale]);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: false,
    slides: {
      spacing: isLargerThan768 ? 0 : -90,
    },
  });

  // 排序，总量or7日总量
  const handleSort = (
    targetList: Array<IListItem>,
    sortType: 'volIn7Days' | 'totalVol',
  ) => {
    setCurrentSort(sortType);
    const copyList = JSON.parse(JSON.stringify(targetList));
    // 提取出带order和不带的item，先对不带order的list按照volIn7Days或totalVol进行排序，之后把带order的item插入指定位置
    const listWithOrder: Array<IListItem> = [],
      listWithoutOrder: Array<IListItem> = [];
    copyList.forEach((item: IListItem) => {
      if (item.order && item.order <= 1000) {
        // 把order映射到数组的下标上
        item.order -= 1;
        listWithOrder.push(item);
      } else {
        listWithoutOrder.push(item);
      }
    });
    // 对listWithOrder进行一次正序排序，便于根据order插入到listWithoutOrder中
    listWithOrder.sort((a, b) => {
      return a.order - b.order;
    });
    switch (sortType) {
      case 'volIn7Days':
        listWithoutOrder.sort((a: IListItem, b: IListItem) => {
          return Number(b.vol_in_week) - Number(a.vol_in_week);
        });
        break;
      case 'totalVol':
        listWithoutOrder.sort((a: IListItem, b: IListItem) => {
          return Number(b.vol) - Number(a.vol);
        });
        break;
    }
    // 遍历带order的数组插入到按照volIn7Days或totalVol排序完的数组中
    listWithOrder.forEach((item) => {
      listWithoutOrder.splice(item.order, 0, {
        ...item,
        order: item.order + 1,
      });
    });
    return listWithoutOrder.filter((item) => {
      return !!item;
    });
  };

  const onOpen = () => {
    updateOpenStatus(true);
  };

  const onClose = () => {
    updateOpenStatus(false);
  };

  const renderHeader = () => {
    if (isLargerThan768) {
      return (
        <ModuleTitle
          title={t('cureatedDrops')}
          iconRender={<RecommondIcon />}
          desc={t('cureatedDropsDesc')}
          extra={t('cucreatedDropTipDesc')}
          tip={
            <Tooltip label={t('cucreatedDropIconTip')} placement="top">
              <QuestionOutlineIcon
                cursor="pointer"
                ml={{ md: '6x', base: '3px' }}
                color="#FB9D42"
                fontSize={{ md: 'md', base: '14px' }}
              />
            </Tooltip>
          }
          remark={
            isLargerThan768 ? (
              <Image
                position="absolute"
                top="-40px"
                left="80px"
                src="/images/home/quality_icon.png"
                w="155px"
                height="135px"
                objectFit="cover"
              />
            ) : null
          }
        />
      );
    } else {
      return (
        <Box mx="19px">
          <Text
            fontFamily="PingFangSC-Medium"
            fontWeight="600"
            color="#000000"
            fontSize="16px"
            mb="8px"
          >
            {t('partner')}
          </Text>
          <HStack
            align="center"
            borderBottom="1px solid #E4E8F2"
            pb="6px"
            onClick={onOpen}
          >
            <Box flex="1">
              <HStack
                display="inline-flex"
                align="center"
                mr="16px"
                spacing="0"
              >
                <Image
                  src="https://res.cloudinary.com/unemeta/image/upload/v1689599587/qrdsomejpkwk0a5kd9xt.png"
                  w="14px"
                  height="14px"
                  objectFit="cover"
                  mr="4px"
                />
                <Text
                  fontFamily="PingFangSC-Medium"
                  fontWeight="800"
                  color="rgba(0,0,0,0.45)"
                  fontSize="14px"
                >
                  {t('certified')}
                </Text>
              </HStack>
              <HStack
                display="inline-flex"
                align="center"
                mr="16px"
                spacing="0"
              >
                <Image
                  src="https://res.cloudinary.com/unemeta/image/upload/v1689599587/qrdsomejpkwk0a5kd9xt.png"
                  w="14px"
                  height="14px"
                  objectFit="cover"
                  mr="4px"
                />
                <Text
                  fontFamily="PingFangSC-Medium"
                  fontWeight="800"
                  color="rgba(0,0,0,0.45)"
                  fontSize="14px"
                >
                  {t('extraIntegral')}
                </Text>
              </HStack>
              <HStack display="inline-flex" align="center" spacing="0">
                <Image
                  src="https://res.cloudinary.com/unemeta/image/upload/v1689599587/qrdsomejpkwk0a5kd9xt.png"
                  w="14px"
                  height="14px"
                  objectFit="cover"
                  mr="4px"
                />
                <Text
                  fontFamily="PingFangSC-Medium"
                  fontWeight="800"
                  color="rgba(0,0,0,0.45)"
                  fontSize="14px"
                >
                  {t('excellentNFT')}
                </Text>
              </HStack>
            </Box>
            <Image
              src="https://res.cloudinary.com/unemeta/image/upload/v1689600952/sodjearsk5lltbs9tgjo.png"
              w="14px"
              height="14px"
              objectFit="cover"
            />
          </HStack>
        </Box>
      );
    }
  };

  const renderModal = () => {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent w="334px" borderRadius="16px">
          <ModalHeader pt="41px">
            <VStack align="center">
              <Image
                src="https://res.cloudinary.com/unemeta/image/upload/v1689601858/vkbsmiclvospqwe5wzzi.png"
                w="85px"
                height="85px"
                mb="10px"
              />
              <Text
                fontSize="20px"
                fontWeight="600"
                fontFamily="PingFangSC-Medium"
                color="#000000"
                lineHeight="24px"
              >
                {t('partner')}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px="33px" pt="0">
            <Text
              fontSize="14px"
              fontFamily="PingFangSC-Medium"
              color="rgba(0,0,0,0.65);"
              lineHeight="24px"
              textIndent="6px"
              wordBreak="break-all"
              dangerouslySetInnerHTML={{
                __html: `${t('cucreatedDropIconTip')}${getExtraText(
                  router?.locale,
                )}`,
              }}
            ></Text>
          </ModalBody>

          <ModalFooter pb="29px">
            <Button
              w="100%"
              height="48px"
              onClick={onClose}
              background="#000000"
              borderRadius="8px"
              fontSize="17px"
              color="#FFFFFF"
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const renderCuratedDrops = () => {
    return list.length ? (
      <Box w="full" mt={{ lg: '40px', base: '15px' }}>
        {isLargerThan768 ? (
          <Box px="40px">
            <SimpleGrid
              columns={{ base: 2, md: 2, lg: 3, xl: 4 }}
              spacing="20px"
            >
              {list.slice(0, 8).map((v: any, i: number) => {
                return (
                  <NextLink
                    key={i}
                    href={
                      v.project_id
                        ? `/projectList/${v?.chain_id || staticChainId}/${
                            v.project_id
                          }`
                        : `/collection/${v?.chain_id || staticChainId}/${
                            v?.contract_address
                          }`
                    }
                    passHref
                  >
                    <Link>
                      <Box
                        h="164px"
                        w="full"
                        px="16px"
                        background="#F7F8FA"
                        borderRadius="20px"
                        display="flex"
                        flexDir="row"
                        alignItems="center"
                      >
                        <ShimmerImage
                          w="132px"
                          minW="132px"
                          h="132px"
                          src={v?.icon}
                          borderRadius="8px"
                        />
                        <Flex flex="1" direction="column" ml="16px">
                          <Flex align="center" mb="14px">
                            <Text
                              noOfLines={1}
                              fontSize="20px"
                              fontWeight="bold"
                              lineHeight="30px"
                              color="#000000"
                            >
                              {v?.title}
                            </Text>

                            {v.chain_id === 97 || v.chain_id === 56 ? (
                              <Image
                                src="/images/home/bnbchain.png"
                                w="20px"
                                height="20px"
                                objectFit="cover"
                                ml="10px"
                              />
                            ) : (
                              <Image
                                src="https://imagedelivery.net/RZ7_BH6WYhwzv4Ay_WNEsw/6ab850f4-1cfc-469a-3aae-6affdd1b8f00/public"
                                w="20px"
                                height="20px"
                                objectFit="cover"
                                ml="10px"
                              />
                            )}
                          </Flex>
                          <Text
                            wordBreak="break-word"
                            noOfLines={2}
                            fontSize="12px"
                            color="#86909C"
                          >
                            {v?.description}
                          </Text>

                          <Flex
                            mt="8px"
                            direction="row"
                            align="flex-end"
                            justify="space-between"
                          >
                            <Flex flex="1" direction="column">
                              <Text
                                fontSize="12px"
                                color="#86909C"
                                lineHeight="20px"
                                mb="4px"
                              >
                                {t('floor')}
                              </Text>
                              <Text
                                fontSize="16px"
                                color="#1D2129"
                                lineHeight="24px"
                                fontWeight="bold"
                              >
                                {v?.openSea_floor
                                  ? `${parseFloat(v?.openSea_floor).toFixed(
                                      2,
                                    )}${
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
                              </Text>
                            </Flex>
                            <Flex flex="1" direction="column">
                              <Text
                                fontSize="12px"
                                color="#86909C"
                                lineHeight="20px"
                                mb="4px"
                              >
                                {t('vol')}
                              </Text>
                              <Text
                                fontSize="16px"
                                color="#1D2129"
                                lineHeight="24px"
                                fontWeight="bold"
                              >
                                {v?.vol_in_week
                                  ? `${parseFloat(v?.vol_in_week).toFixed(2)}${
                                      v.chain_id === 1 || v.chain_id === 5
                                        ? 'ETH'
                                        : 'BNB'
                                    }`
                                  : `${
                                      (+v.vol &&
                                        `${+v.vol}${
                                          v.chain_id === 1 || v.chain_id === 5
                                            ? 'ETH'
                                            : 'BNB'
                                        }`) ||
                                      '-'
                                    }`}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                        {/* <Box display="none">
                          <Flex
                            w="224px"
                            direction="row"
                            align="flex-end"
                            justify="space-between"
                          >
                            <Flex flex="1" direction="column">
                              <Text
                                fontSize="12px"
                                color="#86909C"
                                lineHeight="20px"
                                mb="4px"
                              >
                                {t('floor')}
                              </Text>
                              <Text
                                fontSize="12px"
                                color="#86909C"
                                lineHeight="20px"
                              >
                                {v.chain_id === 1 || v.chain_id === 5 ? (
                                  <ETH ml="-5px" />
                                ) : (
                                  <></>
                                )}
                                {v.chain_id === 97 || v.chain_id === 56 ? (
                                  <BNB ml="-5px" />
                                ) : (
                                  <></>
                                )}
                                {v?.openSea_floor
                                  ? parseFloat(v?.openSea_floor).toFixed(2)
                                  : +v.floor || '-'}
                              </Text>
                            </Flex>
                            <Flex flex="1" direction="column">
                              <Text
                                fontSize="12px"
                                color="#86909C"
                                lineHeight="20px"
                                mb="4px"
                              >
                                {t('vol')}
                              </Text>
                              <Text
                                fontSize="12px"
                                color="#86909C"
                                lineHeight="20px"
                              >
                                {v.chain_id === 1 || v.chain_id === 5 ? (
                                  <ETH ml="-4px" />
                                ) : (
                                  <></>
                                )}
                                {v.chain_id === 97 || v.chain_id === 56 ? (
                                  <BNB ml="-4px" />
                                ) : (
                                  <></>
                                )}
                                {v?.vol_in_week
                                  ? parseFloat(v?.vol_in_week).toFixed(2)
                                  : +v.vol || '-'}
                              </Text>
                            </Flex>
                          </Flex>
                        </Box> */}
                      </Box>
                    </Link>
                  </NextLink>
                );
              })}
            </SimpleGrid>
          </Box>
        ) : (
          <Box ref={sliderRef} pos="relative" w="full">
            <Box className="keen-slider" overflow="visible !important">
              {sliceIntoChunks(list, 5).map((v: any, i: number) => (
                <Box className="keen-slider__slide" key={i} hidden={!loaded}>
                  {v?.map((k: any, index: number) => (
                    <NextLink
                      key={index}
                      href={
                        k.project_id
                          ? `/projectList/${k?.chain_id || staticChainId}/${
                              k.project_id
                            }`
                          : `/collection/${k?.chain_id || staticChainId}/${
                              k?.contract_address
                            }`
                      }
                      passHref
                    >
                      <Link>
                        <Box
                          h="64px"
                          px="20px"
                          py="16px"
                          display="flex"
                          flexDir="row"
                          mb="15px !important"
                        >
                          <HStack spacing="0" h="64px">
                            <Text
                              width={'30px'}
                              fontSize="16px"
                              fontWeight="700"
                              color="#000000"
                              fontFamily="PingFangSC-Medium"
                            >
                              {i * 5 + (index + 1)}
                            </Text>
                            <Image
                              w="64px"
                              h="64px"
                              src={k?.icon}
                              borderRadius="8px"
                              mr="12px"
                              border="1px solid rgba(0,0,0,0.1)"
                            />
                          </HStack>
                          <Box h="64px" ml="8px">
                            <Flex align="center" mb="6px">
                              <Text
                                noOfLines={1}
                                fontSize="14px"
                                fontWeight="700"
                                fontFamily="PingFangSC-Medium"
                                lineHeight="16px"
                                color="#000000"
                                mb="6px"
                                mt="6px"
                              >
                                {k?.title}
                              </Text>
                              {k.chain_id === 97 || k.chain_id === 56 ? (
                                <Image
                                  src="/images/home/bnbchain.png"
                                  w="14px"
                                  height="14px"
                                  objectFit="cover"
                                  ml="5px"
                                />
                              ) : (
                                <Image
                                  src="https://imagedelivery.net/RZ7_BH6WYhwzv4Ay_WNEsw/6ab850f4-1cfc-469a-3aae-6affdd1b8f00/public"
                                  w="14px"
                                  height="14px"
                                  objectFit="cover"
                                  ml="5px"
                                />
                              )}
                            </Flex>
                            <Flex direction="row" align="flex-end">
                              <Flex direction="column" mr="34px">
                                <Text
                                  fontSize="12px"
                                  color="#777E90"
                                  lineHeight="12px"
                                  fontFamily="PingFangSC-Medium"
                                  fontWeight="600"
                                  mb="2px"
                                >
                                  {t('floor')}
                                </Text>
                                <Box
                                  fontSize="12px"
                                  color="#000000"
                                  fontFamily="PingFangSC-Medium"
                                  fontWeight="600"
                                  lineHeight="16px"
                                >
                                  {k?.openSea_floor
                                    ? parseFloat(k?.openSea_floor).toFixed(2)
                                    : +k.floor || '-'}
                                  <Text
                                    display="inline-block"
                                    ml="3px"
                                    fontFamily="PingFangSC-Medium"
                                    fontWeight="600"
                                  >
                                    {k?.openSea_floor &&
                                    (k.chain_id === 1 || k.chain_id === 5) ? (
                                      'ETH'
                                    ) : (
                                      <></>
                                    )}
                                    {k?.openSea_floor &&
                                    (k.chain_id === 97 || k.chain_id === 56) ? (
                                      'BNB'
                                    ) : (
                                      <></>
                                    )}
                                  </Text>
                                </Box>
                              </Flex>
                              <Flex direction="column">
                                <Text
                                  fontSize="12px"
                                  color="#777E90"
                                  lineHeight="12px"
                                  mb="2px"
                                >
                                  {t('vol')}
                                </Text>
                                <Box
                                  fontSize="12px"
                                  color="#000000"
                                  fontFamily="PingFangSC-Medium"
                                  fontWeight="600"
                                  lineHeight="16px"
                                >
                                  {k?.vol_in_week
                                    ? parseFloat(k?.vol_in_week).toFixed(2)
                                    : +k.vol || '-'}
                                  <Text
                                    display="inline-block"
                                    ml="3px"
                                    fontFamily="PingFangSC-Medium"
                                    fontWeight="600"
                                  >
                                    {k?.vol_in_week &&
                                    (k.chain_id === 1 || k.chain_id === 5) ? (
                                      'ETH'
                                    ) : (
                                      <></>
                                    )}
                                    {k?.vol_in_week &&
                                    (k.chain_id === 97 || k.chain_id === 56) ? (
                                      'BNB'
                                    ) : (
                                      <></>
                                    )}
                                  </Text>
                                </Box>
                              </Flex>
                            </Flex>
                          </Box>
                        </Box>
                      </Link>
                    </NextLink>
                  ))}
                </Box>
              ))}
            </Box>
            {isLargerThan768 &&
              loaded &&
              instanceRef?.current &&
              instanceRef?.current?.track?.details?.slides.length > 1 && (
                <>
                  <HStack
                    spacing={4}
                    pos="absolute"
                    bottom={{ md: '6px', base: '-10px' }}
                    w="full"
                    justify="center"
                  >
                    {[
                      ...Array(
                        instanceRef?.current?.track?.details?.slides.length,
                      ).keys(),
                    ].map((idx) => (
                      <Box
                        key={idx}
                        onClick={() => {
                          instanceRef?.current?.moveToIdx(idx);
                        }}
                        w="8px"
                        h="8px"
                        rounded="full"
                        bg="#BBB6C9"
                        opacity={currentSlide === idx ? 1 : 0.4}
                      />
                    ))}
                  </HStack>
                </>
              )}
          </Box>
        )}
      </Box>
    ) : null;
  };

  return (
    <Box
      pt={{ lg: '80px', base: '0px' }}
      mb={{ md: '90px', base: '32px' }}
      // maxW={{ md: '1270px' }}
      mx="auto"
      mt={{ md: 0, base: '16px' }}
    >
      {renderHeader()}
      {renderCuratedDrops()}
      {renderModal()}
    </Box>
  );
};
