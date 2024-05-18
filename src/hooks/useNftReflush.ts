import { refreshMetadata } from '@/services/market';
import { useToast } from '@chakra-ui/react';
import { useRequest } from 'ahooks';
import { useMemo, useState } from 'react';

/**
 * Nft meta数据刷新
 * @returns
 */
export const useNftReflush = () => {
  const [reflushed, setRefreshed] = useState(false);

  const toast = useToast();
  const reloadReq = useRequest(refreshMetadata, { manual: true });

  const reflush = async (params?: {
    owner?: string;
    chain_id: any;
    collection_address?: string;
    address?: string;
    token_id?: string;
  }) => {
    if (reloadReq.loading) return;
    try {
      if (params && params.hasOwnProperty('collection_address')) {
        params['address'] = params['collection_address'];
        delete params['collection_address'];
      }
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
