import { useTranslations } from 'next-intl';
import {
  AspectRatio,
  Box,
  createIcon,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useMediaQuery,
  useToast,
  VStack,
} from '@chakra-ui/react';
import Image from '@/components/Image';
import { FaDiscord, FaFacebook, FaTwitter, FaTelegram } from 'react-icons/fa';
import { StarIcon } from '@chakra-ui/icons';
import { useEffect, useRef } from 'react';
import * as marketApis from '@/services/market';
import { useCollectionReflush } from '@/hooks/useCollectionReflush';
import { useRouter } from 'next/router';
import { useUserDataValue } from '@/store';
import { BiEditAlt } from 'react-icons/bi';
import { AiOutlineReload } from 'react-icons/ai';
import {
  CollectionRoyaltySetting,
  CollectionRoyaltySettingAction,
} from '@/features/Royalty';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { Ellipsis } from '@/components/Ellipsis';
import { useRequest } from 'ahooks';
import { useSwitchChain } from '@/hooks/useSwitchChain';
// import { SupportedChainId } from '@/contract/types';
import { useMounted } from '@/hooks/useMounted';
import { ETH, BNB } from '@/components/Icon';
import { useIsRare, useRareMode } from '@/store';

function getRoyaltyContractMethodName(mintType: number) {
  if (mintType === 0) return 'updateRoyaltyInfoForCollectionIfSetter';
  if (mintType === 2) return 'updateRoyaltyInfoForCollectionIfOwner';
  return 'updateRoyaltyInfoForCollectionIfAdmin';
}

const EtherscanIcon = createIcon({
  displayName: 'Etherscan Icon',
  viewBox: '0 0 24 24',
  path: (
    <path
      d="M6.15505 11.522C6.15505 11.4104 6.17708 11.2998 6.21988 11.1968C6.26269 11.0937 6.32542 11.0001 6.40448 10.9213C6.48354 10.8425 6.57738 10.7801 6.68061 10.7377C6.78384 10.6952 6.89444 10.6736 7.00605 10.674L8.41805 10.679C8.52949 10.679 8.63985 10.7009 8.7428 10.7436C8.84574 10.7863 8.93927 10.8489 9.01803 10.9277C9.09679 11.0066 9.15923 11.1002 9.20179 11.2032C9.24434 11.3062 9.26618 11.4165 9.26605 11.528V16.868C9.42605 16.821 9.62905 16.771 9.85205 16.718C10.0071 16.6815 10.1453 16.5937 10.2442 16.4688C10.3432 16.3439 10.397 16.1893 10.397 16.03V9.40598C10.3969 9.2944 10.4188 9.18389 10.4614 9.08077C10.504 8.97765 10.5665 8.88394 10.6454 8.805C10.7242 8.72606 10.8178 8.66343 10.9209 8.6207C11.024 8.57797 11.1345 8.55598 11.246 8.55598H12.66C12.7716 8.55598 12.882 8.57798 12.985 8.62072C13.088 8.66346 13.1816 8.7261 13.2604 8.80506C13.3392 8.88402 13.4016 8.97773 13.4441 9.08085C13.4866 9.18396 13.5083 9.29445 13.508 9.40598V15.554C13.508 15.554 13.862 15.41 14.208 15.264C14.3361 15.2096 14.4453 15.1189 14.5221 15.0029C14.5989 14.887 14.6399 14.751 14.64 14.612V7.28198C14.64 7.05708 14.7294 6.84138 14.8884 6.68235C15.0475 6.52332 15.2631 6.43398 15.488 6.43398H16.902C17.0136 6.43385 17.124 6.45572 17.2271 6.49834C17.3302 6.54096 17.4238 6.60349 17.5027 6.68235C17.5815 6.76122 17.6441 6.85486 17.6867 6.95793C17.7293 7.06099 17.7512 7.17145 17.751 7.28298V13.318C18.977 12.429 20.219 11.36 21.205 10.074C21.3481 9.88736 21.4427 9.66828 21.4806 9.43623C21.5184 9.20418 21.4983 8.96638 21.4221 8.74398C20.7551 6.79896 19.5039 5.10732 17.8393 3.90023C16.1747 2.69314 14.178 2.02949 12.122 1.99998C6.58005 1.92598 2.00005 6.45398 2.00005 12C1.99455 13.755 2.45229 15.4805 3.32705 17.002C3.44757 17.2101 3.62499 17.3794 3.83845 17.4901C4.0519 17.6008 4.29253 17.6483 4.53205 17.627C4.80005 17.603 5.13205 17.57 5.52905 17.523C5.70133 17.5031 5.8603 17.4206 5.97572 17.2912C6.09114 17.1617 6.15496 16.9944 6.15505 16.821V11.521M6.12305 20.087C7.23775 20.8987 8.50845 21.4707 9.85512 21.7671C11.2018 22.0635 12.5953 22.0778 13.9477 21.8091C15.3002 21.5405 16.5824 20.9946 17.7135 20.206C18.8447 19.4174 19.8002 18.4031 20.5201 17.227C21.6042 15.4546 22.1096 13.3887 21.966 11.316C18.316 16.764 11.575 19.311 6.12305 20.087Z"
      fill="currentColor"
    />
  ),
});

