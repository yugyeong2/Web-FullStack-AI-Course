var express = require('express');
var router = express.Router();

/*
메인 웹페이지 요청과 응답처리 라우팅 메소드
호출 주소: http://localhost:3000/
*/
router.get('/', function(req, res, next) {
  // 서버에서 사용자 웹브라우저로 응답결과물을 반환합니다.
  // 지정된 view파일 내 웹페이지가 반환됩니다.
  // res.render('view파일 경로', view파일에 전달하는 JSON 데이터);
  res.render('index.ejs', { title: '홈페이지2' });
});

module.exports = router;
