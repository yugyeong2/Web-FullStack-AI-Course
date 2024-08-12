// admin.js 라우터의 기본 주소는 http://localhost:3000/admin 주소로 app.js에서 설정되어 있다.
var express = require('express');
var router = express.Router();

// moment 패키지 
var moment = require('moment');

// 관리자 암호를 단방향 암호화(해시 알고리즘)하기 위해 bcryptjs 패키지 참조
var bcrypt = require('bcryptjs');

// ORM DB 객체 참조
var db = require('../models/index');

// 동적 SQL 쿼리를 직접 작성해서 전달하기 위한 참조
var sequelize = db.sequelize;
const {QueryTypes} = sequelize;

// 관리자 로그인 여부 체크 미들웨어 함수 참조
const {isLoggedIn} = require('./sessionMiddleware.js'); // isLoggedIn 권한 체크 미들웨어를 통해 먼저 로그인을 했는지 체크한다.

/*
 * 관리자 계정 목록 조회 웹페이지 요청/응답 라우팅 메소드
 * 요청 주소: http://localhost:5001/admin/list
 * 요청 방식: GET
 * 응답 결과: 관리자 계정 목록 조회 웹페이지(view + data) 반환
*/
router.get('/list', isLoggedIn, async(req, res) => {

    // 관리자 목록조회 옵션 데이터 정의 = ViewModel
    const searchOption = { // 기본 검색 옵션 설정
        company_code: "9",
        admin_id: "",
        used_yn_code: "9"
    }

    // Step1: 전체 관리자 계정 목록 조회
    // findAll = Select * from admin;
    // -> SQL 구문으로 ORM Framework가 내부적으로 자동 생성되어 db 서버에 전달/실행 되고, 그 결과물이 백엔드로 반환된다.
    // const admins = await db.Admin.findAll();


    // Step1-1 예시 코드1: 모든 데이터 목록에서 원하는 컬럼 목록만 조회
    // SELECT admin_member_id, admins_id ... from admin where used_yn_code=1 order by reg_date desc;
    // const admins = await db.Admin.findAll({
    //     attributes: ['admin_member_id', 'admin_id', 'admin_name', 'email', 'company_code', 'dept_name', 'used_yn_code', 'reg_date'],
    //     where: {used_yn_code:1}, // used_yn_code가 1인 것만 보인다.
    //     order: [['reg_date', 'DESC']] // 정렬
    // });


    // Step1-2 예시 코드2: 순수 SQL구문을 DB 서버에 전달해서 동일한 결과 값 받아오기
    let query = `SELECT
                admin_member_id, admin_id, admin_name, email, company_code, dept_name, used_yn_code, reg_date
                FROM admin
                WHERE used_yn_code = 1
                ORDER BY reg_date DESC;`;

    // SQL 쿼리를 직접 수행하는 구문
    const admins = await sequelize.query(query, {
        raw: true,
        type: QueryTypes.SELECT
    });


    // Step1-3 예시 코드3: 해당 테이블의 전체 row 건 수 조회하기
    const adminCount = await db.Admin.count();
    console.log("관리자 테이블 전체 row 건 수 조회:", adminCount); // DB 테이블에 저장된 모든 칼럼 수가 출력된다.

    // Step2: 관리자 계정 목록 데이터 view 파일 전달하기
    res.render('admin/list', {admins, moment, searchOption});
})


