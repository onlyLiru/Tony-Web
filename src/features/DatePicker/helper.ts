import type { SystemStyleObject } from '@chakra-ui/react';

export const sx: SystemStyleObject = {
  '.rdp': {
    fontFamily: 'Urbanist',
    m: 0,
    color: 'typo.sec',
  },
  '.rdp-months': {
    display: 'grid',
    gridTemplateColumns: { base: '1fr' },
  },
  'input[type="time"]::-webkit-calendar-picker-indicator': {
    background: 'none',
  },
  '.rdp-table': {
    w: 'full',
  },
  '.rdp-cell': {
    textAlign: 'center',
  },
  '.rdp-vhidden': {
    display: 'none',
  },
  '.rdp-day': {
    cursor: 'pointer',
    m: '2px',
    rounded: 'lg',
    w: '32px',
    h: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    _hover: {
      bg: 'gray.100',
    },
  },
  '.rdp-day_selected': {
    color: 'typo.sec !important',
    bg: 'gray.300 !important',
  },
  '.rdp-day_range_start,.rdp-day_range_end': {
    color: 'primary.main !important',
  },
};

export const SelectDays = [
  { label: '1 day', value: '1' },
  { label: '3 days', value: '3' },
  { label: '7 days', value: '7' },
  { label: '14 days', value: '14' },
  { label: '30 days', value: '30' },
  { label: '90 days', value: '90' },
];
