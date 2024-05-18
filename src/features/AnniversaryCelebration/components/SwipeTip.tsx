import { Flex, Text } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { ArrowUpIcon } from '@chakra-ui/icons';

const ShareButton = (props: any) => {
  const t = useTranslations('anniversary');
  return (
    <Flex
      {...props}
      w="full"
      position="absolute"
      bottom="18px"
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <ArrowUpIcon fontSize="10px" />
      <Text fontSize="12px" color="rgba(255,255,255,0.4)">
        {t('swipeUp')}
      </Text>
    </Flex>
  );
};

export default ShareButton;
