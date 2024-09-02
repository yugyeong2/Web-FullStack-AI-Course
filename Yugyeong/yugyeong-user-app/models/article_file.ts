import { Sequelize, DataTypes, Model } from 'sequelize';

class ArticleFile extends Model {
    public article_file_id!: number;
    public article_id!: number;
    public file_name!: string;
    public file_size!: number;
    public file_path?: string;
    public file_type!: string;
    public reg_date!: Date;
    public reg_member_id!: number;
}

export default function defineArticleFileModel(sequelize: Sequelize) {
    ArticleFile.init(
        {
            article_file_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: "게시글 첨부파일 고유번호",
            },
            article_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "참조하는 게시글 고유번호:FK",
            },
            file_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: "파일명-확장자포함",
            },
            file_size: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "파일용량",
            },
            file_path: {
                type: DataTypes.STRING(200),
                allowNull: true,
                comment: "전체 파일링크정보(도메인포함또는 미포함)",
            },
            file_type: {
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: "파일mimetype",
            },
            reg_date: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "등록일시",
            },
            reg_member_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "등록자 고유번호",
            },
        },
        {
            sequelize,
            tableName: "article_file", // 기본 테이블명 옵션이 복수형이 아닌 여기 지정한 테이블명으로 생성됨
            timestamps: false,
            comment: "게시글 파일정보 테이블",
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "article_file_id" }],
                },
            ],
        }
    );

    return ArticleFile;
}