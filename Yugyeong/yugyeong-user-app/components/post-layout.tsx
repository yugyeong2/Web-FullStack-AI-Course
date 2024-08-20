import NavigationBar from "@/components/navigation-bar";

const PostLayout = ( {children}: {children: React.ReactNode}) => {
    return (
        <div>
            <NavigationBar />

            <div>{children}</div>

            {/* 추후 상태 창 추가 */}
        </div>
    );
};

export default PostLayout;
