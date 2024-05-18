/* eslint-disable react/jsx-key */
/* eslint-disable no-restricted-imports */
import NextLink from 'next/link';
import { Footer } from '@/components/PageLayout';
import { serverSideTranslations } from '@/i18n';
import { GetServerSidePropsContext } from 'next';
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Center,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  keyframes,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  useNumberInput,
  useToast,
  VStack,
} from '@chakra-ui/react';
import bellaAbi from '@/contract/abi/bella.json';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { FiArrowRight, FiMinus, FiPlus } from 'react-icons/fi';
import { FallbackImage } from '@/components/Image';
import { createIcon } from '@chakra-ui/icons';
import { MdOutlineCopyAll } from 'react-icons/md';
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
import Marquee from 'react-fast-marquee';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useInViewport, useLocalStorageState, useRequest } from 'ahooks';
import {
  bellaForm,
  bellaTokenList,
  BellaFormPayload,
  ProjectStageV2,
  ProjectStatusV2,
  proof,
  statusV2,
  userStatusV2,
} from '@/services/launchpad';
import { defaultChainId, useUserDataValue } from '@/store';
import { BigNumber, Contract, ContractTransaction } from 'ethers';
import useSignHelper from '@/hooks/helper/useSignHelper';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { parseEther } from 'ethers/lib/utils.js';
import { useTranslations } from 'next-intl';
import useCopy from '@/hooks/useCopy';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { belladonnaAddress } from '@/contract/constants/addresses';
import { jwtHelper } from '@/utils/jwt';
import { isProd } from '@/utils';
import { useContractReads } from 'wagmi';
import { useMounted } from '@/hooks/useMounted';
import { Formik, Form, Field, useField } from 'formik';
import { Select, Props as SelectProps } from 'chakra-react-select';

const IconOpenSea = createIcon({
  displayName: 'opensae',
  defaultProps: {
    viewBox: '0 0 32 32',
  },
  path: [
    <path
      d="M7.89396 16.5376L7.96297 16.4291L12.1252 9.91784C12.186 9.82248 12.3291 9.83236 12.3751 9.9359C13.0704 11.4943 13.6705 13.4324 13.3894 14.639C13.2694 15.1354 12.9406 15.8078 12.5707 16.4291C12.523 16.5195 12.4704 16.6083 12.4145 16.6938C12.3883 16.7332 12.3438 16.7563 12.2962 16.7563H8.0156C7.9005 16.7563 7.83312 16.6313 7.89396 16.5376Z"
      fill="currentColor"
    />,
    <path
      d="M28.8889 19.7421V20.9903C28.8889 21.0619 28.8451 21.1257 28.7814 21.1535C28.3912 21.3208 27.0554 21.9339 26.5 22.7063C25.0826 24.6791 23.9996 27.5 21.5789 27.5H11.4798C7.90051 27.5 5 24.5895 5 20.9982V20.8828C5 20.7872 5.07763 20.7096 5.17318 20.7096H10.803C10.9145 20.7096 10.9961 20.8131 10.9862 20.9226C10.9463 21.2889 11.014 21.6632 11.1872 22.0036C11.5216 22.6824 12.2145 23.1064 12.9629 23.1064H15.75V20.9306H12.9948C12.8535 20.9306 12.7699 20.7673 12.8515 20.6518C12.8814 20.6061 12.9152 20.5583 12.951 20.5045C13.2118 20.1343 13.5841 19.5589 13.9543 18.904C14.2072 18.4621 14.452 17.9902 14.6491 17.5164C14.689 17.4308 14.7208 17.3433 14.7526 17.2576C14.8064 17.1064 14.8621 16.965 14.9019 16.8237C14.9417 16.7042 14.9736 16.5788 15.0055 16.4613C15.099 16.0592 15.1388 15.6332 15.1388 15.1912C15.1388 15.0181 15.1309 14.8369 15.1149 14.6637C15.107 14.4746 15.0831 14.2855 15.0592 14.0963C15.0433 13.9291 15.0134 13.7639 14.9816 13.5907C14.9417 13.3379 14.886 13.0871 14.8223 12.8342L14.8004 12.7387C14.7526 12.5655 14.7128 12.4002 14.6571 12.227C14.4998 11.6836 14.3186 11.154 14.1276 10.6583C14.0579 10.4613 13.9782 10.2721 13.8986 10.083C13.7811 9.79832 13.6617 9.53954 13.5522 9.29467C13.4965 9.18319 13.4487 9.08166 13.4009 8.97815C13.3472 8.86068 13.2914 8.74326 13.2357 8.63174C13.1959 8.54614 13.1501 8.46652 13.1182 8.38691L12.7778 7.75782C12.73 7.67222 12.8097 7.57069 12.9032 7.59657L15.0333 8.1739H15.0393C15.0433 8.1739 15.0453 8.17588 15.0473 8.17588L15.3279 8.25351L15.6365 8.34109L15.75 8.37296V7.10686C15.75 6.49569 16.2397 6 16.8449 6C17.1475 6 17.4222 6.12341 17.6193 6.32449C17.8164 6.52557 17.9398 6.80029 17.9398 7.10686V8.98611L18.1667 9.04979C18.1847 9.05578 18.2026 9.06375 18.2185 9.07567C18.2743 9.11748 18.3539 9.17923 18.4554 9.25484C18.535 9.31857 18.6206 9.3962 18.7242 9.47582C18.9292 9.64107 19.1741 9.85409 19.4428 10.0989C19.5145 10.1607 19.5842 10.2243 19.6479 10.2881C19.9942 10.6105 20.3825 10.9888 20.7527 11.4069C20.8562 11.5243 20.9578 11.6437 21.0613 11.7692C21.1648 11.8966 21.2743 12.022 21.3699 12.1474C21.4953 12.3146 21.6306 12.4878 21.7481 12.669C21.8038 12.7546 21.8675 12.8422 21.9213 12.9278C22.0726 13.1567 22.206 13.3936 22.3334 13.6305C22.3871 13.74 22.4429 13.8594 22.4906 13.9769C22.632 14.2934 22.7435 14.6159 22.8151 14.9384C22.8371 15.0081 22.8529 15.0838 22.8609 15.1515V15.1673C22.8848 15.2629 22.8928 15.3645 22.9007 15.468C22.9326 15.7984 22.9167 16.1289 22.845 16.4613C22.8151 16.6027 22.7753 16.736 22.7276 16.8774C22.6798 17.0128 22.632 17.1541 22.5703 17.2875C22.4508 17.5642 22.3095 17.8409 22.1423 18.0997C22.0885 18.1953 22.0248 18.2968 21.9611 18.3923C21.8914 18.4939 21.8198 18.5895 21.7561 18.683C21.6685 18.8025 21.5749 18.9279 21.4793 19.0393C21.3937 19.1568 21.3061 19.2743 21.2106 19.3778C21.0772 19.535 20.9498 19.6844 20.8164 19.8277C20.7368 19.9213 20.6512 20.0168 20.5636 20.1024C20.478 20.198 20.3904 20.2836 20.3108 20.3632C20.1774 20.4966 20.0659 20.6001 19.9724 20.6857L19.7534 20.8868C19.7215 20.9146 19.6797 20.9306 19.6359 20.9306H17.9398V23.1064H20.0739C20.5517 23.1064 21.0056 22.9372 21.3719 22.6267C21.4972 22.5172 22.0447 22.0434 22.6917 21.3287C22.7136 21.3048 22.7415 21.2869 22.7733 21.2789L28.6679 19.5749C28.7774 19.543 28.8889 19.6266 28.8889 19.7421Z"
      fill="currentColor"
    />,
  ],
});

const perfumeBurnContractAddress = isProd
  ? '0x8121DB69911C1885B52d3bB998b33f5789F984B1'
  : '0xFed48472012bddcDE18E076e6D171Df41a394008';
const creditCardPayIframeSrc = isProd
  ? 'https://payments.nftpay.xyz/iframe/iframe_pay/e998898b-10ea-46a1-8b70-af0138bd12d8?'
  : 'https://sandbox.nftpay.xyz/iframe/iframe_pay/dcfc38a4-020c-4ae3-b599-9976a567dac5?';

const CollectionItem = (props: { src: string; name?: string }) => {
  return (
    <Box
      role="group"
      mr="8px"
      w={{ base: '253px', md: '400px' }}
      h={{ base: '190px', md: '300px' }}
      outline="1px solid transparent"
      pos="relative"
      transition="all 0.3s ease"
      _hover={{
        transform: 'scale(1.05)',
        outline: '12px solid #fff',
        zIndex: 1,
      }}
    >
      <FallbackImage
        w={{ base: '253px', md: '400px' }}
        h={{ base: '190px', md: '300px' }}
        src={props.src}
      />
      <Box
        opacity={0}
        _groupHover={{
          opacity: 1,
        }}
        transition="all 0.3s ease"
        pos="absolute"
        bottom="0"
        left="0"
        right="0"
        w="100%"
        color="white"
        fontSize={{ base: '16px', md: '20px' }}
        fontWeight={600}
        p={{ base: '10px', md: '32px 24px 24px' }}
        bg="linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%);"
      >
        {props.name}
      </Box>
    </Box>
  );
};

