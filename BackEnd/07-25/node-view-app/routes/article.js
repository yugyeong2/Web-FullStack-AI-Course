// article.js 라우터 파일은 게시글 관련 웹페이지들에 대한 요청과 응답을 처리한다.
// app.js에서 라우터 파일 참조 시, 본 라우터 파일의 기본 호출 주소: http://localhost:3000/article 로 시작하게 기본 주소를 설정해준다.

var express = require('express');
var router = express.Router();

/**
 * 게시글 목록 웹페이지 요청과 응답 처리 라우팅 메소드 구현
 * 호출 주소: http://localhost:3000/article/list
 * 호출 방식: GET
 * 응답 결과: 게시글 목록 데이터를 기반으로한 게시글 목록 웹페이지 전달
 */
router.get('/list', async(req, res) => { // 콜백함수를 비동기로
    // 게시글 데이터 목록 3개 생성
    // 추후 DB에서 데이터를 가져온다.
    const articles = [
        {
            article_id: 1,
            title: "게시글1의 제목",
            contents: "게시글1 내용입니다.",
            display: 1,
            view_cnt: 10,
            ip_address: "111.111.111.111",
            register_id: 1,
            register_date: Date.now()
        },
        {
            article_id: 2,
            title: "게시글2의 제목",
            contents: "게시글2 내용입니다.",
            display: 1,
            view_cnt: 20,
            ip_address: "222.111.111.111",
            register_id: 2,
            register_date: Date.now()
        },
        {
            article_id: 3,
            title: "게시글3의 제목",
            contents: "게시글3 내용입니다.",
            display: 1,
            view_cnt: 30,
            ip_address: "211.111.111.111",
            register_id: 3,
            register_date: Date.now()
        }
    ];

    // 물리적 경로: /views/article/list.ejs
    res.render('article/list', {articles:articles});
});


/**
 * 신규 게시글 등록 웹페이지 요청과 응답 처리 라우팅 메소드 구현
 * 호출 주소: http://localhost:3000/article/create
 * 호출 방식: GET
 * 응답 결과: 게시글 등록 웹페이지 뷰파일 전달
 */
router.get('/create', async(req, res) => {
    res.render('article/create');
});


/**
 * 신규 게시글 등록 웹페이지에서 보내준 사용자가 입력/선택한 신규 게시글 데이터를 등록 처리 요청과 응답 처리 라우팅 메소드 구현(데이터 처리)
 * 호출 주소: http://localhost:3000/article/create
 * 호출 방식: POST
 * 응답 결과: 신규 게시글 DB 등록 처리 후 특정 페이지로 이동 or 특정 view 파일 제공

 * 라우팅 주소와 요청 방식 2가지가 동일해야 해당 라우팅 메소드가 호출되고 실행된다.
 */
router.post('/create', async(req, res) => {

    // Step1: 사용자가 입력한 form 태그 내 입력/선택 데이터 추출
    // req.body.전달된 form 태그 내 HTML 입력/선택 요소의 name 속성명으로 지정
    const title = req.body.title; // create.ejs의 form 태그 내의 제목 input 박스의 name이 title이기 때문에 속성명도 title이다.
    const contents = req.body.contents;
    // const display = req.body.display;

    // Step2: DB 게시글 테이블에 저장할 JSON 데이터 생성
    // 객체 속성명과 속성의 데이터 값 변수/상수명이 같으면, 상수/변수명은 생략 가능
    const article = {
        title,
        contents,
        display: req.body.display, // 변수를 사용하지 않고 바로 넣어도 가능
        ip_address: "111.111.111.111",
        view_cnt: 0, // 게시글을 생성한 직후에는 조회수가 0
        register_id: 1, // 로그인/회원가입이 구현되지 않았기 때문에 임의로 지정
        register_date: Date.now()
    }

    // Step3: DB 게시글 테이블에 상기 article 데이터 등록 처리(Insert Into Table명...)
    // DB 서버에서 Insert SQL 구문을 통해서 DB 등록 처리가 되면 등록된 실제 데이터셋을 다시 반환한다.
    const registeredArticle = {
        title,
        contents,
        display: req.body.display, // 변수를 사용하지 않고 바로 넣어도 가능
        ip_address: "111.111.111.111",
        view_cnt: 0, // 게시글을 생성한 직후에는 조회수가 0
        register_id: 1, // 로그인/회원가입이 구현되지 않았기 때문에 임의로 지정
        register_date: Date.now()
    }

    // Step4: 게시글 등록 완료 후 게시글 목록 페이지로 이동
    res.redirect('/article/list');
});


