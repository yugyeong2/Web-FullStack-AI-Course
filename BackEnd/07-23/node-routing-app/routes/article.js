// 게시글 정보 관리 웹페이지 요청과 응답처리 전용 라우터 파일
// article.js 라우터 파일의 기본 주소 체계는 app.js내에서 http://localhost:3000/article로 정의

// express 객체를 참조
var express = require('express');

// 각종 요청과 응답 처리를 위한 라우터 객체 새엇ㅇ
var router = express.Router();


// 게시글 목록 웹페이지 요청과 응답 처리 라우팅 메소드 정의
// 요청 주소: http://localhost:3000/article/list

// router.get() 라우팅 메소드는 클라이언트에서 get 방식으로 요청해야 한다.
// < 클라이언트에 get 방식으로 요청하는 방법 >
// 1. 브라우저 주소창에  url을 직접 찍는 경우
// 2. <a href="article/list"> 링크 태그를 사용자가 클릭한 경우

// router.get('호출 주소 체계', 서버 응답처리 전용 콜백 함수());
// router.post('호출 주소 체계', 서버 응답처리 전용 콜백 함수());
// router.put('호출 주소 체계', 서버 응답처리 전용 콜백 함수());
// router.patch('호출 주소 체계', 서버 응답처리 전용 콜백 함수());
// router.delete('호출 주소 체계', 서버 응답처리 전용 콜백 함수());
// router.get('호출 주소 체계', 서버 응답처리 전용 콜백 함수());

router.get('/list', function(req, res) {

    // 콜백함수: 응답을 자동으로 처리하는 함수
    // 콜백함수(req, res, next);
    // 콜백함수(req = 요청 = HttpRequest 객체 = 클라이언트/웹브라우저에서 서버로 전달되는 모든 정보 제공 객체)
    // 콜백함수(res = 응답 = HttpResponse 객체 = 서버에서 클라이언트/웹브라우저로 응답처리하고 그 결과를 보내는 객체)
    // 콜백함수(next = 미들웨어로 콜백 처리 후에 진행할 흐름 제어 객체)

    // res.render('특정 view 파일 경로'): 특정 지정 view 파일의 내용을 웹브라우저로 전달하는 메소드
    // 여기서는 views/article/list.ejs 파일을 웹브라우저로 전달한다.
    // res.render('view 파일 경로', 해당 지정뷰에 전달할 Data(JSONData))
    res.render('article/list.ejs'); 
});


// 게시글 등록 웹페이지 요청과 응답 처리 라우팅 메소드
// 요청 주소: http://localhost:3000/article/create
// 클라이언트 요청 방식: GET
// 응답 형식: 게시글 등록 웹페이지(view 파일)
router.get('/create', function(req, res) {
    res.render('article/create.ejs'); // article 폴더 내의 create 파일을 렌더링
});


// 게시글 등록 페이지에서 form 방식으로 전달해준 사용자 입력 게시글 정보를 추출해 DB에 저장 처리하는 라우팅 메소드 구현
// 요청 주소: http://localhost:3000/article/create
// 클라이언트 요청 방식: POST
// 서버 측 라우팅 메소드는 호출 주소 URL과 클라이언트 요청 방식이 둘 다 동일해야 해당 라우팅 메소드가 실행된다 !
router.post('/create', function(req, res) {
    
    // Step1: 사용자 게시글 등록 폼 캐그 내 입력/선택 값 추출
    // 사용자 입력 폼 내 입력/선택 html 요소 태그의 값을 추출하려면 req.body.html 태그 요소의 name 속성 값을 이용해 추출한다.
    // req=HttpRequest 객체 = 요청 정보를 담고 있는 클라이언트/웹브라우저에서 서버로 전달되는 모든 정보를 담고 있는 객체
    const title = req.body.title;
    const contents = req.body.contents;
    const display = req.body.display;


    // Step2: DB에 저장한 JSON 데이터 생성
    // 객체의 속성명과 속성에 할당되는 변수명이 같으면 변수명은 생략 가능하다.
    const article = {
        title, // 객체의 속성명 = 할당 변수명
        contents,
        display,
        view_cnt: 0,
        ip_address: "111.111.111.111",
        register_date: Date.now(),
        register_id: 1
    }

    // Step3: DB의 관련 게시글 테이블에 데이터를 저장


    // Step4: 사용자 웹브라우저를 게시글 목록 페이지로 바로 이동
    // res.redirect('이동시키고자 하는 URL 주소 Ex) http:www.naver.com');
    res.redirect('/article/list'); // 도메인 생략(http://localhost:3000/article/list)

    // redirect != render
    // render는 서버에 있는 view 파일의 html 태그를 던져주는 것(내용 뿌려주기 및 이동)
    // redirect는 사용자 브라우저의 주소로 이동(페이지 이동)
    // 여기서 render를 사용하려면, 전달할 내용을 다시 DB에서 받아와서 전달해야 한다.
});