const names = [
  'Petal Of The Forbidden',
  'Birth Of The Awakened',
  'Pain Of The Innocent',
  'Struggle Of The Solitude',
  'Slumber Of The Disireless',
  'Poison Of The Salvation',
  'Liberation Of The Nature',
  'Domination Of The Silent',
  'Opening Of The Story',
  'Plague Of The Despair',
  'Truth Of The Ego',
  'Encounter Of The Dark',
  'Piety Of The Shadow',
  'Fall Of The Speechless',
  'Hatred Of The Allure',
  'Dignity Of The Fallen',
  'Call Of The Devil',
  'Compromise Of The Mute',
  'Release Of The Humanity',
  'Affection Of The Reuniont',
  'Prayer Of The Devotion',
  'Rebirth Of The Doubt',
  'Dizziness Of The Indulgence',
  'Heartless Of The Noble',
  'Forgiveness Of The Love',
  'Freeing Of The Beast',
  'Statue Of The Desire',
  'Angel Of The Sin',
  'Revival Of The Self',
  'Beginning Of The End',
];

const CollapseItem = (props: {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultIsOpen?: boolean;
}) => {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: props.defaultIsOpen,
  });

  return (
    <Box
      w="full"
      border="2px solid #539290"
      rounded="12px"
      bg="#387270"
      color="white"
    >
      <Flex
        userSelect="none"
        cursor={'pointer'}
        onClick={onToggle}
        fontSize="24px"
        fontWeight={600}
        px="32px"
        py="35px"
        align={'center'}
        justify="space-between"
      >
        {props.title}
        <Icon as={isOpen ? RiArrowUpSLine : RiArrowDownSLine} />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box
          px="32px"
          pb="32px"
          fontSize={'18px'}
          lineHeight="26px"
          color="#f6f6f6"
        >
          {props.children}
        </Box>
      </Collapse>
    </Box>
  );
};

const ChartFill = createIcon({
  displayName: 'chart fill',
  viewBox: '0 0 378 294',
  defaultProps: {
    fill: 'none',
  },
  path: [
    <path
      d="M6.5 103.5L177.33 5.375L372 96.5L272 288.5L98.5 266L6.5 103.5Z"
      fill="#F78DB6"
      fillOpacity="0.3"
      stroke="#F78DB6"
      strokeWidth="2"
    />,
    <circle
      cx="372"
      cy="96"
      r="5.25"
      fill="#F78DB6"
      stroke="white"
      strokeWidth="1.5"
    />,
    <circle
      cx="272"
      cy="288"
      r="5.25"
      fill="#F78DB6"
      stroke="white"
      strokeWidth="1.5"
    />,
    <circle
      cx="98"
      cy="267"
      r="5.25"
      fill="#F78DB6"
      stroke="white"
      strokeWidth="1.5"
    />,
    <circle
      cx="6.31934"
      cy="103.438"
      r="5.25"
      fill="#F78DB6"
      stroke="white"
      strokeWidth="1.5"
    />,
    <circle
      cx="177.621"
      cy="6"
      r="5.25"
      fill="#F78DB6"
      stroke="white"
      strokeWidth="1.5"
    />,
  ],
});

const fadeInScale = keyframes`
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1 ;}
`;
const ChartFillWithAnimation = () => {
  const ref = useRef<SVGSVGElement>(null);
  const { isOpen, onOpen } = useDisclosure();

  const [inViewport] = useInViewport(ref);

  useEffect(() => {
    if (!isOpen && inViewport) {
      onOpen();
    }
  }, [isOpen, inViewport]);

  return (
    <ChartFill
      ref={ref}
      pos="relative"
      top={{ base: '4px', md: '8px' }}
      left={{ base: '8px', md: '12px' }}
      w={{ base: '230.75px', md: '371.5px' }}
      h={{ base: '179.64px', md: '289.13px' }}
      opacity={0}
      animation={isOpen ? `${fadeInScale} 1.2s ease 1s forwards` : undefined}
    />
  );
};

enum CurrentStatus {
  Pending,
  NotStart,
  InProgress,
  END,
  WhitelistSoldout,
  Soldout,
}

const VideoBanner = () => {
  const t = useTranslations('common');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [canPlay, setCanPlay] = useState(false);

  return (
    <Box
      pos="relative"
      mx="auto"
      w="full"
      h="calc(100vh - 80px)"
      minH="620px"
      sx={{
        video: {
          pos: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 1,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        },
      }}
    >
      <Box
        pos="relative"
        zIndex={3}
        mx="auto"
        w="full"
        maxW={{ base: 'full', md: '1600px' }}
        h={{ base: '236px', md: 'calc(100vh - 80px)' }}
      >
        <ButtonGroup
          role="alert"
          rounded="full"
          flexDirection="column"
          pos="absolute"
          zIndex={3}
          right={{ base: '16px', md: '40px' }}
          top={{ base: '24px', md: '56px' }}
          cursor="pointer"
          spacing={0}
          overflow="hidden"
        >
          <IconButton
            as="a"
            target="_blank"
            href="https://discord.gg/ABgmVnUune"
            rounded="none"
            bg="white"
            w={{ base: '36px', md: '48px' }}
            h={{ base: '36px', md: '48px' }}
            fontSize={{ base: '16px', md: '22px' }}
            _active={{
              bg: '#121212',
              color: 'white',
            }}
            _hover={{
              bg: '#121212',
              color: 'white',
            }}
            icon={<Icon as={FaDiscord} />}
            aria-label="discord link"
          />
          <IconButton
            as="a"
            target="_blank"
            href="https://twitter.com/BELLADONNA_NFT"
            rounded="none"
            bg="white"
            w={{ base: '36px', md: '48px' }}
            h={{ base: '36px', md: '48px' }}
            fontSize={{ base: '16px', md: '22px' }}
            _active={{
              bg: '#121212',
              color: 'white',
            }}
            _hover={{
              bg: '#121212',
              color: 'white',
            }}
            icon={<Icon as={FaTwitter} />}
            aria-label="twitter link"
          />
          <IconButton
            as="a"
            target="_blank"
            href="https://opensea.io/collection/belladonna-of-sadness-1"
            icon={<IconOpenSea />}
            aria-label="opensea link"
            rounded="none"
            bg="white"
            w={{ base: '36px', md: '48px' }}
            h={{ base: '36px', md: '48px' }}
            fontSize={{ base: '22px', md: '32px' }}
            _active={{
              bg: '#121212',
              color: 'white',
            }}
            _hover={{
              bg: '#121212',
              color: 'white',
            }}
          />
        </ButtonGroup>
        <Center
          display={{ base: 'none', md: 'flex' }}
          pos="absolute"
          left="0"
          bottom={{ base: '20px', md: '80px' }}
          w="full"
          zIndex={3}
        >
          <Button
            as="a"
            target="_blank"
            href="https://www.unemeta.com/collection/1/0xbddE388b752E44936eFf56DD6784a1f87497aC10"
            fontFamily="Inter"
            color="white"
            fontSize={{ base: '14px', md: '16px' }}
            w={{ base: '160px', md: '286px' }}
            h={{ base: '40px', md: '62px' }}
            bg="radial-gradient(53.5% 246.77% at 87.76% 100%, rgba(137, 67, 170, 0.32) 1.52%, rgba(255, 72, 72, 0.128) 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */, radial-gradient(40.38% 165.53% at 12.24% 0%, rgba(250, 185, 94, 0.32) 0%, rgba(231, 0, 0, 0.128) 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */, rgba(255, 203, 103, 0.32);"
            border="2px solid rgba(251, 136, 83, 0.32);"
            boxShadow="0px 0px 24px rgba(157, 39, 149, 0.6);"
            transition="none"
            _hover={{
              bg: 'radial-gradient(53.5% 246.77% at 87.76% 100%, #8943AA 1.52%, rgba(255, 72, 72, 0.4) 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */, radial-gradient(40.38% 165.53% at 12.24% 0%, #FAB95E 0%, rgba(231, 0, 0, 0.4) 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */, #FFCB67;',
              border: '2px solid rgba(251, 136, 83, 0.6);',
            }}
            _active={{
              bg: 'radial-gradient(53.5% 246.77% at 87.76% 100%, #8943AA 1.52%, rgba(255, 72, 72, 0.4) 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */, radial-gradient(40.38% 165.53% at 12.24% 0%, #FAB95E 0%, rgba(231, 0, 0, 0.4) 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */, #FFCB67;',
              border: '2px solid rgba(251, 136, 83, 0.6);',
            }}
            rounded="full"
            onClick={() =>
              window.scroll({
                top: document
                  .querySelector('#mint-container')!
                  .getBoundingClientRect().top,
                behavior: 'smooth',
              })
            }
          >
            {t('project.exploreCollection')}
          </Button>
        </Center>
      </Box>
      <Box
        pos="absolute"
        left="0"
        right="0"
        top="0"
        bottom="0"
        h="100%"
        w="100%"
        zIndex={2}
        backdropFilter="blur(14px)"
        transition="all 0.5s ease"
        opacity={canPlay ? 0 : 1}
      />
      {!canPlay && (
        <Image
          key={`img${isLargerThan768}`}
          pos="absolute"
          left="0"
          right="0"
          top="0"
          bottom="0"
          h="100%"
          w="100%"
          zIndex={1}
          objectFit="cover"
          src={
            isLargerThan768
              ? '/images/activity/bella/video_poster.jpg'
              : '/images/activity/bella/video_poster_mobile.jpg'
          }
        />
      )}
      <video
        key={`video${isLargerThan768}`}
        loop
        muted
        autoPlay
        playsInline
        onCanPlay={() => {
          setCanPlay(true);
        }}
      >
        <source
          src={
            isLargerThan768
              ? '/videos/belladonna.mp4'
              : '/videos/belladonna_mobile.mp4'
          }
          type="video/mp4"
        />
      </video>
    </Box>
  );
};

