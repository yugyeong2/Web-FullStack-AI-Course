// 문자열 배열 전용 랜덤 문자 추출 함수
function getRandomString(list: string[]): string {
    // 전달된 배열 목록에서 랜덤하게 배열 단일 아이템을 반환한다.ㅏ
    const randIndx = Math.floor(Math.random() * list.length); 
    return list[randIndx];
}

// 숫자 배열 전용 랜덤 숫자 추출 함수
function getRandomNumber(list: number[]): number {
    // 전달된 배열 목록에서 랜덤하게 배열 단일 아이템을 반환한다.ㅏ
    const randIndx = Math.floor(Math.random() * list.length); 
    return list[randIndx];
}

const randomString = getRandomString(["A", "B", "C"]);
console.log("문자열 배열에서 랜덤한 문자 추출하기:", randomString);

const randomNumber = getRandomNumber([1, 2, 3]);
console.log("문자열 배열에서 랜덤한 숫자 추출하기:", randomNumber);

// => 유사한 함수라고 하더라도, 특정 타입에 최적화된 함수를 별도로 만들어야 한다.


// 제너릭 타입을 이용한 타입에 제한없이 사용가능한 함수 사용하기
// T: 어떤 타입도 가능하다.
function getRandomElement<T>(list: T[]): T {
    // 전달된 배열 목록에서 랜덤하게 배열 단일 아이템을 반환한다.ㅏ
    const randIndx = Math.floor(Math.random() * list.length); 
    return list[randIndx];
}

type UserType = {
    id: number;
    name: string;
    email: string;
};

const randomElement1 = getRandomElement(["A", "B", "C"]);
console.log("getRandomElement-string:", randomElement1);

const randomElement2 = getRandomElement([1, 2, 3]);
console.log("getRandomElement-number:", randomElement2);

const randomElement3 = getRandomElement([
    { id: 1, name: "사용자1", email: "user1@user.ac.kr" },
    { id: 2, name: "사용자2", email: "user2@user.ac.kr" },
    { id: 3, name: "사용자3", email: "user3@user.ac.kr" },
]);
console.log("getRandomElement-UserType:", randomElement3);