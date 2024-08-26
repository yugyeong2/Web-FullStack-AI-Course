import { useState } from 'react';
import { IMemberMessage, UserType, BotType } from '@/interfaces/message';

import moment from 'moment';

const MixBot = () => {

    // ! 챗봇 유형 정의
    const [botType, setBotType] = useState<BotType>(BotType.LLMGPT);

    // 사용자 대화 닉네임 상태 값 정의
    const [nickname, setNickname] = useState<string>('');

    // 사용자 입력 채팅 메시지 상태값 정의 및 초기화
    const [message, setMessage] = useState<string>('');

    // 챗봇과의 채팅 이력 상태값 목록 정의 초기화
    // -> 대화 이력을 LLM 자체 시스템에 저장하지 않기 때문에, 메시지 목록을 상태값으로 관리
    const [messageList, setMessageList] = useState<IMemberMessage[]>([]);

    // 매시지 전송 버튼 클릭 시 메시지 백엔드 API 전송
    const messageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 백엔드로 사용자가 메시지를 전송히기 전에 사용
        const userMessage: IMemberMessage = {
            user_type: UserType.USER,
            nickname: nickname,
            message: message,
            send_date: new Date()
        };

        // 백엔드로 사용자 입력 메시지를 전송하기 전에 사용자 메시지를 메시지 목록에 추가하여,
        // 화면에 사용자 입력 정보를 출력한다.
        // 왜? 여기서?? 현재 WebSocket 기반 실시간 통신이 아니기 때문에, 백엔드에서 두 번의 메시지를 받아줄 수 없기 때문이다.
        setMessageList((prev) => [...prev, userMessage]);

        // 사용자 입력 메시지를 백엔드로 전송
        const response = await fetch('/api/mixbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                nickname,
                message,
                botType
            })
        });

        if (response.status === 200) {
            const result = await response.json();
            setMessageList((prev) => [...prev, result.data]); // prev: 메시지 목록 -> 새로운 메시지 추가
            setMessage(''); // 메시지 초기화
        }
    };

    return (
        <div className="flex h-screen antialiased text-gray-800 mt-3 pb-10">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
            <div className="flex flex-col flex-auto h-full p-6">
                <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                    {/* 메시지 목록 출력영역 */}
                    <div className="flex flex-col h-full overflow-x-auto mb-4">
                        <div className="flex flex-col h-full">
                        <div className="grid grid-cols-12 gap-y-2">
                            {/* 채팅 메시지 목록 */}

                            {
                                messageList.map((message, index) =>
                                    // 메시지 작성자와 현재 로그인한 사용자가 같으면 오른쪽에 출력(사용자)
                                    message.user_type === UserType.USER ? (
                                    <div
                                        key={index}
                                        className="col-start-6 col-end-13 p-3 rounded-lg"
                                    >
                                        <div className="flex items-center justify-start flex-row-reverse">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                            {message.nickname}
                                        </div>
                                        <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                            <div>{message.message}</div>
            
                                            <div className="absolute w-[200px] text-right text-xs bottom-0 right-0 -mb-5 text-gray-500">
                                            {message.nickname} {moment(message.send_date).format('YYYY-MM-DD HH:mm:ss')}
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    ) : (
                                    // 아니면 왼쪽에 출력(챗봇)
                                    <div
                                        key={index}
                                        className="col-start-1 col-end-8 p-3 rounded-lg"
                                    >
                                        <div className="flex flex-row items-center">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                            Bot
                                        </div>
                                        <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                            <div>{message.message}</div>
            
                                            <div className="absolute w-[200px] text-xs bottom-0 left-0 -mb-5 text-gray-500">
                                            {message.user_type} {moment(message.send_date).format('YYYY-MM-DD HH:mm:ss')}
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    ),
                                )
                            }
                        </div>
                        </div>
                    </div>
        
                    {/* 메시지 입력 및 보내기 영역 */}
                    <form 
                    onSubmit={messageSubmit}
                    className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                        {/* 파일 첨부 버튼 영역 */}
                        <div>
                        <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
                            <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                            </svg>
                        </button>
                        </div>
        
                        {/* 메시지 입력요소 영역 */}
                        <div className="flex-grow ml-4">
                            <select value={botType} onChange={ (e) => { setBotType(e.target.value as BotType); } }>
                                <option value='LLMGPT'>ChatGPT</option>
                                <option value='LLMGEMINI'>Google Gemini</option>
                                <option value='RAGDOC'>RAG Document(Manual)</option>
                                <option value='RAGWEB'>RAG Website(QNA)</option>
                            </select>

                            <div className="flex w-full">
                                <input
                                type='text'
                                value={nickname}
                                onChange={ (e) => { setNickname(e.target.value); } }
                                placeholder='닉네임'
                                className="flex w-[85px] border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                />      

                                <input
                                type="text"
                                name={message}
                                value={message}
                                onChange={e => {
                                    setMessage(e.target.value);
                                }}
                                className="flex ml-2 w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                />
                            </div>
                        </div>
        
                        {/* 메시지 전송버튼 영역 */}
                        <div className="ml-4">
                        <button
                            type="submit"
                            className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                        >
                            <span>Send</span>
                            <span className="ml-2">
                            <svg
                                className="w-4 h-4 transform rotate-45 -mt-px"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                            </span>
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    );
}

export default MixBot;