const OfflineVideo = () => {
  return (
    <AspectRatio
      ratio={{ base: 335 / 188, md: 882 / 496 }}
      pos="relative"
      zIndex={1}
      rounded="16px"
      overflow="hidden"
      flexShrink={0}
      w={{ base: 'full', md: '882px' }}
      // h={{ base: '188px', md: '496px' }}
    >
      <iframe
        src="https://customer-31627uaci3fi90fm.cloudflarestream.com/ff83a1ac731e76591f97aed9067e7074/iframe"
        style={{ border: 'none', objectFit: 'cover' }}
        height="100%"
        width="100%"
        allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
        allowFullScreen
        id="stream-player"
      ></iframe>
    </AspectRatio>
  );
};

const PerfumeExchange = (props: {
  leftCount: number;
  exchangedCount: number;
}) => {
  const toast = useToast();
  const t = useTranslations('common');
  const pt = useTranslations('bella');
  const listingModalRef = useRef<ModalActionRef>(null);
  const userData = useUserDataValue();
  const { openConnectModal } = useConnectModal();
  const { data, cancel } = useRequest(bellaTokenList, {
    manual: !userData?.wallet_address,
    refreshDeps: [userData?.wallet_address],
    pollingInterval: 3000,
  });

  useEffect(() => {
    if (!userData?.wallet_address) cancel();
  }, [userData?.wallet_address]);

  const notTokenToExchange = useMemo(
    () =>
      data?.data && !data?.data?.list?.length && !data?.data?.already_written,
    [data?.data],
  );
  const isAllExchanged = useMemo(
    () => data?.data?.already_written && !data?.data?.list?.length,
    [data?.data],
  );

  const countStr = useMemo(() => {
    if (!data?.data || !userData?.wallet_address) return pt('exchange');
    // 未持有状态
    if (!data.data.already_written && !data.data.list.length)
      return pt('exchange');
    // 已兑换完状态
    if (data.data.already_written && !data.data.list.length)
      return pt('allExchanged');
    // 可兑换状态
    return pt('changeCount', { count: data.data.list.length });
  }, [data?.data, userData?.wallet_address, pt]);
  return (
    <Box bg="#121212" w="full">
      <Flex
        pos="relative"
        py={{ base: '80px', md: '100px' }}
        maxW={{ base: 'full', md: '1200px' }}
        px={{ base: '20px', md: 0 }}
        direction={{ base: 'column-reverse', md: 'row' }}
        mx="auto"
        w="full"
        align={'center'}
        justify="space-between"
      >
        <Box
          zIndex={1}
          color="white"
          flexGrow={1}
          m={{ base: '24px 0 0', md: '0 60px 0 0' }}
        >
          <Heading fontSize={{ base: '32px', md: '40px' }} mb="24px">
            {pt('perfumeTitle')}
          </Heading>
          <Box
            fontSize={{ base: '18px', md: '22px' }}
            lineHeight={'32px'}
            color="#c0c0c0"
            fontWeight={600}
            mb="24px"
          >
            {pt('startTime')}. 2023-02-21 ～ 2023-03-31
          </Box>
          <Box
            fontFamily={'Inter'}
            fontSize={{ base: '16px', md: '18px' }}
            lineHeight={'32px'}
            color="#c0c0c0"
          >
            {pt('perfumeTitleDesc')}
          </Box>
          <Button
            border="2px solid #787878"
            _hover={{
              bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #363636;',
            }}
            _active={{
              bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #363636;',
            }}
            _disabled={{
              bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #363636;',
            }}
            isDisabled={isAllExchanged || notTokenToExchange}
            color="#f6f6f6"
            variant="ghost"
            rounded="full"
            bg="#363636"
            fontFamily={'Inter'}
            mt={{ base: '24px', md: '24px' }}
            minW="200px"
            h="48px"
            textTransform="uppercase"
            onClick={async () => {
              if (!userData?.wallet_address) {
                return openConnectModal?.();
              }
              if (isAllExchanged || notTokenToExchange) {
                return toast({ status: 'warning', title: '无可兑换数量' });
              }
              listingModalRef.current?.open();
            }}
          >
            {countStr}
          </Button>
        </Box>
        <AspectRatio
          ratio={{ base: 335 / 188, md: 882 / 496 }}
          pos="relative"
          zIndex={1}
          rounded="16px"
          overflow="hidden"
          flexShrink={0}
          w={{ base: 'full', md: '832px' }}
        >
          <Box
            display="block"
            as="a"
            href="https://twitter.com/une_metaverse/status/1624287438125555712?s=46&t=DQ9BhbP-u72sXjpVwzblvw"
            target={'_blank'}
          >
            <FallbackImage src="/images/activity/bella/perfume_exchange.png" />
            <Center
              fontFamily={'Inter'}
              fontSize={{ base: '14px', md: '18px' }}
              color="#c0c0c0"
              w="full"
              pos="absolute"
              bottom={{ base: '0px', md: '20px' }}
              left="0"
              right="0"
            >
              <Flex align={'center'} mr={{ base: '20px', md: '40px' }}>
                {t('project.remaining')}:{' '}
                <Text
                  ml="10px"
                  color="white"
                  fontSize={{ base: '18px', md: '22px' }}
                  fontWeight={600}
                >
                  {props.leftCount - props.exchangedCount}
                </Text>
              </Flex>
              <Flex align={'center'}>
                {t('project.exchanged')}:{' '}
                <Text
                  ml="10px"
                  color="white"
                  fontSize={{ base: '18px', md: '22px' }}
                  fontWeight={600}
                >
                  {props.exchangedCount}
                </Text>
              </Flex>
            </Center>
          </Box>
        </AspectRatio>

        <Box
          w={{ base: '315px', md: '484px' }}
          h={{ base: '315px', md: '484px' }}
          pos="absolute"
          top="-54px"
          right="-246px"
          bg="#5F8A75"
          filter="blur(150px);"
        />
      </Flex>

      <BellaListingModal ref={listingModalRef} />
    </Box>
  );
};

const contractConfig = {
  address: belladonnaAddress as `0x${string}`,
  abi: bellaAbi,
  chainId: defaultChainId,
};

