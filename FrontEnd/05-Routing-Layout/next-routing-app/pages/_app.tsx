/*
 * pages 폴더 내에서 제공되는 모든 페이지 컴포넌트(단, _document.tsx만 제외)는 최상위 부모컴포넌트로, _app.tsx 파일로 감싸져서 제공된다.
 * _app.tsx 파일에서는 전체 화면 레이아웃을 구성하거나, 전역 CSS 파일을 적용한다.
 * 페이지별 공통 레이아웃 구성 및 유지 가능
 * 자식 컴포넌트 구성 가능
*/

// React Next 프론트 앱의 전역 스타일시트 참조 및 적용
import "@/styles/globals.css";

// NextApp의 최상위 App 컴포넌트의 타입인 AppProps를 참조하여,
// 기본 props 값과 자식(콘텐츠) 컴포넌트를 파라메터로 받아서, App컴포넌트를 생성
import type { AppProps } from "next/app";

// 현재 사용자 URL 라우팅 주소 분석을 위한 useRouter Hook 참조
import { useRouter } from 'next/router';

// 레이아웃 구성 재사용 컴포넌트 참조
import Header from '@/components/header';
import Footer from '@/components/footer';

// Base/Auth Layout 컴포넌트 참조
import BaseLayout from '@/components/base-layout';
import AuthLayout from '@/components/auth-layout';

// 자식 컴포넌트(컨텐츠)와 기본 props 값을 파라미터로 받아서, App 컴포넌트를 생성한다.
export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter();

  // 현재 웹브라우저의 URL 주소 경로 정보 조회
  // Ex) /blogs/1, /mypage/profile, mypage/setting/config 등
  const currentPath = router.pathname;
  console.log("현재 URL 경로:", currentPath);

/* Component는 App 컴포넌트 내에 포함(출력)되는 자식 컴포넌트를 의미한다.
  자식 컴포넌트에 최상위 App 컴포넌트의 각종 props의 복사본을 자식에게 전달한다. */
  return (
    // 방법 1)
    // <>
    //   {/* 상단 헤더 GNB(Global Navigation Bar) 영역 */}
    //   <Header/>
      
    //   {/* 주소가 변경될 때마다 바뀌는 페이지 컴포넌트 출력 영역 */}
    //   <Component {...pageProps} />

    //   {/* 하단 푸터 CopyRight 영역 */}
    // </>

    // 방법 2)
    // <>
    //   <BaseLayout>
    //     <Component {...pageProps} />
    //   </BaseLayout>
    // </>

    // 방법 3)
    // 사용자가 접속한 URL경로에 따라서 레이아웃을 다르게 구성하기
    <>
      {/* 삼항연산자 */}
      {currentPath.includes("/mypage") ? (
        <AuthLayout>
          <Component {...pageProps} />
        </AuthLayout>
        ):(
          <BaseLayout>
            <Component {...pageProps} />
          </BaseLayout>
        )}
    </>
  );
}
