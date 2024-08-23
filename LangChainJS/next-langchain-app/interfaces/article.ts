export interface IArticle {
    id: number;
    title: string;
    contents: string | null;
    view_cnt: number;
    ip_address?: string;
    create_at: string;
    create_member_id: number;
}