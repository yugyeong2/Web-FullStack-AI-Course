module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "admin",
        {
        index_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            comment: "관리자 계정 인덱스 아이디",
        },
        admin_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: "관리자 아이디",
        },
        admin_password: {
            type: DataTypes.STRING(200),
            allowNull: false,
            comment: "관리자 비밀번호 - 난독화된 단방향 암호화된 텍스트값",
        },
        admin_name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            comment: "관리자 이름",
        },
        admin_email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: "관리자 이메일",
        },
        admin_birth: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: "관리자 생년월일",
        },
        admin_telephone: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: "관리자 전화번호",
        },
        admin_gender: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "관리자 성별 - 1:남성,2:여성",
        },
        company_department: {
            type: DataTypes.STRING(100),
            allowNull: true,
            comment: "기업/부서명",
        },
        account_status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            comment: "계정 상태 - 1:사용 중,0:사용 불가",
        },
        register_date: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: "등록 일시",
        },
        register_index_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "등록자 고유번호",
        },
        edit_date: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: "등록 일시",
        },
        edit_index_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "수정자 고유번호",
        },
        },
        {
        sequelize,
        tableName: "admin", //기본 테이블명 옵션이 복수형이 아닌 여기 지정한 테이블명으로 생성됨
        timestamps: false,
        comment: "관리자 사이트 관리자 계정 정보",
        indexes: [
            {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "index_id" }], //여러 개의 컬럼이 프라이머리키인 경우 (복합키){} 추가하여 설정가능
            },
        ],
        }
    );
};