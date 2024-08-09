// ! 값을 제한하는 방법 1
// genderType 변수는 반드시 Male과 Female 두 개의 문자열 값 중 하나로 제한한다.
// 변수 선언 시 특정 값으로 변수에 할당되는 값들의 범위를 제한할 수 있다.
var genderType; // 타입 정의
// 변수 선언 시 정의한 특정 값의 범위를 벗어난 값은 할당 불가
genderType = "Female"; // 값 할당
// user라는 JSON 데이터를 생성하여 객체 변수 user 객체 변수에 할당
var user = {
    name: "yugyeong",
    age: 22,
    userType: "admin",
    address: {
        city: "청주",
        country: "대한민국"
    },
    // nother: "되나?" // 안됨
};
// 함수를 만들고, 함수의 반환값을 특정 값으로 제약
function getUserType(user) {
    if (user.userType === "admin") {
        return 1;
    }
    else {
        return 2;
    }
}
getUserType(user);
// -------------------------------------------------------
// ! 값을 제한하는 방법 2
// 열거형
// 특정 값의 범위를 상수처럼 한 번 할당해서 값의 범위를 제약한다.
var DisplayType;
(function (DisplayType) {
    DisplayType[DisplayType["NoneDisplay"] = 0] = "NoneDisplay";
    DisplayType[DisplayType["Display"] = 1] = "Display";
})(DisplayType || (DisplayType = {}));
;
// 1: 게시, 0: 게시하지 않음
var displayCode = 1;
var display = displayCode; // 형변환
var displayTestCode = 1; // 숫자를 직접적으로 쓰는 것은 별로 좋지 않다.
var displayTestCode1 = DisplayType.NoneDisplay;
var displayCode0 = DisplayType.NoneDisplay; // Best
var displayCode1 = DisplayType.Display;
// 열거형을 정의하여 사용하는 주요 목적은 코드성 데이터를 소스 내에 직접 박아서 사용하는 것이 좋지 않기 때문에,
// 반복적으로 또는 값의 범위가 제한되어 있는 데이터를 enum 타입을 이용해 값의 설명과 실제값을 표시하여 사용한다.
if (display === DisplayType.Display) { // ==은 값만 체크, ===은 값과 타입까지 체크
    console.log("해당 게시글은 현재 게시 상태입니다.");
}
// 회원가입 시 SNS로 가입한 경우, 시스템에서 제공하는 SNS 가입 유형 코드를 관리
var SNSTypes;
(function (SNSTypes) {
    SNSTypes["None"] = "";
    SNSTypes["Facebook"] = "F";
    SNSTypes["Instagram"] = "I";
    SNSTypes["Twitter"] = "T";
})(SNSTypes || (SNSTypes = {}));
;
// enum 타입은 실제 값을 할당하지 않으면, 0부터 시작하는 숫자 값이 자동으로 할당된다.
var EntryState;
(function (EntryState) {
    EntryState[EntryState["Inactive"] = 0] = "Inactive";
    EntryState[EntryState["Active"] = 1] = "Active";
    EntryState[EntryState["Pending"] = 2] = "Pending"; //  = 2
})(EntryState || (EntryState = {}));
;
var MemberTypes;
(function (MemberTypes) {
    MemberTypes[MemberTypes["Admin"] = 2] = "Admin";
    MemberTypes[MemberTypes["User"] = 1] = "User";
    MemberTypes[MemberTypes["Guest"] = 0] = "Guest";
})(MemberTypes || (MemberTypes = {}));
;
var snsTypeCode = "F";
var member = {
    id: 1,
    email: "test@test.ac.kr",
    password: "aIjgoytrefslkjmzdvgko",
    snsType: snsTypeCode, // 값을 직접 넣는 것보다 형변환읠 해서 넣는 게 더 좋다.
    entryState: EntryState.Active,
    memberType: MemberTypes.Admin
};
var state = "open";
console.log("state:", state);
var oddNumber = 3;
console.log("oddNumber:", oddNumber);
