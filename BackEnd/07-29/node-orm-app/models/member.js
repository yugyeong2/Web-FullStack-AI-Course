// member.module을 호출하면 함수가 실행된다.
module.exports = function(sequelize, DataTypes) {
    // DB 서버와 연결 정보를 가진 sequelize 객체의 define() 메소드를 호출하여, 물리적 테이블과 1:1 매핑되는 데이터 모델의 구조를 정의
    // define('물리적 테이블명 - 단수형', 관리 항목 정의(컬럼), 추가옵션);
    // -> 단수형의 테이블명으로 작성하면, 복수형의 물리적 테이블명이 생성된다.(물리적 테이블명 - members)
    return sequelize.define('member', 
        // 관리 항목 정의(컬럼)
        {
            // 회원 고유번호(자동 채번)
            member_id: {
                type: DataTypes.INTEGER, // ORM Framework에서 지원해주는 데이터 타입
                autoIncrement: true, // 자동 채번되는 컬럼(AI) 속성 추가
                primaryKey: true, // 현재 컬럼을 기본키(PK)로 설정
                allowNull: false, // NotNull(NN)으로 설정 -> 반드시 값이 입력되어야 한다.
                comment: '회원 고유번호',
            },
            email: {
                type: DataTypes.STRING(100), // VARCHAR(100)으로 데이터 타입 생성
                allowNull: false,
                comment: '사용자 메일 주소',
            },
            name: {
                type: DataTypes.STRING(50), // VARCHAR(50)으로 데이터 타입 생성
                allowNull: false,
                comment: '회원명'
            },
            entry_date: {
                type: DataTypes.DATE, // DATETIME으로 데이터 타입 생성
                allowNull: false,
                comment: '가입 일시'
            }
        },
        // 추가옵션
        {
            timestamps: true, // 등록 일시(createdAt), 수정 일시(updatedAt) 컬럼을 자동으로 생성한다.
            paranoid: true // 해당 테이블의 실제 데이터를 삭제하지 않고, deletedAt이라는 컬럼을 생성하여, 삭제 시 삭제 일시를 저장한다.
        }
    );
}