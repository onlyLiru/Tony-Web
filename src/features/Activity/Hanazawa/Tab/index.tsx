import {
  Box,
  Button,
  Center,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useMultiStyleConfig,
  useTab,
} from '@chakra-ui/react';
import React from 'react';
import TabDashboard from './TabDashboard';
import TabDescription from './TabDescription';
import TabRewards from './TabRewards';
import { useTranslations } from 'next-intl';

const CustomTab = React.forwardRef<HTMLElement, any>((props, ref) => {
  // 1. Reuse the `useTab` hook
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps['aria-selected'];

  // 2. Hook into the Tabs `size`, `variant`, props
  const styles = useMultiStyleConfig('Tabs', tabProps);

  const bgImage = isSelected
    ? '/images/activity/hanazawa/tabs/tab_bg_ac.svg'
    : '/images/activity/hanazawa/tabs/tab_bg.svg';
  return (
    <Button __css={styles.tab} p="0" {...tabProps}>
      <Center
        bgImage={bgImage}
        bgSize={{ base: '60%', md: 'contain' }}
        bgRepeat="no-repeat"
        bgPos="center"
        h="100px"
        mx="18px"
        fontSize={{ base: '16px', md: '22px' }}
      >
        <Text pb="10px">{tabProps.children}</Text>
      </Center>
    </Button>
  );
});

export function TabContent() {
  const t = useTranslations('hz');

  return (
    <Box pb={{ base: '20px', md: '50px' }}>
      <Tabs color="white" variant="unstyled">
        <TabList
          // pos={{ base: 'sticky', md: 'relative' }}
          // top={{ base: '72px', md: 0 }}
          mb={{ base: '10px', md: '30px' }}
          zIndex={3}
          bgColor={{ base: '#070A1B', md: 'transparent' }}
          mx="auto"
          justifyContent={'space-between'}
          maxW={{ base: '100vw', md: '580px' }}
          px={{ base: '5vw', md: '0' }}
        >
          {[...t.raw('tabs')].map((el: string) => (
            <CustomTab
              w="180px"
              whiteSpace="nowrap"
              key={el}
              color="#838383"
              _selected={{ color: 'white' }}
              _active={{ bgColor: 'none' }}
            >
              {el}
            </CustomTab>
          ))}
        </TabList>
        <TabPanels maxW={{ base: 'full', md: '1220px' }} mx="auto">
          <TabPanel>
            <TabDashboard />
          </TabPanel>
          <TabPanel>
            <TabDescription />
          </TabPanel>
          <TabPanel>
            <TabRewards />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
