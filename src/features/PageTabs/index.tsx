import React from 'react';
import { Box, Center, Tab, TabList, Tabs } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { darkText, darkBg, darkLine } from '@/utils/darkColor';
import { useIsRare } from '@/store';

export function PageTabs(props: { tabs: { label: string; href: string }[] }) {
  const router = useRouter();
  const defaultIndex = props.tabs.findIndex(
    (el) => el.href.split('?')[0] === router.asPath.split('?')[0],
  );
  const [isRare] = useIsRare();
  return (
    <Tabs defaultIndex={defaultIndex} bg={isRare ? darkBg : '#2B2B2B'}>
      <Center borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.10)">
        <TabList
          fontFamily={'Inter'}
          borderWidth={0}
          borderBottom="2x solid"
          borderColor={'rgba(255, 255, 255, 0.10)'}
          color="typo.sec"
          gap={{ base: 0, md: 10 }}
          px={{ base: 5, md: 0 }}
          whiteSpace={'nowrap'}
          w="full"
          maxW={{ base: 'full', md: 'draft' }}
          overflowY={'visible'}
          h={{ base: '60px', md: '100px' }}
        >
          {props.tabs.map((tab, idx) => (
            <NextLink key={tab.href} href={tab.href}>
              <Tab
                fontFamily="PingFang HK"
                as="a"
                href={tab.href}
                fontSize={{ base: '16px', md: '20px' }}
                fontWeight={'600'}
                px="0"
                mr={{ base: 5, md: 0 }}
                overflowY={'visible'}
                boxShadow="none !important"
                pos="relative"
                color={'rgba(255, 255, 255, 0.80)'}
                _selected={
                  isRare
                    ? darkText
                    : {
                        color: '#E49F5C',
                      }
                }
              >
                {tab.label}
                {defaultIndex === idx && (
                  <Box
                    pos="absolute"
                    left={0}
                    right={0}
                    bottom={'-1px'}
                    height={{ base: '3px', md: '5px' }}
                    zIndex={2}
                    w="full"
                    bg="#E49F5C"
                    sx={isRare ? darkLine : {}}
                  />
                )}
              </Tab>
            </NextLink>
          ))}
        </TabList>
      </Center>
    </Tabs>
  );
}
