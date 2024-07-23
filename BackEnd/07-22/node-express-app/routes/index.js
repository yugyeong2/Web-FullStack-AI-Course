// 노드 기본 백엔드 앱의 기본 공통적인 사용자 요청과 응답처리 전용 라우터 파일
// 해당 라우터 파일의 기본 호출 주소: http://localhost:3000/
// 모든 라우터 파일은 기본 호출 주소 체계를 app.js에서 사전 정의한다.

// routes는 controller

//express 객체 참조하기 
var express = require('express');

//각종 사용자 요청과 응답을 처리할수 있는 router객체를 express.Router()메소드를 
//통해 생성합니다.
//생성된 router객체를 통해 각종 사용자 요청과 응답을 처리합니다. 
var router = express.Router();

/*
메인 웹페이지 요청과 응답처리 라우팅 메소드
호출 주소: http://localhost:3000/
*/
router.get('/', function(req, res, next) {
  // req: HttpRequest, 클라이언트가 요청하는 정보 객체 (추출)
  // res: HTTPResponse, 서버에서 클라이언트로 응답하는 정보 객체 (전달)

  console.log("http://localhost:3000/라우팅 메소드의 콜백함수가 호출되었습니다.");
  console.log("사용자 클라이언트 정보를 req(HttpRequest객체에서 조회가능합니다.", req);

  // 테스트 쿼리스트링 아이디값을 추출합니다.
  // Ex) http://localhost:3000/?id=testing&stock=2
  const testId = req.query.id; // id=testing
  const stock = req.query.stock; // stock=2
  
  console.log("URL QueryString 방식으로 전달된 데이터 출력:", testId, stock);
  console.log("서버 측에서 웹브라우저 응답처리를 위한 res(HttpResponse) 객체 출력", res);
  console.log("res.render() 메소드를 통해 메인 뷰파일(index.ejs)파일이 바로 호출된다.");
  

  // 서버에서 사용자 웹브라우저로 응답결과물을 반환합니다.
  // 지정된 view파일 내 웹페이지가 반환됩니다.
  // res.render('view파일 경로', view파일에 전달하는 JSON 데이터);
  res.render('index.ejs', { title: '홈페이지' });
});

//회원가입 웹페이지 요청과 응답처리 라우팅메소드 구현하기
//router.get('호출주소체계url',콜백함수()) 
//콜백함수는 해당 라우팅메소드가 호출되면 서버에서응답처리하기 위한 함수가 자동실행. 
//호출주소: http://localhost:3000/entry
//콜백함수가 서버에서 응답 처리해야하는 기능을 구현햐는 영역
router.get('/entry',function(req,res){
  //res.render()메소드는 서버에서 지정한 뷰파일을 웹브라우저로 전달하는 메소드
  //res.render('지정한 경로포함 뷰파일명',뷰파일에 전달한데이터)
  //views폴더내에 entry.ejs파일내 html웹페이지 내용을 웹브라우저에 전달한다.
  res.render('entry.ejs');
});


//로그인 웹페이지 요청과 응답처리 라우팅메소드 구현하기
//호출주소쳬게: localhost:3000/login
router.get('/login',function(req,res){
  //서버에서 응답처리할 기능구현
  //views폴더내 login.ejs파일내 html웹페이지를 웹브라우저에 전달한다. 
  res.render('login.ejs');
});

module.exports = router;
