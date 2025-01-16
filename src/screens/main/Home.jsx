import { Col } from 'react-bootstrap';
import { BreadCrumb } from '../../components';
import { SoldProductsCard } from './soldProductsCard/SoldProductsCard';

const Home = () => {
    return (
        <>
            <BreadCrumb title='Inicio' />
            <div>
                <Col xs={11} className='container'>
                    <SoldProductsCard />
                </Col>
            </div>
        </>
    );
};

export default Home;
