// 일반회원 정보처리를 위한 각종 요청과 응답 처리 제공 라우터 파일
// 기본 호출주소 정의는 app.js에서 정의한다.
// 기본 호출주소: http://localhost:5000/api/member
var express = require('express');
var router = express.Router();


/*
 * 신규 회원정보 등록처리 요청과 응답 라우팅 메소드
 * 요청 주소: http://localhost:5000/api/member
 * 요청 방식: POST
 * 응답 결과: 신규 회원정보 등록처리 후 DB에 저장된 회원정보 반환
 * 주의 ! 클라이언트를 호출하는 주소와 호출 방식이 일치해야 해당 라우팅 메소드가 실행된다.
 */
router.post('/entry', async(req, res) => {
    // 백엔드 API를 호출하면, 반드시 아래 형식으로 백엔드에서 데이터를 반환한다.
    const apiResult = {
        // 요청 상태코드 - 200:OK, 400:요청 리스소가 없음, 500:백엔드 개발자의 실수/데이터를 잘못 전달
        code: 500,
        data: "null", // 백엔드에서 프론트엔드로 전달한 데이터
        message: "Server ERR, 자세한 내용은 백엔드에 문의해주세요." // 처리결과 코멘트(백엔드 개발자가 프론트 개발자에게 알려주는 코멘트 메시지)
    }

     // 로직 구현 -> 로직에서 에러가 나면, catch 블럭으로 에러 내용이 자동으로 전달된다.
    try {
        // Step1: 프론트에서 전송해주는 회원 정보 JSON 데이터를 추출한다.

        // Step2: member 테이블에 데이터를 등록한다.

        // Step3: 등록 후 반환된, 실제 DB에 저장된 member 데이터를 프론트에 반환한다.

        apiResult.code = 200;
        apiResult.data = {};
        apiResult.message = "OK";

    } catch(error) {
        // !중요 백엔드의 구체적인 에러 내용을 프론트엔드로 전송하는 것은 사직서와 동일하다.
        // Why? 보안적 위험 제공 -> DB 등록 시 먼저 DB 서버를 연결한다.
        //      DB 연결에 실패하면 연결 에러 메시지를 제공하는데 이러한 정보에는 보안적으로 공유하면 안되는 정보들이 존재한다.

        console.log("/api/member/entry 호출 중 에러 발생:", error.message);

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "Server ERR, 자세한 내용은 백엔드에 문의해주세요.";
    }

    // 프론트엔드에 최종 처리결과 데이터를 반환한다.

    res.json(apiResult);
});


module.exports = router;
