const Child31 = ({children}: {children: React.ReactNode}) => {
    return (
        <div className='h-[500px] bg-red-500'>
            Child3-1

            <div>{children}</div>
        </div>
    );
}

export default Child31;