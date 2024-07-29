var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 레이아웃 노드 패키지 참조
var expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// 개발자 정의 라우터 파일 참조 - 게시글 정보 관리
var articleRouter = require('./routes/article');
// ORM Model 영역의 sequelize 속성(DB 연결 객체)을 참조한다.
var sequelize = require('./models/index.js').sequelize;

var app = express();

// mysql과 자동 연결처리 및 모델기반 물리 테이블 생성처리 제공
sequelize.sync(); // DB 서버와 연결하고, Model 파일로 테이블을 만든다.

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 모든 view 파일에 적용되는 레이아웃 view 파일 설정
app.set('layout', 'layout.ejs'); // 전체 레이아웃 파일 지정
app.set("layout extractScripts", true); // script 태그룰 지정하겠다.
app.set("layout extractStyles", true); // style 태그를 지정하겠다.
app.set("layout extractMetas", true); // meta 태그를 지정하겠다.

// 노드 앱에 레이아웃 기능 추가 적용
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// articleRouter 라우터의 기본 주소 체계 정의
// http://localhost:3000/article
app.use('/article', articleRouter);

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

module.exports = app;
