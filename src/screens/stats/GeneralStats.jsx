import { Col, Row } from "react-bootstrap";
import { BreadCrumb } from "@components";
import { MonthltSalesCard } from "./cards/MonthltSalesCard";
import { AnualSalesCard } from "./cards/AnualSalesCard";
import { ProductsSoldCard } from "./cards/ProductsSoldCard";

const GeneralStats = () => {
	const breadcrumbItems = [
		{
			active: true,
			label: 'Estadísticas generales',
		}
	];

	return (
		<>
			<BreadCrumb title='Estadísticas' items={breadcrumbItems} />
			<Row>
				<Col xs={12} xl={6} className='container-fluid px-5 pe-xl-2'>
					<MonthltSalesCard />
				</Col>
				<Col xs={12} xl={6} className='container-fluid px-5 ps-xl-2'>
					<AnualSalesCard />
				</Col>
				<Col xs={12} xl={6} className='container-fluid px-5 pe-xl-2'>
					<ProductsSoldCard />
				</Col>
			</Row>
		</>
	);
};

export default GeneralStats;