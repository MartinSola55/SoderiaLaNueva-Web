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
    const [submiting, setSubmiting] = useState(false);

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
        getClient(id, (client) => {
            setForm(client);
            setLoading(false);
        });
    }, [id]);

    // Render
    if (!App.isAdmin() || !id) {
        return navigate('/notAllowed');
    }

	// Handlers
	const handleClientInfoSubmit = async () => {
		if (submiting)
			return;

		if (!form.name || !form.address || !form.phone || (form.hasInvoice && (!form.invoiceType || !form.taxCondition || !form.cuit))) {
			Toast.warning(Messages.Validation.requiredFields);
			return;
		}

		setSubmiting(true);
		updateClient(form,
			() => { setSubmiting(false) },
			() => { setSubmiting(false) }
		);
	};

	const handleClientProductsSubmit = async () => {
		if (submiting)
			return;

		setSubmiting(true);
		updateClientProducts(form,
			() => { setSubmiting(false) },
			() => { setSubmiting(false) }
		);
	};

	const handleClientSubscriptionProductsSubmit = async () => {
		if (submiting)
			return;

		setSubmiting(true);
		updateClientSubscriptions(form,
			() => { setSubmiting(false) },
			() => { setSubmiting(false) }
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
							submiting={submiting}
							onSubmit={handleClientInfoSubmit}
							onInputChange={(v, n)=> handleInputChange(v, n, setForm)}
                        />
                    </Col>
					<Col sm={6}>
						<Row className='h-100'>
							<Col xs={12}>
								<ClientProductsTable
									isWatching={true}
									products={buildProductsTable(products, form.products)}
									submiting={submiting}
									loading={loading}
									onSubmit={handleClientProductsSubmit}
									onProductsChange={(props, value) => handleProductsChange(props, value, form, setForm)}
								/>
							</Col>
							<Col xs={12}>
								<ClientSubscriptionProductsTable
									isWatching={true}
									subscriptions={buildSubscriptionsProductsTable(subscriptions, form.subscriptions)}
									submiting={submiting}
									loading={loading}
									onSubmit={handleClientSubscriptionProductsSubmit}
									onSubscriptionsChange={(props, value) => handleSubscriptionsChange(props, value, form, setForm)}
								/>
							</Col>

						</Row>
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
