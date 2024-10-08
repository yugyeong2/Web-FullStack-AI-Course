// 리액트 패키지에서 useState Hook을 참조
import { useState } from 'react';

// 폰트 스타일 - 구글 폰트 참조
import { Inter } from "next/font/google";

// 각종 재사용 컴포넌트 참조
import Header from "@/components/header";
import LogoContents from "@/components/logo-contents";
import Guide from "@/components/guide";

import { GuideType, IGuide } from '@/interface/main'
import { handleClientScriptLoad } from 'next/script';

// 폰트 스타일을 적용하기 위해 Inter 함수를 호출
const inter = Inter({ subsets: ["latin"] });

function Main() {
    // 제목 상태값  정의
    // userState(초기 설정값)은 반환값으로 설정된 변수값과 값을 변경하는 전용 setter 함수를 반환한다.
    // state 값은 반드시 지정된 setter 함수를 통해 변경해야 한다.
    const [title, setTitle] = useState('메인 페이지');

    // Next.js 로고 이미지 경로 데이터 정의
    const logoPath = '/next.svg';

    // 프론트엔드 가이드 데이터
    const guides: GuideType[] = [
        {
            href: "https://nextjs.org",
            title: "Next.js",
            desc: "Next.js의 최신 기술을 경험해 보세요!"
        },
        {
            href: "https://tailwindcss.com/",
            title: "Tailwind CSS",
            desc: "Tailwind CSS Framework에 대해 알아보세요!"
        },
        {
            href: "https://js.langchain.com/v0.2/docs/introduction/",
            title: "LangChain",
            desc: "LangChain의 최신 기술을 알아보세요!"
        }
    ];

    // 자식 컴포넌트에서 발생한 이벤트 처리 함수
    // 자식에서 발생한 이벤트를 부모에서 처리 가능
    const handleChildClick = (url: string): void => {// onClick이라는 함수를 전달
        console.log("이동할 URL 데이터:", url);
    }

    return (
        <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >

        <h1>{title}</h1>

        {/* 헤더 컴포넌트 영역 */}
        <Header mainPage="pages/main.tsx" onClick={handleChildClick}>
        {/* ! 시작 태그와 닫는 태그 사이의 데이터는 자식 컴포넌트에서 children으로 받을 수 있다. -> 이미 정해진 데이터 */}
        헤더 컴포넌트의 자식 데이터 전달하기
        </Header>

        {/* 로고 컴포넌트 영역 */}
        <LogoContents logoPath={logoPath} />

        {/* 가이드 컴포넌트 영역 - props 방식으로 자식 컴'포넌트에게 읽기전용 데이터를 전달 */}
        <Guide guides={guides} />

        </main>
    );
}

export default Main;

// index.tsx와 같은 스타일 -> 가독성이 떨어진다.
// export default function Main() {
//     return (
//         <div>
//             Main Page
//         </div>
//     );
// }
