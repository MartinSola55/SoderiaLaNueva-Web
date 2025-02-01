import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Spinner, Toast } from '../../../components';
import { useEffect, useRef, useState } from 'react';
import API from '../../../app/API';
import { useNavigate, useParams } from 'react-router';
import { formatCartProducts, formatCartSubscriptionProducts, formatDeliveryDay, formatOptions, formatPaymentMethods } from '../../../app/Helpers';
import SimpleCard from '../../../components/SimpleCard/SimpleCard';
import { CartPaymentStatuses, CartStatuses } from '../../../constants/Cart';
import { InitialFormStates } from '../../../app/InitialFormStates';
import LastProductsModal from '../lastProducts/LastProductsModal';
import ActionConfirmationModal from '../../../components/shared/ActionConfirmationModal/ActionConfirmationModal';
import { getTotalCart, updateAfterSubmit } from '../Routes.helpers';
import App from '../../../app/App';
import { DynamicRouteGeneralData } from './DynamicRouteGeneralData';
import '../route.scss';
import { DynamicRouteFilters } from './DynamicRouteFilters';
import { DynamicRouteCartDetailCard } from '../cards/DynamicRouteCartDetailCard';

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
            setPaymentMethods(formatPaymentMethods(r.data.items));
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
                    carts: prevForm.carts.filter(x => x.status.toLocaleLowerCase() !== CartStatuses.Pending.toLocaleLowerCase()),
					isClosed: true,
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
            Toast.warning("La cantidad de productos debe ser mayor a cero.");
            return;
        };
		
        if (paymentMethods.some(x =>  x.amount === 0))
		{
            Toast.warning("La cantidad de dinero debe ser mayor a cero.");
            return;
        };

		if (paymentMethods.reduce((sum, x) => sum + x.amount, 0) !== getTotalCart(rq.id, cartProductRows))
            Toast.warning("Alerta, la cantidad total de dinero no coincide con el total");
			//TODO, poner un modal capaz (Modal de Toaster)

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
            paymentMethods: paymentMethods.filter(x => x.amount !== '').map((x) => {
				return ({
					id: x.id,
					amount: x.amount
				})
			})
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
	
	const getFilteredCarts = (carts) => {
		const cartStatusFilter = (cart) => filters.cartStatus.length === 0 || filters.cartStatus.includes(cart.status);
		const cartProductTypes = (cart) => filters.productType.length === 0 || cart.products.every(p => filters.productType.includes(p.productTypeId));
		const cartPaymentStatus = (cart) => {
			const total = getTotalCart(cart.id, cartProductRows.find(x => x.id === cart.id)?.products);
			return filters.cartPaymentStatus.length === 0 || filters.cartPaymentStatus.length === 2 || (filters.cartPaymentStatus[0] === CartPaymentStatuses.Pending ? total === 0 : total !== 0)
		};
		const cartTransfersTypes = (cart) => {
			if (!filters.cartTransfersType.length) return true;

			return cart.paymentMethods.some(p => 
				filters.cartTransfersType.includes(p.productTypeId) && p.amount !== ''
			);
		};

		return carts.filter(cart => (cartStatusFilter(cart) && cartProductTypes(cart) && (App.isAdmin() || cartTransfersTypes(cart)) && cartPaymentStatus(cart)));
	}

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
                                    {getFilteredCarts(form.carts).map((cart, idx) => {
                                        return (
                                            <Col className='mb-4' xs={12} key={idx}>
                                                <SimpleCard
                                                    body={
                                                        <>
															<DynamicRouteCartDetailCard 
																cart={cart}
																setForm={setForm}
																actionConfirmationRef={actionConfirmationRef}
																lastProductsRef={lastProductsRef}
																setCartSubscriptionProductRows={setCartSubscriptionProductRows}
																setCartProductRows={setCartProductRows}
																cartSubscriptionProductRows={cartSubscriptionProductRows}
																cartProductRows={cartProductRows}
																handleSubmit={handleSubmit}
																form={form}
																setPaymentMethods={setPaymentMethods}
																paymentMethods={paymentMethods}
															/>
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
									{!form.isClosed && (
										<Button
											className='me-4'
											onClick={handleCloseRoute}
											variant='warning'
										>
											Cerrar planilla
										</Button>
									)}
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
