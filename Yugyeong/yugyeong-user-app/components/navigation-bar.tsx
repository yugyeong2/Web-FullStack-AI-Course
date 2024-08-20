import Link from 'next/link';
import Image from 'next/image';

const navigation = [
    { name: '홈', path: '/', icon: '/image/home.png' },
    { name: '검색', path: '/search', icon: '/image/search.png' },
    { name: '탐색 탭', path: '/explore', icon: '/image/compass.png' },
    { name: '메시지', path: '/messages', icon: '/image/chat.png' },
    { name: '만들기', path: '/create', icon: '/image/plus.png' },
    { name: '저장', path: '/collection', icon: '/image/bookmark.png' }
];
// Link의 href 속성 확인
const NavigationBar = () => {
    return (
        <nav>
            <ul>
                { navigation.map((item) => (
                    <li key={item.name}>
                        
                        <Link href={item.path}>
                            <div className='relative w-5 h-5'>
                            <Image src={item.icon} alt={item.name}
                            width={20} height={20} // 1.25rem = 20px
                            />
                            </div>
                            {item.name}
                        </Link>
                    </li>
                    ))
                }
            </ul>
        </nav>
    );
}

export default NavigationBar;