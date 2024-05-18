// // eslint-disable-next-line no-restricted-imports
// import { Dashboard, CharacterDesign } from '@/features/Activity/Cpt';
// import { serverSideTranslations } from '@/i18n';
// import type { GetServerSidePropsContext } from 'next';
// import { Image as ChakraImage } from '@chakra-ui/react';
// import { Footer } from '@/components/PageLayout';
// // import { ThirdwebProvider } from '@thirdweb-dev/react';
// // import { activeChain, isProd } from '@/utils';

// const Cpt = () => {
//   return (
//     <>
//       {/* <ThirdwebProvider
//         activeChain={activeChain ?? (isProd ? 'ethereum' : 'goerli')}
//       >
//         <BannerCpt />
//       </ThirdwebProvider> */}
//       <Dashboard />
//       <CharacterDesign />
//       <ChakraImage w="full" src="/images/activity/cpt/step.png" />
//       <ChakraImage w="full" src="/images/activity/cpt/training.png" />
//       <ChakraImage w="full" src="/images/activity/cpt/show.png" />
//       <Footer />
//     </>
//   );
// };

// export default Cpt;
// import * as Searcher from 'ip2region-ts';
// import path from 'path';
// import requestIp from 'request-ip';

// export async function getServerSideProps({
//   locale,
//   req,
// }: GetServerSidePropsContext) {
//   // 禁止国内ip
//   let detectedIp = requestIp.getClientIp(req);
//   // console.log(detectedIp, 'ip');
//   // console.log(req.url, 'ip');
//   // const ip = '156.146.56.115';

//   if (detectedIp === '::1') {
//     detectedIp = '156.146.56.115';
//   }

//   const xdbFilePath = path.join(process.cwd(), 'public', 'ip2region.xdb');
//   // const dbPath = './ip2region.xdb';
//   // or 'path/to/ip2region.xdb file path'
//   const searcher = Searcher.newWithFileOnly(xdbFilePath);
//   // 查询
//   const geo = await searcher.search(detectedIp || '');

//   if (geo && geo?.region?.split('|')[0] === '中国') {
//     if (
//       !(
//         geo?.region?.split('|')[2] === '台湾省' ||
//         geo?.region?.split('|')[2] === '香港'
//       )
//     ) {
//       return {
//         redirect: {
//           permanent: false,
//           destination: '/err',
//         },
//       };
//     }
//   }
//   return {
//     props: {
//       messages: await serverSideTranslations(locale, ['cpt']),
//     },
//   };
// }
