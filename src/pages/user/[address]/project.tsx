import { useTranslations } from 'next-intl';
import { serverSideTranslations } from '@/i18n';
import { GetServerSideProps } from 'next';
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Tab,
  TabList,
  Tabs,
  Text,
  useToast,
  VStack,
  Flex,
  createIcon,
  Spinner,
  SimpleGrid,
  IconButton,
} from '@chakra-ui/react';
import * as apis from '@/services/user';
import { ShimmerImage } from '@/components/Image';
import { BiCopy } from 'react-icons/bi';
import { shortAddress } from '@/utils';
import useCopy from '@/hooks/useCopy';
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { ExploreNftItem, ProjectItem } from '@/features/AssetItem';
import { useFetchUser, useUserDataValue } from '@/store';
import { useUpdateEffect } from 'ahooks';
import { ShareButton } from '@/features/AssetPage';
import { shareUtil } from '@/utils/share';
import { toLower } from 'lodash';
import { getBaseUrl } from '@/utils/getBaseUrl';
import CommonHead from '@/components/PageLayout/CommonHead';
import Upload from '@/components/Upload';
import { MobileHideFooter } from '@/components/PageLayout';
import {
  FilterContainer,
  NftFilterForm,
  parseCommonContentRequestParams,
} from '@/features/FilterModule';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { AiOutlineReload } from 'react-icons/ai';
import { useNftReflush } from '@/hooks/useNftReflush';
import { useSwitchChain } from '@/hooks/useSwitchChain';

const EditIcon = createIcon({
  displayName: 'Edit Icon',
  viewBox: '0 0 20 20',
  path: [
    <g key="g1" clipPath="url(#clip0_4246_6346)">
      <path
        d="M19.1956 18.3906H0.804379C0.591044 18.3906 0.386447 18.4754 0.235597 18.6263C0.0847468 18.7772 0 18.9819 0 19.1953C0 19.4087 0.0847468 19.6134 0.235597 19.7643C0.386447 19.9152 0.591044 20 0.804379 20H19.1956C19.409 20 19.6136 19.9152 19.7644 19.7643C19.9153 19.6134 20 19.4087 20 19.1953C20 18.9819 19.9153 18.7772 19.7644 18.6263C19.6136 18.4754 19.409 18.3906 19.1956 18.3906ZM19.5288 4.51578C19.8305 4.21396 20 3.80462 20 3.37779C20 2.95097 19.8305 2.54162 19.5288 2.23981L17.7582 0.468555C17.4565 0.166746 17.0473 -0.00280762 16.6207 -0.00280762C16.194 -0.00280762 15.7848 0.166746 15.4831 0.468555L14.9024 1.04945L18.9481 5.09667L19.5288 4.51578ZM6.66825 9.34388C6.60318 9.40949 6.55145 9.4871 6.51594 9.57243L4.24084 14.8195C4.17721 14.9528 4.15645 15.1025 4.18142 15.2481C4.20638 15.3937 4.27585 15.5279 4.38024 15.6324C4.48464 15.7368 4.61884 15.8063 4.76435 15.8313C4.90986 15.8562 5.05954 15.8355 5.19276 15.7718L10.476 13.5339C10.561 13.498 10.6385 13.4463 10.7044 13.3816L17.663 6.38226L13.6173 2.34456L6.66825 9.34388Z"
        fill="currentColor"
      />
    </g>,
    <defs key="d1">
      <clipPath id="clip0_4246_6346">
        <rect width="20" height="20" fill="currentColor" />
      </clipPath>
    </defs>,
  ],
});

export const CheckedIcon = createIcon({
  displayName: 'Create Icon',
  viewBox: '0 0 18 13',
  path: [
    <path
      key="p1"
      d="M15.8851 0.707108C15.4946 0.316584 14.8614 0.316589 14.4709 0.707119L7.00539 8.1728L3.04234 4.20978C2.65182 3.81927 2.01868 3.81926 1.62815 4.20976L0.707171 5.13068C0.316618 5.52121 0.316613 6.1544 0.707161 6.54493L6.29829 12.1358C6.68881 12.5263 7.32196 12.5263 7.71248 12.1358L16.8062 3.04237C17.1967 2.65184 17.1967 2.01867 16.8062 1.62814L15.8851 0.707108Z"
      fill="currentColor"
    />,
  ],
});

