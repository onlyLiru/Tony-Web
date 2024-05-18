import {
  Box,
  Flex,
  AspectRatio,
  HStack,
  Text,
  ChakraProps,
  useMediaQuery,
} from '@chakra-ui/react';
import NexLink from 'next/link';
import Image, { ShimmerImage } from '@/components/Image';
import StatusBtn from './components/StatusBtn';

export const BannerItem = (
  props: ChakraProps & { data: any; styles?: any },
) => {
  const { data, styles } = props;
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const imgUrl = isLargerThan768
    ? data?.image_url
    : data?.mobile_banner || data?.image_url;
  const title = isLargerThan768 ? data?.title : data?.mobile_title;

  const renderMobileDescArea = () => {
    if (!isLargerThan768) {
      if (data?.mobile_desc)
        return (
          <Text fontSize={14} color="rgba(255,255,255,0.65)" noOfLines={2}>
            {data?.mobile_desc}
          </Text>
        );
      if (data?.mobile_tag)
        return (
          <Text
            display={'inline-block'}
            borderRadius={4}
            background="#E4CFFF"
            color="#8A33FF"
            fontWeight={500}
            padding={'3px 11px'}
            fontSize={'12px'}
          >
            {data?.mobile_tag}
          </Text>
        );
    }

    return null;
  };
  return (
    <>
      {isLargerThan768 ? (
        <Box
          // px={{ md: '40px', base: '0' }}
          // py={{ lg: '46px', md: '24px', base: '15px' }}
          mx="auto"
          overflow="visible !important"
          {...styles}
        >
          <NexLink href={data?.link}>
            <Box
              cursor="pointer"
              maxW={{ md: 'full', base: '85vw' }}
              height={{ md: 'auto', base: '310px' }}
              mx="auto"
            >
              {data?.video ? (
                <Box
                  pos={'relative'}
                  zIndex={2}
                  w="full"
                  h="full"
                  pb={{ md: '44%' }}
                >
                  <Box
                    pos="absolute"
                    left="0"
                    bottom="0"
                    h="100%"
                    // borderRadius={'0 0 28px 28px'}
                    w="100%"
                    bg="linear-gradient(270deg, rgba(0,0,0,0) 0%, #000000 100%)"
                    opacity={'.63'}
                  ></Box>
                  <Box pos="absolute" left="0" bottom="0" h="100%" w="100%">
                    <video
                      loop
                      muted
                      autoPlay
                      key={'videos1'}
                      // playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    >
                      <source src={'/videos/banner1.mp4'} type="video/mp4" />
                    </video>
                  </Box>
                </Box>
              ) : (
                <Box
                  pos={'relative'}
                  zIndex={2}
                  w="full"
                  h="full"
                  pb={{ md: '44%' }}
                  bgImage={imgUrl}
                  bgPos="center"
                  bgSize="cover"
                  bgRepeat={'no-repeat'}
                  // rounded={{ md: '28px', base: '16px' }}
                >
                  <Box
                    pos="absolute"
                    left="0"
                    bottom="0"
                    h="100%"
                    // borderRadius={'0 0 28px 28px'}
                    w="100%"
                    bg="linear-gradient(270deg, rgba(0,0,0,0) 0%, #000000 100%)"
                    opacity={'.63'}
                  ></Box>
                </Box>
              )}
            </Box>
          </NexLink>
        </Box>
      ) : (
        <Box mx="auto" overflow="visible !important" {...styles}>
          <NexLink href={data?.link}>
            <Box
              cursor="pointer"
              maxW={'100%'}
              height={{ md: 'auto', base: '310px' }}
              mx="auto"
            >
              {data?.video ? (
                <Box
                  pos={'relative'}
                  zIndex={2}
                  w="full"
                  // h="full"
                  // pb={'84%'}
                  height={'718px'}
                  bgImage={imgUrl}
                  bgPos="center"
                  bgSize="cover"
                  bgRepeat={'no-repeat'}
                  // rounded={{ md: '28px', base: '16px' }}
                >
                  <Box
                    pos="absolute"
                    left="0"
                    bottom="0"
                    h="100%"
                    // borderRadius={'0 0 28px 28px'}
                    w="100%"
                    bg="linear-gradient(270deg, rgba(0,0,0,0) 0%, #000000 100%)"
                    opacity={'.63'}
                  ></Box>
                  <Box pos="absolute" left="0" bottom="0" h="100%" w="100%">
                    <video
                      loop
                      muted
                      autoPlay
                      key={'videos2'}
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    >
                      <source src={'/videos/banner2.mp4'} type="video/mp4" />
                    </video>
                  </Box>
                </Box>
              ) : (
                <Box
                  pos={'relative'}
                  zIndex={2}
                  w="full"
                  // h="full"
                  // pb={'84%'}
                  height={'718px'}
                  bgImage={imgUrl}
                  bgPos="center"
                  bgSize="cover"
                  bgRepeat={'no-repeat'}
                  // rounded={{ md: '28px', base: '16px' }}
                >
                  <Box
                    pos="absolute"
                    left="0"
                    bottom="0"
                    h="100%"
                    // borderRadius={'0 0 28px 28px'}
                    w="100%"
                    bg="linear-gradient(270deg, rgba(0,0,0,0) 0%, #000000 100%)"
                    opacity={'.63'}
                  ></Box>
                </Box>
              )}
            </Box>
          </NexLink>
        </Box>
      )}
    </>
  );
};

export default BannerItem;
