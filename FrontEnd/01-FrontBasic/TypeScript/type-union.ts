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