import {
  Box,
  Text,
  VStack,
  Flex,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useMediaQuery,
  ChakraProps,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRef } from 'react';
import CommonHead from '@/components/PageLayout/CommonHead';
import { DocsHeader } from '@/features/Docs';
import { serverSideTranslations } from '@/i18n';
import { useTranslations } from 'next-intl';
import type { GetServerSideProps } from 'next';
import * as userApis from '@/services/user';
import { NavMenuIcon } from '@/components/PageLayout/Header/ProfileButton/Icons';
import MarkdownPreview from '@unemeta/react-markdown-preview';
import '@unemeta/react-markdown-preview/markdown.css';
import { Footer } from '@/components/PageLayout';
import { useRouter } from 'next/router';
import { useMounted } from '@/hooks/useMounted';

type BlogType = {
  type: 'daily' | 'week';
};

const AccordionItemChlidren = ({
  data,
  type,
}: { data: userApis.ApiUser.BlogItem[] } & BlogType) => {
  const router = useRouter();
  const active = Number(router.query.id);

  return (
    <VStack w="100%" spacing={6} align="flex-start">
      <VStack spacing={2} w="100%">
        {data.map((v: userApis.ApiUser.BlogItem, i: number) => (
          <Link key={i} href={`/docs/blog/${type}/${v.id}`}>
            <Text
              w="100%"
              h="30px"
              fontSize="14px"
              lineHeight="30px"
              noOfLines={1}
              px={2}
              rounded={2}
              _hover={{ bgColor: 'rgb(242, 242, 242)' }}
              cursor="pointer"
              bgColor={active === v.id ? 'rgb(242, 242, 242)' : ''}
              color={active === v.id ? '#000' : '#4d5358'}
            >
              {`${v.date} ${v.title}`}
            </Text>
          </Link>
        ))}
      </VStack>
    </VStack>
  );
};

const BlogList = ({
  data,
  hidden,
  type,
  ...props
}: {
  data: {
    daily: userApis.ApiUser.BlogItem[];
    week: userApis.ApiUser.BlogItem[];
  };
  hidden?: boolean;
} & BlogType &
  ChakraProps) => {
  const t = useTranslations('docs');

  return (
    <Box
      pos="sticky"
      top="60px"
      w="300px"
      minH="100%"
      px={3}
      hidden={hidden}
      overflowY="auto"
      {...props}
    >
      <Accordion
        defaultIndex={type === 'daily' ? [0] : [1]}
        allowMultiple
        borderColor="transparent"
      >
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {t('dailySpotlights')}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <AccordionItemChlidren data={data.daily} type="daily" />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {t('weekSpotlights')}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <AccordionItemChlidren data={data.week} type="week" />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

// const ContentGuide = () => {
//   return (
//     <VStack
//     pos="sticky"
//     top="92px"
//     overflow={'100%'}
//     maxW="150px"
//     w="full"
//     h="100%"
//     borderLeft="1px solid #dadde1"
//     p="8px 0 8px 8px"
//     spacing={2}
//     align="flex-start"
//     fontSize="12px"
//     // hidden={!isLargerThan768}
//   >
//     {data.map((v, i) => (
//       <VStack key={i} spacing={2} align="flex-start">
//         <Box
//           cursor="pointer"
//           _hover={{ color: '#538ce9' }}
//           pl={v.type === 'h3' ? 3 : 0}
//         >
//           {v.title}
//         </Box>
//       </VStack>
//     ))}
//   </VStack>
//   )
// }

const DocsPage = ({
  list,
  blogContent,
  type,
}: {
  list: {
    daily: userApis.ApiUser.BlogItem[];
    week: userApis.ApiUser.BlogItem[];
  };
  blogContent: string;
} & BlogType) => {
  console.log(list, 999);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMounted = useMounted();
  const btnRef = useRef<any>();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  // const [contentGuide, setContentGuide] = useState<any[]>([]);

  // useEffect(() => {
  // const arr = mdRef.current.outerHTML.match(/^<.*h2.*>|<.*h3.*>$/g)
  // setContentGuide(((arr || [])).map((v: string, i: number)=> {
  //   return { type: /^<h2/.test(v)? 'h2': 'h3', id: i, title: v.match(/>(.*)<\//)![1]}
  // }))
  // }, []);

  if (!isMounted) return null;

  return (
    <>
      <CommonHead title="Insights" />
      <Flex direction="column" minH="100vh">
        <DocsHeader
          leftRender={
            <IconButton
              onClick={onOpen}
              fontSize={20}
              icon={<NavMenuIcon />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
              hidden={isLargerThan768}
            />
          }
        />
        {!!(list.daily.length || list.week.length) && (
          <Flex w="full" flex={1}>
            <BlogList
              type={type}
              data={list}
              hidden={!isLargerThan768}
              borderRight="1px solid #c1c7cd"
              py="16px"
              sx={{ height: 'calc(100vh - 60px)' }}
            />
            <Box
              flex={1}
              maxW={{ md: '800px', base: '100vw' }}
              px={isLargerThan768 ? 12 : 3}
              py={8}
              data-color-mode="light"
              minH="100%"
            >
              <MarkdownPreview source={blogContent} />
            </Box>
          </Flex>
        )}
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
          size="xs"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody pt={10} px={0}>
              <BlogList data={list} type={type} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
      <Footer bg="#000" />
    </>
  );
};

DocsPage.getLayout = (page: React.ReactNode) => <>{page}</>;

export default DocsPage;

import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export const getServerSideProps: GetServerSideProps = async ({
  query,
  locale,
  req,
}) => {
  const messages = await serverSideTranslations(locale, ['docs']);

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
    const { id, type } = query;
    const [{ data: daliyBlogs }, { data: weekBlogs }] = await Promise.all([
      userApis.allBlogList({ locale: locale || 'en', section: 0 }),
      userApis.allBlogList({ locale: locale || 'en', section: 1 }),
    ]);
    return {
      props: {
        messages,
        type,
        list: {
          daily: daliyBlogs.publication_list,
          week: weekBlogs.publication_list,
        },
        blogContent:
          (type === 'daily' ? daliyBlogs : weekBlogs).publication_list.filter(
            (v) => v.id === Number(id),
          )[0]?.content || '',
      },
    };
  } catch (error) {
    return {
      props: {
        messages,
      },
    };
  }
};
