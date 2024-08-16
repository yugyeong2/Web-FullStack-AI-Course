// SSR(Server Side Rendering)은 최초로 해당 컴포넌트의 UI를 생성하는 위치가
// 사용자 요청 시 서버에서 HTML + data 결과물을 동적으로 생성하고,
// 동적으로 서버에서 만들어진 HTML 소스를 웹브라우저로 가져와 해당 영역에 표시한다.
// SEO(검색 엔진 최적화 시 주로 사용하거나 또는 CSR 로딩 지연이 발생 시 SSR로 대체 가능)

// 서버 사이드 렌더링이기 때문에 useState, useEffect 필요 x

import { ArticleInterface, BoardTypeCode, ArticleTypeCode, IsDisplayCode } from '@/interface/article';

const SSR = ( { articles }: { articles: ArticleInterface[] } ) => {
    return (
        <div>
            SSR(Server Side Rendering)

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

// SSR 구현을 위한 getServerSideProps() 함수 호출
// SSR 구현을 위한 이미 정해져 있는 getServerSideProps() 함수의 기능만 구현해주면 된다.
// getServerSideProps() 함수는 해당 컴포넌트를 최초로 화면에 렌더링 시 자동으로 먼저 호출된다.
// SSR 실행 순서: getServerSideProps() 함수 실행 및 결과 props 전달(서버에서 실행) -> 해당 컴포넌트 실행(props)(서버에서 실행)
//              -> return 구문실행(jsx) - 서버에서 실행 최종 결과화면 빈 화면 -> 웹브라우저 표시
export const getServerSideProps = async() => {

    // 백엔드에서 게시글 데이터를 조회해와서, 해당 컴포넌트의 props 데이터 파라미터 형식으로 전달한다.
    // CSR은 웹브라우저에서, SSR은 서버에서
    const res = await fetch('http://localhost:5000/api/article/list'); // Node Express 앱 node-chat-app의 백엔드 주소 호출
    const result = await res.json();

    return {
        props: { articles: result.data }
    };
}

export default SSR;