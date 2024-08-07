// tsc hello2.ts
// node hello2.js
const userId:string = 'yugyeong';
const userName:string = '박유경';

function sayHello(userId:string, userName:string):void {
    console.log(`안녕하세요! ${userName}님의 아이디는 ${userId}입니다.`);
}

sayHello(userId, userName);