export default function BelladonnaPage() {
  const t = useTranslations('common');
  const pt = useTranslations('bella');
  const [mintLoading, setMintLoading] = useState(false);
  const toast = useToast();
  const isMounted = useMounted();
  const [_, copy] = useCopy();
  const { openConnectModal } = useConnectModal();
  const { signer } = useSignHelper();
  const [mintCount, setMintCount] = useState(1);
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      value: mintCount,
      step: 1,
      min: 1,
      max: 2,
      onChange: (_, v) => setMintCount(v || 1),
    });

  const incProps = getIncrementButtonProps();
  const decProps = getDecrementButtonProps();
  const inputProps = getInputProps();

  const creditPayModalRef = useRef<ModalActionRef>(null);
  const firstInModalRef = useRef<FirstInModalActionRef>(null);

  const [firstInStatus, setFirstInStatus] = useLocalStorageState<
    FirstInStatus | undefined
  >('bella-first-in');

  useEffect(() => {
    const token = jwtHelper.getToken();
    if (token || firstInStatus !== undefined) return;
    firstInModalRef.current?.open({
      callback: (result) => {
        setFirstInStatus(result);
      },
    });
  }, [firstInStatus]);

  const { needSwitchChain, switchChain } = useSwitchChain({
    fixedChainId: defaultChainId,
  });

  const userData = useUserDataValue();
  const {
    data: projectData,
    runAsync: projectRunAsync,
    refresh: projectDataRefresh,
  } = useRequest(statusV2, {
    defaultParams: [{ address: belladonnaAddress }],
    pollingInterval: 5000,
    refreshOnWindowFocus: true,
  });
  const {
    data: userMintData,
    runAsync: userMintRunAsync,
    refresh: userMintDataRefresh,
  } = useRequest(() => userStatusV2({ address: belladonnaAddress }), {
    manual: !userData?.wallet_address,
    refreshDeps: [userData?.wallet_address],
  });

  const contractData = useContractReads({
    watch: true,
    allowFailure: true,
    enabled: isMounted,
    contracts: [
      {
        ...contractConfig,
        functionName: 'MAX_SUPPLY',
      },
      {
        ...contractConfig,
        functionName: 'SUPPLY',
      },
    ],
  });

  const supplyCount = useMemo(() => {
    if (!contractData.isSuccess || !isMounted) return 0;
    const [, supply] = contractData.data as [BigNumber, number];
    if (!supply) return 0;
    return supply;
  }, [contractData.data, isMounted]);

  const leftCountFromContract = useMemo(() => {
    if (!contractData.isSuccess || !isMounted) return 0;
    const [maxSupply, supply] = contractData.data as [BigNumber, number];
    if (!maxSupply || !supply) return 0;
    return maxSupply.sub(BigNumber.from(supply)).toNumber();
  }, [contractData.data, isMounted]);

  const isWhitelist = useMemo(
    () => userMintData?.data?.is_whitelist,
    [userMintData?.data],
  );

  const stage = useMemo(
    () => projectData?.data?.sale_stage || ProjectStageV2.PublicSale,
    [projectData?.data],
  );

  const currentStatus = useMemo(() => {
    if (!projectData?.data) return CurrentStatus.Pending;
    // 未开始
    if (projectData?.data.sale_status === ProjectStatusV2.Wait)
      return CurrentStatus.NotStart;
    // 进行中
    if (projectData?.data.sale_status === ProjectStatusV2.InProgress) {
      // 白单阶段soldout
      if (
        projectData.data.private_public_sale_left === 0 &&
        projectData.data.private_white_sale_left === 0
      )
        return CurrentStatus.WhitelistSoldout;
      // 常规soldout
      if (projectData.data.public_sale_left === 0) return CurrentStatus.Soldout;
      return CurrentStatus.InProgress;
    }
    return CurrentStatus.END;
  }, [projectData?.data]);

  const currentStatusText = useMemo(() => {
    if (
      currentStatus === CurrentStatus.NotStart ||
      currentStatus === CurrentStatus.Pending
    )
      return pt('notStarted');
    if (
      currentStatus === CurrentStatus.Soldout ||
      currentStatus === CurrentStatus.WhitelistSoldout
    )
      return pt('soldOut');
    if (currentStatus === CurrentStatus.InProgress) return pt('inProgress');
    return 'End';
  }, [pt, currentStatus]);

  const currentMintPrice = useMemo(() => {
    if (!projectData?.data) return 0;
    if (currentStatus !== CurrentStatus.InProgress) return 0;
    if (stage === ProjectStageV2.WhitelistSale) {
      return (
        (isWhitelist
          ? projectData?.data.private_price
          : projectData.data.public_price) * mintCount
      );
    }
    return projectData.data.public_price * mintCount;
  }, [stage, currentStatus, isWhitelist, projectData?.data, mintCount]);

  const renderLeftCountAndPrice = useMemo(() => {
    if (!userMintData?.data || !userData?.wallet_address) return null;
    if (stage == ProjectStageV2.PublicSale) return null;
    const count = userMintData.data.is_whitelist
      ? userMintData.data.allow_limit - userMintData.data.allow_minted
      : userMintData.data.public_limit - userMintData.data.public_minted;
    return (
      <Text
        ml={{ base: '0', md: '15px' }}
        color="#c0c0c0"
        fontSize={{ base: '16px', md: '20px' }}
      >
        {userMintData.data.is_whitelist
          ? pt('whitelistLeftCount', { count })
          : pt('notWhitelistLeftCount', { count })}
      </Text>
    );
  }, [pt, stage, userData?.wallet_address, userMintData?.data]);

  const publicMint = async (count: number) => {
    try {
      const contract = new Contract(belladonnaAddress, bellaAbi, signer!);
      const tx: ContractTransaction = await contract.publicMint(count, {
        value: parseEther(String(projectData?.data.public_price! * count)),
      });
      const reicept = await tx.wait();
      return reicept;
    } catch (error) {
      throw Error(error.reason || error.message);
    }
  };

  const whitelistMint = async (count: number) => {
    try {
      const resp = await proof({
        contract_address: belladonnaAddress,
        count,
      });
      const contract = new Contract(belladonnaAddress, bellaAbi, signer!);
      const tx: ContractTransaction = await contract.whitelistMint(
        count,
        resp.data.proof,
        {
          value: parseEther(String(projectData?.data.private_price! * count)),
        },
      );
      const reicept = await tx.wait();
      return reicept;
    } catch (error) {
      throw Error(error.reason || error.message);
    }
  };

  const mintPreCheck = () => {
    let canMint = true;
    let message = '';
    if (currentStatus === CurrentStatus.NotStart) {
      canMint = false;
      message = 'Mint not started';
    }
    if (currentStatus === CurrentStatus.END) {
      canMint = false;
      message = 'Mint has ended';
    }
    if (
      currentStatus === CurrentStatus.Soldout ||
      currentStatus === CurrentStatus.WhitelistSoldout
    ) {
      canMint = false;
      message = 'Soldout!';
    }

    if (!canMint) {
      toast({ status: 'warning', title: message });
      return canMint;
    }

    return true;
  };

  const mint = async () => {
    if (!mintPreCheck()) return;
    if (needSwitchChain) return switchChain();

    setMintLoading(true);
    try {
      const { data } = await projectRunAsync({ address: belladonnaAddress });
      const { data: c } = await userMintRunAsync();
      // 白单阶段
      if (stage === ProjectStageV2.WhitelistSale) {
        const supply = c.is_whitelist
          ? data.private_white_sale_left
          : data.private_public_sale_left;
        const userLeftSupply = c.is_whitelist
          ? c.allow_limit - c.allow_minted
          : c.public_limit - c.public_minted;
        // 供应量不足
        if (supply <= 0) {
          throw Error('Insufficient supply');
        }
        // mint数大于限制数
        // mint数大于剩余量
        if (mintCount > userLeftSupply || mintCount > supply) {
          throw Error('Exceed the quantity limit');
        }
        const tx = c.is_whitelist
          ? await whitelistMint(mintCount)
          : await publicMint(mintCount);

        console.log('🚀 ~ file: belladonna.tsx:376 ~ mint ~ tx', tx);
        setMintCount(1);
        projectDataRefresh();
        userMintDataRefresh();
        toast({ title: 'Mint Success!', status: 'success' });
      }

      // 公共sale阶段
      if (stage === ProjectStageV2.PublicSale) {
        const supply = data.public_sale_left;
        // 供应量不足
        if (supply <= 0) {
          throw Error('Insufficient supply');
        }
        // mint数大于限制数
        // mint数大于剩余量
        if (mintCount > supply) {
          throw Error('Exceed the quantity limit');
        }
        await publicMint(mintCount);
        setMintCount(1);
        projectDataRefresh();
        userMintDataRefresh();
        toast({ title: 'Mint Success!', status: 'success' });
      }
    } catch (err) {
      toast({ title: err.message, status: 'error' });
    }
    setMintLoading(false);
  };

  const creditPay = async () => {
    if (!mintPreCheck()) return;
    const { data } = await projectRunAsync({ address: belladonnaAddress });
    if (
      stage === ProjectStageV2.WhitelistSale &&
      data?.private_public_sale_left === 0
    ) {
      return toast({ status: 'warning', title: 'Insufficient supply' });
    }
    creditPayModalRef.current?.open();
  };

  const collectionDetailArr = useMemo(
    () => [
      {
        title: t('project.contractAddress'),
        content: `${belladonnaAddress.substring(
          0,
          6,
        )}...${belladonnaAddress.slice(-4)}`,
        copy: true,
      },
      { title: t('project.fileHosting'), content: 'IPFS' },
      {
        title: t('project.totalSupply'),
        content: projectData?.data ? projectData.data.public_sale_supply : 0,
      },
      { title: t('project.tokenStandard'), content: 'ERC721' },
      { title: t('project.blockchain'), content: 'Ethereum' },
      { title: t('project.creatorFee'), content: '5%' },
    ],
    [projectData?.data],
  );

  return (
    <>
      <Box w="full" bg="black" overflow="hidden">
        <VideoBanner />
        <Box bg="#121212" w="full">
          <Flex
            pos="relative"
            py={{ base: '80px', md: '120px' }}
            px={{ base: '20px', md: 0 }}
            mx="auto"
            w="full"
            maxW={{ base: 'full', md: '1200px' }}
            align={'center'}
            justify="space-between"
            direction={{ base: 'column', md: 'row' }}
          >
            <Box
              zIndex={1}
              color="white"
              flexGrow={1}
              m={{ base: '0 0 24px', md: '0 60px 0 0' }}
            >
              <Heading
                fontSize={{ base: '32px', md: '40px' }}
                mb={{ base: '42px', md: '24px' }}
              >
                {pt('aboutTheAuthor')}
              </Heading>
              <Box
                color="#f6f6f6"
                fontSize={{ base: '16px', md: '20px' }}
                lineHeight={'32px'}
              >
                {pt('aboutTheAuthorDoc')}
              </Box>
            </Box>
            <FallbackImage
              zIndex={1}
              flexShrink={0}
              rounded="16px"
              w={{ base: 'full', md: '636px' }}
              h={{ base: '255px', md: '496px' }}
              src="/images/activity/bella/author.png"
            />
            <Box
              w={{ base: '190px', md: '300px' }}
              h={{ base: '190px', md: '300px' }}
              pos="absolute"
              top="105px"
              left="-146px"
              bg="#C5A8CF"
              filter="blur(100px);"
            />
            <Box
              w={{ base: '224px', md: '354px' }}
              h={{ base: '224px', md: '354px' }}
              pos="absolute"
              top="263px"
              left="-55px"
              bg="#70505C"
              filter="blur(100px);"
            />
            <Box
              pos="absolute"
              w={{ base: '55px', md: '100vw' }}
              bottom="0"
              right={{ base: 'unset', md: '240px' }}
              left={{ base: 0, md: 'unset' }}
              bg="#D9D9D9"
              h="1px"
              opacity={0.5}
            />
          </Flex>
        </Box>

        <Box bg="#121212" w="full">
          <Flex
            pos="relative"
            py={{ base: '80px', md: '120px' }}
            maxW={{ base: 'full', md: '1200px' }}
            px={{ base: '20px', md: 0 }}
            direction={{ base: 'column', md: 'row' }}
            mx="auto"
            w="full"
            align={'center'}
            justify="space-between"
          >
            <OfflineVideo />

            <Box
              zIndex={1}
              color="white"
              flexGrow={1}
              m={{ base: '24px 0 0', md: '0 0 0 60px' }}
            >
              <Heading fontSize={{ base: '32px', md: '40px' }} mb="24px">
                {pt('offlineExhibitions')}
              </Heading>
              <Box
                fontSize={{ base: '18px', md: '22px' }}
                lineHeight={'32px'}
                color="#c0c0c0"
                fontWeight={600}
                mb="24px"
              >
                {pt('startTime')}. 2023/02/14 12:00:00 GMT+09:00
              </Box>
              <Box
                fontSize={{ base: '16px', md: '18px' }}
                lineHeight={'32px'}
                color="#c0c0c0"
              >
                東京都渋谷区神宮前3丁目22−11
              </Box>
              <Button
                as="a"
                href="https://somsoc.jp"
                target="_blank"
                fontFamily={'Inter'}
                mt={{ base: '24px', md: '36px' }}
                w="200px"
                h="48px"
                border="2px solid #363636"
                _hover={{
                  bg: 'rgba(255, 255, 255, 0.2);',
                }}
                color="#f6f6f6"
                variant="ghost"
                rounded="full"
                bg="none"
                textTransform="uppercase"
                rightIcon={<Icon as={FiArrowRight} />}
              >
                {pt('moreInfo')}
              </Button>
            </Box>
            <Box
              w={{ base: '315px', md: '484px' }}
              h={{ base: '315px', md: '484px' }}
              pos="absolute"
              top="-54px"
              right="-246px"
              bg="#5F8A75"
              filter="blur(150px);"
            />
            <Box
              pos="absolute"
              w={{ base: '55px', md: '100vw' }}
              bottom="0"
              left={{ base: 'unset', md: '240px' }}
              right={{ base: 0, md: 'unset' }}
              bg="#D9D9D9"
              h="1px"
              opacity={0.5}
            />
          </Flex>
        </Box>

        <PerfumeExchange
          leftCount={supplyCount}
          exchangedCount={projectData?.data?.perfume_exchanged || 0}
        />

        <Box id="mint-container" bg="#121212" w="full" display={'none'}>
          <Flex
            py={{ base: '80px', md: '120px' }}
            maxW={{ base: 'full', md: '1200px' }}
            direction={{ base: 'column', md: 'row' }}
            pos="relative"
            mx="auto"
            w="full"
            align={'center'}
            justify="space-between"
          >
            <Center flexGrow={1}>
              <Box
                pos="relative"
                w={{ base: '215px', md: '425px' }}
                h={{ base: '276px', md: '552px' }}
              >
                <FallbackImage
                  pos="relative"
                  zIndex={2}
                  w="full"
                  h="full"
                  src="/images/activity/bella/nft_with_frame.png"
                />

                <Box
                  zIndex={1}
                  pos="absolute"
                  top={{ base: '-38px', md: '-80px' }}
                  left={{ base: '-45px', md: '-95px' }}
                  w={{ base: '152px', md: '320px' }}
                  h={{ base: '152px', md: '320px' }}
                  mixBlendMode="darken"
                  bg="url(/images/activity/bella/mint_nft_texture.png) center center"
                  bgSize="contain"
                />

                <Box
                  zIndex={1}
                  pos="absolute"
                  bottom={{ base: '-28px', md: '-65px' }}
                  right={{ base: '-30px', md: '-75px' }}
                  w={{ base: '152px', md: '320px' }}
                  h={{ base: '152px', md: '320px' }}
                  mixBlendMode="darken"
                  bg="url(/images/activity/bella/mint_nft_texture.png) center center"
                  bgSize="contain"
                />

                <Box
                  opacity={0.6}
                  w={{ base: '110px', md: '230px' }}
                  h={{ base: '110px', md: '230px' }}
                  pos="absolute"
                  top="-5px"
                  left="12px"
                  bg="#db7283"
                  filter="blur(100px);"
                />
                <Box
                  opacity={0.6}
                  w={{ base: '117px', md: '244px' }}
                  h={{ base: '117px', md: '244px' }}
                  pos="absolute"
                  bottom="-20px"
                  right="-60px"
                  bg="#6198b6"
                  filter="blur(100px);"
                />
              </Box>
            </Center>

            <Box
              mt={{ base: '62px', md: '0' }}
              w={{ base: 'full', md: '567px' }}
              px={{ base: '20px', md: 0 }}
              flexShrink={0}
              color="white"
            >
              <Flex
                direction={{ base: 'column', md: 'row' }}
                align={{ base: 'flex-start', md: 'flex-end' }}
                mb="48px"
              >
                <Heading fontSize={{ base: '32px', md: '40px' }}>
                  {currentStatusText}
                </Heading>
                {renderLeftCountAndPrice}
              </Flex>

              <Stack direction="column" spacing={'24px'} mb="48px">
                <Flex w="full" direction={'column'} align="flex-start">
                  <Text fontSize={'18px'} color="#c0c0c0" mb="12px">
                    {t('project.left')}
                  </Text>
                  <Text
                    fontSize={'24px'}
                    mb="24px"
                    color="white"
                    fontWeight={700}
                  >
                    {leftCountFromContract}
                  </Text>
                  <Box h="1px" bg="#787878" w="full" />
                </Flex>
                <Flex
                  mb="72px"
                  w="full"
                  direction={'column'}
                  align="flex-start"
                >
                  <Text fontSize={'18px'} color="#c0c0c0" mb="12px">
                    {t('price')}
                  </Text>
                  <HStack mb="24px" color="white" spacing="12px">
                    <Text
                      whiteSpace="nowrap"
                      fontSize={'24px'}
                      fontWeight={700}
                    >
                      {projectData?.data?.public_price} eth
                    </Text>
                    <Text
                      fontSize={{ base: '16px', md: '20px' }}
                      color="#c0c0c0"
                    >
                      {pt('whitelistPrice', {
                        price: projectData?.data?.private_price,
                      })}
                    </Text>
                  </HStack>
                  <Box h="1px" bg="#787878" w="full" />
                </Flex>
              </Stack>

              <Flex
                pos="relative"
                w="160px"
                h="52px"
                px="26px"
                fontSize={'14px'}
              >
                <IconButton
                  pos="absolute"
                  left="0"
                  top="0"
                  zIndex={2}
                  color="white"
                  h="52px"
                  w="52px"
                  rounded="full"
                  border="2px solid #787878"
                  bg="none"
                  aria-label="plus button"
                  _hover={{
                    bg: 'rgba(255, 255, 255, 0.2);',
                  }}
                  _active={{
                    bg: 'rgba(255, 255, 255, 0.2);',
                  }}
                  _disabled={{
                    borderColor: '#787878',
                  }}
                  icon={<FiMinus />}
                  {...decProps}
                />
                <Input
                  textAlign="center"
                  h="full"
                  w="full"
                  borderWidth="0"
                  borderColor="#787878 !important"
                  borderTopWidth="2px"
                  borderBottomWidth="2px"
                  bg="none"
                  color="white"
                  fontSize="24px"
                  rounded="none"
                  {...inputProps}
                />
                <IconButton
                  pos="absolute"
                  right="0"
                  top="0"
                  zIndex={2}
                  color="white"
                  h="52px"
                  w="52px"
                  rounded="full"
                  border="2px solid #787878"
                  _hover={{
                    bg: 'rgba(255, 255, 255, 0.2);',
                  }}
                  _active={{
                    bg: 'rgba(255, 255, 255, 0.2);',
                  }}
                  _disabled={{
                    borderColor: '#787878',
                  }}
                  bg="none"
                  aria-label="minus button"
                  icon={<FiPlus />}
                  {...incProps}
                />
              </Flex>

              <Flex
                sx={{
                  '& > button': {
                    my: '12px',
                  },
                }}
                direction={
                  !userData?.wallet_address &&
                  firstInStatus === FirstInStatus.FirstBuy
                    ? 'column-reverse'
                    : 'column'
                }
                mt={{ base: '36px', md: '60px' }}
              >
                {!!userData?.wallet_address ? (
                  <Button
                    w="full"
                    h="62px"
                    border="2px solid #787878"
                    _hover={{
                      bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #363636;',
                    }}
                    _active={{
                      bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #363636;',
                    }}
                    color="#f6f6f6"
                    variant="ghost"
                    rounded="full"
                    bg="#363636"
                    fontFamily={'Inter'}
                    onClick={mint}
                    isLoading={mintLoading}
                  >
                    {t('project.mint')}
                    {currentMintPrice > 0 && `(${currentMintPrice}eth)`}
                  </Button>
                ) : (
                  <Button
                    w="full"
                    h="62px"
                    border="2px solid #787878"
                    _hover={{
                      bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #363636;',
                    }}
                    _active={{
                      bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #363636;',
                    }}
                    color="#f6f6f6"
                    variant="ghost"
                    rounded="full"
                    bg="#363636"
                    fontFamily={'Inter'}
                    onClick={openConnectModal}
                  >
                    {t('project.connectWallet')}
                  </Button>
                )}
                <Button
                  w="full"
                  h="62px"
                  border="2px solid #787878"
                  color="#f6f6f6"
                  variant="ghost"
                  rounded="full"
                  bg="#363636"
                  _hover={{
                    bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #363636;',
                  }}
                  _active={{
                    bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #363636;',
                  }}
                  fontFamily={'Inter'}
                  onClick={creditPay}
                >
                  <Flex direction={'column'}>
                    <Text fontSize={'14px'} mb="4px">
                      {pt('creditCardPay')}
                    </Text>
                    <Text fontSize={'12px'} fontWeight="normal">
                      {pt('noWalletNeeded')}
                    </Text>
                  </Flex>
                </Button>
              </Flex>
            </Box>

            <Box
              pos="absolute"
              w={{ base: '55px', md: '100vw' }}
              bottom="0"
              right={{ base: 'unset', md: '240px' }}
              left={{ base: 0, md: 'unset' }}
              bg="#D9D9D9"
              opacity={0.5}
              h="1px"
            />
          </Flex>
        </Box>

        <Box bg="#121212" w="full">
          <Flex
            pos="relative"
            py={{ base: '80px', md: '120px' }}
            px={{ base: '20px', md: '0' }}
            maxW={{ base: 'full', md: '1200px' }}
            direction={{ base: 'column', md: 'row' }}
            mx="auto"
            w="full"
            justify="space-between"
          >
            <Box
              w={{ base: 'full', md: '540px' }}
              mb={{ base: '80px', md: '0' }}
              flexShrink={0}
              color="white"
            >
              <Heading fontSize={{ base: '32px', md: '40px' }} mb="48px">
                {t('project.collectionScore')}
              </Heading>

              <Center
                w="full"
                h={{ base: '335px', md: '540px' }}
                rounded="16px"
                border="2px dashed #363636"
                pos="relative"
                bg="url(/images/activity/bella/chart_bg.svg) no-repeat center center"
                bgSize={{ base: '243px 230px', md: 'unset' }}
                color="#A5A5A5"
                fontSize={{ base: '12px', md: '14px' }}
                fontWeight={600}
                fontFamily="Inter"
              >
                <Tooltip label={pt('team')} placement="top">
                  <Box
                    textAlign="center"
                    pos="absolute"
                    top={{ base: '26px', md: '50px' }}
                    left={{ base: '118px', md: '190px' }}
                    w={{ base: '100px', md: '160px' }}
                  >
                    {t('project.team')}
                  </Box>
                </Tooltip>
                <Tooltip label={pt('otherFactors')} placement="top">
                  <Box
                    pos="absolute"
                    top={{ base: '75px', md: '153px' }}
                    right={{ base: '-10px', md: '20px' }}
                    w={{ base: '75px', md: '120px' }}
                  >
                    {t('project.otherFactors')}
                  </Box>
                </Tooltip>
                <Tooltip label={pt('backers')} placement="top">
                  <Box
                    pos="absolute"
                    bottom={{ base: '22px', md: '50px' }}
                    right={{ base: '36px', md: '60px' }}
                    w={{ base: '75px', md: '120px' }}
                  >
                    {t('project.backers')}
                  </Box>
                </Tooltip>
                <Tooltip label={pt('utilities')} placement="top">
                  <Box
                    pos="absolute"
                    bottom={{ base: '22px', md: '50px' }}
                    left={{ base: '50px', md: '90px' }}
                    w={{ base: '75px', md: '120px' }}
                  >
                    {t('project.utilities')}
                  </Box>
                </Tooltip>
                <Tooltip label={pt('community')} placement="top">
                  <Box
                    pos="absolute"
                    top={{ base: '90px', md: '153px' }}
                    left={{ base: '10px', md: '32px' }}
                    w={{ base: '75px', md: '120px' }}
                  >
                    {t('project.community')}
                  </Box>
                </Tooltip>
                <ChartFillWithAnimation />
              </Center>
            </Box>

            <Box w={{ base: 'full', md: '540px' }} flexShrink={0} color="white">
              <Heading fontSize={{ base: '32px', md: '40px' }} mb="48px">
                {t('project.collectionDetail')}
              </Heading>

              <SimpleGrid
                templateColumns={'1fr 1fr'}
                spacing={{ base: '36px', md: '62px' }}
              >
                {collectionDetailArr.map((el) => (
                  <Flex
                    borderBottom="1px solid #363636"
                    pb={{ base: '36px', md: '62px' }}
                    key={el.title}
                    direction={'column'}
                  >
                    <Text
                      mb="12px"
                      fontSize={{ base: '14px', md: '18px' }}
                      color="#c0c0c0"
                      textTransform="capitalize"
                    >
                      {el.title}
                    </Text>
                    <HStack
                      fontSize={{ base: '16px', md: '24px' }}
                      fontWeight={600}
                      color="#f6f6f6"
                      spacing="15px"
                    >
                      <Text>{el.content} </Text>
                      {el.copy && (
                        <Icon
                          onClick={async () => {
                            await copy(belladonnaAddress);
                            toast({
                              status: 'success',
                              title: 'Contract address copied!',
                            });
                          }}
                          as={MdOutlineCopyAll}
                          fontSize="22px"
                        />
                      )}
                    </HStack>
                  </Flex>
                ))}
              </SimpleGrid>
            </Box>

            <Box
              w={{ base: '210px', md: '357px' }}
              h={{ base: '210px', md: '357px' }}
              pos="absolute"
              top={{ base: '540px', md: '300px' }}
              right={{ base: '-130px', md: '-260px' }}
              bg="#70505C"
              filter="blur(150px);"
            />
            <Box
              w={{ base: '268px', md: '484px' }}
              h={{ base: '268px', md: '484px' }}
              pos="absolute"
              bottom={{ base: '100px', md: '-97px' }}
              right={{ base: '-280px', md: '-400px' }}
              bg="rgba(188, 193, 88, 0.6)"
              filter="blur(150px);"
            />
          </Flex>
        </Box>

        <Box
          bg="#121212"
          w="full"
          pb="80px"
          sx={{
            '.marquee-wrapper': {
              py: '20px',
            },
            '.marquee:hover': {
              zIndex: 2,
            },
          }}
        >
          <Flex
            color="white"
            pos="relative"
            mx="auto"
            w="full"
            px={{ base: '20px', md: '0' }}
            maxW={{ base: 'full', md: '1200px' }}
          >
            <Heading
              fontSize={{ base: '32px', md: '40px' }}
              maxW="580px"
              mb="42px"
            >
              {pt('belladonnaCollection')}
            </Heading>
          </Flex>
          <Box
            pos="relative"
            _hover={{
              zIndex: 2,
            }}
          >
            <Marquee
              loop={0}
              pauseOnHover
              gradient={false}
              speed={30}
              className="marquee-wrapper"
            >
              {Array(15)
                .fill(0)
                .map((_, idx) => (
                  <CollectionItem
                    key={idx}
                    name={names[idx]}
                    src={`/images/activity/bella/collection/${idx + 1}.png`}
                  />
                ))}
            </Marquee>
          </Box>
          <Box
            pos="relative"
            mt="-32px"
            _hover={{
              zIndex: 2,
            }}
          >
            <Marquee
              loop={0}
              pauseOnHover
              gradient={false}
              speed={35}
              className="marquee-wrapper"
            >
              {Array(15)
                .fill(0)
                .map((_, idx) => (
                  <CollectionItem
                    key={idx}
                    name={names[idx + 16]}
                    src={`/images/activity/bella/collection/${idx + 16}.png`}
                  />
                ))}
            </Marquee>
          </Box>
        </Box>

        <Box w="full" bg="#2A5352">
          <Box
            pt="80px"
            pb="120px"
            color="white"
            w="full"
            px={{ base: '20px', md: '0' }}
            maxW={{ base: 'full', md: '1200px' }}
            mx="auto"
          >
            <Heading fontSize={{ base: '32px', md: '40px' }} mb="48px">
              FAQ
            </Heading>

            <VStack mb="80px" w="full" spacing={'48px'}>
              <CollapseItem title={pt('faq1')} defaultIsOpen>
                {Object.entries(
                  pt.raw('faq1Answer' as any) as Record<string, string[]>,
                ).map(([title, contents], idx) => {
                  return (
                    <Box key={idx} mb="20px">
                      <Heading fontSize="18px" mb="10px" as="h5">
                        {title}
                      </Heading>
                      {contents.map((el, ci) => (
                        <Text mb="5px" key={ci}>
                          {el}
                        </Text>
                      ))}
                    </Box>
                  );
                })}
              </CollapseItem>
              <CollapseItem title={pt('faq2')}>
                {(pt.raw('faq2Answer') as string[]).map((el, i) => (
                  <Text mb="5px" key={i}>
                    {el}
                  </Text>
                ))}
              </CollapseItem>
              <CollapseItem title={pt('faq3')}>
                {(pt.raw('faq3Answer') as string[]).map((el, i) => (
                  <Text mb="5px" key={i}>
                    {el}
                  </Text>
                ))}
              </CollapseItem>
              <CollapseItem title={pt('faq4')}>
                {pt('faq4Answer')}:
                <Link
                  textDecoration="underline"
                  href="https://organic-roll-0aa.notion.site/MetaMask-7ca2e1ca41ae400f8f2bddd8ccedd751"
                  target="_blank"
                >
                  https://organic-roll-0aa.notion.site/MetaMask-7ca2e1ca41ae400f8f2bddd8ccedd751
                </Link>
              </CollapseItem>
              <CollapseItem title={pt('faq5')}>{pt('faq5Answer')}</CollapseItem>
            </VStack>

            <Heading fontSize={{ base: '24px', md: '40px' }} mb="48px">
              {t('project.uuu')}
            </Heading>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
            >
              <Flex
                p="32px"
                w="full"
                maxW={{ base: 'full', md: '576px' }}
                h={{ base: 'auto', md: '380px' }}
                border="2px solid #539290"
                rounded="12px"
                bg="#387270"
                direction={'column'}
                justify="space-between"
                mb={{ base: '48px', md: 'unset' }}
              >
                <Box>
                  <Box
                    fontSize={{ base: '24px', md: '32px' }}
                    color="white"
                    fontWeight={600}
                    mb="24px"
                  >
                    {t('project.listAndGetUuu', { amount: 300 })}
                  </Box>
                  <Box
                    opacity={0.8}
                    fontSize={{ base: '20px', md: '24px' }}
                    color="#f6f6f6"
                    lineHeight={'34px'}
                    mb="24px"
                  >
                    {pt('listAndGetUuu')}
                  </Box>
                </Box>
                <NextLink
                  href={
                    userData?.wallet_address
                      ? `/user/${userData?.wallet_address}?bulkList=true`
                      : '/login'
                  }
                  passHref
                >
                  <Link>
                    <Button
                      fontFamily={'Inter'}
                      w="full"
                      h="62px"
                      rounded="8px"
                      border="none !important"
                      bg="#508A88"
                      _hover={{
                        bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #508A88;',
                      }}
                      _active={{
                        bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #508A88;',
                      }}
                      fontSize={'14px'}
                      mt={{ base: '78px', md: 0 }}
                      rightIcon={<Icon as={FiArrowRight} />}
                    >
                      {t('list')}
                    </Button>
                  </Link>
                </NextLink>
              </Flex>

              <Flex
                p="32px"
                w="full"
                maxW={{ base: 'full', md: '576px' }}
                h={{ base: 'auto', md: '380px' }}
                border="2px solid #539290"
                rounded="12px"
                bg="#387270"
                direction={'column'}
                justify="space-between"
              >
                <Box>
                  <Box
                    fontSize={{ base: '24px', md: '32px' }}
                    color="white"
                    fontWeight={600}
                    mb="24px"
                  >
                    {t('project.buyAndGetUuu')}
                  </Box>
                  <Box
                    opacity={0.8}
                    fontSize={{ base: '20px', md: '24px' }}
                    color="#f6f6f6"
                    lineHeight={'34px'}
                    mb="24px"
                  >
                    {pt('buyAndGetUuu')}
                  </Box>
                  <Box
                    opacity={0.8}
                    fontSize={'16px'}
                    color="#f6f6f6"
                    fontWeight={600}
                  >
                    {t('project.buyRule', {
                      other: '+500',
                    })}
                  </Box>
                </Box>
                <NextLink
                  href={`/collection/${defaultChainId}/${belladonnaAddress}`}
                  passHref
                >
                  <Link>
                    <Button
                      fontFamily={'Inter'}
                      w="full"
                      h="62px"
                      rounded="8px"
                      border="none !important"
                      bg="#508A88"
                      _hover={{
                        bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #508A88;',
                      }}
                      _active={{
                        bg: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), #508A88;',
                      }}
                      fontSize={'14px'}
                      mt={{ base: '32px', md: 0 }}
                      rightIcon={<Icon as={FiArrowRight} />}
                    >
                      {t('buy')}
                    </Button>
                  </Link>
                </NextLink>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Box>
      <CreditPayModal ref={creditPayModalRef} />

      <FirstInModal ref={firstInModalRef} />

      <Footer bg="#000" />
    </>
  );
}

