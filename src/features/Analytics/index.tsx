import { useRouter } from 'next/router';
import React from 'react';
import * as gtag from './gtag';

export * from './gtag';

export default function Analytics() {
  const router = useRouter();
  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      try {
        gtag.pageview(url);
      } catch (error) {
        // Dismiss gtag event error
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, []);

  return null;
}
