// 자바스크립트/노드 프로그래밍은 기본적으로 비동기방식으로 작동됩니다.

// 노드 프로그램이 비동기 방식으로 작동되는 것을 눈으로 확인해본다.
// setTimeout() 함수는 특정 시간(초)이 지난 후에 특정 로직이 실행되는 내장함수
var fnSample = function() {
    console.log("fnSample() 함수가 실행됩니다.");
    
    // setTimeout() 함수가 실행되면 4초 후에 내부 로직이 실행된다.
    setTimeout(function() {
        console.log('로직1 실행 완료 - 4s');
    }, 4000);

    // setTimeout() 함수가 실행되면 3초 후에 내부 로직이 실행된다.
    setTimeout(function() {
        console.log('로직2 실행 완료 - 3s');
    }, 3000);

    // setTimeout() 함수가 실행되면 2초 후에 내부 로직이 실행된다.
    setTimeout(function() {
        console.log('로직3 실행 완료 - 2s');
    }, 2000);

    // setTimeout() 함수가 실행되면 1초 후에 내부 로직이 실행된다.
    setTimeout(function() {
        console.log('로직4 실행 완료 - 1s');
    }, 1000);
}


// 비동기 방식으로 작동되는 fnSample() 함수 로직을 돟기 방식(순차적 프로그래밍)으로 수정해본다.
// 순서기반 로직1 -> 로직2 -> 로직3 -> 로직4 순서대로 함수(로그 출력)가 실행되어야 하는 업무 규칙이 있다고 가정해본다.
// 동기 방식 기반으로 작동하는 함수 구현

// => 일반적으로 동기 방식을 구현하기 위해 콜백 함수를 사용하면 콜백 지옥 이슈가 만들어진다.
// 콜백 지옥 이슈를 해결하기 위한 방식으로 자바스크립트에서는 promise/async/await 이라는 키워드를 제공한다.
// 가장 최신의 비동기 방식으로 순차적 프로그래밍을 구현할 수 있는 권장되는 방식은 async/await 방식을 추천한다. (promise는 async/await 방식 바로 이전에 사용하던 방식)

var fnSyncSample = function() {
    console.log("fnSyncSample() 함수가 실행됩니다.");
    
    // 로직1은 setTimeout() 함수가 실행되면 4초 후에 내부 로직이 실행된다.
    setTimeout(function() {
        console.log('로직1 실행 완료 - 4s');
        
        // 로직2 기능 구현
        setTimeout(function() {
            console.log('로직2 실행 완료 - 3s');

            // 로직3
            setTimeout(function() {
                console.log('로직3 실행 완료 - 2s');

                // 로직4
                setTimeout(function() {
                    console.log('로직4 실행 완료 - 1s');
                }, 1000);
            }, 2000);
        }, 3000);
    }, 4000);
}


// 비공기 방식으로 작동되는 fnSample() 함수를 싱행
// 비동기 방식은 동시에 실행되어 로직4 ~ 로직1 순서로 실행 왼료된다.
// 하지만 순서가 필요하다면 동기 방식으로 구현해야 한다.
fnSample();

// 동기 방식으로 순차적 프로그래밍을 하려면, 함수 로직 내에서 다른 함수를 정의/실행하는 방식을 사용하는데(콜백함수), 콜백함수를 계속 사용하면 콜백지옥이 발생한다.
// -> 가독성 저해, 로직이 잘 안보임
fnSyncSample();