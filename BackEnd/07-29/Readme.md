### MySQL
- Schema(=Database)
- Character Set은 utf8mb4(utf8에 이모지를 포함한 최신 버전)
- collation은 unicode_ci를 선택하면 정렬을 할 수 있다.

- 데이터 유형
    - 문자형
        - CHAT(고정길이형)
        문자열 고정길이는 해당 길이만큼 사이즈를 사용한다.
        실제 데이터가 안들어가도, 데이터 길이가 고정된 형태 데이터 입력
        길이가 정해져 있는 데이터를 사용할 때 CHAR를 사용한다.
        - VARCHAR(가변길이형)
        문자열 가변길이
        알파벳 한 글자: 1byte, 유니코드 한 글자: 2byte
        - TEXT
        1000자리 이상의 긴 문자열

- TABLE
    - 제약조건
        - PK(Primary Key)
        - NN(Not Null)
        NULL은 Data가 입력 안된 초기 상태, 공백 문자는 값이 들어가 있다.
        - UQ(Unique Key)
        Primary Key는 Unique Key
        - ZF(Zero Fill)
        남는 공간은 0으로 채운다.
        - AI(Auto Increment)
        자동 증가

- Model
데이터의 구조를 프로그래밍 언어로 표현한 클래스
물리적인 테이블을 백엔드에서 제어하기 위함
    - Data Model: DB의 TABLE과 1대1 매핑된다.
    - View Mdoel: 화면의 구조가 기준
    - DTO Model: 여러 모델의 데이터를 하나의 모델로 준다.

- ORM
모델과 물리적인 TABLE을 1대1 매핑해 모델을 통해 관리한다.
ORM 프레임워크에서 동적으로 SQL 쿼리를 만들어준다.

- Code First & Model First
코드로 모델을 만들고, DB를 적용
새로운 프로젝트를 만들 때 사용한다.
- Database First
만들어진 DB를 바탕으로 코드에 적용
이미 운영 중인 시스템에 사용한다.

- /model/index.js
index.js는 물리적인 데이터베이스 그 자체를 가리킨다.
