import React, { createContext, useContext, useEffect, useRef } from 'react';
import {
  NftBuyModal,
  NftBuyModalAction,
  NftBuyModalOpenParams,
} from './NftBuyModal';
import {
  NftSellModal,
  NftSellModalAction,
  NftListModalOpenParams,
} from './NftSellModal';
import {
  WethLearnMoreModal,
  WethLearnMoreModalAction,
} from './WethLearnMoreModal';
import {
  SwitchChainModal,
  SwitchChainModalAction,
  SwitchChainModalOpenParams,
} from './SwitchChainModal';

type RootModalContextProps = {
  openBuyModal: (params: NftBuyModalOpenParams) => void;
  openListModal: (params: NftListModalOpenParams) => void;
  openSwitchChainModal: (params: SwitchChainModalOpenParams) => void;
  openLearnMoreModal: () => void;
};

export const RootModalContext = createContext<RootModalContextProps>({
  openBuyModal: () => null,
  openListModal: () => null,
  openSwitchChainModal: () => null,
  openLearnMoreModal: () => null,
});

export const useRootModalConsumer = () => {
  return useContext(RootModalContext);
};

export const RootModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const buyModalRef = useRef<NftBuyModalAction>(null);
  const sellModalRef = useRef<NftSellModalAction>(null);
  const switchChainModalRef = useRef<SwitchChainModalAction>(null);
  const learnMoreModalRef = useRef<WethLearnMoreModalAction>(null);
  useEffect(() => {
    console.log('RootModalContext-->');
  }, []);

  return (
    <RootModalContext.Provider
      value={{
        openBuyModal: (p) => {
          buyModalRef.current?.open?.(p);
        },
        openListModal: (p) => {
          sellModalRef.current?.open?.(p);
        },
        openSwitchChainModal: (p) => {
          switchChainModalRef.current?.open?.(p);
        },
        openLearnMoreModal: () => {
          learnMoreModalRef.current?.open?.();
        },
      }}
    >
      {children}
      <NftBuyModal ref={buyModalRef} />
      <NftSellModal ref={sellModalRef} />
      <SwitchChainModal ref={switchChainModalRef} />
      <WethLearnMoreModal ref={learnMoreModalRef} />
    </RootModalContext.Provider>
  );
};
