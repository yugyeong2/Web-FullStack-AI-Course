/*
 * 호출 주소: http://localhost:3000/api/pdfbot
 * PDF 파일 정보기반 RAG 챗봇 구현하기
 * PDF 파일 내 텍스트 추출을 위한 npm i pdf-parse 설치 필요
 */

// NextApiRequest 타입은 웹브라우저에서 서버로 전달되는 각종 정보를 추출하는 HttpRequest 객체 = req
// NextApiResponse 타입은 서버에서 웹브라주우저로 전달하는 응답처리를 위한 HttpResponse 객체 = res
import type { NextApiRequest, NextApiResponse } from "next";

// 프론트엔드로 반환할 메시지 데이터 타입 참조
import { IMemberMessage, UserType } from "@/interfaces/message";

// OpenAI LLM 서비스 객체 참조
import { ChatOpenAI } from '@langchain/openai';

// PDF 파일 로더 참조: 서버(프로젝트) 내의 물리적 파일 존재 시 사용
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';

// Web 사이트 상에 존재하는 pdf 파일 로드 참조
// import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';

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

// Rag 체인과 LLM 생성을 위한 모듈 참조
// LangChain Hub는 일종의 오픈소스 저장소처럼 LangChain에 특화된 각종 RAG 전용 프롬프트 템플릿을 제공
// 각종 RAG 전용 프롬프트 템플릿이 제공되며, HUB와 통신하기 위해 pull 객체를 참조한다. (pull로 땡겨오기)
import { pull } from 'langchain/hub';

// LLM 모델에 RAG기반 체인 생성 클래스 참조
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';


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
         * 호출 주소: http://localhost:3000/api/pdfbot
         * 호출 방식: POST
         */
        if (req.method == 'POST') {
            // Step1: 프론트엔드에서 전달해주는 사용자 프롬프트 데이터 추출
            const nickname: string = req.body.nickname; // 사용자 대화명
            const message: string = req.body.message; // 사용자 입력 메시지

            // Step2: LLM 모델 생성
            const llm = new ChatOpenAI({
                model: 'gpt-4o',
                temperature: 0.2,
                apiKey: process.env.OPENAI_API_KEY,
            });

            // Step3-1: Indexing - PDF 파일 Indexing 과정의 document load 과정
            const loader = new PDFLoader('pdf/Manual.pdf', {
                parsedItemSeparator: ''
            });

            // PDF 파일 내 페이지 하나당 문서 하나가 생성된다.(docs 내 doc-pdf page 1개)
            const docs = await loader.load();

            // Step3-2: Splitting - 문서 내 문장을 Splitting(Chunk화) 처리 (Chunk: 분리된 문자의 단위)
            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200
            });

            // PDF document를 지정한 splitter로 단어 단위로 쪼갠 집합을 생성
            const splitDocs = await splitter.splitDocuments(docs);
            
            // Step3-3: Embedding - Splitting된 문서 내 단어들을 임베딩(백터화) 처리하여, 메모리 벡터 저장소에 저장
            // MemoryVectorStore.fromDocument(임베딩된 문서, 임베딩 처리기);
            // 지정한 임베딩 모델을 통해 Chunk data를 개별 Vector로 수치화하고, 수치화된 데이터를 지정한 Vector 전용 저장소에 저장한다.
            // -> LLM에도 동일한 임베딩 모델을 적용해야 정확한 검색이 가능하다.
            const vectorStore = await MemoryVectorStore.fromDocuments(
                splitDocs,
                new OpenAIEmbeddings()
            );

            // Step4: Query를 통해 벡터 저장소에서 사용자 질문과 관련된 검색 결과 조회
            // 메모리 벡터 저장소에서 사용자 질문으로 Query를 수행
            // vector 저장소 기반 검색기 변수 정의
            const retriever = vectorStore.asRetriever();
            const searchResult = await retriever.invoke(message);
            console.log('벡터 저장소 쿼리 검색 결과:', searchResult);

            // Step5: RAG 전용 Chain 생성
            // createStuffDocumentsChain()은 LLM 모델에 RAG 기반 검색 결과를 전달가능한 프롬프트 사용 체인 생성
            // RAG 조회 결과를 포함한 전용 프롬프트 체인 생성

            // LangChain Hub를 통해 공유된 RAG 전용 프롬프트 템플릿 참조 생성
            const ragPrompt = await pull<ChatPromptTemplate>('rlm/rag-prompt');

            const ragChain = await createStuffDocumentsChain({
                llm: llm,
                prompt: ragPrompt,
                outputParser: new StringOutputParser()
            });

            // Step6: RAG기반 LLM 질문
            // LLM Chain을 실행하고, 실행 시 벡터저장소 검색 결과를 추가로 전달해서 LLM을 실행한다.
            const resultMessage = await ragChain.invoke({
                question: message, // 사용자 질문
                context: searchResult, // 사용자 질문 결과 벡텨저장소 RAG 검색 결과 값
            });

            // Step7: 프론트엔드로 반환되는 메시지 데이터 생성
            // -> 사용자가 입력한 메시지를 챗봇이 받아서 처리한 결과 메시지를 반환
            const resultMsg: IMemberMessage = {
                user_type: UserType.BOT,
                nickname: 'bot',
                message: resultMessage,
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