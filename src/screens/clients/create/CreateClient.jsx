import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb } from '../../../components';
import Toast from '../../../components/Toast/Toast';
import { Messages } from '../../../constants/Messages';
import { InitialFormStates } from '../../../app/InitialFormStates';
import { createClient, getBreadcrumbItems, getProducts, handleInputChange, handleProductsChange } from '../Clients.helpers';
import { ClientInfo, ClientProductsTable } from '../cards';
import App from '../../../app/App';

const CreateClient = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [submiting, setSubmiting] = useState(false);
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
        if (submiting)
            return;

        if (!form.name || !form.address || !form.phone || (form.hasInvoice && (!form.invoiceType || !form.taxCondition || !form.cuit))) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmiting(true);
        createClient(form,
            () => { navigate('/clientes/list') },
            () => { setSubmiting(false) }
        );
    };

    // Render
    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems('Nuevo')} title='Clientes' />
            <Col xs={11} className='container'>
                <Row>
                    <Col sm={6}>
                        <ClientInfo
                            form={form}
                            loading={loading}
                            submiting={submiting}
                            onSubmit={handleSubmit}
                            onInputChange={(v, n) => handleInputChange(v, n, setForm)}
                        />
                    </Col>
                    <Col sm={6}>
                        <ClientProductsTable
                            products={form.products}
                            loading={loading}
                            onProductsChange={(props, value) => handleProductsChange(props, value, form, setForm)}
                        />
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default CreateClient;
