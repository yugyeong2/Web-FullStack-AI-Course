/*
 * 호출 주소: http://localhost:3000/api/agent/pagebot
 * 웹페이지 지식기반 Agent 사용하기
 */

// NextApiRequest 타입은 웹브라우저에서 서버로 전달되는 각종 정보를 추출하는 HttpRequest 객체 = req
// NextApiResponse 타입은 서버에서 웹브라주우저로 전달하는 응답처리를 위한 HttpResponse 객체 = res
import type { NextApiRequest, NextApiResponse } from "next";

// 프론트엔드로 반환할 메시지 데이터 타입 참조
import { IMemberMessage, UserType } from "@/interfaces/message";

// OpenAI LLM 서비스 객체 참조
import { ChatOpenAI } from '@langchain/openai';

// cheerio 웹페이지 크롤링 라이브러리 참조
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';

// 텍스트 스플리터 객체 참조
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

// 임베딩 처리를 위한 OpenAI Embedding 객체 참조
// Embedding(임베딩)이란? 문장 내 단어를 벡터 수치화하는 과정
import { OpenAIEmbeddings } from '@langchain/openai';

// 수치화된 벡터 데이터를 저장할 메모리형 벡터저장소 객체 참조
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

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
         * 호출 주소: http://localhost:3000/api/agent/pagebot
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

            // Step3: cheerio를 이용해 특정 웹페이지 내용을 크롤링
            const loader = new CheerioWebBaseLoader('https://www.freecodecamp.org/news/responsive-design-best-practices/');
            const rawDocs = await loader.load();
            console.log('Cheerio를 통해 로딩한 raw 웹페이지 데이터:', rawDocs);

            // Step4: 텍스트 스플리팅 처리
            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000, // 청크의 크기(1000자)를 설정. 이는 텍스트를 나누는 기준
                chunkOverlap: 200 // 청크가 서로 중복되는 부분(200자)을 설정. 이는 문맥을 유지하며 텍스트를 나누기 위함
            });

            // Splitting된 단어의 집합 문서를 생성
            const docs = await splitter.splitDocuments(rawDocs);
            
            // Step5: Splitting된 문서 내 단어들을 임베딩(백터화) 처리하여, 메모리 벡터 저장소에 저장
            // MemoryVectorStore.fromDocument(임베딩된 문서, 임베딩 처리기);
            const vectorStore = await MemoryVectorStore.fromDocuments(
                docs,
                new OpenAIEmbeddings()
            );

            // Step6: 메모리 벡터 저장소에서 사용자 질문으로 Query를 수행
            // vector 저장소 기반 검색기 변수 정의
            const retriever = vectorStore.asRetriever();
            const searchResult = await retriever.invoke(prompt);

            console.log('벡터 저장소 쿼리 검색 결과:', searchResult);

            // Step7: 프론트엔드로 반환되는 메시지 데이터 생성
            // -> 사용자가 입력한 메시지를 챗봇이 받아서 처리한 결과 메시지를 반환
            const resultMsg: IMemberMessage = {
                user_type: UserType.BOT,
                nickname: 'bot',
                message: searchResult[0].pageContent,
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

////////////////////////////////////////////////////////////////////////////////////////
// and you know? I'm a little bit tired now. I'll take a rest for a while.
// but I'll be back soon. I promise. See you later! Bye! :)
// - LangChainJS Team
// - 2022.02.22. Tue. 01:00 AM
