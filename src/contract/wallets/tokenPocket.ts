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
import { isMobile } from './isMobile';

export interface MyWalletOptions {
  chains: Chain[];
  shimDisconnect?: boolean;
  projectId?: string;
  shimChainChangedDisconnect?: boolean;
}

export const tokenPocketWallet = ({
  chains,
  projectId,
  walletConnectVersion = '2',
}: MyWalletOptions): Wallet => {
  const isTokenPocketInjected =
    typeof window !== 'undefined' && window.ethereum?.isTokenPocket === true;

  const shouldUseWalletConnect = !isTokenPocketInjected;

  return {
    id: 'tokenPocket',
    name: 'TokenPocket',
    iconUrl:
      'https://hilarious-eucalyptus-a2f.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F262dcbcb-b59d-497f-94e3-21d350c6fe57%2FTokenPocket_App__white.svg?id=ce82b1cf-7c6e-4131-bcde-61cd6b437d77&table=block&spaceId=d809fd70-6f43-41bc-873b-0e99e2886b13&userId=&cache=v2',
    // iconAccent: '#f6851a',
    iconBackground: '#2980FE',
    installed: !shouldUseWalletConnect ? isTokenPocketInjected : undefined,
    downloadUrls: {
      chrome:
        'https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii',
      browserExtension: 'https://extension.tokenpocket.pro/',
      android:
        'https://play.google.com/store/apps/details?id=vip.mytokenpocket',
      ios: 'https://apps.apple.com/us/app/tp-global-wallet/id6444625622',
      qrCode: 'https://tokenpocket.pro/en/download/app',
      mobile: 'https://tokenpocket.pro/en/download/app',
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect
        ? getWalletConnectConnector({
            chains,
            projectId,
            version: walletConnectVersion,
          })
        : new InjectedConnector({ chains });
      const getUri = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);
        return isMobile()
          ? `tpoutside://wc?uri=${encodeURIComponent(uri)}`
          : uri;
      };

      return {
        connector,
        mobile: {
          getUri: shouldUseWalletConnect ? getUri : undefined,
        },
        qrCode: shouldUseWalletConnect
          ? {
              getUri,
              instructions: {
                learnMoreUrl: 'https://help.tokenpocket.pro/en/',
                steps: [
                  {
                    description:
                      'wallet_connectors.token_pocket.qr_code.step1.description',
                    step: 'install',
                    title: 'wallet_connectors.token_pocket.qr_code.step1.title',
                  },
                  {
                    description:
                      'wallet_connectors.token_pocket.qr_code.step2.description',
                    step: 'create',
                    title: 'wallet_connectors.token_pocket.qr_code.step2.title',
                  },
                  {
                    description:
                      'wallet_connectors.token_pocket.qr_code.step3.description',
                    step: 'scan',
                    title: 'wallet_connectors.token_pocket.qr_code.step3.title',
                  },
                ],
              },
            }
          : undefined,
        extension: {
          instructions: {
            learnMoreUrl:
              'https://help.tokenpocket.pro/en/extension-wallet/faq/installation-tutorial',
            steps: [
              {
                description:
                  'wallet_connectors.token_pocket.extension.step1.description',
                step: 'install',
                title: 'wallet_connectors.token_pocket.extension.step1.title',
              },
              {
                description:
                  'wallet_connectors.token_pocket.extension.step2.description',
                step: 'create',
                title: 'wallet_connectors.token_pocket.extension.step2.title',
              },
              {
                description:
                  'wallet_connectors.token_pocket.extension.step3.description',
                step: 'refresh',
                title: 'wallet_connectors.token_pocket.extension.step3.title',
              },
            ],
          },
        },
      };
    },
  };
};
