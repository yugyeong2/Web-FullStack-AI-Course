var express = require('express');
var router = express.Router();

var db = require('../models/index');
const admin = require('../models/admin');


// 전체 admin 게시글 조회 페이지
router.get('/list', async(req, res) => {
    const admins = await db.Admin.findAll();
    res.render('admin/list', {admin:admin});
});


// 신규 admin 게시글 등록 페이지
router.get('/create', async(req, res) => {
    res.render('/admin/create');
});

// 신규 admin 게시글 등록
router.post('/create', async(req, res) => {
    const admin = {
        company_code: 1,
        admin_id: test,
        admin_password: "test user",
        admin_name: "테스트 사용자",
        email: "test@test.ac.kr",
        telephone: "010-1234-5678",
        dept_name: "테스트팀",
        used_yn_code: 1,
        reg_date: Date.now(),
        reg_member_id: 1
    }

    const registeredAdmin = await db.Admin.create(admin);
    res.redirect('/article/list');
});


// 기존 admin 게시글 수정
router.post('/modify', async(req, res) => {
    const admin = {
        company_code: 1,
        admin_id: test,
        admin_password: "test user",
        admin_name: "테스트 사용자",
        email: "test@test.ac.kr",
        telephone: "010-1234-5678",
        dept_name: "테스트팀",
        used_yn_code: 1,
        edit_date: Date.now(),
        edit_member_id: 1
    }

    const updatedAdmin = await db.Admin.create(admin);
    res.redirect('/article/list');
});


router.post('/delete', async(req, res) => {
    const admin_member_id = req.params.id;
    const deletedResult = await db.Admin.destroy({where:{admin_member_id}});

    res.redirect('/article/list');
});


// 와일드카드
// 기존 admin 게시글 수정 페이지
router.get('/modify/:id', async(req, res) => {
    admin_member_id = req.params.id;
    const admin = await db.Admin.findOne(admin_member_id);

    res.render('article/modify');
});


module.exports = router;