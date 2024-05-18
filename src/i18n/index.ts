import pick from 'lodash/pick';

const COMMON_LOCAL_KEY = ['common'];

/**
 * Get locale json data
 * @param locale
 * @param namespaces
 * @returns
 */
export async function serverSideTranslations(
  locale?: string,
  namespaces?: string[],
): Promise<IntlMessages> {
  const json = await import(`./locales/${locale}.json`);
  return pick(
    json.default,
    ...COMMON_LOCAL_KEY,
    ...(namespaces || []),
  ) as IntlMessages;
}

/**
 * Redirct login page with referrer
 */
export function redirectLoginPage({
  locale,
  resolvedUrl,
}: {
  locale?: string;
  resolvedUrl: string;
}) {
  return {
    redirect: {
      destination: `/${locale}/login?referrer=${encodeURIComponent(
        resolvedUrl,
      )}`,
      permanent: false,
    },
  };
}
