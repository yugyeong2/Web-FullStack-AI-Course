// base1.js 모듈 내 odd, even 상수 참조
const { odd, even } = require('./base1');
// base2.js 모듈 내 checkOddOrEven 함수 참조
const checkOddOrEven = require('./base2'); // 하나니까 중괄호 안해도 됨

// 문자열을 던져 문자열의 길이가 홀수인지, 짝수인지 체크해서 홀짝 문자열을 반환
function checkStringOddOrEven(str) {
    if(str.length % 2) {
        // 문자열의 길이를 2로 나눈 나머지 값이 1이면 홀수 반환
        return odd;
    } else {
    // 문자열의 길이를 2로 나눈 나머지 값이 0이면 짝수 반환
        return even;
    }
}

// base2.js 모듈 내의 checkOddOrEven 노출함수를 재사용한다.
console.log("숫자에 대한 홀짝 체크1:", checkOddOrEven(10)); // 짝수
console.log("숫자에 대한 홀짝 체크2:", checkOddOrEven(5)); // 홀수

// 홀짝 문자열 상수를 출력할 때 base1.js 모듈 내의 odd, even상수를 참조해 재사용한다.
console.log("문자열 길이에 대한 홀짝 체크1:", checkStringOddOrEven('안녕')); // 짝수
console.log("문자열 길이에 대한 홀짝 체크2:", checkStringOddOrEven('안녕하세요')); // 홀수


// => 모듈을 분리해서 필요한 곳에서 참조해사 사용