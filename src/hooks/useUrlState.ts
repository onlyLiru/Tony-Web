import { useMemoizedFn, useUpdate } from 'ahooks';
import { parse, stringify } from 'query-string';
import type { ParseOptions, StringifyOptions } from 'query-string';
import { useMemo, useRef } from 'react';
import type * as React from 'react';
import { useRouter } from 'next/router';

export interface Options {
  navigateMode?: 'push' | 'replace';
  parseOptions?: ParseOptions;
  stringifyOptions?: StringifyOptions;
}

const baseParseConfig: ParseOptions = {
  parseNumbers: false,
  parseBooleans: false,
};

const baseStringifyConfig: StringifyOptions = {
  skipNull: false,
  skipEmptyString: false,
};

type UrlState = Record<string, any>;

const pathnameRegex = /[^?#]+/u;

const useUrlState = <S extends UrlState = UrlState>(
  initialState?: S | (() => S),
  options?: Options,
) => {
  type State = Partial<{ [key in keyof S]: any }>;
  const {
    navigateMode = 'push',
    parseOptions,
    stringifyOptions,
  } = options || {};

  const mergedParseOptions = { ...baseParseConfig, ...parseOptions };
  const mergedStringifyOptions = {
    ...baseStringifyConfig,
    ...stringifyOptions,
  };

  const router = useRouter();
  const match = router.asPath.match(pathnameRegex);
  const pathname = match ? match[0] : router.asPath;

  const location = useMemo(() => {
    if (typeof window !== 'undefined') {
      // For SSG, no query parameters are available on the server side,
      // since they can't be known at build time. Therefore to avoid
      // markup mismatches, we need a two-part render in this case that
      // patches the client with the updated query parameters lazily.
      // Note that for SSR `router.isReady` will be `true` immediately
      // and therefore there's no two-part render in this case.
      if (router.isReady) {
        return window.location;
      } else {
        return { search: '' } as Location;
      }
    } else {
      // On the server side we only need a subset of the available
      // properties of `Location`. The other ones are only necessary
      // for interactive features on the client.
      return { search: router.asPath.replace(pathnameRegex, '') } as Location;
    }
  }, [router.asPath, router.isReady]);

  const history = useMemo(() => {
    function createUpdater(routeFn: typeof router.push) {
      return function updater({ hash, search }: Location) {
        routeFn(
          { pathname: router.pathname, search, hash },
          { pathname, search, hash },
          { shallow: true, scroll: false },
        );
      };
    }

    return {
      push: createUpdater(router.push),
      replace: createUpdater(router.replace),
      location,
    };
  }, [location, pathname, router]);

  const update = useUpdate();

  const initialStateRef = useRef(
    typeof initialState === 'function'
      ? (initialState as () => S)()
      : initialState || {},
  );

  const queryFromUrl = useMemo(() => {
    return parse(location.search, mergedParseOptions);
  }, [location.search]);

  const targetQuery: State = useMemo(
    () => ({
      ...initialStateRef.current,
      ...queryFromUrl,
    }),
    [queryFromUrl],
  );

  const setState = (s: React.SetStateAction<State>) => {
    const newQuery = typeof s === 'function' ? s(targetQuery) : s;

    // 1. 如果 setState 后，search 没变化，就需要 update 来触发一次更新。比如 demo1 直接点击 clear，就需要 update 来触发更新。
    // 2. update 和 history 的更新会合并，不会造成多次更新
    update();
    if (history) {
      history[navigateMode]({
        hash: location.hash,
        search: stringify(newQuery, mergedStringifyOptions) || '?',
      } as any);
    }
  };

  return [targetQuery, useMemoizedFn(setState)] as const;
};

export { useUrlState };
