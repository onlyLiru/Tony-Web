import { createContext } from 'react';
import * as launchpadApis from '@/services/launchpad';

export type ContextType = {
  data: Partial<
    launchpadApis.ApiLaunchpad.Itemtatus & launchpadApis.ApiLaunchpad.ListItem
  >;
  refresh: () => void;
};

export const PageContext = createContext<ContextType>({
  data: {},
  refresh: () => null,
});
