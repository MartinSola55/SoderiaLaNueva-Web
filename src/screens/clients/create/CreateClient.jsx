import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { InitialFormStates } from '@app/InitialFormStates';
import { ActionConfirmationModal, BreadCrumb, Toast } from '@components';
import App from '@app/App';
import { ClientInfo, ClientProductsTable } from '../cards';
import { createClient, getBreadcrumbItems, getProducts, validateClient } from '../Clients.helpers';

const CreateClient = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState(InitialFormStates.Client);

	const modalRef = useRef(null);

	// Effects
	useEffect(() => {
		getProducts((products) => {
			setForm((prevForm) => ({
				...prevForm,
				products
			}));
			setLoading(false);
		});
	}, []);

	// Handlers
	const handleSubmit = async () => {
		if (submitting)
			return;

		const errorMessage = validateClient(form);

		if (errorMessage) {
			Toast.warning(errorMessage);
			return;
		}

		setSubmitting(true);
		createClient(form,
			() => { navigate(App.isAdmin() ? '/clientes/list' : '/') },
			(r) => {
				if (r.data) {
					modalRef.current.open(
						null,
						'',
						'¿Esta queriendo ingresar este cliente?',
						`${r.data.name} - ${r.data.address} - ${r.data.phone} ${r.data.cuit ? '- ' + r.data.cuit : ''}.
						En caso de confirmar se redijirá a dicho cliente, caso contrario revise los datos ingresados`,
						() => { navigate('/clientes/' + r.data.id) }
					)
				}
			},
			() => { setSubmitting(false) }
		);
	};

	const handleInputChange = (value, field) => {
		setForm((prevForm) => {
			return {
				...prevForm,
				[field]: value,
			};
		});
	};

	const handleProductsChange = (props, value) => {
		const products = form.products.map((x) => {
			if (x.id === props.row.id)
				return {
					...x,
					quantity: value,
				};
			return x;
		});

		handleInputChange(products, 'products');
	};

	return (
		<>
			<ActionConfirmationModal ref={modalRef} />
			<BreadCrumb items={getBreadcrumbItems('Nuevo')} title='Clientes' />
			<Col xs={11} className='container'>
				<Row>
					<Col sm={6}>
						<ClientInfo
							form={form}
							loading={loading}
							submitting={submitting}
							onSubmit={handleSubmit}
							isWatching={false}
							onInputChange={(v, n) => handleInputChange(v, n, setForm)}
						/>
					</Col>
					<Col sm={6}>
						<ClientProductsTable
							products={form.products}
							loading={loading}
							isWatching={false}
							onProductsChange={(props, value) => handleProductsChange(props, value, form, setForm)}
						/>
					</Col>
				</Row>
			</Col>
		</>
	);
};

export default CreateClient;
