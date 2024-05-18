import {
  Box,
  Container,
  Text,
  HStack,
  IconButton,
  Icon,
  ButtonGroup,
  ButtonGroupProps,
  Flex,
  BoxProps,
} from '@chakra-ui/react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import { useTranslations } from 'next-intl';
import { ShimmerImage } from '@/components/Image';

export const FooterSocialButtons = (props: ButtonGroupProps) => (
  <ButtonGroup spacing={4} justifyContent="flex-end" {...props}>
    <IconButton
      aria-label=""
      bg="none"
      icon={<Icon as={AiFillInstagram} fontSize={28} />}
    />
    <IconButton
      aria-label=""
      bg="none"
      icon={<Icon as={FaTwitter} fontSize={24} />}
    />
    <IconButton
      aria-label=""
      bg="none"
      icon={<Icon as={FaDiscord} fontSize={24} />}
    />
  </ButtonGroup>
);

export default (props?: BoxProps) => {
  const t = useTranslations('common');
  return (
    <Box
      // bg="linear-gradient(92.64deg, #A29AFF 1.95%, #A29AFF 101.86%);"
      bg="#000"
      color="primary.main"
      {...props}
    >
      <Container
        fontSize={{ base: '13px', md: '16px' }}
        color={'#FFFFFF'}
        maxW={{ md: '1440px', base: '100%' }}
        py={{ base: '46px', md: '66px' }}
        fontFamily={'Inter'}
        px={{ base: '0', md: '80px' }}
        justifyContent={'center'}
      >
        <HStack justify={'center'}>
          <ShimmerImage
            src={'/logo_text_white.png'}
            w={{ base: '100px', md: '140px' }}
            h={{ base: '14.5px', md: '20px' }}
            mb={{ base: '10px', md: '16px' }}
          />
        </HStack>
        <Flex justify={'center'} align={'center'}>
          <HStack spacing={{ base: 2, md: 4 }} lineHeight={'24px'}>
            <Text>Copyright 2024 UneMeta</Text>
            <Text>|</Text>
            <Text>{t('footer.copyright2')}</Text>
          </HStack>
          {/* <HStack fontWeight={'600'} spacing={{ md: '36px' }}>
            <Link>About Us</Link>
            <Link>Contract Us</Link>
            <Link href="/docs/">Our Blog</Link>
            <Link>Discover</Link>
          </HStack> */}
        </Flex>
        <HStack spacing={4} justify={'center'} mt={'12px'}>
          <a
            href="https://twitter.com/UneWeb3"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/home/30_1.png"
              alt="twitter"
              width={'30px'}
              height={'30px'}
            />
          </a>
          <a
            href="https://discord.com/invite/YzztkC6ENe"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/home/30_04.png"
              alt="discord"
              width={'30px'}
              height={'30px'}
            />
          </a>
          <a
            href="https://www.youtube.com/channel/UCvYWUqizAdr0MLBRuAdGixQ"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/home/30_07.png"
              alt="youtube"
              width={'30px'}
              height={'30px'}
            />
          </a>
          <a
            href="mailto:UneMeta_JP@outlook.com"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/home/30_02.png"
              alt="email"
              width={'30px'}
              height={'30px'}
            />
          </a>
          <a
            href=" https://www.instagram.com/unemeta.verse/ "
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/home/30_06.png"
              alt="ins: "
              width={'30px'}
              height={'30px'}
            />
          </a>
          {/* <a
            href=" https://www.threads.net/@unemeta.verse "
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://res.cloudinary.com/unemeta/image/upload/v1689684649/dm30ro98zir3dcdwl0no.png"
              alt="ins: "
              width={'30px'}
              height={'30px'}
            />
          </a> */}
        </HStack>
        <HStack justify={'center'} mt={'8px'}>
          <Box fontWeight={'500'}>Audited By</Box>
          <ShimmerImage
            src={'/sl.png'}
            w={{ base: '90px', md: '120px' }}
            h={{ base: '30px', md: '40px' }}
          />
        </HStack>
      </Container>
    </Box>
  );
};
