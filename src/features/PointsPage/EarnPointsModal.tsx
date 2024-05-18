import React, { forwardRef, useImperativeHandle, memo } from 'react';
import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  Tag,
  TagLeftIcon,
  TagLabel,
  Box,
  Image,
  HStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useUserDataValue } from '@/store';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';

export type EarnPointsModalRef = {
  open: () => void;
};

type EarnType = {
  key: string;
  value: string | number;
  url: string;
  hidden?: boolean;
};

const Itmes = ({ data }: { data: EarnType }) => {
  // const t = useTranslations('points');
  return (
    <NextLink href={data.url}>
      <HStack
        px={{ md: '25px', base: '20px' }}
        w="full"
        h="50px"
        // minH='100px
        rounded={{ md: '10px', base: '8px' }}
        border="0.5px solid rgba(0, 0, 0, 0.2)"
        bgColor="#fff"
        justify="space-between"
        cursor="pointer"
      >
        <Box fontWeight={'600'} color={'#1D1B23'} fontSize={'13px'} w={'180px'}>
          {data?.key}
        </Box>
        <Tag
          bg={'rgba(112, 101, 240, 0.1)'}
          h={'28px'}
          borderRadius={'4px'}
          color={'#7065F0'}
          justifyContent={'center'}
          w={'82px'}
        >
          {!data.hidden && <TagLeftIcon boxSize="8px" as={AddIcon} m={0} />}
          <TagLabel fontWeight={'500'} fontSize={'14px'}>
            {data.value}
          </TagLabel>
        </Tag>

        {/* <Button
          className="Re004"
          bg={'primary.main'}
          fontWeight={'600'}
          borderRadius={'300px'}
          color={'#FFFFFF'}
          fontSize={'13px' }
          w={'90px'}
          h={'28px'}
          _hover={{ bg: 'primary.main', opacity: 0.8 }}
        >
          {t('toGetIt')}
        </Button> */}
        <Image src="/images/points/arrows.png" w="8px" h="14px" />
      </HStack>
    </NextLink>
  );
};

export const EarnPointsModal = forwardRef((props, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userData = useUserDataValue();
  const { address } = useAccount();
  const t = useTranslations('points');
  const ct = useTranslations('common');
  let earnTypeList = [];
  if (address) {
    earnTypeList = [
      {
        key: 'Listed',
        value: 20,
        url: userData?.wallet_address
          ? `/user/${userData?.wallet_address}?bulkList=true`
          : '/login',
      },
      {
        key: ct('buy'),
        value: 20,
        url: userData?.wallet_address ? `/explore` : '/login',
      },
    ];
  } else {
    earnTypeList = [
      { key: 'Login', value: 20, url: '/login' },
      {
        key: 'Listed',
        value: 20,
        url: userData?.wallet_address ? `/explore` : '/login',
      },
    ];
  }

  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
    },
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.400" />
      <ModalContent
        mx={{ md: 0, base: '4vw' }}
        w={{ md: '600px', base: 'full' }}
        maxW={{ md: '600px' }}
        p={{ md: '40px', base: '20px 20px 36px' }}
        fontFamily={'Inter'}
      >
        <ModalHeader
          p={0}
          color={'#000000'}
          fontSize={{ md: '24px', base: '16px' }}
        >
          {t('earnPoints')}
        </ModalHeader>
        <ModalBody p={0} mt={{ md: '35px', base: '26px' }}>
          {earnTypeList.map((item, idx) => (
            <Itmes data={item} key={idx} />
          ))}
        </ModalBody>
        <ModalCloseButton color={'#B5B5B5'} />
      </ModalContent>
    </Modal>
  );
});

export const EarnPointList = memo(() => {
  const t = useTranslations('points');
  const userData = useUserDataValue();
  const ct = useTranslations('common');

  let earnTypeList = [];
  if (userData?.wallet_address) {
    earnTypeList = [
      // {
      //   key: t('HanazawaDec'),
      //   value: 1000,
      //   url: userData?.wallet_address ? `/projects/hanazawa` : '/login',
      // },
      {
        key: t('tr'),
        value: `NFT ${ct('price')}`,
        hidden: true,
        url: userData?.wallet_address ? `/explore` : '/login',
      },
    ];
  } else {
    earnTypeList = [
      { key: 'Login', value: 100, url: '/login' },
      // {
      //   key: t('HanazawaDec'),
      //   value: 1000,
      //   url: userData?.wallet_address ? `/projects/hanazawa` : '/login',
      // },
      {
        key: t('tr'),
        value: `NFT ${ct('price')}`,
        hidden: true,
        url: userData?.wallet_address ? `/explore` : '/login',
      },
    ];
  }
  return (
    <>
      {earnTypeList.map((item, idx) => (
        <Itmes data={item} key={idx} />
      ))}
    </>
  );
});
