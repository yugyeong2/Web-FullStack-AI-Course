// 리액트 혹은 use 접두사로 시작하는 재사용 가능한 함수를 말한다.

// 프로그래밍적으로 라우팅 처리와 정보를 관리하는 useRouter 참조
// 라우팅 주소 내 정보 추출과 로직을 위한 페이지 이동 처리 시 주로 사용하는 Hook
import { useRouter } from 'next/router';
import { useState } from 'react';

import { BlogType } from '@/interface/blog';

const Blog = () => {
    // 라우터 Hook을 생성한다.
    const router = useRouter();
    
    // 단일 게시글 상태 정보 정의/초기화
    const [blog, setBlog] = useState<BlogType>({
        id: 1,
        title: '제목1',
        content: '내용1',
        viewCnt: 0,
        display: true,
        createdAt: '2024-08-13',
        updatedAt: '2024-08-13'
    });

    // 라우팅 파라미터 방식(/blog/1)이나 쿼리스트링 방식(/blogs?id=1&category=100) 모두 router.query.키명으로 추출 가능하다.
    // -> NEXT.js에서는 파라미터 방식과 쿼리스트링 방식 모두 query.id로 고유번호를 받는다.
    console.log("URL 주소에서 추출한 게시글 고유번호:", router.query.id);

    return (
        <div className='h-[700px]'>
            단일 Blog 페이지 - 게시글 번호: {router.query.id} <br/>
            글 번호: {blog.id} <br/>
            제목: {blog.title} <br/>
            내용: {blog.content} <br/>
            작성 일자: {blog.createdAt} <br/>

            <button onClick={() => router.push('/blogs')}>목록 이동</button>
        </div>
    );
}

export default Blog;