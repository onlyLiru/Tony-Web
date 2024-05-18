import { SupportedChainId } from '../types';
import * as Icons from '@/components/Icon';
import { ComponentWithAs, IconProps } from '@chakra-ui/react';

type NetworkLogos = {
  Chain: ComponentWithAs<'svg', IconProps>;
  Local: ComponentWithAs<'svg', IconProps>;
  Wrapper: ComponentWithAs<'svg', IconProps>;
  Stable: ComponentWithAs<'svg', IconProps>;
};

type NetworkCurrenySymbol = {
  Local: string;
  Wrapper: string;
  Stable: string;
};

const ethLogo: NetworkLogos = {
  Chain: Icons.ChainEthereum,
  Local: Icons.ETH,
  Wrapper: Icons.WETH,
  Stable: Icons.USDT,
};

const bscLogo: NetworkLogos = {
  Chain: Icons.ChainBsc,
  Local: Icons.BNB,
  Wrapper: Icons.BNB,
  Stable: Icons.BUSD,
};
const beraLogo: NetworkLogos = {
  Chain: Icons.ChainBERA,
  Local: Icons.BERA,
  Wrapper: Icons.BERA,
  Stable: Icons.BERA,
};

export const logosByNetwork: any = {
  [SupportedChainId.MAINNET]: ethLogo,
  [SupportedChainId.EtherTest]: ethLogo,
  [SupportedChainId.BSC]: bscLogo,
  [SupportedChainId.BSCT]: bscLogo,
  [SupportedChainId.BeraTest]: beraLogo,
};

//1 eth 2weth 3.eth上ustd 5.goerli上的eth 6。goerli的weth 7 bnb 8 wbnb 9 busd 10 tbnb 11 twbnb 12 tbusd
export enum NftActivityCurrencyType {
  NULL = 0,
  ETH = 1,
  WETH = 2,
  USTD = 3,
  GOERLI_ETH = 4,
  GOERLI_WETH = 5,
  GOERLI_USTD = 6,
  BNB = 7,
  WBNB = 8,
  BUSD = 9,
  TBNB = 10,
  TWBNB = 11,
  TBUSD = 12,
}

export const getCurrencyLogoByType = (type: NftActivityCurrencyType) => {
  switch (type) {
    case NftActivityCurrencyType.ETH:
    case NftActivityCurrencyType.GOERLI_ETH:
    // 现在前端调用合约是全转weth后成为weth的挂单 主要是为了兼容同时用weth和eth混合购买才会这么做。
    case NftActivityCurrencyType.WETH:
    case NftActivityCurrencyType.GOERLI_WETH:
      return logosByNetwork[SupportedChainId.MAINNET].Local;
    // case NftActivityCurrencyType.WETH:
    // case NftActivityCurrencyType.GOERLI_WETH:
    //   return logosByNetwork[SupportedChainId.MAINNET].Wrapper;
    case NftActivityCurrencyType.USTD:
    case NftActivityCurrencyType.GOERLI_USTD:
      return logosByNetwork[SupportedChainId.MAINNET].Stable;
    case NftActivityCurrencyType.BNB:
    case NftActivityCurrencyType.TBNB:
      return logosByNetwork[SupportedChainId.BSC].Local;
    case NftActivityCurrencyType.WBNB:
    case NftActivityCurrencyType.TWBNB:
      return logosByNetwork[SupportedChainId.BSC].Wrapper;
    case NftActivityCurrencyType.BUSD:
    case NftActivityCurrencyType.TBUSD:
      return logosByNetwork[SupportedChainId.BSC].Stable;
    default:
      return logosByNetwork[SupportedChainId.MAINNET].Local;
  }
};

const bscSymbol = {
  Local: 'BNB',
  Wrapper: 'WBNB',
  Stable: 'BUSD',
};

const ethSymbol = {
  Local: 'ETH',
  Wrapper: 'WETH',
  Stable: 'USDT',
};
const bearSymbol = {
  Local: 'BERA',
  Wrapper: 'WBERA',
  Stable: 'USDT',
};

export const symbolsByNetwork: any = {
  [SupportedChainId.MAINNET]: ethSymbol,
  [SupportedChainId.EtherTest]: ethSymbol,
  [SupportedChainId.BSC]: bscSymbol,
  [SupportedChainId.BSCT]: bscSymbol,
  [SupportedChainId.BeraTest]: bearSymbol,
};

export const getCurrencySymbolByType = (type: NftActivityCurrencyType) => {
  switch (type) {
    case NftActivityCurrencyType.ETH:
    case NftActivityCurrencyType.GOERLI_ETH:
    // 现在前端调用合约是全转weth后成为weth的挂单 主要是为了兼容同时用weth和eth混合购买才会这么做。
    case NftActivityCurrencyType.WETH:
    case NftActivityCurrencyType.GOERLI_WETH:
      return symbolsByNetwork[SupportedChainId.MAINNET].Local;
    // case NftActivityCurrencyType.WETH:
    // case NftActivityCurrencyType.GOERLI_WETH:
    //   return symbolsByNetwork[SupportedChainId.MAINNET].Wrapper;
    case NftActivityCurrencyType.USTD:
    case NftActivityCurrencyType.GOERLI_USTD:
      return symbolsByNetwork[SupportedChainId.MAINNET].Stable;
    case NftActivityCurrencyType.BNB:
    case NftActivityCurrencyType.TBNB:
      return symbolsByNetwork[SupportedChainId.BSC].Local;
    case NftActivityCurrencyType.WBNB:
    case NftActivityCurrencyType.TWBNB:
      return symbolsByNetwork[SupportedChainId.BSC].Wrapper;
    case NftActivityCurrencyType.BUSD:
    case NftActivityCurrencyType.TBUSD:
      return symbolsByNetwork[SupportedChainId.BSC].Stable;
    default:
      return symbolsByNetwork[SupportedChainId.MAINNET].Local;
  }
};

export const namesByNetwork: {
  [chainId in SupportedChainId]: string;
} = {
  [SupportedChainId.MAINNET]: 'Ethereum',
  [SupportedChainId.EtherTest]: 'Ethereum',
  [SupportedChainId.BSC]: 'BNB Chain',
  [SupportedChainId.BSCT]: 'BNB Chain',
  [SupportedChainId.BeraTest]: 'BERA Chain',
};
