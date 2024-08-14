// 컴포넌트 내에서 데이터 상태 관리를 위한 useState 훅 참조
// 현재 컴포넌트의 생애주기(LifeCycle) 관리를 위한 useEffect 훅 참조
import { useState, useEffect } from 'react';

// ! useEffect 훅을 사용할 때는 반드시 프로젝트의 next.config.mjs 파일 내의 reactStrictMode: false 설정을 해야 한다.
// ! reactStrictMode(엄격 모드) 설정은 개발 시에만 사용되고, 서비스/배포와는 무관한 설정이다.

import Link from 'next/link';

// 단일 블로그 데이터 타입 정의
interface BlogItem {
    id: number;
    title: string;
    view_cnt: number;
    create_date: string;
}

// DB에서 가져왔다고 가정하는 변하지 않는 데이터
const originalBlogData: BlogItem[] = [
    { id: 1, title: '제목1', view_cnt: 10, create_date: '2024-08-14' },
    { id: 2, title: '제목2', view_cnt: 20, create_date: '2024-08-14' },
    { id: 3, title: '제목3', view_cnt: 30, create_date: '2024-08-14' },
    { id: 4, title: '제목4', view_cnt: 40, create_date: '2024-08-14' },
    { id: 5, title: '제목5', view_cnt: 50, create_date: '2024-08-14' },
]

const BlogList = () => {
    // 검색어 키워드 상태 데이터 값 정의 및 값 초기화
    const [searchWord, setSearchWord] = useState<string>('');

    // 검색 결과 블로그 목록 상태 데이터 값 정의
    const [blogs, setBlogs] = useState<BlogItem[]>([]);

    // 현재 컴포넌트가 최초로 화면에 렌더링되는 시점(Mount)에 실행되는 useEffect 훅 정의
    // useEffect('최초 마운팅될 때 실행할 콜백함수', 생애주기 시점 정의 -> [] 빈배열의 경우 최초 마운팅 되는 시점을 말한다.)
    // useEffect('실행할 콜백함수'. []); -> 해당 컴포넌트의 최초 마운팅 시점과 언마운팅 시점에 대해 프로그래밍(로직) 가능하다.
    useEffect(() => {
        console.log('최초로 화면이 나타나는 시점(마운트)에 호출됩니다.');

        // 최초 해당 컴포넌트가 마운팅(최초 1회)될 때, 백엔드 RESTAPI를 호출해서 블로그 목록을 조회해온다.
        // 조회해온 블로그 목록데이터를 setBlogs() setter 함수를 통해 상태 데이터로 저장한다.
        setBlogs(originalBlogData);

        // 해당 컴포넌트가 사라지는 시점(Unmount)에 실행되는 콜백함수(클린업 함수) 정의
        return () => {
            console.log('블로그 목록 페이지가 사라지기 전(언마운트)에 실행됩니다.');
        }
    }, []);

    // 화면 내 변화가 일어날 때마다 실행되는 useEffect 훅 정의
    // 화면이 바뀌거나, 상태 데이터가 바뀔 경우 실행
    useEffect(() => {
        console.log('화면 내에서 상태 데이터가 변경되어 렌더링이 일어날 때마다 실행됩니다.');
    });

    // 특정 상태 데이터의 변경을 감지하여, 프로그램을 구현하고 싶은 경우도 useEffect 훅을 사용한다.
    // useEffect('실행할 콜백함수'. [감지할 상태 데이터]);
    useEffect(() => {
        console.log('검색어가 변경되어 블로그 목록을 갱신합니다.', searchWord);
        blogSearch();
    }, [searchWord]);

    // 검색어 기반 블로그 검색 처리 함수 정의
    // 검색 버튼 클릭 시 호출되는 함수
    const blogSearch = () => {
        let searchResult: BlogItem[] = [];

        if(searchWord.length > 0) {
            searchResult = originalBlogData.filter((item) => item.title.includes(searchWord));
            setBlogs(searchResult);

        } else {
            // 검색어가 없으면, 기존의 데이터를 다시 갱신시켜 준다. -> 추후 DB 연결
            setBlogs(originalBlogData);
        }
    };

    return (
        <div>
            <h1 className='m-4'>블로그 조회</h1>

            {/* 상단 검색어 입력 영역 */}
            <div className='m-4 flex'>
                <input
                type='text'
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder='검색어를 입력해주세요.'
                className='block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />

                <button
                type='button'
                onClick={blogSearch}
                className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                >
                검색
                </button>

                {/* 언마운팅 시점 */}
                <Link href='/'>메인 이동하기</Link>
            </div>

            {/* 블로그 검색 결과 목록 표시 영역 */}
            <div className='m-4'>
                <table className='w-full'>
                    <thead>
                        <tr>
                            <th>글 번호</th>
                            <th>글 제목</th>
                            <th>조회 수</th>
                            <th>등록 일자</th>
                        </tr>
                    </thead>

                    <tbody>
                        { blogs.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.view_cnt}</td>
                                    <td>{item.create_date}</td>                            
                                </tr>                                
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlogList;