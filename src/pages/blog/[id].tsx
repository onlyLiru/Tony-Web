import type { GetServerSidePropsContext } from 'next';
import { useTranslations } from 'next-intl';
import { serverSideTranslations } from '@/i18n';
import {
  Box,
  Text,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  Flex,
  Tag,
  LinkBox,
  LinkOverlay,
  IconButton,
} from '@chakra-ui/react';
import * as blogApis from '@/services/blog';
import { format } from 'date-fns';
import Image from '@/components/Image';
import NextLink from 'next/link';
import { shareUtil } from '@/utils/share';
import { useRouter } from 'next/router';
import { FaFacebook, FaTwitter, FaGoogle, FaDiscord } from 'react-icons/fa';
import { getBaseUrl } from '@/utils/getBaseUrl';

const ShareLinks = ({
  data,
}: {
  data: blogApis.ApiBlog.getAlbumInfo['album_info'];
}) => {
  const { locale } = useRouter();
  const shareLink = `${getBaseUrl()}/${locale}/blog/${data.album_id}`;
  return (
    <HStack
      w="full"
      spacing={4}
      borderTopWidth={1}
      borderColor="primary.gray"
      justifyContent={'flex-end'}
      py={5}
    >
      <NextLink href={shareUtil.getFacebookShareUrl({ url: shareLink })}>
        <a target={'_blank'}>
          <IconButton aria-label="" icon={<FaFacebook fontSize={20} />} />
        </a>
      </NextLink>
      <NextLink
        href={shareUtil.getTwitterShareUrl({
          url: shareLink,
          text: data.title,
        })}
      >
        <a target={'_blank'}>
          <IconButton aria-label="" icon={<FaTwitter fontSize={20} />} />
        </a>
      </NextLink>
      <NextLink
        href={shareUtil.getGooglePlusShareUrl({
          url: shareLink,
          text: data.title,
        })}
      >
        <a target={'_blank'}>
          <IconButton aria-label="" icon={<FaGoogle fontSize={20} />} />
        </a>
      </NextLink>

      <NextLink
        href={shareUtil.getGooglePlusShareUrl({
          url: shareLink,
          text: data.title,
        })}
      >
        <a target={'_blank'}>
          <IconButton aria-label="" icon={<FaDiscord fontSize={20} />} />
        </a>
      </NextLink>
    </HStack>
  );
};

export default function BlogPage({
  data,
}: {
  data: blogApis.ApiBlog.getAlbumInfo;
}) {
  const t = useTranslations('index');
  return (
    <>
      <SimpleGrid
        my={10}
        px={5}
        fontFamily={'Inter'}
        mx="auto"
        spacing={{ base: 5, md: 20 }}
        maxW={{ base: 'full', md: 'draft' }}
        templateColumns={{ base: '1fr', md: '2fr 1fr' }}
      >
        <Box>
          <Heading as="h1">
            {'PlayerX Has Landed - Walk As One Alpha Test'}
          </Heading>
          <HStack
            borderBottomWidth={1}
            borderColor="primary.gray"
            color="typo.sec"
            py={5}
            spacing={2}
          >
            <Text>
              {format(
                new Date(data.album_info.release_time * 1000),
                'MMM dd, yyyy',
              )}
            </Text>
            <Text color="primary.main"> UneMeta - UneMeta Offical</Text>
          </HStack>

          <Box
            py={5}
            sx={{
              p: {
                mb: '0',
              },
              img: {
                maxW: 'full',
                my: 5,
              },
            }}
            dangerouslySetInnerHTML={{ __html: data.album_info.content }}
          />
          <Flex justify={'flex-end'} w="full">
            <ShareLinks data={data.album_info} />
          </Flex>
        </Box>
        <VStack
          pos="sticky"
          top="100px"
          spacing={5}
          w="full"
          alignItems={'flex-start'}
        >
          <Heading fontSize={'xl'}>Recent Post</Heading>
          {data.new_release.map((el) => (
            <LinkBox key={el.album_id} w="full">
              <Flex
                w="full"
                borderWidth={2}
                borderColor="primary.gray"
                p={4}
                rounded="lg"
              >
                <Image
                  rounded={'lg'}
                  w="64px"
                  h="64px"
                  objectFit={'cover'}
                  src={el.recommend_image}
                  mr={2}
                />

                <VStack
                  py={1}
                  justifyContent={'space-between'}
                  flex="1"
                  align={'flex-start'}
                  justify={'flex-start'}
                >
                  <NextLink passHref href={`/blog/${el.album_id}`}>
                    <LinkOverlay>
                      <Heading noOfLines={2} size="sm">
                        {el.title}
                      </Heading>
                    </LinkOverlay>
                  </NextLink>
                  <Flex
                    fontSize={'sm'}
                    color="typo.sec"
                    align={'center'}
                    w="full"
                    justify="space-between"
                  >
                    <Text>{el.introduction || 'no introduction content'}</Text>
                    <Text>
                      {format(el.release_time * 1000, 'MMM dd, yyyy')}
                    </Text>
                  </Flex>
                </VStack>
              </Flex>
            </LinkBox>
          ))}

          {!!data.tag_info.length && (
            <Box>
              <Heading fontSize={'2xl'}>Tags</Heading>
              <HStack spacing={4}>
                {data.tag_info.map((el, i) => (
                  <Tag key={i}>{el}</Tag>
                ))}
              </HStack>
            </Box>
          )}
        </VStack>
      </SimpleGrid>
    </>
  );
}

import * as Searcher from 'ip2region-ts';
import path from 'path';
import requestIp from 'request-ip';
export async function getServerSideProps({
  query,
  locale,
  req,
}: GetServerSidePropsContext) {
  const { id } = query as Record<string, string>;
  const messages = await serverSideTranslations(locale, ['index']);
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
    const data = await blogApis.getAlbumInfo({ album_id: +id! });
    return {
      props: {
        data,
        messages,
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
