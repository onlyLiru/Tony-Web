import { Box, Text, Button } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

type Props = {
  redeemList: any[];
  handleRedeem: () => void;
};
const ticketTypeList = [
  {
    name: 'Day1 & Day2 Ticket',
    bgImg: '/images/activity/teamz/bg-ticket-day1.png',
    type: 'ticket',
  },
  {
    name: 'Red Carpet Ticket',
    bgImg: '/images/activity/teamz/bg-ticket-red.png',
    type: 'red',
  },
  {
    name: 'VIP Ticket',
    bgImg: '/images/activity/teamz/bg-ticket-vip.png',
    type: 'vip',
  },
];
const Verify = (props: Props) => {
  const { redeemList, handleRedeem } = props;
  const redeemCount: any = {};
  redeemList.map(
    (item) => (redeemCount[item.type] = (redeemCount[item.type] || 0) + 1),
  );
  console.info('[Verify]redeemCount:', redeemCount);
  const t = useTranslations('activityTeamz');

  return (
    <>
      {/* Ticket Info Item */}
      <Box
        flex="1"
        h={{ base: 'auto', lg: '400px' }}
        w={{ base: '100%' }}
        display="flex"
        flexDir="column"
      >
        <Box
          fontSize={{ base: '7vw', md: '28px' }}
          color={{ base: 'white', lg: 'auto' }}
          display="flex"
          flexDir="column"
          justifyContent={{ base: 'flex-start', lg: 'center' }}
          flexShrink={0}
          p={{ base: '4vw', md: '20px' }}
        >
          <Text>{t('redeemListWording1')}</Text>
        </Box>
        {/* Ticket Item List */}
        <Box
          flex="1"
          overflow="scroll"
          p={{ base: '4vw', md: '20px' }}
          maxH="90vw"
        >
          {ticketTypeList.map(
            (item: any) =>
              redeemCount[item.type] && (
                <Box
                  key={'item-' + item.name}
                  bgColor="blue"
                  bgImage={item.bgImg}
                  bgSize="cover"
                  h={{ base: '20vw', md: '80px' }}
                  minH={{ base: '80px' }}
                  mb={{ base: '5vw', md: '10px' }}
                  borderRadius={{ base: '2vw', md: '10px' }}
                  display="flex"
                  flexDir="row"
                  alignItems="center"
                  pl={{ base: '5vw', md: '20px' }}
                  boxShadow={
                    redeemCount[item.type] > 1 ? '4px -4px 2px #828282' : 'none'
                  }
                >
                  <Text
                    fontSize={{ base: '7vw', md: '24px' }}
                    flex="1"
                    color="whiteAlpha.800"
                  >
                    {item.name}
                  </Text>
                  <Box
                    justifySelf="flex-end"
                    mt={{ base: '5vw', md: '5px' }}
                    w={{ base: '15vw', md: '13%' }}
                    color="black"
                    fontSize={{ base: '10vw', md: '28px' }}
                  >
                    x{redeemCount[item.type]}
                  </Box>
                </Box>
              ),
          )}
        </Box>
        {/* Button Group */}
        <Box p={{ base: '4vw', md: 'auto' }} margin="auto">
          <Button
            h={{ base: '12vw', md: '50px' }}
            w={{ base: '100%', md: '250px' }}
            bgColor="#1874ffFF"
            variant="outline"
            fontSize={{ base: '4vw', md: '20px' }}
            mb={{ base: '5vw', md: '30px' }}
            onClick={handleRedeem}
          >
            {t('confirmRedeem')}
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default Verify;
