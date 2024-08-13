/*
 * SPA(Single WebPage Application)의 실체인 Single Web Html Page를 만들어주는 파일
 * Single Web Page(index.html)의 최상위 구조를 정의하는 파일
 * <html>, <head>, <body>, <div id="_next"></div>등의 구조를 정의하는 파일
 * Tailwind를 통해서 생성되는 각종 CSS 스타일 제공

 * <Html>은 html 태그 생성
 * <Head>는 head 영역 태그 생성
 * <Main> 컴포넌트는 <div id="_next">컨텐츠별 컴포넌트 html 요소 제공</div> 생성
 * <NextScript>는 NEXT.js 실행을 위한 클라이언트 자바스크립트 파일 생성 제공(<script src=""></script>)
 */
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
