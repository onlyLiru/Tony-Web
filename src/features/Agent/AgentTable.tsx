import { useTranslations } from 'next-intl';
import {
  Box,
  HStack,
  Text,
  VStack,
  Center,
  Input,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Stack,
} from '@chakra-ui/react';
import { TriangleUpIcon } from '@chakra-ui/icons';
import { Field, Form, Formik, FormikProps } from 'formik';
import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

type ColumnsItem = {
  title: string;
  key: string;
  search?: boolean;
  transformKeys?: string[];
  transform?: {
    output?: (p: any) => any;
    input?: (p: any) => any;
  };
  hideInTable?: boolean;
  render?: (p: any) => React.ReactNode;
  renderFormItem?: (p: any) => React.ReactNode;
};

type AgentTableProps = {
  columns: ColumnsItem[];
  request: (p?: any) => Promise<{
    code: number;
    msg: string;
    data: { list: any[]; total: number; [key: string]: any };
  }>;
  topRender?: () => React.ReactNode;
  rightRender?: () => React.ReactNode;
  columnSpacing?: string;
  onRequestSuccess?: (p?: any) => void;
};

export type AgentTablekRef = {
  reload: () => void;
};

const chormParams = {
  page: 1,
  page_size: 5,
};

const mobileParams = {
  page: 1,
  page_size: 1,
};

const AgentTable = forwardRef<AgentTablekRef, AgentTableProps>((props, ref) => {
  const {
    columns,
    request,
    topRender,
    rightRender,
    columnSpacing = '20px',
    onRequestSuccess,
  } = props;
  const isMobile = /mobile/i.test(navigator.userAgent);
  const defaultParams = isMobile ? mobileParams : chormParams;
  const initialValues = createObj(
    columns
      .filter((v: ColumnsItem) => v.search)
      .map((v: ColumnsItem) => v.transformKeys || v.key),
  );
  const t = useTranslations('promoter');

  const formRef = useRef<FormikProps<any>>(null);
  const toast = useToast();

  const [params, setParams] = useState<any>(defaultParams);

  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const fetch = async () => {
    if (!request) return;
    try {
      const { data } = await request(params);
      setList(data.list);
      setTotal(data.total);
      onRequestSuccess?.(data);
    } catch (error) {
      toast({
        status: 'error',
        title: error.message,
        variant: 'subtle',
      });
    }
  };

  useEffect(() => {
    fetch();
  }, [params]);

  const changePagination = (p: number) => {
    setParams((pre: any) => ({
      ...pre,
      page: p,
    }));
  };

  useImperativeHandle(ref, () => ({
    reload: fetch,
  }));

  return (
    <Box>
      <Formik
        innerRef={formRef!}
        initialValues={initialValues}
        onSubmit={async (values) => {
          console.log('search values:', values);
          try {
            setParams({ ...values, ...defaultParams });
          } catch (error) {
            toast({
              status: 'error',
              title: error.message,
              variant: 'subtle',
            });
          }
        }}
      >
        {({ values }) => (
          <Form>
            <Stack
              direction={{ md: 'row', base: 'column' }}
              pl="10px"
              spacing={{ md: '30px', base: '16px' }}
              mb={{
                md: topRender || rightRender ? '25px' : '57px',
                base: topRender || rightRender ? '20px' : '52px',
              }}
            >
              <Stack
                direction={{ md: 'row', base: 'column' }}
                spacing="20px"
                flex={1}
              >
                {columns
                  .filter((v: ColumnsItem) => v.search)
                  .map((v: ColumnsItem) => (
                    <FormControl key={v.key}>
                      <HStack>
                        <FormLabel
                          fontSize={{ md: '16px', base: '14px' }}
                          w={{ md: 'auto', base: '80px' }}
                          fontWeight={700}
                          lineHeight="22px"
                          m="0"
                          fontFamily="Plus Jakarta Sans"
                          whiteSpace="nowrap"
                        >
                          {v.title}:
                        </FormLabel>
                        {v.renderFormItem ? (
                          v.renderFormItem({
                            value: v.transform
                              ? v.transform.input?.(values)
                              : values[v.key],
                            onChange: (itemValue: any) => {
                              return formRef.current?.setValues(
                                v.transform
                                  ? v.transform.output?.(itemValue)
                                  : { [v.key]: itemValue },
                              );
                            },
                          })
                        ) : (
                          <Field
                            maxW={{ md: '440px', base: 'full' }}
                            h={{ md: '40px', base: '30px' }}
                            as={Input}
                            name={v.key}
                            placeholder={t('placeholder')}
                          />
                        )}
                      </HStack>
                    </FormControl>
                  ))}
              </Stack>
              <HStack
                spacing="14px"
                justify={{ md: 'flex-start', base: 'flex-end' }}
              >
                <Button
                  w={{ md: '128px', base: '120px' }}
                  h={{ md: '40px', base: '28px' }}
                  fontSize="14px"
                  bgColor="#14141F"
                  color="#fff"
                  fontWeight={700}
                  rounded="full"
                  type="submit"
                  cursor="pointer"
                  _hover={{ opacity: 0.8 }}
                >
                  {t('search')}
                </Button>
                <Button
                  w={{ md: '128px', base: '120px' }}
                  h={{ md: '40px', base: '28px' }}
                  fontSize="14px"
                  bgColor="#fff"
                  border="1px solid #14141F"
                  fontWeight={700}
                  rounded="full"
                  cursor="pointer"
                  _hover={{ opacity: 0.8 }}
                  onClick={() => formRef.current?.resetForm()}
                >
                  {t('reset')}
                </Button>
              </HStack>
              {props.rightRender?.()}
            </Stack>
          </Form>
        )}
      </Formik>
      {topRender?.()}
      <Stack
        direction={{ md: 'column', base: 'row' }}
        justify="space-between"
        rounded="12px"
        border="1px solid #D9D9D9"
        w="full"
        p={{ md: '20px 10px', base: '13px 18px 30px' }}
      >
        {list && list.length ? (
          <>
            <Stack
              direction={{ md: 'row', base: 'column' }}
              w={{ md: 'full', base: '140px' }}
              h={{ md: '40px', base: 'auto' }}
              justify="space-between"
              color="#777E90"
              fontSize="14px"
              fontWeight={700}
              lineHeight="24px"
              spacing={columnSpacing}
              mb={{ md: '22px', base: '0' }}
            >
              {columns
                .filter((v) => !v.hideInTable)
                .map((v: ColumnsItem, i: number) => (
                  <Text
                    key={i}
                    w="full"
                    textAlign={{ md: 'center', base: 'left' }}
                  >
                    {v.title}
                  </Text>
                ))}
            </Stack>
            <VStack spacing="30px">
              {(list || []).map((v: any, i: number) => (
                <Stack
                  key={i}
                  direction={{ md: 'row', base: 'column' }}
                  w={{ md: 'full', base: '140px' }}
                  h={{ md: '40px', base: 'auto' }}
                  justify="space-between"
                  color="#040415"
                  fontSize="14px"
                  fontWeight={700}
                  lineHeight="24px"
                  spacing={columnSpacing}
                >
                  {columns
                    .filter((v) => !v.hideInTable)
                    .map((el: ColumnsItem, idx: number) =>
                      el.render ? (
                        <Box
                          key={idx}
                          w="full"
                          textAlign="center"
                          lineHeight="40px"
                        >
                          {el.render(v)}
                        </Box>
                      ) : (
                        <Text
                          key={idx}
                          w="full"
                          textAlign="center"
                          noOfLines={1}
                          lineHeight="40px"
                        >
                          {v[el.key]}
                        </Text>
                      ),
                    )}
                </Stack>
              ))}
            </VStack>
          </>
        ) : (
          <Center w="full" h="260px" fontWeight={'700'} fontFamily="Inter">
            <Text>{t('noItems')}</Text>
          </Center>
        )}
      </Stack>
      <Pagination total={total} changeParams={changePagination} />
    </Box>
  );
});

