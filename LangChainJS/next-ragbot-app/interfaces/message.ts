export interface IMessage {
    user_type: UserType;
    message: string;
    send_date: Date;
}

export interface ITransMessage {
    role: string;
    message: string;
}

// 대화 이력 챗봇 전용 메시지 타입 정의: 기본 메시지 타입을 상속받아 기능확장
export interface IMemberMessage extends IMessage {
    nickname: string;
}

export enum UserType {
    USER = 'User',
    BOT = 'Bot'
}
