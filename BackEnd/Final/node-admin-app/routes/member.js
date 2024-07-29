// app.js에서 라우터 파일 참조 시, 본 라우터 파일의 기본 호출 주소: http://localhost:3000/member 로 시작하게 기본 주소를 설정해준다.

var express = require('express');
var router = express.Router();


/*
사용자 계정 목록 조회 웹페이지 요청/응답 라우팅 메소드
요청 주소: http:localhost:5001/member/list
요청 방식: GET
응답 결과: list view 페이지 반환
*/
router.get('/list', async(req, res) => {
    res.render('member/list');
});


/*
신규 사용자 계정 등록 요청/응답 데이터 처리 라우팅 메소드
요청 주소: http:localhost:5001/member/create
요청 방식: POST
응답 결과: 해당 사용자 계정 JSON 데이터 반환 후 list로 이동
*/
router.post('/create', async(req, res) => {
    

    res.redirect('/member/list');
});


/*
기존 사용자 계정 확인 웹페이지 요청/응답 라우팅 메소드
요청 주소: http:localhost:5001/member/modify/1
요청 방식: GET
응답 결과: modify view 페이지 반환
*/
router.get('/modify', async(req, res) => {
    res.render('member/modify');
});


/*
기존 사용자 계정 확인 요청/응답 데이터 처리 라우팅 메소드
요청 주소: http:localhost:5001/member/modify
요청 방식: POST
응답 결과: 해당 사용자 계정의 수정된 JSON 데이터 반환 후 list로 이동
*/
router.post('/modify', async(req, res) => {

    res.redirect('/member/list');
});


/*
기존 사용자 계정 삭제 요청/응답 데이터 처리 라우팅 메소드
요청 주소: http:localhost:5001/member/delete
요청 방식: POST
응답 결과: 삭제된 사용자 계정의 id JSON 데이터 반환 후 list로 이동
*/
router.post('/delete', async(req, res) => {

    res.redirect('/member/list');
})


module.exports = router;