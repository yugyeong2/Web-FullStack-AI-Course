import Link from 'next/link';
import Image from 'next/image';

// import { Charmonman } from 'next/font/google';

// const charmonman = Charmonman({ subsets: ['latin'], weight: ['400', '700'], });

const navigation = [
    { name: '홈', path: '/', icon: '/image/home.png' },
    { name: '검색', path: '/search', icon: '/image/search.png' },
    { name: '탐색 탭', path: '/explore', icon: '/image/compass.png' },
    { name: '메시지', path: '/messages', icon: '/image/chat.png' },
    { name: '만들기', path: '/create', icon: '/image/plus.png' },
    { name: '저장', path: '/collection', icon: '/image/bookmark.png' }
];

const NavigationBar = () => {
    return (
        <nav className='fixed flex flex-col items-center justify-center h-full border-r border-gray-300 shadow-lg w-52'>
            <div className='absolute top-0 left-0 flex items-center justify-center w-full py-9'>
            <span className='text-xl font-bold'>logo</span>
            </div>

            <ul className='items-center justify-center mt-16'>
                {
                    navigation.map((item) => (
                        <li key={item.name}>
                            <Link href={item.path} className='flex p-10 text-black'>
                                <div className='w-5 h-5 mr-2'>
                                    <Image
                                    src={item.icon}
                                    alt={item.name}
                                    layout="responsive" // 이미지 비율 유지(반응형)
                                    width={20} // 1.25rem = 20px
                                    height={20}
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