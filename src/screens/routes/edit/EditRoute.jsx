import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { faArrowLeft, faRemove } from '@fortawesome/free-solid-svg-icons';
import { BreadCrumb, Button, Card, Input, Loader, Spinner, Table, Toast } from '@components';
import { InitialFormStates } from '@app/InitialFormStates';
import { formatClients, formatDeliveryDay } from '@app/Helpers';
import { Messages } from '@constants/Messages';
import App from '@app/App';
import API from '@app/API';
import { editNotSelectedColumns, editSelectedColumns } from '../Routes.data';
import { getAllClientList } from '../Routes.helpers';

const initialForm = InitialFormStates.RouteClients;

const EditRoute = ({ isWatching = false }) => {
	const navigate = useNavigate();

	const params = useParams();
	const id = (params && params.id) || null;

	const [form, setForm] = useState(initialForm);
	const [submitting, setSubmitting] = useState(false);
	const [loading, setLoading] = useState(id ? true : false);
	const [clients, setClients] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [filter, setFilter] = useState({ selected: '', notSelected: '' });

	const breadcrumbItems = [
		{
			active: false,
			url: '/planillas/list',
			label: 'Planillas',
		},
		{
			active: true,
			label: isWatching ? 'Ver' : 'Editar',
		},
	];

	const selectedColumns = [
		...editSelectedColumns,
		{
			name: 'remove',
			text: 'Quitar',
			component: (props) => (
				<Button
					icon={faRemove}
					disabled={isWatching}
					className='bg-danger p-0 border-0'
					style={{ minWidth: '35px' }}
					iconStyle={{ marginLeft: '0px' }}
					onClick={() => handleChangeRow(props.row, true)}
				></Button>
			),
			className: 'text-center',
		},
	];

	const notSelectedColumns = [
		{
			name: 'add',
			text: 'Seleccionar',
			component: (props) => (
				<Button
					icon={faArrowLeft}
					className='p-0'
					style={{ minWidth: '35px' }}
					iconStyle={{ marginLeft: '0px' }}
					onClick={() => handleChangeRow(props.row, false)}
				></Button>
			),
			className: 'text-center',
		},
		...editNotSelectedColumns
	];

	const selectedRows = form.clients.filter((r) => r.name.toLowerCase().includes(filter.selected));

	const notSelectedRows = clients.filter((r) => r.name.toLowerCase().includes(filter.notSelected));

	// Effects
	// Get form data
	useEffect(() => {
		if (id) {
			API.get('route/getStaticRouteClients', { id })
				.then((r) => {
					setForm(() => ({
						...r.data,
						clients: formatClients(r.data.clients),
					}));
					setLoading(false);
				})
				.catch(() => {
					navigate('/notFound');
				});
		}
	}, [id, navigate]);

	// Get clients
	useEffect(() => {
		if (!isWatching) {
			getAllClientList(currentPage, id, ({ clients, totalCount }) => {
				setTotalCount(totalCount);
				setClients(clients);

				if (clients.length === 0) {
					Toast.warning(Messages.Error.noEntities('clientes'));
				}
			});
		}
	}, [currentPage, id, isWatching]);

	const handleSubmit = async () => {
		if (submitting) return;

		setSubmitting(true);

		const rq = {
			routeId: id,
			clients: form.clients.map((x) => parseInt(x.id)),
		};

		API.post('route/updateClients', rq)
			.then((r) => {
				Toast.success(r.message);
				navigate(`/planillas/${id}`);
			})
			.catch((r) => {
				Toast.error(r.error?.message);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const handleChangeRow = (row, selected) => {
		if (selected) {
			setClients((prevClients) => [...prevClients, row]);
			setForm((prevForm) => ({
				...prevForm,
				clients: prevForm.clients.filter((c) => parseInt(c.id) !== parseInt(row.id)),
			}));
		} else {
			setForm((prevForm) => ({
				...prevForm,
				clients: [...prevForm.clients, row],
			}));
			setClients((prevClients) =>
				prevClients.filter((c) => parseInt(c.id) !== parseInt(row.id)),
			);
		}
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleFilterRows = (value, name) => {
		setFilter((prevFilters) => ({
			...prevFilters,
			[name]: value.toLowerCase(),
		}));
	};

	if (!App.isAdmin()) {
		return navigate('/notAllowed');
	}

	return (
		<>
			<BreadCrumb items={breadcrumbItems} title='Clientes' />
			<Col xs={12} className='row mx-auto px-2'>
				<Col xs={11} className='container'>
					{!isWatching && (
						<>
							<h3>
								{`Agregar cliente al reparto del ${formatDeliveryDay(form.deliveryDay)} de ${form.dealer}`}
							</h3>
							<hr />
						</>
					)}
					<Row>
						<Col sm={6}>
							<Card
								title='Clientes seleccionados'
								body={
									loading ? (
										<Spinner />
									) : (
										<Row className='align-items-center'>
											<Col xs={12}>
												<Input
													borderless
													placeholder='Buscar'
													helpText='Nombre'
													value={filter.selected}
													onChange={(v) => handleFilterRows(v, 'selected')}
												/>
												<Table
													rows={selectedRows}
													columns={selectedColumns}
													emptyTableMessage='No hay clientes seleccionados en la ruta'
												></Table>
											</Col>
										</Row>
									)
								}
								footer={
									selectedRows.length > 0 && (
										<div className='d-flex justify-content-end'>
											<Button
												variant='secondary'
												className='me-2'
												onClick={() => navigate('/planillas/list')}
											>
												Volver
											</Button>
											{!isWatching && (
												<Button onClick={handleSubmit} disabled={submitting}>
													{submitting ? <Loader /> : (id ? 'Actualizar' : 'Crear')}
												</Button>
											)}
										</div>
									)
								}
							/>
						</Col>
						<Col sm={6}>
							<Card
								title='Listado de clientes'
								body={
									loading ? (
										<Spinner />
									) : (
										<Row className='align-items-center'>
											<Col xs={12}>
												<Col xs={12} className='pe-3 mb-3'>
													<Input
														borderless
														placeholder='Buscar'
														helpText='Nombre'
														value={filter.notSelected}
														onChange={(v) => handleFilterRows(v, 'notSelected')}
													/>
												</Col>
												<Table
													rows={notSelectedRows}
													emptyTableMessage='No se encontraron más clientes'
													columns={notSelectedColumns}
													totalCount={totalCount}
													currentPage={currentPage}
													onPageChange={handlePageChange}
												></Table>
											</Col>
										</Row>
									)
								}
							/>
						</Col>
					</Row>
				</Col>
			</Col>
		</>
	);
};

export default EditRoute;
