/*
 * 호출 주소: http://localhost:3000/api/geminibot
 * Google LLM Gemini 챗봇 구현
 * npm install @langchain/google-genai
 */

// NextApiRequest 타입은 웹브라우저에서 서버로 전달되는 각종 정보를 추출하는 HttpRequest 객체 = req
// NextApiResponse 타입은 서버에서 웹브라주우저로 전달하는 응답처리를 위한 HttpResponse 객체 = res
import type { NextApiRequest, NextApiResponse } from "next";

// 프론트엔드로 반환할 메시지 데이터 타입 참조
import { IMemberMessage, UserType } from "@/interfaces/message";

// Google Gemini LLM 객체 참조
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

// Gemini 기반 RAG 구현 시 사용할 수 있는 구글 임베딩 모델 참조
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

// 시스템, 휴먼 메시지 객체 참조
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

// 프롬프트 템플릿 참조
import { ChatPromptTemplate } from '@langchain/core/prompts';

// LLM 응답메시지 타입을 원하는 타입결과물로 파싱(변환)해주는 output_parsers 참조
// StringOutputParser는 AIMessage타입에서 content 속성 값만 문자열로 반환해주는 파서
import { StringOutputParser } from "@langchain/core/output_parsers";

// 서버에서 웹브라우저로 반환하는 처리 결과 데이터 타입
type ResponseData = {
    code: number;
    data: string | IMemberMessage | null;
    message: string;
};

// 해당 업무(Hello)에 대한 CRUD 처리를 위한 RESTful API 기능 구현 핸들러 함수
// 하나의 함수로 해당 업무의 모든 라우팅 방식을 통합해서, 기능을 제공하는 통합 라우팅 함수
// -> 모든 요청 방식을 처리. 코드가 지저분해질 수 있음.
export default async function handler(
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
         * 클라이언트에서 POST 방식으로 요청해오는 경우 처리
         * 호출 주소: http://localhost:3000/api/geminibot
         * 호출 방식: POST
         */
        if (req.method == 'POST') {
            // Step1: 프론트엔드에서 전달해주는 사용자 프롬프트 데이터 추출
            const nickname: string = req.body.nickname; // 사용자 대화명
            const message: string = req.body.message; // 사용자 입력 메시지

            // Step2: LLM 모델 생성
            const geminiLLM = new ChatGoogleGenerativeAI({
                modelName: 'gemini-pro',
                maxOutputTokens: 2048,
                // apiKey: process.env.GOOGLE_API_KEY // ??
            });

            // ! Case1: Simple Gemini 챗봇 실행
            // const response = await geminiLLM.invoke(message);
            // console.log('Gemini Bot Response:', response);

            // ! Case2: 프롬프트 템플릿과 OutputParser 적용
            const outputParser = new StringOutputParser();
            const prompt = ChatPromptTemplate.fromMessages(
                [
                    ['system', '당신은 세계적으로 유명한 여행 작가입니다.'],
                    ['user', '{input}']
                ]
            );

            const chain = prompt.pipe(geminiLLM).pipe(outputParser);
            const resultMessage = await chain.invoke({ input: message });
            
            // Step3: 프론트엔드로 반환되는 메시지 데이터 생성
            const resultMsg: IMemberMessage = {
                user_type: UserType.BOT,
                nickname: 'bot',
                message: resultMessage, // Case1: response.content as string
                send_date: new Date()
            };

            // Step8: API 호출 결과 설정
            apiResult.code = 200;
            apiResult.data = resultMsg;
            apiResult.message = "Success";
        }

    } catch (error) {
        const resultMsg: IMemberMessage = {
            user_type: UserType.BOT,
            nickname: 'bot',
            message: '검색 결과가 존재하지 않습니다.',
            send_date: new Date()
        };

        // API 호출 결과 설정
        apiResult.code = 500;
        apiResult.data = resultMsg;
        apiResult.message = "Server Error";
    }

    res.json(apiResult);
}