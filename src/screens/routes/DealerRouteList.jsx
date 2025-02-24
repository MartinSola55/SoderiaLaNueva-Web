import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { ActionConfirmationModal, BreadCrumb, SimpleCard, Table, Toast } from '@components';
import { Messages } from '@constants/Messages';
import { getAllDealerRoutes } from './Routes.helpers';

import './route.scss';

const breadcrumbItems = [
	{
		active: true,
		label: 'Mis planillas',
	},
];

const DealerRouteList = () => {
	const columns = [
		{
			name: 'dealer',
			text: 'Nombre',
		},
		{
			name: 'totalCarts',
			text: 'Envíos a realizar',
		},
	];

	const [rows, setRows] = useState([]);
	const navigate = useNavigate();

	// Refs
	const actionConfirmationRef = useRef(null);

	// Effects
	useEffect(() => {
		getAllDealerRoutes(({ routes }) => {
			setRows(routes);

			if (routes.length === 0) {
				Toast.warning(Messages.Error.noRows);
			}
		});
	}, []);

	// Handlers
	const handleRowClick = (id) => {
		actionConfirmationRef.current?.open(
			{ routeId: id },
			'route/openNew',
			'¿Seguro deseas comenzar el reparto?',
			null,
			(r) => navigate(`/planillas/abierta/${r.data.id}`),
		);
	};

	return (
		<>
			<ActionConfirmationModal ref={actionConfirmationRef} />
			<BreadCrumb items={breadcrumbItems} title='Mis planillas' />
			<div>
				<Col xs={11} className='container'>
					{rows.map((row, idx) => (
						<SimpleCard
							className='mb-4'
							key={idx}
							body={
								<Row className='m-0'>
									<Col className='mb-3' xs={12}>
										Planilla {row.deliveryDay}
									</Col>
									<Col xs={12}>
										<Table
											className='my-routes-table'
											columns={columns}
											rows={[{ dealer: row.dealer, totalCarts: row.totalCarts }]}
											bordered={false}
											striped={false}
											hover={false}
											onRowClick={() => handleRowClick(row.id)}
											clickable={true}
										/>
									</Col>
								</Row>
							}
						/>
					))}
				</Col>
			</div>
		</>
	);
};

export default DealerRouteList;
