import { Box, Text, HStack, Stack, Link } from '@chakra-ui/react';
import { ShimmerImage } from '@/components/Image';
import { useTranslations } from 'next-intl';

export const CharacterDesign = () => {
  const t = useTranslations('cpt');

  return (
    <Box
      bg="url(/images/activity/cpt/design_bg.png)"
      pt={{ md: '89px', base: '34px' }}
      pb={{ md: '160px', base: '24px' }}
    >
      <Text
        w="full"
        textAlign="center"
        fontSize={{ md: '64px', base: '24px' }}
        color="#fff"
        bg="#fff"
        fontWeight={800}
        lineHeight={{ md: '74px', base: '30px' }}
        sx={{
          WebkitTextStroke: '1px #000000',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Character design
      </Text>
      <Stack
        direction={{ md: 'row', base: 'column' }}
        mt={{ md: '130px', base: '27px' }}
        spacing={{ md: '119px', base: '26px' }}
        justify="center"
        px={{ md: '20px', base: '16px' }}
        align={{ md: 'flex-start', base: 'center' }}
      >
        <ShimmerImage
          w={{ md: '480px', base: '173px' }}
          h={{ md: '472px', base: '171px' }}
          src="/images/activity/cpt/avatar.png"
        />
        <Box
          flex={1}
          maxW="900px"
          color="#fff"
          pt={{ md: '0px', base: '0' }}
          fontFamily={'Helvetica Neue'}
          fontSize={{ md: '28px', base: '16px' }}
          lineHeight={{ md: '56px', base: '20px' }}
          textAlign={{ md: 'left', base: 'center' }}
        >
          <Text
            fontSize={{ md: '40px', base: '16px' }}
            lineHeight={{ md: '48px', base: '20px' }}
            fontWeight={700}
            mb={{ md: '30px', base: '20px' }}
          >
            {t('introduceTitle')}
          </Text>
          <Text fontWeight={400} mb={{ md: '40px', base: '24px' }} flex={1}>
            {t('introduceContent')}
          </Text>
          <HStack
            spacing={{ md: '16px', base: '10px' }}
            justify={{ md: 'flex-start', base: 'center' }}
          >
            <Text>Twitter:</Text>
            <Link href="https://twitter.com/peloringirl">
              <Text color={'#F0B2F1'}>https://twitter.com/peloringirl</Text>
            </Link>
          </HStack>
          <HStack
            spacing={{ md: '16px', base: '10px' }}
            justify={{ md: 'flex-start', base: 'center' }}
          >
            <Text>Instagram:</Text>
            <Link href="https://www.instagram.com/peloringirl/">
              <Text color={'#F0B2F1'}>
                https://www.instagram.com/peloringirl/
              </Text>
            </Link>
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
};
