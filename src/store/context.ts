import { createContext } from 'react';
import { NftStore } from './nft';

export const storeContext = createContext({
  nftStore: new NftStore(),
});
