import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import Image from '@/components/Image';
import NextLink from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export const ActivityBanner = (props: { zCallBack?: () => void }) => {
  const t = useTranslations('common');
  return (
    <Flex
      maxW="1440px"
      mx="auto"
      w="full"
      h={{ md: '605px', base: 'full' }}
      justify={{ base: 'center', md: 'space-between' }}
      pl={{ base: '0', md: '80px' }}
      pr={{ base: '0', md: '25px' }}
      flexDir={{ base: 'column-reverse', md: 'row' }}
      align="center"
      pos={'relative'}
      bgImage={{ md: '/images/luckDraw/banner_gift3.png', base: '' }}
      bgSize={'cover'}
      bgPosition={'right -180px bottom 0'}
      bgRepeat="no-repeat"
    >
      <VStack
        minW="50%"
        h={{ base: '150px', md: '288px' }}
        spacing={{ base: '20px', md: 0 }}
        justify="space-between"
        align={{ base: 'center', md: 'flex-start' }}
      >
        <VStack
          spacing={{ base: 3, md: 6 }}
          align={{ base: 'center', md: 'flex-start' }}
        >
          <Heading
            fontWeight={900}
            fontSize={{ base: '24px', md: '43px' }}
            noOfLines={2}
          >
            UneMeta Carnival Party is live
          </Heading>
          <Text
            fontSize={{ base: '14px', md: '28px' }}
            color="typo.sec"
            display={{ md: 'none', base: 'block' }}
            dangerouslySetInnerHTML={{
              __html: t.raw('activityBanner.content1'),
            }}
          ></Text>
          <Text
            fontWeight={'bold'}
            fontSize={{ base: '18px', md: '43px' }}
            display={{ md: 'block', base: 'none' }}
            color="typo.sec"
            dangerouslySetInnerHTML={{
              __html: t.raw('activityBanner.content'),
            }}
          />
        </VStack>
        {props.zCallBack ? (
          <Button
            rightIcon={<Icon fontSize={20} as={FiArrowUpRight} />}
            w={{ base: '170px', md: '196px' }}
            size="lg"
            variant="primary"
            fontWeight="bold"
            bg="#A57AFF"
            _hover={{
              opacity: 0.9,
            }}
            rounded="md"
            onClick={props?.zCallBack}
          >
            {t('activityBanner.btn')}
          </Button>
        ) : (
          <NextLink href={`/points`}>
            <Button
              className="Hb002"
              rightIcon={<Icon fontSize={20} as={FiArrowUpRight} />}
              w={{ base: '170px', md: '175px' }}
              size="lg"
              variant="primary"
              fontWeight="bold"
              bg="linear-gradient(to right, #f940a3, #fc5df9)"
              _hover={{
                opacity: 0.9,
              }}
              rounded="md"
            >
              {t('activityBanner.btn')}
            </Button>
          </NextLink>
        )}
      </VStack>
      {/* <Center
        pos="relative"
        flex={1}
        maxW={{ base: '208px', md: '460px' }}
        zIndex={-1}
      >
        <Image
          maxW={{ base: '235px', md: '460px' }}
          w="full"
          minW={{ base: 'auto', md: '300px' }}
          h="auto"
          objectFit={'contain'}
          src="/images/luckDraw/banner_gift.png"
          fallbackSrc={undefined}
          fallback={<Box />}
        />
        <Image
          pos="absolute"
          left={{ base: '-60px', md: '-240px' }}
          top={{ base: '40px', md: '90px' }}
          w={{ base: '70px', md: '134px' }}
          h="auto"
          objectFit={'contain'}
          src="/images/luckDraw/coin.png"
          transform="rotate(-5deg)"
          fallbackSrc={undefined}
          fallback={<Box />}
        />
        <Image
          pos="absolute"
          left={{ base: '-50px', md: '-140px' }}
          top={{ base: '130px', md: '250px' }}
          w={{ base: '40px', md: '100px' }}
          h="auto"
          objectFit={'contain'}
          src="/images/luckDraw/coin.png"
          transform="rotate(-40deg)"
          fallbackSrc={undefined}
          fallback={<Box />}
        />
        <Image
          pos="absolute"
          left={{ base: '230px', md: '-52px' }}
          top="40px"
          w={{ base: '30px', md: '52px' }}
          h="auto"
          objectFit={'contain'}
          src="/images/luckDraw/coin.png"
          filter="blur(5px)"
          fallbackSrc={undefined}
          fallback={<Box />}
        />
      </Center> */}
      <Image
        src={'/images/luckDraw/m_banner_gift.png'}
        w={'full'}
        h={'235px'}
        mb={'15px'}
        display={{ md: 'none', base: 'block' }}
        objectFit={'cover'}
      />
    </Flex>
  );
};
