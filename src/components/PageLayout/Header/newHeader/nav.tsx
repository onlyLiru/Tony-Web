import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import classNames from 'classnames';

interface iNavView {
  className?: string;
}
const NavView = ({ className }: iNavView) => {
  const router = useRouter();

  const navList = [
    {
      name: 'Home',
      href: '/',
    },
    // {
    //   name: 'News',
    //   href: '/',
    // },
    {
      name: 'Reward',
      href: `/${router.locale}/rewards`,
    },
    {
      name: 'Une Field',
      href: `https://ai.unemeta.com`,
    },
    {
      name: 'Explore',
      href: `/${router.locale}/explore`,
    },
    // {
    //   name: 'Une',
    //   href: '/',
    // },
    {
      name: 'Profile',
      href: `/${router.locale}/account/setting`,
    },
  ];
  const [selectedNav, setSelectedNav] = useState('Home');
  const [showLogin, setShowLogin] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      if (
        !(router?.pathname === '/err' || router?.pathname === '/anniversary')
      ) {
        setShowLogin(true);
      }
    }, 8000);
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
    <div
      className={classNames(
        'flex justify-start items-center gap-[24px] w-full llg:gap-[0px]',
        className,
      )}
    >
      {navList.map((nav, navIndex) => {
        return (
          <NextLink passHref href={nav.href} key={navIndex}>
            <div
              className={classNames(
                'text-[rgba(255,255,255,0.4)] text-[14px] font-[500] cursor-pointer select-none border-[1.2px] border-solid border-transparent py-[8px] px-[16px] rounded-[8px] hover:border-[#fff] hover:!text-[#fff]  text-center',
                {
                  '!border-[#fff] text-[#fff] llg:!text-[#000000] ':
                    nav.name === selectedNav,
                  'llg:hover:!text-[#000000] llg:flex-1 llg:text-[#000]/40 llg:px-[0px] llg:py-[20px] llg:text-[12px]':
                    true,
                },
              )}
              onClick={() => setSelectedNav(nav.name)}
            >
              {nav.name}
            </div>
          </NextLink>
        );
      })}
    </div>
  );
};
export default NavView;
