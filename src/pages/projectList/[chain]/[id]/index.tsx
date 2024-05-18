import type { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from '@/i18n';
import * as marketApis from '@/services/market';
import { useRouter } from 'next/router';
import CommonHead from '@/components/PageLayout/CommonHead';
import {
  FilterContainer,
  NftFilterCommonContent,
  parseCommonContentRequestParams,
} from '@/features/ProjectFilterModule';
import { CollectionHeader } from '@/features/ProjectPage';
import { useTranslations } from 'next-intl';
import { PageTabs } from '@/features/PageTabs';
import { NftFilterForm } from '@/features/ProjectFilterModule';
import { useIsRare } from '@/store';

function getList(p: any) {
  parseCommonContentRequestParams(p);
  return marketApis.projectItemList({ ...p, page_size: 20 }).then((r) => ({
    list: r.data.item,
    noMore:
      !r.data.item || r.data?.item?.length === 0 || r.data.item.length < 10,
  }));
}

export default function CollectionDetail({
  collectionDetail,
}: {
  collectionDetail: any;
}) {
  const t = useTranslations('common');
  const { query } = useRouter();
  const [isRare] = useIsRare();

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
        <NftFilterForm.Provider projectId={+query.id!} chainId={+query.chain!}>
          <NftFilterCommonContent
            params={{ project_id: +query.id!, rare_mode: isRare }}
            request={getList}
          />
        </NftFilterForm.Provider>
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
  const messages = await serverSideTranslations(locale, [
    'collectionDetail',
    'teamz',
  ]);
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
    const { data } = await marketApis.projectDetail({
      project_id: id as string,
    });
    return {
      props: {
        messages,
        collectionDetail: data,
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
