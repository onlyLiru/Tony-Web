import { PopoverSelectOption } from './PopoverSelect';

export * from './PopoverSelect';

/** 列表筛选项 */
export const LIST_FILTER_OPTIONS: PopoverSelectOption[] = [
  { label: 'recentlyListed', value: '1', className: 'Ex005' },
  { label: 'priceLowToHeight', value: '3', className: 'Ex006' },
  { label: 'priceHeightToLow', value: '2', className: 'Ex007' },
  { label: 'endSoon', value: '4', className: 'Ex008' },
];

export const LIST_FILTER_STATUS_OPTIONS = [
  { label: 'all', value: '', className: 'Ex003' },
  { label: 'listed', value: 'true', className: 'Ex003' },
  // { label: 'Unlisted', value: 'false' },
];
