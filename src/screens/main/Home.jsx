import { Col, Row } from 'react-bootstrap';
import { BreadCrumb } from '../../components';
import { SoldProductsCard } from './soldProductsCard/SoldProductsCard';
import { ExpensesCard } from './expensesCard/ExpensesCard';
import { RoutesCard } from './routesCard/RoutesCard';
import { BalanceCard } from './balanceCard/BalanceCard';
import Map from '../../components/Map/Map';

const Home = () => {
    const dropOffPoints = [
        {lng: -68.104, lat: -38.95,},
        // {lng: -68.103, lat: -38.951,},
        // {lng: -68.102, lat: -38.952,},
        // {lng: -68.107, lat: -38.95,},
    ]

    return (
        <>
            <BreadCrumb title='Inicio' />
            <Col xs={12} className='container-fluid px-5'>
                <Row>
                    <Col xs={12} lg={6}>
                        <RoutesCard />
                    </Col>
                    <Col xs={12} lg={6}>
                        <SoldProductsCard /> 
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={6}>
                        <ExpensesCard />
                    </Col>
                    <Col xs={12} lg={6}>
                        <BalanceCard />
                    </Col>
                </Row>
            </Col>
            <Map dropOffPoints={dropOffPoints}/>
        </>
    );
};

export default Home;
