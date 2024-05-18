import {
  Box,
  Text,
  HStack,
  IconButton,
  Icon,
  ButtonGroup,
  ButtonGroupProps,
  Flex,
  BoxProps,
  Link,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  useMediaQuery,
} from '@chakra-ui/react';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { ShimmerImage } from '@/components/Image';
import { useRequest } from 'ahooks';
import { getSeoArticleList } from '@/services/home';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import ZhFooter from './ZhFooter';

export const FooterSocialButtons = (props: ButtonGroupProps) => (
  <ButtonGroup spacing={4} justifyContent="flex-end" {...props}>
    <IconButton
      aria-label=""
      bg="none"
      icon={<Icon as={AiFillInstagram} fontSize={28} />}
    />
    <IconButton
      aria-label=""
      bg="none"
      icon={<Icon as={FaTwitter} fontSize={24} />}
    />
    <IconButton
      aria-label=""
      bg="none"
      icon={<Icon as={FaDiscord} fontSize={24} />}
    />
  </ButtonGroup>
);

const splitArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export function Footer(props?: any) {
  const t = useTranslations('common');
  const [isLargerThan992] = useMediaQuery('(min-width: 992px)');
  const [wpList, setWpList] = useState(props?.seoarticle?.wp_list || []);
  const router = useRouter();
  const seoArtickleReq = useRequest(getSeoArticleList, {
    manual: true,
  });

  const getList = async () => {
    let result = [];
    try {
      result = await seoArtickleReq.runAsync();
      setWpList(result?.data?.wp_list || []);
    } catch (err) {}
  };

  useEffect(() => {
    getList();
  }, [router?.locale]);

  return router?.locale === 'zh' ? (
    <ZhFooter />
  ) : (
    <Box
      // bg="linear-gradient(92.64deg, #A29AFF 1.95%, #A29AFF 101.86%);"
      bg="#000"
      color="primary.main"
      {...props}
    >
      {/* PC端视图 */}
      {isLargerThan992 && (
        <Flex
          maxW={{ md: '1440px' }}
          padding="37.5px 60px"
          flexDirection={'row'}
          color={'#FFFFFF'}
          margin="0 auto"
        >
          <Flex flexDirection={'column'} fontSize={'14px'} fontWeight={400}>
            <HStack justify={'flex-start'}>
              <ShimmerImage
                src={'/logo_text_white.png'}
                w={{ md: '140px', xl: '222px' }}
                h={{ md: '20px', xl: '32px' }}
              />
            </HStack>
            <Flex justify={'flex-start'} mt={'22px'} align={'center'}>
              <HStack fontWeight={'700'} spacing={2} lineHeight={'22px'}>
                <Text>Copyright 2024 UneMeta</Text>
                <Text>|</Text>
                <Text fontSize={'12px'}>{t('footer.copyright2')}</Text>
              </HStack>
            </Flex>
            <HStack justify={'flex-start'} mt={'22px'}>
              <Box fontWeight={'700'}>Audited By</Box>
              <ShimmerImage
                src={'/sl.png'}
                w={{ base: '90px', md: '120px' }}
                h={{ base: '30px', md: '40px' }}
              />
            </HStack>
            <Box fontWeight={700} mt={'22px'}>
              Join the community
            </Box>
            <HStack spacing={4} justify={'flex-start'} mt={'6px'}>
              <a
                href="https://twitter.com/UneWeb3"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/images/home/30_1.png"
                  alt="twitter"
                  width={'30px'}
                  height={'30px'}
                />
              </a>
              <a
                href="https://discord.com/invite/YzztkC6ENe"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/images/home/30_04.png"
                  alt="discord"
                  width={'30px'}
                  height={'30px'}
                />
              </a>
              <a
                href="https://www.youtube.com/channel/UCvYWUqizAdr0MLBRuAdGixQ"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/images/home/30_07.png"
                  alt="youtube"
                  width={'30px'}
                  height={'30px'}
                />
              </a>
              <a
                href="mailto:UneMeta_JP@outlook.com"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/images/home/30_02.png"
                  alt="email"
                  width={'30px'}
                  height={'30px'}
                />
              </a>
              <a
                href=" https://www.instagram.com/unemeta.verse/ "
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/images/home/30_06.png"
                  alt="ins: "
                  width={'30px'}
                  height={'30px'}
                />
              </a>
              <a
                href=" https://www.threads.net/@unemeta.verse "
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/images/home/30_05.png"
                  alt="ins: "
                  width={'30px'}
                  height={'30px'}
                />
              </a>
            </HStack>
          </Flex>
          <Flex flexDirection="column" className="w-full">
            {splitArray(wpList, 6)?.map((wpItem: any, wpIndex: any) => {
              return (
                <Flex
                  key={wpIndex}
                  ml="60px"
                  className="w-full flex justify-center items-start px-[50px]"
                >
                  {wpItem
                    ?.filter(
                      (item: any) =>
                        item?.name != 'NFT101' && item.name != 'Buddy Project',
                    )
                    ?.map((item: any, itemIndex: any) => {
                      return (
                        <Flex
                          w={'120px'}
                          ml={itemIndex > 0 ? '40px' : 0}
                          mb={'30px'}
                          justifyContent={'flex-start'}
                          key={`item-${itemIndex}`}
                          className="flex-1"
                        >
                          <Flex flexDirection={'column'} w={'100%'}>
                            <Text
                              fontSize="16px"
                              fontWeight="600"
                              lineHeight="22px"
                            >
                              {item.name}
                            </Text>
                            <Flex mt="8px" flexDirection={'column'}>
                              {item.content_list.map(
                                (contentItem: any, contentIndex: number) => {
                                  return (
                                    <Link
                                      href={contentItem.link}
                                      target="_blank"
                                      mt="8px"
                                      fontSize="12px"
                                      fontWeight={300}
                                      key={`contentItem-${contentIndex}`}
                                    >
                                      {contentItem.title}
                                    </Link>
                                  );
                                },
                              )}
                            </Flex>
                          </Flex>
                        </Flex>
                      );
                    })}
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      )}
      {/* 移动端视图 */}
      {!isLargerThan992 && (
        <Flex flexDirection="column" color="white" padding="0 15px">
          <Accordion allowMultiple>
            {wpList
              ?.filter(
                (item: any) =>
                  item?.name !== 'NFT101' && item.name !== 'Buddy Project',
              )
              ?.map((wpItem: any, wpIndex: any) => {
                return (
                  <AccordionItem
                    key={`wpItem-${wpIndex}`}
                    borderTop="1px solid rgba(255,255,255,0.2)"
                    borderBottom="none"
                  >
                    <AccordionButton padding="8px 0">
                      <Box
                        as="span"
                        flex="1"
                        textAlign="left"
                        fontSize="14px"
                        fontWeight={700}
                      >
                        {wpItem.name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} pt="0" pl={0}>
                      <Flex flexDirection={'column'}>
                        {wpItem.content_list.map(
                          (contentItem: any, contentIndex: number) => {
                            return (
                              <Link
                                href={contentItem.link}
                                target="_blank"
                                fontSize="12px"
                                mt="8px"
                                color="rgba(255,255,255,0.45)"
                                key={`contentItem-${contentIndex}`}
                                fontWeight={700}
                              >
                                {contentItem.title}
                              </Link>
                            );
                          },
                        )}
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
          </Accordion>
          <Box pt="30px" mb="26px" borderTop="1px solid rgba(255,255,255,0.2)">
            <Flex
              flexDirection={'column'}
              alignItems="center"
              fontSize={'12px'}
              fontWeight={400}
            >
              <Text>Join the community</Text>
              <HStack spacing={4} justify={'flex-start'} mt={'8px'}>
                <a
                  href="https://twitter.com/UneWeb3"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/images/home/30_1.png"
                    alt="twitter"
                    width={'24px'}
                    height={'24px'}
                  />
                </a>
                <a
                  href="https://discord.com/invite/YzztkC6ENe"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/images/home/30_04.png"
                    alt="discord"
                    width={'24px'}
                    height={'24px'}
                  />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCvYWUqizAdr0MLBRuAdGixQ"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/images/home/30_07.png"
                    alt="youtube"
                    width={'24px'}
                    height={'24px'}
                  />
                </a>
                <a
                  href="mailto:UneMeta_JP@outlook.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/images/home/30_02.png"
                    alt="email"
                    width={'24px'}
                    height={'24px'}
                  />
                </a>
                <a
                  href=" https://www.instagram.com/unemeta.verse/ "
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/images/home/30_06.png"
                    alt="ins"
                    width={'24px'}
                    height={'24px'}
                  />
                </a>
                <a
                  href=" https://www.threads.net/@unemeta.verse "
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/images/home/30_05.png"
                    alt="threads"
                    width={'24px'}
                    height={'24px'}
                  />
                </a>
              </HStack>
              <ShimmerImage
                mt="32px"
                src={'/logo_text_white.png'}
                w={'166px'}
                h={'24px'}
              />
              <Flex justify={'flex-start'} mt={'16px'} align={'center'}>
                <HStack spacing={2} lineHeight={'22px'}>
                  <Text>Copyright 2024 UneMeta</Text>
                  <Text>|</Text>
                  <Text>{t('footer.copyright2')}</Text>
                </HStack>
              </Flex>
              <HStack justify={'flex-start'} mt={'6px'}>
                <Box fontWeight={'500'}>Audited By </Box>
                <ShimmerImage src={'/sl.png'} w="66px" h="22px" />
              </HStack>
            </Flex>
          </Box>
        </Flex>
      )}
    </Box>
  );
}
