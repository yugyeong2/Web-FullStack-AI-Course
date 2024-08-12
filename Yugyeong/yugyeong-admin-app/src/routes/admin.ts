import express, { Request, Response, Router } from "express";
import { Sequelize, QueryTypes } from "sequelize";
import db from "../models/index-model";

const router: Router = express.Router();

// 동적 SQL 쿼리를 직접 작성해서 전달하기 위한 참조
const sequelize: Sequelize = db.sequelize;

// 전체 admin 게시글 조회 페이지
router.get("/list", async (req, res) => {
  const admins = await db.Admin.findAll();
  res.render("admin/list", { admins: admins });
});

// 신규 admin 게시글 등록 페이지
router.get("/create", async (req, res) => {
  res.render("admin/create");
});

// 신규 admin 계정 등록
router.post("/create", async (req, res) => {
  const admin_id  = req.body.adminID;
  const admin_password = req.body.adminPassword;
  const admin_name = req.body.adminName;
  const admin_email = req.body.adminEmail;
  const admin_birth = req.body.adminBirth;
  const admin_telephone = req.body.adminTelephone;
  const admin_gender = req.body.adminGender;
  // const company_department = req.body.company_department;
  // const account_status = req.body.account_status;

  const createdAdmin = {
    admin_id,
    admin_password,
    admin_name,
    admin_email,
    admin_birth,
    admin_telephone,
    admin_gender,
    company_department: "test", // 나중에 create.ejs에 form 만들고 추가
    account_status: 1, // 나중에 create.ejs에 form 만들고 추가
    register_date: Date.now(),
    register_index_id: 1, // 나중에 세션 만들고 수정
  };

  const registeredAdmin = await db.Admin.create(createdAdmin);
  console.log("생성된 신규 admin 계정:", registeredAdmin);

  res.redirect("/admin/list");
});

// 기존 admin 게시글 수정
router.post("/modify", async (req, res) => {
  const admin = {
    company_code: 1,
    admin_id: "test",
    admin_password: "test user",
    admin_name: "테스트 사용자",
    email: "test@test.ac.kr",
    telephone: "010-1234-5678",
    dept_name: "테스트팀",
    used_yn_code: 1,
    edit_date: Date.now(),
    edit_member_id: 1,
  };

  const updatedAdmin = await db.Admin.create(admin);
  res.redirect("/article/list");
});

router.post("/delete", async (req, res) => {
  const admin_member_id = req.body.id;
  const deletedResult = await db.Admin.destroy({ where: { admin_member_id } });

  res.redirect("/article/list");
});

// 와일드카드
// 기존 admin 게시글 수정 페이지
router.get("/modify/:id", async (req, res) => {
  const admin_member_id = req.params.id;
  const admin = await db.Admin.findOne({
    where: { admin_member_id: admin_member_id },
  });

  res.render("admin/modify");
});

export default router;
