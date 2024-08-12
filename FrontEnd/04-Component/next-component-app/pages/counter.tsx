// 리액트 로컬 데이터 상태관리 Hook인 useState 훅을 참조
// 각종 Hook은 use라는 접두사를 사용한다.
// UI와 연결시킬 수 있다.
import { useState } from 'react';

function Counter() {
    // 카우늩 상태 값을 관리할 count 변수, setter 함수 생성
    // useState('초기값 정의') 함수가 count, setCount 함수를 반환하여 변수에 할당한다.
    // useState(0) 함수는 배열을 반환하는데, 배열의 비구조화 할당 문법을 통해 반환하는
    const [count, setCount] = useState<number>(0); // 0이 count에 할당

    // count 상태 값 Plus 처리 이벤트 처리기(핸들러) 함수 정의
    const handlePlus = (): void => {
        console.log('Before Press SetCounter:', count);


        // Case 1(Normal Case)
        // count 상태값을 변경하려면 무조건 setCount() 함수를 통해 변경해야 한다.
        // count += 1;
        // setCount(count + 1);

        // Case 2
        // 변경되기 이전의 값을 prevCount라는 매개변수를 통해 추출할 수 있다.
        // setCount((prevCount) => {prevCount + 1});
        // -> 중괄호가 생략된 화살표 함수 형태
        // setCount((prevCount) => prevCount + 1);

        // Case 3
        // setCount(count + 1);를 두 번 연속 호출하면 count 값이 2씩 증가할 것 같지만,
        // 해당 handlePlus 함수 호출이 종료되어야 최종 count 값이 갱신되기 때문에, 몇 번을 호출해도 한 번만 적용된다.
        // setCount(count + 1);
        // setCount(count + 1);

        // Case 4
        // setCount((prevCount) => prevCount + 1);을 연속으로 두 번 호출 시 2씩 증가한다.
        // 2씩 증가하는 이유는 prevCount 값은 실제 변경된 이전 값을 바로 보관하기 때문에,
        // handlePlus 함수가 실행 종료되지 않아도 이전 값에 변경된 값이 보관된다.
        setCount((prevCount) => prevCount + 1);
        setCount((prevCount) => prevCount + 1);


        // ! setter 함수가 실행되는 시점은 소속되어 있는 handlePlus() 함수가 완료된 후에 count의 결과 값이 갱신된다.
        console.log('After Press SetCounter:', count);
    };
    
     // count 상태 값 Minus 처리 이벤트 처리기(핸들러) 함수 정의
    const handleMinus = (): void => {
        // count 상태값을 변경하려면 무조건 setCount() 함수를 통해 변경해야 한다.
        // count -= 1;
        setCount(count - 1);
    };

    // count 상태 값 Init 처리 이벤트 처리기(핸들러) 함수 정의
    const handleInit = (): void => {
        setCount(0);
    };

    return (
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
            <p className="text-[60px] font-semibold text-indigo-600">{count}</p>
            <p className="mt-6 text-base leading-7 text-gray-600">
                버튼을 클릭해 숫자를 증가 또는 감소 시켜보세요.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
                <button onClick={handlePlus} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Plus
                </button>
                <button onClick={handleMinus} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Minus
                </button>
                <button onClick={handleInit} className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Init
                </button>
            </div>
            </div>
        </main>
    );
}

export default Counter;