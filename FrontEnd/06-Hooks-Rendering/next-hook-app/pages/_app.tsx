import "@/styles/globals.css";
import type { AppProps } from "next/app";

// 전역 상태 영역 생성을 위한 참조
// createContext 함수를 이용해 전역 상태 공간을 App.tsx 컴포넌트에 생성한다.
import { useState, createContext } from 'react';


// 단일 문자열 전역 데이터를 보관하는 컨텍스트 영역 생성
// createContext('관리하려는 전역 상태 데이터 지정 -> 문자, 숫자, 객체 무관');
export const AppContext = createContext({
  msg: '',
  setMsg: (msg: string) => {}
});

// Context 영역에서 관리하는 데이터 제공 컴포넌트 함수 생성
function MsgProvider({ children }: { children: React.ReactNode }) {

  // 전역으로 관리할 데이터 구조 생성
  const [msg, setMsg] = useState('기본값');
  
  return (
    <AppContext.Provider value={{ msg, setMsg }}>
      {children}
    </AppContext.Provider>
  )};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MsgProvider>
      {/* 레이아웃 컴포넌트 포함 */}
      <Component {...pageProps} />;
    </MsgProvider>
  );
}
