import { Dropdown as DropdownBS, Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Dropdown, Input, ProductTypesDropdown, Spinner, Table, Toast } from '../../components';
import { useEffect, useRef, useState } from 'react';
import API from '../../app/API';
import { useNavigate, useParams } from 'react-router';
import App from '../../app/App';
import { InitialFormStates } from '../../app/InitialFormStates';
import { formatCartProducts, formatCartSubscriptionProducts, formatComboItems, formatDebt, formatDeliveryDay, formatOptions } from '../../app/Helpers';
import { faCheck, faClock, faDollarSign, faHouse, faPhone, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import LastProductsModal from './LastProductsModal';
import SimpleCard from '../../components/SimpleCard/SimpleCard';
import RouteInfoCard from './RouteInfoCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LastProductsButton from './LastProductsButton';
import ActionConfirmationModal from '../../components/shared/ActionConfirmationModal/ActionConfirmationModal';
import { CartStatuses } from '../../constants/Cart';

import './route.scss';

const breadcrumbItems = [
    {
        active: false,
        url: '/planillas/list',
        label: 'Planillas',
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

    const columns = [
        {
            name: 'name',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: 'soldQuantity',
            text: 'Vendidos',
            textCenter: true,
        },
        {
            name: 'returnedQuantity',
            text: 'Devueltos',
            textCenter: true,
        },
        {
            name: 'stock',
            text: 'Stock del cliente',
            textCenter: true,
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

    const cartProductColumns = (pending) => [
        {
            name: pending ? 'description' : 'name',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: pending ? 'quantity' : 'soldQuantity',
            text: pending ? 'Bajó' : 'Cantidad',
            component: (props) => (
                <Input
                    numeric
                    isFloat
                    minValue={0}
                    placeholder='Cantidad'
                    type='number'
                    value={pending ? props.row.quantity : props.row.soldQuantity}
                    onChange={(value) => (
                        setCartProductRows((prevState) => {
                            return prevState.map((cart) => {
                                if (cart.id === props.row.cartId) {
                                    const updatedProducts = cart.products.map((p) => {
                                        if (p.id === props.row.id) {

                                            return {
                                                ...p,
                                                quantity: parseInt(value, 10),
                                            };
                                        }
                                        return p;
                                    });
                                    return {
                                        ...cart,
                                        products: updatedProducts,
                                    };
                                }
                                return cart;
                            });
                        })
                    )}
                    {...props}
                    disabled={!pending}
                />
            ),
            className: 'text-center',
        },
    ];

    const cartReturdesProductColumns = [
        {
            name: 'name',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: 'quantity',
            text: 'Cantidad',
            component: (props) => (
                <Input
                    numeric
                    isFloat
                    minValue={0}
                    placeholder='Cantidad'
                    type='number'
                    value={props.row.returnedQuantity}
                    {...props}
                    disabled={true}
                />
            ),
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
            component: (props) => (
                <Input
                    numeric
                    isFloat
                    minValue={0}
                    placeholder='Cantidad'
                    type='number'
                    value={pending ? props.row.quantity : props.row.subscriptionQuantity}
                    onChange={(value) => (
                        setCartSubscriptionProductRows((prevState) => {
                            return prevState.map((cart) => {
                                if (cart.id === props.row.cartId) {
                                    const updatedSubscriptionProducts = cart.subscriptionProducts.map((sp) => {
                                        if (sp.id === props.row.id) {

                                            return {
                                                ...sp,
                                                quantity: parseInt(value, 10),
                                            };
                                        }
                                        return sp;
                                    });
                                    return {
                                        ...cart,
                                        subscriptionProducts: updatedSubscriptionProducts,
                                    };
                                }
                                return cart;
                            });
                        })
                    )}
                    {...props}
                    disabled={!pending}
                />
            ),
            className: 'text-center',
        },
    ];

    const countNotPendingCarts = form.carts.filter((cart) => cart.status.toLocaleLowerCase() !== 'pendiente'.toLocaleLowerCase())?.length;

    const getTotalDebt = () => {
        let totalDebt = 0;
        form.carts.forEach((cart) => (totalDebt = totalDebt + cart.client.debt));
        return totalDebt;
    };

    const getTotalCart = (id) => {
        let total = 0;
        cartProductRows.find(x => x.id === id)?.products.forEach((product) => (total = total + product.quantity * product.price));
        return total;
    };

    const getCartTitleClassname = (status) => {
        switch (status.toLocaleLowerCase()) {
            case CartStatuses.Pending.toLocaleLowerCase():
                return ''
            case CartStatuses.Confirmed.toLocaleLowerCase():
                return 'text-success'
            case CartStatuses.Absent.toLocaleLowerCase():
            case CartStatuses.DidNotNeed.toLocaleLowerCase():
            case CartStatuses.Holiday.toLocaleLowerCase():
                return 'text-warning'
            default:
                return ''
        }
    }

    const getProductStock = (productId) => {
        let finalStock = 0;
        form.carts.forEach((cart) => {
            cart.client.products.forEach((prod) => {
                if (parseInt(prod.productId) === parseInt(productId))
                    finalStock = finalStock + prod.stock;
            });
        })
        return finalStock;
    }

    const getIsSkippedCart = (status) => {
        return status.toLocaleLowerCase() === CartStatuses.Absent.toLocaleLowerCase() || status.toLocaleLowerCase() === CartStatuses.DidNotNeed.toLocaleLowerCase() || status.toLocaleLowerCase() === CartStatuses.Holiday.toLocaleLowerCase()
    }

    const getMoneyCollected = () => {
        let total = 0;
        form.carts.forEach((cart) => {
            cart.paymentMethods.forEach((pm) => {
                total = total + pm.amount
            })
        });
        return total + form.transfersAmount
    }

    const getSoldProductsRows = () => {
        return form.carts
            .flatMap(cart => cart.products)
            .reduce((acc, product) => {
                const existing = acc.find(item => item.productId === product.productId);
                if (existing) {
                    existing.soldQuantity += product.soldQuantity;
                    existing.returnedQuantity += product.returnedQuantity;
                } else {

                    acc.push({
                        productId: product.productId,
                        stock: getProductStock(product.productId),
                        name: product.name,
                        soldQuantity: product.soldQuantity,
                        returnedQuantity: product.returnedQuantity,
                    });
                }
                return acc;
            }, []);
    }

    // Refs
    const lastProductsRef = useRef(null);
    const actionConfirmationRef = useRef(null);

    // Effects
    useEffect(() => {
        if (!App.isAdmin()) {
            return navigate('/notAllowed');
        }
    }, [navigate]);

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
    const handleOpenLastProducts = (lastProducts) => {
        lastProductsRef.current?.open(() => { }, lastProducts);
    };

    const handleOpenUpdateCartStatus = (value, cartId, message = '') => {
        actionConfirmationRef.current?.open(
            {
                id: cartId,
                status: value
            },
            'Cart/UpdateStatus',
            `¿Está seguro que el cliente ${message}?`,
            null,
            () => {
                setForm(prevForm => ({
                    ...prevForm,
                    carts: prevForm.carts.map(cart =>
                        cart.id === cartId
                            ? { ...cart, status: value }
                            : cart
                    ),
                }));
            });
    };

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
            });
    };

    const handleFilterRows = (value, name) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleSubmit = async (rq = {}) => {
        if (submitting) return;

        // if (
        //     !url &&
        //     (!form.name ||
        //         !form.address ||
        //         !form.phone ||
        //         (form.hasInvoice && (!form.invoiceType || !form.taxCondition || !form.cuit)))
        // ) {
        //     Toast.warning(Messages.Validation.requiredFields);
        //     return;
        // }

        setSubmitting(true);

        rq = {
            ...rq,
            products: cartProductRows.find((cr) => cr.id === rq.id)?.products.map((p) => ({
                productTypeId: p.id,
                soldQuantity: p.quantity,
                returnedQuantity: p.quantity
            })),
            subscriptionProducts: cartSubscriptionProductRows.find((cspr) => cspr.id === rq.id)?.subscriptionProducts.map((p) => ({
                productTypeId: p.id,
                quantity: p.quantity,
            })),
            paymentMethods: [
                {
                    id: paymentMethods.find(x => x.label.toLocaleLowerCase() === "Efectivo".toLocaleLowerCase()).value,
                    amount: getTotalCart(rq.id)
                }
            ]
        };

        API.post('Cart/Confirm', rq)
            .then((r) => {
                Toast.success(r.message);
                setForm(prevForm => ({
                    ...prevForm,
                    carts: prevForm.carts.map(cart =>
                        cart.id === r.data.id
                            ? { ...cart, status: CartStatuses.Confirmed }
                            : cart
                    ),
                }));
            })
            .catch((r) => {
                Toast.error(r.error.message);
            })
            .finally(() => {
                setSubmitting(false);
            });
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
            <Col xs={12} className='container-fluid'>
                <Row>
                    <Col xs={12} lg={6}>
                        <SimpleCard
                            body={
                                <Row>
                                    <Col xs={12} className='text-end'>
                                        <Button className='mb-2 mb-md-0'>Precio dispenser</Button>
                                    </Col>
                                </Row>
                            }
                        />
                    </Col>
                    <Col className='mt-4 mt-lg-0' xs={12} lg={6}>
                        <SimpleCard
                            body={
                                <>
                                    <p className='mb-1'>{`Total de repartos: ${form.carts.length}`}</p>
                                    <p className='mb-1'>{`Deuda total: $${getTotalDebt()}`}</p>
                                </>
                            }
                        />
                    </Col>
                    <Col xs={12} xl={6} className='mt-5'>
                        <Card
                            title='Productos vendidos'
                            header={<p className='mb-0'>06/01/2025</p>}
                            body={<Table columns={columns} rows={getSoldProductsRows()}></Table>}
                        />
                    </Col>
                    <Col xs={12} xl={6} className='mt-5'>
                        <Row>
                            <Col xs={12} md={6} className='mb-4'>
                                <SimpleCard
                                    body={
                                        <RouteInfoCard
                                            icon={faDollarSign}
                                            bgColor='rgb(116, 96, 238)'
                                            title={`$${getMoneyCollected()}`}
                                            description='Recaudado en el día'
                                        />
                                    }
                                />
                            </Col>
                            <Col xs={12} md={6} className='mb-4'>
                                <SimpleCard
                                    body={
                                        <RouteInfoCard
                                            icon={faShoppingBag}
                                            bgColor='rgb(252, 75, 108)'
                                            title={`$${form.spentAmount}`}
                                            description='Gasto en el día'
                                        />
                                    }
                                />
                            </Col>
                            <Col xs={12} md={6} className='mb-4'>
                                <SimpleCard
                                    body={
                                        <RouteInfoCard
                                            icon={faCheck}
                                            bgColor='rgb(38, 198, 218)'
                                            title={countNotPendingCarts}
                                            description='Clientes visitados'
                                        />
                                    }
                                />
                            </Col>
                            <Col xs={12} md={6} className='mb-4 mb-lg-0'>
                                <SimpleCard
                                    body={
                                        <RouteInfoCard
                                            icon={faClock}
                                            bgColor='rgb(255, 178, 43)'
                                            title={form.carts.length - countNotPendingCarts}
                                            description='Clientes por visitar'
                                        />
                                    }
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Card
                    title={`Repartos de ${form.dealer} para el  ${formatDeliveryDay(form.deliveryDay)}`}
                    className='mt-4'
                    body={
                        loading ? (
                            <Spinner />
                        ) : (
                            <>
                                <Row>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <Dropdown
                                            placeholder='Estado'
                                            items={cartStatuses}
                                            isMulti
                                            value={filters.cartStatus}
                                            onChange={(options) => handleFilterRows(options.map(o => o.value), 'cartStatus')}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <ProductTypesDropdown
                                            value={filters.productType}
                                            isMulti
                                            onChange={(options) => handleFilterRows(options.map(o => o.value), 'productType')}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <Dropdown
                                            placeholder='Tipo de servicio'
                                            items={cartTransfersTypes}
                                            isMulti
                                            value={filters.cartTransfersType}
                                            onChange={(options) => handleFilterRows(options.map(o => o.value), 'cartTransfersType')}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <Dropdown
                                            placeholder='Estado del pago'
                                            items={cartPaymentStatuses}
                                            isMulti
                                            value={filters.cartPaymentStatus}
                                            onChange={(options) => handleFilterRows(options.map(o => o.value), 'cartPaymentStatus')}
                                        />
                                    </Col>
                                    <Col xs={12} className='pe-3 mb-3'>
                                        <Input
                                            borderless
                                            placeholder='Buscar'
                                            helpText='Nombre'
                                            value={filters.text}
                                            onChange={(v) => handleFilterRows(v.toLowerCase(), 'text')}
                                        />
                                    </Col>
                                    {form.carts.filter(cart => (!filters.cartStatus.length || filters.cartStatus.includes(cart.status)
                                        && (!filters.productType.length || filters.productType.includes(cart.products.map(p => parseInt(p.productId))))
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
                                                                        {`Bajada ${cart.id} - Creada: ${cart.createdAt} - Últ. modif: ${cart.updatedAt} - `}
                                                                        {formatDebt(cart.client.debt)}
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
                                                                    className='d-flex flex-md-column justify-content-between'
                                                                    xs={12}
                                                                    md={2}
                                                                >
                                                                    <LastProductsButton
                                                                        className='me-auto me-md-0 ms-md-auto'
                                                                        onClick={() =>
                                                                            handleOpenLastProducts(cart.lastProducts)
                                                                        }
                                                                    />
                                                                    {
                                                                        !getIsSkippedCart(cart.status) && (
                                                                            <DropdownBS className='ms-auto'>
                                                                                <DropdownBS.Toggle as={Button} variant="primary" id="dropdown-basic">
                                                                                    Acción
                                                                                </DropdownBS.Toggle>

                                                                                <DropdownBS.Menu align="top">
                                                                                    <DropdownBS.Item onClick={() => handleOpenUpdateCartStatus(CartStatuses.Absent, cart.id, 'estaba ausente')}>{CartStatuses.Absent}</DropdownBS.Item>
                                                                                    <DropdownBS.Item onClick={() => handleOpenUpdateCartStatus(CartStatuses.DidNotNeed, cart.id, 'no necesitaba')}>{CartStatuses.DidNotNeed}</DropdownBS.Item>
                                                                                    <DropdownBS.Item onClick={() => handleOpenUpdateCartStatus(CartStatuses.Holiday, cart.id, 'estaba de vacaciones')}>{CartStatuses.Holiday}</DropdownBS.Item>
                                                                                </DropdownBS.Menu>
                                                                            </DropdownBS>
                                                                        )
                                                                    }
                                                                </Col>
                                                            </Row>
                                                            <hr />
                                                            {
                                                                !getIsSkippedCart(cart.status) && (
                                                                    <Row>
                                                                        {
                                                                            cart.client.subscriptionProducts.length && (
                                                                                <Col xs={12} md={4}>
                                                                                    <h4>Abonos</h4>
                                                                                    <Table
                                                                                        className='mt-1'
                                                                                        columns={cartSubscriptionProductsColumns(cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase())}
                                                                                        rows={cart.products.length ? cart.products : cartSubscriptionProductRows.find((cr) => cr.id === cart.id)?.subscriptionProducts}
                                                                                    />
                                                                                </Col>
                                                                            )
                                                                        }
                                                                        <Col xs={12} md={cart.client.subscriptionProducts.length ? 4 : 6}>
                                                                            <h4>Bajada</h4>
                                                                            <Table
                                                                                className='mt-1'
                                                                                columns={cartProductColumns(cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase())}
                                                                                rows={cart.products.length ? cart.products : cartProductRows.find((cr) => cr.id === cart.id)?.products}
                                                                            />
                                                                        </Col>
                                                                        {
                                                                            cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase() && (
                                                                                <Col xs={12} md={cart.client.subscriptionProducts.length ? 4 : 6}>
                                                                                    <h4>Total: ${getTotalCart(cart.id)}</h4>
                                                                                    <Input
                                                                                        className='mt-1'
                                                                                        placeholder='Total'
                                                                                        isFloat
                                                                                        numeric
                                                                                        type='number'
                                                                                        value={getTotalCart(cart.id)}
                                                                                    />
                                                                                </Col>
                                                                            )
                                                                        }
                                                                        {
                                                                            cart.status.toLocaleLowerCase() === CartStatuses.Confirmed.toLocaleLowerCase() && (
                                                                                <>
                                                                                    <Col xs={12} md={cart.client.subscriptionProducts.length ? 4 : 6}>
                                                                                        <h4>Devoluciones</h4>
                                                                                        <Table
                                                                                            className='mt-1'
                                                                                            columns={cartReturdesProductColumns}
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
                                                                                            onClick={() => navigate(`/bajadas/${cart.id}`)}
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
                        <div className='d-flex justify-content-end'>
                            <Button
                                onClick={() => navigate(`/planillas/edit/${id}`)}
                                variant='primary'
                            >
                                Editar planilla
                            </Button>
                        </div>
                    }
                />
            </Col>
        </>
    );
};

export default DynamicRouteDetails;
