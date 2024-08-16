var express = require('express');
var router = express.Router();

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
 * 단일 게시글 목록 조회 요청 및 응답처리 API 라우팅 메소드
 * 호출 주소: http://localhost:5000/api/article/:id
 * 요청 방식: GET
 * 응답 결과: 단일 게시글 데이터
 */
router.get('/:id', async(req, res) => {
    let apiResult = {
        code: 400,
        data: null,
        message: ""
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
        apiResult.message = "Server Error"
    }

    res.json(apiResult);
});

module.exports = router;