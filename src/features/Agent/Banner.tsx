import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  useToast,
  VStack,
  Container,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { IoCopyOutline } from 'react-icons/io5';
import { CiEdit } from 'react-icons/ci';
import {
  GeneratorLinkModal,
  GeneratorLinkModalRef,
} from './GeneratorLinkModal';
import { useContext, useRef } from 'react';
import { AgentContext } from './Context';
import useCopy from '@/hooks/useCopy';
import { useMounted } from '@/hooks/useMounted';

export const AgentBanner = () => {
  const t = useTranslations('promoter');
  const { data } = useContext(AgentContext);
  const [, setCopy] = useCopy();
  const isMounted = useMounted();
  const toast = useToast();
  const generatorLinkModalRef = useRef<GeneratorLinkModalRef>(null);
  return (
    <>
      <Box
        w="full"
        bg="#161C21"
        minH={{ base: 'calc(100vh - 72px)', md: '540px' }}
        px={{ base: '18px', md: 0 }}
        py={{ base: '44px', md: '50px' }}
      >
        <Stack
          mx="auto"
          spacing={['20px', '30px']}
          direction={{ base: 'column', md: 'row' }}
          maxW={{ base: 'full', md: 'draft' }}
        >
          <Box pt="25px" color="white" fontFamily={'Inter'} mb={['10px', 0]}>
            <Heading
              wordBreak="break-word"
              fontWeight={700}
              fontSize={{ base: '32px', md: '64px' }}
              lineHeight={{ base: '40px', md: '80px' }}
              mb={['14px', '40px']}
            >
              {t('banner.title')}
            </Heading>
            <Box
              fontSize={['13px', '20px']}
              lineHeight={['20px', '30px']}
              maxW={['full', '460px']}
            >
              {t('banner.desc')}
            </Box>

            <HStack mt="40px" spacing={'20px'} display={['none', 'flex']}>
              <Button
                w="200px"
                h="60px"
                onClick={() => generatorLinkModalRef.current?.open()}
                fontSize={'18px'}
                fontWeight={700}
                bg="#7065F0"
                color="white"
                rounded="full"
                _hover={{ opacity: 0.8 }}
                _active={{
                  bg: '#7065F0',
                }}
              >
                {t('banner.invite')}
              </Button>

              <Button
                w="200px"
                h="60px"
                fontSize={'18px'}
                fontWeight={700}
                bg="white"
                color="#1F2148"
                rounded="full"
                border="1px solid #00000"
                _hover={{ opacity: 0.8 }}
                _active={{
                  bg: 'white',
                }}
              >
                {t('banner.detail')}
              </Button>
            </HStack>
          </Box>

          <Flex
            direction={'column'}
            fontFamily="Inter"
            flexShrink={0}
            bg="white"
            rounded="12px"
            boxShadow={'0px 4px 15px rgba(0, 0, 0, 0.15);'}
            w={{ base: 'full', md: '600px' }}
            h={{ base: '335px', md: '440px' }}
            pos="relative"
          >
            <Button
              onClick={() => generatorLinkModalRef.current?.open()}
              color="white"
              w={['128px', '180px']}
              h={['28px', '48px']}
              fontSize={['12px', '16px']}
              rounded="5px"
              bg="#1F2148"
              pos="absolute"
              top={['10px', '20px']}
              right={['10px', '28px']}
              fontWeight={400}
              _hover={{
                opacity: 0.8,
              }}
              _active={{
                bg: '#1F2148',
              }}
            >
              {t('generateLinks')}
            </Button>
            <VStack
              spacing={['10px', '20px']}
              w="full"
              align="self-start"
              p={['20px 12px', '30px 42px']}
              color="#1F2148"
            >
              <Box>
                <Box
                  fontSize={['13px', '20px']}
                  lineHeight={['13px', '26px']}
                  mb="4px"
                >
                  {t('invitationID')}:
                </Box>
                <Flex w="full" align="center">
                  <Box
                    color="#1F2148"
                    lineHeight={['13px', '28px']}
                    fontSize={['13px', '22px']}
                    fontWeight={700}
                    minW={['auto', '120px']}
                  >
                    {data.join_me_info.code}
                  </Box>
                  <IconButton
                    onClick={async () => {
                      await setCopy(data.join_me_info.code);
                      toast({
                        status: 'success',
                        title: t('copyLink'),
                        variant: 'subtle',
                      });
                    }}
                    ml={['0px', '16px']}
                    fontSize={['18px', '22px']}
                    variant="ghost"
                    aria-label="copy"
                    icon={<IoCopyOutline />}
                  />
                </Flex>
              </Box>
              <Box w="full">
                <Box
                  fontSize={['13px', '20px']}
                  lineHeight={['13px', '26px']}
                  mb="4px"
                >
                  {t('invitationLinks')}:
                </Box>
                <Flex w="full" align="center">
                  <Container
                    p={0}
                    color="#1F2148"
                    lineHeight={['13px', '28px']}
                    fontSize={['13px', '22px']}
                    fontWeight={700}
                  >
                    {isMounted &&
                      `${window.location.origin}/agent/invite?agentInviteCode=${data.join_me_info.code}`}
                    <IconButton
                      ml={['0px', '16px']}
                      fontSize={['18px', '22px']}
                      variant="ghost"
                      aria-label="copy"
                      icon={<IoCopyOutline />}
                      onClick={async () => {
                        await setCopy(
                          `${window.location.origin}/agent/invite?agentInviteCode=${data.join_me_info.code}`,
                        );
                        toast({
                          status: 'success',
                          title: t('copyLink'),
                          variant: 'subtle',
                        });
                      }}
                    />
                  </Container>
                </Flex>
              </Box>
              <Box w="full">
                <Box
                  fontSize={['13px', '20px']}
                  lineHeight={['13px', '26px']}
                  mb="4px"
                >
                  {t('remarks')}:
                </Box>
                <Flex w="full" align="center">
                  <Container
                    p={0}
                    color="#1F2148"
                    lineHeight={['13px', '28px']}
                    fontSize={['13px', '22px']}
                    fontWeight={700}
                  >
                    {data.join_me_info.description || '-'}
                    <IconButton
                      onClick={() => generatorLinkModalRef.current?.open()}
                      ml={['0px', '16px']}
                      fontSize={['18px', '22px']}
                      variant="ghost"
                      aria-label="copy"
                      icon={<CiEdit />}
                    />
                  </Container>
                </Flex>
              </Box>
            </VStack>

            <Box h="2px" bg="#F2F2F2" display="none" />

            <HStack flex="1" justify="space-around" display="none">
              <VStack spacing={'8px'}>
                <Text
                  fontSize={['16px', '20px']}
                  color="#1F2148"
                  fontWeight={700}
                >
                  50%
                </Text>
                <Text
                  fontSize={['14px', '20px']}
                  color="##000929"
                  opacity={0.6}
                >
                  Friends'rebate
                </Text>
              </VStack>
              <VStack spacing={'8px'}>
                <Text
                  fontSize={['16px', '20px']}
                  color="#1F2148"
                  fontWeight={700}
                >
                  200%
                </Text>
                <Text
                  fontSize={['14px', '20px']}
                  color="##000929"
                  opacity={0.6}
                >
                  My rebate
                </Text>
              </VStack>
            </HStack>
          </Flex>

          <VStack spacing={'10px'} display={['flex', 'none']}>
            <Button
              w="160px"
              h="40px"
              fontSize={'13px'}
              fontWeight={700}
              bg="white"
              color="#1F2148"
              rounded="full"
              border="1px solid #00000"
              _hover={{ opacity: 0.8 }}
            >
              {t('banner.detail')}
            </Button>

            <Button
              onClick={() => generatorLinkModalRef.current?.open()}
              w="160px"
              h="40px"
              fontSize={'13px'}
              fontWeight={700}
              bg="#7065F0"
              color="white"
              rounded="full"
              _hover={{ opacity: 0.8 }}
            >
              {t('banner.invite')}
            </Button>
          </VStack>
        </Stack>
      </Box>
      <GeneratorLinkModal ref={generatorLinkModalRef} />
    </>
  );
};
