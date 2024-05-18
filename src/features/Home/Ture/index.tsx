import {
  Box,
  Flex,
  Text,
  createIcon,
  HStack,
  Stack,
  Link,
  Divider,
  useMediaQuery,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import Image, { ShimmerImage } from '@/components/Image';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useRequest } from 'ahooks';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useTranslations } from 'next-intl';
import { ETH, BNB } from '@/components/Icon';
import { ModuleTitle } from '../components';
import { staticChainId } from '@/store';
import { getAllInfo } from '@/services/home';
import { sliceIntoChunks } from '@/utils';

interface IListItem {
  vol: string;
  vol_in_week: string;
  order: number;
}

export const Ture = (props: any) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const t = useTranslations('index');
  const [loaded, setLoaded] = useState(false);
  const [dataInfo, setDataInfo] = useState<any>({});
  // const [list, updateList] = useState(props.recommondData || []);
  const [currentSort, setCurrentSort] = useState('volIn7Days');
  const [isOpen, updateOpenStatus] = useState(false);
  const router = useRouter();
  const { runAsync } = useRequest(getAllInfo, {
    manual: true,
  });

  // const getList = async () => {
  //   let data: any = [];
  //   try {
  //     data = await runAsync();
  //     setDataInfo(data.data);
  //     console.log(data.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  //   // data?.data?.list && updateList(handleSort(data.data.list, 'volIn7Days'));
  // };

  // useEffect(() => {
  //   getList();
  // }, []);

  const onClose = () => {
    updateOpenStatus(false);
  };

  return (
    <>
      {isLargerThan768 ? (
        <Box
          pt={{ lg: '100px', base: '0px' }}
          pb={{ md: '100px', base: '0px' }}
          // maxW={{ md: '1270px' }}
          bg={'#0a0a0a'}
          mx="auto"
          color={'#fff'}
          mt={{ md: 0, base: '16px' }}
        >
          <Box position={'relative'} mx="auto" maxW={{ md: '1200px' }}>
            {/* <Image
              src="/images/home/ture1.png"
              position={'absolute'}
              right={'-100px'}
              top={'90px'}
              w={'482px'}
              h={'494px'}
            /> */}
            <Box fontSize={'60px'} fontWeight={'500'} textAlign={'center'}>
              #BUIDL The Layer With True Fans
            </Box>
            <Box display={'flex'} justifyContent={'center'} mt={'80px'}>
              <Box
                border={'1px solid rgba(255, 255, 255, 0.4)'}
                px={'24px'}
                pt={'30px'}
                borderRadius={'24px'}
                position={'relative'}
                h={'372px'}
              >
                <Text color={'rgba(228, 159, 92, 1)'} fontSize={'20px'}>
                  Authentic Engagement
                </Text>
                <Text color={'#fff'} fontSize={'16px'} w={'320px'} mt={'16px'}>
                  Immerse yourself in captivating experiences that foster a
                  strong sense of connection and participation.
                </Text>
                <Image
                  src="/images/home/ture1.png"
                  w={'320px'}
                  // mt={'70px'}
                  position={'absolute'}
                  bottom={'0'}
                  left={'0'}
                  right={'0'}
                  mx={'auto'}
                />
              </Box>
              <Box
                ml={'24px'}
                border={'1px solid rgba(255, 255, 255, 0.4)'}
                px={'24px'}
                pt={'30px'}
                borderRadius={'24px'}
                position={'relative'}
                h={'372px'}
              >
                <Text color={'rgba(228, 159, 92, 1)'} fontSize={'20px'}>
                  Fan Economy
                </Text>
                <Text color={'#fff'} fontSize={'16px'} w={'320px'} mt={'16px'}>
                  Gain access to unique fan-centric experiences that are
                  unavailable elsewhere.
                </Text>
                <Image
                  src="/images/home/ture2.png"
                  w={'250px'}
                  position={'absolute'}
                  bottom={'0'}
                  left={'0'}
                  right={'0'}
                  mx={'auto'}
                />
              </Box>
              <Box
                ml={'24px'}
                border={'1px solid rgba(255, 255, 255, 0.4)'}
                px={'24px'}
                pt={'30px'}
                borderRadius={'24px'}
                position={'relative'}
                h={'372px'}
              >
                <Text color={'rgba(228, 159, 92, 1)'} fontSize={'20px'}>
                  Community Co-creation
                </Text>
                <Text color={'#fff'} fontSize={'16px'} w={'320px'} mt={'16px'}>
                  Unleash your creativity and actively contribute to the IP's
                  growth. Together, we'll build a community where your
                  contributions matter, fostering a sense of ownership and
                  loyalty.
                </Text>
                <Image
                  src="/images/home/ture3.png"
                  w={'240px'}
                  position={'absolute'}
                  bottom={'0'}
                  left={'0'}
                  right={'0'}
                  mx={'auto'}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          pt={'60px'}
          pb={'60px'}
          // maxW={{ md: '1270px' }}
          bg={'#0a0a0a'}
          mx="auto"
          color={'#fff'}
          // mt={{ md: 0, base: '16px' }}
        >
          <Box position={'relative'} mx="auto">
            {/* <Image
              src="/images/home/point_logo.png"
              position={'absolute'}
              left={'-60px'}
              top={'-40px'}
              w={'210px'}
              h={'223px'}
            /> */}
            <Box
              fontSize={'36px'}
              fontWeight={'700'}
              textAlign={'center'}
              lineHeight={'40px'}
              px={'30px'}
            >
              #BUIDL The Layer With True Fans
              {/* <Text>UUU</Text> <Text color={'#535353'}>POINT</Text> */}
            </Box>

            <Box mt={'40px'} px={'16px'}>
              <Box
                border={'1px solid rgba(255, 255, 255, 0.4)'}
                px={'24px'}
                pt={'30px'}
                borderRadius={'24px'}
                position={'relative'}
                h={'372px'}
              >
                <Text color={'rgba(228, 159, 92, 1)'} fontSize={'20px'}>
                  Authentic Engagement
                </Text>
                <Text color={'#fff'} fontSize={'16px'} mt={'16px'}>
                  Immerse yourself in captivating experiences that foster a
                  strong sense of connection and participation.
                </Text>
                <Image
                  src="/images/home/ture1.png"
                  w={'280px'}
                  // mt={'70px'}
                  position={'absolute'}
                  bottom={'0'}
                  left={'0'}
                  right={'0'}
                  mx={'auto'}
                />
              </Box>
              <Box
                mt={'16px'}
                border={'1px solid rgba(255, 255, 255, 0.4)'}
                px={'24px'}
                pt={'30px'}
                borderRadius={'24px'}
                position={'relative'}
                h={'372px'}
              >
                <Text color={'rgba(228, 159, 92, 1)'} fontSize={'20px'}>
                  Fan Economy
                </Text>
                <Text color={'#fff'} fontSize={'16px'} mt={'16px'}>
                  Gain access to unique fan-centric experiences that are
                  unavailable elsewhere.
                </Text>
                <Image
                  src="/images/home/ture2.png"
                  w={'230px'}
                  position={'absolute'}
                  bottom={'0'}
                  left={'0'}
                  right={'0'}
                  mx={'auto'}
                />
              </Box>
              <Box
                mt={'16px'}
                border={'1px solid rgba(255, 255, 255, 0.4)'}
                px={'24px'}
                pt={'30px'}
                borderRadius={'24px'}
                position={'relative'}
                h={'372px'}
              >
                <Text color={'rgba(228, 159, 92, 1)'} fontSize={'20px'}>
                  Community Co-creation
                </Text>
                <Text color={'#fff'} fontSize={'16px'} mt={'16px'}>
                  Unleash your creativity and actively contribute to the IP's
                  growth. Together, we'll build a community where your
                  contributions matter, fostering a sense of ownership and
                  loyalty.
                </Text>
                <Image
                  src="/images/home/ture3.png"
                  w={'200px'}
                  position={'absolute'}
                  bottom={'0'}
                  left={'0'}
                  right={'0'}
                  mx={'auto'}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
