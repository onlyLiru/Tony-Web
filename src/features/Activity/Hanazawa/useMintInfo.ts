import * as marketApis from '@/services/market';
import { mintStatus, ApiHanazawa, bluechip, getMintData } from './services';
import { useSetState, useRequest } from 'ahooks';
import { useEffect } from 'react';

/** 获取当前活动mint基础信息 */
export const useMintInfo = () => {
  const [state, updateState] = useSetState<{
    loading: boolean;
    error: boolean;
    data: Partial<
      marketApis.ApiMarket.MintListItem &
        ApiHanazawa.MintStatus & { blueChip: ApiHanazawa.BluechipInfo } & {
          mintData: ApiHanazawa.MintData;
        }
    >;
  }>({
    loading: false,
    error: false,
    data: {},
  });

  const featchStatus = useRequest(mintStatus, {
    manual: true,
  });

  const featch = async () => {
    try {
      updateState({ loading: true, error: false });
      // 获取mint活动列表
      const listResp = await marketApis.mintList();
      // 当前只有 Hanazawa 一个活动
      const mintItem = listResp.data.list[0];
      const status = await featchStatus.runAsync({
        address: mintItem?.address!,
      });
      const bluechipInfo = await bluechip({ address: mintItem?.address! });
      const mintData = await getMintData({ address: mintItem?.address! });
      updateState({
        loading: false,
        data: {
          blueChip: bluechipInfo.data,
          mintData: mintData.data,
          ...mintItem,
          ...status.data,
        },
      });
    } catch (error) {
      updateState({ loading: false, error: true });
    }
  };

  const refresh = async () => {
    const status = await featchStatus.runAsync({
      address: state.data.address!,
    });
    updateState({
      loading: false,
      data: {
        ...state.data,
        ...status.data,
      },
    });
  };

  useEffect(() => {
    featch();
  }, []);
  return {
    ...state,
    refresh,
  };
};
