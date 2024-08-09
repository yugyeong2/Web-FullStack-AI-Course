function add1(a, b) {
    return a + b;
}
function add2(a, b) {
    console.log("결과 값:", a + b);
}
// 항상 타입을 지정한다.
var result = add1(10, 10);
var data1 = 20;
var data2 = 30;
add2(data1, data2);
// 일반함수: function 함수명(){}
function greeting1(name) {
    return "\uC77C\uBC18\uD568\uC218: \uC548\uB155\uD558\uC138\uC694. ".concat(name, "\uB2D8!");
}
// 익명함수
var greeting2 = function (name) {
    return "\uC775\uBA85\uD568\uC218: \uC548\uB155\uD558\uC138\uC694. ".concat(name, "\uB2D8!");
};
// 화살표함수
var greeting3 = function (name) {
    return "\uD654\uC0B4\uD45C\uD568\uC218: \uC548\uB155\uD558\uC138\uC694. ".concat(name, "\uB2D8!");
};
console.log(greeting1("박유경"));
console.log(greeting2("박유경"));
console.log(greeting3("박유경"));
// Default 값 지정 가능
// 선택적(optional) 속성/변수 선언: 해당 값을 반드시 전달할 필요는 없다.
function greet(name, msg) {
    if (name === void 0) { name = "Guest"; }
    if (msg) {
        return "".concat(name, "\uB2D8, ").concat(msg);
    }
    else {
        return "\uC548\uB155\uD558\uC138\uC694. ".concat(name, "\uB2D8!");
    }
}
console.log(greet());
console.log(greet("박유경"));
console.log(greet("박유경", "좋은 하루 보내세요:)"));
