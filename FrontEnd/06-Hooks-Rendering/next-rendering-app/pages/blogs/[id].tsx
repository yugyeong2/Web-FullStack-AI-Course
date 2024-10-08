import { ArticleInterface } from '@/interface/article';

// ParsedUrlQuery 참조
import { ParsedUrlQuery } from 'querystring';

// 파라미터 형식 정의
interface ArticleParams extends ParsedUrlQuery {
    id: string;
}

const Blog = ( { article }: { article: ArticleInterface } ) => {
    return (
        <div>
            Blog Detail

            <table>
                <tbody>
                    <tr>
                        <td>글 번호</td>
                        <td>{article.article_id}</td>
                    </tr>
                    <tr>
                        <td>글 제목</td>
                        <td>{article.title}</td>
                    </tr>
                    <tr>
                        <td>글 내용</td>
                        <td>{article.contents}</td>
                    </tr>
                    <tr>
                        <td>IP</td>
                        <td>{article.ip_address}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

// getStaticPaths() 함수는 데이터 기반 SSG 렌더링 방식 사용 시, 여러 데이터를 기반으로 여러 정적 웹페이지를 생성할 때 사욯하는 함수이다.
// SSG 방식의 getStaticPaths() 실행 순서 : getStaticPaths() 실행 -> 실행 파라미터 getStaticProps() 함수로 전달
// -> getStaticProps(파라미터 값) 실행 결과 값을 해당 컴포넌트 props로로 전달 -> return(데이터 기반) 정적 웹페이지 생성
export async function getStaticPaths() {

    // 만들려고 하는 여러 페이지 정보를 가지고 있는 데이터 목록 조회하기
    const res = await fetch("http://localhost:5000/api/article/list");
    const result = await res.json();

    // 목록 데이터 기반 Paths생성하기
    const paths = result.data.map((article: ArticleInterface) => ({
        params: { id: article.article_id.toString() },
    }));

    // 반환되는 getStaticPaths()함수의 결과가 getStaticProps()함수의 props로 자동전달됩니다.
    // fallback:false로설정되어 있으면 추출된 패스값 외에 다른 값이 파라메터로 전달시 404 에러를 생셩해준다.
    return { paths, fallback: false };
}

  // 빌드타임에 getStaticPaths()함수에서 전달된 파라메터 기반으로 단일 게시글 정보를 조회해서
  // 해당 컴포넌트에 props로 전달한다.
export const getStaticProps = async ({ params }: { params: ArticleParams }) => {

    // 백엔드에서 단일 게시글 정보를 조회해와서 해당 컴포넌트의 props 데이터 파라미터 형식으로 전달한다.
    const res = await fetch(`http://localhost:5000/api/article/${params.id}`);
    const result = await res.json();

    // 단일 게시글 정보를 해당 컴포넌트의 props로 전달한다.
    return { props: { article: result.data } };
};

export default Blog;