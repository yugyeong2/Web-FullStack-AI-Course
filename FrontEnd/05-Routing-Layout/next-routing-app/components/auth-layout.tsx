import Header from './header';
import Footer from './footer';
import MyPageMenu from './mypage-menu';

const AuthLayout = ({children}: {children:React.ReactNode}) => {
    return (
        <div>
            <Header/>

            <div className='flex'>
                {/* 마이페이지 좌측 메뉴 바 영역 */}
                <div className="w-2/12 bg-blue-500"><MyPageMenu/></div>
                {/* 마이페이지 컨텐츠 영역 */}
                <div className="w-10/12 bg-green-700">{children}</div>
            </div>

            <Footer/>
        </div>
    );
}

export default AuthLayout;