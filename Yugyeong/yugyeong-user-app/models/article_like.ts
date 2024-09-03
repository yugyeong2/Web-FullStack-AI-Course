import { Sequelize, DataTypes, Model } from 'sequelize';

class ArticleLike extends Model {
    public article_like_id!: number;
    public article_id!: number;
    public member_id!: number;
    public nickname!: string;
    public reg_date!: Date;
    public reg_member_id!: number;
}

export default function defineArticleLikeModel(sequelize: Sequelize) {
    ArticleLike.init(
        {
            article_like_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: "좋아요 고유번호",
            },
            article_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "게시글 고유번호",
            },
            nickname: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: "좋아요한 회원 이름",
            },
            like_date: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "좋아요를 누른 일시",
            },
            reg_member_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "좋아요한 회원 고유번호",
            }
        },
        {
            sequelize,
            tableName: "article_like",
            timestamps: false,
            comment: "좋아요 테이블",
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "article_like_id" }]
                }
            ]
        }
    );

    return ArticleLike;
}
