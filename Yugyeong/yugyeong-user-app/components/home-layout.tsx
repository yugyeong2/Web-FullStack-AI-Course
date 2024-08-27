import NavigationBar from "@/components/navigation-bar";

const HomeLayout = ( {children}: {children: React.ReactNode}) => {
    return (
        <div className='flex flex-col min-h-screen'>
            <NavigationBar/>

            <div className="flex items-center justify-center flex-1 ml-56">
                {children}
            </div>

            {/* 추후 상태 창 추가 */}
        </div>
    );
};

export default HomeLayout;