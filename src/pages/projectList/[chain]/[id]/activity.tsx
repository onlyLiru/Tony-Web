import type { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from '@/i18n';
import { NftItemDataType } from '@/features/AssetItem';
import * as marketApis from '@/services/market';
import { useRouter } from 'next/router';
import CommonHead from '@/components/PageLayout/CommonHead';
import {
  ActivitesFilterForm,
  ActivitesFilterStatusBar,
  ActivityChart,
  ActivityTable,
} from '@/features/ProjectActivitesFilter';
import { CollectionHeader } from '@/features/ProjectPage';
import { Box } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { PageTabs } from '@/features/PageTabs';
import { FilterContainer } from '@/features/ProjectFilterModule';
import { useContext, useMemo } from 'react';

function Content() {
  const { query } = useRouter();
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
      wrapperProps={{ bg: '#fff' }}
    >
      <ActivitesFilterStatusBar />
      <Box>
        {/* <ActivityChart
          contractAddress={query.id as string}
          chainId={+query.chain!}
        /> */}
        <ActivityTable
          params={{
            project_id: +query.id!,
            attrs,
            chain_id: +query.chain!,
          }}
        />
      </Box>
    </FilterContainer>
  );
}

export default function CollectionActivity({
  collectionDetail,
}: {
  defaultItems: NftItemDataType[];
  collectionDetail: marketApis.ApiMarket.ProjectDetail;
}) {
  const { query } = useRouter();
  const t = useTranslations('common');
  return (
    <>
      <CommonHead
        title={collectionDetail.project.name}
        description={collectionDetail.project.description}
        image={collectionDetail.project.logo}
      />
      <CollectionHeader collectionDetail={collectionDetail} />
      <PageTabs
        tabs={[
          {
            label: t('items'),
            href: `/projectList/${query.chain}/${query.id}`,
          },
          {
            label: t('activites.title'),
            href: `/projectList/${query.chain}/${query.id}/activity?events[]=4`,
          },
        ]}
      />
      <FilterContainer.Provider>
        <ActivitesFilterForm.Provider
          projectId={+query.id!}
          chainId={+query.chain!}
        >
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
  query,
  req,
}: GetServerSidePropsContext) {
  const messages = await serverSideTranslations(locale, ['collectionDetail']);
  const { id, chain } = query as Record<string, string>;
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
  try {
    const data = {
      collectionDetail: {},
      defaultItems: [] as any[],
    };

    await marketApis
      .projectDetail({
        project_id: id as string,
      })
      .then((res) => (data.collectionDetail = res.data))
      .catch(() => {
        data.collectionDetail = {
          project: {},
        };
      });
    return {
      props: {
        messages,
        ...data,
      },
    };
  } catch (error) {
    return {
      props: {
        messages,
      },
    };
  }
}
