// 리액트 혹은 use 접두사로 시작하는 재사용 가능한 함수를 말한다.

// 프로그래밍적으로 라우팅 처리와 정보를 관리하는 useRouter 참조
// 라우팅 주소 내 정보 추출과 로직을 위한 페이지 이동 처리 시 주로 사용하는 Hook
import { useRouter } from 'next/router';

const Blog = () => {
    // 라우터 훅을 생성한다.
    const router = useRouter();
    
    // 라우팅 파라미터 방식(/blog/1)이나 쿼리스트링 방식(/blogs?id=1&category=100)
    // -> NEXT.js에서는 파라미터 방식과 쿼리스트링 방식 모두 query.id로 고유번호를 받는다.
    console.log("URL 주소에서 추출한 게시글 고유번호:", router.query.id);
    return (
        <div>
            Enter
        </div>
    );
}

export default Blog;