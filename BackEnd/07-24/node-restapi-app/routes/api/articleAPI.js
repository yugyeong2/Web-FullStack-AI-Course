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



// 두 개의 기능은 같지만 어떤 방식을 사용하느냐에 따라 백엔드 구현이 조금 다르다 !

/**
- 기존 단일 게시글 정보 조회 요청과 응답 처리 라우팅 메소드 - 쿼리스트링 방식 !
- 호출 주소: http://localhost:3000/api/articles/?aid=1
- 호출 방식: GET
- 응답 결과: 단일 게시글 정보 JSON 반환
*/
router.get('/', async(req, res) => {

    // API 호출 결과 표준 데이터 포멧 정의
    let apiResult = {
        code: 200, // 처리결과 상태코드
        data: null, // 반환할 데이터
        result: "" // 서버에서 프론트로 보낼 메시지
    }

    try{
        // Step1: API URL 주소에서 게시글 번호를 추출한다. (쿼리스트링 방식)
        // 쿼리스트링 방식으로 전달되는 키 값은 req.query.키명으로 추출 가능하다.
        const articleIdx = req.query.aid;
        
        // Step2: 해당 게시글 번호를 기준으로 DB 게시글 테이블에서 단일 게시글 정보를 조회한다.
        // DB에서 조회해온 정보라고 가정한다.
        const article = {
            article_id: 1,
            title: "게시글1의 제목(쿼리스트링 방식)",
            contents: "게시글1 내용입니다.",
            display: 1,
            view_cnt: 10,
            ip_address: "111.111.111.111",
            register_id: 1,
            register_date: Date.now()
        };

        apiResult.code = 200;
        apiResult.data = article;
        apiResult.result = "OK";
    }
    catch(err) {

        console.log("서버 에러:", err.message);
        // 백엔드에서 에러가 난 사실을 서버에 물리적 로그폴더를 만들고,
        // 로그.txt(.log) 파일에 기록하면 더 적극적으로 서버 에러에 대한 대응이 가능하다.

        apiResult.code = 500; // 서버 오류
        apiResult.data = null;
        apiResult.result = "Server ERROR 관리자에게 문의하세요."
    }

    // Step3: 단일 게시글 정보를 웹브라우저/클라이언트 응답 결과물로 반환한다.
    res.json(apiResult);
});


/**
- 기존 단일 게시글 수정 처리 요청과 응답 라우팅 메소드
- 호출 주소: http://localhost:3000/api/articles/modify
- 호출 방식: POST
- 응답 결과: 수정 결과 JSON 반환
*/
router.post('/modify', async(req, res) => {
    
    // API 호출 결과 표준 데이터 포멧 정의
    let apiResult = {
        code: 200,
        data: null,
        result: ""
    }

    // 백엔드 예외 처리하기(try-catch문)
    try {
        // Step1: 클라이언트에서 보내준 사용자 수정 JSON 데이터를 추출한다.
        // req.body.클라이언트에서 보내준 단일 게시글 JSON 객체의 속성명! (사용자가 수정한 정보)
        // 수정할 때는 게시글 고유 번호가 필요하다.
        const article_id = req.body.article_id; // 수정하려는 게시글 고유번호
        const title = req.body.title;       // 게시글 제목
        const contents = req.body.contents; // 게시글 내용
        const display = req.body.display;   // 게시 여부

        // Step2: 사용자가 보내준 속성만 해당 테이블의 컬럼 값으로 수정한다.
        // DB 게시글 테이블에 수정할 JSON 단일 데이터 속성 정의
        const article = {
            // 게시글 고유번호(article_id)를 수정할 필요는 없다.
            title,
            contents,
            display,
            // 수정해서는 안되는 정보는 제외(view_cnt, register_id, register_date)
            ip_address: "111.111.111.111", // 수정 시점에서의 IP는 바뀌었을 수 있다.
            // 수정 정보 추가
            modify_id: 1,
            modify_date: Date.now()
        }

        // 수정/삭제는 DB에서 수정/삭제된 정보가 반환하는 것이 아니라, 수정/삭제된 건수가 반환한다 !
        // Step3: 수정된 건수를 data 값으로 지정해주고 프론트에 수정된 건수를 전달한다.
        // DB 게시글 테이블에 상기 데이터를 수정한다.
        // 수정하면 DB에서 수정된 건수를 반환해준다.
        // => 현재는 DB가 구현되어 있지 않기 때문에 임의로 생성

        apiResult.code = 200;
        apiResult.data = 1; // 실제 DB 서버에서 제공된 수정 적용 건수
        apiResult.result = "OK";
    }
    catch (err) {
        // try{} 블럭 스코프 내에서 백엔드 에러가 발생하면, catch(err){} 블럭으로 에러 내용이 전달된다.
        apiResult.code = 500;
        apiResult.data = 0; // 처음 수정 건수는 0
        apiResult.result = "Server ERROR 관리자에게 문의하세요.";
    }

    // Step4: DB에 저장, 반환된 단일 게시글 정보를 클라이언트에 반환한다.
    // HttpResponse 객체의 json('JSON 데이터') 메소드는 서버에서 웹브라우저로 JSON 데이터를 반환한다.
    // 서버 응답 결과물로 순수 JSON 데이터를 반환한다.
    // res.json(JSON 데이터);
    res.json(apiResult);
});



