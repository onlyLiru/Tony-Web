import { createIcon } from '@chakra-ui/react';

export const Grid3x3 = createIcon({
  displayName: 'Grid 3x3 Icon',
  viewBox: '0 0 20 20',
  path: [
    <rect
      key="r1"
      x="1"
      y="1"
      width="18"
      height="18"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />,
    <path key="d1" d="M1 13H20" stroke="currentColor" strokeWidth="2" />,
    <path key="d2" d="M1 7H20" stroke="currentColor" strokeWidth="2" />,
    <path key="d3" d="M7 19L7 1" stroke="currentColor" strokeWidth="2" />,
    <path key="d4" d="M13 19L13 1" stroke="currentColor" strokeWidth="2" />,
  ],
});

export const Grid2x2 = createIcon({
  displayName: 'Grid 2x2 Icon',
  viewBox: '0 0 20 20',
  path: [
    <rect
      key="r1"
      x="1"
      y="1"
      width="18"
      height="18"
      rx="3"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
    />,
    <path key="d1" d="M1 10H19" stroke="currentColor" strokeWidth="2" />,
    <path key="d2" d="M10 19L10 1" stroke="currentColor" strokeWidth="2" />,
  ],
});

export const FilterSwitch = createIcon({
  displayName: 'Filter Switch Icon',
  viewBox: '0 0 23 20',
  path: [
    <path
      key="p1"
      d="M18.8116 18.1946C17.9529 18.9659 16.7983 19.4381 15.5287 19.4381C12.8766 19.4381 10.7266 17.3775 10.7266 14.8356C10.7266 12.2937 12.8766 10.2331 15.5287 10.2331C18.1808 10.2331 20.3307 12.2937 20.3307 14.8356C20.3307 15.4014 20.2242 15.9433 20.0294 16.4439L22.5193 18.066C23.0206 18.3926 23.1508 19.0469 22.8101 19.5274C22.4693 20.0079 21.7866 20.1327 21.2853 19.8061L18.8116 18.1946ZM1.09761 2.104C0.491429 2.104 0 1.63299 0 1.052C0 0.47101 0.491429 0 1.09761 0H21.9023C22.5085 0 22.9999 0.47101 22.9999 1.052C22.9999 1.63299 22.5085 2.104 21.9023 2.104H1.09761ZM1.09761 14.0227C0.491429 14.0227 0 13.5517 0 12.9707C0 12.3897 0.491429 11.9187 1.09761 11.9187H7.35897C7.96515 11.9187 8.45658 12.3897 8.45658 12.9707C8.45658 13.5517 7.96515 14.0227 7.35897 14.0227H1.09761ZM1.09761 8.06934C0.491429 8.06934 0 7.59833 0 7.01733C0 6.43634 0.491429 5.96533 1.09761 5.96533H21.9023C22.5085 5.96533 22.9999 6.43634 22.9999 7.01733C22.9999 7.59833 22.5085 8.06934 21.9023 8.06934H1.09761ZM1.09761 20C0.491429 20 0 19.529 0 18.948C0 18.367 0.491429 17.896 1.09761 17.896H7.35897C7.96515 17.896 8.45658 18.367 8.45658 18.948C8.45658 19.529 7.96515 20 7.35897 20H1.09761ZM15.5287 17.3341C16.9684 17.3341 18.1355 16.2155 18.1355 14.8356C18.1355 13.4557 16.9684 12.3371 15.5287 12.3371C14.089 12.3371 12.9218 13.4557 12.9218 14.8356C12.9218 16.2155 14.089 17.3341 15.5287 17.3341Z"
      fill="currentColor"
    />,
  ],
});
