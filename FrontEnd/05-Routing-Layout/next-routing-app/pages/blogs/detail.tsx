import { useRouter } from 'next/router';

const BlogDetail = () => {
    const router = useRouter();

    // localhost:3000/blogs/detail?id=1&name=NextJS
    // QueryString 방식의 키 값을 추출하는 방법
    const id = router.query.id;
    const name = router.query.name;

    return (
        <div className='h-[700px]'>
            Blog Detail Web Page: {id}={name}
        </div>
    );
}

export default BlogDetail;