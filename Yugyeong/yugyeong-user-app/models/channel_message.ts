import { Sequelize, DataTypes, Model } from 'sequelize';

class ChannelMessage extends Model {
    public channel_msg_id!: number;
    public channel_id!: number;
    public member_id!: number;
    public nickname!: string;
    public message_type_code!: number;
    public connection_id!: string;
    public message!: string;
    public ip_address!: string;
    public msg_state_code!: number;
    public msg_date!: Date;
    public edit_date?: Date;
    public del_date?: Date;
}

export default function defineChannelMessageModel(sequelize: Sequelize) {
    ChannelMessage.init(
        {
            channel_message_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: "채널 메시지 고유번호",
            },
            channel_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "채널고유번호",
            },
            member_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "메시지 발생 회원 고유번호",
            },
            nickname: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: "대화명-닉네임",
            },
            msg_type_code: {
                type: DataTypes.TINYINT,
                allowNull: false,
                comment:
                    "메시지유형코드 0:퇴장메시지 1:입장메시지 2:일반사용자메시지 3:파일공유메시지 4:시스템공지메시지",
            },
            connection_id: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: "웹소켓 고유연결 아이디",
            },
            message: {
                type: DataTypes.STRING(4000),
                allowNull: false,
                comment: "메시지 내용",
            },
            ip_address: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: "사용자 IP",
            },
            message_state_code: {
                type: DataTypes.TINYINT,
                allowNull: false,
                comment: "메시지 상태코드 0:삭제, 1:사용중",
            },
            msg_date: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "메시지 작성일시",
            },
            edit_date: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "메시지 수정 일시",
            },
            del_date: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "메시지 삭제 일시",
            },
        },
        {
            sequelize,
            tableName: "channel_message",
            timestamps: false,
            comment: "채널 메시지 정보",
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "channel_message_id" }],
                },
            ],
        }
    );

    return ChannelMessage;
}