// index.js 라우터의 용도는 전체 웹사이트의 공통 기능에 대한 라우팅 기능을 제공한다.
// 기본 접속 주소는 http://localhost:5001로 접근하게 app.js에서 설정되어 있다.
var express = require('express');
var router = express.Router();

// 관리자 암호를 단방향 암호화(해시 알고리즘)하기 위해 bcryptjs 패키지 반환
var bcrypt = require('bcryptjs');

// ORM DB 객체를 참조
var db = require('../models/index');


/*
메인 페이지 요청과 응답 처리 라우팅 메소드
root 페이지에 접근하면, login 페이지로 이동
*/
router.get('/', async(req, res, next) => {
  res.redirect('/login');
});


/*
- 관리자 웹사이트 로그인 웹사이트 요청/응답 처리 라우팅 메소드
- 요청 주소: http://localhost:5001/login
- 요청 방식: GET
- 응답 결과: login.ejs view 페이지 반환
*/
router.get('/login', async(req, res) => {
  // 아이디/암호가 일치하지 않는 경우, 다시 로그인 view를 전달하고,
  // 로그인 view에 결과 메시지를 전달한다.
  let apiResult = { // 변경이 가능한 let
    code: 500,
    data: null,
    msg: "ServerERR: 자세한 내용은 백엔드에 문의해주세요.",
  }

  // {layout:false}: login.ejs view 파일 렌더링 시 레이아웃 페이지를 적용하지 않는다.
  res.render('login', {layout:false, apiResult});
});


/*
- 관리자가 입력한 아이디/암호를 추출하여 실제 로그인 프로세스를 처리하는 라우팅 메소드
- 요청 주소: http://localhost:5001/login
- 요청 방식: POST
- 응답 결과: /main 페이지로 이동
*/
router.post('/login', async(req, res, next) => {

  // 아이디/암호가 일치하지 않는 경우, 다시 로그인 view를 전달하고,
  // 로그인 view에 결과 메시지를 전달한다.
  let apiResult = { // 변경이 가능한 let
    code: 500,
    data: null,
    msg: "ServerERR: 자세한 내용은 백엔드에 문의해주세요.",
  }

  try {
  // Step1: 관리자 아이디/암호를 추출한다.
    const admin_id = req.body.admin_id;
    const admin_password = req.body.admin_password;

    // Step2: 동일한 괸리자 아이디 정보를 조회한다.
    const admin = await db.Admin.findOne({
      where:{admin_id:admin_id}
    })

    // Step3: DB에 저장된 암호와 관리자 입력 암호를 체크한다.
    // 동일한 아이디가 존재하는 경우
    if(admin) {
      // DB에 저장된 암호와 관리자가 로그인 화면에서 입력한 암호와 일치하는지 체크
      // bcrypt.compare('로그인 화면에서 전달된 암호', db에서 저장된 암호화된 문자열) 메소드는 암호가 같으면 true 반환, 다르면 false 반환
      const comparePassword = await bcrypt.compare(admin_password, admin.admin_password)
      console.log('입력한 암호:', admin_password);
      console.log('입력한 암호를 암호화한 값:', await bcrypt.hash(admin_password, 12));
      console.log('DB에 저장된 암호:', admin.admin_password);
      
      if(comparePassword) { // 암호가 일치하는 경우
        // Step4: 아이디/암호가 일치하면, home 페이지로 이동시키고, 그렇지 않으면 처리결과 data를 login.ejs에 전달한다.

        // Step5: 서버 세션에 저장할 로그인 사용자의 주요 정보 설정
        var sessionLoginData = {
          admin_member_id: admin.admin_member_id,
          company_code: admin.company_code,
          admin_id:admin.admin_id,
          admin_name: admin.admin_name
        }

        // express-session 패키지를 설치하고 app.js에 설정하면, req 객체에 session 속성이 추가된다.
        // req.session 속성에 loginUser 동적 속성을 정의하고, 값으로 현재 로그인한 사용자의 주요데이터를 저장한다.
        req.session.loginUser = sessionLoginData;

        // 현재 사용자의 로그인 여부를 동적속성 isLoggedIn을 정의하고 값으로 true를 설정한다.
        req.session.isLoggedIn = true;

        // 서버 세션을 최종 저장하고, 메인페이지로 이동시킨다.
        req.session.save(function() {
          console.log('세션 저장 완료');

          res.redirect('/home');
        });


      } else {
        // 암호가 일치하지 않는 경우
        apiResult.code = 402;
        apiResult.data = null;
        apiResult.msg = "IncorrectPassword: 암호가 일치하지 않습니다."

        res.render('login', {layout:false, apiResult});
      }
    } else {
      // 동일한 아이디가 없는 경우
      apiResult.code = 401;
      apiResult.data = null;
      apiResult.msg = "NotExistId: 동일한 아이디가 존재하지 않습니다.";
      
      res.render('login', {layout:false, apiResult});
    }    
  } catch(error) {
    console.log("/login 호출 중 에러 발생:", error.msg);

    apiResult.code = 500;
    apiResult.data = null;
    apiResult.msg = "ServerERR: 자세한 내용은 백엔드에 문의해주세요.";
};
});


/*
- 관리자 메인 웹페이지 요청/응답 처리 라우팅 메소드
- 요청 주소: http://localhost:5001/main
- 요청 방식: GET
- 응답 결과: main.ejs view 페이지 반환
*/
router.get('/home', async(req, res) => {

    res.render('home');
});


module.exports = router;
