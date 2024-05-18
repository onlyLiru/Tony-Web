import { useMemo, useRef, useState } from 'react';
import {
  useEventListener,
  useMemoizedFn,
  useRequest,
  useUpdateEffect,
} from 'ahooks';
import { getTargetElement } from 'ahooks/lib/utils/domTarget';
import {
  getClientHeight,
  getScrollHeight,
  getScrollTop,
} from 'ahooks/lib/utils/rect';
import type { BasicTarget } from 'ahooks/es/utils/domTarget';

export type Data = { list: any[]; [key: string]: any };

export type Service<TData extends Data> = (p?: any) => Promise<TData>;

export interface InfiniteScrollResult<TData extends Data> {
  data: TData;
  loading: boolean;
  loadingMore: boolean;
  noMore: boolean;

  loadMore: () => void;
  loadMoreAsync: () => Promise<TData>;
  reload: () => void;
  reloadAsync: () => Promise<TData>;
  cancel: () => void;
  mutate: (data?: TData) => void;
}

export interface InfiniteScrollOptions<TData extends Data> {
  target?: BasicTarget<Element | Document>;
  isNoMore?: (data?: TData) => boolean;
  threshold?: number;

  pageSize?: number;
  defaultPage?: number;

  defaultParams?: Record<string, any>;

  manual?: boolean;
  reloadDeps?: Record<string, any>[];

  onBefore?: () => void;
  onSuccess?: (data: TData) => void;
  onError?: (e: Error) => void;
  onFinally?: (data?: TData, e?: Error) => void;
}

const useInfiniteScroll = <TData extends Data>(
  service: Service<TData>,
  options: InfiniteScrollOptions<TData> = {},
) => {
  const {
    target = () => document,
    isNoMore,
    threshold = 1,
    reloadDeps = [],
    manual,
    onBefore,
    onSuccess,
    onError,
    onFinally,
    defaultPage = 1,
    pageSize = 10,
    defaultParams = {},
  } = options;

  const [finalData, setFinalData] = useState<TData>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [serviceRuned, setServiceRuned] = useState(false);
  const [isError, setIsError] = useState(false);

  const pagiRef = useRef<{ page: number; page_size: number }>({
    page: defaultPage,
    page_size: pageSize,
  });

  const noMore = useMemo(() => {
    if (!isNoMore) return false;
    return isNoMore(finalData);
  }, [finalData]);

  const { loading, run, runAsync, cancel } = useRequest(
    async (lastData?: TData) => {
      const reloadDepsParams = reloadDeps.reduce((a, v) => {
        return { ...a, ...v };
      }, {});
      const item = window.localStorage.getItem('unemata_visionChainId');
      const currentData = await service({
        ...defaultParams,
        ...reloadDepsParams,
        page: pagiRef.current.page,
        page_size: pagiRef.current.page_size,
        chain_id: Number(item),
      });
      // 手动赋值新数组以防报错
      if (!currentData.list) {
        currentData.list = [];
      }
      if (!lastData) {
        setFinalData(currentData);
      } else {
        setFinalData({
          ...currentData,
          list: [...lastData.list, ...currentData.list],
        });
      }
      return currentData;
    },
    {
      manual,
      onFinally: (_, d, e) => {
        setLoadingMore(false);
        setServiceRuned(true);
        onFinally?.(d, e);
      },
      onBefore: () => {
        setIsError(false);
        onBefore?.();
      },
      onSuccess: (d) => {
        pagiRef.current.page += 1;
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          scrollMethod();
        });
        onSuccess?.(d);
      },
      onError: (e) => {
        setIsError(true);
        onError?.(e);
      },
    },
  );

  const resetPagi = () => {
    setIsError(false);
    setFinalData(undefined);
    pagiRef.current = {
      page: defaultPage,
      page_size: pageSize,
    };
  };

  const loadMore = useMemoizedFn(() => {
    if (noMore || isError) return;
    setLoadingMore(true);
    run(finalData);
  });

  const loadMoreWhenError = useMemoizedFn(() => {
    setLoadingMore(true);
    run(finalData);
  });

  const loadMoreAsync = () => {
    if (noMore) return Promise.reject();
    setLoadingMore(true);
    return runAsync(finalData);
  };

  const reload = () => {
    resetPagi();
    run();
  };
  const reloadAsync = () => {
    resetPagi();
    runAsync();
  };

  const scrollMethod = () => {
    const computedTarget = getTargetElement(target);
    const el =
      computedTarget === document
        ? document.documentElement
        : getTargetElement(target);
    if (!el) {
      return;
    }

    const scrollTop = getScrollTop(el);
    const scrollHeight = getScrollHeight(el);
    const clientHeight = getClientHeight(el);

    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      loadMore();
    }
  };

  const isEmpty = useMemo(
    () => serviceRuned && !loading && !finalData?.list?.length && !isError,
    [loading, isError, serviceRuned, finalData?.list],
  );
  const isLoading = useMemo(
    () => loading || loadingMore,
    [loading, loadingMore],
  );

  useEventListener(
    'scroll',
    () => {
      if (loading || loadingMore) {
        return;
      }
      scrollMethod();
    },
    { target },
  );

  useUpdateEffect(() => {
    resetPagi();
    run();
  }, [JSON.stringify(reloadDeps)]);

  return {
    data: finalData,
    loading: !loadingMore && loading,
    isError,
    isLoading,
    loadingMore,
    noMore,
    pageSize,
    isEmpty,
    loadMore,
    loadMoreWhenError,
    loadMoreAsync: useMemoizedFn(loadMoreAsync),
    reload: useMemoizedFn(reload),
    reloadAsync: useMemoizedFn(reloadAsync),
    mutate: setFinalData,
    cancel,
  };
};

export default useInfiniteScroll;
