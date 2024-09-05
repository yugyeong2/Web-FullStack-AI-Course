import path from 'path';
import { Sequelize, Dialect } from 'sequelize';
import configJson from '../config/config.json';

import AdminModel from './admin';
import MemberModel from './member';
import ArticleModel from './article';
import ArticleFileModel from './article_file';
import ArticleLikeModel from './article_like';
import ArticleCommentModel from './article_comment';
import ChannelModel from './channel';
import ChannelMemberModel from './channel_member';
import ChannelMessageModel from './channel_message';

type Config = {
  [key: string]: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: string;
    port: number;
  };
};

// 개발모드 환경설정
const env = process.env.APP_ENV || 'development';

// DB 연결 환경설정 정보 변경 처리
const config = (configJson as Config)[env];

// 데이터베이스 객체 정의
const db: { [key: string]: any } = {};

// DB 연결 정보로 시퀄라이즈 ORM 객체 생성
const sequelize = new Sequelize({
  database: config.database,
  username: config.username,
  password: config.password,
  host: config.host,
  dialect: config.dialect as Dialect,
  port: config.port, // 포트 설정
});

// 동적으로 속성을 만듬
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 모델 모듈 파일을 참조하고, db 객체에 동적 속성 정의
db.Admin = AdminModel(sequelize);
db.Member = MemberModel(sequelize);
db.Article = ArticleModel(sequelize);
db.ArticleFile = ArticleFileModel(sequelize);
db.ArticleLike = ArticleLikeModel(sequelize);
db.ArticleComment = ArticleCommentModel(sequelize);
db.channel = ChannelModel(sequelize);
db.channelMember = ChannelMemberModel(sequelize);
db.channelMessage = ChannelMessageModel(sequelize);

// 테이블 생성 (자동으로 테이블을 생성하거나 업데이트)
db.sequelize.sync({ alter: true }) // { force: true }로 강제로 새로 생성 가능
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch((error: Error) => {
    console.error('Error synchronizing models: ', error);
  });

// db 객체 외부로 노출
export default db;