/*
 * 라우팅 주소는 /api 폴더 아래 물리적 폴더명과 파일명으로 라우팅 주소가 설정된다.
 * 호출 주소: http://localhost:3000/api/bot
 * 대화 이력 기반 챗봇 구현하기
 * 기본적으로 LLM은 사용자와 챗봇 간 대화 이력 데이터를 관리하지 않기 때문에,
 * 대화 중에 발생한 데이터에 대해 물어보면 모르는 상황이 발생한다.
 * 랭체인 / 백엔드 영역에서 대화 이력을 관리하고, 해당 대화이력과 프롬프트를 LLM에게 전달하여 대화 이력 기반 챗봇 구현이 가능하다.
 */

// NextApiRequest 타입은 웹브라우저에서 서버로 전달되는 각종 정보를 추출하는 HttpRequest 객체 = req
// NextApiResponse 타입은 서버에서 웹브라주우저로 전달하는 응답처리를 위한 HttpResponse 객체 = res
import type { NextApiRequest, NextApiResponse } from "next";

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
         * 호출 주소: http://loxcalhost:3000/api/bot
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

            // Step3: OpenAI LLM 모델 기반 질의/응답 처리
            // const result = await llm.invoke(prompt);

            // 챗봇에게 대화이력 기반 채팅을 할 것을 알려주고, 대화 이력정보를 챗봇에게 제공하며
            // 사용자 메시지를 포함한 채팅 전용 템플릿을 생성한다.
            const promptTemplate = ChatPromptTemplate.fromMessages(
                [
                    ['system', '당신은 사용자와의 모든 대화이력을 기억합니다.'],
                    ['placeholder', '{chat_history}'],
                    ['human', '{input}']
                ]
            );

            // LLM OutputParser를 생성
            const outputParser = new StringOutputParser();

            // LLM 모델 Chain 생성(LLM 기본 작업)
            const llmChain = promptTemplate.pipe(llm).pipe(outputParser);

            /*
             * 대화 이력 관리를 위한 Chain 생성(대화 이력 관리 작업)
             * RunnableWithMessageHistory({runnable: llm 모델 정보, getMessageHistory: () => {지정된 사용자의 대화이력 반환}})
             * inputMessagesKey: 사용자 입력 메시지 프롬프트 값 전달, historyMessagesKey: 지정된 사용자의 대화이력 정보를 LLM에게 전달
             */
            const historyChain = new RunnableWithMessageHistory({
                runnable: llmChain,
                // 사용자별 채팅 이력을 구분하기 위해 개별 사용자의 고유번호 sessionId 필요
                getMessageHistory: async (sessionId) => {
                    // 메모리 영역에 해당 세션 아이디의 사용자 대화 이력이 없으면, 대화 이력 관리를 위한 객체 생성
                    if(messageHistories[sessionId] == undefined) {
                        messageHistories[sessionId] = new InMemoryChatMessageHistory();
                    }

                    return messageHistories[sessionId];
                },
                inputMessagesKey: 'input',
                historyMessagesKey: 'chat_history'
            });

            // 사용자 세션 아이디 값 구성
            // 현재 챗봇을 호출한 사용자 아이디 값을 세션 아이디로 설정
            const config = {
                configurable: { sessionId: nickname }
            };


            // ! Case 1) 한방에 LLM 응답 메시지 수신하기
            // 대화 이력 관리 기반 챗봇 LLM 호출
            // historyChain.invoke({input: 사용자 입력 메시지 프롬프트 }, config: 현재 접속한 사용자 정보);
            const resultMessage = await historyChain.invoke({ input: prompt }, config);

            // ! Case 2) LLM 응답 메시지를 스트림 방식으로 전달하기
            // LLM에서 반환된 응답 메시지 문자열을 글자 수 단위로 나누어서 순차적으로 스트리밍(전송)하는 방법 제공
            // LLM 응답 메시지를 스트림 형식으로 전달받기
            // const stream = await historyChain.stream({ input: prompt }, config);
            // let resultMessage = '';
            // for await (const chunk of stream) { // stream에서 꺼내온 chunk
            //     console.log('|', chunk);
            //     resultMessage += chunk; // chunk들을 조합해서 최종 결과 메시지 생성
            // }


            // Step4: 프론트엔드로 반환되는 메시지 데이터 생성
            // -> 사용자가 입력한 메시지를 챗봇이 받아서 처리한 결과 메시지를 반환
            const resultMsg: IMemberMessage = {
                user_type: UserType.BOT,
                nickname: 'bot',
                message: resultMessage,
                send_date: new Date()
            };

            // Step5: API 호출 결과 설정
            apiResult.code = 200;
            apiResult.data = resultMsg;
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
