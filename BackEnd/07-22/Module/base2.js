// base1 모듈을 참조해서 odd, even, test 함수를 참조합니다.

// base1.js export module의 노출 객체를 객체 비구조화 할당 방식으로 변수 odd, even, 함수 test를 참조합니다.
// 객체 비구조 할당을 의미
// const {odd, even, test} = {
//     odd:odd,
//     even:even,
//     test:function() {
//     }
// }
const {odd, even, test} = require('./base1.js');

// 전달되는 숫자가 홀수인지, 짝수인지 체크해서 홀짝 문자열 상수를 반환
// 입력: 숫자, 출력: 문자열
function checkOddOrEven(num) {
    // Ex) num = 10이면, 10%2 = 0이므로 even
    if(num % 2) {
        return odd;
    }
    return even;
}

console.log("base2.js에서 사용하는 base1.js의 test 함수 호출하기", test());

module.exports = checkOddOrEven;
