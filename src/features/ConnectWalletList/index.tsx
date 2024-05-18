/**
 * 钱包登录按钮列表
 */

import {
  Box,
  Button,
  Link,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { useConnect } from 'wagmi';
import { useMounted } from '@/hooks/useMounted';
import { ConnectorLogo } from './ConnectorLogo';

export const ConnectWalletList = () => {
  const isMounted = useMounted();
  const toast = useToast();
  const { connect, isLoading, connectors, pendingConnector } = useConnect({
    onSuccess: () => {
      toast({
        status: 'success',
        title: 'Wallet Connected!',
        variant: 'subtle',
      });
    },
    onError: (error) => {
      toast({ status: 'warning', title: error?.message, variant: 'subtle' });
    },
  });

  return (
    <>
      <Text mb={5} fontSize={'lg'} fontWeight={500}>
        If you don't have a{' '}
        <Tooltip
          hasArrow
          placement="top"
          p={3}
          bg="primary.main"
          rounded="xl"
          textAlign={'center'}
          offset={[0, 15]}
          label="A crypto wallet is an application or hardware device that allows individuals to store and retrieve digital items."
        >
          <Link
            color="accent.blue"
            href="https://metamask.io/"
            target="_blank"
            rel="noreferrer"
          >
            wallet
          </Link>
        </Tooltip>{' '}
        yet, you can select a provider and create one now.
      </Text>
      <Stack spacing={5}>
        {isMounted &&
          connectors.map((connector) => {
            const loading = isLoading && connector.id === pendingConnector?.id;
            return (
              <Button
                bg="gray.100"
                size="xl"
                px={5}
                disabled={!connector.ready}
                key={connector.id}
                leftIcon={<ConnectorLogo id={connector.id} />}
                onClick={() => {
                  connect({ connector });
                }}
                rightIcon={loading ? <Spinner /> : <div />}
              >
                <Box w="full" textAlign={'left'}>
                  {connector.name}
                  {!connector.ready && ' (unsupported)'}
                </Box>
              </Button>
            );
          })}
      </Stack>
    </>
  );
};