type ModalActionRef = {
  open: () => Promise<void>;
};

enum FirstInStatus {
  FirstBuy = '1',
  NotFirstBuy = '2',
}

interface Option {
  value: string;
  label: string;
}

const TagSelect = ({ options, ...props }: SelectProps<Option, true>) => {
  const [field, _, helpers] = useField<string[]>(props.name as string);
  const defaultValue = useMemo(
    () =>
      (options as Option[])
        ? (options as Option[]).filter((option) =>
            field.value.includes(option.value),
          )
        : [],
    [JSON.stringify(options), field.value],
  );

  return (
    <Select<Option, true>
      {...props}
      isMulti
      value={defaultValue}
      options={options}
      onChange={(option) => {
        helpers.setValue(option.map((el) => el.value));
      }}
    />
  );
};

const BellaListingModal = forwardRef<ModalActionRef>((props, ref) => {
  const t = useTranslations('common');
  const pt = useTranslations('bella');
  const { signer } = useSignHelper();
  const listingSuccessModalRef = useRef<ModalActionRef>(null);
  const toast = useToast();
  const userData = useUserDataValue();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loading, data, run } = useRequest(bellaTokenList, {
    manual: true,
  });

  const options = useMemo(
    () =>
      Array.isArray(data?.data?.list)
        ? data?.data?.list.map((el) => ({ label: el.name, value: el.id }))
        : [],
    [data?.data],
  );

  const open = async () => {
    run();
    onOpen();
  };

  const close = () => {
    onClose();
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));
  return (
    <>
      <Modal
        size={{ base: 'full', md: 'md' }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent
          maxW={{ base: 'full', md: '764px' }}
          p={{ base: '56px 20px', md: '56px 50px 25px' }}
          bgColor="white"
          rounded="24px"
          overflow="hidden"
        >
          <ModalCloseButton
            top="16px"
            right="16px"
            bg="#787878"
            rounded="full"
            zIndex={1}
            color="#fff"
            fontSize="10px"
            display={{ base: 'flex', md: 'none' }}
          />
          <ModalBody zIndex={1} p="0" color="#121212">
            {loading ? (
              <Center h={{ base: '100vh', md: '400px' }}>
                <Spinner emptyColor="#eee" thickness="3px" />
              </Center>
            ) : (
              <>
                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  pos="relative"
                  zIndex={1}
                >
                  <Image
                    m={{ base: '0 auto 60px', md: '0 60px 0 0' }}
                    flexShrink={0}
                    w="205px"
                    h="262px"
                    src="/images/activity/bella/nft_with_frame.png"
                  />
                  <Box w="full" textAlign={{ base: 'left', md: 'left' }}>
                    <Formik<BellaFormPayload>
                      initialValues={{
                        name: '',
                        email: '',
                        city: '',
                        zip: '',
                        address: '',
                        token_id_list: [],
                      }}
                      onSubmit={async ({
                        token_id_list: tokenList,
                        ...values
                      }) => {
                        try {
                          if (!tokenList || !tokenList.length)
                            throw Error('Please select token.');

                          // 先post联系地址
                          await bellaForm(values);

                          // 合约交互
                          const contract = new Contract(
                            belladonnaAddress,
                            bellaAbi,
                            signer!,
                          );
                          // 循环授权转出
                          for (
                            let index = 0;
                            index < tokenList.length;
                            index++
                          ) {
                            const tokenId = tokenList[index];
                            const tx: ContractTransaction =
                              await contract.transferFrom(
                                userData?.wallet_address,
                                perfumeBurnContractAddress,
                                tokenId,
                              );
                            await tx.wait();
                            // 转出确认
                            await bellaForm({
                              token_id_list: [tokenId!],
                              ...values,
                            });
                          }

                          toast({
                            title: 'Submitted successfully',
                            status: 'success',
                          });
                          onClose();
                        } catch (error: any) {
                          toast({
                            title: error.message,
                            status: 'error',
                          });
                        }
                      }}
                    >
                      {({ errors, touched, isSubmitting }) => (
                        <>
                          <Box
                            mb="32px"
                            fontSize={{ base: '24px', md: '20px' }}
                          >
                            {pt('perfumeTitle')}
                          </Box>

                          <Form>
                            <Grid
                              templateColumns={{
                                base: '1fr',
                                md: 'repeat(2, 1fr)',
                              }}
                              gap={{ base: '20px', md: '24px 15px' }}
                            >
                              <GridItem colSpan={{ base: 2, md: 2 }}>
                                <Stack
                                  w="full"
                                  spacing={{ base: '8px', md: '15px' }}
                                  direction={{ base: 'column', md: 'row' }}
                                >
                                  <FormControl
                                    flex={1}
                                    isInvalid={!!(errors.name && touched.name)}
                                  >
                                    <FormLabel
                                      fontWeight={{ base: 700, md: 400 }}
                                    >
                                      {pt('recipientInformation')}
                                    </FormLabel>
                                    <Field
                                      as={Input}
                                      name="name"
                                      size={{ base: 'md', md: 'lg' }}
                                      fontSize="md"
                                      placeholder={pt('name')}
                                      validate={(val: string) => {
                                        if (!val) {
                                          return 'field is require!';
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormControl
                                    flex={1}
                                    isInvalid={
                                      !!(errors.email && touched.email)
                                    }
                                  >
                                    <FormLabel
                                      visibility={'hidden'}
                                      display={{ base: 'none', md: 'block' }}
                                    >
                                      {pt('phone')}
                                    </FormLabel>

                                    <Field
                                      as={Input}
                                      name="email"
                                      placeholder={pt('phone')}
                                      size={{ base: 'md', md: 'lg' }}
                                      fontSize="md"
                                      validate={(val: string) => {
                                        if (!val) {
                                          return 'field is require!';
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Stack>
                              </GridItem>

                              <GridItem colSpan={2}>
                                <Stack
                                  w="full"
                                  mb="8px"
                                  spacing={{ base: '8px', md: '15px' }}
                                  direction={{ base: 'column', md: 'row' }}
                                >
                                  <FormControl
                                    flex={1}
                                    isInvalid={!!(errors.city && touched.city)}
                                  >
                                    <FormLabel
                                      fontWeight={{ base: 700, md: 400 }}
                                    >
                                      {pt('city')}
                                    </FormLabel>
                                    <Field
                                      as={Input}
                                      name="city"
                                      placeholder={pt('city')}
                                      size={{ base: 'md', md: 'lg' }}
                                      fontSize="md"
                                      validate={(val: string) => {
                                        if (!val) {
                                          return 'field is require!';
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormControl
                                    flex={1}
                                    isInvalid={!!(errors.zip && touched.zip)}
                                  >
                                    <FormLabel
                                      visibility={'hidden'}
                                      display={{ base: 'none', md: 'block' }}
                                    >
                                      {pt('zip')}
                                    </FormLabel>

                                    <Field
                                      as={Input}
                                      name="zip"
                                      size={{ base: 'md', md: 'lg' }}
                                      placeholder={pt('zip')}
                                      fontSize="md"
                                      validate={(val: string) => {
                                        if (!val) {
                                          return 'field is require!';
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Stack>
                                <FormControl
                                  isInvalid={
                                    !!(errors.address && touched.address)
                                  }
                                >
                                  <Field
                                    as={Input}
                                    name="address"
                                    size={{ base: 'md', md: 'lg' }}
                                    placeholder={pt('address')}
                                    fontSize="md"
                                    validate={(val: string) => {
                                      if (!val) {
                                        return 'field is require!';
                                      }
                                    }}
                                  />
                                </FormControl>
                              </GridItem>
                              <GridItem
                                colSpan={2}
                                sx={{
                                  '.tag__control': {
                                    minH: { base: '42px', md: '48px' },
                                  },
                                  '.tag__value-container': {
                                    px: '10px',
                                  },
                                  '.tag__multi-value': {
                                    minH: '24px',
                                    fontSize: '14px',
                                    fontFamily: 'PingFang SC',
                                    bg: '#d9d9d9',
                                    color: '#121212',
                                    rounded: '4px',
                                    px: '5px',
                                    fontWeight: 400,
                                  },
                                  '.tag__multi-value__remove': {
                                    color: '#121212',
                                    ms: '0',
                                    fontSize: 'sm',
                                    opacity: 1,
                                  },
                                  '.tag__menu': {
                                    rounded: '8px',
                                    boxShadow:
                                      '0px 0px 4px rgba(0, 0, 0, 0.25);',
                                  },
                                  '.tag__menu-list': {
                                    p: '10px 8px',
                                  },
                                  '.tag__option': {
                                    color: '#121212',
                                    rounded: '4px',
                                    mb: '2px',
                                    fontSize: '14px',
                                    fontFamily: 'PingFang SC',
                                    fontWeight: 400,
                                    flexDirection: 'row-reverse',
                                    justifyContent: 'space-between',
                                  },
                                  '.tag__option--is-selected': {
                                    bg: '#d9d9d9 !important',
                                  },
                                  '.tag__option--is-focused': {
                                    bg: '#ECECEC',
                                  },
                                  '.chakra-menu__icon-wrapper': {
                                    m: 0,
                                  },
                                }}
                              >
                                <FormControl
                                  isInvalid={
                                    !!(
                                      errors.token_id_list &&
                                      touched.token_id_list
                                    )
                                  }
                                >
                                  <FormLabel
                                    fontWeight={{ base: 700, md: 400 }}
                                  >
                                    {pt('selectNft')}
                                  </FormLabel>
                                  <TagSelect
                                    menuPlacement="top"
                                    classNamePrefix="tag"
                                    placeholder={pt('pleaseSelect')}
                                    isClearable={false}
                                    closeMenuOnSelect={false}
                                    isSearchable={false}
                                    hideSelectedOptions={false}
                                    selectedOptionStyle="check"
                                    name="token_id_list"
                                    options={options}
                                  />
                                </FormControl>
                              </GridItem>
                            </Grid>
                            <Button
                              mt="35px"
                              fontSize={{ base: '14px', md: '16px' }}
                              w="full"
                              h="62px"
                              variant="primary"
                              rounded="full"
                              type="submit"
                              isLoading={isSubmitting}
                            >
                              {t('confirm')}
                            </Button>
                          </Form>
                        </>
                      )}
                    </Formik>
                    <Box
                      mt="15px"
                      fontSize={'14px'}
                      lineHeight="18px"
                      textAlign={'center'}
                      color="#363636"
                    >
                      {pt('alert')}
                    </Box>
                  </Box>
                </Flex>
              </>
            )}
          </ModalBody>
          <Box
            w="150px"
            h="150px"
            rounded="full"
            pos="absolute"
            top="60px"
            left="1px"
            bg="#CAB6BD"
            filter="blur(50px)"
          />
          <Box
            w="107px"
            h="107px"
            rounded="full"
            pos="absolute"
            top="165px"
            left="173px"
            bg="#C096CE"
            filter="blur(50px)"
          />
        </ModalContent>
      </Modal>
      <BellaListingSuccessModal ref={listingSuccessModalRef} />
    </>
  );
});

const BellaListingSuccessModal = forwardRef<ModalActionRef>((props, ref) => {
  const t = useTranslations('common');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const open = async () => {
    onOpen();
  };

  const close = () => {
    onClose();
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return (
    <Modal size={{ base: 'full', md: 'md' }} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent
        maxW={{ base: 'full', md: '764px' }}
        p={{ base: '112px 20px 60px', md: '60px' }}
        bg="white"
        rounded="24px"
        overflow="hidden"
      >
        <ModalCloseButton
          top="16px"
          right="16px"
          bg="#787878"
          rounded="full"
          zIndex={1}
          color="#fff"
          fontSize="10px"
          display={{ base: 'flex', md: 'none' }}
        />
        <ModalBody p="0" color="#363636">
          <Heading color="#121212" as="h4" fontSize="32px" mb="16px">
            {t('project.listSuccess')}
          </Heading>
          <Box fontSize={'20px'} mb={{ base: '48px', md: '80px' }}>
            {t('project.successUuuDesc')}
          </Box>
          <Flex
            justify="space-between"
            direction={{ base: 'column', md: 'row' }}
          >
            <Box
              w={{ base: 'full', md: '310px' }}
              h={{ base: '194px', md: '184px' }}
              rounded="8px"
              bg="#50716B url(/images/activity/bella/listing_success_draw.svg) right center no-repeat"
              mb={{ base: '10px', md: 0 }}
              overflow="hidden"
              color="white"
              fontWeight={700}
              fontSize="24px"
              p="16px 0 0 16px"
            >
              {t('project.raffles')}
            </Box>
            <Box
              w={{ base: 'full', md: '310px' }}
              h={{ base: '194px', md: '184px' }}
              rounded="8px"
              bg="#50716B url(/images/activity/bella/listing_success_exchange.svg) right center no-repeat"
              overflow="hidden"
              color="white"
              fontWeight={700}
              fontSize="24px"
              p="16px 0 0 16px"
            >
              {t('project.redeem')}
            </Box>
          </Flex>
          <NextLink href={`/rewards`} passHref>
            <Link>
              <Button
                mt={{ base: '48px', md: '80px' }}
                fontSize={{ base: '14px', md: '16px' }}
                w="full"
                h="62px"
                rounded="full"
                variant="primary"
              >
                {t('project.viewPoints')}
              </Button>
            </Link>
          </NextLink>
        </ModalBody>
        <Box
          display={{ base: 'none', md: 'block' }}
          pos="absolute"
          top="-194px"
          right="23px"
          w="262px"
          h="262px"
          bg="#70505C"
          filter="blur(70px)"
          opacity={0.4}
        />
        <Box
          display={{ base: 'none', md: 'block' }}
          pos="absolute"
          top="0px"
          right="-140px"
          w="188px"
          h="188px"
          bg="#C5A8CF"
          filter="blur(70px)"
          opacity={0.6}
        />
      </ModalContent>
    </Modal>
  );
});

const CreditPayModal = forwardRef<ModalActionRef>((props, ref) => {
  const pt = useTranslations('bella');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const open = async () => {
    onOpen();
  };

  const close = () => {
    onClose();
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return (
    <Modal size={{ base: 'full', md: 'md' }} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent
        maxW={{ base: 'full', md: '400px' }}
        p="0"
        bg="white"
        rounded="24px"
        overflow="hidden"
      >
        <ModalCloseButton
          top="16px"
          right="16px"
          rounded="full"
          zIndex={1}
          fontSize="10px"
        />
        <ModalBody p="0" color="#363636">
          <Heading
            as="h4"
            fontSize="20px"
            p="20px"
            borderBottom={'1px solid #eee'}
          >
            {pt('creditCardPay')}
          </Heading>
          <AspectRatio ratio={{ base: 350 / 506, md: 400 / 506 }}>
            <iframe height="auto" width="auto" src={creditCardPayIframeSrc} />
          </AspectRatio>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

type FirstInModalOpenParams = {
  callback: (result: FirstInStatus) => void;
};

type FirstInModalActionRef = {
  open: (p: FirstInModalOpenParams) => void;
};

const FirstInModal = forwardRef<FirstInModalActionRef>((props, ref) => {
  const t = useTranslations('common');
  const pt = useTranslations('bella');
  const paramsRef = useRef<FirstInModalOpenParams>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const open = (p: FirstInModalOpenParams) => {
    paramsRef.current = p;
    onOpen();
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  const onChoose = (rs: FirstInStatus) => {
    onClose();
    paramsRef.current?.callback(rs);
  };

  return (
    <Modal
      size={{ base: 'full', md: 'md' }}
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay backdropFilter="blur(8px)" />
      <ModalContent
        maxW={{ base: 'full', md: '764px' }}
        p="0"
        bg="white"
        rounded="16px"
        overflow="hidden"
      >
        <ModalBody
          p="84px 20px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading
            textAlign="center"
            as="h4"
            fontSize="24px"
            color="#121212"
            mb="48px"
          >
            {pt('isFirstBuy')}
          </Heading>
          <Stack direction={{ base: 'column', md: 'row' }} spacing="32px">
            <Button
              w="240px"
              h="62px"
              variant="priamry"
              rounded="full"
              bg="#363636"
              color="white"
              onClick={() => onChoose(FirstInStatus.FirstBuy)}
            >
              {t('project.yes')}
            </Button>
            <Button
              w="240px"
              h="62px"
              variant="outline"
              borderWidth={2}
              rounded="full"
              bg="#F6F6F6"
              onClick={() => onChoose(FirstInStatus.NotFirstBuy)}
            >
              {t('project.no')}
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext) {
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
  return {
    props: {
      messages: await serverSideTranslations(locale, ['bella']),
    },
  };
}
