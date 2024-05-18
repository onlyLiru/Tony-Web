import type { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from '@/i18n';
import * as marketApis from '@/services/market';
import CommonHead from '@/components/PageLayout/CommonHead';
import { useTranslations } from 'next-intl';
import {
  FilterContainer,
  NftFilterCommonContent,
  NftFilterForm,
  parseCommonContentRequestParams,
} from '@/features/FilterModule';
import { GetUUU } from '@/features/Home';
import { PageTabs } from '@/features/PageTabs';
import { useSwitchChain } from '@/hooks/useSwitchChain';

function getList(p: any) {
  parseCommonContentRequestParams(p);

  return marketApis.itemBrowse(p).then((r) => ({
    list: r.data.item,
    noMore:
      !r.data?.item || r.data?.item?.length === 0 || r.data.item.length < 10,
  }));
}

export default function Explore() {
  const t = useTranslations('common');
  const { visitChain } = useSwitchChain();
  return (
    <>
      <CommonHead title="Explore" />
      <PageTabs
        tabs={[
          { label: t('header.nav.explore'), href: '/explore' },
          { label: t('activites.title'), href: '/explore/activity?events[]=4' },
        ]}
      />
      <FilterContainer.Provider>
        <NftFilterForm.Provider chainId={visitChain.id}>
          <NftFilterCommonContent request={getList} />
        </NftFilterForm.Provider>
      </FilterContainer.Provider>
      <GetUUU></GetUUU>
    </>
  );
}
import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export async function getServerSideProps({
  locale,
  req,
}: GetServerSidePropsContext) {
  const messages = await serverSideTranslations(locale, ['common', 'teamz']);
  // 禁止国内ip
  let detectedIp = requestIp.getClientIp(req);
  // console.log(detectedIp, 'ip');
  // console.log(req.url, 'ip');
  // const ip = '156.146.56.115';

  if (detectedIp === '::1') {
    detectedIp = '156.146.56.115';
  }

  const xdbFilePath = path.join(process.cwd(), 'public', 'ip2region.xdb');
  // const dbPath = './ip2region.xdb';
  // or 'path/to/ip2region.xdb file path'
  const searcher = Searcher.newWithFileOnly(xdbFilePath);
  // 查询
  const geo = await searcher.search(detectedIp || '');

  if (geo && geo?.region?.split('|')[0] === '中国') {
    if (
      !(
        geo?.region?.split('|')[2] === '台湾省' ||
        geo?.region?.split('|')[2] === '香港'
      )
    ) {
      return {
        redirect: {
          permanent: false,
          destination: '/err',
        },
      };
    }
  }
  // console.log(geo, 'geo1');
  return {
    props: {
      messages,
    },
  };
}
