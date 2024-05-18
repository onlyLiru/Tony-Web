import { useTranslations } from 'next-intl';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { useState } from 'react';
import HomeTab from './HomeTabPanel.';
import AgentTabPanel from './AgentTabPanel';
import UserTabPanel from './UserTabPanel';
import LinkTabPanel from './LinkTabPanel';
import OrderTabPanel from './OrderTabPanel';
import WithdrawTabPanel from './WithdrawTabPanel';

export const AgentTabs = () => {
  const t = useTranslations('promoter');
  const [activeTab, setActiveTab] = useState(0);
  const changeTab = (index: number) => {
    setActiveTab(index);
  };

  const tabs = [
    {
      name: t('homepage'),
      key: 1,
    },
    {
      name: t('promoterList'),
      key: 2,
    },
    {
      name: t('userList'),
      key: 3,
    },
    {
      name: t('linkList'),
      key: 4,
    },
    {
      name: t('orderList'),
      key: 5,
    },
    {
      name: t('withdrawalList'),
      key: 6,
    },
  ];
  return (
    <Box>
      <Tabs onChange={changeTab} isLazy>
        <TabList
          pl={{ md: '66px', base: '6px' }}
          overflowX="auto"
          sx={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {tabs.map((v, i) => (
            <Tab
              key={v.key}
              w={{ md: '210px', base: '60px' }}
              h={{ md: '55px', base: '100px' }}
              fontSize={{ md: '18px', base: '14px' }}
              mr={{ md: '14px', base: '6px' }}
              _selected={{ fontWeight: 700, color: '#7065F0' }}
              pos="relative"
              _after={{
                content: '" "',
                pos: 'absolute',
                bottom: 0,
                left: 0,
                w: 'full',
                rounded: 'full',
                h: '2px',
                bgColor: '#7065F0',
                display: activeTab === i ? 'block' : 'none',
              }}
            >
              {v.name}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            <HomeTab />
          </TabPanel>
          <TabPanel p={0}>
            <AgentTabPanel />
          </TabPanel>
          <TabPanel p={0}>
            <UserTabPanel />
          </TabPanel>
          <TabPanel p={0}>
            <LinkTabPanel />
          </TabPanel>
          <TabPanel p={0}>
            <OrderTabPanel />
          </TabPanel>
          <TabPanel p={0}>
            <WithdrawTabPanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
