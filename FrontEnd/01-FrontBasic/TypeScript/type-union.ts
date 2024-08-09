let productCode: string | number = "10000";
productCode = 20000;
// => 가능

// -------------------------------------------------------------

// 파라미터로 숫자/문자 모두 지원하는 함수
function getCode(code: number | string):string {
    // 파라미터로 전달된 code의 데이터 타입이 숫자형이면 문자로 변환하고,
    // 문자열이면 숫자를 반환한다.
    if(typeof code === "number") { // typeof는 변수의 타입을 문자로 반환한다.
        code = "P-" + code.toString(); // toString은 어떤 타입이든 문자열로 반환한다.
    }
    return code;
}

// 숫자 전달
console.log("getCode:", getCode(1000));
// 문자 전달
console.log("getCode:", getCode("P-1000"));

// -------------------------------------------------------------

// 배열내의 값들에 대한 타입을 다양하게 지정하고 제한할 수 있다.
const userData: (string | number | boolean)[] = ["박유경", 22, false];

// type선언자를 이용해 개발자가 원하는 타입을 정의하고 사용할수 있다.
// 특정값으로 데이터 값을 제한할 수 있다.
type ProcessStates = "open" | "closed";

let state: ProcessStates = "open";

// 특정값만 설정할수 있는 type변수에 할당할 수 없는 값을 지정하면 에러 발생
// let state1:ProcessStates = "open1";

type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
let oddNumber: OddNumbersUnderTen = 3;

// 할당할수 없는 값을 지정하면 에러 발생
// let oddNumber2:OddNumbersUnderTen = 2;