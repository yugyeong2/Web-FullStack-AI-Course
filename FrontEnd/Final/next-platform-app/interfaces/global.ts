export interface IGlobalData {
    token: string;
    member: IGlobalMember;
}

export interface IGlobalMember {
    member_id: number;
    name: string;
    email: string;
}