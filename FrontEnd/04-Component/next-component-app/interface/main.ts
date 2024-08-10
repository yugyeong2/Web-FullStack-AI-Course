// 모듈 파일이기 때문에 ts 파일

// Main 컴포넌트(부모)에서 Guide 컴포넌트(자식)로 전달되는 props 데이터 타입 정의
export type GuideType = {
    href: string;
    title: string;
    desc: string;
};

export interface IGuide {
    href: string;
    title: string;
    desc: string;
};
