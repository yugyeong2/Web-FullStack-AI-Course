// 단일 게시글 인터페이스 타입 정의
export interface ArticleInterface {
    article_id: number;
    board_type_code: BoardTypeCode;
    title: string;
    article_type_code: ArticleTypeCode;
    contents?: string | null;
    view_count: number;
    ip_address: string;
    is_display_code: IsDisplayCode;
    reg_date: string;
    reg_member_id: number;
    edit_date?: string | null;
    edit_member_id?: string | null;
}

// 게시글 유형 코드 열거형 타입 정의
export enum BoardTypeCode {
    NOTICE = 1, // 공지사항 게시판
    GENERAL = 2 // 일반 사용자 게시판
}

export enum ArticleTypeCode {
    GENERAL = 0, // 일반 게시글 
    TOP_FIXED = 1 // 상단 고정 게시글
}

export enum IsDisplayCode {
    NOT_DISPLAY = 0, // 게시하지 않음
    DISPLAY = 1 // 게시 
}