// 변수별 타입을 지정하고, 값을 할당한다.

var memberName:string = "박유경";
let age:number = 30;
let price:number = 5000;
const isMale:boolean = false;

let totalPayPrice:number = 0;

function showTotalPayPrice(totalPayPrice:number, count:number):void {
    totalPayPrice = price * count;
    console.log(`totalPayPrice: ${totalPayPrice}`);
}

console.log("사용자명:", memberName);
console.log("나이:", age);
console.log("가격:", price);
console.log("성별:", isMale);

showTotalPayPrice(price, 2);