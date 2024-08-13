import { useState } from 'react';

// 컴포넌트 공통 타입 참조하기
import { TodoType, TodoInterface } from '@/interface/todo';

import TodoTemplate from '../components/todo-template';
import TodoRegister from '../components/todo-register';
import TodoList from '@/components/todo-list';

const Todo = () => {
    // 단일 할일정보 상태정의 및 초기화
    const [todo, setTodo] = useState<TodoType>({
        title: '',
        desc: '',
        selected: false,
    });

    // 할일목록 상태 정의및 초기화
    const [todoList, setTodoList] = useState<TodoType[]>([]);

    // 할일등록 텍스트박스 변경이벤트 처리함수
    const todoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTodo({ ...todo, title: e.target.value });
    };

    // 단일 할일정보 저장 이벤트 처리함수
    const onSave = () => {
        // 할일목록에 신규 할일객체 추가하기
        setTodoList([...todoList, todo]);
    };

    // 할일목록 삭제하기
    const removeItem = (index: number) => {
        const filteredTodoList = todoList.filter(
        (item: TodoType, i: number) => i !== index,
        );
        setTodoList(filteredTodoList);
    };

    return (
        <TodoTemplate>
        <TodoRegister todo={todo} todoChange={todoChange} onSave={onSave} />
        <TodoList todoList={todoList} removeItem={removeItem} />
        </TodoTemplate>
    );
};

export default Todo;