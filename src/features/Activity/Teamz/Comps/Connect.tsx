import {
  Box,
  Button,
  Text,
  useCheckbox,
  useCheckboxGroup,
  Flex,
  chakra,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

const checkedImg = '/images/activity/teamz/icon-checked.png';
const ticketMap: any = {
  ticket: {
    name: 'Day1 & Day2 Ticket',
    bgImg: '/images/activity/teamz/bg-ticket-day1.png',
  },
  red: {
    name: 'Red Carpet Ticket',
    bgImg: '/images/activity/teamz/bg-ticket-red.png',
  },
  vip: {
    name: 'VIP Ticket',
    bgImg: '/images/activity/teamz/bg-ticket-vip.png',
  },
  unknow: {
    name: 'Invalid Ticket',
    bgImg: '/images/activity/teamz/bg-ticket-day1.png',
  },
};
type Props = {
  ticketList: any[];
  handleRedeem: any;
};
export const Connect = (props: Props) => {
  const { ticketList = [], handleRedeem } = props;

  function CustomCheckbox(props: any) {
    const { state, getCheckboxProps, getInputProps, htmlProps } =
      useCheckbox(props);

    return (
      <chakra.label
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        {...htmlProps}
      >
        <input {...getInputProps()} hidden />
        <Flex
          alignItems="center"
          justifyContent="center"
          border="0.4vw solid"
          borderRadius={{ base: '1vw', md: '10px' }}
          borderColor="whiteAlpha.700"
          color="#841e20FF"
          w={{ base: 5, md: '20px' }}
          h={{ base: 5, md: '20px' }}
          {...getCheckboxProps()}
        >
          {state.isChecked && (
            <Box
              w={{ base: 3, md: '18px' }}
              h={{ base: 3, md: '10px' }}
              bgImage={checkedImg}
              bgSize="cover"
            />
          )}
        </Flex>
      </chakra.label>
    );
  }

  const {
    value: checkedTicket,
    setValue: setCheckedValue,
    getCheckboxProps,
  } = useCheckboxGroup();

  const t = useTranslations('activityTeamz');

  useEffect(() => {
    const checked: any = [];
    ticketList && ticketList.map((item) => checked.push(JSON.stringify(item)));
    setCheckedValue(checked);
  }, [ticketList]);
  return (
    <>
      {/* Ticket Info Item */}
      <Box
        flex="1"
        h={{ base: 'auto', md: '400px' }}
        w={{ base: '100vw', md: 'auto' }}
        display="flex"
        flexDir="column"
      >
        <Box
          fontSize={{ base: '7vw', md: '30px' }}
          color={{ base: 'white', lg: 'auto' }}
          justifyContent={{ base: 'flex-start', lg: 'center' }}
          display="flex"
          flexDir="column"
          flexShrink={0}
          p={{ base: '4vw', md: '20px' }}
        >
          <Text>{t('ticketListWording1')}</Text>
          <Text as="p">{t('ticketListWording2')}</Text>
        </Box>
        {/* Ticket Item List */}
        <Box
          flex="1"
          overflow="scroll"
          p={{ base: '4vw', md: '20px' }}
          maxH="85vw"
        >
          {ticketList &&
            ticketList.map(
              (item: any) =>
                (item.type === 'red' ||
                  item.type === 'vip' ||
                  item.type === 'ticket') && (
                  <Box
                    key={'item-' + item.item_id}
                    bgImage={ticketMap[item.type].bgImg}
                    bgSize="cover"
                    h={{ base: '20vw', md: '80px' }}
                    minH={{ base: '80px' }}
                    mb={{ base: '5vw', md: '10px' }}
                    borderRadius={{ base: '3vw', md: '10px' }}
                    display="flex"
                    flexDir="row"
                    alignItems="center"
                    pl={{ base: '5vw', md: '20px' }}
                  >
                    <Text
                      fontSize={{ base: '7vw', md: '25px' }}
                      flex="1"
                      color="whiteAlpha.800"
                    >
                      {ticketMap[item.type].name}
                    </Text>
                    <Box justifySelf="flex-end" w={{ base: '12vw', md: '15%' }}>
                      <CustomCheckbox
                        {...getCheckboxProps({ value: JSON.stringify(item) })}
                      />
                    </Box>
                  </Box>
                ),
            )}
        </Box>
        {/* Button Group */}
        <Box display="flex" flexDir="column" p={{ base: '4vw', md: '20px' }}>
          <Button
            h={{ base: '12vw', md: '60px' }}
            maxW="600px"
            bgColor="#1874ffFF"
            variant="outline"
            fontSize={{ base: '4vw', md: '20px' }}
            mb={{ base: '3vw', md: '20px' }}
            onClick={(event) => handleRedeem(checkedTicket, event)}
          >
            {t('confirmRedeem')}
          </Button>
        </Box>
      </Box>
    </>
  );
};
