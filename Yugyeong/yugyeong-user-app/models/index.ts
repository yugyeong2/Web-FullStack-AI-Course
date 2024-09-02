import path from 'path';
import { Sequelize, DataTypes, Model, Dialect } from 'sequelize';

// 개발모드 환경설정
const env = process.env.APP_ENV || 'development';

// DB 연결 환경설정 정보 변경 처리
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];

// 데이터베이스 객체 정의
const db: { [key: string]: any } = {};

// DB 연결 정보로 시퀄라이즈 ORM 객체 생성
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// 동적으로 속성을 만듬
db.sequelize = sequelize; // DB 연결 정보를 포함한 DB제어 객체속성(CRUD)
db.Sequelize = Sequelize; // Sequelize 패키지에서 제공하는 각종 데이터 타입 및 관련 객체 정보 제공

// 모델 모듈 파일을 참조하고, db 객체에 동적 속성 정의
db.Admin = require('./admin')(sequelize, Sequelize);
db.Member = require('./member')(sequelize, Sequelize);
db.Article = require('./article')(sequelize, Sequelize);
db.ArticleFile = require('./article_file')(sequelize, Sequelize);
db.ArticleLike = require('./article_like')(sequelize, Sequelize);
db.ArticleComment = require('.article_comment')(sequelize, Sequelize);
db.channel = require('./channel')(sequelize, Sequelize);
db.channelMember = require('./channel_member')(sequelize, Sequelize);
db.channelMessage = require('./channel_message')(sequelize, Sequelize);

// db 객체 외부로 노출
export default db;
