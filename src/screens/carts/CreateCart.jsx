import { Button, Col, Row } from 'react-bootstrap';
import { BreadCrumb, Card, CellNumericInput, Spinner, Table } from '../../components';
import { useEffect, useState } from 'react';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { InitialFormStates } from '../../app/InitialFormStates';
import { useNavigate, useParams } from 'react-router';
import App from '../../app/App';
import { formatPaymentMethods } from '../../app/Helpers';
import { getPaymentMethodRows, onPaymentMethodsChange, onQuantityChange } from './Cart.helpers.js';
import { Loader } from 'rsuite';

const initialForm = InitialFormStates.Cart;

const CreateCart = ({ isWatching = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(initialForm);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [subscriptionProductsRows, setSubscriptionProductsRows] = useState([]);

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
            component: (props) => (<CellNumericInput {...props} value={props.row.soldQuantity} onChange={(v) => onQuantityChange(props, v, form, handleInputChange, 'soldQuantity')}/>),
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
            component: (props) => (<CellNumericInput {...props} value={props.row.returnedQuantity} onChange={(v) => onQuantityChange(props, v, form, handleInputChange, 'returnedQuantity')}/>),
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
            component: (props) => (<CellNumericInput {...props} value={props.row.subscriptionQuantity} onChange={(v) => onQuantityChange(props, v, form, handleInputChange, 'subscriptionQuantity')}/>),
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
            component: (props) => (<CellNumericInput {...props} maxValue={undefined} value={props.row.amount} onChange={(v) => onPaymentMethodsChange(props, v, form, handleInputChange)}/>),
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
				setSubscriptionProductsRows(r.data.subscriptionProducts)
                setLoading(false);
            });
        }
        API.get('Cart/GetPaymentStatusesCombo').then((r) => {
            setPaymentMethods(formatPaymentMethods(r.data.items));
        });
    }, [id]);

    const handleSubmit = async () => {
        if (submiting) return;

		if (form.products.some(x => (x.soldQuantity === '' && x.returnedQuantity !== '') || (x.returnedQuantity === '' && x.soldQuantity !== ''))) {
			Toast.warning("Para eliminar un producto, ambos campos deben estar vacíos.");
			return;
		};
		
		setSubmiting(true);

		let rq = {
			products: form.products.filter(x => x.soldQuantity !== '' && x.returnedQuantity !== '').map((x) => ({
				productTypeId: x.productTypeId,
				soldQuantity: x.soldQuantity,
				returnedQuantity: x.returnedQuantity,
			})),
			// TODO no entiendo
			// subscriptionProducts: form.products.filter(x => x.subscriptionQuantity !== '').map((x) => ({
			// 	productTypeId: x.id,
			// 	quantity: x.subscriptionQuantity,
			// })),
			paymentMethods: form.paymentMethods.filter(x => x.amount !== '').map((x) => ({
				paymentMethodId: x.paymentMethodId,
				amount: x.amount,
			})),
		};

		if (id) {
			rq.id = id;
		}

        API.post('Cart/Update', rq)
            .then((r) => {
                Toast.success(r.message);
				// TODO, cual hacemos?? Que vaya para atras o se quede donde está
                // navigate(`/planillas/abierta/${r.data?.routeId}`);
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

	const getSubscriptionProductsRows = () => {
		return form.subscriptionProducts?.map((sp) => {
			const existingSubscriptionProduct = form.products.find(x => x.productTypeId === sp.typeId);
			return {
				productTypeId: sp.typeId,
				name: `${sp.name} - Disponible: ${sp.available} `,
				subscriptionQuantity: existingSubscriptionProduct?.subscriptionQuantity || ""
			};
		})
	};

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
                            body={
                                loading ? (
                                    <Spinner />
                                ) : (
                                    <Table
                                        columns={subscriptionColumns}
                                        rows={getSubscriptionProductsRows()}
                                    />
                                )
                            }
                        />
                    </Col>
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
										<Table
											rows={getPaymentMethodRows(paymentMethods, form)}
											columns={paymentMethodsColumns}
										/>
                                    </>
                                )
                            }
                        />
                    </Col>
                </Row>
				<Col className='text-end'>
					<Button onClick={handleSubmit} disabled={submiting}>
						{submiting ? <Loader /> : 'Actualizar' }
					</Button>
				</Col>
            </Col>
        </>
    );
};

export default CreateCart;
