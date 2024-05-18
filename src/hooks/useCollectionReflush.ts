import { refreshCollectionMetadata } from '@/services/collection';
import { useToast } from '@chakra-ui/react';
import { useRequest } from 'ahooks';
import { useMemo, useState } from 'react';

/**
 * collection meta数据刷新
 * @returns
 */
export const useCollectionReflush = () => {
  const [reflushed, setRefreshed] = useState(false);

  const toast = useToast();
  const reloadReq = useRequest(refreshCollectionMetadata, { manual: true });

  const reflush = async (params?: { contract_address?: string; chain_id: any }) => {
    if (reloadReq.loading) return;
    try {
      const { msg } = await reloadReq.runAsync(params);
      setRefreshed(true);
      toast({ status: 'success', title: msg, variant: 'subtle' });
    } catch (error) {
      toast({ status: 'error', title: error.message, variant: 'subtle' });
    }
  };

  const reflushText = useMemo(
    () => (reflushed ? 'Recently Refreshed' : 'Refresh'),
    [reflushed],
  );

  return { reflushText, reflushed, reflushing: reloadReq.loading, reflush };
};
