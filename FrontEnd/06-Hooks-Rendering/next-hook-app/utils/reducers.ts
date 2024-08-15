import { CountActionType, ActionType } from '@/interface/common';

// 재사용 가능한 카운터 Reducer 함수 정의
export function countReducer(state: number, action: ActionType): number {
    const { type } = action;

    switch (type) {
    case CountActionType.PLUS:
        return state + 1;
    case CountActionType.MINUS:
        return state - 1;
    case CountActionType.INIT:
        return 0;
    default:
        return state;
    }
}

// 기타 등등 리듀서 함수 추가 가능