/**
 * 기존 게시글을 수정한 사용자 폼에 대한 게시글 데이터 수정 처리 요청과 응답 처리 라우팅 메소드
 * 호출 주소: http://localhost:3000/article/modify
 * 호출 방식: POST
 * 응답 결과: 기존 게시글 정보를 수정 처리하고 목록 페이지로 이동시킨다.
 */
router.post('/modify', async(req, res) => {

    // Step1: 사용자 수정 데이터를 추출하고, 수정할 데이터 소스를 생성
    // 수정할 대상이 되는 게시글 고유번호
    const articleIdx = req.body.article_id; // hidden 태그의 name 속성 값
    
    const article = {
        // article_id는 Primary Key이기 때문에 수정해서는 안된다.
        title: req.body.title, // 변수를 사용하지 않고 바로 넣어도 가능
        contents: req.body.contents,
        display: req.body.display,
        modify_id: 1, // 로그인/회원가입이 구현되지 않았기 때문에 임의로 지정
        modify_date: Date.now()
    }
    
    // Step2: DB 게시글 테이블에 특정 게시글 번호를 기준으로 게시글 정보를 수정 처리
    // SQL문
    // Update article Set title='수정한 제목', contents='수정한 내용', display='게시 여부 값', modify_id='1', modify_date='2024-07-25', WHERE article_id=1
    // 수정이 완료되면 DB 서버에서 수정 처리 건수가 반환된다.
    
    // Step3: 게시글 목록 페이지로 이동 처리
    res.redirect('/article/list');
});


/**
 * 기존 게시글 데이터 삭제 처리 요청과 응답 처리 라우팅 메소드
 * 호출 주소: http://localhost:3000/article/delete?aid=1
 * 호출 방식: GET
 * 응답 결과: 해당 게시글 정보를 삭제 처리하고 목록 페이지로 이동시킨다.

 * POST 방식으로 form 태그를 이용해 삭제할 수도 있다.
    관리자 게시판이므로 간단하게 구현
 */
router.get('/delete', async(req, res) => {

    // Step1: req.query.키명으로 쿼리스트링 방식으로 전달된 데이터 추출
    const articleIdx = req.query.aid;

    // Step2: 데이터 삭제 처리

    // Step3: 사용자 브라우저 게시글 목록 이동 처리
    res.redirect('/article/list');
});


/**
 * 기존 등록된 게시글 데이터를 조회해서 게시글 수정 웹페이지에 데이터를 포함한 웹페이지 요청과 응답 처리 라우팅 메소드
 * 호출 주소: http://localhost:3000/article/modify/1
 * 호출 방식: GET
 * 응답 결과: DB에서 해당 단일 게시글 정보를 조회해와서 지정 view 파일에 데이터를 전달하고,
            view 파일 내에서 해당 데이터를 html 태그에 출력해서 최종 웹브라우저에 동적으로 변경된 웹페이지를 반환한다.
 */
router.get('/modify/:idx', async(req, res) => {

    // Step1: URL 주소에서 게시글 고유번호를 추출
    const articleIdx = req.params.idx;

    // Step2: DB 게시글 테이블에서 해당 게시글 고유번호에 해당하는 단일 게시글 정보를 조회
    // DB에서 조회해왔다고 가정
    const article = {
            article_id: 1,
            title: "게시글1의 제목",
            contents: "게시글1 내용입니다.",
            display: 1,
            view_cnt: 10,
            ip_address: "111.111.111.111",
            register_id: 1,
            register_date: Date.now()
        }

    // Step3: DB에서 가져온 단일 게시글 정보를 modify.ejs view 파일에 전달한다.=
    res.render('article/modify', {article:article});
});


module.exports = router;