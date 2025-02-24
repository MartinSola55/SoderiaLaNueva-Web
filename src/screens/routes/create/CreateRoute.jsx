import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Card, Input, Table, Toast } from '@components';
import API from '@app/API';
import App from '@app/App';
import { Messages } from '@constants/Messages';
import { InitialFormStates } from '@app/InitialFormStates';
import { createColumns } from '../Routes.data';
import { getAllDealers } from '../Routes.helpers';
import RouteModal from '../modals/RouteModal';

const initialForm = InitialFormStates.StaticRoute;

const CreateRoute = () => {
	const breadcrumbItems = [
		{
			active: false,
			url: '/planillas/list',
			label: 'Planillas',
		},
		{
			active: true,
			label: 'Nuevo',
		},
	];

	const navigate = useNavigate();

	const modalRef = useRef();
	const params = useParams();
	const id = (params && params.id) || null;

	const [form, setForm] = useState(initialForm);
	const [submitting, setSubmitting] = useState(false);
	const [rows, setRows] = useState([]);
	const [filter, setFilter] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	// Get form data
	useEffect(() => {
		getAllDealers(currentPage, ({ dealers, totalCount }) => {
			setTotalCount(totalCount);
			setRows(dealers);

			if (dealers.length === 0) {
				Toast.warning(Messages.Error.noRows);
			}
		});
	}, [currentPage]);

	const handleSubmit = async (form) => {
		if (submitting) return;

		if (!form.deliveryDay || !form.dealerId) {
			Toast.warning(Messages.Validation.requiredFields);
			return;
		}

		setSubmitting(true);

		const rq = {
			deliveryDay: form.deliveryDay,
			dealerId: form.dealerId,
		};

		if (id) {
			rq.id = id;
		}

		API.post(`route/${id ? 'update' : 'createStaticRoute'}`, rq)
			.then((r) => {
				Toast.success(r.message);
				navigate('/planillas/list');
			})
			.catch((r) => {
				Toast.error(r.error?.message);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const handleInputChange = (value, field) => {
		setForm((prevForm) => {
			return {
				...prevForm,
				[field]: value,
			};
		});
	};

	const hanldeSelectRow = (v) => {
		const value = JSON.parse(v);

		handleInputChange(value.id, 'dealerId');
		modalRef.current?.open(
			(form) => handleSubmit(form),
			() => { },
			(v, n) => {
				handleInputChange(v, n);
			},
			value.fullName,
		);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleFilterRows = (value) => {
		setFilter(value.toLowerCase());
	};

	if (!App.isAdmin()) {
		return navigate('/notAllowed');
	}

	return (
		<>
			<BreadCrumb items={breadcrumbItems} title='Planillas' />
			<RouteModal ref={modalRef} form={form} />
			<div>
				<Col xs={11} className='container'>
					<Card
						title='Listado de repartidores'
						body={
							<>
								<Row>
									<Col xs={12} className='pe-3 mb-3'>
										<Input
											borderless
											placeholder='Buscar'
											helpText='Nombre de usuario o email'
											value={filter}
											onChange={handleFilterRows}
										/>
									</Col>
								</Row>
								<Table
									className='mb-5'
									columns={createColumns}
									rows={rows.filter((r) => r.fullName.toLowerCase().includes(filter) || r.email.toLowerCase().includes(filter))}
									emptyTableMessage='No se encontraron repartidores'
									clickable={true}
									pagination={true}
									currentPage={currentPage}
									totalCount={totalCount}
									onPageChange={handlePageChange}
									onRowClick={(_, v) => hanldeSelectRow(v)}
								/>
							</>
						}
					/>
				</Col>
			</div>
		</>
	);
};

export default CreateRoute;
