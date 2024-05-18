import {
  Box,
  Text,
  Flex,
  ChakraProps,
  useMediaQuery,
  Image,
  Button,
} from '@chakra-ui/react';
import NexLink from 'next/link';

const BannerRewardsItem = (
  props: ChakraProps & { data: any; styles?: any },
) => {
  const { data, styles } = props;
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const imgUrl = isLargerThan768
    ? data?.image_url
    : data?.mobile_banner || data?.image_url;
  const title = isLargerThan768 ? data?.title : data?.mobile_title;

  return (
    <Box overflow="visible !important" {...styles}>
      <NexLink href={data?.link ?? ''}>
        <Box
          cursor="pointer"
          width="full"
          // height="392px"
        >
          <Box
            pos={'relative'}
            zIndex={2}
            w="full"
            h="full"
            // bgImage={imgUrl}
            // bgPos="center"
            // bgSize="100% 100%"
            // bgRepeat={'no-repeat'}
          >
            <Image w="100%" h="100%" src={imgUrl} />
            {title ? (
              <Flex
                pos="absolute"
                bottom="0"
                left="0"
                right="0"
                direction="column"
                w="100%"
                pb="32px"
                pl="45px"
                background="linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%);)"
                backgroundSize={'contain'}
                alignItems="flex-start"
              >
                <Text
                  fontSize="32px"
                  fontFamily="MicrosoftYaHei"
                  fontWeight="700"
                  color="#fff"
                  noOfLines={1}
                >
                  {title}
                </Text>
                {data?.subtitle ? (
                  <Button
                    variant={'primary'}
                    _hover={{
                      bg: 'linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);',
                    }}
                    _disabled={{
                      bg: 'rgba(0, 0, 0, 0.2)',
                    }}
                    px="32px"
                    py="15px"
                    mt="10px"
                    height="56px"
                    textAlign="center"
                    lineHeight="56px"
                    color="#fff"
                    fontSize="20px"
                    fontFamily="MicrosoftYaHei"
                    fontWeight="500"
                    background="linear-gradient(147deg, #C53FF7 0%, #001FFF 50%, #0984FE 100%);"
                    rounded="8px"
                  >
                    {data?.subtitle}
                  </Button>
                ) : null}
              </Flex>
            ) : null}
          </Box>
        </Box>
      </NexLink>
    </Box>
  );
};

export default BannerRewardsItem;
