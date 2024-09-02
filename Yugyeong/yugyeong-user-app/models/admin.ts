import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineAdminModel(sequelize: Sequelize) {
    class Admin extends Model {
        public admin_member_id!: number;
        public company_code!: number;
        public admin_id!: string;
        public admin_password!: string;
        public admin_name!: string;
        public email?: string;
        public telephone?: string;
        public dept_name?: string;
        public used_yn_code!: number;
        public reg_date!: Date;
        public reg_member_id!: number;
        public edit_date?: Date;
        public edit_member_id?: number;
    }

    Admin.init(
        {
            admin_member_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: "관리자 웹사이트 관리자 계정 고유번호",
            },
            company_code: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: "소속 회사 코드 - 기준정보테이블참조,1-자회사,2-협력업체",
            },
            admin_id: {
                type: DataTypes.STRING(100),
                allowNull: false,
                comment: "관리자계정아이디-메일주소아님,eddy",
            },
            admin_password: {
                type: DataTypes.STRING(200),
                allowNull: false,
                comment: "관리자계정 난독화된 단방향 암호화된 텍스트값",
            },
            admin_name: {
                type: DataTypes.STRING(200),
                allowNull: false,
                comment: "관리자명",
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "메일주소",
            },
            telephone: {
                type: DataTypes.STRING(50),
                allowNull: true,
                comment: "전화번호",
            },
            dept_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "부서명",
            },
            used_yn_code: {
                type: DataTypes.TINYINT,
                allowNull: false,
                comment: "사용 여부 코드 1:사용 중 0:사용 불가",
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
            tableName: "admin", // 기본 테이블명 옵션이 복수형이 아닌 여기 지정한 테이블명으로 생성됨
            timestamps: false,
            comment: "관리자 사이트 관리자 계정 정보",
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "admin_member_id" }], // 여러개의 컬럼이 프라이머리키인 경우(복합키){}추가하여 설정 가능
                },
            ],
        }
    );

    return Admin;
}