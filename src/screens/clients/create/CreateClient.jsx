import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { InitialFormStates } from '@app/InitialFormStates';
import { BreadCrumb, Toast } from '@components';
import { Messages } from '@constants/Messages';
import App from '@app/App';
import { ClientInfo, ClientProductsTable } from '../cards';
import { createClient, getBreadcrumbItems, getProducts } from '../Clients.helpers';

const CreateClient = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState(InitialFormStates.Client);

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

        if (!form.name || !form.address.lat || !form.address.lon || !form.phone || (form.hasInvoice && (!form.invoiceType || !form.taxCondition || !form.cuit))) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

		if (form.products.every(x => x.quantity === '')) {
			Toast.warning("El cliente debe tener al menos un producto asociado.");
			return;
		}

        setSubmitting(true);
        createClient(form,
            () => { navigate(App.isAdmin() ? '/clientes/list' : '/') },
			() => { },
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
