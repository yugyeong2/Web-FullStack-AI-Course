import { Sequelize, DataTypes, Model } from 'sequelize';

class Article extends Model {
    public article_id!: number;
    public article_type_code!: number;
    public board_type_code!: number;
    public title!: string;
    public contents?: string;
    public view_count!: number;
    public ip_address!: string;
    public is_display_code!: number;
    public reg_date!: Date;
    public reg_member_id!: number;
    public edit_date?: Date;
    public edit_member_id?: number;
}

export default function defineArticleModel(sequelize: Sequelize) {
    Article.init(
        {
            article_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: "게시글 고유번호",
            },
            article_type_code: {
                type: DataTypes.TINYINT,
                allowNull: false,
                comment: "게시글 유형코드 0: 일반 게시글 1: 상단 고정 게시글",
            },
            board_type_code: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "게시판 고유번호 1: 공지사항 게시판, 2: 일반 사용자 게시판, 3: 생성형 AI 이미지 게시판",
            },
            title: {
                type: DataTypes.STRING(200),
                allowNull: false,
                comment: "글 제목",
            },
            contents: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: "글 내용",
            },
            view_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "조회 수",
            },
            ip_address: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: "작성자 IP 주소",
            },
            is_display_code: {
                type: DataTypes.TINYINT,
                allowNull: false,
                comment: "게시 여부 0: 게시하지 않음 1: 게시",
            },
            reg_date: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "등록 일시",
            },
            reg_member_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "등록자 고유번호",
            },
            edit_date: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "수정 일시",
            },
            edit_member_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: "수정자 고유번호",
            },
        },
        {
            sequelize,
            tableName: "article",
            timestamps: false,
            comment: "게시글 정보 테이블",
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "article_id" }],
                },
            ],
        }
    );

    return Article;
}