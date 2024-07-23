var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// 로그인 화면 요청/응답 라우팅 메소드
router.get('/login', function(req, res) {
  res.render('login.ejs');
});


// 로그인 정보 처리 라우팅 메소드
router.post('/login', function(req, res) {
  const userId = req.userId;
  const password = req.password;

  const login = {
    userId,
    password
  }

  res.redirect('/main');
});


// 메인 페이지 요청/응답 라우팅 메소드
router.get('/main', function(req, res) {
  res.render('main.ejs');
});

module.exports = router;
