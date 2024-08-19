import NavigationBar from "@/components/navigation-bar";

const HomeLayout = ( {children}: {children: React.ReactNode}) => {
    return (
        <div>
            <NavigationBar/>

            <div>{children}</div>            
        </div>
    );
}

export default HomeLayout;