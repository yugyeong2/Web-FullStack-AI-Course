export interface IMessage {
    user_type: UserType;
    message: string;
    send_date: Date;
}

export interface ITransMessage {
    role: string;
    message: string;
}

export enum UserType {
    USER = 'User',
    BOT = 'Bot'
}
