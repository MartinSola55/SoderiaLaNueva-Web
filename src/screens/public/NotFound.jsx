import { useNavigate } from 'react-router';
import './error.scss';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="error-container">
            <div className="error-body text-center">
                <h1 className="text-primary">404</h1>
                <h3>ERROR</h3>
                <p className="mt-3 mb-3">La página que intentas buscar no existe</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Ir a inicio</button>
            </div>
            <div className="footer">
                <footer>
                    <span className='mx-auto'>Sodería la Nueva &copy; - {new Date().getFullYear()}</span>
                </footer>
            </div>
        </div>
    );
};

export default NotFound;