import Header from './header';
import Footer from './footer';

const BaseLayout = ({children}: {children:React.ReactNode}) => {
    return (
        <div>
            <Header/>

            <div>{children}</div>

            <Footer/>
        </div>
    );
}

export default BaseLayout;