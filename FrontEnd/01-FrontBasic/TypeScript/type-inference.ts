// 타입 추론 (Type inference)
var memberName = "박유경";
var price = 5000;
var isMale = false;

console.log("회원명은 타입 추론에 의해 문자로 컴파일 시 자동인식됩니다.:", memberName.length);
// console.log("가격은 타입 추론에 의해 숫자로 컴파일 시 자동인식됩니다. price는 string이 아니기 때문에 에러:", price.length);

var user = {
    id:1,
    name:"박유경",
    email:"test@test.co.kr"
};

console.log("user의 타입추론:", user.name.length);
// console.log("user의 타입추론, id는 string이 아니기 때문에 에러:", user.id.length);


function plus(a:number, b:number) { // 반환 타입을 지정하지 않았다.
    return a+b;
}

console.log(plus(1,2));
// console.log("함수의 반환값은 number로 타입 추론했기 때문에, 에러:", plus(1,2).length);