const AddressCopyButton = ({ address }: { address: string }) => {
  const toast = useToast();
  const [, copy] = useCopy();
  return (
    <Flex
      cursor={'pointer'}
      align={'center'}
      fontSize={{ base: '13px', md: '24px' }}
      fontWeight={'normal'}
      color="#FFF"
      onClick={async () => {
        try {
          await copy(address);
          toast({
            status: 'success',
            title: 'Address copied!',
            variant: 'subtle',
          });
        } catch (error) {
          console.warn('Copy faild: ', error);
        }
      }}
    >
      {shortAddress(address)}
      <Icon ml="10px" as={BiCopy} />
    </Flex>
  );
};

const UserBanner = React.forwardRef<
  any,
  { userInfo: apis.ApiUser.UserDetailInfo }
>(({ userInfo }, ref) => {
  const router = useRouter();
  const toast = useToast();
  const [_, onCopy] = useCopy();
  const { userData, fetchUser } = useFetchUser();
  const [editLoading, setEditLoading] = useState(false);
  const { reflush, reflushing } = useNftReflush();
  const { visitChain } = useSwitchChain();
  const canEdit = useMemo(
    () =>
      userData?.wallet_address &&
      toLower(userData?.wallet_address) === toLower(userInfo.wallet_address),
    [userData?.wallet_address, userInfo.wallet_address],
  );
  return (
    <Box
      ref={ref}
      fontFamily={'Inter'}
      w="full"
      pos="relative"
      bg="rgba(65, 65, 65)"
      bgImage={userInfo.profile_banner || undefined}
      bgRepeat="no-repeat"
      bgPos="center"
      bgSize={{ base: 'cover', md: '100%' }}
    >
      {!!userInfo.profile_banner && (
        <Box
          zIndex={1}
          w="full"
          pos="absolute"
          className="inset-0"
          backdropFilter="blur(12px)"
          bg="rgba(255, 255, 255, 0.7)"
          opacity={0.96}
        />
      )}
      <Box
        pos="relative"
        maxW={{ base: 'full', md: 'draft' }}
        mx="auto"
        px={5}
        zIndex={2}
      >
        <HStack
          pos="absolute"
          right="0"
          top="0"
          spacing={'18px'}
          pt="45px"
          display={{ base: 'none', md: 'flex' }}
        >
          <IconButton
            isLoading={reflushing}
            aria-label=""
            bg="none"
            color="#fff"
            _hover={{
              bg: 'blackAlpha.50',
            }}
            icon={<Icon as={AiOutlineReload} fontSize="30px" />}
            onClick={() => {
              reflush({ chain_id: visitChain.id });
            }}
          />
          <ShareButton
            bg="none"
            color="#fff"
            fontSize={28}
            onTwitter={() => {
              window.open(
                shareUtil.getTwitterShareUrl({
                  url: `${getBaseUrl()}/${router.locale}/user/${
                    userInfo.wallet_address
                  }`,
                  text: userInfo.username,
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
        </HStack>
        <Flex
          h={{ base: '160px', md: '320px' }}
          justify={'flex-start'}
          align={'center'}
        >
          <AspectRatio
            w={{ base: '72px', md: '140px' }}
            maxW={'140px'}
            ratio={1}
            borderWidth={2}
            borderColor="white"
            rounded="full"
            overflow="hidden"
            pos="relative"
            role="group"
          >
            <Upload
              disabled={!canEdit}
              value={canEdit ? userData?.profile_image : userInfo.profile_image}
              onChange={async (val) => {
                try {
                  setEditLoading(true);
                  await apis.updateUserInfo({ profile_image: val });
                  await fetchUser();
                  setEditLoading(false);
                } catch (error) {
                  setEditLoading(false);
                  toast({
                    status: 'error',
                    title: error.message,
                    variant: 'subtle',
                  });
                }
              }}
              wrapperProps={{
                maxW: { base: 'full', md: '240px' },
                h: 'full',
              }}
            >
              {({ value, loading }, actions) => {
                const isLoading = loading || editLoading;
                return (
                  <>
                    {canEdit && (
                      <Center
                        _groupHover={{ display: 'flex' }}
                        display={!value || isLoading ? 'flex' : 'none'}
                        bg="rgba(0,0,0,0.1)"
                        pos="absolute"
                        inset="0"
                        onClick={() =>
                          isLoading ? null : actions.chooseFile()
                        }
                        w="full"
                        h="full"
                      >
                        {isLoading ? (
                          <Spinner size="lg" thickness={'3px'} color="white" />
                        ) : (
                          <EditIcon fontSize={20} color="white" />
                        )}
                      </Center>
                    )}
                    <ShimmerImage
                      placeholder="blur"
                      w="full"
                      h="full"
                      src={value || '/images/common/placeholder.png'}
                    />
                  </>
                );
              }}
            </Upload>
          </AspectRatio>
          <VStack
            ml={{ base: '16px', md: '32px' }}
            pos="relative"
            justify="center"
            align="flex-start"
            color="primary.main"
            spacing={{ base: 0, md: 2 }}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: '16px', md: '32px' }}
              mb="10px"
              color={'#FFF'}
            >
              {userInfo.username || 'Unnamed'}
            </Heading>
            <AddressCopyButton
              address={
                userInfo.wallet_address || (router.query.address as string)
              }
            />

            <Text
              textAlign={{ base: 'center', md: 'left' }}
              size="sm"
              maxW={{ base: 'full', md: '60%' }}
            >
              {userInfo.bio}
            </Text>
          </VStack>
        </Flex>
      </Box>
    </Box>
  );
});

// 获取项目接口
function getProjectList(p: any) {
  parseCommonContentRequestParams(p);
  return apis.getUserProjectItems(p).then((r) => ({
    list: r?.data?.list,
    noMore:
      !r?.data?.list ||
      r?.data?.list?.length === 0 ||
      r?.data?.list.length < 10,
  }));
}

const UserItems = ({ bannerSize }: { bannerSize: { height: number } }) => {
  const router = useRouter();

  const ruleRef = useRef<any>();
  const { address: walletAddress } = router.query as Record<string, string>;

  const [tabIndex, setTabIndex] = useState(1);

  const { visitChain } = useSwitchChain();
  const t = useTranslations('userDetail');
  const ct = useTranslations('common');
  const { data, isError, loadMoreWhenError, isEmpty, pageSize, isLoading } =
    useInfiniteScroll((p) => getProjectList(p), {
      isNoMore: (d) => d?.noMore!,
      reloadDeps: [{ chain_id: visitChain.id }],
      threshold: 380,
      pageSize: 20,
    });

  useUpdateEffect(() => {
    window.scrollTo(0, 0);
  }, [visitChain.id]);

  useEffect(() => {
    ruleRef.current?.open();
  }, []);

  const onTabsChange = async (index: number) => {
    await router.push({
      pathname: `/user/${walletAddress}`,
      query: {
        tab: index,
      },
    });
    setTabIndex(index);
  };

  const { isSmallCard } = useContext(FilterContainer.Context);

  return (
    <Tabs index={tabIndex} onChange={onTabsChange} bg={'#2B2B2B'}>
      <Center borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.10)">
        <TabList
          fontFamily={'Inter'}
          borderWidth={0}
          color="typo.sec"
          gap={10}
          px={{ base: 5, md: 0 }}
          whiteSpace={'nowrap'}
          w="full"
          maxW={{ base: 'full', md: 'draft' }}
          overflowX="auto"
          overflowY="hidden"
          h={{ base: '60px', md: '100px' }}
        >
          {[t('ownedItems'), t('ownedProjects')].map((label, idx) => (
            <Tab
              key={label}
              fontFamily="PingFang HK"
              fontSize={{ base: '16px', md: '20px' }}
              fontWeight={'600'}
              px="0"
              pos="relative"
              _selected={{
                color: '#E49F5C',
              }}
              color={'rgba(255, 255, 255, 0.80)'}
            >
              {label}
              {tabIndex === idx && (
                <Box
                  pos="absolute"
                  left={0}
                  right={0}
                  bottom={'-1px'}
                  height={{ base: '3px', md: '5px' }}
                  zIndex={2}
                  w="full"
                  bg="#E49F5C"
                />
              )}
            </Tab>
          ))}
        </TabList>
      </Center>
      <Box
        px={{ base: 5, md: 5 }}
        pb={{ base: '64px', md: 5 }}
        pt={{ base: 5, md: 5 }}
      >
        <SimpleGrid
          w="full"
          templateColumns={{
            base: '1fr 1fr',
            md: `repeat(auto-fill, minmax(${
              isSmallCard ? '170px' : '214px'
            }, 1fr))`,
          }}
          spacing={5}
          fontSize="sm"
        >
          {data?.list?.map((item) => {
            return (
              <Box
                pos="relative"
                key={item.collection_address}
                cursor="pointer"
              >
                <ProjectItem
                  chainId={visitChain.id}
                  smallGrid={isSmallCard}
                  data={item}
                />
              </Box>
            );
          })}

          {isLoading &&
            Array.from({ length: pageSize }).map((_, i) => (
              <ExploreNftItem.Placeholder key={i} />
            ))}
        </SimpleGrid>
        {isEmpty && (
          <Center
            h="45vh"
            fontWeight={'700'}
            fontFamily="Inter"
            color={'rgba(255, 255, 255, 0.80)'}
          >
            <Text>{ct('noItems')}</Text>
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
              {ct('someThingWrong')}
            </Button>
          </Center>
        )}
      </Box>
    </Tabs>
  );
};

type PagePropType = {
  userInfo: apis.ApiUser.UserDetailInfo;
  userAddress: string;
};

export default function UserAddressPage({
  userInfo = {} as apis.ApiUser.UserDetailInfo,
  userAddress,
}: PagePropType) {
  const userData = useUserDataValue();
  const bannerRef = useRef<any>();
  const [bannerSize, setBannerSize] = useState({ height: 304 });
  const { visitChain } = useSwitchChain();

  const userIsOwner = useMemo(
    () =>
      toLower(userData?.wallet_address) === toLower(userInfo?.wallet_address),
    [userData?.wallet_address],
  );

  useEffect(() => {
    setBannerSize({
      height: bannerRef.current.offsetHeight,
    });
  }, []);

  const username = useMemo(
    () =>
      userInfo?.username ||
      userInfo?.wallet_address?.substring(userInfo?.wallet_address.length - 6),
    [userInfo],
  );

  return (
    <>
      <CommonHead
        title={userIsOwner ? 'Your NFTs in wallet' : username}
        description={`Check out ${username}`}
        image={userInfo.profile_image}
      />
      <UserBanner userInfo={userInfo} ref={bannerRef} />
      <FilterContainer.Provider>
        <NftFilterForm.Provider
          chainId={visitChain.id}
          ownerWalletAddress={userAddress}
          hideOrderTypeSelector
        >
          <UserItems bannerSize={bannerSize} />
        </NftFilterForm.Provider>
      </FilterContainer.Provider>
      <MobileHideFooter />
    </>
  );
}
import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
  req,
}) => {
  const messages = await serverSideTranslations(locale, ['userDetail']);
  const { address } = query as Record<string, string>;
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
    const { data } = await apis.getUserInfo({ wallet_address: address! });
    return {
      props: {
        messages,
        userInfo: data,
        userAddress: address,
      },
    };
  } catch (error) {
    return {
      props: {
        messages,
      },
    };
  }
};
