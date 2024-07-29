var express = require('express');
var router = express.Router();

/* 임시 메인 페이지 요청과 응답 처리 라우팅 메소드 */
router.get('/', async(req, res, next) => {
  res.render('index', { title: 'Express' });
});


/*
- 관리자 웹사이트 로그인 웹사이트 요청/응답 처리 라우팅 메소드
- 요청 주소: http://localhost:5001/login
- 요청 방식: GET
- 응답 결과: login.ejs view 페이지 반환
*/
router.get('/login', async(req, res) => {
  
  // {layout:false}: login.ejs view 파일 렌더링 시 레이아웃 페이지를 적용하지 않는다.
  res.render('login.ejs', {layout:false}, {resultMsg:''});
});


/*
- 관리자 로그인 정보 처리 요청/응답 라우팅 메소드
- 요청 주소: http://localhost:5001/login
- 요청 방식: POST
- 응답 결과: /main 페이지로 이동
*/
router.post('/login', async(req, res, next) => {
  const userId = req.body.userId;
  const password = req.body.password;

  // id와 password 체크 후 결과 확인
  const result = false;

  if(result) {
    // 정상 로그인 시
    res.redirect('/main');
  } else {
    // 아이디 또는 암호가 틀리면 다시 로그인 페이지 반환
    res.render('login.ejs', {resultMsg:'로그인 실패'})    
  }
});


/*
- 관리자 메인 웹페이지 요청/응답 처리 라우팅 메소드
- 요청 주소: http://localhost:5001/main
- 요청 방식: GET
- 응답 결과: main.ejs view 페이지 반환
*/
router.get('/main', async(req, res) => {
  res.render('main.ejs');
});


module.exports = router;
