import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { IBlog } from '@/interfaces/blog';

import axios from 'axios';

const BlogList = () => {

// ! SSR 방식으로 최초 화면 렌더링 처리 시 사용
// const BlogList = ( {blogs} : { blogs: IBlog[] } ) => {

    const router = useRouter();
    
    // ! CSR(Client Side Rendering) 방식: 게시글 목록 데이터 상태 정의
    const [blogs, setBlogs] = useState<IBlog[]>([]);

    // ! CSR 방식으로 최초 화면 렌더링(마운트) 시, 웹브라우저 서버 RESTful API 호출 및 게시글 목록 조회 바인딩 처리
    useEffect(() => {
        // 서버 인증 JWT 사용자 인증 토큰이 스토리지에 존재하는지 확인'
        // 토큰이 없으면, 로그인하고 오시라고 로그인 페이지로 리다이렉션 처리
        if(localStorage.getItem('token') == undefined) {
            router.push('/login');
        }

        getBlogList();
    }, []);

    // 비동기 방식으로 백엔드 게시글 목록 데이터 호출 함수
    async function getBlogList() {
        try {
            const response = await axios.get('http://localhost:5000/api/article/list');

            if(response.data.code == 200) {
                setBlogs(response.data.data);
            } else {
                console.log('블로그 목록 조회 중 서버 에러 발생', response.data.message);
            }

        } catch(error) {
            console.log('블로그 목록 조회 중 백엔드 API 호출 에러 발생');
        }
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                    블로그 목록
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                    관심 주제에 대해 블로그를 작성하고 공유하세요.
                </p>
            </div>

            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                {/* 게시글 작성 버튼 */}
                <button
                    type="button"
                    onClick={() => {router.push('/mypage/blog/create')}} // 내부에 핸들러 구현
                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    게시글 작성
                </button>
            </div>
        </div>

        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                <thead>
                    <tr>
                        <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                        >
                            글 번호
                        </th>

                        <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            제목
                        </th>

                        <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            게시 여부
                        </th>

                        <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            조회 수
                        </th>

                        <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            게시 일시
                        </th>

                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    { blogs.map((blog) => (
                        <tr key={blog.article_id}>
                            {/* 글 번호 */}
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {blog.article_id}
                            </td>

                            {/* 제목 */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {blog.title}
                            </td>

                            {/* 게시 여부 */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {blog.is_display_code == 1 ? '게시' : '게시하지 않음'}
                            </td>

                            {/* 조회 수 */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {blog.view_count}
                            </td>

                            {/* 게시 일시 */}
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {blog.reg_date}
                            </td>

                            {/* 수정 버튼 - 추후 modify 페이지 기능 구현 */}
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <a
                                href="/mypage/blog/modify"
                                className="text-indigo-600 hover:text-indigo-900"
                            >
                                Edit<span className="sr-only">, {blog.article_id}</span>
                            </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        </div>
        </div>
    );
};

// ! SSR(Server Side Rendering) 방식으로 최초 화면 렌더링 시 서버에서 데이터를 조회하고 서버에서 HTML소스를 생성해서 가져온다.
// export const getServerSideProps = async () => {
//     const res = await fetch("http://localhost:5000/api/article/list");
//     const result = await res.json();

//     return { props: { blogs: result.data } };
// };

export default BlogList;