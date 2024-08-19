export interface PostProps {
    post_id: number;
    poster: ProfileProps;
    post_image: string;
    contents: string;
    comments: CommentProps[];
}

export interface CommentProps {
    comment_id: number;
    commenter: ProfileProps;
    comment: string;
}

export interface ProfileProps {
    user_id: number;
    profile_image: string;
    username: string;
    full_name: string;
}