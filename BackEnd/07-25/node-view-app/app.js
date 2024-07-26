var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 레이아웃 노드 패키지 참조
var expressLayouts = require('express-ejs-layouts');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// 개발자 정의 게시글 웹페이지 요청과 응답 라우터 파일 참조
var articleRouter = require('./routes/article.js');


var app = express();


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

// articleRouter 라우터 파일의 기본 URL 주소 체계 정의
// localhost:3000/article
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
