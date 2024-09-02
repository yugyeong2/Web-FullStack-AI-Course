import { Sequelize, DataTypes, Model } from 'sequelize';

class ArticleComment extends Model {
    public article_comment_id!: number;
    public article_id!: number;
    public member_id!: number;
    public nickname!: string;
    public contents!: string;
    public reg_date!: Date;
    public reg_member_id!: number;
    public edit_date?: Date;
    public edit_member_id?: number;
}

export default function defineArticleCommentModel(sequelize: Sequelize) {
    ArticleComment.init(
        {
            article_comment_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: "댓글 고유번호",
            },
            article_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "게시글 고유번호",
            },
            nickname: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: "댓글 작성자 이름",
            },
            contents: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: "댓글 내용"
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
            }
        },
        {
            sequelize,
            tableName: "article_comment",
            timestamps: false,
            comment: "댓글 테이블",
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "article_comment_id" }]
                }
            ]
        }
    );

    return ArticleComment;
}
