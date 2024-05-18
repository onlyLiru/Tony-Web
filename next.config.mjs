// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { env } from './src/env/server.mjs';

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: false,
  swcMinify: true,
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  i18n: {
    locales: ['en', 'ja', 'zh'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  images: {
    domains: [
      'image.unemeta.com',
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
      'imagedelivery.net',
      'storage.unemeta.cn',
      'storage.cloud.google.com',
      'i.seadn.io',
      'static-goerli.looksnice.org',
      'www.bing.com',
      'img2.baidu.com',
      'img1.baidu.com',
      'cdn.discordapp.com',
      'storage.nfte.ai',
      'test',
      'res.cloudinary.com',
      'test.unemeta.com',
      'unemeta-1322481783.cos.ap-tokyo.myqcloud.com',
      'images.unemeta.com',
      'img0.baidu.com'
    ],
  },
  compress: true,
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/blog',
        permanent: true,
      },
    ];
  },
});