// GET 방식은 URL에 삭제하는 경로가 있기 때문에 보안 상 좋지 않다.
// 게시글 삭제 기능을 GET 방식과 POST 방식으로 구현해본다.

/**
- 기존 단일 게시글 삭제 처리 요청과 응답 라우팅 메소드 - GET/URL 방식(쿼리스트링)
- 호출 주소: http://localhost:3000/api/articles/delete?aid=1
- 호출 방식: GET
- 응답 결과: 삭제 결과 JSON 반환
*/
// 원래 삭제는 POST 방식이 더 좋다 !
router.get('/delete', async(req, res) => {

    // API 호출 결과 표준 데이터 포멧 정의
    let apiResult = {
        code: 200,
        data: null,
        result: ""
    }

    try {
        // Step1: URL에서 삭제하려는 게시글 번호를 조회한다.
        const articleIdx = req.query.aid;

        // Step2: DB 테이블에서 해당 게시글을 삭제 처리한다.

        // Step3: DB 서버에서 특정 데이터가 삭제되면 삭제 건수가 백엔드로 반환된다.
        const deletedCount = 1;

        apiResult.code = 200;
        apiResult.data = deletedCount;
        apiResult.result = "OK";

    } catch(err) {
        apiResult.code = 500;
        apiResult.data = 0;
        apiResult.result = "Server Error 관리자에게 문의하세요."; 
    }

    res.json(apiResult);
});


/**
- 기존 단일 게시글 삭제 처리 요청과 응답 라우팅 메소드 - POST 방식
- 호출 주소: http://localhost:3000/api/articles/delete
- 호출 방식: POST
- 응답 결과: 삭제 결과 JSON 반환
*/
// 원래 삭제는 POST 방식이 더 좋다 !
router.post('/delete', async(req, res) => {

    // API 호출 결과 표준 데이터 포멧 정의
    let apiResult = {
        code: 200,
        data: null,
        result: ""
    }

    try {
        // Step1: URL에서 삭제하려는 게시글 번호를 조회한다.
        const articleIdx = req.body.article_id;

        // Step2: DB 테이블에서 해당 게시글을 삭제 처리한다.

        // Step3: DB 서버에서 특정 데이터가 삭제되면 삭제 건수가 백엔드로 반환된다.
        const deletedCount = 1;

        apiResult.code = 200;
        apiResult.data = deletedCount;
        apiResult.result = "OK";

    } catch {
        apiResult.code = 500;
        apiResult.data = 0;
        apiResult.result = "Server Error 관리자에게 문의하세요."; 
    }

    res.json(apiResult);
});


/**
- 기존 단일 게시글 정보 조회 요청과 응답 처리 라우팅 메소드 - 파라미터 방식 !
- 호출 주소: http://localhost:3000/api/articles/1
- 호출 방식: GET
- 응답 결과: 단일 게시글 정보 JSON 반환
*/
router.get('/:aid', async(req, res) => { // :aid -> 와일드카드

    // API 호출 결과 표준 데이터 포멧 정의
    let apiResult = {
        code: 200, // 처리결과 상태코드
        data: null, // 반환할 데이터
        result: "" // 서버에서 프론트로 보낼 메시지
    }

    try{
        // Step1: API URL 주소에서 게시글 번호를 추출한다. (파라미터 방식)
        // 파라미터 방식으로 전달되는 키 값 추출은 와일드카드(:aid) 키값을 이용해로 추출 가능하다.
        // req.params.와일드카드 키명으로 추출 가능하다.
        const articleIdx = req.query.aid;
        
        // Step2: 해당 게시글 번호를 기준으로 DB 게시글 테이블에서 단일 게시글 정보를 조회한다.
        // DB에서 조회해온 정보라고 가정한다.
        const article = {
            article_id: 1,
            title: "게시글1의 제목(파라미터 방식)",
            contents: "게시글1 내용입니다.",
            display: 1,
            view_cnt: 10,
            ip_address: "111.111.111.111",
            register_id: 1,
            register_date: Date.now()
        };

        apiResult.code = 200;
        apiResult.data = article;
        apiResult.result = "OK";
    }
    catch(err) {

        console.log("서버 에러:", err.message);
        // 백엔드에서 에러가 난 사실을 서버에 물리적 로그폴더를 만들고,
        // 로그.txt(.log) 파일에 기록하면 더 적극적으로 서버 에러에 대한 대응이 가능하다.

        apiResult.code = 500; // 서버 오류
        apiResult.data = null;
        apiResult.result = "Server ERROR 관리자에게 문의하세요."
    }

    // Step3: 단일 게시글 정보를 웹브라우저/클라이언트 응답 결과물로 반환한다.
    res.json(apiResult);
});


module.exports = router;