const user1 = {
    id: 1,
    name: "박유경1",
    email: "test1@test.co.kr",
    telephone: "010-1234-5678"
};


/* 
 ! 객체 타입을 정의하는 방법 1 : Interface
 ! 일반적인 현업 코딩 컨벤션(코딩 규칙)으로, 주로 JSON 데이터와 같은 data 객체들을 인터페이스로 타입을 정의하는 편이다.
 */
// 일반적인 현업 코딩 컨벤션(코딩 규칙)으로,
interface User {
    id: number;
    name: string;
    email: string;
    telephone?:string; // 선택적 속성 타입으로 정의(값이 전달되지 않아도 OK)
}

let user2: User = {
    id: 2,
    name: "박유경2",
    email: "test2@test.co.kr",
};


// ! 객체 타입을 정의하는 방법 2 : Type Alias
type UserType = {
    id: number;
    name: string;
    email: string;
    telephone?:string;
};

let user3: UserType = {
    id: 3,
    name: "박유경3",
    email: "test3@test.co.kr",
};

console.log("Object:", user1);
console.log("Interface:", user2);
console.log("Type Alias:", user3);