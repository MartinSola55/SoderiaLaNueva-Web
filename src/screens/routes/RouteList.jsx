import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Button, Card, DeliveryDayDropdown, Label, Table, Toast } from '../../components';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { getDayIndex } from '../../app/Helpers';
import App from '../../app/App';
import { listColumns } from './Routes.data';
import { getAllRoutes } from './Routes.helpers';
import { Messages } from '../../constants/Messages';
import ActionConfirmationModal from '../../components/shared/ActionConfirmationModal/ActionConfirmationModal';

const breadcrumbItems = [
	{
		active: true,
		label: 'Planillas',
	},
];

const RouteList = () => {
	const navigate = useNavigate();

	const routeColumns = [
		...listColumns,
		{
			name: 'actions',
			text: 'Acciones',
			component: (props) => <ActionButtons entity='planilla' {...props} />,
			className: 'text-center',
		},
	];

	const [rows, setRows] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [dayFilter, setDayFilter] = useState(getDayIndex());

	// Refs
	const actionConfirmationRef = useRef(null);

	// Effects
	useEffect(() => {
		if (!App.isAdmin()) {
			return navigate('/notAllowed');
		}
	}, [navigate]);

	useEffect(() => {
		getAllRoutes(dayFilter, ({ routes, totalCount }) => {
			setTotalCount(totalCount);
			setRows(routes);

			if (routes.length === 0) {
				Toast.warning(Messages.Error.noRows);
			}
		});
	}, [currentPage, dayFilter]);

	// Handlers
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleDayFilterChange = (v) => {
		setDayFilter(v);
	};

	const handleRenewAllSubscriptions = () => {
		actionConfirmationRef.current?.open(
			{},
			'subscription/renewAll',
			'Esta acción no se puede revertir',
			'¿Seguro deseas renovar TODOS los abonos? Esto incluye los clientes de todo el sistema. Si un abono ya se renovó, no se volverá a renovar',
			() => { },
		);
	};

	const updateDeletedRow = (id) => {
		setRows((prevRow) => prevRow.filter((row) => row.id !== id));
	};

	return (
		<>
			<ActionConfirmationModal ref={actionConfirmationRef} />
			<BreadCrumb items={breadcrumbItems} title='Planillas' />
			<div>
				<Col xs={11} className='container'>
					<Card
						title='Planillas'
						body={
							<>
								<Row>
									<Col xs={12} sm={6} lg={3} className='mb-3'>
										<Label>Día</Label>
										<DeliveryDayDropdown
											placeholder='Dia'
											value={dayFilter}
											onChange={(v) => handleDayFilterChange(v)}
										/>
									</Col>
								</Row>
								<Table
									className='mb-5'
									columns={routeColumns}
									rows={rows}
									emptyTableMessage='No se encontraron planillas para el día seleccionado'
									pagination={true}
									currentPage={currentPage}
									totalCount={totalCount}
									onPageChange={handlePageChange}
									onUpdate={updateDeletedRow}
								/>
							</>
						}
						footer={
							<div className='d-flex justify-content-between'>
								<Button
									onClick={handleRenewAllSubscriptions}
									variant='primary'>
									Renovar TODOS los abonos
								</Button>
								<Button
									onClick={() => navigate('/planillas/new')}
									variant='primary'>
									Nueva planilla
								</Button>
							</div>
						}
					/>
				</Col>
			</div>
		</>
	);
};

export default RouteList;
