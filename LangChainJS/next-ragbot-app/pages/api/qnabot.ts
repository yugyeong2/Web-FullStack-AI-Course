// 호출 주소: http://localhost:3000/api/qnabot
import type { NextApiRequest, NextApiResponse } from "next";

// 웹페이지 크롤링을 위한 cheerio 패키지 참조
// npm i cheerio
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';

// 텍스트 분할기 참조
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { pull } from 'langchain/hub';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { IMemberMessage, UserType } from '@/interfaces/message';

// API 호출 결과 반환 데이터 타입 정의
type ResponseData = {
    code: number;
    data: string | null | IMemberMessage;
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {

    let apiResult: ResponseData = {
        code: 400,
        data: null,
        message: 'Bad Request',
    };

    try {
        if(req.method == 'POST') {
            const nickname = req.body.nickname;
            const message = req.body.message;

            // Step1: Indexing - 웹페이지 로더 객체를 생성하고, 페이지 로딩
            // Step1-1: 웹페이지 로딩
            const loader = new CheerioWebBaseLoader('https://api.ncloud-docs.com/docs/common-ncpapi');
            const docs = await loader.load();

            // Step1-2: 텍스트 분할기 객체 생성 및 텍스트 분할(Chunk)
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200
            });

            // 텍스트 분할 처리
            const splittedDocs = await textSplitter.splitDocuments(docs);

            // Step1-3: 임베딩(split된 단어를 벡터 데이터화 처리)하고, 벡터 저장소에 저장
            const vectorStore = await MemoryVectorStore.fromDocuments(
                splittedDocs,
                new OpenAIEmbeddings()
            );

            // Step2: 임베딩된 데이터 조회(리트리버)
            // 검색기 생성
            const retriever = vectorStore.asRetriever();
            // 사용자 질문을 이용해 벡터 저장소를 조회하고, 조회 결과를 반환받는다.
            const retrieverResult = await retriever.invoke(message);

            // Step3: RAG 기반(증강된 검색데이터를 통한) LLM 호출
            const gptModel = new ChatOpenAI({
                model: 'gpt-4o',
                temperature: 0.2,
                apiKey: process.env.OPENAI_API_KEY
            });

            // RAG 전용 프롬프트 템플릿 생성
            const ragPrompt = await pull<ChatPromptTemplate>('rlm/rag-prompt');

            // RAG 전용 프롬프트 기반 Chain 생성
            const ragChain = await createStuffDocumentsChain({
                llm: gptModel,
                prompt: ragPrompt,
                outputParser: new StringOutputParser()
            });

            // Chain을 실행하여 RAG 조회 결과를 LLM에 전달하고, 메시지 결과 받아오기
            const resultMessage = await ragChain.invoke({
                question: message,
                context: retrieverResult
            });

            // RESTful API 챗봇 응답 메시지 포멧 정의
            const resultMsg: IMemberMessage = {
                user_type: UserType.BOT,
                nickname: 'Bot',
                message: resultMessage,
                send_date: new Date()
            }

            apiResult = {
                code: 200,
                data: resultMsg,
                message: 'OK',
            }            
        }

    } catch (error) {

        const resultMsg: IMemberMessage = {
            user_type: UserType.BOT,
            nickname: 'Bot',
            message: '검색 결과가 존재하지 않습니다.',
            send_date: new Date()
        }

        apiResult = {
            code: 500,
            data: resultMsg,
            message: 'Internal Server Error',
        }
    }

    res.json(apiResult);
}
