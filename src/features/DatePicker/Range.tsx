import { usePropsValue } from '@/hooks/usePropsValue';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { format, set } from 'date-fns';
import { merge } from 'lodash';
import React, { ChangeEventHandler, useMemo } from 'react';
import {
  DayPicker,
  DateRange,
  SelectRangeEventHandler,
} from 'react-day-picker';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { CustomCaption } from './components/CustomCaption';
import { sx } from './helper';

export type DateRangePickerProps = {
  popover?: Omit<PopoverProps, 'isOpen' | 'onClose'>;
  value?: DateRange;
  onChange?: (val: DateRange) => void;
  defaultValue?: DateRange;
  showTime?: boolean;
  children?: ({
    value,
    isOpen,
    onToggle,
  }: {
    value: DateRange;
    isOpen: boolean;
    onToggle: () => void;
  }) => React.ReactNode;
};

export const DateRangePicker: React.FC<DateRangePickerProps> = (p) => {
  const today = new Date();
  const props = merge({ defaultValue: '' }, p);
  const [value, setValue] = usePropsValue(props);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const showTime = !!props.showTime;

  const formatDate = (range: DateRange) => {
    // const pattern = showTime ? 'PPpp' : 'PPP';
    const pattern = 'yyyy-MM-dd';
    if (range.from) {
      if (!range.to) return format(range.from, pattern);
      return `${format(range.from, pattern)} - ${format(range.to, pattern)}`;
    }
    return '';
  };

  const dateValue = useMemo<DateRange>(() => {
    if (!value) return { from: undefined };
    const { from, to } = value;
    return {
      from,
      to,
    };
  }, [value]);

  const handleFromTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value: timeValue } = e.target;
    const hours = Number.parseInt(timeValue.split(':')[0] || '00', 10);
    const minutes = Number.parseInt(timeValue.split(':')[1] || '00', 10);
    setValue({
      ...value,
      from: set(value.from || today, { hours, minutes }),
    });
  };
  const handleToTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value: timeValue } = e.target;
    const hours = Number.parseInt(timeValue.split(':')[0] || '00', 10);
    const minutes = Number.parseInt(timeValue.split(':')[1] || '00', 10);
    setValue({
      ...value,
      to: set(value.to || today, { hours, minutes }),
    });
  };

  const handleSelect: SelectRangeEventHandler = (range) => {
    const { from = today, to = today } = dateValue as DateRange;
    const fromHours = from.getHours();
    const fromMinutes = from.getMinutes();
    const toHours = to.getHours();
    const toMinutes = to.getMinutes();

    const date = {} as DateRange;
    if (range?.from) {
      date.from = set(range?.from, { hours: fromHours, minutes: fromMinutes });
    }
    if (range?.to) {
      date.to = set(range?.to, { hours: toHours, minutes: toMinutes });
    }
    setValue(date);
  };

  const renderTrigger = () => {
    if (props.children && typeof props.children === 'function') {
      return props.children({ value, isOpen, onToggle });
    }
    return (
      <InputGroup size="md" onClick={onToggle}>
        <InputLeftElement
          pointerEvents="none"
          color="gray.500"
          children={<FiCalendar fontSize={20} />}
        />
        <Input readOnly value={formatDate(value)} />
      </InputGroup>
    );
  };

  return (
    <>
      <Popover
        isLazy
        returnFocusOnClose={false}
        closeOnBlur
        // matchWidth
        {...props.popover}
        isOpen={isOpen}
        onClose={onClose}
      >
        <PopoverTrigger>{renderTrigger()}</PopoverTrigger>
        <PopoverContent
          w="auto"
          border="none"
          bg="white"
          rounded={'lg'}
          p={5}
          shadow="lg"
        >
          <PopoverBody p={0}>
            <Box
              sx={{
                ...sx,
                '.rdp-months': {
                  display: 'grid',
                  gap: 4,
                  gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
                },
                '.rdp-multiple_months': {
                  '.rdp-caption_start .rdp-month-next, .rdp-caption_end .rdp-month-prev':
                    {
                      visibility: 'hidden',
                    },
                },
              }}
            >
              <DayPicker
                mode="range"
                numberOfMonths={2}
                selected={dateValue}
                onSelect={handleSelect}
                components={{
                  Caption: CustomCaption,
                }}
              />

              {showTime && (
                <>
                  <SimpleGrid
                    mt={4}
                    templateColumns={{ base: '1fr', md: '1fr 1fr' }}
                    spacing={4}
                  >
                    <InputGroup size="lg">
                      <InputLeftElement
                        pointerEvents="none"
                        color="gray.500"
                        children={<FiClock fontSize={20} />}
                      />
                      <Input
                        onChange={handleFromTimeChange}
                        value={format(dateValue.from || today, 'HH:mm')}
                        type="time"
                      />
                    </InputGroup>
                    <InputGroup size="lg">
                      <InputLeftElement
                        pointerEvents="none"
                        color="gray.500"
                        children={<FiClock fontSize={20} />}
                      />
                      <Input
                        onChange={handleToTimeChange}
                        value={format(dateValue.to || today, 'HH:mm')}
                        type="time"
                      />
                    </InputGroup>
                  </SimpleGrid>
                </>
              )}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
