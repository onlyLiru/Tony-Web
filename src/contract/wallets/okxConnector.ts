/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import {
  ConnectorNotFoundError,
  ResourceUnavailableError,
  UserRejectedRequestError,
  getClient,
  InjectedConnector,
} from '@wagmi/core';
import type {
  Address,
  RpcError,
  Ethereum,
  InjectedConnectorOptions,
} from '@wagmi/core';
import type { Chain } from '@wagmi/core/chains';
import { getAddress } from 'ethers/lib/utils.js';

type OkxEthereum = Ethereum & { isOkxWallet: boolean; isOKExWallet: boolean };

declare global {
  interface Window {
    okxwallet?: OkxEthereum;
    okexchain?: OkxEthereum;
    bitkeep?: any;
  }
}

export type okxConnectorOptions = Pick<
  InjectedConnectorOptions,
  'shimChainChangedDisconnect' | 'shimDisconnect'
> & {
  /**
   * While "disconnected" with `shimDisconnect`, allows user to select a different okx account (than the currently connected account) when trying to connect.
   */
  UNSTABLE_shimOnConnectSelectAccount?: boolean;
};

export class OkxWalletConnector extends InjectedConnector {
  readonly id = 'okxWallet';

  protected shimDisconnectKey = `${this.id}.shimDisconnect`;

  #UNSTABLE_shimOnConnectSelectAccount: okxConnectorOptions['UNSTABLE_shimOnConnectSelectAccount'];

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[];
    options?: okxConnectorOptions;
  } = {}) {
    const options = {
      id: 'okxWallet',
      name: 'OKX Wallet',
      shimDisconnect: true,
      shimChainChangedDisconnect: true,
      getProvider() {
        function getReady(ethereum?: Ethereum) {
          const isOkx =
            !!(ethereum as OkxEthereum)?.isOkxWallet ||
            !!(ethereum as OkxEthereum)?.isOKExWallet;
          if (!isOkx) return;
          return ethereum;
        }

        if (typeof window === 'undefined') return;
        const ethereum = (window.okxwallet || window.okexchain) as
          | Ethereum
          | undefined;
        if (ethereum?.providers) return ethereum.providers.find(getReady);
        return getReady(ethereum);
      },
      ...options_,
    };
    super({ chains, options });

    this.#UNSTABLE_shimOnConnectSelectAccount =
      options.UNSTABLE_shimOnConnectSelectAccount;
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider();
      if (!provider) throw new ConnectorNotFoundError();

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', this.onChainChanged);
        provider.on('disconnect', this.onDisconnect);
      }

      this.emit('message', { type: 'connecting' });

      // Attempt to show wallet select prompt with `wallet_requestPermissions` when
      // `shimDisconnect` is active and account is in disconnected state (flag in storage)
      let account: Address | null = null;
      if (
        this.#UNSTABLE_shimOnConnectSelectAccount &&
        this.options?.shimDisconnect &&
        !getClient().storage?.getItem(this.shimDisconnectKey)
      ) {
        account = await this.getAccount().catch(() => null);
        const isConnected = !!account;
        if (isConnected)
          // Attempt to show another prompt for selecting wallet if already connected
          try {
            await provider.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }],
            });
            // User may have selected a different account so we will need to revalidate here.
            account = await this.getAccount();
          } catch (error) {
            // Not all MetaMask injected providers support `wallet_requestPermissions` (e.g. MetaMask iOS).
            // Only bubble up error if user rejects request
            if (this.isUserRejectedRequestError(error))
              throw new UserRejectedRequestError(error);
          }
      }

      if (!account) {
        const accounts = await provider.request({
          method: 'eth_requestAccounts',
        });
        account = getAddress(accounts[0] as string);
      }

      // Switch to chain if provided
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }

      if (this.options?.shimDisconnect)
        getClient().storage?.setItem(this.shimDisconnectKey, true);

      return { account, chain: { id, unsupported }, provider };
    } catch (error) {
      if (this.isUserRejectedRequestError(error))
        throw new UserRejectedRequestError(error);
      if ((error as RpcError).code === -32002)
        throw new ResourceUnavailableError(error);
      throw error;
    }
  }
}
