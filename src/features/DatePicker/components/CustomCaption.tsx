import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import React from 'react';
import { CaptionProps, useNavigation } from 'react-day-picker';

export function CustomCaption(props: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  return (
    <Flex fontWeight={'bold'} align={'center'} justify="space-between">
      <IconButton
        className="rdp-month-prev"
        bg="none"
        aria-label=""
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
        icon={<ChevronLeftIcon fontSize={24} />}
      />
      <Text color="primary.main">
        {format(props.displayMonth, 'MMMM yyyy')}
      </Text>
      <IconButton
        className="rdp-month-next"
        bg="none"
        aria-label=""
        disabled={!nextMonth}
        onClick={() => nextMonth && goToMonth(nextMonth)}
        icon={<ChevronRightIcon fontSize={24} />}
      />
    </Flex>
  );
}
