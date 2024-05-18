import { ReactNode } from 'react';
import { MobileFooter } from './Footer';
import { MobileFooterLanding } from './Footer_landing';
import { useRouter } from 'next/router';
import NavView from './Header/newHeader/nav';
import MainHeader from './Header/header';

export default function PageLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <>
      {/* {router?.pathname === '/UneFieldLandingPage' ? (
        <HeaderLanding />
      ) : (
        <Header />
      )} */}
      {router?.pathname === '/chat' ? null : <MainHeader />}
      {children}
      {/* <MobileFooter /> */}
      {/* {router?.pathname === '/UneFieldLandingPage' ? (
        <MobileFooterLanding />
      ) : (
        <MobileFooter />
      )} */}
      {/* <MobileFooter /> */}
      {router?.pathname === '/chat' ? null : (
        <div className="hidden llg:block sticky z-[0] left-0 bottom-0 w-full llg:bg-[#ffffff]">
          <NavView className=""></NavView>
        </div>
      )}
    </>
  );
}

export * from './Footer';
