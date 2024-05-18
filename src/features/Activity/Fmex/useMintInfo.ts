import * as launchpadApis from '@/services/launchpad';
import { useSetState, useRequest } from 'ahooks';
import { useEffect } from 'react';
import { ContextType } from './context';

/** 获取当前活动mint基础信息 */
export const useMintInfo = () => {
  const [state, updateState] = useSetState<{
    loading: boolean;
    error: boolean;
    data: Partial<ContextType['data']>;
  }>({
    loading: false,
    error: false,
    data: {},
  });

  const fetchStatus = useRequest(launchpadApis.status, {
    manual: true,
  });

  const fetch = async () => {
    try {
      updateState({ loading: true, error: false });
      // 获取mint活动列表
      const { data } = await launchpadApis.list();
      const mintItem = data.launchpad_list.find((el) => el.name === 'fmex');
      if (!mintItem) {
        throw Error('Could not find Project info.');
      }
      const status = await fetchStatus.runAsync({
        address: mintItem?.contract_address!,
      });
      updateState({
        loading: false,
        data: {
          ...mintItem,
          ...status.data,
        },
      });
    } catch (error) {
      updateState({ loading: false, error: true });
    }
  };

  const refresh = async () => {
    const status = await fetchStatus.runAsync({
      address: state.data.contract_address!,
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
    fetch();
  }, []);

  return {
    ...state,
    refresh,
  };
};
