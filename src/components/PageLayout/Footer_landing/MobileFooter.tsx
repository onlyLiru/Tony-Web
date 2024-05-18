import { useState, useEffect } from 'react';
import { Box, BoxProps, Flex, Text, Link, Image } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useUserDataValue } from '@/store';
import { useRouter } from 'next/router';

export function MobileFooterLanding(props: BoxProps) {
  // 选中的导航
  const [selectedNav, setSelectedNav] = useState('Home');
  const userData = useUserDataValue();
  const router = useRouter();
  const navList = [
    {
      name: 'Home',
      href: `/${router.locale}`,
      selectedImg: '/images/aiLandingPage/Frame5.png',
      unSelectedImg: '/images/aiLandingPage/11.png',
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
      selectedImg: '/images/aiLandingPage/Frame2.png',
      unSelectedImg: '/images/aiLandingPage/22.png',
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
      name: 'Explore',
      href: `/${router.locale}/explore`,
      selectedImg: '/images/aiLandingPage/Frame3.png',
      unSelectedImg: '/images/aiLandingPage/33.png',
    },
    {
      name: 'Une Field',
      href: `/${router.locale}/UneFieldLandingPage`,
      selectedImg: '/images/aiLandingPage/Frame4.png',
      unSelectedImg: '/images/aiLandingPage/44.png',
    },
    {
      name: 'Profile',
      href: `/${router.locale}/account/setting`,
      selectedImg: '/images/aiLandingPage/Frame1.png',
      unSelectedImg: '/images/aiLandingPage/55.png',
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
          backgroundColor="#404040"
          //   boxShadow={hasScroll ? 'rgba(0, 0, 0, 0.05) 4px 8px 0px' : 'none'}
          {...props}
        >
          <Flex
            maxW="full"
            align="center"
            h="56px"
            // border="1px solid #F2F3F5"
            justifyContent="space-between"
            fontSize={14}
          >
            {navList.map((nav) => {
              return (
                <NextLink passHref href={nav.href} key={nav.name}>
                  <Link w="64px" onClick={() => setSelectedNav(nav.name)}>
                    <Flex
                      direction="column"
                      alignItems="center"
                      color={
                        selectedNav === nav.name
                          ? 'rgba(255,255,255,1)'
                          : 'rgba(255,255,255,.4)'
                      }
                    >
                      <Image
                        w="16px"
                        h="16px"
                        src={
                          nav.name === selectedNav
                            ? nav.selectedImg
                            : nav.unSelectedImg
                        }
                        fallbackSrc={undefined}
                      />
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
