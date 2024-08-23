/*
 * 라우팅 주소는 /api 폴더 아래 물리적 폴더명과 파일명으로 라우팅 주소가 설정된다.
 * 호출 주소: http://localhost:3000/api/article
 *   ->제공 기능: 게시글 정보 관리 REST API 기능 제공 모듈 /api/article로 접근하면 index.tsx가 실행된다.
 * 
 */

// NextApiRequest 타입은 웹브라우저에서 서버로 전달되는 각종 정보를 추출하는 HttpRequest 객체 = req
// NextApiResponse 타입은 서버에서 웹브라주우저로 전달하는 응답처리를 위한 HttpResponse 객체 = res
import type { NextApiRequest, NextApiResponse } from "next";

import { IArticle } from "@/interfaces/article";

// 서버에서 웹브라우저로 반환하는 처리 결과 데이터 타입
type ResponseData = {
    code: number;
    data: string | IArticle[] | IArticle | null;
    message: string;
};

// 해당 업무(Hello)에 대한 CRUD 처리를 위한 RESTful API 기능 구현 핸들러 함수
// 하나의 함수로 해당 업무의 모든 라우팅 방식을 통합해서, 기능을 제공하는 통합 라우팅 함수
// -> 모든 요청 방식을 처리. 코드가 지저분해질 수 있음.
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {
    // API 호출 기본 결과 값 설정
    let apiResult: ResponseData = {
        code: 400,
        data: null,
        message: "Bad Request",
    }

    try {
        /*
         * 클라이언트에서 GET 방식으로 요청해오는 경우 처리
         * 호출 주소: http://loxcalhost:3000/api/article
         * 호출 방식: GET
         * 호출 결과: 게시글 전체 목록 데이터 반환
         */
        if (req.method == 'GET') {
            // Step1-1: 로직 구현
            const articles: IArticle[] = [
                {
                    id: 1,
                    title: '게시글 제목1',
                    contents: '게시글 내용1',
                    view_cnt: 0,
                    ip_address: '',
                    create_at: Date.now().toString(),
                    create_member_id: 1
                },
                {
                    id: 2,
                    title: '게시글 제목2',
                    contents: '게시글 내용2',
                    view_cnt: 0,
                    ip_address: '',
                    create_at: Date.now().toString(),
                    create_member_id: 2
                }
            ];

            // Step2: API 호출 결과 설정
            apiResult.code = 200;
            apiResult.data = articles;
            apiResult.message = "Success";
        }

        /*
         * 클라이언트에서 POST 방식으로 요청해오는 경우 처리
         * 호출 주소: http://loxcalhost:3000/api/article
         * 호출 방식: POST
         * 호출 결과: 게시글 전체 목록 데이터 반환
         */
        if (req.method == 'POST') {
            // Step1-2: 프론트엔드에서 전달해주는 데이터 추출
            const title: string = req.body.title;
            const contents: string = req.body.contents;
            const create_member_id: number = req.body.member_id;
            
            // Step2: DB 저장 처리
            const article = {
                id: 1,
                title,
                contents,
                view_cnt: 0,
                ip_address: '',
                create_at: Date.now().toString(),
                create_member_id
            };

            // Step3: API 호출 결과 설정
            apiResult.code = 200;
            apiResult.data = article;
            apiResult.message = "Success";
        }

    } catch (error) {
        // API 호출 결과 설정
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.message = "Server Error";
        
    }

    res.json(apiResult);
}
