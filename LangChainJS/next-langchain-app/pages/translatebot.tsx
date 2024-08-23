import { useState } from 'react';
import { IMessage, ITransMessage, UserType } from '@/interfaces/message';

const Translatebot = () => {

    // 사용자 입력 채팅 메시지 상태값 정의 및 초기화
    const [message, setMessage] = useState<ITransMessage>({
        role: '사용자 메시지를 영어로 번역해주세요.',
        message: ''
    });

    // 챗봇과의 채팅 이력 상태값 목록 정의 초기화
    // -> 대화 이력을 LLM 자체 시스템에 저장하지 않기 때문에, 메시지 목록을 상태값으로 관리
    const [messageList, setMessageList] = useState<IMessage[]>([]);

    // 매시지 전송 버튼 클릭 시 메시지 백엔드 API 전송
    const messageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 백엔드로 사용자가 메시지를 전송히기 전에 사용
        const userMessage: IMessage = {
            user_type: UserType.USER,
            message: message.message,
            send_date: new Date()
        };

        // 백엔드로 사용자 입력 메시지를 전송하기 전에 사용자 메시지를 메시지 목록에 추가하여,
        // 화면에 사용자 입력 정보를 출력한다.
        // 왜? 여기서?? 현재 WebSocket 기반 실시간 통신이 아니기 때문에, 백엔드에서 두 번의 메시지를 받아줄 수 없기 때문이다.
        setMessageList((prev) => [...prev, userMessage]);

        
        const response = await fetch('/api/bot/translatebot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify( message )
        });

        if (response.status === 200) {
            const result = await response.json();
            setMessageList((prev) => [...prev, result.data]); // prev: 메시지 목록 -> 새로운 메시지 추가
            setMessage({ role: '', message: '' }); // 메시지 초기화
        }
    };

    return (
        <div className='m-4'>
            SimpleBot

            {/* 메시지 압력 전송 영역 */}
            <form className='mt-4' onSubmit={messageSubmit}>
                <div>
                    <input
                    type='text'
                    name='role'
                    value={message.role}
                    placeholder='챗봇의 역할(목적)을 지정해주세요.'
                    onChange={ (e) => { setMessage({ ...message, role: e.target.value }); } }
                    className='block rounded-md w-[300px] border-0 py-1ㄴ pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'
                    />
                </div>

                <div className='flex m-4'>
                    <input
                    type='text'
                    name='message'
                    value={message.message}
                    placeholder='질문을 입력해주세요.'
                    onChange={ (e) => { setMessage({ ...message, message: e.target.value }); } }
                    className='block rounded-md w-[600px] border-0 py-1 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400'
                    />

                    <button
                    type='submit'
                    className='rounded-md bg-indigo-600 px-3 py-2 ml-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                        전송
                    </button>
                </div>
            </form>
            
            {/* 메시지 출력 영역 */}
            <div className='mt-4'>
                <ul>
                    {
                        messageList.map((msg, index) => (
                            <li key={index}>
                                {msg.user_type} : {msg.message}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default Translatebot;