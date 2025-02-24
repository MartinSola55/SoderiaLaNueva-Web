import { Col, Row } from 'react-bootstrap';
import { BreadCrumb } from '@components';
import App from '@app/App';
import { SoldProductsCard } from './soldProductsCard/SoldProductsCard';
import { ExpensesCard } from './expensesCard/ExpensesCard';
import { RoutesCard } from './routesCard/RoutesCard';
import { BalanceCard } from './balanceCard/BalanceCard';

const Home = () => {
	return (
		<>
			<BreadCrumb title='Inicio' />
			<Col xs={12} className='container-fluid px-5'>
				{App.isAdmin() ? (
					<>
						<Row>
							<Col xs={12} lg={6}>
								<RoutesCard isAdmin={true} />
								<RoutesCard isAdmin={true} />
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
					</>
				) : (
					<Row>
						<Col xs={12}>
							<RoutesCard isAdmin={false} />
						</Col>
					</Row>
				)}
			</Col>
		</>
	);
};

export default Home;
