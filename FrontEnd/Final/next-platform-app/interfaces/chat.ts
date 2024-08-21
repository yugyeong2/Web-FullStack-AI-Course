export interface IMessage {
    member_id: number;
    name: string;
    profile: string;
    message: string;
    send_date: string;
}

export interface IChannel {
    channel_id: number;
    community_id: number;
    category_code: number | null;
    channel_name: string;
    channel_img_path: string | null;
    user_limit: number,
    channel_desc: string | null;
    channel_state_code: ChannelState;
    reg_date: string;
    reg_member_id: number;
    edit_date: string | null;
    edit_member_id: string | null;
}

export interface ICreateChannel {
    channel_name: string;
    user_limit: number;
    channel_state_code: ChannelState;
}

// 채널 상태 코드(사용 여부) 열거형 타입
export enum ChannelState {
    NotUsed = 0, // 사용하지 않음
    Used = 1 // 사용함
}