/*
 * 라우팅 주소는 /api 폴더 아래 물리적 폴더명과 파일명으로 라우팅 주소가 설정된다.
 * 호출 주소: http://localhost:3000/api/hello
 */

// NextApiRequest 타입은 웹브라우저에서 서버로 전달되는 각종 정보를 추출하는 HttpRequest 객체 = req
// NextApiResponse 타입은 서버에서 웹브라주우저로 전달하는 응답처리를 위한 HttpResponse 객체 = res
import type { NextApiRequest, NextApiResponse } from "next";

// 서버에서 웹브라우저로 반환하는 처리 결과 데이터 타입
type ResponseData = {
  code: number;
  data: string | null;
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
    // 클라이언트에서 GET 방식으로 요청 시
    if (req.method == 'GET') {
      // Step1: 로직 구현

      // Step2-1: API 호출 결과 설정
      apiResult.code = 200;
      apiResult.data = "GET: Hello World!";
      apiResult.message = "Success";
    }

    // 클라이언트에서 POST 방식으로 요청 시
    if (req.method == 'POST') {
      // Step1: 로직 구현

      // Step2-1: API 호출 결과 설정
      apiResult.code = 200;
      apiResult.data = "POST: Hello World!";
      apiResult.message = "Success";
    }

  } catch (error) {
    // Step2-2: API 호출 결과 설정
    apiResult.code = 500;
    apiResult.data = null;
    apiResult.message = "Server Error";
  }

  res.json(apiResult);
}
