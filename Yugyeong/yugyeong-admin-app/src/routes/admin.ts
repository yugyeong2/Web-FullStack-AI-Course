import express, { Request, Response, Router } from "express";
import { Sequelize, QueryTypes } from "sequelize";
import db from "../models/index-model";

const router: Router = express.Router();

// 동적 SQL 쿼리를 직접 작성해서 전달하기 위한 참조
const sequelize: Sequelize = db.sequelize;


router.get("/", async (req, res) =>  {
  res.redirect("/admin/list");
});

// 전체 admin 계정 리스트 페이지
router.get("/list", async (req, res) => {
  res.render("admin/list"); // list.ejs 또는 list.html과 같은 템플릿 파일 렌더링
});

// 전체 admin 계정 조회 라우터
router.get("/api/list", async (req, res) => {
  const searchOption = { // 검색 옵션 설정
    admin_name: "",
    admin_gender: "0",
    company_department: "",
  }

  let query = `SELECT
              index_id, admin_name, admin_email, company_department, account_state, register_date
              FROM admin
              ORDER BY register_date DESC;`;

  const admins = await sequelize.query(query, {
    raw: true,
    type: QueryTypes.SELECT
  });

  // EJS를 사용하지 않고 JSON 데이터를 클라이언트에 반환
  res.json({ admins, searchOption });
});

router.post("/list", async (req, res) => {
  
});

// 신규 admin 계정 등록 페이지
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

// 기존 admin 계정 수정
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
  res.redirect("/admin/list");
});

router.post("/delete", async (req, res) => {
  const admin_member_id = req.body.id;
  const deletedResult = await db.Admin.destroy({ where: { admin_member_id } });

  res.redirect("/admin/list");
});

// 와일드카드
// 기존 admin 계정 수정 페이지
router.get("/modify/:id", async (req, res) => {
  const admin_member_id = req.params.id;
  const admin = await db.Admin.findOne({
    where: { admin_member_id: admin_member_id },
  });

  res.render("admin/modify");
});

export default router;
