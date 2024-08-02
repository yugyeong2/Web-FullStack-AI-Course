// 서버 상의 경로를 조회하는 패키지 참조
const path = require('path');

// 시퀄라이즈 ORM 프레임워크 객체 참조
// 대문자 Sequelize는 각종 sequelize ORM 프레임워크 내에서 제공하는 객체, 데이터 타입 등을 제공한다.(ORM 패키지 자체)
const Sequelize = require('sequelize');

// 개발모드 환경설정
const env = process.env.NODE_ENV || 'development';

// DB 연결 환경설정 정보 변경 처리
// __dirname은 현재 모듈(index.js)의 물리적 경로 조회
const config = require(path.join(__dirname,'..', 'config', 'config.json'))[env];

// 데이터 베이스 객체
const db = {};

// DB 연결 정보로 시퀄라이즈 ORM 객체 생성
// 소문자 sequelize는 실제 DB 서버에 연결하고, DB 서버에 SQL 구문을 전달해서 데이터를 처리하는 기능을 제공한다.
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// 동적으로 속성을 만듬
// DB 처리 객체에 시퀄라이즈 정보 맵핑 처리
// 이후 DB객체를 통해 데이터 관리 가능
db.sequelize = sequelize; // DB 연결 정보를 포함한 DB제어 객체속성(CRUD)
db.Sequelize = Sequelize; // Sequelize 페키지에서 제공하는 각종 데이터 타입 및 관련 객체 정보를 제공함

// 관리자 모델 모듈파일을 참조하고, db 객체에 Admin 동적 속성 정의
db.Admin = require('./admin.js')(sequelize, Sequelize);
// 사용자 모델 모듈 파일을 참조하고, db 객체에 Member 동적 속성 정의
db.Member = require('./member.js')(sequelize, Sequelize);
// 게시글 모델 모듈 파일을 참조하고, db 객체에 Article 동적 속성 추가
db.Article = require('./article.js')(sequelize, Sequelize);
db.ArticleFile = require('./article_file.js')(sequelize, Sequelize);

// db객체 외부로 노출
module.exports = db;