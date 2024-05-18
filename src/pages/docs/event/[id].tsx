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

const AccordionItemChlidren = ({
  data,
}: {
  data: userApis.ApiUser.EventItem[];
}) => {
  const router = useRouter();
  const active = Number(router.query.id);

  return (
    <VStack w="100%" spacing={6} align="flex-start">
      <VStack spacing={2} w="100%">
        {data.map((v: userApis.ApiUser.EventItem, i: number) => (
          <Link key={i} href={`/docs/event/${v.id}`}>
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

const EventList = ({
  data,
  hidden,
  ...props
}: {
  data: userApis.ApiUser.EventItem[];
  hidden?: boolean;
} & ChakraProps) => {
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
      <Accordion defaultIndex={[0]} allowMultiple borderColor="transparent">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {t('event')}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <AccordionItemChlidren data={data} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

const EventPage = ({
  list,
  content,
}: {
  list: userApis.ApiUser.EventItem[];
  content: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMounted = useMounted();
  const btnRef = useRef<any>();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

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
        {!!list.length && (
          <Flex w="full" flex={1}>
            <EventList
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
              <MarkdownPreview source={content} />
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
              <EventList data={list} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
      <Footer bg="#000" />
    </>
  );
};

EventPage.getLayout = (page: React.ReactNode) => <>{page}</>;

export default EventPage;

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
    const { id } = query;
    const { data } = await userApis.eventList({ locale: locale || 'en' });
    return {
      props: {
        messages,
        list: data.list,
        content: data.list.filter((v) => v.id === Number(id))[0]?.content || '',
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
