import { Button, Col, Row } from 'react-bootstrap';
import { BreadCrumb, Card, CellNumericInput, Spinner, Table } from '../../components';
import { useEffect, useState } from 'react';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { InitialFormStates } from '../../app/InitialFormStates';
import { useNavigate, useParams } from 'react-router';
import App from '../../app/App';
import { formatCurrency, formatPaymentMethods } from '../../app/Helpers';
import { getPaymentMethodRows, getProductsRows, getSubscriptionProductsRows, onPaymentMethodsChange, onProductsChange } from './Cart.helpers.js';
import { Loader } from 'rsuite';

const initialForm = InitialFormStates.Cart;

const CreateCart = ({ isWatching = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);
    const [paymentMethods, setPaymentMethods] = useState([]);

    const breadcrumbItems = [
        {
            active: false,
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
            formatter: (_, row) => `${row.name} - ${formatCurrency(row.price)}`
        },
        {
            name: 'soldQuantity',
            text: 'Cantidad',
            component: (props) => <CellNumericInput {...props} value={props.row.soldQuantity} maxValue={undefined} onChange={(v) => onProductsChange(props, v, form, handleInputChange, 'soldQuantity')} />,
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
            component: (props) => <CellNumericInput {...props} value={props.row.returnedQuantity} maxValue={undefined} onChange={(v) => onProductsChange(props, v, form, handleInputChange, 'returnedQuantity')} />,
            textCenter: true,
        },
    ];

    const subscriptionColumns = [
        {
            name: 'name',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: 'subscriptionQuantity',
            text: 'Cantidad',
            component: (props) => <CellNumericInput {...props} value={props.row.subscriptionQuantity} maxValue={undefined} onChange={(v) => onProductsChange(props, v, form, handleInputChange, 'subscriptionQuantity')} />,
            textCenter: true,
        },
    ];

    const paymentMethodsColumns = [
        {
            name: 'name',
            text: 'Método',
            textCenter: true,
        },
        {
            name: 'amount',
            text: 'Cantidad',
            component: (props) => <CellNumericInput {...props} maxValue={undefined} value={props.row.amount} onChange={(v) => onPaymentMethodsChange(props, v, form, handleInputChange)} />,
            textCenter: true,
        },
    ];

    // Get form data
    useEffect(() => {
        if (id) {
            API.get('cart/getOne', { id }).then((r) => {
                setForm(r.data);
                setLoading(false);
            });
        }
        API.get('cart/getPaymentMethodsCombo').then((r) => {
            setPaymentMethods(formatPaymentMethods(r.data.items));
        });
    }, [id]);

    const handleSubmit = async () => {
        if (submitting)
            return;

        setSubmitting(true);

        let rq = {
            products: form.products.filter(x => x.soldQuantity !== '' && x.returnedQuantity !== '' && x.subscriptionQuantity !== '').map((x) => ({
                productTypeId: x.productTypeId,
                soldQuantity: x.soldQuantity !== '' ? x.soldQuantity : 0,
                returnedQuantity: x.returnedQuantity !== '' ? x.returnedQuantity : 0,
                subscriptionQuantity: x.subscriptionQuantity !== '' ? x.subscriptionQuantity : 0,

            })),
            paymentMethods: form.paymentMethods.filter(x => x.amount !== '').map((x) => ({
                paymentMethodId: x.paymentMethodId,
                amount: x.amount,
            })),
        };

        if (id) {
            rq.id = id;
        }

        API.post('cart/update', rq)
            .then((r) => {
                setTimeout(() => {
                    Toast.success(r.message);
                }, 20);
                navigate(`/planillas/abierta/${r.data.routeId}`);
            })
            .catch((r) => {
                Toast.error(r.error.message);
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
                            title='Productos del abono'
                            body={loading ? <Spinner /> :
                                <Table
                                    columns={subscriptionColumns}
                                    rows={getSubscriptionProductsRows(form)}
                                />
                            }
                        />
                    </Col>
                    <Col sm={6}>
                        <Card
                            title='Productos bajados'
                            body={loading ? <Spinner /> :
                                <Table
                                    columns={soldColumns}
                                    rows={getProductsRows(form)}
                                />
                            }
                        />
                    </Col>
                    <Col sm={6}>
                        <Card
                            title='Devolución de productos'
                            body={loading ? <Spinner /> :
                                <Table
                                    columns={returnedColumns}
                                    rows={form.products.filter(x => x.name)}
                                />
                            }
                        />
                    </Col>
                    <Col sm={6}>
                        <Card
                            title='Entrega'
                            body={loading ? <Spinner /> :
                                <Table
                                    rows={getPaymentMethodRows(paymentMethods, form)}
                                    columns={paymentMethodsColumns}
                                />
                            }
                        />
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

export default CreateCart;
