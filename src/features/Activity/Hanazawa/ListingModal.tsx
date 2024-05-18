import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  useDisclosure,
  Box,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
  Stack,
  VStack,
  Heading,
  Image as ChakraImage,
  Skeleton,
  useToast,
  Link,
} from '@chakra-ui/react';
import Image from '@/components/Image';
import { useRootModalConsumer } from '@/features/AssetPage';
import { useTranslations } from 'next-intl';
import { useRequest } from 'ahooks';
import { getNftData } from './services';
import { ApiMarket } from '@/services/market';
import { useRouter } from 'next/router';
import { useUserDataValue } from '@/store';
import NextLink from 'next/link';

type SuccessModalAction = {
  open: () => void;
};

const SuccessModal = forwardRef((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('common');

  useImperativeHandle(ref, () => ({
    open: onOpen,
  }));

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent rounded="xl" maxWidth={{ base: '335px', md: '760px' }}>
          <ModalCloseButton />
          <ModalBody p={0}>
            <VStack pt="50px" pb="12px" spacing={0} mb="21px">
              <Text>{t('project.listSuccess')}</Text>
              <Text
                color="#546BA9"
                fontSize="22px"
                fontWeight={600}
                lineHeight="40px"
                pt="5px"
                pb="16px"
              >
                {t('project.received')}
              </Text>
              <ChakraImage
                w="115px"
                h="auto"
                src="/images/activity/hanazawa/coin.png"
              />
            </VStack>
            <VStack
              spacing={0}
              pt={{ md: '33px', base: '24px' }}
              pb={{ md: '45px', base: '52px' }}
              bg="url(/images/activity/hanazawa/modalBg.svg)"
              bgSize="cover"
              px="30px"
            >
              <Text mb="21px" fontSize={{ md: 'md', base: '12px' }}>
                {t('project.successUuuDesc')}
              </Text>
              <HStack spacing="30px" pb="32px">
                <HStack spacing="10px">
                  <ChakraImage
                    w={{ md: '33px', base: '24px' }}
                    h="auto"
                    src="/images/activity/hanazawa/gift.png"
                  />
                  <Text fontSize="14px">{t('project.raffles')}</Text>
                </HStack>
                <HStack spacing="10px">
                  <ChakraImage
                    w={{ md: '33px', base: '24px' }}
                    h="auto"
                    src="/images/activity/hanazawa/eth.png"
                  />
                  <Text fontSize="14px">{t('project.redeem')}</Text>
                </HStack>
              </HStack>
              <NextLink href={`/rewards`} passHref>
                <Link>
                  <Button
                    w={{ md: '290px', base: '180px' }}
                    h={{ md: '50px', base: '36px' }}
                    fontSize="md"
                    display="block"
                    color="white"
                    bg="linear-gradient(to right, #A46FF3 0%, #61AAFF 100%)"
                    rounded="25px"
                    bgSize="cover"
                    _hover={{
                      opacity: 0.8,
                    }}
                  >
                    {t('project.viewPoints')}
                  </Button>
                </Link>
              </NextLink>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

export const ListingModal = forwardRef((_, ref) => {
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const successRef = useRef<SuccessModalAction>();
  const t = useTranslations('common');
  const { openListModal } = useRootModalConsumer();
  const userData = useUserDataValue();
  const [nfts, setNfts] = useState<ApiMarket.NftListType[]>([]);

  const getNft = useRequest(getNftData, {
    manual: true,
    pollingInterval: 2000,
    onSuccess: ({ data }) => {
      setNfts(data.items);
    },
  });

  useEffect(() => {
    if (nfts.length) {
      onOpen();
      getNft.cancel();
    }
  }, [nfts]);

  const handleOpen = async (address: string) => {
    try {
      getNft.runAsync({ address });
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  useImperativeHandle(ref, () => ({
    open: (address: string) => handleOpen(address),
  }));

  const onListing = () => {
    if (nfts.length > 1) {
      router.push(`/user/${userData?.wallet_address}?bulkList=true`);
      return;
    }
    openListModal({
      token_id: nfts[0]?.token_id!,
      openType: 'activityListing',
      success: () => {
        onClose();
        successRef.current?.open();
      },
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent rounded="xl" maxWidth={{ base: '335px', md: '760px' }}>
          <ModalCloseButton />
          <ModalBody p={0}>
            {!nfts.length ? (
              <Stack
                direction={{ md: 'row', base: 'column' }}
                pt={{ md: '45px', base: '24px' }}
                pb="24px"
                justify="center"
                align="center"
                spacing={{ md: '40px', base: '10px' }}
              >
                <Skeleton w="160px" h="160px" rounded="12px" />
                <VStack spacing="20px">
                  <Skeleton
                    w={{ md: '265px', base: '180px' }}
                    h={{ md: '28px', base: '20px' }}
                    rounded="2px"
                  />
                  <Skeleton
                    w={{ md: '290px', base: '180px' }}
                    h={{ md: '50px', base: '36px' }}
                    rounded="25px"
                    pt="10px"
                  />
                </VStack>
              </Stack>
            ) : (
              <Stack
                direction={{ md: 'row', base: 'column' }}
                pt={{ md: '45px', base: '24px' }}
                pb="24px"
                justify="center"
                align="center"
                spacing={0}
              >
                <Image
                  w="160px"
                  p="7px"
                  border="1px solid #DADADA"
                  rounded="12px"
                  mr={{ md: '40px', base: 0 }}
                  mb={{ md: 0, base: '10px' }}
                  src={nfts[0]?.logo}
                  fallbackSrc={undefined}
                  fallback={<Box h="160px" />}
                />
                <VStack spacing={{ md: '30px', base: '20px' }}>
                  <VStack spacing="10px">
                    {nfts.map((v) => (
                      <Text
                        key={v.item_id}
                        fontSize={{ md: '24px', base: 'md' }}
                        lineHeight={{ md: '28px', base: '18px' }}
                        fontWeight={600}
                      >
                        {v.name}
                      </Text>
                    ))}
                  </VStack>
                  <Button
                    w={{ md: '290px', base: '180px' }}
                    h={{ md: '50px', base: '36px' }}
                    fontSize="md"
                    color="white"
                    bg="linear-gradient(to right, #A46FF3 0%, #61AAFF 100%)"
                    rounded="25px"
                    bgSize="cover"
                    _hover={{
                      opacity: 0.8,
                    }}
                    onClick={onListing}
                  >
                    {t('list')}
                  </Button>
                </VStack>
              </Stack>
            )}
            <VStack
              w="full"
              spacing={0}
              pt={{ md: '32px', base: '18px' }}
              pb={{ md: '44px', base: '27px' }}
              pl={{ md: '0', base: '20px' }}
              align="flex-start"
              bg="url(/images/activity/hanazawa/modalBg.svg)"
              bgSize="cover"
              bgRepeat="no-repeat"
            >
              <Heading
                fontSize={{ md: '26px', base: '18px' }}
                lineHeight="37px"
                color="#546BA9"
                mx={{ md: 'auto', base: 0 }}
                mb={{ md: '30px', base: '16px' }}
              >
                {t('project.listTitle')}
              </Heading>
              <Box pl={{ md: '136px', base: '0' }}>
                <Stack
                  direction={{ md: 'row', base: 'column' }}
                  spacing={{ md: 0, base: '6px' }}
                  align="flex-start"
                >
                  <HStack spacing="10px">
                    <ChakraImage
                      w={{ md: '30px', base: '18px' }}
                      h="auto"
                      src="/images/activity/hanazawa/tabs/rewards_feature_1.svg"
                    />
                    <Text
                      fontWeight={600}
                      fontSize="14px"
                      w={{ md: '200px', base: 'full' }}
                    >
                      {t('project.rewardsFee')}
                    </Text>
                  </HStack>
                  <HStack
                    spacing={{ md: '50px', base: '32px' }}
                    pl={{ md: 0, base: '34px' }}
                  >
                    <HStack spacing="10px" w="96px">
                      <Text
                        fontSize="12px"
                        lineHeight="20px"
                        fontWeight={400}
                        whiteSpace="nowrap"
                      >
                        {t('project.creatorFee')}
                      </Text>
                      <Text
                        fontSize={{ md: '28px', base: '18px' }}
                        lineHeight="30px"
                        mr="50px"
                      >
                        0
                      </Text>
                    </HStack>
                    <HStack spacing="10px">
                      <Text fontSize="12px" lineHeight="20px" fontWeight={400}>
                        {t('project.transactionFee')}
                      </Text>
                      <Text
                        fontSize={{ md: '28px', base: '18px' }}
                        lineHeight="30px"
                      >
                        0
                      </Text>
                    </HStack>
                  </HStack>
                </Stack>
                <Stack
                  direction={{ md: 'row', base: 'column' }}
                  spacing={{ md: 0, base: '6px' }}
                  align="flex-start"
                  pt={{ md: '26px', base: '12px' }}
                >
                  <HStack spacing="10px">
                    <ChakraImage
                      w={{ md: '30px', base: '18px' }}
                      h="auto"
                      src="/images/activity/hanazawa/tabs/rewards_feature_2.svg"
                    />
                    <Text
                      fontWeight={600}
                      fontSize="14px"
                      w={{ md: '200px', base: 'full' }}
                    >
                      {t('project.listReward')}
                    </Text>
                  </HStack>
                  <HStack spacing={0} pl={{ md: 0, base: '34px' }}>
                    <HStack spacing="6px">
                      <ChakraImage
                        w={{ md: '33px', base: '24px' }}
                        h="auto"
                        src="/images/activity/hanazawa/gift.png"
                      />
                      <Text
                        fontSize="12px"
                        w={{ md: '105px', base: '96px' }}
                        whiteSpace={'nowrap'}
                      >
                        {t('project.raffles')}
                      </Text>
                    </HStack>
                    <HStack spacing="6px">
                      <ChakraImage
                        w={{ md: '33px', base: '24px' }}
                        h="auto"
                        src="/images/activity/hanazawa/eth.png"
                      />
                      <Text fontSize="12px" w="105px" whiteSpace={'nowrap'}>
                        {t('project.redeem')}
                      </Text>
                    </HStack>
                  </HStack>
                </Stack>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <SuccessModal ref={successRef} />
    </>
  );
});
