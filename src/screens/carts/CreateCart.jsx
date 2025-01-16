import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Card, Input, PaymentMethodsDropdown, Spinner, Table } from '../../components';
import { useEffect, useState } from 'react';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { Messages } from '../../constants/Messages';
import { InitialFormStates } from '../../app/InitialFormStates';
import { useNavigate, useParams } from 'react-router';
import App from '../../app/App';

const initialForm = InitialFormStates.Cart;

const CreateCart = ({ isWatching = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(initialForm);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);

    const breadcrumbItems = [
        {
            active: false,
            url: '/bajadas/list',
            label: 'Bajadas',
        },
        {
            active: true,
            label: isWatching ? 'Ver' : id ? 'Editar' : 'Nuevo',
        },
    ];

    const soldColumns = [
        {
            name: 'name',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: 'soldQuantity',
            text: 'Cantidad',
            component: (props) => (
                <Input
                    numeric
                    isFloat
                    minValue={0}
                    placeholder='Cantidad'
                    type='number'
                    value={props.row.soldQuantity}
                    onChange={(value) =>
                        handleInputChange(
                            form.products.map((p) => {
                                if (p.id === props.row.id)
                                    return {
                                        ...p,
                                        soldQuantity: value,
                                    };
                                return p;
                            }),
                            'products',
                        )
                    }
                    {...props}
                />
            ),
            textCenter: true,
        },
    ];

    const returnedColumns = [
        {
            name: 'name',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: 'returnedQuantity',
            text: 'Cantidad',
            component: (props) => (
                <Input
                    numeric
                    isFloat
                    minValue={0}
                    placeholder='Cantidad'
                    type='number'
                    value={props.row.returnedQuantity}
                    onChange={(value) =>
                        handleInputChange(
                            form.products.map((p) => {
                                if (p.id === props.row.id)
                                    return {
                                        ...p,
                                        returnedQuantity: value,
                                    };
                                return p;
                            }),
                            'products',
                        )
                    }
                    {...props}
                />
            ),
            textCenter: true,
        },
    ];

    // Get form data
    useEffect(() => {
        if (id) {
            API.get('Cart/GetOne', { id }).then((r) => {
                setForm(() => ({
                    ...r.data,
                }));
                setLoading(false);
            });
        }
    }, [id]);

    const handleSubmit = async (url = '') => {
        if (submiting) return;

        if (
            !url &&
            (!form.name ||
                !form.address ||
                !form.phone ||
                (form.hasInvoice && (!form.invoiceType || !form.taxCondition || !form.cuit)))
        ) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmiting(true);

        let rq;

        if (!url) {
            rq = {
                name: form.name,
                address: form.address,
                phone: form.phone,
                observations: form.observations,
                dealerId: form.dealerId,
                deliveryDay: form.deliveryDay,
                hasInvoice: form.hasInvoice,
                invoiceType: form.invoiceType,
                taxCondition: form.taxCondition,
                cuit: form.cuit,
                products: form.products.map((x) => ({
                    productId: x.id,
                    quantity: x.quantity,
                })),
            };
            if (id) {
                rq.id = id;
            }
        } else if (url === 'UpdateClientProducts') {
            rq = {
                clientId: id,
                products: form.products.map((x) => ({
                    productId: x.id,
                    quantity: x.quantity,
                })),
            };
        } else if (url === 'UpdateClientSubscriptions') {
            rq = {
                clientId: id,
                subscriptionIds: form.subscriptions,
            };
        }

        API.post(`Client/${url || (id ? 'UpdateClientData' : 'Create')}`, rq)
            .then((r) => {
                Toast.success(r.message);
                if (!url) navigate('/clientes/list');
            })
            .catch((r) => {
                Toast.error(r.error.message);
            })
            .finally(() => {
                setSubmiting(false);
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

    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Bajadas' />
            <Col xs={11} className='container'>
                <>
                    <h3>
                        {`Bajada #${form.id} - ${form.client}`}
                    </h3>
                    <hr />
                </>
                <Row>
                    <Col sm={6}>
                        <Card
                            title='Productos bajados'
                            body={
                                loading ? (
                                    <Spinner />
                                ) : (
                                    <Table
                                        columns={soldColumns}
                                        rows={form.products}
                                    />
                                )
                            }
                        />
                    </Col>
                    <Col sm={6}>
                        <Card
                            title='Devolución de productos'
                            body={
                                loading ? (
                                    <Spinner />
                                ) : (
                                    <Table
                                        columns={returnedColumns}
                                        rows={form.products}
                                    />
                                )
                            }
                        />
                    </Col>
                    <Col sm={6}>
                        <Card
                            title='Entrega'
                            body={
                                loading ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <PaymentMethodsDropdown
                                            placeholder='Método de pago'
                                            value={form.paymentMethods}
                                        />
                                        <Input
                                            numeric
                                            isFloat
                                            minValue={0}
                                            placeholder='Cantidad'
                                            type='number'
                                            className='mt-3'
                                        // value={props.row.quantity} 
                                        />
                                    </>
                                )
                            }
                        />
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default CreateCart;
