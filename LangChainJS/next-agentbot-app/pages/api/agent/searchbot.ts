/*
 * 호출 주소: http://localhost:3000/api/agent/searchbot
 * 검색엔진 Agent 챗봇 구현하기
 * 검색엔진 서비스로 Tavily(타빌리) Agent 서비스를 이용해, 최신 검색 결과기반 응답 챗봇을 구현한다.
 */

// NextApiRequest 타입은 웹브라우저에서 서버로 전달되는 각종 정보를 추출하는 HttpRequest 객체 = req
// NextApiResponse 타입은 서버에서 웹브라주우저로 전달하는 응답처리를 위한 HttpResponse 객체 = res
import type { NextApiRequest, NextApiResponse } from "next";

// 타빌리 Agent 검색 서비스 조회 결과 객체 참조
// 타빌리 Agent는 @langchain/community/tools에 기본 포함되어 제공해주는 Agent로 @langchain/community 패키지를 설치했으면 바로 사용 가능
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

// 프론트엔드로 반환할 메시지 데이터 타입 참조
import { IMemberMessage, UserType } from "@/interfaces/message";

// OpenAI LLM 서비스 객체 참조
import { ChatOpenAI } from '@langchain/openai';

// 시스템, 휴먼 메시지 객체 참조
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

// 프롬프트 템플릿 참조
import { ChatPromptTemplate } from '@langchain/core/prompts';

// LLM 응답메시지 타입을 원하는 타입결과물로 파싱(변환)해주는 output_parsers 참조
// StringOutputParser는 AIMessage타입에서 content 속성 값만 문자열로 반환해주는 파서
import { StringOutputParser } from "@langchain/core/output_parsers";

// 챗봇 과의 대화이력 정보 관리를 위한 메모리 기반 InMemoryChatMessageHistory 객체 참조
import { InMemoryChatMessageHistory } from '@langchain/core/chat_history';

// 대화 이력 관리를 위한 세부 주요 객체 참조
import { RunnableWithMessageHistory, RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import { ChatMessageHistory } from 'langchain/memory';


// 서버에서 웹브라우저로 반환하는 처리 결과 데이터 타입
type ResponseData = {
    code: number;
    data: string | IMemberMessage | null;
    message: string;
};

// 메모리 영역에 실제 대화 이력이 저장되는 전역변수 선언 및 구조정의
// Record<사용자 세션 아이디, InMemoryChatMessageHistory: 사용자별 대화 이력 객체>
// ! -> 사용자별로 대화 이력을 저장해야 하기 때문에, key-value 형태의 Record(스택 구조를 가지는 메모리)가 필요
const messageHistories: Record<string, InMemoryChatMessageHistory> = {};

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
         * 호출 주소: http://localhost:3000/api/agent/searchbot
         * 호출 방식: POST
         */
        if (req.method == 'POST') {
            // Step1: 프론트엔드에서 전달해주는 사용자 프롬프트 데이터 추출
            const nickname: string = req.body.nickname; // 사용자 대화명
            const prompt: string = req.body.message; // 사용자 입력 메시지

            // Step2: LLM 모델 생성
            const llm = new ChatOpenAI({
                model: 'gpt-4o',
                apiKey: process.env.OPENAI_API_KEY,
            });


            // ! Step3: 타빌리 검색엔진 Tool 기반 조회
            const searchTool = new TavilySearchResults();

            // 검색엔진 타빌리에 사용자 질문을 전달하고 응답값을 반환받는다.
            const searchResult = await searchTool.invoke(prompt);

            // 타빌리 조회 결과 값은 JSON 문자열 포맷으로 제공되므로, JSON 객체로 
            const searchJSONResult = JSON.parse(searchResult);

            // 외부 Agent Tool을 사용하는 경우, 반환값 타입을 정확히 확인해볼 필요가 있다!
            console.log('Tavily Search Result:', searchResult);
            console.log('\nTavily jsonData:', searchJSONResult);


            // Step4: 프론트엔드로 반환되는 메시지 데이터 생성
            // -> 사용자가 입력한 메시지를 챗봇이 받아서 처리한 결과 메시지를 반환
            const resultMsg: IMemberMessage = {
                user_type: UserType.BOT,
                nickname: 'bot',
                message: searchJSONResult[0].content,
                send_date: new Date()
            };

            // Step5: API 호출 결과 설정
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
