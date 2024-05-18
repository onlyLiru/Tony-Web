import type { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from '@/i18n';
import CommonHead from '@/components/PageLayout/CommonHead';
import {
  ActivitesFilterForm,
  ActivitesFilterStatusBar,
  ActivityTable,
} from '@/features/ActivitesFilter';
import { Box } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { PageTabs } from '@/features/PageTabs';
import { FilterContainer } from '@/features/FilterModule';
import { useContext, useMemo } from 'react';
import { useSwitchChain } from '@/hooks/useSwitchChain';

function Content() {
  const { visitChain } = useSwitchChain();
  const { state } = useContext(ActivitesFilterForm.Context);
  const attrs = useMemo(() => {
    if (!state.attrs) return undefined;
    return JSON.parse(decodeURIComponent(state.attrs));
  }, [state.attrs]);
  return (
    <FilterContainer
      filterContent={<ActivitesFilterForm />}
      filterWrapperProps={{
        h: 'calc(100vh - 80px)',
        top: { base: 0, md: '80px' },
      }}
      wrapperProps={{ bg: '#2B2B2B' }}
    >
      <ActivitesFilterStatusBar />
      <Box>
        <ActivityTable
          params={{
            collection_address: state.address,
            attrs,
            chain_id: visitChain.id,
          }}
        />
      </Box>
    </FilterContainer>
  );
}

export default function ExploreActivity() {
  const t = useTranslations('common');
  const { visitChain } = useSwitchChain();
  return (
    <>
      <CommonHead title="Explore Avtivity" />
      <PageTabs
        tabs={[
          { label: t('header.nav.explore'), href: '/explore' },
          { label: t('activites.title'), href: '/explore/activity?events[]=4' },
        ]}
      />
      <FilterContainer.Provider>
        <ActivitesFilterForm.Provider chainId={visitChain.id}>
          <Content />
        </ActivitesFilterForm.Provider>
      </FilterContainer.Provider>
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
  const messages = await serverSideTranslations(locale, ['common']);
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
