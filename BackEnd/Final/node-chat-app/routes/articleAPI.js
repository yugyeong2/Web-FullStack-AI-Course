var express = require('express');
var router = express.Router();

// jsonwebtoken 참조
var jwt = require('jsonwebtoken');

// ORM DB 객체 참조
var db = require('../models/index');


/*
 * 전체 게시글 목록 조회 요청 및 응답처리 API 라우팅 메소드
 * 호출 주소: http://localhost:5000/api/article/list
 * 요청 방식: GET
 * 응답 결과: 전체 게시글 목록 데이터
 */
router.get('/list', async(req, res) => {
    let apiResult = {
        code: 400,
        data: null,
        message: ""
    };

    try {
        const articles = await db.Article.findAll();
        
        apiResult.code = 200;
        apiResult.data = articles;
        apiResult.message = "200 OK"

    } catch (error) {
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "Server Error"
    }
    
    res.json(apiResult);
});


/*
 * 신규 게시글 등록 요청 및 응답처리 API 라우팅 메소드
 * 호출 주소: http://localhost:5000/api/article/create
 * 요청 방식: GET
 * 응답 결과: 등록된 단일 게시글 데이터
 */
router.post('/create', async(req, res) => {
    let apiResult = {
        code: 400,
        data: null,
        message: "400: 요청 리소스가 없습니다."
    };

    try {
        // Step0: 프론트엔드에서 전달된 JWT 토큰 값에서 로그인 사용자 정보 추출
        // var token = req.headers.authorization.split('Bearer ')[1];
        // console.log('게시글 등록 API 토큰 값:', token);

        // // 사용자 토큰 정보 유효성 검사 후, 정상적이면 토큰 내에서 사용자 인증 JSON 정보 추출
        // var loginMember = await jwt.verify(token, process.env.JWT_AUTH_KEY);

        // Step1: 프론트엔드에서 전달한 데이터 추출
        const title = req.body.title;
        const contents = req.body.contents;
        const display = req.body.display;
        const uploadFile = req.body.file;
    
        // Step2: DB article 테이블에 저장할 JSON 데이터 생성
        // Article 모델의 속성명과 데이터 속성명을 동일하게 작성해야 한다.
        const article = {
            board_type_code: 2, // 게시판 고유번호 - 2: 일반 사용자 게시판
            title: title,
            article_type_code: 0, // 게시글 유형코드 0: 일반 게시글 1: 상단 고정 게시글
            contents: contents,
            view_count: 0, // 게시글 생성 시 조회수는 0
            ip_address: req.headers["x-forwarded-for"] || req.connection.remoteAddress, // 사용자 IP 추출 -> 로컬 개발 환경인 경우 ::1로 나올 수 있다.
            is_display_code: display,
            reg_date: Date.now(),
            reg_member_id: 1 // 추후 토큰에서 사용자 정보 추출 후 변경 예정
        };
        
        // Step3: DB article 테이블에 신규 게시글 정보 등록 처리
        const registedArticle = await db.Article.create(article);

        // Step4: 처리 결과 값 프론트엔드에 반환
        apiResult.code = 200;
        apiResult.data = registedArticle;
        apiResult.message = "200 OK";

    } catch (error) {
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "ServerERR: 자세한 내용은 백엔드에 문의해주세요."
    }

    res.json(apiResult);
});


router.get('/delete', async(req, res) => {
    let apiResult = {
        code: 400,
        data: null,
        message: "400: 요청 리소스가 없습니다."
    }
});


/*
 * 기존 게시글 수정 요청 및 응답처리 API 라우팅 메소드
 * 호출 주소: http://localhost:5000/api/article/modify/1
 * 요청 방식: GET
 * 응답 결과: 단일 게시글 수정 결과 데이터
 */
router.get('/modify/:id', async(req, res) => {
    const articleIdx = req.parmas.id;

    let apiResult = {
        code: 400,
        data: null,
        message: "400: 요청 리소스가 없습니다."
    };

    try {
        const articles = await db.Article.findOne({where: {article_id: articleIdx}});
        
        apiResult.code = 200;
        apiResult.data = articles;
        apiResult.message = "200 OK"

    } catch (error) {
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "ServerERR: 자세한 내용은 백엔드에 문의해주세요."
    }
    
    res.json(apiResult);
});


/*
 * 단일 게시글 목록 조회 요청 및 응답처리 API 라우팅 메소드
 * 호출 주소: http://localhost:5000/api/article/:id
 * 요청 방식: GET
 * 응답 결과: 단일 게시글 데이터
 */
router.get('/:id', async(req, res) => {
    let apiResult = {
        code: 400,
        data: null,
        message: "400: 요청 리소스가 없습니다."
    };

    try {
        const articleIdx = req.params.id;
        const article = await db.Article.findOne({
            where: { article_id: articleIdx },
        });
    
        apiResult.code = 200;
        apiResult.data = article;
        apiResult.message = "200 OK"
    
    } catch (err) {
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "ServerERR: 자세한 내용은 백엔드에 문의해주세요."
    }

    res.json(apiResult);
});

module.exports = router;