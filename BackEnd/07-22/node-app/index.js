// 프로젝트에 설치된 노드패키지를 참조합니다.
// node.js BackEnd에서는 require 예약어를 이용해 설치도니 패키지를 참조합니다.
const moment = require('moment');

// 환경설정 파일에서 환경변수를 가져오기 위해 dotenv 패키지를 참조합니다.
const env = require('dotenv');

// 프로젝트 루트에 있는 .env 파일에 환경변수 정보를 CPU 프로세스에서 접근 가능하게 구성해준다.
env.config();


// 대부분의 자바스크립트 오류는 오탈자입니다.
// 초기 자바스크립트 언어 개발 시 문제가 있다면 오탈자/대소문자 문제입니다.
// 자바스크립트는 대소문자를 구분합니다.

// console 객체는 node framework 자체에서 제공하는 내장 객체
// console 객체는 웹브라우저 개발자도구 console의 로그와 다릅니다.
console.log("index.js 모듈이 시작되었습니다.");

var toDate = Date();
var toDate2 = Date.now();

// 순수 자바스크립트 날짜데이터는 기본 숫자형으로 표시됩니다.
console.log("현재 일시를 출력합니다. 순수 자바스크립트 1:", toDate);
console.log("현재 일시를 출력합니다. 순수 자바스크립트 2:", toDate2);

// moment 패키지를 통해 숫자 타입 날짜 데이터 포멧을 변경합니다.
var formattedDate = moment(toDate2).format('YYYY-MM-DD HH:mm:ss');
console.log("formattedDate:", formattedDate);

// 환경변수 중에 DB 주소와 사용자 정보를 조회합니다.
console.log('DB HOST IP: ', process.env.DB_HOST_IP);
console.log('DB USER IP: ', process.env.DB_USER_ID);
