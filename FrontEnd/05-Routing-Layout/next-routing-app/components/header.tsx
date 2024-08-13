// 메뉴 링크를 위한 Link 컴포넌트 참조
import Link from 'next/link';

const Header = () => {
    return (
        <div className='flex p-1 m-1 bg-gray-400'>
            <div className='w-8/12 px-4 mt-4'>
                <Link href="/">HOME</Link> |
                <Link href="/company/intro"> 회사 소개</Link> |
                <Link href="/products/1/price"> 제품 분류</Link> |
                <Link href="/blogs"> 블로깅</Link> |
                <Link href="/blogs/1"> 블로깅 상세</Link> |
                <Link href="/company/contact"> 문의하기</Link> |
            </div>

            <div className='w-4/12 px-4 mt-4 text-right'>
                <Link href="/auth/login">로그인</Link> |
                <Link href="/auth/entry"> 회원가입</Link> |
                <Link href="/mypage/profile"> 프로필</Link> |
                <Link href="/mypage/settings/config"> 환경설정</Link>
            </div>
        </div>
    );
}

export default Header;