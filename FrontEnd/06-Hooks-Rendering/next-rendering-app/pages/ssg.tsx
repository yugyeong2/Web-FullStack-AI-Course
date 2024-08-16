// SSG(Static Side Generation) 렌더링 방식은 정적인 웹사이트 소스를 개발환경 빌드 타임에 미리 만들어서 서버에 배포하고,
// 배포된 서버의 소스를 그냥 웹브라우저로 해석해주는 방식 적용
// 정적 웹사이트(단순 웹사이트: DB 프로그래밍이 필요없거나, 데이터 등록/변경 주기가 긴 웹사이트)를 만들고 싶을 때 주로 사용한다.
// 기본적으로 NEXT.js의 모든 컴포넌트 파일은 JSX만 표시할 때 SSG 방식으로 작동한다.
import { ArticleInterface, BoardTypeCode, ArticleTypeCode, IsDisplayCode } from '@/interface/article';

const SSG = ( { articles }: { articles: ArticleInterface[] } ) => {
    return (
        <div>
            SSG(Static Side Generation)

            <h1>인사말</h1>
            <p>저는 졸린 백엔드 개발자(희망)입니다.</p>
            <div>연락처: 010-7342-2788</div>
            
            <table className="w-full">
                <thead>
                    <tr>
                        <th>글 번호</th>
                        <th>글 제목</th>
                        <th>조회 수</th>
                        <th>IP</th>
                        <th>등록 일시</th>
                    </tr>
                </thead>

                <tbody>
                    {articles.map((article, index) => (
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
}

// SSG
// npm run build를 통해 빌드
// getStaticProps() 함수는 SSG(Static Side Generation) 방식으로 개발자 컴퓨터(환경)에서
// 빌드 타임에 RESTAPI를 호출하여 빌드 타임의 데이터를 기준으로 웹페이지를 생성해주는 함수이다.
// SSG 실행 순서: 개발 환경 npm run build를 통한 빌드 실행 -> 모든 컴포넌트 파일 중에서 getStaticProps() 사용 컴포넌트 탐색
//              -> 컴포넌트별 getStaticProps()실행 -> 실행 결과 반환데이터를 해당 컴포넌트의 props로 전달하여 정적 웹페이지 생성
//              -> 최종 서버에 배포하면 빌드타임에 생성된 정적웹페이지가 메뉴 클릭시 웹브라우저로 전달 표시된다.
// export const getStaticProps = async() => {

//     // 백엔드에서 게시글 데이터를 조회해와서, 해당 컴포넌트의 props 데이터 파라미터 형식으로 전달한다.
//     // CSR은 웹브라우저에서, SSR은 서버에서, SSG는 빌드할 때
//     const res = await fetch('http://localhost:5000/api/article/list'); // Node Express 앱 node-chat-app의 백엔드 주소 호출
//     const result = await res.json();

//     return {
//         props: { articles: result.data }
//     };
// };

// ISR
// 지정된 시간이 지나면, 서버 측에서 해당 데이터를 기반으로 정적 웹페이지를 생성하여, 서버에서 주기적으로 생서된 정적 웹페이지를 다운받아 화면을 갱신한다.
export const getStaticProps = async() => {

    // 백엔드에서 게시글 데이터를 조회해와서, 해당 컴포넌트의 props 데이터 파라미터 형식으로 전달한다.
    // CSR은 웹브라우저에서, SSR은 서버에서, SSG는 빌드할 때
    const res = await fetch('http://localhost:5000/api/article/list'); // Node Express 앱 node-chat-app의 백엔드 주소 호출
    const result = await res.json();

    return {
        props: { articles: result.data },
        // 페이지의 유효기간(수명)을 초 단위로 지정한다.
        revalidate: 10 // 10초마다 갱신
        // -> 10초마다 서버에서 새로운 데이터를 가져와서 정적 웹페이지를 생성하여, 웹브라우저로 전달한다.
        /*
        ! revalidate 설정이 10초일 때, 다음과 같이 동작을 테스트해 볼 수 있습니다.
        ! 페이지를 처음 요청합니다.
        ! 10초 이내에 다시 요청해보면 콘솔에 로그가 출력되지 않습니다.
        ! 10초 이상 지난 후 다시 요청하면 콘솔에 로그가 출력됩니다.
         */
    };
};


export default SSG;