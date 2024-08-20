import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import PostLayout from "@/components/post-layout";
import HomeLayout from "@/components/home-layout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const currentPath: string = router.pathname; // 현재 경로를 가져와 경로에 맞는 컴포넌트를 랜더링한다.
  console.log('currentPath:', currentPath);

  let layout: string = 'home'; // 기본 레이아웃으로 home 레이아웃이 렌더링된다.

  if(currentPath === '/signin' || currentPath === '/signup') {
    layout = 'auth';
  } else if(currentPath.indexOf('posting')) { // 현재 경로에 posting이 포함되어 있으면, posting 레이아웃을 랜더링한다.
    layout = 'post';
  } else {
    layout = 'home';
  }

  console.log('layout:', layout);

  const renderLayout = () => {
    switch(layout) {
      case 'auth':
        return ( <Component {...pageProps} /> );
      case 'post':
        return (
          <PostLayout>
            <Component {...pageProps} />
          </PostLayout>
        )
      default: // default: home
        return (
          <HomeLayout>
            <Component {...pageProps} />
          </HomeLayout>
        )
    }
  };

  return (
    <>
      {renderLayout()}
    </>
  );
}
