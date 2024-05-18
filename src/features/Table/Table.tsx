import {
  Box,
  BoxProps,
  Center,
  Flex,
  List,
  ListItem,
  SimpleGrid,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import React from 'react';

type TableColumnType<T> = {
  title: React.ReactNode;
  dataKey: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  boxProps?: BoxProps;
  render?: (key: any, record: T, index: number) => React.ReactNode;
};

export type TableProps<T> = {
  loading?: boolean;
  columns: TableColumnType<T>[];
  dataSource: T[];
  rowKey?: ((record: T, index: number) => string) | string;
};

export function Table<T = Record<string, any>>({
  loading,
  columns,
  dataSource,
  rowKey,
}: TableProps<T>) {
  const t = useTranslations('common');
  return (
    <Box>
      <SimpleGrid
        maxH={'322px'}
        overflowX="auto"
        templateColumns="minmax(auto, auto)"
      >
        <List
          role="table"
          display="grid"
          p="0"
          m="0"
          w="100%"
          gridTemplateColumns={columns
            .map(
              (column) =>
                column.width ??
                `minmax(${column.minWidth ?? 'auto'}, ${
                  column.maxWidth ?? 'auto'
                })`,
            )
            .join(' ')}
        >
          <ListItem role="row" display="contents">
            {columns.map((column, i) => (
              <Box
                key={column.dataKey ?? i}
                role="columnheader"
                pos="sticky"
                top="0px"
                zIndex={2}
                py={2}
                px={4}
                color="typo.sec"
                fontWeight={'500'}
                {...column.boxProps}
                bg="#2B2B2B"
              >
                <Box
                  overflow="hidden"
                  w="full"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                >
                  {column.title}
                </Box>
              </Box>
            ))}
          </ListItem>
          {!loading &&
            dataSource.length &&
            dataSource.map((record, i) => (
              <ListItem
                color="primary.main"
                fontWeight={'500'}
                role="row"
                display="contents"
                key={
                  typeof rowKey === 'string'
                    ? (record as any)[rowKey!]
                    : rowKey?.(record, i) ?? i
                }
              >
                {columns.map((column, i) => (
                  <Flex
                    key={i}
                    align="center"
                    p={4}
                    borderTopWidth="1px"
                    borderColor="rgba(0,0,0,0.12)"
                    {...column.boxProps}
                  >
                    <Box
                      overflow="hidden"
                      w="full"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                    >
                      {column.render
                        ? column.render(
                            (record as any)[column.dataKey]!,
                            record,
                            i,
                          )
                        : (record as any)[column.dataKey]}
                    </Box>
                  </Flex>
                ))}
              </ListItem>
            ))}
        </List>
      </SimpleGrid>
      {(loading || !dataSource.length) && (
        <Center w="full" p={10}>
          {loading ? (
            <Spinner colorScheme="blackAlpha" />
          ) : (
            <Text color="typo.sec">{t('noItems')}</Text>
          )}
        </Center>
      )}
    </Box>
  );
}
