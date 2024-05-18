import Head from 'next/head';

/**
 * opengraph
 * 图片更新后，最好去对应站点更新缓存
 * @see https://cards-dev.twitter.com/validator
 */
const defaultValues = {
  title: 'IP-centric Community Layer',
  description:
    'Elevate your NFT experience with curated IPs and Icons on UneMeta',
  image:
    'https://images.unemeta.com/console/vcbfkvcdxdkjxhnjthxbvrvswofmdvhbjafpvrytxmrftwlgxresciftrdhreygdiodvfbsxhvxqlplqsextkmosiecjbiurthjypljldppcwmjgbghhsrvtwrejasfu',
};

const SITE_HOST_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://unemeta.com'
    : 'https://test.unemeta.com';

type CommonHeadProps = {
  title?: string;
  description?: string;
  image?: string;
  creator?: string;
};

// https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started#display
const CommonHead = (props: CommonHeadProps) => {
  const title = `${props.title || defaultValues.title} | UneMeta`;
  const desc = props.description || defaultValues.description;
  const image = props.image || defaultValues.image;
  return (
    <Head>
      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="og:site_name" content="UneMeta" property="og:site_name" />
      {props.creator && (
        <meta
          key="twitter:creator"
          name="twitter:creator"
          content={props.creator}
        />
      )}
      <title>{title}</title>
      <meta key="description" name="description" content={desc} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />

      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:description" property="og:description" content={desc} />
      <meta key="og:image" property="og:image" content={image} />

      <meta key="twitter:title" name="twitter:title" content={title} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={desc}
      />
      <meta key="twitter:image" name="twitter:image" content={image} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
            "@context": "http://schema.org",
            "@type": "Organization",  
            "name": "UneMeta",
            "url": "${SITE_HOST_URL}",
            "logo": "${SITE_HOST_URL}/logo_t.png"
          }`,
        }}
      />
    </Head>
  );
};

export default CommonHead;
