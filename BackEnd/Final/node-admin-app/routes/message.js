// app.js에서 라우터 파일 참조 시, 본 라우터 파일의 기본 호출 주소: http://localhost:3000/message 로 시작하게 기본 주소를 설정해준다.

var express = require('express');
var router = express.Router();


/*
채팅 메시지 목록 조회 웹페이지 요청/응답 라우팅 메소드
요청 주소: http:localhost:5001/message/list
요청 방식: GET
응답 결과: list view 페이지 반환
*/
router.get('/list', async(req, res) => {
    res.render('message/list');
});


module.exports = router;