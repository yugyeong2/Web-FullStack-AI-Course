var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
// ORM DB 연결 객체인 sequelize 참조
var sequelize = require('./models/index.js').sequelize;

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('layout', 'main'); // 레이아웃의 공통 부분이 들어가는 메인 페이지의 이름은 main.ejs
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout extractMetas', true);

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

module.exports = app;
