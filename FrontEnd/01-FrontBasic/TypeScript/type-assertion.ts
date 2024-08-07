// Type Assertions(타입 단언)
// any타입: 어느 타입이 와도 괜찮다.(값이 여러 타입으로 바뀔 수 있을 때, 어떤 값인지 모를 때 사용)
// notSure를 any가 아닌 다른 타입으로 변경하면 에러
let notSure: any = 4; // Type is any
notSure = "maybe a string instead"; // Type is any
notSure = false; // Type is any

console.log("notSure:", notSure);

// --------------------------------------------------------

let fullName: any = "Yugyeong Park";

// 변수의 형변환 1
// <타입>변수 -> 변수를 해당 타입으로 형변환한다.
let fullNameLength: number = (<string>fullName).length;

// 변수의 형변환 2
// 변수 as 타입
let fullNameLength2: number = (fullName as string).length;
const companyName = "YugyeongSW" as string;

// => 두 가지 방법의 Assertion 모두 가능하다.

// --------------------------------------------------------

// 인터페이스는 객체의 구조와 속성의 타입을 지정하는 방법을 제공한다.
interface User {
    id: number,
    name: string,
    email:string,
    telephone?:string; // telephone 속성 값은 반드시 입력을 하지 않아도 된다는 선택적 속성을 지정
}

let user = {} as User; // user 변수를 User 타입의 빈 객체로 선언
user.id = 1;
user.name = "yugyeong";
user.email = "test@test.co.kr";

console.log("user:", user);