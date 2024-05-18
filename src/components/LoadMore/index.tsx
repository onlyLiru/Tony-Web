import React, { FC, useEffect, useRef, useState } from 'react';
import { useLockFn, useThrottleFn } from 'ahooks';
import { getScrollParent } from '@/utils/getScrollParent';
import { Box, BoxProps, Button, Flex, Spinner } from '@chakra-ui/react';
import merge from 'lodash/merge';
import { useTranslations } from 'next-intl';

function isWindow(element: any | Window): element is Window {
  return element === window;
}

export type LoadMoreProps = {
  /** 加载更多的回调函数	 */
  onLoad: (isRetry: boolean) => Promise<void>;
  /** 是否还有更多内容	 */
  hasMore: boolean;
  /** 触发加载事件的滚动触底距离阈值，单位为像素	 */
  threshold?: number;
  /** 渲染自定义指引内容	 */
  boxProps?: BoxProps;
  children?:
    | React.ReactNode
    | ((
        hasMore: boolean,
        failed: boolean,
        retry: () => void,
      ) => React.ReactNode);
};

const defaultProps: Required<Pick<LoadMoreProps, 'threshold' | 'children'>> = {
  threshold: 0,
  children: (hasMore: boolean, failed: boolean, retry: () => void) => (
    <LoadMoreContent hasMore={hasMore} failed={failed} retry={retry} />
  ),
};

const LoadMore: FC<LoadMoreProps> = (p) => {
  const props = merge(defaultProps, p);

  const [failed, setFailed] = useState(false);
  const doLoadMore = useLockFn(async (isRetry: boolean) => {
    try {
      await props.onLoad(isRetry);
    } catch (e) {
      setFailed(true);
      throw e;
    }
  });

  const elementRef = useRef<HTMLDivElement>(null);

  // Prevent duplicated trigger of `check` function
  const [flag, setFlag] = useState({});
  const nextFlagRef = useRef(flag);

  const [scrollParent, setScrollParent] = useState<
    Window | Element | null | undefined
  >();

  const { run: check } = useThrottleFn(
    async () => {
      if (nextFlagRef.current !== flag) return;
      if (!props.hasMore) return;
      const element = elementRef.current;
      if (!element) return;
      if (!element.offsetParent) return;
      const parent = getScrollParent(element);
      setScrollParent(parent);
      if (!parent) return;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const current = isWindow(parent)
        ? window.innerHeight
        : parent.getBoundingClientRect().bottom;
      if (current >= elementTop - props.threshold) {
        const nextFlag = {};
        nextFlagRef.current = nextFlag;
        await doLoadMore(false);
        setFlag(nextFlag);
      }
    },
    {
      wait: 100,
      leading: true,
      trailing: true,
    },
  );

  // Make sure to trigger `loadMore` when content changes
  useEffect(() => {
    check();
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (!scrollParent) return;
    function onScroll() {
      check();
    }
    scrollParent.addEventListener('scroll', onScroll);
    return () => {
      scrollParent.removeEventListener('scroll', onScroll);
    };
  }, [scrollParent]);

  async function retry() {
    setFailed(false);
    await doLoadMore(true);
    setFlag(nextFlagRef.current);
  }

  return (
    <Box p={10} mt={10} {...props.boxProps}>
      <Flex
        className="une-loadmore"
        align="center"
        justify="center"
        ref={elementRef}
      >
        {typeof props.children === 'function'
          ? props.children(props.hasMore, failed, retry)
          : props.children}
      </Flex>
    </Box>
  );
};

const LoadMoreContent: FC<{
  hasMore: boolean;
  failed: boolean;
  retry: () => void;
}> = (props) => {
  const t = useTranslations('common');

  if (!props.hasMore) {
    return null;
  }

  if (props.failed) {
    return (
      <Button
        opacity={0.7}
        variant="outline"
        borderWidth={2}
        borderColor="primary.main"
        color="primary.main"
        onClick={() => props.retry()}
      >
        {t('someThingWrong')}
      </Button>
    );
  }

  return (
    <Button
      opacity={0.5}
      variant="outline"
      borderWidth={2}
      borderColor="primary.main"
      color="primary.main"
      leftIcon={
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="accent.blue"
        />
      }
    >
      {t('loadMore')}
    </Button>
  );
};

export default LoadMore;
