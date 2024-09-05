export interface PostData {
    article_id: number;
    article_type_code: number;
    board_type_code: number;
    title: string;
    contents: string;
    view_count: number;
    ip_address: string;
    is_display_code: number;
    reg_date: Date;
    reg_member_id: number;
    edit_date: Date;
    edit_member_id: number;
}


export interface LikeData {
    article_like_id: number;
    article_id: number;
    nickname: string;
    rag_date: Date;
    reg_member_id: number;
}

export interface CommentData {
    article_comment_id: number;
    article_id: number;
    contents: string;
    nickname: string;
    reg_date: Date;
    reg_member_id: number;
    edit_date: Date;
    edit_member_id: number;
}

export interface MemberData {
    member_id: number;
    email: string;
    member_password: string;
    username: string;
    nickname: string;
    profile_image_path: string;
    telephone: string;
    entry_type_code: number;
    use_state_code: number;
    birth_date: string;
    entry_date: Date;
    edit_date: Date;
    edit_member_id: number;
}