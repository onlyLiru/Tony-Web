import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import router from 'next/router';
import { useTranslations } from 'next-intl';
import BannerImageCard from './components/BannerImageCard';
import mainBannerImg from '../../../public/images/common/huaze3.png';

export const HanazawaBanner = (props: any) => {
  const t = useTranslations('index');
  const ct = useTranslations('common');

  return (
    <Box
      cursor="pointer"
      pb={{ base: '10px', md: 0 }}
      pt={{ base: 0, md: '40px' }}
      onClick={() => {
        router.push('/projects/hanazawa');
      }}
      {...props}
    >
      <Flex
        pos={'relative'}
        zIndex={2}
        w="full"
        maxW="1440px"
        mx="auto"
        pr={{ base: 8, md: '120px' }}
        pl={{ base: 8, md: '80px' }}
        pt={{ base: 8, md: 0 }}
        justify="space-between"
        direction={{ base: 'column-reverse', md: 'row' }}
      >
        <VStack
          minH={{ base: '150px', md: '288px' }}
          direction="column"
          justify="space-between"
          my="auto"
          align={{ base: 'center', md: 'flex-start' }}
          spacing={0}
        >
          <VStack
            align={{ base: 'center', md: 'flex-start' }}
            textAlign={{ base: 'center', md: 'left' }}
            spacing={{ base: 2, md: 6 }}
            fontFamily="Inter"
          >
            <Flex
              flexDirection={{ md: 'column', base: 'row' }}
              fontSize={{ base: '20px', md: '54px' }}
            >
              <Heading
                fontWeight={900}
                color="#D56EA0"
                fontSize={{ base: '18.5px', md: '54px' }}
              >
                Second Dimension
              </Heading>
              <Heading
                fontWeight={600}
                color="#000000"
                fontSize={{ base: '18.5px', md: '54px' }}
                ml={{ md: 0, base: 2 }}
              >
                {t('unfolds')}
              </Heading>
            </Flex>
            <Box
              color="#000000"
              maxW={{ base: 'full', md: '600px' }}
              fontSize={{ base: '14px', md: '22px' }}
              lineHeight={{ base: '20px', md: '40px' }}
            >
              {t('banner.huaze.content')}
            </Box>
          </VStack>

          <Button
            className="Hb001"
            // rightIcon={<Icon fontSize={20} as={FiArrowUpRight} />}
            w={{ base: '170px', md: '188px' }}
            size="lg"
            fontWeight="bold"
            variant="primary"
            rounded="md"
            border={'1px solid #000000;'}
            bg="#FFFFFF"
            color="#000000"
            m={{
              md: '64px 0 35px !important',
              base: '15px 0 22px !important',
            }}
            _hover={{ bg: '#FFFFFF' }}
          >
            SOLD OUT
          </Button>

          <Flex
            flexDirection={{ md: 'row', base: 'column' }}
            color={'#777E90'}
            fontWeight={'500'}
            fontSize={{ md: '22px', base: '14px' }}
            borderLeft={{ base: '2px solid #D56EA0', md: 'none' }}
            pl={{ md: 0, base: '13px' }}
          >
            <HStack
              pl={'15px'}
              borderLeft={{ md: '2px solid #D56EA0', base: 'none' }}
            >
              <Text>{t('project')}: </Text>
              <Text color={'rgba(0, 0, 0, 1)'}>Hanazawa Kana NFT</Text>
            </HStack>
            <HStack
              ml={{ md: '60px', base: 0 }}
              pl={'15px'}
              borderLeft={{ md: '2px solid #D56EA0', base: 'none' }}
              mt={{ base: '6px', md: 0 }}
            >
              <Text>{ct('supply')}: </Text>
              <Text color={'rgba(0, 0, 0, 1)'}>6411</Text>
            </HStack>
          </Flex>
        </VStack>
        <Center
          ml={{ base: 0, md: 10 }}
          mb={{ base: 5, md: 0 }}
          flex={{ base: '1', md: '0 0 420px' }}
          pb={{ base: 0, md: 20 }}
          pt={{ base: 0, md: '25px' }}
        >
          <BannerImageCard
            img={mainBannerImg}
            status="end"
            bgc="rgba(63, 104, 128, 0.3)"
          />
        </Center>
      </Flex>
    </Box>
  );
};
