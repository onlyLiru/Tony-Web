import { Box, Text, Stack } from '@chakra-ui/react';
import Image from '@/components/Image';
import { useTranslations } from 'next-intl';

export const AboutTeamz = (props: any) => {
  const t = useTranslations('teamz');
  return (
    <Stack
      alignItems="center"
      direction={['column', 'row']}
      bgImage="url('/images/teamz/teamzBg.png')"
      bgSize={{ base: '100% 375px', md: 'cover' }}
      justifyContent="space-between"
      w={'full'}
      paddingX={{ md: '232px', base: '25px' }}
      paddingY={{ md: '232px', base: '50px' }}
      spacing={{ md: '104px', base: '0' }}
    >
      <Image
        src="/images/teamz/teamz.png"
        alt=""
        w={{ md: '616px', base: '240px' }}
        h={{ md: '616px', base: '240px' }}
        border="2px dashed grey"
        order={{ md: 1, base: 2 }}
        mt={{ md: '0', base: '66px' }}
      />
      <Box order={{ md: 2, base: 1 }}>
        <Text
          fontSize={{ md: '60px', base: '30px' }}
          fontWeight={'Bold'}
          color="#AAFF01"
          textAlign="center"
          mb={{ md: '87px', base: '24px' }}
        >
          {t('whatisTEAMZ')}
        </Text>
        <Text
          fontSize={{ md: '20px', base: '12px' }}
          color="#fff"
          textAlign="center"
        >
          {t('teamzInfo')}
        </Text>
      </Box>
    </Stack>
  );
};
