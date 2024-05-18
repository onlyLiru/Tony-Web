// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  Box,
  Flex,
  HStack,
  Text,
  VStack,
  Button,
  Link,
  Icon,
  Stack,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useToast,
  useMediaQuery,
} from '@chakra-ui/react';
import { useCounter } from 'ahooks';
import { canUseDom } from '@/utils/canUseDom';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { TbWorld } from 'react-icons/tb';
import { ShimmerImage } from '@/components/Image';
import {
  useClaimConditions,
  useActiveClaimCondition,
  useContract,
  useClaimerProofs,
  useActiveClaimConditionForWallet,
} from '@thirdweb-dev/react';
import { useUserDataValue } from '@/store';
import { useEffect, useState } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatUnits } from 'ethers/lib/utils.js';
import { format } from 'date-fns';
import { formatEther } from 'ethers/lib/utils.js';
import { useTranslations } from 'next-intl';
import { useMintEvent } from './useMintEvent';
import { mul } from '@/utils/index';
import '@fontsource/silkscreen';
import { BigNumber } from 'ethers';
import CountDown from './CountDown';
import { CONTRACT_ADDRESS } from './constants';

const isWindow = typeof window !== 'undefined';
let hasRefresh: bool = false;

export const BannerCpt = () => {
  const t = useTranslations('cpt');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isOpenModal, updateModalStatus] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isAdding, updateAddStatus] = useState(false);
  const [current, { inc, dec, reset }] = useCounter(0, { min: 0 });
  const [info, setInfo] = useState<any>({
    step: 0,
  });
  const toast = useToast();
  const [timestamp, setTimestamp] = useState(0);
  const [unclaimedNFTCount, updateUnclaimedNFTCount] = useState(0);
  const [tokenId, updateTokenId] = useState(0);
  const { openConnectModal } = useConnectModal();
  const { mint, loading: mintLoading } = useMintEvent();
  const userData = useUserDataValue();
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: claimConditions } = useClaimConditions(contract, tokenId);
  const { data: claimerProofs } = useClaimerProofs(
    contract,
    userData?.wallet_address!,
    tokenId,
  );
  const { data: claimConditionForWallet } = useActiveClaimConditionForWallet(
    contract,
    userData?.wallet_address!,
    tokenId,
  );

  const { data: claimCondition } = useActiveClaimCondition(contract, tokenId);

  console.log('claimCondition', claimCondition);
  console.log('claimConditions:', claimConditions);
  console.log('claimerProofs:', claimerProofs);
  console.log('claimConditionForWallet', claimConditionForWallet);

  const getUnClaimedNum = async () => {
    const unclaimedNFTCount = await contract.totalUnclaimedSupply();
    updateUnclaimedNFTCount(
      formatUnits(BigNumber.from(unclaimedNFTCount), 'wei'),
    );
  };

  useEffect(() => {
    if (isLargerThan768) {
      const baseRatio = isWindow ? (1920 / window.innerWidth).toFixed(2) : 1;
      const scaleRatio = Math.min(+(1 / baseRatio).toFixed(2), 1);
      document.getElementById(
        'cpt-wrapper-content',
      ).style.transform = `scale(${scaleRatio})`;
    }
  }, [isLargerThan768]);

  useEffect(() => {
    contract && getUnClaimedNum();
  }, [contract, tokenId]);

  useEffect(() => {
    if (claimConditions) {
      setLoading(false);
      const sliceArr = claimConditions.slice(-3, -1);
      const step1 = sliceArr[0];
      const step2 = sliceArr[1];

      const mintInfo = {
        step1_name: step1?.metadata?.name,
        step1_startTime: format(step1?.startTime!, 'PPpp'),
        step2_name: step2?.metadata?.name,
        step2_startTime: format(step2?.startTime!, 'PPpp'),
      };

      // 阶段二进行中
      if (new Date().getTime() >= new Date(step2?.startTime!).getTime()) {
        setInfo({
          step: 2,
          left: unclaimedNFTCount,
          price: formatEther(step2?.price!),
          ...mintInfo,
        });

        setTimestamp(0);
      }
      // 阶段一进行中
      else if (new Date().getTime() >= new Date(step1?.startTime!).getTime()) {
        setInfo({
          step: 1,
          left: unclaimedNFTCount,
          price: formatEther(step1?.price!),
          ...mintInfo,
        });
        setTimestamp(
          new Date(step2?.startTime!).getTime() - new Date().getTime(),
        );
      }
      // 阶段一未开始
      else if (new Date().getTime() < new Date(step1?.startTime!).getTime()) {
        setInfo({
          step: 0,
          left: unclaimedNFTCount,
          price: formatEther(step1?.price!),
          ...mintInfo,
        });
        setTimestamp(
          new Date(step1?.startTime!).getTime() - new Date().getTime(),
        );
      }
    }
  }, [JSON.stringify(claimConditions), tokenId]);

  useEffect(() => {
    if (userData?.wallet_address) {
      reset(0);
    } else {
      openConnectModal?.();
    }
  }, [userData?.wallet_address]);

  const onAddMintNum = async () => {
    if (isAdding) return;

    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }

    if (info.step <= 0) return;

    let reasons = [];

    if (info.step <= 1) {
      updateAddStatus(true);

      try {
        reasons =
          await contract.erc721.claimConditions.getClaimIneligibilityReasons(
            current + 1,
            userData?.wallet_address!,
          );
      } catch (err) {
        console.log(err);
        updateAddStatus(false);
      }

      updateAddStatus(false);
      if (!Array.isArray(reasons) || !reasons.length) {
        inc();
      } else {
        toast({
          containerStyle: {
            border: '20px solid transparent',
          },
          title: t('mintLimit'),
          status: 'warning',
          position: 'top',
          isClosable: false,
          duration: 2000,
        });
      }
    } else {
      let quantityLimitPerWallet: any =
        claimConditionForWallet?.maxClaimablePerWallet?.slice(-1) -
        claimConditionForWallet?.currentMintSupply;
      quantityLimitPerWallet = Number.isInteger(quantityLimitPerWallet)
        ? quantityLimitPerWallet
        : '115792089237316195423570985008687907853269984665640564039457584007913129639935';

      updateAddStatus(false);
      if (quantityLimitPerWallet > current) {
        inc();
      } else {
        toast({
          containerStyle: {
            border: '20px solid transparent',
          },
          title: t('mintLimit'),
          status: 'warning',
          position: 'top',
          isClosable: false,
          duration: 2000,
        });
      }
    }
  };

  const onMint = async () => {
    if (current <= 0) return;

    if (!userData?.wallet_address) {
      openConnectModal?.();
      return;
    }

    try {
      await mint({
        count: current,
        proof: claimerProofs?.proof,
        maxClaimable: claimerProofs?.maxClaimable
          ? +claimerProofs?.maxClaimable
          : null,
        claimConditionForWallet,
        walletAddress: userData?.wallet_address,
      });

      updateModalStatus(true);
      getUnClaimedNum();
      reset(0);
    } catch (err) {
      console.log(err);
    }
  };

  const onCloseModal = () => {
    updateModalStatus(false);
  };

  const onFinish = () => {
    if (!hasRefresh) {
      hasRefresh = true;
      setLoading(true);
      setTimeout(() => {
        updateTokenId(tokenId + 1);
        reset(0);
      }, 2000);
    }
  };
  return (
    <>
      <Box
        h={{ md: '940px', base: '500px' }}
        pt={{ md: '180px', base: '177px' }}
        pl={{ md: '84px', base: '0' }}
        bg={{
          md: 'url(/images/activity/cpt/banner.png)',
          base: 'url(/images/activity/cpt/banner_small.png)',
        }}
        backgroundSize={{ md: 'cover !important', base: 'contain !important' }}
        pos="relative"
        fontFamily={'Silkscreen'}
        backgroundRepeat={{
          md: 'no-repeat repeat !important',
          base: 'no-repeat !important',
        }}
        backgroundPosition={{ base: 'top' }}
      >
        <ShimmerImage
          display={{ md: 'block', base: 'none' }}
          pos="absolute"
          top="0"
          left="119px"
          w="762px"
          h="356px"
          src="/images/activity/cpt/mint_title.png"
          transform="scale(0.5)"
        />
        <Box
          id="cpt-wrapper-content"
          w="full"
          maxW="939px"
          h={{ md: '708px', base: 'auto' }}
          p={{ md: '47px 79px 62px 69px ', base: '28px 16px 16px' }}
          backdropFilter="blur(10px)"
          bg="url(/images/activity/cpt/option_bg.png)"
          bgSize="100% 100%"
          bgRepeat="no-repeat"
          textAlign="center"
        >
          {isLoading ? (
            <Flex height="324px" align="center" justify="center">
              <Spinner size="xl" mt={{ md: '30%', base: '0' }} />
            </Flex>
          ) : (
            <>
              <CountDown timestamp={timestamp} onFinish={onFinish} />
              <HStack
                spacing="0"
                mt={{ md: '32px', base: '12px' }}
                align="flex-start"
                w={{ md: '700px', base: '100%' }}
              >
                <VStack
                  spacing={{ md: '16px', base: '6px' }}
                  fontSize={{ md: '16px', base: '10px' }}
                  lineHeight={{ md: '23px', base: '12px' }}
                  color="#fff"
                  align="flex-start"
                  flex={1}
                  w={{ md: '400px' }}
                >
                  <Box
                    w={{ md: '32px', base: '17px' }}
                    h={{ md: '32px', base: '17px' }}
                    rounded="full"
                    border={{
                      md: '4px solid #FFFFFF',
                      base: '2px solid #FFFFFF',
                    }}
                    pos="relative"
                  >
                    <Box
                      hidden={info.step !== 1}
                      pos="absolute"
                      w={{ md: '16px', base: '8px' }}
                      h={{ md: '16px', base: '8px' }}
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      bgColor={'#fff'}
                      rounded="full"
                    />
                    <Box
                      pos="absolute"
                      right={{ md: '-472px', base: '-224px' }}
                      top="50%"
                      transform="translateY(-50%)"
                      w={{ md: '472px', base: '224px' }}
                      h={{ md: '4px', base: '2px' }}
                      bgColor={'#fff'}
                    />
                  </Box>
                  <Text
                    opacity={info.step === 1 ? 1 : 0.5}
                    fontSize={{ md: '20px' }}
                  >
                    {info.step1_name}
                  </Text>
                  <Text
                    opacity={info.step === 1 ? 1 : 0.5}
                    w={{ md: 'auto', base: '110px' }}
                    fontSize={{ md: '20px' }}
                  >
                    {info.step1_startTime}
                  </Text>
                </VStack>
                <VStack
                  spacing={{ md: '16px', base: '6px' }}
                  fontSize={{ md: '16px', base: '10px' }}
                  lineHeight={{ md: '23px', base: '12px' }}
                  color="#fff"
                  align="flex-start"
                  w={{ md: '200px' }}
                >
                  <Box
                    w={{ md: '32px', base: '17px' }}
                    h={{ md: '32px', base: '17px' }}
                    rounded="full"
                    border={{
                      md: '4px solid #FFFFFF',
                      base: '2px solid #FFFFFF',
                    }}
                    pos="relative"
                  >
                    <Box
                      hidden={info.step !== 2}
                      pos="absolute"
                      w="16px"
                      h="16px"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      bgColor={'#fff'}
                      rounded="full"
                    />
                  </Box>
                  <Text
                    opacity={info.step === 2 ? 1 : 0.5}
                    fontSize={{ md: '20px' }}
                  >
                    {info.step2_name}
                  </Text>
                  <Text
                    opacity={info.step === 2 ? 1 : 0.5}
                    whiteSpace={{ md: 'nowrap', base: 'normal' }}
                    w={{ md: 'auto', base: '120px' }}
                    fontSize={{ md: '20px' }}
                  >
                    {info.step2_startTime}
                  </Text>
                </VStack>
              </HStack>
              <VStack
                spacing={{ md: '32px', base: '16px' }}
                w="full"
                mt={{ md: '50px', base: '23px' }}
                pt={{ md: '50px', base: '15px' }}
                borderTop={{
                  md: '4px solid rgba(255,255,255,0.5)',
                  base: '2px solid rgba(255,255,255,0.5)',
                }}
                fontSize={{ md: '24px', base: '12px' }}
                lineHeight={{ md: '28px', base: '14px' }}
                color="#fff"
              >
                <HStack spacing={{ md: '32px', base: '16px' }} w="full">
                  <Text w={{ md: '104px', base: '54px' }} textAlign="right">
                    {t('left')}
                  </Text>
                  <HStack justify={'space-between'} flex={1}>
                    <Text
                      fontSize={{ md: '32px', base: '16px' }}
                      lineHeight={{ md: '38px', base: '19px' }}
                    >
                      0
                    </Text>
                    <HStack
                      spacing={{ md: '40px', base: '20px' }}
                      fontSize={{ md: '35px', base: '21px' }}
                    >
                      <Link
                        href="https://twitter.com/CityPopTokyoNFT"
                        target="_blank"
                      >
                        <Icon as={FaTwitter} />
                      </Link>
                      <Link
                        href="https://discord.com/invite/citypoptokyo                        "
                        target="_blank"
                      >
                        <Icon as={FaDiscord} />
                      </Link>
                      <Link href="https://www.city-pop.tokyo/" target="_blank">
                        <Icon as={TbWorld} />
                      </Link>
                    </HStack>
                  </HStack>
                </HStack>
                <HStack spacing={{ md: '32px', base: '16px' }} w="full">
                  <Text w={{ md: '104px', base: '54px' }} textAlign="right">
                    {t('price')}
                  </Text>
                  <Text
                    fontSize={{ md: '32px', base: '16px' }}
                    lineHeight={{ md: '38px', base: '19px' }}
                  >
                    {mul(info.price, current)}ETH
                  </Text>
                </HStack>
                <HStack spacing={{ md: '32px', base: '16px' }} w="full">
                  <Text w={{ md: '104px', base: '54px' }} textAlign="right">
                    {t('num')}
                  </Text>
                  <HStack spacing={{ md: '40px', base: '15px' }}>
                    <HStack
                      w={{ md: '300px', base: '121px' }}
                      h={{ md: '80px', base: '33px' }}
                      bgColor="rgba(255,255,255, 0.8)"
                      color="#1E1F25"
                      fontSize={{ md: '40px', base: ' 16px' }}
                      justify="space-between"
                    >
                      <Text
                        px={{ md: '30px', base: '13px' }}
                        cursor="pointer"
                        userSelect="none"
                        onClick={() => dec()}
                      >
                        -
                      </Text>
                      <Text flex={1} textAlign="center">
                        {current}
                      </Text>
                      <Box
                        px={{ md: '30px', base: '13px' }}
                        cursor="pointer"
                        userSelect="none"
                        // onClick={onAddMintNum}
                      >
                        {isAdding ? (
                          <Spinner
                            size={{ md: 'md', base: 'xs' }}
                            ml={{ md: '12px', base: '6px' }}
                          />
                        ) : (
                          <span>+</span>
                        )}
                      </Box>
                    </HStack>
                    <Box pos="relative">
                      <Button
                        w={{ md: '313px', base: '130px' }}
                        h={{ md: '80px', base: '33px' }}
                        rounded="0px"
                        bgColor={current >= 1 ? '#38FFFC' : '#EDF2F7'}
                        fontSize={{ md: '32px', base: '16px' }}
                        color="#000"
                        zIndex={10}
                        onClick={onMint}
                        isLoading={mintLoading}
                      >
                        {t('mint')}
                      </Button>
                      <Box
                        hidden={mintLoading}
                        pos="absolute"
                        top={{ md: '8px', base: '4px' }}
                        left={{ md: '8px', base: '4px' }}
                        w={{ md: '313px', base: '130px' }}
                        h={{ md: '80px', base: '33px' }}
                        rounded="0px"
                        bgColor="#000"
                      />
                    </Box>
                  </HStack>
                </HStack>
              </VStack>
            </>
          )}
        </Box>
      </Box>
      <Stack
        direction={{ md: 'row', base: 'column' }}
        bgColor="#000"
        p={{ md: '96px 150px 87px', base: '33px 16px 34px' }}
        spacing={{ md: '144px', base: '22px' }}
        align="center"
      >
        <ShimmerImage
          w={{ md: '274px', base: '115px ' }}
          h={{ md: '217px', base: '92px' }}
          src="/images/activity/cpt/tip.png"
        />
        <VStack
          spacing={{ md: '20px', base: '10px' }}
          flex={1}
          color="#fff"
          align={{ md: 'flex-start', base: 'center' }}
        >
          <Text fontSize={{ md: '48px', base: '16px' }} fontWeight="bold">
            {t('rewardTitle')}
          </Text>
          <Text fontSize={{ md: '32px', base: '14px' }}>
            {t('rewardContent')}
          </Text>
        </VStack>
      </Stack>
      <Modal onClose={onCloseModal} isOpen={isOpenModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('mintSuccess')}</ModalHeader>
          <ModalFooter>
            <Button onClick={onCloseModal}>OK</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
