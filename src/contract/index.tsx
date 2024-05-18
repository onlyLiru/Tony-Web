import '@rainbow-me/rainbowkit/styles.css';
import React from 'react';
import { createClient, configureChains, WagmiConfig } from 'wagmi';
import * as chain from 'wagmi/chains';
import {
  connectorsForWallets,
  getDefaultWallets,
  lightTheme,
  darkTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  okxWallet,
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import { isProd, isPre } from '@/utils';
import { jwtHelper } from '@/utils/jwt';
import { bitgetWallet } from './wallets/bitget';
import { tokenPocketWallet } from './wallets/tokenPocket';
import { beraMainnet, beraTestnet } from './bera';
// import { metaMaskWallet } from './wallets/metaMask';
// export const etherTestNet = chain.goerli;
export const etherTestNet = chain.sepolia;

export const supportChains: chain.Chain[] =
  isProd || isPre
    ? [chain.mainnet, chain.bsc, beraMainnet]
    : [etherTestNet, { ...chain.bscTestnet, name: 'BSC Test' }, beraTestnet];

const { chains, provider } = configureChains(supportChains, [
  infuraProvider({ apiKey: '9e062cba216d4a08be2923d2ef65e23a' }),
  publicProvider(),
]);

const projectId = 'b0145d0509815283e2e7ce0c68f50ed0';

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [okxWallet({ chains, projectId })],
  },
  {
    groupName: 'Popular',
    wallets: [
      bitgetWallet({ chains, projectId }),
      tokenPocketWallet({ chains, projectId }),
      metaMaskWallet({ chains, projectId }),
      coinbaseWallet({ chains, appName: 'UneMeta' }),
      walletConnectWallet({ chains, projectId }),
    ],
  },
]);
// Set up client
const wagmiClient = createClient({
  autoConnect: !!jwtHelper.getToken(),
  connectors,
  provider,
});

export const WagmiConfigProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider
      // theme={lightTheme({
      //   accentColor: '#14141f',
      // })}
      theme={darkTheme()}
      chains={chains}
    >
      {children}
    </RainbowKitProvider>
  </WagmiConfig>
);
