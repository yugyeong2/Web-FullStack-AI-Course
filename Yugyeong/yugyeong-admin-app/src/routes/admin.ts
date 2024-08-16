import express, { Request, Response, Router } from "express";
import { Sequelize, QueryTypes } from "sequelize";
import db from "../models/index-model";

const router: Router = express.Router();

// 동적 SQL 쿼리를 직접 작성해서 전달하기 위한 참조
const sequelize: Sequelize = db.sequelize;

router.get("/", async (req, res) => {
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
  };

  let query = `SELECT
              index_id, admin_name, admin_email, company_department, account_state, register_date
              FROM admin
              ORDER BY register_date DESC;`;

  const admins = await sequelize.query(query, {
    raw: true,
    type: QueryTypes.SELECT,
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
  const admin_id = req.body.adminID;
  const admin_password = req.body.adminPassword;
  const admin_name = req.body.adminName;
  const admin_email = req.body.adminEmail;
  const admin_birth = req.body.adminBirth;
  const admin_telephone = req.body.adminTelephone;
  const admin_gender = req.body.adminGender;
  const company_department = req.body.adminCompanyDepartment;
  const account_state = req.body.adminAccountState;

  const createdAdmin = {
    admin_id,
    admin_password,
    admin_name,
    admin_email,
    admin_birth,
    admin_telephone,
    admin_gender,
    company_department,
    account_state,
    register_date: Date.now(),
    register_index_id: 1, // 나중에 세션 만들고 수정
  };

  const registeredAdmin = await db.Admin.create(createdAdmin);
  console.log("생성된 신규 admin 계정:", registeredAdmin);

  res.redirect("/admin/list");
});

// 기존 admin 계정 수정
router.post("/modify", async (req, res) => {
  const index_id = req.body.indexId;
  const admin_id = req.body.adminID;
  const admin_email = req.body.adminEmail;
  const admin_telephone = req.body.adminTelephone;
  const admin_gender = req.body.adminGender;
  const company_department = req.body.adminCompanyDepartment;
  const account_state = req.body.adminAccountState;

  const modifiedAdmin = {
    admin_id,
    admin_email,
    admin_telephone,
    admin_gender,
    company_department,
    account_state,
    edit_date: Date.now(),
    edit_index_id: 1, // 나중에 세션 만들고 수정
  };

  const updatedAdmin = await db.Admin.update(modifiedAdmin, {
    where: { index_id: index_id },
  });
  console.log("변경된 admin 계정:", updatedAdmin);

  res.redirect("/admin/list");
});

// 와일드카드
// 수정할 기존 관리자 계정을 JSON 형식으로 반환
router.post("/delete/:id", async (req, res) => {
  const index_id = req.params.id;

  try {
    // 데이터베이스에서 해당 index_id에 해당하는 데이터를 삭제
    const deletedResult = await db.Admin.destroy({ where: { index_id } });
    console.log("삭제된 admin 계정:", deletedResult);

    // 삭제 완료 후 클라이언트에 응답으로 list 페이지로 리다이렉션 요청
    // ! -> 서버 측에서는 삭제 작업이 완료되면 리다이렉션 응답을 클라이언트로 보내지만, fetch를 통해 요청을 보낸 경우 클라이언트가 이 리다이렉션을 직접 처리해야 합니다.
    // !    클라이언트 측에서는 서버로부터 리다이렉션 요청을 받으면, 클라이언트에서 직접 window.location.href를 통해 리다이렉션을 수행합니다. 
    res.redirect("/admin/list");
    console.log("삭제 완료 목록 페이지로 이동");

  } catch (error) {
    console.error("데이터 삭제 중 오류 발생:", error);
    res.status(500).send("서버 오류로 인해 데이터를 삭제할 수 없습니다.");
  }
});

// admin 계정 수정 페이지 렌더링
router.get("/modify/:id", async (req, res) => {
  const index_id = req.params.id;
  const admin = await db.Admin.findOne({ where: { index_id } });
  
  res.render("admin/modify");
});

// 수정할 기존 admin 계정 정보를 form에 JSON으로 전달
router.get("/api/modify/:id", async (req, res) => {
  const index_id = req.params.id;
  const admin = await db.Admin.findOne({ where: { index_id } });
  
  res.json(admin);
});


export default router;
