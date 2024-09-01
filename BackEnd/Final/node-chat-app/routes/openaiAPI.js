var express = require('express');
var router = express.Router();

// DB 객체 참조
var db = require('../models/index');

// 동적 SQL 쿼리를 직접 작성해서 전달하기 위한 참조
var sequelize = db.sequelize;
const { QueryTypes } = sequelize;

// OpenAI API 호출을 위한 axios 패키지 참조
const axios = require('axios');

// 파일 처리를 위한 file system 내장 객체 참조
const fs = require('fs');

// OpenAI 객체 생성
const { OpenAI } = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/*
 * Open AI Dalle.3 API를 호출하여 프론트엔드에서 제공한 프롬프트 기반 이미지 생성 API
 * 호출 주소: http://localhost:5000/api/openai/dalle
 * 호출 방식: POST
 * 응답 결과: 생성된 이미지 JSON 데이터 반환
 */
router.post("/dalle", async (req, res) => {
    let apiResult = {
        code: 400,
        data: null,
        message: '400: 요청 리소스가 없습니다.',
    };

    try {
        // Step1: 프론트엔드에서 전달한 사용자 프롬프트 정보 추출
        const model = req.body.model;
        const prompt = req.body.prompt;

        // Step2: OpenAI Dalle API 호출
        const response = await openai.images.generate({
            model: model,           // 이미지 처리 모델 선택: dall-e-2, dall-e-3
            prompt: prompt,         // 사용자 프롬프트
            n: 1,                   // 이미지 생성 개수(dalle2는 최대 10개, dalle3는 1개)
            size: "1024x1024",      // dalle2: 256x256, 512x512, 1024x1024 / dalle3: 1024x1024, 1792x1024, 1024x1792 지원
            style: "vivid",         // 기본값: vivid, / natural: dalle3만 지원(더 자연스럽고 초현실적인 이미지 생성)
            response_format: "b64_json", // url: openai 사이트에 생성된 이미지 풀 주소 경로 반환, b64_json: 바이너리 데이터 형식으로 반환
        });

        // Step3: Dalle API 호출결과에서 물리적 이미지 생성, 서버 공간에 저장
        // url방식으로 이미지생성값을 반환받는 경우, 최대 1시간 이후에 OpenAI 이미지 서버에서 해당 이미지가 삭제된다.
        // 해당 이미지가 영구적으로 필요하면, 반환된 url주소를 이용해 이미지를 백엔드에 생성하면 된다.
        
        // const imageURL = response.data[0].url;
        // console.log("dalle 이미지 생성 URL 경로: ", imageURL);

        // 이미지 경로를 이용해 물리적 이미지 파일 생성
        const imgFileName = `sample-${new Date()}.png`;
        const imgFilePath = `./public/ai/${imgFileName}`; // 로컬에 저장될 이미지 위치
        
        // ! 이미지 생성 요청에 대한 응답 값으로 이미지 바이너리 데이터로 반환 후 서버에 이미지 파일 생성
        const imageBinaryData = response.data[0].b64_json;
        console.log("이미지 바이너리 데이터 정보:", imageBinaryData);

        const buffer = Buffer.from(imageBinaryData, "base64");
        fs.writeFileSync(imgFilePath, buffer);

        // axios({
        //     url: imageURL,
        //     responseType: "stream",
        // })
        // .then((response) => {
        //     response.data
        //     .pipe(fs.createWriteStream(imgFilePath))
        //     .on("finish", () => {
        //         console.log("Image saved successfully.");
        //     })
        //     .on("error", (err) => {
        //         console.error("Error saving image:", err);
        //     });
        // })
        // .catch((err) => {
        //     console.error("Error downloading image:", err);
        // });



        // Step4: 최종 생성된 이미지 데이터 추출
        const article = {
            board_type_code: 3,     // 게시판 고유번호 - 3: AI 이미지 게시판
            title: model,           // 게시글 제목: AI 모델명
            article_type_code: 0,   // 게시글 유형코드 - 0: 일반 게시글
            contents: prompt,       // 게시글 내용: AI 프롬프트
            view_count: 0,
            ip_address: req.headers["x-forwarded-for"] || req.connection.remoteAddress, // 사용자 IP 추출 -> 로컬 개발 환경인 경우 ::1로 나올 수 있다.
            is_display_code: 1,     // 게시 여부 - 1: 게시
            reg_date: new Date(),
            reg_member_id: 1        // 추후 JWT 토큰에서 사용자 고유번호를 추출하여 처리 (DB에 존재하는 사용자 고유번호이어야 한다.)
        };

        // 신규 등록된 게시글 정보를 반환받는다.
        const registeredArticle = await db.Article.create(article);

        // 생성된 이미지 정보 만들고 저장
        const imageFullPath = `${process.env.DALLE_IMG_DOMAIN}/ai/${imgFileName}`; // 도메인주소를 포함한 백엔드 이미지 전체 url경로

        const articleFile = {
            article_id: registeredArticle.article_id,
            file_name: imgFileName,
            file_size: 0,   // 추후 변경
            file_path: imageFullPath, // 도메인 주소를 포함한 백엔드 이미지 전체 url 경로 (public 폴더는 도메인 주소를 통해 바로 접근 가능)
            file_type: "PNG",
            reg_date: new Date(),
            reg_member_id: 1 // 추후 변경 (생성한 article에 저장된 reg_member_id와 동일해야 하며, DB에 존재하는 사용자 고유번호이어야 한다.)
        };

        // Step5: DB 게시글 테이블에 사용자 이미지 생성요청 정보 등록처리
        const registeredFile = await db.Article_file.create(articleFile);

        // //단일 생성 이미지 파일 정보 생성
        // const fileData = {
        //   article_id: registeredArticle.article_id,
        //   file_id: file.article_file_id,
        //   title: registeredArticle.title,
        //   contents: registeredArticle.contents,
        //   file_path: file.file_path,
        //   file_name: file.file_name,
        //   reg_member_id: 1,
        //   reg_member_name: "유경",
        // };

        // Step6: 최종 생성된 이미지 정보를 프론트엔드로 반환한다.
        apiResult.code = 200;
        apiResult.data = imageFullPath; // 백엔드 서버에 저장된 이미지 url
        apiResult.message = "200 OK";

    } catch (error) {
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "ServerERR: 자세한 내용은 백엔드에 문의해주세요.";
    }

    // 최종 처리 결과 값을 프론트엔드로 반환한다.
    res.json(apiResult);
});

