import { Button, Col, Row } from 'react-bootstrap';
import { BreadCrumb } from '../../components';
import { useCallback, useEffect, useState } from 'react';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { InitialFormStates } from '../../app/InitialFormStates';
import { useNavigate, useParams } from 'react-router';
import App from '../../app/App';
import { Loader } from 'rsuite';
import { getBreadcrumbItems } from './Cart.data.js';
import { updateCart } from './Cart.server.js';
import { SubscriptionProductsTable } from './tables/SubscriptionProductsTable.jsx';
import { ProductsTable } from './tables/ProductsTable.jsx';
import { ReturnedProductsTable } from './tables/ReturnedProductsTable.jsx';
import { PaymentMethodsTable } from './tables/PaymentMethodsTable.jsx';

const initialForm = InitialFormStates.Cart;

const UpdateCart = () => {
	const navigate = useNavigate();

	const params = useParams();
	const id = (params && params.id) || null;

	const [form, setForm] = useState(initialForm);
	const [submitting, setSubmitting] = useState(false);
	const [loading, setLoading] = useState(id ? true : false);

	// Get form data
	useEffect(() => {
		if (id) {
			API.get('cart/getOne', { id }).then((r) => {
				setForm(r.data);
				setLoading(false);
			});
		}
	}, [id]);

	// Handlers
	const handleTableChange = (newCart) => {
		setForm(newCart);
	};

	const handleSubmit = useCallback(() => {
		if (submitting)
			return;

		setSubmitting(true);

		updateCart(
			form,
			// onSuccess
			(message) => {
				navigate(`/planillas/abierta/${form.routeId}`);
				setTimeout(() => {
					Toast.success(message);
				}, 100);
			},
			// onError
			(message) => {
				Toast.error(message);
				setSubmitting(false);
			}
		);
	}, [form, navigate, submitting]);

	if (!App.isAdmin())
		return navigate('/notAllowed');

	return (
		<>
			<BreadCrumb items={getBreadcrumbItems(form.routeId)} title='Bajadas' />
			<Col xs={11} className='container'>
				<h3>{`Bajada #${form.id || 'x'} - ${form.client || 'cliente'}`}</h3>
				<hr />
				<Row>
					{form.subscriptionProducts.length > 0 &&
						<Col sm={6}>
							<SubscriptionProductsTable
								form={form}
								loading={loading}
								onTableChange={handleTableChange} />
						</Col>
					}
					<Col sm={6}>
						<ProductsTable
							form={form}
							loading={loading}
							onTableChange={handleTableChange} />
					</Col>
					<Col sm={6}>
						<ReturnedProductsTable
							form={form}
							loading={loading}
							onTableChange={handleTableChange} />
					</Col>
					<Col sm={6}>
						<PaymentMethodsTable
							form={form}
							loading={loading}
							onTableChange={handleTableChange} />
					</Col>
				</Row>
				<Col className='text-end'>
					<Button onClick={handleSubmit} disabled={submitting}>
						{submitting ? <Loader /> : 'Actualizar'}
					</Button>
				</Col>
			</Col>
		</>
	);
};

export default UpdateCart;