// 게시글 삭제 처리 요청과 응답 처리 라우팅 메소드
// 요청 주소: http://localhost:3000/article/delete
// 클라이언트 요청 방식: POST
// 응답 결과: 삭제 후 목록 페이지로 이동
router.post('/delete', function(req, res) {

    // Step 1: 삭제할 게시글 고유번호 추출
    const articleId = req.body.article_id;


    // Step2: DB 게시글 테이블에서 해당 게시글 번호로 단일 게시글 정보를 영구 삭제


    // Step3: 삭제 처리 후 목록 페이지로 이동
    res.redirect('/article/list');
});


// 게시글 확인 및 수정 웹페이지 요청과 응답 처리 라우팅 메소드
// 요청 주소: http://localhost:3000/article/modify?id=
// 클라이언트 요청 방식: GET
// 응답 형식: 단일 게시글 정보 확인 웹페이지(view 파일)
router.get('/modify', function(req, res) {

    // < URL 주소를 통해 데이터를 전달하는 방법 >

    // 1. QueryString 방식: URL 주소에 ?key=value&key=value...
    // Ex) http://shopping.naver.com/category?ptype=tv&manufeature=lg&price=5000 or http://test.co.kr/blogs?id=1

    // 2. 파라미터 방식: URL 주소 내에 데이터를 포함시키는 방식
    // Ex) http://test.co.kr/blogs/1 or http://test.co.kr/category/1/goods/2000

    // -> 파라미터 방식의 이점: 검색 엔진에 최적화된다 !
    // 웹사이트를 만드는 목적: 많은 사람들에게 알리기 위함 -> 보다 더 많은 사람들에게 노출되어야 함
    // URL 주소에 내용이 들어가 있으면 검색 엔진에 더 잘 노출된다.


    // Step1: URL 주소에서 게시글 고유 번호를 추출
    // 쿼리 스트링 방식으로 전달되는 key 값은 req.query.key명으로 추출한다.
    const articleId = req.query.id;


    //Step2: 해당 게시글 번호를 이용해 DB 게시글 테이블에서 단일 게시글 정보를 조회
    // DB는 추후에...
    // 아래 데이터를 DB에서 불러왔다는 가정하에
    const article = {
        article_id: 1,
        title: "웹 퍼블리셔의 업무에 대해 궁금해요.",
        contents: "웹퍼블리셔의 주요 업무 2가지 웹 표준 준수 코딩, 웹 접근성 준수, 반응형 웹페이지 구현...",
        display: 1,
        view_cnt: 100,
        register_date: "2024-07-23",
        register_id: 1
    }

    // 지정된 view 파일에 단일 게시글 데이터를 article이라는 속성명을 전달한다.
    res.render('article/modify', {article});
    // 객체의 속성명과 속성명의 값변수값이 동일하면 변수명은 생략 가능
    // res.render('article/modify', {article:article});

});


/** 라우팅 메소드 구현 시 가장 중요한 점: 와일드 카드가 구현된 라우팅 메소드는 모든 라우팅 메소드의 최하단에 구현할 것 ! */

// 기존 게시물 정보에 대해 사용자가 수정한 form 정보를 이용해 수정 데이터를 form에서 추출하고
// 추출한 수정 정보를 기반으로 DB에 저장되어 있던 기존 데이터를 수정 처리 후에 목록 페이지를 이동시킬지 말지의 결정은 개발자가 한다.
// 관리자 웹사이트의 특성상 목록 페이지로 그냥 이동시킨다.
// 요청 주소: http://localhost:3000/article/modify/1 => 파라미터 방식
// 클라이언트 요청 방식: POST 방식
// 응답 형식: 웹브라우저 주소를 목록 페이지로 이동시킨다.
// Ex) res.redirect('이동시킬 URL 주소');

// :id를 하면, 와일드 카드 키로 아이디값을 추출할 수 있다.
router.post('/modify/:id', function(req, res) {

    // URL 파라미터 방식으로 데이터를 전달하는 경우 해당 데이터를 URL에서 추출하는 방법을 사용한다.
    // 먼저 라우팅 주소에 와일드 카드 키를 설정한다. -> /modify/:id -> :id가 와일드카드 키명
    
    // Step1: 게시글 고유번호를 추출 -> 와일드 카드 키명으로 파라미터 값 추출하기
    // 파라미터 방식으로 URL을 통해 데이터를 전달하는 경우 req.params.와일드카드 키명으로 값을 추출한다.
    const articleId = req.params.id;


    // Step2: 사용자가 수정한 HTML 요소의 수정 값 추출
    const title = req.body.title;
    const contents = req.body.contents;
    const display = req.body.display;
    

    // Step3: DB 게시글 정보 수정을 위한 JSON 수정 데이터 생성
    const article = {
        title, // 속성명과 변수명이 같으므로 생략 가능 -> title:title
        contents,
        display
    }

    
    // Step4: DB에 해당 단일 게시글에 대해 상기 수정 데이터로 데이터를 수정 처리한다.
    // DB는 추후에...

    // 수정 작업이 끝나면 목록 페이지로 이동시키거나 특정 view 파일로 보내준다.(res.render(...))
    res.redirect('/article/list');
});


// 반드시 라우터 파일의 라우터 객체를 exports로 노출해야 app.js에서 router 내의 라우팅 규칙을 실행할 수 있다.
module.exports = router;
