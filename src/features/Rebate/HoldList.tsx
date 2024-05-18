import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Box,
  Text,
  SimpleGrid,
  Skeleton,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { ShimmerImage } from '@/components/Image';
import * as rebateApi from '@/services/rebate';
import { useInfiniteScroll } from 'ahooks';

const Item = ({
  data,
  timestamp,
}: {
  data: rebateApi.ApiRebate.HoldListItem;
  timestamp: number;
}) => {
  const t = useTranslations('rebate');
  return (
    <Box>
      <ShimmerImage
        w={{ md: '160px', base: '120px' }}
        h={{ md: '160px', base: '120px' }}
        rounded="13px"
        src={data.image_thumbnail_url}
      />
      <Text
        mt="8px"
        textAlign="center"
        fontSize="17px"
        lineHeight="30px"
        fontWeight={400}
        color="#646464"
      >
        {Math.floor((timestamp - data.create_time) / (24 * 60 * 60))} {t('day')}
      </Text>
    </Box>
  );
};

export const HoldList = forwardRef((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('rebate');
  const modalRef = useRef<HTMLDivElement>(null);
  const [total, setTotal] = useState<number>();
  const [localTime, setLocalTime] = useState<number>();

  useImperativeHandle(ref, () => ({
    open: onOpen,
  }));

  const { data, loading, reload } = useInfiniteScroll(
    (d) => {
      const page = d ? Math.ceil(d.list.length / 10) + 1 : 1;
      return getList({ page, page_size: 10 });
    },
    {
      target: modalRef,
      isNoMore: (d) => d?.noMore!,
      onSuccess: (data) => {
        setTotal(data.num);
        setLocalTime(
          data.local_time || Math.floor(new Date().getTime() / 1000),
        );
      },
      manual: true,
    },
  );

  useEffect(() => {
    if (isOpen) {
      reload();
    }
  }, [isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          rounded="xl"
          maxWidth={{ base: '362px', md: '800px' }}
          pb={{ md: '0', base: '20px' }}
        >
          <ModalCloseButton />
          <ModalHeader
            fontSize={{ md: '24px', base: '16px' }}
            lineHeight="50px"
            fontWeight={400}
            px={{ md: '68px', base: '20px' }}
            pt={{ md: '28px', base: '0' }}
            pb={{ md: '16px', base: '14px' }}
          >
            {t('NFTOwned')}
            <Text
              pl={{ md: '0', base: '25px' }}
              mt={{ md: '40px', base: '0' }}
              fontSize={{ md: '20px', base: '14px' }}
              lineHeight={{ md: '30px', base: '16px' }}
            >
              {t('total')}：{total}
            </Text>
          </ModalHeader>
          <ModalBody
            px={{ md: '56px', base: '45px' }}
            pt="0"
            h="435px"
            pb={{ md: '12px', base: '0' }}
            fontSize={{ base: '14px', md: '20px' }}
            lineHeight={{ base: '18px', md: '30px' }}
            fontWeight={400}
            id="holdList"
            ref={modalRef}
          >
            {loading ? (
              <SimpleGrid
                columns={{ md: 4, base: 2 }}
                spacingX={{ md: '16px', base: '32px' }}
                spacingY={{ md: '54px', base: '48px' }}
                mx={{ md: 'auto', base: 'auto' }}
                h={{ md: '428px', base: '160px' }}
                pb={{ md: '38px', base: '0' }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                  <Skeleton
                    key={v}
                    rounded="13px"
                    w={{ md: '160px', base: '120px' }}
                    h={{ md: '160px', base: '120px' }}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid
                columns={{ md: 4, base: 2 }}
                spacingX={{ md: '16px', base: '32px' }}
                spacingY={{ md: '16px', base: '10px' }}
                mx={{ md: 'auto', base: 'auto' }}
                h={{ md: '428px', base: '160px' }}
              >
                {(data?.list || []).map((v) => (
                  <Item key={v.item_id} data={v} timestamp={localTime!} />
                ))}
              </SimpleGrid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});

function getList(p: any) {
  return rebateApi.getHoldList(p).then((r) => ({
    list: r.data?.item_list,
    num: r.data?.num,
    local_time: r.data?.local_time,
    noMore: !r.data?.item_list || r.data?.item_list?.length === 0,
  }));
}