export default AgentTable;

const Pagination = React.memo(
  (props: { total: number; changeParams: (p: number) => void }) => {
    const { total } = props;
    const isMobile = /mobile/i.test(navigator.userAgent);
    const defaultParams = isMobile ? mobileParams : chormParams;
    // 分页展示长度
    const maxPage = 6;
    const lastPage = Math.ceil(total / defaultParams.page_size);
    const [active, setActive] = useState(1);
    const [paginationList, setPaginationList] = useState<number[]>([]);

    useEffect(() => {
      setPaginationList(
        Array.from(
          { length: lastPage > maxPage ? maxPage : lastPage },
          (_, i) => i + 1,
        ),
      );
    }, [total]);

    const onPre = () => {
      if (active === 1) return;
      setActive((pre) => pre - 1);
      props.changeParams(active - 1);
      if (active - 1 < paginationList[0]!) {
        setPaginationList((pre) => pre.map((v) => v - 1));
      }
    };

    const onNext = () => {
      if (active === lastPage) return;
      setActive((pre) => pre + 1);
      props.changeParams(active + 1);
      if (active + 1 > paginationList[paginationList.length - 1]!) {
        setPaginationList((pre) => pre.map((v) => v + 1));
      }
    };

    const changePage = (p: number) => {
      setActive(p);
      props.changeParams(p);
    };

    if (!paginationList.length) return null;

    return (
      <HStack
        justify={{ md: 'center', base: 'flex-end' }}
        mt="20px"
        fontSize="14px"
        lineHeight="24px"
        fontWeight={700}
      >
        <TriangleUpIcon
          transform={'rotate(-90deg)'}
          cursor="pointer"
          opacity={active === 1 ? 0 : 1}
          onClick={onPre}
        />
        <HStack spacing="10px" mx="14px">
          {paginationList.map((v) => (
            <Text
              key={v}
              w="30px"
              textAlign="center"
              color={active === v ? '#4285F4' : '#000'}
              cursor="pointer"
              onClick={() => changePage(v)}
            >
              {v}
            </Text>
          ))}
        </HStack>
        <TriangleUpIcon
          transform={'rotate(90deg)'}
          cursor="pointer"
          opacity={active === lastPage ? 0 : 1}
          onClick={onNext}
        />
      </HStack>
    );
  },
);

type KeysType = string | string[];

function createObj(keys: KeysType[]) {
  const obj: Record<string, any> = new Object();
  keys.forEach((v: KeysType) => {
    Array.isArray(v)
      ? v.forEach((el: string) => {
          obj[el] = '';
        })
      : (obj[v] = '');
  });
  return obj;
}
