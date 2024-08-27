// app.js에서 라우터 파일 참조 시, 본 라우터 파일의 기본 호출 주소: http://localhost:3000/member 로 시작하게 기본 주소를 설정해준다.
var express = require('express');
var router = express.Router();

// moment 패키지 
var moment = require('moment');

// 사용자 암호를 단방향 암호화(해시 알고리즘)하기 위해 bcryptjs 패키지 참조
var bcrypt = require('bcryptjs');

// ORM DB 객체 참조
var db = require('../models/index');

// 동적 SQL 쿼리를 직접 작성해서 전달하기 위한 참조
var sequelize = db.sequelize;
const { QueryTypes, Op } = require('sequelize');

const {isLoggedIn} = require('./sessionMiddleware.js'); // isLoggedIn 권한 체크 미들웨어를 통해 먼저 로그인을 했는지 체크한다.


/*
 * 사용자 계정 목록 조회 웹페이지 요청/응답 라우팅 메소드
 * 요청 주소: http://localhost:5001/member/list
 * 요청 방식: GET
 * 응답 결과: list view 페이지 반환
*/
router.get('/list', isLoggedIn, async(req, res) => {

    // 사용자 목록조회 옵션 데이터 정의 = ViewModel
    const searchOption = { // 기본 검색 옵션 설정
        email: "",
        name: "",
        use_state_code: "1"
    }

    // Step1: 모든 데이터 목록에서 원하는 컬럼 목록만 조회
    // SELECT member_id, email ... from members where use_state_code=1 order by entry_date desc;
    const members = await db.Member.findAll({
        attributes: ['member_id', 'email', 'name', 'telephone', 'entry_type_code', 'use_state_code', 'birth_date', 'entry_date'],
        // where: {use_state_code:2}, // use_state_code 2인 것만 보인다.
        order: [['entry_date', 'DESC']] // 정렬
    });

    // Step1-1: 해당 테이블의 전체 row 건 수 조회하기
    const memberCount = await db.Member.count();
    console.log("사용자 테이블 전체 row 건 수 조회:", memberCount); // DB 테이블에 저장된 모든 칼럼 수가 출력된다.

    // Step2: 사용자 계정 목록 데이터 view 파일 전달하기
    res.render('member/list', {members, moment, searchOption});
});


router.post('/list', isLoggedIn, async(req, res) => {

    // Step1: 조회 옵션 정보 추출하기
    const email = req.body.email;
    const name = req.body.name;
    const use_state_code = req.body.use_state_code;

    const members = await db.Member.findAll({
        attributes: ['member_id', 'email', 'name', 'telephone', 'entry_type_code', 'use_state_code', 'birth_date', 'entry_date'],
        where: { [Op.or]:[ {email:{email}}, {name:{name}}, {use_state_code:{use_state_code}} ] }, // 동적 쿼리
        order: [['entry_date', 'DESC']] // 정렬
    });

    // Step3: 조회 옵션 기본 값을 사용자가 입력/선택한 값으로 저장해서 view에 전달한다.
    const searchOption = {
        email,
        name,
        use_state_code
    }

    // Step4: 조회 결과 데이터 view에 전달하기
    res.render('member/list', {members, moment, searchOption});
})



/*
 * 기존 사용자 계정 확인 요청/응답 데이터 처리 라우팅 메소드
 * 요청 주소: http://localhost:5001/member/modify
 * 요청 방식: POST
 * 응답 결과: 해당 사용자 계정의 수정된 JSON 데이터 반환 후 list로 이동
*/
router.post('/modify', isLoggedIn, async(req, res) => {

    const member_id = req.body.member_id;
    const email = req.body.email;
    const member_password = req.body.member_password;
    const name = req.body.name;
    const profile_img_path = req.body.profile_img_path;
    const telephone = req.body.telephone;
    const entry_type_code = req.body.entry_type_code;
    const use_state_code = req.body.use_state_code;
    const birth_date = req.body.birth_date;

    const member = {
        name,
        profile_img_path,
        telephone,
        entry_type_code,
        use_state_code,
        birth_date,
        edit_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        edit_member_id: req.session.loginUser.member_id
    }

    await db.Member.update(member, {
        where: {member_id: member_id}
    });

    res.redirect('/member/list');
});


/*
 * 기존 사용자 계정 삭제 요청/응답 데이터 처리 라우팅 메소드
 * 요청 주소: http://localhost:5001/member/delete
 * 요청 방식: POST
 * 응답 결과: 삭제된 사용자 계정의 id JSON 데이터 반환 후 list로 이동
*/
router.post('/delete', isLoggedIn, async(req, res) => {

    res.redirect('/member/list');
})


/*
 * 기존 사용자 계정 확인 웹페이지 요청/응답 라우팅 메소드
 * 요청 주소: http:localhost:5001/member/modify/1
 * 요청 방식: GET
 * 응답 결과: modify view 페이지 반환
*/
router.get('/modify/:id', isLoggedIn, async(req, res) => {
    const member_id = req.params.id;

    const member = await db.Member.findOne({
        where: {member_id: member_id}
    })

    res.render('member/modify', {member});
});


module.exports = router;