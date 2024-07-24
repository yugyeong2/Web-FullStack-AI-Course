// articleAPI.js 라우터의 기본 주소는 app.js에서 http://localhost:3000/api/articles로 설정해준다.
var express = require('express');
var router = express.Router();

/**
- 전체 게시글 목록 데이터 요청과 응답 처리 라우팅 메소드
- 호출 주소: http://localhost:3000/api/articles/list
- 호출 방식: GET
- 응답 결과: 게시글 JSON 데이터 목록
*/

// router.get('호출 주소', 콜백함수());
// 콜백함수를 async(비동기 기반에서 순차적 프로그래밍)로 변경한다 !
// async(req, res) =>{}
// => 비동기 콜백함수로 선언하면 비동기 기반에서도 순차적 프로그래밍이 가능하다.
router.get('/list', async(req, res) => {
    
    // DB 게시글 테이블에서 전체 게시글 목록을 가져왔다고 가정
    // 가져온 데이터는 아래와 같다.
    const articles = [
        {
            article_id: 1,
            title: "게시글1의 제목",
            contents: "게시글1 내용입니다.",
            display: 1,
            view_cnt: 10,
            ip_address:"111.111.111.111",
            register_id: 1,
            register_date: Date.now()
        },
        {
            article_id: 2,
            title: "게시글2의 제목",
            contents: "게시글2 내용입니다.",
            display: 1,
            view_cnt: 20,
            ip_address:"222.111.111.111",
            register_id: 2,
            register_date: Date.now()
        },
        {
            article_id: 3,
            title: "게시글3의 제목",
            contents: "게시글3 내용입니다.",
            display: 1,
            view_cnt: 30,
            ip_address:"211.111.111.111",
            register_id: 3,
            register_date: Date.now()
        }
    ];

    // 서버 응답 결과물로 순수 JSON 데이터를 반환한다.
    // res.json(JSON 데이터);
    res.json(articles);
});

module.exports = router;