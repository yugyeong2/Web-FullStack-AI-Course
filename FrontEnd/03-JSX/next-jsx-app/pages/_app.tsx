// 전역 css 파일을 참조하여, 리액트 앱 전체 컴포넌트에서 해당 스타일 사용가능
import "@/styles/globals.css";
// App 최상위 컴포넌트에 전달되는 파라미터의 타입 참조
import type { AppProps } from "next/app"; // NextJS에서 제공하는 AppProps 타입

export default function App({ Component, pageProps }: AppProps) { // Component는 자식 컴포넌트 (hierarchical한 구조)
  // Component 파라미터는 라우팅 주소에 따라 변경되는 페이지 컴포넌트를 의미한다.
  return <Component {...pageProps} />;
}
