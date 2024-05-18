import { usePropsValue } from '@/hooks/usePropsValue';
import {
  Box,
  ButtonProps,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import { add, format, set } from 'date-fns';
import { merge } from 'lodash';
import React, { ChangeEventHandler, useEffect, useMemo, useState } from 'react';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import { FiClock } from 'react-icons/fi';
import { BsCalendar3 } from 'react-icons/bs';
import { CustomCaption } from './components/CustomCaption';
import { SelectDays, sx } from './helper';
import { MenuSelect } from '../MenuSelect';
import { CloseIcon } from '@chakra-ui/icons';

export type DatePickerProps = {
  popover?: Omit<PopoverProps, 'isOpen' | 'onClose'>;
  value?: Date;
  onChange?: (val: Date) => void;
  defaultValue?: Date;
  showTime?: boolean;
  showClear?: boolean;
  showPickDate?: boolean;
  size?: ButtonProps['size'];
};

export const DatePicker: React.FC<DatePickerProps> = (p) => {
  const today = new Date();
  const props = merge({ defaultValue: '' }, p);
  const [value, setValue] = usePropsValue(props);
  const [day, setDay] = useState('30');
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();
  const showTime = !!props.showTime;
  const showPickDate = props.showPickDate === undefined ? true : false;
  const [showType, setShowType] = useState<'day' | 'date'>(() =>
    value ? 'date' : 'day',
  );

  const formatDate = (d: Date) => format(d, 'HH:mm, MMM. dd, yyyy');

  const dateValue = useMemo(() => value || today, [value, today]);

  useEffect(() => {
    if (!props.value && day) {
      props.onChange?.(add(today, { days: +day }));
    }
  }, [props.value, day]);

  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    const hours = Number.parseInt(value.split(':')[0] || '00', 10);
    const minutes = Number.parseInt(value.split(':')[1] || '00', 10);
    setValue(set(dateValue, { hours, minutes }));
  };

  const handleDateSelect: SelectSingleEventHandler = (_, selected) => {
    const hours = dateValue!.getHours();
    const minutes = dateValue!.getMinutes();
    setValue(set(selected, { hours, minutes }));
    setShowType('date');
    onToggle();
  };

  const handleDaySelect = (val: string) => {
    setShowType('day');
    setDay(val);
    setValue(add(today, { days: +val }));
  };

  const handleDateClear = () => {
    setShowType('day');
    setDay('30');
    setValue(add(today, { days: 30 }));
  };

  const showDaySelect = useMemo(() => {
    if (!value) return true;
    return showType === 'day';
  }, [value, showType]);

  return (
    <Flex w="full">
      {showDaySelect ? (
        <MenuSelect
          px={4}
          fontFamily="Inter"
          bg="none !important"
          border="2px solid"
          borderColor="primary.gray"
          size={props.size}
          w="full"
          textAlign={'left'}
          wrapperProps={{ flex: 1 }}
          options={SelectDays}
          value={day}
          onChange={handleDaySelect}
        />
      ) : (
        <Input
          size={props.size}
          readOnly
          cursor={'pointer'}
          value={value ? formatDate(value) : ''}
        />
      )}
      {showPickDate && (
        <Popover
          isLazy
          returnFocusOnClose={false}
          closeOnBlur
          {...props.popover}
          isOpen={isOpen}
          onClose={onClose}
        >
          <PopoverTrigger>
            <IconButton
              ml={2}
              bg="none"
              maxW="0"
              onClick={showDaySelect ? onOpen : handleDateClear}
              size={props.size}
              rounded={props.size}
              border="2px solid"
              borderColor="primary.gray"
              aria-label=""
              color="primary.deepGray"
              icon={
                <Icon
                  fontSize={showDaySelect ? 24 : 16}
                  as={showDaySelect ? BsCalendar3 : CloseIcon}
                />
              }
            />
          </PopoverTrigger>
          <PopoverContent w="auto" border="none" bg="white" p={5} shadow="lg">
            <PopoverBody p={0}>
              <Box sx={sx}>
                <DayPicker
                  mode="single"
                  onSelect={handleDateSelect}
                  components={{
                    Caption: CustomCaption,
                  }}
                />
                {showTime && (
                  <InputGroup mt={4}>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.500"
                      children={<FiClock fontSize={20} />}
                    />
                    <Input
                      onChange={handleTimeChange}
                      value={format(dateValue, 'HH:mm')}
                      type="time"
                    />
                  </InputGroup>
                )}
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </Flex>
  );
};
