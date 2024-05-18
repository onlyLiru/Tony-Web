import { useState, useEffect } from 'react';
import { Box, BoxProps, Flex, Text, Link, Image } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useUserDataValue } from '@/store';
import { useRouter } from 'next/router';

export function MobileFooter(props: BoxProps) {
  // 选中的导航
  const [selectedNav, setSelectedNav] = useState('Home');
  const userData = useUserDataValue();
  const router = useRouter();
  const navList = [
    {
      name: 'Home',
      href: `/${router.locale}`,
      selectedImg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="14"
          viewBox="0 0 15 14"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.09326 0.935621C7.32732 0.735001 7.6727 0.735001 7.90675 0.935621L13.125 5.40841V12.593C13.125 12.9382 12.8452 13.218 12.5 13.218H9.875V10.593C9.875 9.83363 9.25939 9.21802 8.5 9.21802H6.5C5.74061 9.21802 5.125 9.83363 5.125 10.593L5.125 13.218H2.5C2.15482 13.218 1.875 12.9382 1.875 12.593V5.40842L7.09326 0.935621ZM1.125 6.05127L0.744054 6.3778C0.586806 6.51258 0.350069 6.49437 0.215286 6.33713C0.0805023 6.17988 0.0987128 5.94314 0.25596 5.80836L6.60517 0.366178C7.12009 -0.0751848 7.87992 -0.0751841 8.39485 0.366179L14.7441 5.80836C14.9013 5.94314 14.9195 6.17988 14.7847 6.33713C14.6499 6.49437 14.4132 6.51258 14.256 6.3778L13.875 6.05126V12.593C13.875 13.3524 13.2594 13.968 12.5 13.968H2.5C1.74061 13.968 1.125 13.3524 1.125 12.593V6.05127ZM9.125 13.218H5.875L5.875 10.593C5.875 10.2478 6.15482 9.96802 6.5 9.96802H8.5C8.84518 9.96802 9.125 10.2478 9.125 10.593V13.218Z"
            fill="white"
          />
        </svg>
      ),
      unSelectedImg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="14"
          viewBox="0 0 15 14"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.09327 0.935628C7.32732 0.735009 7.6727 0.735009 7.90676 0.935629L13.125 5.40841V12.593C13.125 12.9382 12.8452 13.218 12.5 13.218H9.87501V10.593C9.87501 9.83363 9.2594 9.21803 8.50001 9.21803H6.50001C5.74061 9.21803 5.12501 9.83363 5.12501 10.593L5.12501 13.218H2.50001C2.15483 13.218 1.87501 12.9382 1.87501 12.593V5.40842L7.09327 0.935628ZM1.12501 6.05128L0.744059 6.37781C0.586812 6.51259 0.350074 6.49438 0.215291 6.33713C0.0805078 6.17989 0.0987184 5.94315 0.255966 5.80836L6.60517 0.366186C7.1201 -0.0751772 7.87993 -0.0751765 8.39485 0.366186L14.7441 5.80836C14.9013 5.94315 14.9195 6.17989 14.7847 6.33713C14.65 6.49438 14.4132 6.51259 14.256 6.37781L13.875 6.05127V12.593C13.875 13.3524 13.2594 13.968 12.5 13.968H2.50001C1.74061 13.968 1.12501 13.3524 1.12501 12.593V6.05128ZM9.12501 13.218H5.87501L5.87501 10.593C5.87501 10.2478 6.15483 9.96803 6.50001 9.96803H8.50001C8.84518 9.96803 9.12501 10.2478 9.12501 10.593V13.218Z"
            fill="white"
            fillOpacity="0.4"
          />
        </svg>
      ),
    },
    // {
    //   name: 'News',
    //   href: '/',
    //   selectedImg:
    //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAMAAACrZuH4AAAAPFBMVEUAAADKztTJzdTHzdXPz8/JzdXJzdXJzdTKzdXLz9TPz9/KzdTKzdXHy9PKytXHz9fJztTKzdXJz9bJzdQJeihHAAAAE3RSTlMAv4BgIHDf76+PEJ9gQDAgz59Qt6E4cQAAAINJREFUOMvt08kOgzAMRdHYJM5Qhrbv//+1KhBhrEhsQGw4mwy6irKxOxMnslKvg4w3WYKsCrxa7+KrCnYNko4KorrzHtkrtigEQ8Z9weBuJ0gstairMaK3hQW+pwikhOPi+ccV/5D5aorrBKToLP4/Uj6YluMAIQsQitsAdNSUB3eSH9T3Bnx5dfC7AAAAAElFTkSuQmCC',
    //   unSelectedImg:
    //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAMAAACrZuH4AAAAPFBMVEUAAADKztTJzdTHzdXPz8/JzdXJzdXJzdTKzdXLz9TPz9/KzdTKzdXHy9PKytXHz9fJztTKzdXJz9bJzdQJeihHAAAAE3RSTlMAv4BgIHDf76+PEJ9gQDAgz59Qt6E4cQAAAINJREFUOMvt08kOgzAMRdHYJM5Qhrbv//+1KhBhrEhsQGw4mwy6irKxOxMnslKvg4w3WYKsCrxa7+KrCnYNko4KorrzHtkrtigEQ8Z9weBuJ0gstairMaK3hQW+pwikhOPi+ccV/5D5aorrBKToLP4/Uj6YluMAIQsQitsAdNSUB3eSH9T3Bnx5dfC7AAAAAElFTkSuQmCC',
    // },
    {
      name: 'Reward',
      href: `/${router.locale}/rewards`,
      selectedImg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.5 0.75H10.5C11.1904 0.75 11.75 1.30964 11.75 2V12C11.75 12.6904 11.1904 13.25 10.5 13.25H2.5C1.80964 13.25 1.25 12.6904 1.25 12V2C1.25 1.30964 1.80964 0.75 2.5 0.75ZM0.5 2C0.5 0.89543 1.39543 0 2.5 0H10.5C11.6046 0 12.5 0.895431 12.5 2V12C12.5 13.1046 11.6046 14 10.5 14H2.5C1.39543 14 0.5 13.1046 0.5 12V2ZM3.875 3C3.875 2.79289 3.70711 2.625 3.5 2.625C3.29289 2.625 3.125 2.79289 3.125 3C3.125 4.86396 4.63604 6.375 6.5 6.375C8.36396 6.375 9.875 4.86396 9.875 3C9.875 2.79289 9.70711 2.625 9.5 2.625C9.29289 2.625 9.125 2.79289 9.125 3C9.125 4.44975 7.94975 5.625 6.5 5.625C5.05025 5.625 3.875 4.44975 3.875 3Z"
            fill="white"
          />
        </svg>
      ),
      unSelectedImg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.5 0.75H10.5C11.1904 0.75 11.75 1.30964 11.75 2V12C11.75 12.6904 11.1904 13.25 10.5 13.25H2.5C1.80964 13.25 1.25 12.6904 1.25 12V2C1.25 1.30964 1.80964 0.75 2.5 0.75ZM0.5 2C0.5 0.89543 1.39543 0 2.5 0H10.5C11.6046 0 12.5 0.895431 12.5 2V12C12.5 13.1046 11.6046 14 10.5 14H2.5C1.39543 14 0.5 13.1046 0.5 12V2ZM3.875 3C3.875 2.79289 3.70711 2.625 3.5 2.625C3.29289 2.625 3.125 2.79289 3.125 3C3.125 4.86396 4.63604 6.375 6.5 6.375C8.36396 6.375 9.875 4.86396 9.875 3C9.875 2.79289 9.70711 2.625 9.5 2.625C9.29289 2.625 9.125 2.79289 9.125 3C9.125 4.44975 7.94975 5.625 6.5 5.625C5.05025 5.625 3.875 4.44975 3.875 3Z"
            fill="white"
            fillOpacity="0.4"
          />
        </svg>
      ),
    },
    // {
    //   name: 'Une',
    //   href: '/',
    //   selectedImg:
    //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAMAAACrZuH4AAAAP1BMVEUAAADJzdPKztTJzdTJzdTKztTHz9fPz9/JztTKzdTIzdXJzdTHy9PHzNTJzdPLz9XIzdTJz9bLz9PPz8/JzdQAoLGfAAAAFHRSTlMAgL/f75AgEM+fYFBAoK9/cFBAEIKfPiUAAACkSURBVDjLzZLbCsMgEER1LzGJ9j7//61tWVC7Cn0LOQ8ysxxEcMPRJOJkaeHNkuMKREsK0ES4oc4JwH0QFnxgywxAluERcJC7gUEaewj8cwtLCY4snFrbkcNAQWxlpTCBuqnZHoU3dPueLcXBgNQuc0PqRDA3LmrN0sQwmGt0RuPchv4zaP5za2+XUcjYW3mxPLzwFPZbGHu0bmFlX90ixxQO5A15MAi10SBUigAAAABJRU5ErkJggg==',
    //   unSelectedImg:
    //     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAgCAMAAACrZuH4AAAAP1BMVEUAAADJzdPKztTJzdTJzdTKztTHz9fPz9/JztTKzdTIzdXJzdTHy9PHzNTJzdPLz9XIzdTJz9bLz9PPz8/JzdQAoLGfAAAAFHRSTlMAgL/f75AgEM+fYFBAoK9/cFBAEIKfPiUAAACkSURBVDjLzZLbCsMgEER1LzGJ9j7//61tWVC7Cn0LOQ8ysxxEcMPRJOJkaeHNkuMKREsK0ES4oc4JwH0QFnxgywxAluERcJC7gUEaewj8cwtLCY4snFrbkcNAQWxlpTCBuqnZHoU3dPueLcXBgNQuc0PqRDA3LmrN0sQwmGt0RuPchv4zaP5za2+XUcjYW3mxPLzwFPZbGHu0bmFlX90ixxQO5A15MAi10SBUigAAAABJRU5ErkJggg==',
    // },
    {
      name: 'Une Field',
      href: `https://ai.unemeta.com/zh`,
      selectedImg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.800049 2.95078C0.800049 1.6253 1.87457 0.550781 3.20005 0.550781H13.2C14.5255 0.550781 15.6 1.6253 15.6 2.95078V3.70078H14.8V2.95078C14.8 2.06713 14.0837 1.35078 13.2 1.35078H3.20005C2.31639 1.35078 1.60005 2.06713 1.60005 2.95078V10.2008C1.60005 10.9464 2.20446 11.5508 2.95005 11.5508V12.3508C1.76264 12.3508 0.800049 11.3882 0.800049 10.2008V2.95078Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.0002 13.1492V14.236L12.536 13.1492H14.2002C14.8629 13.1492 15.4002 12.612 15.4002 11.9492V4.94922C15.4002 4.28648 14.8629 3.74922 14.2002 3.74922H4.2002C3.53745 3.74922 3.0002 4.28648 3.0002 4.94922V11.9492C3.0002 12.612 3.53745 13.1492 4.2002 13.1492H10.0002ZM9.2002 15.4492V13.9492H4.2002C3.09563 13.9492 2.2002 13.0538 2.2002 11.9492V4.94922C2.2002 3.84465 3.09563 2.94922 4.2002 2.94922H14.2002C15.3048 2.94922 16.2002 3.84465 16.2002 4.94922V11.9492C16.2002 13.0538 15.3048 13.9492 14.2002 13.9492H12.7002L9.2002 15.4492Z"
            fill="white"
          />
          <path
            d="M7.2002 8.94922C7.2002 9.5015 6.75248 9.94922 6.2002 9.94922C5.64791 9.94922 5.2002 9.5015 5.2002 8.94922C5.2002 8.39693 5.64791 7.94922 6.2002 7.94922C6.75248 7.94922 7.2002 8.39693 7.2002 8.94922Z"
            fill="white"
          />
          <path
            d="M10.2002 8.94922C10.2002 9.5015 9.75248 9.94922 9.2002 9.94922C8.64791 9.94922 8.2002 9.5015 8.2002 8.94922C8.2002 8.39693 8.64791 7.94922 9.2002 7.94922C9.75248 7.94922 10.2002 8.39693 10.2002 8.94922Z"
            fill="white"
          />
          <path
            d="M13.2002 8.94922C13.2002 9.5015 12.7525 9.94922 12.2002 9.94922C11.6479 9.94922 11.2002 9.5015 11.2002 8.94922C11.2002 8.39693 11.6479 7.94922 12.2002 7.94922C12.7525 7.94922 13.2002 8.39693 13.2002 8.94922Z"
            fill="white"
          />
        </svg>
      ),
      unSelectedImg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.800049 2.95078C0.800049 1.6253 1.87457 0.550781 3.20005 0.550781H13.2C14.5255 0.550781 15.6 1.6253 15.6 2.95078V3.70078H14.8V2.95078C14.8 2.06713 14.0837 1.35078 13.2 1.35078H3.20005C2.31639 1.35078 1.60005 2.06713 1.60005 2.95078V10.2008C1.60005 10.9464 2.20446 11.5508 2.95005 11.5508V12.3508C1.76264 12.3508 0.800049 11.3882 0.800049 10.2008V2.95078Z"
            fill="white"
            fillOpacity="0.4"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.0002 13.1492V14.236L12.536 13.1492H14.2002C14.8629 13.1492 15.4002 12.612 15.4002 11.9492V4.94922C15.4002 4.28648 14.8629 3.74922 14.2002 3.74922H4.2002C3.53745 3.74922 3.0002 4.28648 3.0002 4.94922V11.9492C3.0002 12.612 3.53745 13.1492 4.2002 13.1492H10.0002ZM9.2002 15.4492V13.9492H4.2002C3.09563 13.9492 2.2002 13.0538 2.2002 11.9492V4.94922C2.2002 3.84465 3.09563 2.94922 4.2002 2.94922H14.2002C15.3048 2.94922 16.2002 3.84465 16.2002 4.94922V11.9492C16.2002 13.0538 15.3048 13.9492 14.2002 13.9492H12.7002L9.2002 15.4492Z"
            fill="white"
            fillOpacity="0.4"
          />
          <path
            d="M7.2002 8.94922C7.2002 9.5015 6.75248 9.94922 6.2002 9.94922C5.64791 9.94922 5.2002 9.5015 5.2002 8.94922C5.2002 8.39693 5.64791 7.94922 6.2002 7.94922C6.75248 7.94922 7.2002 8.39693 7.2002 8.94922Z"
            fill="white"
            fillOpacity="0.4"
          />
          <path
            d="M10.2002 8.94922C10.2002 9.5015 9.75248 9.94922 9.2002 9.94922C8.64791 9.94922 8.2002 9.5015 8.2002 8.94922C8.2002 8.39693 8.64791 7.94922 9.2002 7.94922C9.75248 7.94922 10.2002 8.39693 10.2002 8.94922Z"
            fill="white"
            fillOpacity="0.4"
          />
          <path
            d="M13.2002 8.94922C13.2002 9.5015 12.7525 9.94922 12.2002 9.94922C11.6479 9.94922 11.2002 9.5015 11.2002 8.94922C11.2002 8.39693 11.6479 7.94922 12.2002 7.94922C12.7525 7.94922 13.2002 8.39693 13.2002 8.94922Z"
            fill="white"
            fillOpacity="0.4"
          />
        </svg>
      ),
    },
    {
      name: 'Explore',
      href: `/${router.locale}/explore`,
      selectedImg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.07726 2.85816C2.37095 2.32896 3.43655 0.5 4.13636 0.5C4.71961 0.5 4.91015 1.77042 4.97149 2.5H8.02851C8.08985 1.77042 8.28039 0.5 8.86364 0.5C9.56345 0.5 10.629 2.32896 10.9227 2.85816C11.8619 3.36499 12.5 4.35797 12.5 5.5V10.5C12.5 12.1569 11.1569 13.5 9.5 13.5H3.5C1.84315 13.5 0.5 12.1569 0.5 10.5V5.5C0.5 4.35797 1.13813 3.36499 2.07726 2.85816ZM3.5 3.25H9.5C10.7426 3.25 11.75 4.25736 11.75 5.5V10.5C11.75 11.7426 10.7426 12.75 9.5 12.75H3.5C2.25736 12.75 1.25 11.7426 1.25 10.5V5.5C1.25 4.25736 2.25736 3.25 3.5 3.25ZM4 7.5C4.27614 7.5 4.5 7.05228 4.5 6.5C4.5 5.94772 4.27614 5.5 4 5.5C3.72386 5.5 3.5 5.94772 3.5 6.5C3.5 7.05228 3.72386 7.5 4 7.5ZM7 7.5C7 7.77614 6.77614 8 6.5 8C6.22386 8 6 7.77614 6 7.5L6.5 7.50009L7 7.5ZM9 7.5C9.27614 7.5 9.5 7.05228 9.5 6.5C9.5 5.94772 9.27614 5.5 9 5.5C8.72386 5.5 8.5 5.94772 8.5 6.5C8.5 7.05228 8.72386 7.5 9 7.5Z"
            fill="white"
          />
        </svg>
      ),
      unSelectedImg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.07726 2.85816C2.37095 2.32896 3.43655 0.5 4.13636 0.5C4.71961 0.5 4.91015 1.77042 4.97149 2.5H8.02851C8.08985 1.77042 8.28039 0.5 8.86364 0.5C9.56345 0.5 10.629 2.32896 10.9227 2.85816C11.8619 3.36499 12.5 4.35797 12.5 5.5V10.5C12.5 12.1569 11.1569 13.5 9.5 13.5H3.5C1.84315 13.5 0.5 12.1569 0.5 10.5V5.5C0.5 4.35797 1.13813 3.36499 2.07726 2.85816ZM3.5 3.25H9.5C10.7426 3.25 11.75 4.25736 11.75 5.5V10.5C11.75 11.7426 10.7426 12.75 9.5 12.75H3.5C2.25736 12.75 1.25 11.7426 1.25 10.5V5.5C1.25 4.25736 2.25736 3.25 3.5 3.25ZM4 7.5C4.27614 7.5 4.5 7.05228 4.5 6.5C4.5 5.94772 4.27614 5.5 4 5.5C3.72386 5.5 3.5 5.94772 3.5 6.5C3.5 7.05228 3.72386 7.5 4 7.5ZM7 7.5C7 7.77614 6.77614 8 6.5 8C6.22386 8 6 7.77614 6 7.5L6.5 7.50009L7 7.5ZM9 7.5C9.27614 7.5 9.5 7.05228 9.5 6.5C9.5 5.94772 9.27614 5.5 9 5.5C8.72386 5.5 8.5 5.94772 8.5 6.5C8.5 7.05228 8.72386 7.5 9 7.5Z"
            fill="white"
            fillOpacity="0.4"
          />
        </svg>
      ),
    },
    {
      name: 'Profile',
      href: `/${router.locale}/account/setting`,
      selectedImg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="14"
          viewBox="0 0 15 14"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.25 3.5C10.25 5.01878 9.01878 6.25 7.5 6.25C5.98122 6.25 4.75 5.01878 4.75 3.5C4.75 1.98122 5.98122 0.75 7.5 0.75C9.01878 0.75 10.25 1.98122 10.25 3.5ZM11 3.5C11 5.433 9.433 7 7.5 7C5.567 7 4 5.433 4 3.5C4 1.567 5.567 0 7.5 0C9.433 0 11 1.567 11 3.5ZM1.25 11C1.25 9.75736 2.25736 8.75 3.5 8.75H11.5C12.7426 8.75 13.75 9.75736 13.75 11C13.75 12.2426 12.7426 13.25 11.5 13.25H3.5C2.25736 13.25 1.25 12.2426 1.25 11ZM0.5 11C0.5 9.34315 1.84315 8 3.5 8H11.5C13.1569 8 14.5 9.34315 14.5 11C14.5 12.6569 13.1569 14 11.5 14H3.5C1.84315 14 0.5 12.6569 0.5 11Z"
            fill="white"
          />
        </svg>
      ),
      unSelectedImg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="14"
          viewBox="0 0 15 14"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.25 3.5C10.25 5.01878 9.01878 6.25 7.5 6.25C5.98122 6.25 4.75 5.01878 4.75 3.5C4.75 1.98122 5.98122 0.75 7.5 0.75C9.01878 0.75 10.25 1.98122 10.25 3.5ZM11 3.5C11 5.433 9.433 7 7.5 7C5.567 7 4 5.433 4 3.5C4 1.567 5.567 0 7.5 0C9.433 0 11 1.567 11 3.5ZM1.25 11C1.25 9.75736 2.25736 8.75 3.5 8.75H11.5C12.7426 8.75 13.75 9.75736 13.75 11C13.75 12.2426 12.7426 13.25 11.5 13.25H3.5C2.25736 13.25 1.25 12.2426 1.25 11ZM0.5 11C0.5 9.34315 1.84315 8 3.5 8H11.5C13.1569 8 14.5 9.34315 14.5 11C14.5 12.6569 13.1569 14 11.5 14H3.5C1.84315 14 0.5 12.6569 0.5 11Z"
            fill="white"
            fillOpacity="0.4"
          />
        </svg>
      ),
    },
  ];
  useEffect(() => {
    /**
     * 设置菜单初始值
     */
    navList.forEach((item) => {
      if (router.route !== '/' && item.href.includes(router.route)) {
        setSelectedNav(item.name);
        console.log(router.route, item);
      }
    });
  }, []);
  return (
    <>
      {router?.pathname !== '/chat' ? (
        <Box
          display={{
            base: 'block',
            md: 'none',
          }}
          w="full"
          h="48px"
          bottom="0"
          position="sticky"
          backgroundColor="white"
          //   boxShadow={hasScroll ? 'rgba(0, 0, 0, 0.05) 4px 8px 0px' : 'none'}
          {...props}
        >
          <Flex
            maxW="full"
            align="center"
            h="56px"
            justifyContent="space-between"
            fontSize={14}
            bg={'#404040'}
          >
            {navList.map((nav) => {
              return (
                <NextLink passHref href={nav.href} key={nav.name}>
                  <Link
                    w="64px"
                    target={nav.name === 'Une Field' ? '_blank' : '_self'}
                    onClick={() => setSelectedNav(nav.name)}
                  >
                    <Flex
                      direction="column"
                      alignItems="center"
                      color={
                        selectedNav === nav.name
                          ? '#fff'
                          : 'rgba(255, 255, 255, 0.40)'
                      }
                    >
                      {/* <Image
                        w="16px"
                        h="16px"
                        src={
                          nav.name === selectedNav
                            ? nav.selectedImg
                            : nav.unSelectedImg
                        }
                        fallbackSrc={undefined}
                      /> */}
                      {nav.name === selectedNav
                        ? nav.selectedImg
                        : nav.unSelectedImg}
                      <Text>{nav.name}</Text>
                    </Flex>
                  </Link>
                </NextLink>
              );
            })}
          </Flex>
        </Box>
      ) : (
        ''
      )}
    </>
  );
}
