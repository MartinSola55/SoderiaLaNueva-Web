import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, CellNumericInput, Input, Spinner, Table, Toast } from '../../../components';
import { useEffect, useRef, useState } from 'react';
import API from '../../../app/API';
import { useNavigate, useParams } from 'react-router';
import { formatCartProducts, formatCartSubscriptionProducts, formatComboItems, formatCurrency, formatDebt, formatDeliveryDay, formatOptions, getDebtTextColor, handleOpenLastProducts } from '../../../app/Helpers';
import { faHouse, faPhone } from '@fortawesome/free-solid-svg-icons';
import SimpleCard from '../../../components/SimpleCard/SimpleCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CartStatuses } from '../../../constants/Cart';
import { InitialFormStates } from '../../../app/InitialFormStates';
import LastProductsModal from '../lastProducts/LastProductsModal';
import LastProductsButton from '../lastProducts/LastProductsButton';
import ActionConfirmationModal from '../../../components/shared/ActionConfirmationModal/ActionConfirmationModal';
import { getCartTitleClassname, getIsSkippedCart, getTotalCart, updateAfterSubmit } from '../Routes.helpers';
import { onProductsChange, onSubscriptionProductsChange } from '../Routes.helpers';
import App from '../../../app/App';
import { DynamicRouteGeneralData } from './DynamicRouteGeneralData';
import '../route.scss';
import { DynamicRouteFilters } from './DynamicRouteFilters';
import { CartActionButton } from './CartActionButton';

const breadcrumbItems = [
    {
        active: false,
        url: App.isAdmin() ? '/planillas/list' : '/planillas/misPlanillas',
        label: App.isAdmin() ? 'Planillas' : 'Mis planillas',
    },
    {
        active: true,
        label: 'Detalles',
    },
];
const initialForm = InitialFormStates.RouteDetails;
const initialFilters = InitialFormStates.CartFilters;

