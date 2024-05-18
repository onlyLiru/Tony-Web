import { Box, Flex, Text } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import 'keen-slider/keen-slider.min.css';

export const QuestionAndAnswer = () => {
  const t = useTranslations('teamz') as any;

  return (
    <Box
      boxSizing="content-box"
      bgImage="url('/images/teamz/HowToUseNFTickets/bg.png')"
      bgSize={{ base: '100% 375px', md: 'cover' }}
      justifyContent="space-around"
      paddingY={{
        md: '60px',
        lg: '100px',
        xl: '110px',
        '2xl': '120px',
        base: '43px',
      }}
      paddingX={{
        md: '100px',
        lg: '160px',
        xl: '160px',
        '2xl': '240px',
        base: '40px',
      }}
    >
      {/* WEB3 SPEAKER标题 */}
      <Text
        fontSize={{ md: '40px', lg: '50px', xl: '60px', base: '30px' }}
        fontWeight={'Bold'}
        textAlign="center"
        color="#AAFF01"
      >
        Q&A
      </Text>
      <Box
        w="100%"
        maxW={1432}
        margin="0 auto"
        mt={{ md: '45px', lg: '65px', xl: '84px', base: '25px' }}
        fontSize={{ md: '16px', lg: '16px', xl: '20px', base: '12px' }}
      >
        <Box>
          <Flex color="#AAFF01">
            <Text>Q</Text>
            <Text ml="32px">{t('Question1')}</Text>
          </Flex>
          <Flex color="white" mt={8}>
            <Box
              width="8px"
              height="8px"
              borderRadius="8px"
              backgroundColor="#7F7F80"
            ></Box>
            <Text ml="32px">{t('Answer1')}</Text>
          </Flex>
        </Box>

        <Box mt={{ md: '70px', lg: '50px', xl: '90px', base: '30px' }}>
          <Flex color="#AAFF01">
            <Text>Q</Text>
            <Text ml="32px">{t('Question2')}</Text>
          </Flex>
          <Flex color="white" mt={6}>
            <Box
              width="8px"
              height="8px"
              borderRadius="8px"
              backgroundColor="#7F7F80"
            ></Box>
            <Text ml="32px">{t('Answer2')}</Text>
          </Flex>
        </Box>

        {/* <Box mt={{ md: '70px', lg: '50px', xl: '90px', base: '30px' }}>
          <Flex color="#AAFF01">
            <Text>Q</Text>
            <Text ml="32px">{t('Question3')}</Text>
          </Flex>
          <Flex color="white" mt={6} alignItems="baseline">
            <Box
              width="8px"
              height="8px"
              borderRadius="8px"
              backgroundColor="#7F7F80"
            ></Box>
            <Text ml="32px" flex="1">
              {t('Answer3_1')}
            </Text>
          </Flex>
          <Flex color="white" mt={6} alignItems="baseline">
            <Box
              width="8px"
              height="8px"
              borderRadius="8px"
              backgroundColor="#7F7F80"
            ></Box>
            <Text ml="32px" flex="1">
              {t('Answer3_2')}
            </Text>
          </Flex>
          <Flex color="white" mt={6} alignItems="baseline">
            <Box
              width="8px"
              height="8px"
              borderRadius="8px"
              backgroundColor="#7F7F80"
            ></Box>
            <Text ml="32px" flex="1">
              {t('Answer3_3')}
            </Text>
          </Flex>
          <Flex color="white" mt={6} alignItems="baseline">
            <Box
              width="8px"
              height="8px"
              borderRadius="8px"
              backgroundColor="#7F7F80"
            ></Box>
            <Text ml="32px" flex="1">
              {t('Answer3_4')}
            </Text>
          </Flex>
          <Flex color="white" mt={6} alignItems="baseline">
            <Box
              width="8px"
              height="8px"
              borderRadius="8px"
              backgroundColor="#7F7F80"
            ></Box>
            <Text ml="32px" flex="1">
              {t('Answer3_5')}
            </Text>
          </Flex>
        </Box> */}

        <Box mt={{ md: '70px', lg: '50px', xl: '90px', base: '30px' }}>
          <Flex color="#AAFF01">
            <Text>Q</Text>
            <Text ml="32px">{t('Question4')}</Text>
          </Flex>
          <Flex color="white" mt={6}>
            <Box
              width="8px"
              height="8px"
              borderRadius="8px"
              backgroundColor="#7F7F80"
            ></Box>
            <Text ml="32px">{t('Answer4')}</Text>
          </Flex>
        </Box>

        <Box mt={{ md: '70px', lg: '50px', xl: '90px', base: '30px' }}>
          <Flex color="#AAFF01">
            <Text>Q</Text>
            <Text ml="32px">{t('Question5')}</Text>
          </Flex>
          <Flex color="white" mt={6}>
            <Box
              width="8px"
              height="8px"
              borderRadius="8px"
              backgroundColor="#7F7F80"
            ></Box>
            <Text ml="32px">{t('Answer5')}</Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
