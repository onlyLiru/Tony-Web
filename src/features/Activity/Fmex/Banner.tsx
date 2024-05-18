import {
  Box,
  Text,
  Image as ChakraImage,
  Button,
  VStack,
  Stack,
  HStack,
  Link,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { ShimmerImage } from '@/components/Image';
import { ListingModal } from '../Hanazawa/ListingModal';
import { useRef, useMemo, useEffect, useState, useContext } from 'react';
import { useRequest } from 'ahooks';
import { defaultChainId, staticChainId, useUserDataValue } from '@/store';
import * as launchpadApis from '@/services/launchpad';
import { useRouter } from 'next/router';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useTranslations } from 'next-intl';
import { useMintEvent } from './useMintEvent';
import { getErrorMessage } from '@/utils/error';
import { PageContext } from './context';
import { useUserWalletBalance } from '@/hooks/useUserWalletBalance';

export const Banner = () => {
  const toast = useToast();
  const router = useRouter();
  const userData = useUserDataValue();
  const { openConnectModal } = useConnectModal();
  const { localCurrencyAmount: ethAmount, localCurrency: ethCurrency } =
    useUserWalletBalance({ fixedChainId: defaultChainId });
  const { mint, loading: mintLoading } = useMintEvent();
  const { data, refresh } = useContext(PageContext);

  const ct = useTranslations('common');

  const listingRef = useRef<any>();
  const [userMintData, setUserMintData] =
    useState<launchpadApis.ApiLaunchpad.UserStatus>();

  const userStatusReq = useRequest(launchpadApis.userStatus, {
    manual: true,
  });

  const pageLoading = useMemo(
    () => !data.contract_address || (!userMintData && userData?.wallet_address),
    [data, userMintData],
  );

  // 用户能否mint
  const canMint = useMemo(
    () =>
      (!userData?.wallet_address && !pageLoading) ||
      (userMintData?.minted! < userMintData?.limit! && !!data.left),
    [userMintData, data],
  );

  // 是否售罄
  const isSoldout = useMemo(() => data.left === 0, [data]);

  const fetchUser = async () => {
    try {
      const userStatus = await userStatusReq.runAsync({
        address: data?.contract_address!,
      });
      setUserMintData(userStatus.data);
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  useEffect(() => {
    if (userData?.wallet_address && data?.contract_address) {
      fetchUser();
    }
  }, [userData?.wallet_address, data?.contract_address]);

  const handleMint = async () => {
    if (!canMint) {
      router.push(
        `/collection/${staticChainId}/${data.contract_address}?source=banner`,
      );
      return;
    }
    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }
    if (ethAmount < data.price!) {
      toast({
        status: 'error',
        title: ct('insufficientAmount'),
        variant: 'subtle',
      });
      return;
    }
    try {
      await mint({ count: 1 });
      listingRef.current?.open(data.contract_address);
      refresh();
      fetchUser();
      ethCurrency?.refetch?.();
    } catch (error) {
      toast({
        status: 'error',
        title: getErrorMessage(error),
        variant: 'subtle',
      });
    }
  };

  return (
    <Box
      w="full"
      h={{ md: 'calc(100vh - 260px)', base: 'auto' }}
      bgColor="#02102A"
      pos="relative"
    >
      <ShimmerImage
        zIndex={0}
        pos="absolute"
        top={{ base: 0, md: '50%' }}
        left={'50%'}
        transform={{ base: 'translateX(-50%)', md: 'translate(-50%, -50%)' }}
        w={{ md: '700px', base: '500px' }}
        h={{ md: '700px', base: '480px' }}
        src="/images/activity/fmex/bg.png"
      />
      <Stack
        maxW={{ md: '1140px', base: '300px' }}
        p={{ md: '20px', base: '70px 0 34px' }}
        mx="auto"
        h="full"
        justify="space-between"
        pos="relative"
        direction={{ md: 'row', base: 'column-reverse' }}
        align="center"
        spacing={{ md: '0', base: '50px' }}
      >
        <Box w={{ md: 'auto', base: 'full' }}>
          <HStack
            pos={{ md: 'relative', base: 'absolute' }}
            top="0"
            left="0"
            justify="space-between"
            w="100%"
          >
            <ShimmerImage
              pos={{ md: 'relative', base: 'absolute' }}
              top={{ md: '0', base: '17px' }}
              left={{ md: '0', base: '27px' }}
              w={{ md: '178px', base: '38px' }}
              h={{ md: '168px', base: '36px' }}
              mb="22px"
              mx="auto"
              src="/images/activity/fmex/logo.png"
            />
            <HStack
              pos="absolute"
              top="21px"
              left={{ md: '50%', base: 'unset' }}
              right={{ md: 'unset', base: '21px' }}
              transform={{ md: 'translateX(90px)', base: 'translateX(0px)' }}
              spacing={4}
              pl="24px"
              color="white"
              fontSize={{ base: '18px', md: '24px' }}
              align="flex-start"
            >
              <Link href="https://twitter.com/meta_soccer" target="_blank">
                <Icon as={FaTwitter} />
              </Link>
              <Link href="https://discord.com/invite/fmex" target="_blank">
                <Icon as={FaDiscord} />
              </Link>
              <Link
                href="https://etherscan.io/address/0x2ce8e90200c02EE7f82f99708dC0DFEe9C292Bd7"
                target="_blank"
              >
                <ChakraImage
                  w={{ md: '30px', base: '22px' }}
                  h="auto"
                  src="/images/activity/hanazawa/etherscan.png"
                />
              </Link>
            </HStack>
          </HStack>
          <VStack color="white" spacing={{ md: '26px', base: '18px' }}>
            <HStack
              w="full"
              fontSize={{ md: '36px', base: '24px' }}
              lineHeight={{ md: '44px', base: '29px' }}
              fontWeight={400}
            >
              <Text flex={1} align="right" whiteSpace="nowrap">
                {ct('project.left')}：
              </Text>
              <Text flex={1}>{data.left}</Text>
            </HStack>
            <VStack
              spacing={0}
              justify="space-between"
              h={{ md: '100px', base: '80px' }}
            >
              <Button
                w={{ md: '356px', base: '240px' }}
                h={{ md: '66px', base: '48px' }}
                fontSize={{ md: '22px', base: '17px' }}
                fontWeight={900}
                bgColor="transparent"
                rounded="full"
                border="4px solid #ffffff"
                _hover={{
                  bgColor: 'rgba(255,255,255, 0.2)',
                }}
                onClick={handleMint}
                isLoading={mintLoading}
                isDisabled={data.sale_status !== 1}
              >
                {canMint || pageLoading
                  ? ct('project.mint')
                  : ct('project.viewCollection')}
              </Button>
              {!userData?.wallet_address ? null : data.sales_stage !==
                1 ? null : isSoldout ? (
                <Text fontSize={{ md: '14px', base: '15px' }}>
                  {ct('project.soldOut')}
                </Text>
              ) : userMintData?.limit === 0 ? (
                <Text fontSize={{ md: '14px', base: '15px' }} align="center">
                  {ct('project.noPermission')}
                </Text>
              ) : (
                <Text fontSize={{ md: '14px', base: '15px' }}>{`${
                  userMintData?.limit! - userMintData?.minted!
                } ${ct('project.unminted')}`}</Text>
              )}
            </VStack>
            <HStack w="full" whiteSpace="nowrap" fontSize="14px">
              <HStack flex={1} pl="30px">
                <Text>{ct('price')}: </Text>
                <Text>{`${data.price || ''} ETH`}</Text>
              </HStack>
              <HStack flex={1} pl="30px">
                <Text>{ct('supply')}: </Text>
                <Text>{data.total_supply}</Text>
              </HStack>
            </HStack>
          </VStack>
        </Box>
        <ShimmerImage
          priority
          w={{ md: '380px', base: '272px' }}
          h={{ md: '450px', base: '320px' }}
          src={'/images/activity/fmex/fmex_main.png'}
        />
      </Stack>
      <ListingModal ref={listingRef} />
    </Box>
  );
};