/*
 * 관리자 계정 목록 조회 처리 웹페이지 요청/응답 라우팅 메소드
 * 요청 주소: http://localhost:5001/admin/list
 * 요청 방식: POST
 * 응답 결과: 관리자 계정 조회 옵션 결과 웹페이지(view + data) 반환
*/
router.post('/list', isLoggedIn, async(req, res) => {

    // Step1: 조회 옵션 정보 추출하기
    const company_code = req.body.company_code;
    const admin_id = req.body.admin_id;
    const used_yn_code = req.body.used_yn_code;

    // Step2: 조회 옵션으로 관리자 정보 조회하기
    // const admins = await db.Admin.findAll({where:{admin_id:admin_id}});// where:{model 속성명:사용자가 입력한 정보}


    // Step2-1 예시 코드1: 순수 SQL 구문을 DB 서버에 전달해서 동일한 결과 값 받아오기
    // 동적 쿼리: 상황에 따라 쿼리가 동적으로 바뀐다.
    let query = `SELECT
                admin_member_id, admin_id, admin_name, email, company_code, dept_name, used_yn_code, reg_date
                FROM admin
                WHERE admin_member_id > 0`;

    // 회사 코드 추가 필터 조건 반영
    if(company_code != 9) {
        query += ` AND company_code = ${company_code} `;
    }

    // 관리자 아이디 추가 필터 조건 반영
    if(admin_id.length > 0) {
        query += ` AND admin_id Like '%${admin_id}%' `;
    }

    // 사용 여부 추가 필터 조건 반영
    if(used_yn_code != 9) {
        query += ` AND used_yn_code = ${used_yn_code} `;
    }

    query += ' ORDER BY reg_date DESC;'

    // SQL 쿼리를 직접 수행하는 구문
    const admins = await sequelize.query(query,{
        raw: true,
        type: QueryTypes.SELECT 
    });


    // Step3: 조회 옵션 기본 값을 사용자가 입력/선택한 값으로 저장해서 view에 전달한다.
    const searchOption = {
        company_code,
        admin_id,
        used_yn_code
    }

    // Step4: 조회 결과 데이터 view에 전달하기
    res.render('admin/list', {admins, moment, searchOption});
});


/*
* 신규 관리자 계정 등록 웹페이지 요청/응답 라우팅 메소드
* 요청 주소: http://localhost:5001/admin/create
* 요청 방식: GET
* 응답 결과: 신규 관리자 계정 등록 웹페이지(view) 반환
*/
router.get('/create', isLoggedIn, async(req, res) => {
    res.render('admin/create');
});


/*
* 신규 관리자 정보 등록 처리 요청/응답 라우팅 메소드
* 요청 주소: http://localhost:5001/admin/create
* 요청 방식: POST
* 응답 결과: 신규 관리자 계정 JSON 데이터 반환 후 list로 이동
*/
router.post('/create', isLoggedIn, async(req, res) => {

    // Step1: 신규 관리자가 입력한 form 태그 내 입력/선택 데이터 추출
    // req.body.전달된 form 태그 내 HTML 입력/선택 요소의 name 속성명으로 지정
    // Ex) create.ejs의 form 태그 내의 관리자 아이디 input 박스의 name이 admin_id이기 때문에 속성명도 admin_id이다.
    const admin_id  = req.body.admin_id;
    const admin_password = req.body.admin_password;
    const company_code = req.body.company_code;
    const dept_name = req.body.dept_name;
    const admin_name = req.body.admin_name;
    const email = req.body.email;
    const telephone = req.body.telephone;
    const used_yn_code = req.body.used_yn_code;

    // hash('사용자가 입력한 암호', 암호화 강도->암호 글자 수);
    const encryptedPassword = await bcrypt.hash(admin_password, 12);

    // Step2: 신규 관리자 정보 DB에 저장 처리
    // 주의 ! DB에 저장할 데이터 구조는 반드시 해당 모델의 속성명과 동일해야 한다.
    // 주의 ! 신규 데이터 등록 시 모델의 속성 중 NotNull(allowNull:false)인 속성은 반드시 값을 등록해야 한다.
    
    //세션을 이용하여 현재 로그인한 사용자의 관리자 고유번호 추출
    const loginAdminId = req.session.loginUser.admin_member_id;

    const admin = {
        company_code,
        admin_id,
        admin_password: encryptedPassword, // DB에 암호화된 비밀번호를 저장한다.
        admin_name,
        email,
        telephone,
        dept_name,
        used_yn_code,
        reg_date: Date.now(),
        reg_member_id: loginAdminId
    };

    // Step3: DB 게시글 테이블에 상기 admin 데이터 등록 처리(Insert Into Table명...)
    // DB 서버에서 Insert SQL 구문을 통해서 DB 등록 처리가 되면 등록된 실제 데이터셋을 다시 반환한다.
    
    // DB의 admin 테이블에 상기 신규 데이터를 등록 처리하고 실제 저장된 관리자 계정 정보를 db 서버가 반환한다.
    // create() => INSERT INTO admin(...)values(...) SQL 구문을 ORM FX가 만들어서, DB 서버에 전달하여 실행하고 저장 결과를 다시 반환한다.
    await db.Admin.create(admin); // 반환값을 사용하지 않기 때문에, 반환값을 변수에 저장하지 않아도 됨.

    // Step4: 게시글 등록 완료 후 게시글 목록 페이지로 이동
    res.redirect('/admin/list');
});


