import { createContext } from 'react';
import * as marketApis from '@/services/market';
import { ApiHanazawa } from './services';

export type PageContextType = {
  data: Partial<
    marketApis.ApiMarket.MintListItem &
      ApiHanazawa.MintStatus & { blueChip: ApiHanazawa.BluechipInfo } & {
        mintData: ApiHanazawa.MintData;
      }
  >;
  refresh: () => void;
};

export const PageInfoContext = createContext<PageContextType>({
  data: {},
  refresh: () => null,
});
