/*
 * 라우팅 주소는 /api 폴더 아래 물리적 폴더명과 파일명으로 라우팅 주소가 설정된다.
 * 호출 주소: http://localhost:3000/api/bot/translatebot
 */

// NextApiRequest 타입은 웹브라우저에서 서버로 전달되는 각종 정보를 추출하는 HttpRequest 객체 = req
// NextApiResponse 타입은 서버에서 웹브라주우저로 전달하는 응답처리를 위한 HttpResponse 객체 = res
import type { NextApiRequest, NextApiResponse } from "next";

// 프론트엔드로 반환할 메시지 데이터 타입 참조
import { IMessage, UserType } from "@/interfaces/message";

// OpenAI LLM 서비스 객체 참조
import { ChatOpenAI } from '@langchain/openai';

// 시스템, 휴먼 메시지 객체 참조
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

// 프롬프트 템플릿 참조
import { ChatPromptTemplate } from '@langchain/core/prompts';

// LLM 응답메시지 타입을 원하는 타입 결과물로 파싱(변환)해주는 output_parsers 참조
// StringOutputParser는 AIMessage타입에서 content 속성 값만 문자열로 반환해주는 파서
import { StringOutputParser } from "@langchain/core/output_parsers";

// 서버에서 웹브라우저로 반환하는 처리 결과 데이터 타입
type ResponseData = {
    code: number;
    data: string | IMessage | null;
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
         * 호출 주소: http://loxcalhost:3000/api/bot/translatebot
         * 호출 방식: POST
         */
        if (req.method == 'POST') {
            // Step1: 프론트엔드에서 전달해주는 사용자 프롬프트 데이터 추출
            const role: string = req.body.role;
            const prompt: string = req.body.message;

            // Step2: LLM 모델 생성
            const llm = new ChatOpenAI({
                model: 'gpt-4o',
                apiKey: process.env.OPENAI_API_KEY,
            });

            /*
             * Step3: OpenAI LLM 모델 기반 질의/응답 처리
             * ChatPromptTemplate을 이용한 프롬프트 전달
             * 프롬프트 템플릿이란? LLM에게 전달할 수 있는 다양한 질문 템플릿을 제공하여,
             * 보다 효율적인 질문 형식을 만들어 LLM에게 제공해 좋은 답변을 만들기 위한 방식 제공
             * 의도: 좋은 질문이 좋은 답변을 만든다.
             */
            const promptTemplate = ChatPromptTemplate.fromMessages([
                ['system', role],
                ['user', '{input}']
            ]);

            // template.pipe(LLM 모델) : chain객체 반환(chain은 처리할 작업의 기본 단위)
            // chain(처리할 작업)을 여러 개 생성하고 chain연결해 로직을 구현하는 방식이 LangChain이다.
            const chain = promptTemplate.pipe(llm);
            const result = await chain.invoke({ input: prompt });

            console.log('LLM 응답 결과 메시지 타입 확인하기(AIMessage):', result);

            // Step4: 메시지 처리 결과 데이터 - result가 AIMessage타입인 경우
            const resultMsg: IMessage = {
                user_type: UserType.BOT,
                message: result.content as string,
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
