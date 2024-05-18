/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { isProd } from '@/utils';
import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from '@rainbow-me/rainbowkit';

import { OkxWalletConnector } from './okxConnector';

export interface MyWalletOptions {
  chains: Chain[];
  shimDisconnect?: boolean;
  shimChainChangedDisconnect?: boolean;
}

function isOkx(ethereum: NonNullable<(typeof window)['okxwallet']>) {
  // Logic borrowed from wagmi's MetaMaskConnector
  // https://github.com/tmm/wagmi/blob/main/packages/core/src/connectors/metaMask.ts
  const isOkx = Boolean(ethereum.isOkxWallet) || Boolean(ethereum.isOKExWallet);

  if (!isOkx) {
    return false;
  }

  return true;
}

export const okxWallet = ({
  chains,
  shimDisconnect,
}: MyWalletOptions): Wallet => {
  const isOkxInjected =
    typeof window !== 'undefined' &&
    (typeof window.okxwallet !== 'undefined' ||
      typeof window.okexchain !== 'undefined') &&
    isOkx(window.okxwallet! || window.okexchain);

  const shouldUseWalletConnect = !isOkxInjected;

  return {
    id: 'okxWallet',
    name: 'OKX Wallet',
    iconUrl: 'https://static.okx.com/cdn/assets/imgs/226/EB771F0EE8994DD5.png',
    iconBackground: '#000',
    installed: !shouldUseWalletConnect ? isOkxInjected : undefined,
    downloadUrls: {
      browserExtension:
        'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
      android: 'https://www.okx.com/download',
      ios: 'https://www.okx.com/download',
      qrCode: 'https://www.okx.com/download',
    },
    createConnector: () => {
      const connector = getWalletConnectConnector({
        chains,
        projectId: 'b0145d0509815283e2e7ce0c68f50ed0',
      });
      // const connector = shouldUseWalletConnect
      //   ? getWalletConnectConnector({
      //       chains,
      //       projectId: 'b0145d0509815283e2e7ce0c68f50ed0',
      //     })
      //   : (new OkxWalletConnector({
      //       chains: chains as any,
      //       // options: {
      //       //   shimDisconnect,
      //       // },
      //     }) as any);

      const getMobileUri = async () => {
        return `okx://wallet/dapp/details?dappUrl=${
          isProd ? 'https://unemeta.com' : 'https://test.unemeta.com'
        }`;
      };

      const getUri = async () => {
        await connector.getProvider();

        return new Promise((resolve) => {
          connector.once('message', (event) => {
            if (event.type === 'display_uri') {
              resolve(event.data);
            }
          });
        });
      };

      return {
        connector,
        mobile: shouldUseWalletConnect
          ? {
              getUri: getMobileUri,
            }
          : undefined,
        qrCode: shouldUseWalletConnect
          ? {
              getUri,
            }
          : undefined,
      };
    },
  };
};
