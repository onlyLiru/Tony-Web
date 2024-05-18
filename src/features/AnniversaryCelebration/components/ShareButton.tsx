import { Flex, useToast } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { ShareButton as CommonShareButton } from '@/features/AssetPage';
import { shareUtil } from '@/utils/share';
import useCopy from '@/hooks/useCopy';

const ShareButton = () => {
  // const t = useTranslations('teamz');
  const [_, onCopy] = useCopy();
  const toast = useToast();
  return (
    <Flex justifyContent="flex-end" pr="18px">
      <CommonShareButton
        backgroundColor="rgba(255,255,255,0.85)"
        fontSize={{ base: '22px', md: '26px' }}
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
    </Flex>
  );
};

export default ShareButton;
