// articleAPI.js 라우터의 기본 주소는 app.js에서 http://localhost:3000/api/articles로 설정해준다.
var express = require('express');
var router = express.Router();


/**
- 전체 게시글 목록 데이터 요청과 응답 처리 라우팅 메소드
- 호출 주소: http://localhost:3000/api/articles/list
- 호출 방식: GET
- 응답 결과: 게시글 JSON 데이터 목록

router.get('호출 주소', 콜백함수());
콜백함수를 async(비동기 기반에서 순차적 프로그래밍)로 변경한다 !
async(req, res) =>{}
=> 비동기 콜백함수로 선언하면 비동기 기반에서도 순차적 프로그래밍이 가능하다.
*/
router.get('/list', async (req, res) => {

    // API 호출 결과 표준 데이터 포멧 정의
    let apiResult = {
        code: 200,
        data: null,
        result: ""
    }

    try {
        // DB 게시글 테이블에서 전체 게시글 목록을 가져왔다고 가정
        // 가져온 데이터는 아래와 같다.
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

        apiResult.code = 200;
        apiResult.data = articles;
        apiResult.result = "OK";
    }
    catch (err){
        // try{} 블럭 스코프 내에서 백엔드 에러가 발생하면, catch(err){} 블럭으로 에러 내용이 전달된다.
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "Server ERROR 관리자에게 문의하세요.";
    }

    // 서버 응답 결과물로 순수 JSON 데이터를 반환한다.
    // res.json(JSON 데이터);
    res.json(apiResult);    
});


/**
- 단일 신규 게시글 정보 등록 요청과 응답 처리 라우팅 메소드
- 호출 주소: http://localhost:3000/api/articles/create
- 호출 방식: POST
- 응답 결과: 등록 처리 완료된 단일 게시글 정보 반환(-> 게시글 번호)
*/
router.post('/create', async (req, res) => {

    // API 호출 결과 표준 데이터 포멧 정의
    let apiResult = {
        code: 200,
        data: null,
        result: ""
    }

    // 백엔드 예외 처리하기(try-catch문)
    try {
        // Step1: 클라이언트에서 보내준 사용자 입력 JSON 데이터를 추출한다.
        // req.body.클라이언트에서 보내준 단일 게시글 JSON 객체의 속성명! (사용자가 입력한 정보)
        const title = req.body.title;       // 게시글 제목
        const contents = req.body.contents; // 게시글 내용
        const display = req.body.display;   // 게시 여부

        // Step2: 사용자 JSON 데이터를 DB 게시글 테이블에 저장한다.
        // DB 게시글 테이블에 저장할 JSON 단일 데이터
        const article = {
            title,
            contents,
            display,
            view_cnt: 0, // 사용자가 보내지 않은 정보
            ip_address: "111.111.111.111",
            register_id: 1,
            register_date: Date.now()
        }

        // Step3: DB에 저장, 반환된 등록된 게시글 신규 게시글 정보가 반환된다.
        // DB 게시글 테이블에 상기 데이터를 저장한다.
        // DB에 저장하면, 저장된 게시글 정보가 다시 반환됨(게시글 번호 포함)
        // => 현재는 DB가 구현되어 있지 않기 때문에 임의로 생성
        const dbArticle = {
            article_id: 1,
            title,
            contents,
            display,
            view_cnt: 0, // 사용자가 보내지 않은 정보
            ip_address: "111.111.111.111",
            register_id: 1,
            register_date: Date.now()
        }

        apiResult.code = 200;
        apiResult.data = dbArticle;
        apiResult.result = "OK";
    }
    catch (err) {
        // try{} 블럭 스코프 내에서 백엔드 에러가 발생하면, catch(err){} 블럭으로 에러 내용이 전달된다.
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.result = "Server ERROR 관리자에게 문의하세요.";
    }

    // Step4: DB에 저장, 반환된 단일 게시글 정보를 클라이언트에 반환한다.
    // HttpResponse 객체의 json('JSON 데이터') 메소드는 서버에서 웹브라우저로 JSON 데이터를 반환한다.
    // 서버 응답 결과물로 순수 JSON 데이터를 반환한다.
    // res.json(JSON 데이터);
    res.json(apiResult);
});

module.exports = router;