const WebsiteIcon = createIcon({
  displayName: 'Website Icon',
  viewBox: '0 0 24 24',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.4888 2.625C17.2406 3.27814 18.7745 4.40887 19.9166 5.88909C21.0587 7.3693 21.7634 9.13981 21.9508 11H17.9808C17.8178 7.12 16.7258 4.396 15.4948 2.627L15.4888 2.625ZM12.0008 2C8.95778 3.442 8.11078 8.085 7.97878 11H15.9788C15.8388 7.952 14.9738 3.648 12.0008 2ZM8.44678 2.65C7.22178 4.419 6.13778 7.136 5.97678 11H2.05078C2.23711 9.15164 2.93418 7.39161 4.06396 5.91691C5.19374 4.44221 6.71164 3.31104 8.44778 2.65H8.44678ZM15.4888 21.375C17.2408 20.722 18.7749 19.5913 19.9171 18.1111C21.0594 16.6309 21.7643 14.8603 21.9518 13H17.9798C17.8188 16.88 16.7268 19.604 15.4948 21.373L15.4888 21.375ZM12.0008 22C8.95778 20.558 8.11178 15.915 7.97878 13H15.9788C15.8388 16.048 14.9738 20.352 12.0008 22ZM8.44678 21.35C7.22178 19.581 6.13778 16.864 5.97678 13H2.05078C2.23711 14.8484 2.93418 16.6084 4.06396 18.0831C5.19374 19.5578 6.71164 20.689 8.44778 21.35H8.44678Z"
      fill="currentColor"
    />
  ),
});

const ShareLinks = ({
  data,
}: {
  data: marketApis.ApiMarket.CollectionDetail;
}) => {
  const { visitChain } = useSwitchChain();
  const [isRare] = useIsRare();
  const { reflush, reflushing } = useCollectionReflush();
  const { query } = useRouter();
  const contractAddress =
    data.collection.contract_address || (query.id as string);
  const chain_id = query.chain as any;

  return (
    <>
      <IconButton
        isLoading={reflushing}
        aria-label=""
        bg="none"
        color="#575B66"
        _hover={{
          bg: 'white',
        }}
        icon={<Icon as={AiOutlineReload} fontSize="30px" />}
        onClick={() => {
          reflush({ chain_id: +chain_id, contract_address: contractAddress });
        }}
      />
      <IconButton
        aria-label=""
        onClick={() =>
          window.open(
            `${visitChain.blockExplorers?.default.url}/address/${data.collection.contract_address}`,
            '_blank',
          )
        }
        colorScheme={'whiteAlpha'}
        color={isRare ? 'white' : 'primary.main'}
        icon={<EtherscanIcon fontSize={22} />}
      />
      {!!data.collection.website_link && (
        <IconButton
          aria-label=""
          onClick={() => window.open(data.collection.website_link, '_blank')}
          colorScheme={'whiteAlpha'}
          color={isRare ? 'white' : 'primary.main'}
          icon={<WebsiteIcon fontSize={22} />}
        />
      )}
      {!!data.collection.facebook_link && (
        <IconButton
          aria-label=""
          onClick={() => window.open(data.collection.facebook_link, '_blank')}
          colorScheme={'whiteAlpha'}
          color={isRare ? 'white' : 'primary.main'}
          icon={<Icon as={FaFacebook} fontSize={20} />}
        />
      )}
      {!!data.collection.twitter_link && (
        <IconButton
          onClick={() => window.open(data.collection.twitter_link, '_blank')}
          colorScheme={'whiteAlpha'}
          aria-label=""
          color={isRare ? 'white' : 'primary.main'}
          icon={<Icon as={FaTwitter} fontSize={20} />}
        />
      )}

      {!!data.collection.telegram_link && (
        <IconButton
          onClick={() => window.open(data.collection.telegram_link, '_blank')}
          aria-label=""
          colorScheme={'whiteAlpha'}
          color={isRare ? 'white' : 'primary.main'}
          icon={<Icon as={FaTelegram} fontSize={20} />}
        />
      )}

      {!!data.collection.discord_link && (
        <IconButton
          onClick={() => window.open(data.collection.discord_link, '_blank')}
          colorScheme={'whiteAlpha'}
          aria-label=""
          color={isRare ? 'white' : 'primary.main'}
          icon={<Icon as={FaDiscord} fontSize={20} />}
        />
      )}
    </>
  );
};

