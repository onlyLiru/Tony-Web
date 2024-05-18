import { Box, HStack, Center, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import { ShimmerImage } from '@/components/Image';
import logo from '../../../../public/logo_l.png';
import LocaleButton from '@/components/PageLayout/Header/LocaleButton';
import TabButton from './TabButton';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const DocsHeader = ({
  rightRender,
  leftRender,
}: {
  rightRender?: React.ReactNode;
  leftRender?: React.ReactNode;
}) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const router = useRouter();
  const t = useTranslations('docs');

  const activeTab = router.asPath.split('/')[2];

  return (
    <Box
      zIndex={99}
      position={'sticky'}
      top="0"
      left={'0'}
      right={'0'}
      bg="white"
      transition="all ease 0.2s"
      w="full"
      borderBottom="1px solid #c1c7cd"
    >
      <HStack
        justify="space-between"
        px={2}
        color="primary.main"
        w="full"
        h="60px"
        pos="relative"
        spacing={0}
      >
        <HStack>
          {leftRender}
          <ShimmerImage
            w={'28px'}
            h={'32px'}
            src={logo}
            alt="unemeta logo"
            mr={6}
          />
          <HStack hidden={!isLargerThan768}>
            <Link href={`/docs/blog/daily/0`}>
              <Center
                lineHeight="32px"
                cursor="pointer"
                fontWeight={activeTab === 'blog' ? 700 : 400}
                px={4}
              >
                {t('insights')}
              </Center>
            </Link>
            <Link href={`/docs/event/0`}>
              <Center
                lineHeight="32px"
                cursor="pointer"
                fontWeight={activeTab === 'event' ? 700 : 400}
                px={4}
              >
                {t('event')}
              </Center>
            </Link>
          </HStack>
        </HStack>
        <HStack>
          <TabButton hidden={isLargerThan768} />
          <LocaleButton />
          {rightRender}
        </HStack>
      </HStack>
    </Box>
  );
};
