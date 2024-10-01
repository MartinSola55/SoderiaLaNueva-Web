import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Footer from './main/Footer';
import { NavBar, TopBar } from '../components';

const DefaultLayout = ({ children }) => {
    return (
        <>
            <ToastContainer />
            <div className="container-fluid px-0 mx-0" style={{ minHeight: '100vh' }}>
                <div className="container px-0 mx-0" style={{ backgroundColor: '#eef5f9', minHeight: '100vh', minWidth: '100%', position: 'relative' }}>
                    <TopBar />
                    <div className='navbar-container'>
                        <NavBar />
                        <div className='main-container'>
                            {children}
                            <Footer />
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default DefaultLayout;