/*
 * 생성된 이미지 목록 정보 조회 요청 및 응답 처리 API 라우팅 메소드
 * 호출 주소: http://localhost:5000/api/openai/all
 * 호출 방식: GET
 * 응답 결과: board_type_code가 3(생성형 이미지 정보)인 게시글/파일 정보 조회 및 반환
 */
router.get('/all', async (req, res) => {
    let apiResult = {
        code: 400,
        data: null,
        message: '400: 요청 리소스가 없습니다.'
    };

    try {
        /*
         * 3개의 테이블에서 원하는 데이터를 가져와 JOIN 한다.
         * 흩어져 있는 데이터를 하나로 합쳐서 반환한다.
         * 각각의 테이블 article: A, article_file: F, member: M이라고 부른다.
         * AS: article_file_id를 file_id로 가져온다.

         * ON 키워드는 JOIN 절과 함께 사용되어 두 테이블 간의 조인 조건을 지정한다.
         * JOIN 조건에 사용되는 열은 각 테이블에서 Primary Key 또는 Foreign Key로 설정되어 있어야 한다.
         * ON: article_id를 기준으로 JOIN한다
         * INNER JOIN: 각 테이블에 모두 존재하는 데이터만 가져온다.
         */
        const query = `SELECT
                        A.article_id,
                        A.title,
                        A.contents,
                        A.reg_member_id,
                        F.article_file_id AS file_id,
                        F.file_name,
                        F.file_path,
                        M.name AS reg_member_name
                        FROM article A INNER JOIN article_file F
                        ON A.article_id = F.article_id
                        INNER JOIN member M ON A.reg_member_id = M.member_id
                        WHERE A.board_type_code = 3`;

        const blogFiles = await sequelize.query(query, {
            raw: true,
            type: QueryTypes.SELECT
        });

        apiResult.code = 200;
        apiResult.data = blogFiles;
        apiResult.message = '200 OK';

    } catch (error) {
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = 'ServerERR: 자세한 내용은 백엔드에 문의해주세요.';
    }

    res.json(apiResult);
});

/*
 * ChatGPT-4o 기반 질의응답 처리 API 라우팅 메소드
 * 호출 주소: http://localhost:5000/api/openai/gpt
 * 호출 방식: POST
 * 응답 결과: ChatGPT-4o 응답 메시지 결과 반환
 */
router.post('/gpt', async (req, res) => {
    let apiResult = {
        code: 400,
        data: null,
        message: '400: 요청 리소스가 없습니다.'
    }

    try {
        // Step1: 프론트엔드에서 전달해준 사용자 질문 메시지 프롬프트 추출
        const prompt = message.body.message;

        // Step2: OpenAI ChatGPT REST API 호출
        // -> 서버와 gpt는 실시간 연결이 아니라, RestAPI 통신하여 요청과 응답을 처리한다.
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o', // 지원 LLM 모델: gpt-4o-mini, gpt-4o, gpt-4, gpt-3.5-turbo
            message: [{role: 'user', content: prompt}],
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        // Step3: ChatGPT 응답 메시지 추출
        const gptMessage = response.data.choices[0].message[0].message.content;

        apiResult.code = 200;
        apiResult.data = gptMessage;
        apiResult.message = "200 OK";

    } catch (error) {
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "ServerERR: 자세한 내용은 백엔드에 문의해주세요.";
    }

    // Step4: 프론트엔드에 ChatGPT 응답 메시지 반환
    res.json(apiResult);
});

module.exports = router;
