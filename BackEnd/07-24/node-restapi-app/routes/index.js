var express = require('express');
var router = express.Router();


// 공통 기능 미들웨어 참조하기
// middleware.js 모듈에서
const {checkParams, checkQuery} = require('./middleware.js');


// 해당 라우터 파일이 호출되면 무조건 실행되는 미들웨어 함수 정의하기
router.use(function (req, res, next) {
  console.log("Index.js 라우터 파일이 호출될 때마다 실행되는 기능 구현");
  next();
  // res.send("모든 응답 반환하기");
});


// 특정 주소 호출에 대한 미들웨어 기능 추가
// http:/localhost:3000/sample
router.use("/sample", function (req, res, next) { // req에는 사용자가 가진 정보와 웹브라우저가 가진 정보가 담겨 있다.
  console.log("Index.js 라우터 파일 미들웨어2 호출", req.originalUrl); // req.originalUrl: 현재 사용자가 서버에 호출한 URL 주소
  next(); // 다음 함수가 실행된다.

}, function (req, res, next) {
  console.log('Index.js 라우터 파일 미들웨어3 호출', req.method); // req.method: 사용자가 메소드를 어떤 방식으로 호출했는가
  res.send(req.method);
});


/**
 * 메인 웹페이지 요청과 응답 처리 라우팅 메소드
 * 호출 주소: http:/localhost:3000/
 * 호출 방식: GET
 * 응답 결과: views/index.ejs view 파일 웹페이지 내용을 전달
 */
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// http:/localhost:3000/test/1
// checkParams 미들웨어를 요청 이후 응답 전에 먼저 실행하게 하여 특정 로직을 태운다.
// Step1: router.get 메소드 실행 -> checkParams() 미들웨어 함수 실행 -> 
router.get('/test/:id', checkParams, async (req, res, next) => {
  res.render('index.ejs', { title: "테스트" });
});


// http:/localhost:3000/product?category=computer&stock=100
router.get('/product', checkQuery, async (req, res, next) => {
  res.render('index.ejs', { title: "테스트" });
});


module.exports = router;
