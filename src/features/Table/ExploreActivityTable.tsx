import { Box, Flex, List, ListItem, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { TableProps } from './Table';

export function ExploreActivityTable<T = Record<string, any>>({
  columns,
  dataSource,
  rowKey,
}: TableProps<T>) {
  return (
    <SimpleGrid
      overflowX={{ base: 'hidden', md: 'auto' }}
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
        <ListItem role="row" display={{ base: 'none', md: 'contents' }}>
          {columns.map((column, i) => (
            <Box
              key={column.dataKey ?? i}
              role="columnheader"
              pos="sticky"
              top="0px"
              zIndex={2}
              py={4}
              px={4}
              bg="white"
              color="typo.sec"
              fontWeight={'500'}
              {...column.boxProps}
            >
              <Box
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                w="full"
              >
                {column.title}
              </Box>
            </Box>
          ))}
        </ListItem>
        {dataSource.length &&
          dataSource.map((record, i) => (
            <ListItem
              color="primary.main"
              fontWeight={'500'}
              role="group"
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
                  px={4}
                  py={{ base: '10px', md: '20px' }}
                  // _groupHover={{
                  //   bgColor: '#FBFDFF',
                  // }}
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
  );
}
