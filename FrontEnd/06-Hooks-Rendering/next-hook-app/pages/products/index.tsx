import { useState, useEffect } from 'react';
import { Category, Product } from '@/interface/product';

// DB에서 가져왔다고 가정하는 가상 데이터셋 전역 데이터
const categoryData: Category[] = [
    { category_id: 0, category: '전체보기', sort: 0 },
    { category_id: 1, category: '노트북', sort: 0 },
    { category_id: 2, category: 'TV', sort: 0 },
    { category_id: 3, category: '냉장고', sort: 0 }
];
const productData: Product[] = [
    {
        product_id: 1,
        category_id: 1,
        product_name: '삼성 노트북 2024 갤럭시북4 NT750XGR-A51A',
        manufacturer: '삼성전자',
        price: 939000,
        stock: 1,
        image: 'notebook1.png',
    },
    {
        product_id: 2,
        category_id: 1,
        product_name: 'LG 노트북 그램',
        manufacturer: 'LG전자',
        price: 1539000,
        stock: 2,
        image: 'notebook2.png',
    },
    {
        product_id: 3,
        category_id: 2,
        product_name: 'LG 75인치 UHD TV 75UP7750PVA',
        manufacturer: 'LG전자',
        price: 2990000,
        stock: 3,
        image: 'tv1.png',
    },
    {
        product_id: 4,
        category_id: 3,
        product_name: '삼성 냉장고 2023 XDFDFD071B4',
        manufacturer: '삼성전자',
        price: 5090000,
        stock: 4,
        image: 'refrigerator1.png',
    },
    {
        product_id: 5,
        category_id: 3,
        product_name: '삼성 냉장고 2024 RS84T5071B4',
        manufacturer: '삼성전자',
        price: 6090000,
        stock: 5,
        image: 'refrigerator2.png',
    }
];

const ProductList = () => {
    // 상태 데이터 정의
    const [ categories, setCategories ] = useState<Category[]>([]);
    const [ selectedCategory, setSelectedCategory ] = useState<Category>({ category_id: 0, category: '전체보기', sort: 0 });
    const [ products, setProducts ] = useState<Product[]>([]);


    // 최초 화면이 로딩되는 시점(마운팅 시점)을 찾아서,
    // 백엔드에서 분류 목록과 제품 목록 데이터를 가져온다.
    useEffect(() => {
        setCategories(categoryData);
        setProducts(productData);
        setSelectedCategory({ category_id: 0, category: '전체보기', sort: 0 });
    }, []);


    // 특정 상태값이 변경되는 시점을 확인해서 기능 구현
    useEffect(() => {
        const searchResult = productData.filter((p) => p.category_id === selectedCategory.category_id);
        
        if(selectedCategory.category_id === 0) {
            // 전체 카테고리를 선택한 경우 전체 제품데이터 출력
            setProducts(productData);
        } else {
            // 기타 카테고리 선택 시 관련 제품 목록만 출력
            setProducts(searchResult);
        }
    }, [selectedCategory]);


    const productSearch = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // 선택한 단일 카테고리 정보 조회
        const category = categories.find(
            (c) => c.category_id === Number(e.target.value)
        ) as Category;

        setSelectedCategory(category);
    };

    return (
        <div className='m-5'>
            {/* 제품 카테고리 선택 영역 */}
            <div>
                <select
                value={selectedCategory.category_id}
                onChange={productSearch}
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
                >
                    { categories.map((category, index) => (
                        <option
                        key={index}
                        value={category.category_id}
                        >
                            {category.category}
                        </option>
                    )) }
                </select>
            </div>

            {/* 페이지 제목 영역 */}
            <h1 className='my-3'>Product List</h1>

            {/* 제품 목록 영역 */}
            <div>
                <table className='w-full border-collapse w-border border-slate-400'>
                    <thead>
                        <tr>
                            <th className='border border-slate-300'>제품번호</th>
                            <th className='border border-slate-300'>제품명</th>
                            <th className='border border-slate-300'>제조사</th>
                            <th className='border border-slate-300'>가격</th>
                        </tr>
                    </thead>

                    <tbody>
                        { products.map((product, index) => (
                            <tr key={index}>
                                <td className='border border-slate-300'>{product.category_id}</td>
                                <td className='border border-slate-300'>{product.product_name}</td>
                                <td className='border border-slate-300'>{product.manufacturer}</td>
                                <td className='border border-slate-300'>{product.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductList;