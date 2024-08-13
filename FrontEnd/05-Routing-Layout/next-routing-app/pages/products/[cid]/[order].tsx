import { useRouter } from 'next/router';

const ProductCategory = () => {
    const router = useRouter();

    return (
        <div>
            제품 카테고리 페이지: {router.query.cid}
        </div>
    );
}

export default ProductCategory;