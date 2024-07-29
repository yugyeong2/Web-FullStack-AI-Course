// article.js 라우터 파일의 기본 주소는 app.js에서 참조 시 http://localhost:3000/article 로 기본 주수가 설정되게 처리한다.
var express = require('express');
var router = express.Router();

/*
 * 게시글 전체 목록 조회 웹페이지 요청과 응답처리 라우팅 메소드
 * 호출 주소: http://localhost:3000/article/list
 * 호출 방식: GET
 * 응답 결과: 전체 게시글 목록이 포함된 웹페이지 반환
*/
router.get('/', async(req, res) => {
    res.redirect('/article/list');
});
router.get('/list', async(req, res) => {
    res.render('article/list');
});

/*
 * 신규 게시글 등록 웹페이지 요청과 응답처리 라우팅 메소드
 * 호출 주소: http://localhost:3000/article/create
 * 호출 방식: GET
*/
router.get('/create', async(req, res) => {
    res.render('article/create');
});

/*
 * 신규 게시글 입력 정보 등록처리 요청과 응답처리 라우팅 메소드
 * 호출 주소: http://localhost:3000/article/create
 * 호출 방식: POST
*/
router.post('/create', async(req, res) => {
    // 신규 게시글 DB 등록 처리

    // 목록 페이지로 이동
    res.redirect('/article/list');
});

/*
 * 기존 단일 게시글 정보 조회 확인 웹페이지 요청과 응답 처리 라우팅 메소드
 * 호출 주소: http://localhost:3000/article/modify
 * 호출 방식: POST
*/
router.post('/modify', async(req, res) => {
    // 기존 게시글 DB 수정 처리
    
    // 목록 페이지로 이동
    res.redirect('/article/list');
})

/*
 * 기존 단일 게시글 수정처리 요청과 응답 처리 라우팅 메소드
 * 호출 주소: http://localhost:3000/article/delete
 * 호출 방식: GET
*/
router.get('/delete', async(req, res) => {
    // 기존 게시글 DB 삭제 처리
    
    // 목록 페이지로 이동
    res.redirect('/article/list');

});

// 와일드 카드를 사용하는 메소드는 가장 아래에 위치
/*
 * 기존 단일 게시글 정보 조회 확인 웹페이지 요청과 응답 처리 라우팅 메소드
 * 호출 주소: http://localhost:3000/article/modify/1
 * 호출 방식: GET
*/
router.get('/modify/:id', async(req, res) => {
    // DB에서 해당 게시글 번호와 일치하는 단일 게시글 정보 조회

    res.render('article/modify')
});

module.exports = router;