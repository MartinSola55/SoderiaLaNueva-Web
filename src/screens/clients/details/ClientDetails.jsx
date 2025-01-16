import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb } from '../../../components';
import { InitialFormStates } from '../../../app/InitialFormStates';
import { buildProductsTable, getBreadcrumbItems, getClient, getProducts } from '../Clients.helpers';
import { ClientInfo, ClientProductsTable } from '../cards';
import App from '../../../app/App';

const ClientDetails = () => {
    const navigate = useNavigate();

    const params = useParams();
    const id = params.id;

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(InitialFormStates.Client);
    const [products, setProducts] = useState([]);

    // Effects
    useEffect(() => {
        if (!id)
            return;

        getProducts((products) => {
            setProducts(products);
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
                        />
                    </Col>
                    <Col sm={6}>
                        <ClientProductsTable
                            isWatching={true}
                            products={buildProductsTable(products, form.products)}
                            loading={loading}
                        />
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default ClientDetails;