const DynamicRouteDetails = () => {
    // Consts
    const navigate = useNavigate();
    const params = useParams();
    const id = (params && params.id) || null;
	
	const cartReturnedProductColumns = [
        {
            name: 'name',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: 'quantity',
            text: 'Cantidad',
			component: (props) => { return <span>{props.row.returnedQuantity !== '' ? props.row.returnedQuantity : '-'}</span>},
            className: 'text-center',
        },
    ];
	
    const cartProductColumns = (pending) => [
        {
            name: pending ? 'description' : 'name',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: pending ? 'quantity' : 'soldQuantity',
            text: pending ? 'Bajó' : 'Cantidad',
			component: (props) => {
                if (!pending)
                    return <span>{props.row.soldQuantity !== '' ? props.row.soldQuantity : '-'}</span>
                else
                    return <CellNumericInput {...props} value={props.row.quantity} maxValue={undefined} onChange={(v) => onProductsChange(props, v, setCartProductRows)} />
            },
            className: 'text-center',
        },
    ];

    const cartSubscriptionProductsColumns = (pending) => [
        {
            name: pending ? 'description' : 'name',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: pending ? 'quantity' : 'subscriptionQuantity',
            text: pending ? 'Bajó' : 'Cantidad',
			component: (props) => {
                if (!pending)
                    return <span>{props.row.subscriptionQuantity !== '' ? props.row.subscriptionQuantity : '-'}</span>
                else
                    return <CellNumericInput {...props} value={props.row.quantity} maxValue={undefined} onChange={(v) => onSubscriptionProductsChange(props, v, setCartSubscriptionProductRows)} />
            },
            className: 'text-center',
        },
    ];

    // States
	const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [filters, setFilters] = useState(initialFilters);
    const [cartStatuses, setCartStatuses] = useState([]);
    const [cartTransfersTypes, setCartTransfersTypes] = useState([]);
    const [cartPaymentStatuses, setCartPaymentStatuses] = useState([]);
    const [cartProductRows, setCartProductRows] = useState([]);
    const [cartSubscriptionProductRows, setCartSubscriptionProductRows] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);


	// Refs
    const lastProductsRef = useRef(null);
    const actionConfirmationRef = useRef(null);

    // Effects
    useEffect(() => {
        API.get('Cart/GetFormData').then((r) => {
            setCartStatuses(formatOptions(r.data.cartStatuses));
            setCartTransfersTypes(formatOptions(r.data.cartTransfersTypes));
            setCartPaymentStatuses(formatOptions(r.data.cartPaymentStatuses));
        });
        API.get('Cart/GetPaymentStatusesCombo').then((r) => {
            setPaymentMethods(formatComboItems(r.data.items));
        });
        API.get('Route/GetDynamicRoute', { id }).then((r) => {
            setForm(() => ({
                ...r.data,
            }));
            setCartProductRows(() => {
                return r.data.carts.map((cart) => ({
                    id: cart.id,
                    products: formatCartProducts(cart.client.products, cart.id),
                }));
            });
            setCartSubscriptionProductRows(() => {
                // TODO: Preguntar por typeId repetidos
                return r.data.carts.map((cart) => ({
                    id: cart.id,
                    subscriptionProducts: formatCartSubscriptionProducts(Object.values(
                        cart.client.subscriptionProducts.reduce((acc, item) => {
                            if (!acc[item.typeId]) {
                                acc[item.typeId] = { ...item };
                            } else {
                                acc[item.typeId].available += item.available;
                            }
                            return acc;
                        }, {})
                    ), cart.id)
                }));
            });
            setLoading(false);
        });
    }, [id]);

    //  Handlers
    const handleOpenRestoreCartStatus = (cartId) => {
        actionConfirmationRef.current?.open(
            {
                id: cartId,
            },
            'Cart/RestoreStatus',
            `Esta acción no se puede revertir`,
            '¿Seguro deseas restablecer el estado de la bajada?',
            () => {
                setForm(prevForm => ({
                    ...prevForm,
                    carts: prevForm.carts.map(cart =>
                        cart.id === cartId
                            ? { ...cart, status: CartStatuses.Pending }
                            : cart
                    ),
                }));
			}
		);
    };

    const handleDeleteCart = (cartId) => {
        actionConfirmationRef.current?.open(
            {
                id: cartId,
            },
            'Cart/Delete',
            `Esta acción no se puede revertir`,
            '¿Seguro deseas eliminar esta bajada? Esto restablecerá el stock y el saldo del cliente',
            () => {
                setForm(prevForm => ({
                    ...prevForm,
                    carts: prevForm.carts.filter(x => x.id !== cartId)
                }));
			}
		);
    };

    const handleCloseRoute = () => {
        actionConfirmationRef.current?.open(
            {
                routeId: id,
            },
            'Route/Close',
            `Esta acción no se puede revertir`,
            '¿Seguro deseas cerrar esta planilla? Esto eliminará TODAS las planillas PENDIENTES',
            () => {
                setForm(prevForm => ({
                    ...prevForm,
                    carts: prevForm.carts.filter(x => x.status.toLocaleLowerCase() !== CartStatuses.Pending.toLocaleLowerCase())
                }));
			}
		);
    };
    const handleDeleteRoute = () => {
        actionConfirmationRef.current?.open(
            {},
            'Route/Delete',
            `Esta acción no se puede revertir`,
            '¿Seguro deseas eliminar esta planilla? Esto restablecerá el stock y el saldo del cliente',
            () => {}
		);
    };

    const handleSubmit = async (rq = {}) => {
        if (submitting) return;

        if (cartProductRows.find(x => x.id === rq.id)?.products.some(y =>  y.quantity === 0) || cartSubscriptionProductRows.find(x => x.id === rq.id)?.subscriptionProducts.some(y =>  y.quantity === 0))
		{
            Toast.warning("La cantidad debe ser mayor a cero.");
            return;
        };

        setSubmitting(true);
		
        rq = {
            ...rq,
            products: cartProductRows.find((cr) => cr.id === rq.id)?.products.filter(x => !Number.isNaN(x.quantity) && x.quantity !== '').map((p) => ({
                productTypeId: p.id,
                soldQuantity: p.quantity,
                returnedQuantity: p.quantity
            })),
            subscriptionProducts: cartSubscriptionProductRows.find((cspr) => cspr.id === rq.id)?.subscriptionProducts.filter(x => !Number.isNaN(x.quantity) && x.quantity !== '').map((p) => ({
                productTypeId: p.id,
                quantity: p.quantity,
            })),
            paymentMethods: [
                {
                    id: paymentMethods.find(x => x.label.toLocaleLowerCase() === "Efectivo".toLocaleLowerCase())?.value,
                    amount: getTotalCart(rq.id, cartProductRows)
                }
            ]
        };

        API.post('Cart/Confirm', rq)
            .then((r) => {
                Toast.success(r.message);
				updateAfterSubmit(form, r.data.id, rq, paymentMethods, setForm);
            })
            .catch((r) => {
                Toast.error(r.error?.message);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

	const showTable = (cart, name, quantity) => {
		const hasClientItems = name ? cart.client[name]?.length > 0 : true;
		const hasValidProducts = 
			cart.products.length === 0 || 
			cart.products.some(product => product[quantity] !== 0);
		
		return hasClientItems && hasValidProducts;
	};	 
	 
	const getTableStyleColumns = (cart) => {
		return (showTable(cart, 'subscriptionProducts', 'subscriptionQuantity') && showTable(cart, null, 'soldQuantity')) ? 4 : 6
	};	  

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Planillas' />
            <LastProductsModal ref={lastProductsRef} />
            <ActionConfirmationModal
                disabled={submitting}
                ref={actionConfirmationRef}
                title=' ¿Está seguro que el cliente no estaba?'
            />
            <Col xs={11} className='container-fluid'>
				{App.isAdmin() && (
					<Row>	
						<DynamicRouteGeneralData form={form}/>
					</Row>
				)}
                <Card
                    title={`Repartos de ${form.dealer} para el  ${formatDeliveryDay(form.deliveryDay)}`}
                    className='mt-4'
                    body={
                        loading ? (
                            <Spinner />
                        ) : (
                            <>
                                <Row>
									<DynamicRouteFilters 
										filters={filters}
										setFilters={setFilters}
										cartStatuses={cartStatuses}
										cartTransfersTypes={cartTransfersTypes}
										cartPaymentStatuses={cartPaymentStatuses}
									/>
                                    {form.carts.filter(cart => ((filters.cartStatus.length === 0 || filters.cartStatus.includes(cart.status)) && (filters.productType.length === 0 || filters.productType.includes(cart.products.map(p => parseInt(p.productId)))) 
                                    )).map((cart, idx) => {
                                        return (
                                            <Col className='mb-4' xs={12} key={idx}>
                                                <SimpleCard
                                                    body={
                                                        <>
                                                            <Row>
                                                                <Col xs={12} md={10}>
                                                                    <h4 className={getCartTitleClassname(cart.status)}>{`${cart.client.name} #${cart.client.id} - ${cart.status}`}</h4>
                                                                    <p className='mb-1'>
                                                                        {`Bajada ${cart.id} - Creada: ${cart.createdAt} ${cart.updatedAt ? ' - Últ. modif: ' + cart.updatedAt : ''} - `}
                                                                        <span className={getDebtTextColor(cart.client.debt)}>{formatDebt(cart.client.debt)}</span>
                                                                    </p>
                                                                    <p className='mb-1'>
                                                                        <FontAwesomeIcon
                                                                            icon={faHouse}
                                                                        />
                                                                        {` ${cart.client.address} - `}
                                                                        <FontAwesomeIcon
                                                                            icon={faPhone}
                                                                        />
                                                                        {` ${cart.client.phone}`}
                                                                    </p>
                                                                    <ul>
                                                                        {cart.client.products.map(
                                                                            (product, idx) => (
                                                                                <li key={idx}>
                                                                                    <p className='mb-1'>
                                                                                        {`${product.name} - Stock: ${product.stock}`}
                                                                                    </p>
                                                                                </li>
                                                                            ),
                                                                        )}
                                                                    </ul>
                                                                </Col>
                                                                <Col
                                                                    className='d-flex flex-md-column justify-content-between align-items-end'
                                                                    xs={12}
                                                                    md={2}
                                                                >
                                                                    <LastProductsButton
                                                                        onClick={() =>handleOpenLastProducts(lastProductsRef, cart.client.lastProducts)}
                                                                    />
                                                                    {
                                                                        cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase() && (
																			<CartActionButton 
																				actionConfirmationRef={actionConfirmationRef}
																				setForm={setForm}
																				cart={cart}
																			/>
                                                                        )
                                                                    }
                                                                </Col>
                                                            </Row>
                                                            <hr />
                                                            {
                                                                !getIsSkippedCart(cart.status) && (
                                                                    <Row>
                                                                        {
                                                                           showTable(cart, 'subscriptionProducts', 'subscriptionQuantity') && (
                                                                                <Col xs={12} md={getTableStyleColumns(cart)}>
                                                                                    <h4>Abonos</h4>
                                                                                    <Table
                                                                                        className='mt-1'
                                                                                        columns={cartSubscriptionProductsColumns(cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase())}
                                                                                        rows={cart.products.length > 0 ? cart.products.filter(x => x.subscriptionQuantity !== 0)  : cartSubscriptionProductRows.find((cr) => cr.id === cart.id)?.subscriptionProducts}
                                                                                    />
                                                                                </Col>
                                                                            )
                                                                        }
																		{
																			showTable(cart, null, 'soldQuantity') && (
																			<Col xs={12} md={getTableStyleColumns(cart)}>
																				<h4>Bajada</h4>
																				<Table
																					className='mt-1'
																					columns={cartProductColumns(cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase())}
																					rows={cart.products.length > 0 ? cart.products.filter(x => x.soldQuantity !== 0) : cartProductRows.find((cr) => cr.id === cart.id)?.products}
																				/>
																			</Col>
																			)
																		}
                                                                        {cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase() && (
                                                                                <Col xs={12} md={getTableStyleColumns(cart)}>
                                                                                    <h4>Total: {formatCurrency(getTotalCart(cart.id, cartProductRows))}</h4>
                                                                                    <Input
                                                                                        className='mt-1'
                                                                                        placeholder='Total'
                                                                                        isFloat
                                                                                        numeric
                                                                                        type='number'
                                                                                        value={getTotalCart(cart.id, cartProductRows)}
                                                                                    />
                                                                                </Col>
																			)
																		}
                                                                        {cart.status.toLocaleLowerCase() === CartStatuses.Confirmed.toLocaleLowerCase() && (
                                                                                <>
                                                                                    <Col xs={12} md={getTableStyleColumns(cart)}>
                                                                                        <h4>Devoluciones</h4>
                                                                                        <Table
                                                                                            className='mt-1'
                                                                                            columns={cartReturnedProductColumns}
                                                                                            rows={cart.products}
                                                                                        />
                                                                                    </Col>
                                                                                    <hr />
                                                                                    <Col xs={12}>
                                                                                        {cart.paymentMethods.map((pm, idx) => {
                                                                                            return <ul key={idx}>
                                                                                                <li>
                                                                                                    <p>
                                                                                                        {`${pm.name}: $${pm.amount} `}
                                                                                                    </p>
                                                                                                </li>
                                                                                            </ul>
                                                                                        })}
                                                                                    </Col>
                                                                                    <hr />
                                                                                </>
                                                                            )
                                                                        }
                                                                    </Row>
                                                                )
                                                            }
                                                            <Row>
                                                                <Col className='text-end mt-4' xs={12}>
                                                                    {
                                                                        !getIsSkippedCart(cart.status) ? (
                                                                            cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase() ? (
                                                                                <Button
                                                                                    onClick={() => handleSubmit({ id: cart.id })}
                                                                                >
                                                                                    Confirmar bajada
                                                                                </Button>
                                                                            )
																			: (
																				<>
																					<Button
																						onClick={() => handleDeleteCart(cart.id)}
																						className='bg-danger border-0 me-3'
																					>
																						Eliminar
																					</Button>
																					<Button
																						onClick={() => navigate(`/bajadas/${cart.id}`)}
																					>
																						Ediar bajada
																					</Button>
																				</>
																			)
                                                                        )
																		: (
																			<Button
																				className='bg-danger border-0'
																				onClick={() => handleOpenRestoreCartStatus(cart.id)}
																			>
																				Cancelar estado
																			</Button>
																		)
                                                                    }
                                                                </Col>
                                                            </Row>
                                                        </>
                                                    }
                                                />
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </>
                        )
                    }
                    footer={
                        <div className='d-flex justify-content-between'>
							{App.isAdmin() && (
								<div>
									<Button
										className='me-4'
										onClick={handleCloseRoute}
										variant='warning'
									>
										Cerrar planilla
									</Button>
									<Button
										onClick={handleDeleteRoute}
										variant='danger'
									>
										Eliminar planilla
									</Button>
								</div>
							)}
                            <Button
                                onClick={() => navigate(`/planillas/edit/${id}`)}
                                variant='primary'
                            >
                                Agregar fuera de reparto
                            </Button>
                        </div>
                    }
                />
            </Col>
        </>
    );
};

export default DynamicRouteDetails;
