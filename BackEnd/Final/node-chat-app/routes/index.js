var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
 * 채팅 서버와 연결된 모든 사용자들 간 채팅하는 웹페이지 요청과 응답처리 라우팅 메소드
 * 요청 주소: http://localhost:5000/chat
 * 요청 방식: GET
 * 응답 결과: 단순 채팅 웹페이지 view 반환
 */
router.get('/chat', async(req, res) => {
  res.render('chat');
})

/*
 * 샘플용 프론트엔드 채팅 웹페이지
 * 특정 채팅방에 입장한 그룹 사용자들 간 채팅하는 웹페이지 요청과 응답처리 라우팅 메소드
 * 요청 주소: http://localhost:5000/groupchat
 * 요청 방식: GET
 * 응답 결과: 단순 그룹채팅 웹페이지 view 반환
 */
router.get('/groupchat', async(req, res) => {
  res.render('groupchat');
})

module.exports = router;
