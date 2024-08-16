const Child1 = ({children}: {children: React.ReactNode}) => {
    return (
        <div className='h-[1200px] bg-red-700'>
            Child1

            <div>{children}</div>
        </div>
    );
}

export default Child1;