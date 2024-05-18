/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { InjectedConnector } from 'wagmi/connectors/injected';
import { isProd } from '@/utils';
import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from '@rainbow-me/rainbowkit';
import { getWalletConnectUri } from './getWalletConnectUri';

export interface MyWalletOptions {
  chains: Chain[];
  shimDisconnect?: boolean;
  projectId?: string;
  shimChainChangedDisconnect?: boolean;
}

export const bitgetWallet = ({
  chains,
  projectId,
  walletConnectVersion = '2',
}: MyWalletOptions): Wallet => {
  const isBitgetInjected =
    typeof window !== 'undefined' &&
    // @ts-expect-error
    window.bitkeep !== undefined &&
    // @ts-expect-error
    window.bitkeep.ethereum !== undefined &&
    // @ts-expect-error
    window.bitkeep.ethereum.isBitKeep === true;

  const shouldUseWalletConnect = !isBitgetInjected;

  return {
    id: 'bitget',
    name: 'Bitget Wallet',
    iconUrl: '/images/login/Bitget.png',
    iconAccent: '#f6851a',
    iconBackground: '#000',
    installed: !shouldUseWalletConnect ? isBitgetInjected : undefined,
    downloadUrls: {
      android: 'https://web3.bitget.com/en/wallet-download?type=0',
      ios: 'https://apps.apple.com/app/bitkeep/id1395301115',
      mobile: 'https://web3.bitget.com/en/wallet-download?type=2',
      qrCode: 'https://web3.bitget.com/en/wallet-download',
      chrome:
        'https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak',
      browserExtension: 'https://web3.bitget.com/en/wallet-download',
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect
        ? getWalletConnectConnector({
            chains,
            projectId,
            version: walletConnectVersion,
          })
        : new InjectedConnector({
            chains,
            options: {
              // @ts-expect-error
              getProvider: () => window.bitkeep.ethereum,
              // ...options,
            },
          });
      const getUri = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);

        return isAndroid()
          ? uri
          : `bitkeep://wc?uri=${encodeURIComponent(uri)}`;
      };

      return {
        connector,
        extension: {
          instructions: {
            learnMoreUrl: 'https://web3.bitget.com/en/academy',
            steps: [
              {
                description:
                  'wallet_connectors.bitget.extension.step1.description',
                step: 'install',
                title: 'wallet_connectors.bitget.extension.step1.title',
              },
              {
                description:
                  'wallet_connectors.bitget.extension.step2.description',
                step: 'create',
                title: 'wallet_connectors.bitget.extension.step2.title',
              },
              {
                description:
                  'wallet_connectors.bitget.extension.step3.description',
                step: 'refresh',
                title: 'wallet_connectors.bitget.extension.step3.description',
              },
            ],
          },
        },
        mobile: {
          getUri: shouldUseWalletConnect ? getUri : undefined,
        },
        qrCode: shouldUseWalletConnect
          ? {
              getUri: async () =>
                getWalletConnectUri(connector, walletConnectVersion),
              instructions: {
                learnMoreUrl: 'https://web3.bitget.com/en/academy',
                steps: [
                  {
                    description:
                      'wallet_connectors.bitget.qr_code.step1.description',
                    step: 'install',
                    title: 'wallet_connectors.bitget.qr_code.step1.title',
                  },
                  {
                    description:
                      'wallet_connectors.bitget.qr_code.step2.description',

                    step: 'create',
                    title: 'wallet_connectors.bitget.qr_code.step2.title',
                  },
                  {
                    description:
                      'wallet_connectors.bitget.qr_code.step3.description',
                    step: 'scan',
                    title: 'wallet_connectors.bitget.qr_code.step3.title',
                  },
                ],
              },
            }
          : undefined,
      };
    },
  };
};
