/*
 * 라우팅 주소는 /api 폴더 아래 물리적 폴더명과 파일명으로 라우팅 주소가 설정된다.
 * 호출 주소: http://localhost:3000/api/bot/simplebot
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

// LLM 응답메시지 타입을 원하는 타입결과물로 파싱(변환)해주는 output_parsers 참조
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
         * 호출 주소: http://loxcalhost:3000/api/bot/simplebot
         * 호출 방식: POST
         */
        if (req.method == 'POST') {
            // Step1: 프론트엔드에서 전달해주는 사용자 프롬프트 데이터 추출
            const prompt: string = req.body.message;

            // Step2: LLM 모델 생성
            const llm = new ChatOpenAI({
                model: 'gpt-4o',
                apiKey: process.env.OPENAI_API_KEY,
            });


            // ! Step3: OpenAI LLM 모델 기반 질의/응답 처리
            /*
             * Case 1: 초심플하게 LLM 연동
             */
            // const result = await llm.invoke(prompt);

            /*
             * Case 2: 메시지 객체를 이용해서 llm 연동

             * SystemMessage 객체는 LLM의 역할이나 질문(힌트)에 관련된 주요 정보를 LLM에게 전달하는 역할 제굥
             * HumanMessage 객체는 사용자가 보낸 질문 메시지를 저장해서 LLM에게 전달하는 객체

             * AIMessage가 OutputMessage로 반환된다.
             * input token: 질문할 때 사용한 토큰 수
             * output token: 답변할 때 사용한 토큰 수
            */
            // const messages = [
            //     new SystemMessage('당신은 세계적인 수준의 기술문서 작성자입니다.'),
            //     new HumanMessage(prompt)
            // ];

            // const result = await llm.invoke(messages);
            // console.log('LLM 응답 결과 메시지 타입 확인하기(AIMessage):', result);

            /*
             * Case 3: ChatPromptTemplate을 이용한 프롬프트 전달
             * 프롬프트 템플릿이란? LLM에게 전달할 수 있는 다양한 질문 템플릿을 제공하여,
             * 보다 효율적인 질문 형식을 만들어 LLM에게 제공해 좋은 답변을 만들기 위한 방식 제공
             * 의도: 좋은 질문이 좋은 답변을 만든다.
             */
            // const promptTemplate = ChatPromptTemplate.fromMessages([
            //     ['system', '당신은 뛰어난 실력을 가진 쉐프입니다.'],
            //     ['user', '{input}']
            // ]);

            // // template.pipe(LLM 모델) : chain객체 반환(chain은 처리할 작업의 기본 단위)
            // //chain(처리할 작업)을 여러 개 생성하고, chain을 연결해 로직을 구현하는 방식이 LangChain이다..
            // const chain = promptTemplate.pipe(llm);
            // const result = await chain.invoke({ input: prompt });

            // console.log('LLM 응답 결과 메시지 타입 확인하기(AIMessage):', result);


            // // Step4: 메시지 처리결과데이터 - result가 AIMessage타입인 경우(CASE1~3에 해당하는 경우만)
            // const resultMsg: IMessage = {
            //     user_type: UserType.BOT,
            //     message: result.content as string,
            //     send_date: new Date()
            // };


            /*
             * Case 4: LLM 응답 결과 메시지는 기본 AIMessage 객체를 반환하지만,
             * 해당 타입을 맞춤형 데이터 타입으로 변환해주는 OutParser를 이용해 원하는 포맷으로 변경 가능하다.
             */
            const outputParser = new StringOutputParser();
            const promptTemplate = ChatPromptTemplate.fromMessages([
                ["system", "당신은 근대사 역사학자입니다."],
                ["user", "{input}"],
            ]);

            // template.pipe().pipe(): 두 개의 체인을 만들과 순차적으로 두개의 체인 목록을 가진 결과 체인 반환
            // LLM 모델에 의해 결과 메시지(AIMessage)를 받아 StringOutputParser를 통해 문자열로 변환한 결과 제공
            const chains = promptTemplate.pipe(llm).pipe(outputParser);

            //outputParser로 인해 result값은 실제 llm의 응답메시지 문자열이 반환됨(AIMessage.content)
            const resultMessage = await chains.invoke({ input: prompt });

            // Step4: 메시지 처리 결과 데이터
            const resultMsg: IMessage = {
                user_type: UserType.BOT,
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
