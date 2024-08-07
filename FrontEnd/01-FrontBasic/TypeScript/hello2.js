// tsc hello2.ts
// node hello2.js
var userId = 'yugyeong';
var userName = '박유경';
function sayHello(userId, userName) {
    console.log("\uC548\uB155\uD558\uC138\uC694! ".concat(userName, "\uB2D8\uC758 \uC544\uC774\uB514\uB294 ").concat(userId, "\uC785\uB2C8\uB2E4."));
}
sayHello(userId, userName);

// --strictNullChecks 옵션을 추가하면, 변수에 null, undefined를 허용하지 않는다.