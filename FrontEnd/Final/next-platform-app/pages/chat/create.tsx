// 백엔드 RESTful API 통신을 위한 axios 패키지 참조
import axios from 'axios';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { ICreateChannel, ChannelState } from '@/interfaces/chat';

const ChannelCreate = () => {
    const router = useRouter();

    // 최초 화면 컴포넌트 렌더링(마운팅) 시점에 로컬스토리지 내의 토큰값 존재 여부 체크 후,
    // 토큰이 없으면, 로그인하고 오시라고 로그인 페이지로 리다이렉션 처리
    useEffect(() => {
        // 서버 인증 JWT 사용자 인증 토큰이 스토리지에 존재하는지 확인
        if(localStorage.getItem('token') == undefined) {
            router.push('/login');
        }
    }, []);

    const [channel, setChannel] = useState<ICreateChannel>({
        channel_name: '',
        user_limit: 100,
        channel_state_code: 1
    });

    // 신규 채널 정보를 백엔드 API로 전달해서 등록 처리한다.
    const channelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 웹브라우저 로컬스토리지 저장소에서 로그인 사용자 JWT 인증 토큰 문자열을 조회해온다.
        const token = localStorage.getItem('token');

        // axios 또는 fetch()를 통해 백엔드 RESTful API를 호출한다.
        try {
            // ! Case 1) axios를 이용한 데이터 처리 방법
            // axios.post('API 주소', 전달 데이터);
            const response = await axios.post(
                'http://localhost:5000/api/channel/create',
                channel,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('axios를 통해 호출한 채널 등록 결과:', response);

            if(response.data.code == 200) {
                alert('등록 완료');
                console.log('채널 등록 성공:', response.data);
                router.push('/channel/list');
            } else {
                console.error('채널 등록 중 에러 발생:', response.data.message);
            }

        } catch(error) {
            console.error('채널 등록 중 백엔드 API 호출 에러 발생:', error);        
        }
    };

    return (
        <div className='mt-32 ml-32 mr-32 px-4 sm:px-6 lg:px-8'>
        <form onSubmit={channelSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                <div className="sm:flex-auto">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                        신규 채널 등록
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        신규 채널을 작성합니다.
                    </p>
                </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    {/* 채널명 영역 */}
                    <div className="sm:col-span-4">
                        <label
                            htmlFor="channel_name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            채널명
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                <input
                                    id="channel_name"
                                    name="channel_name"
                                    type="text"
                                    value={channel.channel_name}
                                    onChange={ (e) => { setChannel({ ...channel, channel_name: e.target.value }) } }
                                    placeholder="채널명을 입력해주세요."
                                    className="block flex-1 border-0  bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 동시 접속자 제한 인원 수 영역 */}
                    <div className="col-span-full">
                        <label
                            htmlFor="user_limit"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            동시 접속자 제한 인원 수
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                <input
                                    id="user_limit"
                                    name="user_limit"
                                    type="text"
                                    value={channel.user_limit}
                                    onChange={ (e) => { setChannel({ ...channel, user_limit: Number(e.target.value) }) } }
                                    placeholder="동시 접속자 제한 수를 입력해주세요."
                                    className="block flex-1 border-0  bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 채널 사용 여부 영역 */}
                    <div className="sm:col-span-3">
                        <label
                            htmlFor="channel_state_code"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            채널 사용 여부
                        </label>
                        <div className="mt-2">
                            <select
                            id="channel_state_code"
                            name="channel_state_code"
                            value={channel.channel_state_code}
                            onChange={ (e) => { setChannel({ ...channel, channel_state_code: Number(e.target.value) }) } }
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                                <option value={1}>사용</option>
                                <option value={0}>사용하지 않음</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                type="button"
                onClick={ () => { router.push('/chat/list') } }
                className="text-sm font-semibold leading-6 text-gray-900"
                >
                    Cancel
                </button>

                <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Save
                </button>
            </div>
            
        </form>
        </div>
    );
};

export default ChannelCreate;