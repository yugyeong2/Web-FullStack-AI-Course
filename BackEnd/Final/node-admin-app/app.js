var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
// ORM DB 연결 객체인 sequelize 참조
var sequelize = require('./models/index.js').sequelize;
var session = require('express-session');

// 환경설정 파일 구성
require('dotenv').config();

var indexRouter = require('./routes/index.js');
var adminRouter = require('./routes/admin');
var articleRouter = require('./routes/article');
var channelRouter = require('./routes/channel');
var memberRouter = require('./routes/member');
var messageRouter = require('./routes/message');

var app = express();

// mysql과 자동 연결처리 및 모델기반 물리 테이블 생성처리 제공
sequelize.sync(); // Code first, Model first

// 백엔드 앱에서 세션을 사용할 수 있게 설정
app.use(
  session({
    resave: false, // 매번 세션을 강제 저장하는 옵션 -> 로그인 시마다 세션값의 변경이 없어도 강제로 저장할 지 여부
    saveUninitialized: true, // 빈 세션도 저장할 지 여부
    secret: "testsecret", // 세션 아이디를 만들 때 사용한 암호화 키값
    cookie: {
      httpOnly: true, // http 지원 여부
      secure: false, // http 환경에서만 세션 정보를 주고받도록 처리할지 여부
      maxAge:1000 * 60 * 5 //5분동안 서버세션을 유지하겠다.(1000은 1초)
      },
  }),
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('layout', 'main'); // 레이아웃의 공통 부분이 들어가는 메인 페이지의 이름은 main.ejs
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout extractMetas', true);

// 모든 페이지에서 요청 시 현재 경로를 가져올 수 있다.
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/article', articleRouter);
app.use('/channel', channelRouter);
app.use('/member', memberRouter);
app.use('/message', messageRouter);

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


// // 노드앱의 기본 WAS 서비스 포트
// app.set("port", process.env.PORT || 5001);

// // 노드앱이 작동되는 서버 객체 생성
// var server = app.listen(app.get("port"), function () {});


module.exports = app;
