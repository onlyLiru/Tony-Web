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

export const PointUUU = (props: any) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const t = useTranslations('index');
  const [loaded, setLoaded] = useState(false);
  const [dataInfo, setDataInfo] = useState<any>({});
  const [list, updateList] = useState(props.recommondData || []);
  const [currentSort, setCurrentSort] = useState('volIn7Days');
  const [isOpen, updateOpenStatus] = useState(false);
  const router = useRouter();
  const { runAsync } = useRequest(getAllInfo, {
    manual: true,
  });

  const getList = async () => {
    let data: any = [];
    try {
      data = await runAsync();
      setDataInfo(data.data);
      console.log(data.data);
    } catch (err) {
      console.log(err);
    }
    // data?.data?.list && updateList(handleSort(data.data.list, 'volIn7Days'));
  };

  useEffect(() => {
    getList();
  }, []);

  const onClose = () => {
    updateOpenStatus(false);
  };

  return (
    <>
      {isLargerThan768 ? (
        <Box
          pt={{ lg: '150px', base: '0px' }}
          pb={{ md: '200px', base: '0px' }}
          // maxW={{ md: '1270px' }}
          bg={'#0a0a0a'}
          mx="auto"
          color={'#fff'}
          mt={{ md: 0, base: '16px' }}
        >
          <Box position={'relative'} mx="auto" maxW={{ md: '1200px' }}>
            <Image
              src="/images/home/point_logo.png"
              position={'absolute'}
              right={'-100px'}
              top={'90px'}
              w={'482px'}
              h={'494px'}
            />
            <Box fontSize={'40px'} fontWeight={'900'} lineHeight={'40px'}>
              <Text color={'rgba(228, 159, 92, 1)'}>Community First </Text>
              <Text color={'#fff'}>Our Reward for Our Community Members</Text>
            </Box>
            <Box
              fontSize={'60px'}
              fontWeight={'900'}
              mt={'24px'}
              display={'flex'}
            >
              <Text>UUU</Text>{' '}
              <Text ml={'4px'} color={'#535353'}>
                Point
              </Text>
            </Box>
            <Box display={'flex'} mt={'40px'}>
              <Box>
                <Text
                  color={'rgba(228, 159, 92, 1)'}
                  fontSize={'40px'}
                  fontWeight={'900'}
                >
                  {dataInfo?.all_score_in?.toLocaleString() || 0}
                </Text>
                <Text color={'#535353'} fontSize={'20px'}>
                  Total UUU
                </Text>
              </Box>
              <Box ml={'60px'}>
                <Text
                  color={'rgba(228, 159, 92, 1)'}
                  fontSize={'40px'}
                  fontWeight={'900'}
                >
                  {dataInfo?.today_score_in?.toLocaleString() || 0}
                </Text>
                <Text color={'#535353'} fontSize={'20px'}>
                  Daily UUU rewards
                </Text>
              </Box>
              <Box ml={'60px'}>
                <Text
                  color={'rgba(228, 159, 92, 1)'}
                  fontSize={'40px'}
                  fontWeight={'900'}
                >
                  {dataInfo?.today_score_user?.toLocaleString() || 0}
                </Text>
                <Text color={'#535353'} fontSize={'20px'}>
                  Daily Active Accounts
                </Text>
              </Box>
            </Box>
            <Box display={'flex'} mt={'120px'}>
              <Box
                cursor={'pointer'}
                borderRadius={'12px'}
                h={'48px'}
                w={264}
                bg={'rgba(228, 159, 92, 1)'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                color={'#000'}
                onClick={() => {
                  window.open(`${window.location.origin}/rewards`, '_blank');
                }}
              >
                Get UUU →
              </Box>
              {/* <Box
                cursor={'pointer'}
                ml={'40px'}
                borderRadius={'12px'}
                h={'48px'}
                w={264}
                border={'1px solid #fff'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                color={'#fff'}
              >
                Explore UUU →
              </Box> */}
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
            <Image
              src="/images/home/point_logo.png"
              position={'absolute'}
              left={'-60px'}
              top={'46px'}
              w={'210px'}
              h={'223px'}
            />
            <Box
              fontSize={'20px'}
              fontWeight={'700'}
              lineHeight={'20px'}
              px={'80px'}
              textAlign={'center'}
            >
              <Text color={'rgba(228, 159, 92, 1)'}>Community First </Text>
              <Text color={'#fff'}>Our Reward for Our Community Members</Text>
            </Box>
            <Box
              fontSize={'60px'}
              fontWeight={'900'}
              textAlign={'center'}
              lineHeight={'60px'}
              mt={'16px'}
            >
              <Text>UUU</Text> <Text color={'#535353'}>Point</Text>
            </Box>
            <Box textAlign={'center'} mt={'80px'}>
              <Box>
                <Text
                  color={'rgba(228, 159, 92, 1)'}
                  fontSize={'40px'}
                  fontWeight={'900'}
                >
                  {dataInfo?.all_score_in?.toLocaleString() || 0}
                </Text>
                <Text color={'#535353'} fontSize={'20px'}>
                  Total UUU
                </Text>
              </Box>
              <Box mt={'40px'}>
                <Text
                  color={'rgba(228, 159, 92, 1)'}
                  fontSize={'40px'}
                  fontWeight={'900'}
                >
                  {dataInfo?.today_score_in?.toLocaleString() || 0}
                </Text>
                <Text color={'#535353'} fontSize={'20px'}>
                  Daily UUU rewards
                </Text>
              </Box>
              <Box mt={'40px'}>
                <Text
                  color={'rgba(228, 159, 92, 1)'}
                  fontSize={'40px'}
                  fontWeight={'900'}
                >
                  {dataInfo?.today_score_user?.toLocaleString() || 0}
                </Text>
                <Text color={'#535353'} fontSize={'20px'}>
                  Daily Active Accounts
                </Text>
              </Box>
            </Box>
            <Box mt={'80px'}>
              <Box
                mx={'auto'}
                cursor={'pointer'}
                borderRadius={'12px'}
                h={'48px'}
                w={264}
                bg={'rgba(228, 159, 92, 1)'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                color={'#000'}
                onClick={() => {
                  window.open(`${window.location.origin}/rewards`, '_blank');
                }}
              >
                Get UUU →
              </Box>
              {/* <Box
                mx={'auto'}
                mt={'24px'}
                cursor={'pointer'}
                borderRadius={'12px'}
                h={'48px'}
                w={264}
                border={'1px solid #fff'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                color={'#fff'}
              >
                Explore UUU →
              </Box> */}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
