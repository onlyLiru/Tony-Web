/**
 * Fatpay
 * @see https://dev.fatpay.org/v/zh/
 */

import { useUserDataValue } from '@/store';
import { useRouter } from 'next/router';
import { stringify } from 'querystring';
import { useMemo, useState } from 'react';

const BASE_URL = 'https://ramp.fatpay.xyz/home';

const CONFIG = {
  partnerId: 'vVp6ORup4dOU1CZd',
  /**
   * 支持的法币
   * @see https://dev.fatpay.org/v/zh/appendix/supported-fiat-list
   */
  // fiatCurrency: '',
  /**
   * 支持的加密货币
   * @see https://dev.fatpay.org/v/zh/appendix/supported-cryptocurrencies-list
   */
  cryptoCurrency: 'ETH',
  /** 默认加密货币 */
  defaultCurrency: 'ETH',
};

export const useFatpayUrl = () => {
  const userData = useUserDataValue();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 默认法币
  const defaultFiatCurrency = useMemo(() => {
    if (router.locale === 'ja') return 'JPY';
    return 'USD';
  }, [router.locale]);

  const getFatpayUrl = async () => {
    const language = router.locale === 'zh' ? 'zh' : 'en';
    const timestamp = Math.ceil(new Date().getTime() / 1000);
    const signatureQuery = {
      nonce: '1',
      ext: 'ext',
      timestamp,
      walletAddress: userData?.wallet_address,
      partnerId: CONFIG.partnerId,
    };

    try {
      setLoading(true);
      const res = await fetch(`/api/fatpay?${stringify(signatureQuery)}`);
      const { signature, err } = await res.json();
      if (err) throw Error(err);
      setLoading(false);

      const query = {
        language,
        defaultFiatCurrency,
        signature,
        ...signatureQuery,
        ...CONFIG,
      } as Record<string, string | number>;
      const url = `${BASE_URL}?${stringify(query)}`;
      return url;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  return { loading, getFatpayUrl };
};
