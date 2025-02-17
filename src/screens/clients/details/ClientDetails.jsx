import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Toast } from '../../../components';
import { InitialFormStates } from '../../../app/InitialFormStates';
import { buildProductsSalesTable, buildProductsTable, buildSubscriptionsProductsTable, getBreadcrumbItems, getClient, getProducts, getSubscriptions, handleInputChange, handleProductsChange, handleSubscriptionsChange, updateClient, updateClientProducts, updateClientSubscriptions } from '../Clients.helpers';
import { ClientInfo, ClientProductHistoryTable, ClientProductSalesTable, ClientProductsTable, ClientSubscriptionProductsTable } from '../cards';
import App from '../../../app/App';
import { Messages } from '../../../constants/Messages';

const ClientDetails = () => {
	const navigate = useNavigate();

	const params = useParams();
	const id = params.id;

	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState(InitialFormStates.Client);
	const [products, setProducts] = useState([]);
	const [subscriptions, setSubscriptions] = useState([]);
	const [submitting, setSubmitting] = useState(false);

	// Effects
	useEffect(() => {
		if (!id)
			return;

		getProducts((products) => {
			setProducts(products);
		});
		getSubscriptions((subscriptions) => {
			setSubscriptions(subscriptions);
		});
		getClient(
			id,
			// onSuccess
			(client) => {
				setForm(client);
				setLoading(false);
			},
			// onError
			() => { navigate('/notFound') }
		);
	}, [id, navigate]);

	// Render
	if (!App.isAdmin() || !id) {
		return navigate('/notAllowed');
	}

	// Handlers
	const handleClientInfoSubmit = async () => {
		if (submitting)
			return;

		if (!form.name || !form.address || !form.phone || (form.hasInvoice && (!form.invoiceType || !form.taxCondition || !form.cuit))) {
			Toast.warning(Messages.Validation.requiredFields);
			return;
		}

		setSubmitting(true);
		updateClient(form,
			() => { setSubmitting(false) },
			() => { setSubmitting(false) }
		);
	};

	const handleClientProductsSubmit = async () => {
		if (submitting)
			return;

		setSubmitting(true);
		updateClientProducts(form,
			() => { setSubmitting(false) },
			() => { setSubmitting(false) }
		);
	};

	const handleAddressChange = (address) => {
		setForm((prevForm) => {
			return ({
				...prevForm,
				address: {
					...address
				}
			})
		});
	};

	const handleClientSubscriptionProductsSubmit = async () => {
		if (submitting)
			return;

		setSubmitting(true);
		updateClientSubscriptions(form,
			() => { setSubmitting(false) },
			() => { setSubmitting(false) }
		);
	};

	return (
		<>
			<BreadCrumb items={getBreadcrumbItems('Detalles')} title='Clientes' />
			<Col xs={11} className='container'>
				<Row>
					<Col sm={6}>
						<ClientInfo
							isWatching={true}
							form={form}
							loading={loading}
							submitting={submitting}
							onSubmit={handleClientInfoSubmit}
							onInputChange={(v, n) => handleInputChange(v, n, setForm)}
							onAddressChange={handleAddressChange}
						/>
					</Col>
					<Col sm={6}>
						<Col xs={12}>
							<ClientProductsTable
								isWatching={true}
								products={buildProductsTable(products, form.products)}
								submitting={submitting}
								loading={loading}
								onSubmit={handleClientProductsSubmit}
								onProductsChange={(props, value) => handleProductsChange(props, value, form, setForm)}
							/>
						</Col>
						<Col xs={12}>
							<ClientSubscriptionProductsTable
								isWatching={true}
								subscriptions={buildSubscriptionsProductsTable(subscriptions, form.subscriptions)}
								submitting={submitting}
								loading={loading}
								onSubmit={handleClientSubscriptionProductsSubmit}
								onSubscriptionsChange={(props, value) => handleSubscriptionsChange(props, value, form, setForm)}
							/>
						</Col>
					</Col>
					<Col lg={6}>
						<ClientProductHistoryTable
							products={form.productHistory}
							loading={loading}
						/>
					</Col>
					<Col lg={6}>
						<ClientProductSalesTable
							products={buildProductsSalesTable(form.salesHistory)}
							loading={loading}
						/>
					</Col>
				</Row>
			</Col>
		</>
	);
};

export default ClientDetails;