const SetRoyaltyButton = ({
  collectionDetail,
}: {
  collectionDetail: marketApis.ApiMarket.CollectionDetail;
}) => {
  const t = useTranslations('collectionDetail');
  const commonT = useTranslations('common');
  const settingModalRef = useRef<CollectionRoyaltySettingAction>(null);
  const { query } = useRouter();
  const userData = useUserDataValue();
  // const { needSwitchChain, switchChain } = useSwitchChain({
  //   fixedChainId: query.chain! as unknown as SupportedChainId,
  // });
  const { needSwitchChain, switchChain } = useSwitchChain();
  const contractAddress =
    collectionDetail.collection.contract_address || (query.id as string);

  const { sign } = useSignHelper();
  const toast = useToast();

  const { data } = useRequest(marketApis.collectionDetail, {
    defaultParams: [
      {
        chain_id: query.chain as string,
        wallet_address: userData?.wallet_address!,
        contract_address: contractAddress,
      },
    ],
  });
  if (!data?.data.can_set_royalty) return null;
  return (
    <>
      <IconButton
        onClick={async () => {
          try {
            if (needSwitchChain) {
              return switchChain();
            }
            await sign();
            settingModalRef.current?.open({
              methodName: getRoyaltyContractMethodName(
                collectionDetail.mint_type,
              ),
              royalty: collectionDetail.royalty,
              contractAddress,
              complete: () => {
                toast({
                  status: 'success',
                  variant: 'subtle',
                  title: `${t('collectionSettings')} ${commonT('success')}`,
                });
              },
            });
          } catch (error) {}
        }}
        aria-label=""
        bg="none"
        colorScheme={'whiteAlpha'}
        icon={<Icon as={BiEditAlt} color="secondary.indego" fontSize={24} />}
      />

      <CollectionRoyaltySetting ref={settingModalRef} />
    </>
  );
};

