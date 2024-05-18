import { Box, Flex, Text } from '@chakra-ui/react';
import Image from '@/components/Image';
import { useTranslations } from 'next-intl';
import ShareButton from './components/ShareButton';
import SwipeTip from './components/SwipeTip';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Login = (props: any) => {
  // const t = useTranslations('teamz');
  const { clientHeight = 0 } = props;
  return (
    <Flex
      direction="column"
      position="relative"
      overflow="auto"
      height={`${clientHeight}px`}
      paddingTop="12px"
      backgroundImage={`url('/images/anniversary/bg.jpeg')`}
      backgroundSize="100% 100%"
    >
      <ShareButton />
      <Text
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
        UneMeta One-Year Anniversary Celebration
      </Text>
      <Image
        src="/images/anniversary/login-logo.png"
        alt=""
        w="248px"
        h="auto"
        m="0 auto"
        mt="46px"
      />
      {/* 连接钱包的按钮 */}
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <Box w="full" p="0 38px" mt="70px">
            <Box
              w="full"
              h="42px"
              lineHeight="42px"
              textAlign="center"
              backgroundColor="#FB9D42"
              borderRadius="8px"
              fontWeight="bold"
              onClick={() => {
                openConnectModal();
              }}
            >
              Connect Wallet
            </Box>
          </Box>
        )}
      </ConnectButton.Custom>

      {/* 滑动的提示文案 */}
      <SwipeTip />
    </Flex>
  );
};
