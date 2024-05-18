import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import Image from '@/components/Image';
import ShareButton from './components/ShareButton';
import { ShareButton as CommonShareButton } from '@/features/AssetPage';
import { useTranslations } from 'next-intl';
import { shareUtil } from '@/utils/share';
import useCopy from '@/hooks/useCopy';

export const Share = (props: any) => {
  const t = useTranslations('anniversary');
  const [_, onCopy] = useCopy();
  const toast = useToast();
  const { clientHeight = 0 } = props;
  return (
    <Flex
      direction="column"
      position="relative"
      overflow="auto"
      height={`${clientHeight}px`}
      backgroundImage={`url('/images/anniversary/bg.jpeg')`}
      backgroundSize="100% 100%"
      color="white"
    >
      <ShareButton />
      <Text
        mt="32px"
        fontSize="30px"
        fontWeight="bold"
        textAlign="center"
        background="linear-gradient(180deg, rgba(255,255,255,0.46) 0%, #FFFFFF 100%)"
        backgroundClip="text"
        sx={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        UneMeta Anniversary
      </Text>
      <Flex mt="95px" justifyContent="center">
        <Image
          src="/images/anniversary/share-left.png"
          alt=""
          w="125px"
          h="125px"
        />
        <Image
          src="/images/anniversary/share-right.png"
          alt=""
          w="125px"
          h="125px"
        />
      </Flex>
      <Box
        mt="48px"
        lineHeight="32px"
        p="0 60px"
        textAlign="center"
        fontSize="16px"
        color="rgba(255,255,255,0.8)"
      >
        <Text>{t('page7Line1')}</Text>
        <Text>{t('page7Line2')}</Text>
        <Text>{t('page7Line3')}</Text>
        <Text>......</Text>
      </Box>
      {/* 连接钱包的按钮 */}
      <Box w="full" p="0 38px" mt="56px" position="relative">
        <CommonShareButton
          // visibility="hidden"
          opacity="0"
          position="absolute"
          width="calc(100% - 86px)"
          height="100%"
          onTwitter={() => {
            window.open(
              shareUtil.getTwitterShareUrl({
                url: window.location.href,
                text: `🦊🎂 UneMeta is 1️⃣ year old! I'm participating in UneMeta's Anniversary Carnival, where you can share a total prize pool of $47,000 by completing simple tasks😍, and there are special rewards for New Users.🏃Event ending soon, let's go!!!👇`,
              }),
              '_blank',
            );
          }}
          onCopy={async () => {
            await onCopy(location.href);
            toast({
              status: 'success',
              title: 'Link Copied!',
              variant: 'subtle',
            });
          }}
        />
        <Box
          w="full"
          h="42px"
          lineHeight="42px"
          textAlign="center"
          backgroundColor="#FB9D42"
          borderRadius="8px"
          fontWeight="bold"
          color="black"
        >
          {t('shareButtonTip')}
        </Box>
      </Box>
      <Text mt="24px" textAlign="center" color="rgba(255,255,255,0.8)">
        {t('shareSuccessTip')}
      </Text>
    </Flex>
  );
};
