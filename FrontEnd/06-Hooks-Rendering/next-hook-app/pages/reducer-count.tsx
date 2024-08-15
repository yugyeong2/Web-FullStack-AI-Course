// useReducer 훅을 이용한 데이터 관리
import { useReducer } from 'react';

// 재사용 가능한 Reducer 함수와 관련 타입 참조
import { CountActionType } from '@/interface/common';
import { countReducer } from '@/utils/reducers';


// // 카운트 상태값 로직 처리 유형 열거형 정의
// enum CountActionType {
//     PLUS = 'plus',
//     MINUS = 'minus',
//     INIT = 'init'
// }

// // action 타입 정의
// interface ActionType {
//     type: CountActionType;
// }


// 방법 1)
// Reducer 함수 정의
// Reducer함수(관리하는 상태값 매개변수, 로직처리 타입)
// function countReducer(state: number, action: string): number {
//     // 처리 로직 유형에 따른 비즈니스 로직 처리 후, 관리하는 상태 값 반환
//     // 기본값은 현재 상태값 반환
//     switch (action) {
//         case 'plus':
//             return state + 1;
//         case 'minus':
//             return state - 1;
//         case 'init':
//             return 0;
//         default:
//             return state;
//     }
// }


// 방법 2)
// function countReducer(state: number, action: ActionType): number {

//     // 비구조화 할당
//     const { type } = action;

//     switch (type) {
//         case CountActionType.PLUS:
//             return state + 1;
//         case CountActionType.MINUS:
//             return state - 1;
//         case CountActionType.INIT:
//             return 0;
//         default:
//             return state;
//     }
// }


// 방법 3) Interface와 Reducer 분리
const ReducerCount = () => {

    // useReducer 훅 생성
    // useReducer(Reducer함수 -> 재사용/통합 로직처리 함수, 초기 데이터값);
    // useReducer() 함수는 관리하는 상태값과 해당 Reducer 함수를 호출하는 대신 Dispatch 함수를 반환한다.
    // Dispatch의 의미는 이벤트 발생 시 해당 이벤트를 처리해주는 함수를 의미한다.
    // Dispatch 함수명은 임의로 지정한다. Ex) [data, dispatchData]
    // ! UI 이벤트가 발생 -> Dispatch 함수 호출 -> Reducer 함수 실행 -> 상태 값이 변경된다. -> 화면이 변경된 값으로 렌더링된다.
    // useState로 구현하면 하나 하나 다 구현해야 하지만, useReducer로 구현하면 통합하여 타입별로 괸라할 수 있다.
    const [count, dispatchCount] = useReducer(countReducer, 100);

    return (
        <div>
            {/* Count page 현재 카운트 값 표시 영역 */}
            <div className='text-center mt-4'>
                <h1 className='text-lg'>{count}</h1>
            </div>

            {/* 카운트 값 증감/초기화 버튼 영역 */}
            <div className='text-center mt-4'>
                <button
                onClick={() => dispatchCount({ type: CountActionType.PLUS })} // action 값 지정
                className='ml-3 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
                    증가
                </button>

                <button
                onClick={() => dispatchCount({ type: CountActionType.MINUS })}
                className='ml-3 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
                    감소
                </button>

                <button
                onClick={() => dispatchCount({ type: CountActionType.INIT })}
                className='ml-3 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
                    초기화
                </button>
            </div>
        </div>
    );
}

export default ReducerCount;