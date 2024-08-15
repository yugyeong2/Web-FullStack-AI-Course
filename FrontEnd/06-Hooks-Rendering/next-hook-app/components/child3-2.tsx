const Child32 = ({children}: {children: React.ReactNode}) => {
    return (
        <div className='h-[400px] bg-red-400'>
            Child3-2

            <div>{children}</div>
        </div>
    );
}

export default Child32;