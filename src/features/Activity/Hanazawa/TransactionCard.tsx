import { Box, Flex, Text, Heading, VStack } from '@chakra-ui/react';
import Image from '@/components/Image';
import { useTranslations } from 'next-intl';

export const TransactionCard = () => {
  const t = useTranslations('hz');

  return (
    <Flex
      mx="auto"
      maxW={{ base: 'full', md: '1220px' }}
      bg={{
        md: 'linear-gradient(to left, #1B1C33 0%, #1D1832 100%)',
        base: 'transparent',
      }}
      rounded="md"
      p={{ md: '50px', base: 0 }}
      mb="71px"
      justify="center"
    >
      <Flex
        justify={{ md: 'space-between', base: 'center' }}
        maxW="1000px"
        w="full"
      >
        <Image
          w="340px"
          h="190px"
          mr={5}
          display={{ md: 'block', base: 'none' }}
          src={'/images/activity/hanazawa/notice.png'}
          fallbackSrc={undefined}
          fallback={<Box h="190px" />}
        />
        <VStack
          flex={1}
          maxW="584px"
          fontSize={{ md: 'md', base: '12px' }}
          letterSpacing="1px"
          spacing={4}
          pt={{ md: 0, base: '30px' }}
        >
          <Box p={{ md: '0', base: '0 30px' }}>
            <Heading
              fontSize="30px"
              lineHeight="36px"
              fontWeight={600}
              color="#6F9FF3"
              mb={3}
            >
              Airdrop
            </Heading>
            <Text fontSize="16px" lineHeight="24px" color="white">
              {t('airdrop')}
            </Text>
          </Box>
          <Box p={{ md: '0', base: '0 30px' }}>
            <Heading
              fontSize="30px"
              lineHeight="36px"
              fontWeight={600}
              color="#6F9FF3"
              mb={3}
            >
              Hanazawa Kana’s Autograph
            </Heading>
            <Text fontSize="16px" lineHeight="24px" color="white">
              {t('autograph')}
            </Text>
          </Box>
        </VStack>
      </Flex>
    </Flex>
  );
};
