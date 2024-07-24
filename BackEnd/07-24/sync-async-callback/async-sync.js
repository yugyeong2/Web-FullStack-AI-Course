// < 자바스크립트/노드 언어의 기본 특성 >
// 1. 자바스크립트/노드는 기본적으로 비동기 프로그래밍 방식으로 작동된다.

// task1
function fn1() {
    console.log("--------fn1--------");
}

// task2
function fn2(cbFunction) {
    // 3초 후에 실행되는 fn2()
    setTimeout(function() {
        console.log("--------fn2--------");
        // 여기서 fn3를 명시적으로 호출해도 동기 방식으로 순서대로 실행된다.
        // fn3()
        cbFunction()        
    }, 3000)
}

function fn3() {
    console.log("--------fn3--------");
}


// 비동기 방식
// 전체 처리 로직 순서: fn1() -> fn3() -> fn2
// 처리 순서와 상관없이 먼저 실행되는 함수부터 실행된다.
fn1();
fn2();
fn3();


// 콜백함수를 이용한 동기 방식 프로그래밍 적용
// 동기 방식: fn1() -> fn2() -> fn3()
// 호출 순서대로 fn1 로직이 끝나고, fn2 로직이 끝나고, fn3 로직이 끝나도록 콜백함수(함수 내에서 함수를 호출하는 방식)를 구현
fn1();
fn2(fn3);
// 함수를 익명함수로 직접 전달해도 된다.
// fn2(function() {
//     console.log("--------fn3--------");
// })


// => 콜백지옥을 방지하기 위해 function 키워드 대신 async 키워드를 사용하여 동기 방식을 구현한다.