export const CollectionHeader = ({
  collectionDetail,
}: {
  collectionDetail: marketApis.ApiMarket.CollectionDetail;
}) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const t = useTranslations('collectionDetail');
  const commonT = useTranslations('common');
  const isMounted = useMounted();
  const userData = useUserDataValue();
  const [isRare] = useIsRare();
  const [, setIsRareMode] = useRareMode();
  // 是否有稀有模式
  if (collectionDetail?.has_rare) {
    setIsRareMode(true);
  } else {
    setIsRareMode(false);
  }
  return (
    <>
      <Box
        w="full"
        pos="relative"
        py={{ base: 0, md: 10 }}
        bgColor={
          isRare
            ? { base: 'rgba(10, 10, 37)', md: 'rgba(10, 10, 37)' }
            : { base: 'rgba(65,65,65)', md: 'rgba(65,65,65)' }
        }
        bgImage={{
          base: 'none',
          md: collectionDetail.collection.banner_image,
        }}
        bgPos="center"
        bgSize={{ base: '100% 375px', md: 'cover' }}
      >
        {isLargerThan768 ? (
          <Box
            zIndex={1}
            w="full"
            pos="absolute"
            className="inset-0"
            // className={isRare?'collection-banner-dark':'collection-banner-light'}

            backdropFilter="blur(20px)"
            bg={
              isRare
                ? 'linear-gradient(180deg, #010113 0%, #0e0e31 100%)'
                : 'rgba(65,65,65)'
            }
            opacity={0.96}
          />
        ) : (
          <Box
            h="100px"
            bgPos="center"
            bgSize="cover"
            bgImage={collectionDetail.collection.banner_image}
          />
        )}

        <Box
          pos="relative"
          maxW={{ base: 'full', md: 'draft' }}
          mx="auto"
          zIndex={2}
        >
          <Stack
            px={{ base: 5, md: 0 }}
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: -5, md: 10 }}
            align={{ base: 'flex-start', md: 'stretch' }}
          >
            <Box
              pos="relative"
              top={{ base: '-26px', md: 0 }}
              w={{ base: '58px', md: '240px' }}
            >
              <AspectRatio
                ratio={1}
                borderWidth={{ base: 2, md: 5 }}
                borderColor={isRare ? 'black' : 'white'}
                bg="#eee"
                rounded="xl"
                overflow="hidden"
              >
                <Image src={collectionDetail.collection.logo} bg="#f2f2f2" />
              </AspectRatio>
            </Box>
            <VStack
              pos="relative"
              justify="space-between"
              align="flex-start"
              py={2}
              w="full"
              flex="1"
            >
              <Box w="full">
                <Stack
                  align={'flex-start'}
                  justify="space-between"
                  direction={{ base: 'column', md: 'row' }}
                  mb={4}
                >
                  <HStack align={'center'}>
                    <Heading
                      lineHeight={'40px'}
                      size="lg"
                      noOfLines={2}
                      color={isRare ? '#fff' : '#fff'}
                    >
                      {collectionDetail.collection?.name || 'Unamed'}
                    </Heading>
                    {/* 隐藏编辑版税入口 */}
                    {/* {userData?.wallet_address && (
                      <SetRoyaltyButton collectionDetail={collectionDetail} />
                    )} */}
                  </HStack>
                  <HStack spacing={4}>
                    <ShareLinks data={collectionDetail} />
                    <Divider
                      display={'none'}
                      // display={{ base: 'none', md: 'block' }}
                      borderColor="white"
                      h="34px"
                      orientation="vertical"
                    />
                    {/* FIXME 缺少收藏合集接口？ */}
                    <IconButton
                      display={'none'}
                      aria-label=""
                      colorScheme={'whiteAlpha'}
                      color={isRare ? 'white' : 'primary.main'}
                      icon={<StarIcon fontSize={20} color="accent.yellow" />}
                    />
                  </HStack>
                </Stack>
                {!!collectionDetail.collection?.description && (
                  <Box
                    color={isRare ? 'white' : 'primary.main'}
                    maxW={{ base: 'full', md: '60%' }}
                  >
                    <Ellipsis
                      rows={4}
                      content={collectionDetail.collection?.description}
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
                  </Box>
                )}
              </Box>
              {isMounted && (
                <HStack
                  fontFamily={'Inter'}
                  justify="flex-start"
                  flexWrap="wrap"
                  w={{ base: 'full', md: '60%' }}
                >
                  <Stat
                    flex={{ base: '0 1 50%', md: 'auto' }}
                    marginInlineStart={{
                      base: '0px !important',
                      md: '0.5rem !important',
                    }}
                  >
                    <StatLabel fontWeight={700} color="rgba(179,179,179)">
                      {t('items')}
                    </StatLabel>
                    <StatNumber
                      color={isRare ? 'white' : '#fff'}
                      fontWeight={800}
                      fontSize={{ base: '20px', md: '24px' }}
                    >
                      {collectionDetail.total || 0}
                    </StatNumber>
                  </Stat>
                  <Stat
                    flex={{ base: '0 1 50%', md: 'auto' }}
                    marginInlineStart={{
                      base: '0px !important',
                      md: '0.5rem !important',
                    }}
                  >
                    <StatLabel fontWeight={700} color="rgba(179,179,179)">
                      {t('owners')}
                    </StatLabel>
                    <StatNumber
                      color={isRare ? 'white' : '#fff'}
                      fontWeight={800}
                      fontSize={{ base: '20px', md: '24px' }}
                    >
                      {collectionDetail.owners || 0}
                    </StatNumber>
                  </Stat>
                  <Stat
                    flex={{ base: '0 1 50%', md: 'auto' }}
                    mt={{ base: '10px !important', md: '0 !important' }}
                    marginInlineStart={{
                      base: '0px !important',
                      md: '0.5rem !important',
                    }}
                  >
                    <StatLabel fontWeight={700} color="rgba(179,179,179)">
                      {t('vol')}
                    </StatLabel>
                    <StatNumber
                      color={isRare ? 'white' : '#fff'}
                      fontWeight={800}
                      fontSize={{ base: '20px', md: '24px' }}
                    >
                      <HStack spacing={'2px'}>
                        {collectionDetail.chain_id === 1 ||
                        collectionDetail.chain_id === 5 ? (
                          <ETH ml="-5px" />
                        ) : (
                          <></>
                        )}
                        {collectionDetail.chain_id === 97 ||
                        collectionDetail.chain_id === 56 ? (
                          <BNB ml="-5px" />
                        ) : (
                          <></>
                        )}
                        <Text>
                          {collectionDetail?.volume_traded
                            ? parseFloat(
                                String(collectionDetail?.volume_traded),
                              ).toFixed(2)
                            : '-'}
                        </Text>
                      </HStack>
                    </StatNumber>
                  </Stat>
                  <Stat
                    flex={{ base: '0 1 50%', md: 'auto' }}
                    mt={{ base: '10px !important', md: '0 !important' }}
                    marginInlineStart={{
                      base: '0px !important',
                      md: '0.5rem !important',
                    }}
                  >
                    <StatLabel fontWeight={700} color="rgba(179,179,179)">
                      {t('vol7')}
                    </StatLabel>
                    <StatNumber
                      color={isRare ? 'white' : '#fff'}
                      fontWeight={800}
                      fontSize={{ base: '20px', md: '24px' }}
                    >
                      <HStack spacing={'2px'}>
                        {collectionDetail.chain_id === 1 ||
                        collectionDetail.chain_id === 5 ? (
                          <ETH ml="-5px" />
                        ) : (
                          <></>
                        )}
                        {collectionDetail.chain_id === 97 ||
                        collectionDetail.chain_id === 56 ? (
                          <BNB ml="-5px" />
                        ) : (
                          <></>
                        )}
                        <Text>
                          {collectionDetail?.vol_in_week
                            ? parseFloat(
                                String(collectionDetail?.vol_in_week),
                              ).toFixed(2)
                            : '-'}
                        </Text>
                      </HStack>
                    </StatNumber>
                  </Stat>
                  <Stat
                    flex={{ base: '0 1 50%', md: 'auto' }}
                    mt={{ base: '10px !important', md: '0 !important' }}
                    marginInlineStart={{
                      base: '0px !important',
                      md: '0.5rem !important',
                    }}
                  >
                    <StatLabel fontWeight={700} color="rgba(179,179,179)">
                      {t('floor')}
                    </StatLabel>
                    <StatNumber
                      color={isRare ? 'white' : '#fff'}
                      fontWeight={800}
                      fontSize={{ base: '20px', md: '24px' }}
                    >
                      <HStack spacing={'2px'}>
                        {collectionDetail.chain_id === 1 ||
                        collectionDetail.chain_id === 5 ? (
                          <ETH ml="-5px" />
                        ) : (
                          <></>
                        )}
                        {collectionDetail.chain_id === 97 ||
                        collectionDetail.chain_id === 56 ? (
                          <BNB ml="-5px" />
                        ) : (
                          <></>
                        )}
                        <Text>{+collectionDetail.floor_price || '-'}</Text>
                      </HStack>
                    </StatNumber>
                  </Stat>
                </HStack>
              )}
            </VStack>
          </Stack>
        </Box>
      </Box>
    </>
  );
};
