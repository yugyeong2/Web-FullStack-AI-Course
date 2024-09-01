import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';

import axios from 'axios';
import { IChannel } from '@/interfaces/chat';

// 전역 컨텍스트 참조하기
import { GlobalContext } from '@/library/globalContext';
import { IGlobalData } from '@/interfaces/global';

const ChatList = () => {
    const router = useRouter();

    // 전역 상태값에서 로그인한 사용자의 정보 조회하기 위해 컨텍스트 객체 생성
    const { globalData, setGlobalData } = useContext(GlobalContext);

    // 채널 목록 데이터 상태 정의 및 초기화
    const [channelList, setChannelList] = useState<IChannel[]>([]);

    useEffect(() => {
        getChannelList();
    }, []);

    async function getChannelList() {
        try {
            const response = await axios.get('http://localhost:5000/api/channel/list');

            if(response.data.code == 200) {
                console.log('백엔드에서 제공해준 채널 목록 데이터:', response.data);
                setChannelList(response.data.data);
            } else {
                console.log('채널 목록 조회 중 서버 에러 발생', response.data.message);
            }
        } catch (error) {
            console.log('채널 목록 조회 중 백엔드 API 호출 에러 발생');
        }
    }

    // 채널 목록에서 참여하기 버튼 클릭 시, 선택 채널번호를 이용해 채팅방 컴포넌트로 이동
    const entryChannel = async (channel_id: number) => {
        router.push(`/chat?cid=${channel_id.toString()}`);
    }

    return (
        <div className="ml-32 mr-32 px-4 sm:px-6 lg:px-8">
            <div className="mt-32 sm:flex sm:items-center">
                {/* 제목 및 설명 영역 */}
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                        채널 목록
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        그룹 채팅을 위한 채널 목록
                    </p>
                </div>

                {/* 신규 채널 개설 버튼 영역 */}
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => {router.push('/chat/create')}} // 내부에 핸들러 구현
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        채널 개설
                    </button>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                        <tr>
                            <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                            채널명
                            </th>
                            <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                            동시 접속자 제한 수
                            </th>

                            <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                            >
                            참여하기
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        { channelList.map(channel => (
                            <tr key={channel.channel_id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    {channel.channel_name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {channel.user_limit}
                                </td>

                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                                    {/* <a
                                    href="#"
                                    className="text-indigo-600 hover:text-indigo-900"
                                    >
                                    참여하기
                                    <span className="sr-only">, {person.name}</span>
                                    </a> */}
                                    <button
                                    type="button"
                                    onClick= {() => { entryChannel(channel.channel_id) } }
                                    className="rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                    참여하기
                                    </button>
                                </td>
                            </tr>
                        )) }
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default ChatList;