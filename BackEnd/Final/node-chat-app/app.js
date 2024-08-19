var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 환경 설정 정보 구성
require('dotenv').config();

// 웹소켓 모듈 추가
const webSocket = require("./socket");

// ORM DB 연결 객체인 sequelize 참조
var sequelize = require('./models/index.js').sequelize;

// RESTful API 서비스 CORS 이슈 해결을 위한 CORS 패키지 참조하기
const cors = require("cors"); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 회원 정보 관리 RESTful API 라우터 파일 참조
var memberRouter = require('./routes/memberAPI');
var articleRouter = require('./routes/articleAPI');

var app = express();

// mysql과 자동 연결처리 및 모델기반 물리 테이블 생성처리 제공
sequelize.sync(); // Code first, Model first

// 모든 웹사이트/모바일 프론트에서 REST API를 접근할 수 있게 허락한다.
// app.use(cors());

// 특정 도메인 주소만 허가
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    origin: ["http://localhost:5000", "http://127.0.0.1:5500", "http://localhost:3000", "http://localhost:3003"], // ! CORS 설정 주의
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// memberAPIRouter의 기본 호출주소 체계 정의
app.use('/api/member', memberRouter);
app.use('/api/article', articleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;


// 노드앱의 기본 WAS 서비스 포트
app.set("port", process.env.PORT || 5000);

// 노드앱이 작동되는 서버 객체 생성
var server = app.listen(app.get("port"), function () {});

// 웹소켓 express서버와 연결처리
// webSocket모듈에 nodeapp이 실행되는 서버객체를 전달합니다.
// socket.io 소켓모듈과 node express앱을 통합해줍니다.
webSocket(server);