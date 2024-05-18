import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useIsRare } from '@/store';

export default function CloseRareMode() {
  const router = useRouter();
  const [, setIsRare] = useIsRare();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // 只对/collection/不做处理,collection的动态也移除稀有状态
      if (!url.includes('/collection/') || url.includes('/activity?')) {
        setIsRare(false);
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
