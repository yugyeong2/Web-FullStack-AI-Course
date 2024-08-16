// CSR(Client Side Rendering) 방식으로 UI 표시하기
// client.js 파일에 의해 웹브라우저 환경에서 해당 컴포넌트의 렌더링한다.

import { useState, useEffect } from 'react';

// 공통 타입 참조
import { ArticleInterface, BoardTypeCode, ArticleTypeCode, IsDisplayCode } from '@/interface/article';
const CSR = () => {

    // 게시글 목록 상태 데이터 정의 및 초기 값 세팅
    const [articles, setArticles] = useState<ArticleInterface[]>([]);

    // 방법 1) 동기 방식
    // // 화면이 최초로 렌더링 되는 시점(마운팅 시점)을 캐치하기 위해
    // useEffect(() => {
    //     // 최초로 화면이 렌더링(CSR) 되기 전에 백엔드 API에서 게시글 목록 가져오기 구현
    //     // 동기 방식의 ECMAScript 표준 AJAX 통신 기능인 fetch를 이용해 데이터 가져오기
    //     fetch('http://localhost:5000/api/article/list')
    //         .then((res) => res.json())
    //         .then((result) => {
    //             console.log("백엔드 RESTful API에서 전달된 게시글 데이터 목록:", result);
    //             setArticles(result.data);
    //         });
    // }, []);

    // 방법 2) 비동기 방식 -> 위처럼 then으로 이어지는 것보다 순차적으로 동작하는 것이 더 좋다.
    // 비동기 방식으로 useEffect 훅과 fetch 함수를 사용한 데이터 처리
    useEffect(() => {
        //비동기 fetching 함수 정의
        const fetchData = async() => {
            // Node Express 앱 node-chat-app의 백엔드 주소 호출
            const res = await fetch('http://localhost:5000/api/article/list');
            // NEXT.js의 백엔드 API 주소 호출
            // const res = await fetch('http://localhost:3000/api/article');

            if(!res.ok) {
                throw new Error('HTTP 호출 에러 발생');
            }

            const result = await res.json();
            setArticles(result.data);
        };

        // 비동기 fetching 함수를 호출하고, 에러발생에 대한 예외처리를 한다.
        fetchData().catch((e) => {
            console.error('백엔드 호출 에러 발생', e);
        });
    }, []);

    return (
        <div>
            CSR(Client Side Rendering)

            <table className='w-full'>
                <thead>
                    <tr>
                        <th>글 번호</th>
                        <th>제목</th>
                        <th>조회 수</th>
                        <th>IP</th>
                        <th>등록 일시</th>
                    </tr>
                </thead>

                <tbody>
                    { articles.map((article, index) => (
                        <tr key={index}>
                            <td>{article.article_id}</td>
                            <td>{article.title}</td>
                            <td>{article.view_count}</td>
                            <td>{article.ip_address}</td>
                            <td>{article.reg_date}</td>
                        </tr>                        
                    ))}

                </tbody>
            </table>
        </div>
    );
};

export default CSR;