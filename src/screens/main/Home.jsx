import { Col, Row } from 'react-bootstrap';
import { BreadCrumb } from '../../components';
import { SoldProductsCard } from './soldProductsCard/SoldProductsCard';

const Home = () => {
    return (
        <>
            <BreadCrumb title='Inicio' />
            <Col xs={12} className='container'>
                <Row>
                    <Col xs={12} lg={6}>
                        <SoldProductsCard />
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default Home;
