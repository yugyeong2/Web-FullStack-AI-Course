var express = require('express');
var router = express.Router();


/*
관리자 계정 목록 웹페이지 요청과 응답 처리 라우팅 메소드
요청 주소: http:localhost:5001/admin/list
요청 방식: GET
응답 결과:  view 페이지 반환
*/
// 관리자 계정 목록 화면 요청/응답 라우팅 메소드
router.get('/admin/list', function(req, res) {
});


// 관리자 계정 등록 화면 요청/응답 라우팅 메소드
router.get('/admin/create', function(req, res) {
    res.render('admin/create.ejs');
});


// 관리자 계정 정보 등록 처리 요청/응답 라우팅 메소드
router.post('admin/create', function(req, res) {
    

    res.redirect('/admin/list');
});


module.exports = router;