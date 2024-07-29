// app.js에서 라우터 파일 참조 시, 본 라우터 파일의 기본 호출 주소: http://localhost:3000/admin 로 시작하게 기본 주소를 설정해준다.

var express = require('express');
var router = express.Router();


/*
* 관리자 계정 목록 조회 웹페이지 요청/응답 라우팅 메소드
* 요청 주소: http:localhost:5001/admin/list
* 요청 방식: GET
* 응답 결과: list view 페이지 반환
*/
router.get('/list', async(req, res) => {

    // 게시글 데이터 목록 3개 생성
    // 추후 DB에서 데이터를 가져온다.
    const admins = [
        {
            admin_id: 1,
            name: "관리자 이름1",
            contents: "관리자1의 내용입니다.",
            display: 1,
            view_cnt: 10,
            ip_address: "111.111.111.111",
            register_id: 1,
            register_date: Date.now()
        },
        {
            admin_id: 2,
            name: "관리자 이름2",
            contents: "관리자2의 내용입니다.",
            display: 1,
            view_cnt: 20,
            ip_address: "222.111.111.111",
            register_id: 2,
            register_date: Date.now()
        },
        {
            admin_id: 3,
            name: "관리자 이름3",
            contents: "관리자3의 내용입니다.",
            display: 1,
            view_cnt: 30,
            ip_address: "211.111.111.111",
            register_id: 3,
            register_date: Date.now()
        }
    ];

    res.render('admin/list', {admins:admins});
});


/*
* 신규 관리자 계정 등록 웹페이지 요청/응답 라우팅 메소드
* 요청 주소: http:localhost:5001/admin/create
* 요청 방식: GET
* 응답 결과: create view 페이지 반환
*/
// 관리자 계정 등록 화면 요청/응답 라우팅 메소드
router.get('/create', async(req, res) => {
    res.render('admin/create');
});


/*
* 신규 관리자 계정 등록 요청/응답 데이터 처리 라우팅 메소드
* 요청 주소: http:localhost:5001/admin/create
* 요청 방식: POST
* 응답 결과: 해당 관리자 계정 JSON 데이터 반환 후 list로 이동
*/
router.post('/create', async(req, res) => {

    // Step1: 사용자가 입력한 form 태그 내 입력/선택 데이터 추출
    // req.body.전달된 form 태그 내 HTML 입력/선택 요소의 name 속성명으로 지정
    const name = req.body.name; // create.ejs의 form 태그 내의 제목 input 박스의 name이 name이기 때문에 속성명도 name이다.
    const contents = req.body.contents;
    // const display = req.body.display;

    // Step2: DB 게시글 테이블에 저장할 JSON 데이터 생성
    // 객체 속성명과 속성의 데이터 값 변수/상수명이 같으면, 상수/변수명은 생략 가능
    const admin = {
        name,
        contents,
        display: req.body.display, // 변수를 사용하지 않고 바로 넣어도 가능
        ip_address: "111.111.111.111",
        view_cnt: 0, // 게시글을 생성한 직후에는 조회수가 0
        register_id: 1, // 로그인/회원가입이 구현되지 않았기 때문에 임의로 지정
        register_date: Date.now()
    }

    // Step3: DB 게시글 테이블에 상기 admin 데이터 등록 처리(Insert Into Table명...)
    // DB 서버에서 Insert SQL 구문을 통해서 DB 등록 처리가 되면 등록된 실제 데이터셋을 다시 반환한다.
    const registeredAdmin = {
        name,
        contents,
        display: req.body.display, // 변수를 사용하지 않고 바로 넣어도 가능
        ip_address: "111.111.111.111",
        view_cnt: 0, // 게시글을 생성한 직후에는 조회수가 0
        register_id: 1, // 로그인/회원가입이 구현되지 않았기 때문에 임의로 지정
        register_date: Date.now()
    }

    // Step4: 게시글 등록 완료 후 게시글 목록 페이지로 이동
    res.redirect('/admin/list');
});


/*
* 기존 관리자 계정 확인 웹페이지 요청/응답 라우팅 메소드
* 요청 주소: http:localhost:5001/admin/modify/1
* 요청 방식: GET
* 응답 결과: modify view 페이지 반환
*/
router.get('/modify', async(req, res) => {
    res.render('admin/modify');
});


/*
* 기존 관리자 계정 확인 요청/응답 데이터 처리 라우팅 메소드
* 요청 주소: http:localhost:5001/admin/modify
* 요청 방식: POST
* 응답 결과: 해당 관리자 계정의 수정된 JSON 데이터 반환 후 list로 이동
*/
router.post('/modify', async(req, res) => {

    // Step1: 사용자 수정 데이터를 추출하고, 수정할 데이터 소스를 생성
    // 수정할 대상이 되는 게시글 고유번호
    const adminIdx = req.body.admin_id; // hidden 태그의 name 속성 값
    
    const admin = {
        // admin_id는 Primary Key이기 때문에 수정해서는 안된다.
        name: req.body.name, // 변수를 사용하지 않고 바로 넣어도 가능
        contents: req.body.contents,
        display: req.body.display,
        modify_id: 1, // 로그인/회원가입이 구현되지 않았기 때문에 임의로 지정
        modify_date: Date.now()
    }
    
    // Step2: DB 게시글 테이블에 특정 게시글 번호를 기준으로 게시글 정보를 수정 처리
    // SQL문
    // Update admin Set name='수정한이름',contents='수정한내용',display='게시여부값',modify_id=1,modify_date='2024-07-25 18:08:12' WHERE admin_id=1;
    // 수정이 완료되면 DB 서버에서 수정 처리 건수가 반환된다.
    
    // Step3: 게시글 목록 페이지로 이동 처리
    res.redirect('/admin/list');
});


/*
* 기존 관리자 계정 삭제 요청/응답 데이터 처리 라우팅 메소드
* 요청 주소: http:localhost:5001/admin/delete
* 요청 방식: GET
* 응답 결과: 삭제된 관리자 계정의 id JSON 데이터 반환 후 list로 이동
*/
router.get('/delete', async(req, res) => {

    // Step1: req.query.키명으로 쿼리스트링 방식으로 전달된 데이터 추출
    const adminIdx = req.query.aid;

    // Step2: 데이터 삭제 처리

    // Step3: 사용자 브라우저 게시글 목록 이동 처리
    res.redirect('/admin/list');
})


router.get('/modify/:idx', async(req, res) => {

    // Step1: URL 주소에서 게시글 고유번호를 추출
    const adminIdx = req.params.idx;

    // Step2: DB 게시글 테이블에서 해당 게시글 고유번호에 해당하는 단일 게시글 정보를 조회
    // DB에서 조회해왔다고 가정
    const admin = {
            admin_id: 1,
            name: "관리자 이름1",
            contents: "관리자1의 내용입니다.",
            display: 1,
            view_cnt: 10,
            ip_address: "111.111.111.111",
            register_id: 1,
            register_date: Date.now()
        }

    // Step3: DB에서 가져온 단일 게시글 정보를 modify.ejs view 파일에 전달한다.=
    res.render('admin/modify', {admin:admin});
});


module.exports = router;