/*
* 기존 관리자 정보 수정 처리 요청/응답 라우팅 메소드
* 요청 주소: http://localhost:5001/admin/modify
* 요청 방식: POST
* 응답 결과: 기존 관리자 계정의 수정된 JSON 데이터 반환 후 list로 이동
*/
router.post('/modify', isLoggedIn, async(req, res) => {

    // Step1: 사용자 수정 데이터를 추출
    const admin_member_id = req.body.admin_member_id; // 수정할 대상이 되는 관리자 고유번호(hidden 태그의 name 속성 값)
    const admin_id  = req.body.admin_id;
    const admin_password = req.body.admin_password;
    const company_code = req.body.company_code;
    const dept_name = req.body.dept_name;
    const admin_name = req.body.admin_name;
    const email = req.body.email;
    const telephone = req.body.telephone;
    const used_yn_code = req.body.used_yn_code;

    // Step2: DB 관리자 테이블에 특정 관리자 번호를 기준으로 해당 관리자 정보를 수정 처리
    const admin = {
        company_code,
        admin_name,
        email,
        telephone,
        dept_name,
        used_yn_code,
        edit_date: Date.now(),
        edit_member_id: req.session.loginUser.admin_member_id
    }

    // Step3: DB 서버에 해당 관리자 계정 정보를 수정하고, 수정이 완료되면 DB 서버에서 실제 수정된 건 수가 반환된다.
    // update() => UPDATE admin SET company_code = 0, ... WHERE admin_member_id=1;
    await db.Admin.update(admin, {
        where:{admin_member_id:admin_member_id}
    });

    // Step4: 게시글 목록 페이지로 이동 처리
    res.redirect('/admin/list');
});


/*
* 기존 관리자 계정 삭제 처리 요청/응답 라우팅 메소드
* 요청 주소: http://localhost:5001/admin/delete?id=1
* 요청 방식: GET
* 응답 결과: 기존 관리자 계정의 id JSON 데이터 반환 후 list로 이동
*/
router.get('/delete', isLoggedIn, async(req, res) => {

    // Step1: req.query.키명으로 쿼리스트링 방식으로 전달된 데이터 추출
    const admin_member_id = req.query.id;

    // Step2: 데이터 삭제 처리
    await db.Admin.destroy({
        where:{admin_member_id:admin_member_id}
    });

    // Step3: 삭제 후 관리자 목록 이동
    res.redirect('/admin/list');
})


/*
* 기존 관리자 정보 확인 웹페이지 요청/응답 라우팅 메소드
* 요청 주소: http://localhost:5001/admin/modify/1
* 요청 방식: GET
* 응답 결과: 기존 관리자 계정 정보가 포함된 웹페이지(view) 제공
*/
router.get('/modify/:id', isLoggedIn, async(req, res) => {

    // Step1: URL 주소에서 관리자 고유번호를 추출
    const admin_member_id = req.params.id;

    // Step2: DB 관리자 테이블에서 해당 관리자 고유번호에 해당하는 관리자 정보를 조회
    const admin = await db.Admin.findOne({
        where:{admin_member_id:admin_member_id}
    });

    // Step3: DB에서 가져온 관리자 정보를 modify.ejs view에 전달한다.
    res.render('admin/modify', {admin});
});


module.exports = router;