// 일반회원 정보처리를 위한 각종 요청과 응답 처리 제공 라우터 파일
// 기본 호출주소 정의는 app.js에서 정의한다.
// 기본 호출주소: http://localhost:5000/api/member
var express = require('express');
var router = express.Router();

// var moment = require('moment');

// 사용자 암호 단방향 암호화 적용을 위해 bcryptjs 참조
var bcrypt = require('bcryptjs');

// ORM DB 객체 참조
var db = require('../models/index');

// JWT 토큰 발급 참조
const jwt = require('jsonwebtoken');

// 파일 업로드를 위한 multer객체 참조
var multer = require('multer');

// 파일 저장 위치 지정
var storage  = multer.diskStorage({ 
    destination(req, file, cb) {
        cb(null, 'public/upload/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}__${file.originalname}`);
    },
});

// 일반 업로드처리 객체 생성
var upload = multer({ storage: storage });

/*
 * 신규 회원정보 등록처리 요청과 응답 라우팅 메소드
 * 요청 주소: http://localhost:5000/api/member/entry
 * 요청 방식: POST
 * 응답 결과: 신규 회원정보 등록처리 후 DB에 저장된 회원정보 반환
 * 주의 ! 클라이언트를 호출하는 주소와 호출 방식이 일치해야 해당 라우팅 메소드가 실행된다.
 */
router.post('/entry', async(req, res) => {
    // 백엔드 API를 호출하면, 반드시 아래 형식으로 백엔드에서 데이터를 반환한다.
    let apiResult = {
        // 요청 상태코드 - 200:OK, 400:요청 리소스가 없음, 500:백엔드 개발자의 실수/데이터를 잘못 전달
        code: 400,
        data: null, // 백엔드에서 프론트엔드로 전달한 데이터
        message: "400: 요청 리소스가 없습니다." // 처리결과 코멘트(백엔드 개발자가 프론트 개발자에게 알려주는 코멘트 메시지)
    }

     // 로직 구현 -> 로직에서 에러가 나면, catch 블럭으로 에러 내용이 자동으로 전달된다.
    try {
        // Step1: 프론트에서 전송해주는 회원 정보 JSON 데이터를 추출한다.
        const email = req.body.email;
        const password = req.body.password;
        const nickname = req.body.nickname;

        // Step1-1: 신규회원 메일주소 중복검사 처리하기
        const existMember = await db.Member.findOne({ where: { email: email } });

        // 동일한 메일주소 사용자가 있는경우 에러처리 데이터 반환
        if (existMember) {
            apiResult.code = 400;
            apiResult.data = null;
            apiResult.message = "ExistMember: 동일한 이메일이 존재합니다.";

            return res.json(apiResult);
        }

        // 사용자 암호를 단방향 암호화 문자열로 변환
        const bcryptPassword = await bcrypt.hash(password, 12); 

        // Step2: member 테이블에 데이터를 등록한다.
        // 등록할 데이터의 구조(속성명)운 models/member.js 모델의 속성명을 기준으로 작성한다.
        // DB member 테이블에 저장된 신규 JSON 데이터를 생성한다.(모델 속성 기준 -> NotNull 확인하기)
        const member = {
            email: email,
            member_password: bcryptPassword,
            name: nickname,
            profile_img_path: "img/default_profile.png",
            entry_type_code: 0,
            use_state_code: 1,
            entry_date: Date.now()
        };

        // 등록할 데이터를 DB member 테이블에 저장한 후, 실제 DB에 저장된 회원 데이터가 다시 반환된다.
        let registeredMember = await db.Member.create(member);
        registeredMember.member_password = ""; // 보안적 이유로 암호는 프론트엔드에 전송하지 않는다.

        // Step3: 등록 후 반환된, 실제 DB에 저장된 member 데이터를 프론트에 반환한다.
        apiResult.code = 200;
        apiResult.data = registeredMember;
        apiResult.message = "200 OK";

    } catch(error) {
        // !중요 백엔드의 구체적인 에러 내용을 프론트엔드로 전송하는 것은 사직서와 동일하다.
        // Why? 보안적 위험 제공 -> DB 등록 시 먼저 DB 서버를 연결한다.
        //      DB 연결에 실패하면 연결 에러 메시지를 제공하는데 이러한 정보에는 보안적으로 공유하면 안되는 정보들이 존재한다.

        console.log("/api/member/entry 호출 중 에러 발생:", error.message);

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "ServerERR: 자세한 내용은 백엔드에 문의해주세요.";
    }

    // 프론트엔드에 최종 처리결과 데이터를 반환한다.
    res.json(apiResult);
});


/*
 * 회원 로그인 데이터 처리 요청과 응답 라우팅 메소드
 * 요청 주소: http://localhost:5000/api/member/login
 * 요청 방식: POST
 * 응답 결과: 사용자 이메일/암호를 체크하고 JWT 사용자 인증 토큰 값을 프론트엔드로 반환한다.
 */
router.post('/login', async(req, res) => {
    // 백엔드 API를 호출하면, 반드시 아래 형식으로 백엔드에서 데이터를 반환한다.
    let apiResult = {
        // 요청 상태코드 - 200:OK, 400:요청 리스소가 없음, 500:백엔드 개발자의 실수/데이터를 잘못 전달
        code: 400,
        data: null, // 백엔드에서 프론트엔드로 전달한 데이터
        message: "400: 요청 리소스가 없습니다." // 처리결과 코멘트(백엔드 개발자가 프론트 개발자에게 알려주는 코멘트 메시지)
    };

    try{
        // Step1: 프론트엔드에서 전달해주는 로그인 사용자의 이메일/암호를 추출한다.
        const email = req.body.email;
        const password = req.body.password;

        // Step2: 사용자 메일 주소 존재 여부를 체크한다.
        const member = await db.Member.findOne({
            where:{email:email}
        });

        if(member) { // 동일 이메일이 존재하는 경우
            // Step3: 사용자 암호 값 일치 여부를 체크한다.
            const compareResult = await bcrypt.compare(password, member.member_password);

            if(compareResult) { // 암호가 일치하는 경우
                // Step4: 사용자 이메일/암호가 일치하는 경우, 현재 로그인 사용자의 주요 정보를 JSON 데이터로 생성한다.
                // 자주 사용되는 정보를 토큰에 담아놓는다.(DB에서 가져오는 것보다 빠르다.)
                const tokenJsonData = {
                    member_id: member.member_id,
                    email: member.email,
                    name: member.name,
                    profile_img_path: member.profile_img_path
                }

                // Step5: 인증된 사용자 JSON 데이터를 JWT 토큰 내에 달아 JWT 토큰 문자열을 생성한다.
                // jwt.sign('JSON 데이터', 토큰 인증키, {옵션(유효기간, 발급자)});
                const token = await jwt.sign(tokenJsonData, process.env.JWT_AUTH_KEY, {
                     // Ex) 60m / 10s / 24h
                    expiresIn: '24h', // 유효기간: 24시간 후 자동 파기
                    issuer: 'Yugyeong'
                });

                // Step6: JWT 토큰 문자열을 프론트엔드로 반환한다.
                apiResult.code = 200;
                apiResult.data = {
                    token: token,
                    member: 
                    {
                        member_id: tokenJsonData.member_id,
                        email: tokenJsonData.email,
                        name: tokenJsonData.name
                    }
                };
                apiResult.message = "OK";

            } else {
                // 암호가 일치하지 않는 경우, 프론트엔드로 결과값을 반환
                apiResult.code = 400;
                apiResult.data = null;
                apiResult.message = "IncorrectPassword: 암호가 일치하지 않습니다.";
            }

        } else {
            // 이메일이 존재하지 않는 경우, 프론트엔드로 결과값을 반환
            apiResult.code = 400;
            apiResult.data = null;
            apiResult.message = "NotExistEmail: 이메일이 존재하지 않습니다.";
        }


    } catch(error) {
        console.log("/api/member/login 호출 중 에러 발생:", error.message);

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "ServerERR: 자세한 내용은 백엔드에 문의해주세요.";
    };

    res.json(apiResult);
});


/*
 * 현재 로그인한 사용자의 상세 프로필 정보를 DB에서 조회하여, 반환하는 라우팅 메소드
 * 요청 주소: http://localhost:5000/api/member/profile
 * 요청 방식: GET
 * 응답 결과: 프론트엔드에서 제공한 JWT 토큰값을 전달받아 해당 사용자의 메일 주소로 DB에서 조회한 결과 값을 반환한다.
 */
router.get('/profile', async(req, res) => {
    // 백엔드 API를 호출하면, 반드시 아래 형식으로 백엔드에서 데이터를 반환한다.
    let apiResult = {
        // 요청 상태코드 - 200:OK, 400:요청 리스소가 없음, 500:백엔드 개발자의 실수/데이터를 잘못 전달
        code: 500,
        data: null, // 백엔드에서 프론트엔드로 전달한 데이터
        message: "ServerERR: 자세한 내용은 백엔드에 문의해주세요." // 처리결과 코멘트(백엔드 개발자가 프론트 개발자에게 알려주는 코멘트 메시지)
    };

    try {
        // Step1: 웹브라우저의 헤더에서 JWT 토큰 값을 추출한다.
        // 웹브라우저에서 전달되는 토큰값 예시: "Bearer 토큰값"
        const token = req.headers.authorization.split('Bearer ')[1];

        // Step2: JWT 토큰 문자열 내에서 인증 사용자의 JSON 데이터를 추출한다.
        // jwt.verify('토큰문자열', 토큰생성 시 사용한 인증키값) 실행 후 토큰 내 저장된 JSON data를 반환한다.(토큰 까보기)
        const loginMemberData = await jwt.verify(token, process.env.JWT_AUTH_KEY);

        // Step3: 토큰 페이로드 영역에서 추출한 현재 로그인 사용자 고유번호를 기준으로 DB에서 단일 사용자를 조회한다.
        const dbMember = await db.Member.findOne({
            where: {member_id: loginMemberData.member_id} // DB의 member_id와 토큰의 member_id가 같은지 확인
        });

        // 보안상 사용자 비밀번호를 프론트에 전달할 필요는 없다.
        dbMember.member_password = "";

        // Step4: 단일 사용자 정보를 프론트엔드로 전달한다.
        apiResult.code = 200;
        apiResult.data = dbMember;
        apiResult.message = "OK";

    } catch(error) {
        console.log("/api/member/profile 호출 중 에러 발생:", error.message);

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "ServerERR: 자세한 내용은 백엔드에 문의해주세요.";
    };

    res.json(apiResult);
});


/*
 * 사용자 프로필 사진 업로드 및 정보 처리 라우팅 메소드
 * 요청 주소: http://localhost:5000/api/member/profile/upload
 * 요청 방식: POST
 * 응답 결과: 프론트엔드에서 첨부한 이미지 파일을 업로드 처리하고, 업로드된 정보를 반환한다.
*/
router.post('/profile/upload', upload.single('file'), async(req, res) => {

    let apiResult = {
        code: 500,
        data: null,
        message: ""
    };


    try{
        // Step1: 업로드된 파일 정보 추출하기 
        const uploadFile = req.file;

        // 실제 서버에 업로드된 파일경로 
        const filePath = `/upload/${uploadFile.filename}`;
        const fileName = uploadFile.originalname;// 서버에 업로드된 파일명(32243143422_a.png)
        const fileSize = uploadFile.size;// 파일 크기
        const mimeType = uploadFile.mimetype;// 파일의 MIME타입

        // 파일정보를 DB에 저장하기
        const file = {
            filePath,
            fileName,
            fileSize,
            mimeType
        };

        // Step2: 업로드된 파일정보 반환하기 
        apiResult.code = 200;
        apiResult.data = file;
        apiResult.message = "Ok";

    }catch(error){
        console.log("/api/member/profile/upload 호출 중 에러 발생:", error.message);

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "ServerERR: 자세한 내용은 백엔드에 문의해주세요.";
    }


    res.json(apiResult);
});


module.exports = router;
