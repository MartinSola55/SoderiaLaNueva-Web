import { useCallback, useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import { ActionConfirmationModal, BreadCrumb, Button, Card, SimpleCard, Spinner, Toast } from '@components';
import { InitialFormStates } from '@app/InitialFormStates';
import { formatDeliveryDay, formatOptions } from '@app/Helpers';
import { CartStatuses } from '@constants/Cart';
import API from '@app/API';
import App from '@app/App';
import LastProductsModal from '../lastProducts/LastProductsModal';
import { buildPaymentMethods, getFilteredCarts } from '../Routes.helpers';
import { DynamicRouteGeneralData } from './DynamicRouteGeneralData';
import { cartServiceTypes } from '../Routes.data';
import { DynamicRouteCartDetailCard } from './cards/DynamicRouteCartDetailCard';
import { DynamicRouteFilters } from './DynamicRouteFilters';
import { confirmCart, getTotalSold, updateAfterSubmit } from './DynamicRouteDetails.helpers';
import MapModal from '../modals/MapModal';
import '../route.scss';

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
	const [paymentMethods, setPaymentMethods] = useState([]);
	const [dropOffPoints, setDropOffPoints] = useState([]);
	const [visitedPoints, setVisitedPoints] = useState([]);

	// Refs
	const lastProductsRef = useRef(null);
	const actionConfirmationRef = useRef(null);
	const mapModalRef = useRef(null);

	// Effects
	useEffect(() => {
		API.get('cart/getFormData')
			.then((r) => {
				setCartStatuses(formatOptions(r.data.cartStatuses));
				setCartTransfersTypes(formatOptions(r.data.cartTransfersTypes));
				setCartPaymentStatuses(formatOptions(r.data.cartPaymentStatuses));
			});
		API.get('cart/getPaymentMethodsCombo')
			.then((r) => {
				setPaymentMethods(buildPaymentMethods(r.data.items));
			});
		API.get('route/getDynamicRoute', { id })
			.then((r) => {
				setForm(r.data);
				const points = r.data.carts.map((cart) => {
					const client = cart.client;
					if (client && client.address.lat && client.address.lon) {
						const isVisited = cart.status === CartStatuses.Confirmed;
						const color = isVisited ? 'green' : 'yellow';
						return {
							id: cart.id,
							lng: client.address.lon,
							lat: client.address.lat,
							color,
							status: cart.status,
							clientName: client.name,
							isVisited: isVisited,
						};
					}
					return null;
				}).filter(point => point !== null);
				setVisitedPoints(() => points.filter(point => point.isVisited));
				setDropOffPoints(() => points.filter(point => !point.isVisited));
				setLoading(false);
			})
			.catch(() => {
				navigate('/notFound');
			});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, navigate]);

	//  Handlers
	const handleCloseRoute = () => {
		actionConfirmationRef.current.open(
			{ routeId: id },
			'route/close',
			'Esta acción no se puede revertir',
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

	const handleDeleteCart = (id) => {
		actionConfirmationRef.current.open(
			{ id },
			'cart/delete',
			'Esta acción no se puede revertir',
			'¿Seguro deseas eliminar esta bajada? Esto restablecerá el stock y el saldo del cliente',
			() => {
				setForm(prevForm => ({
					...prevForm,
					carts: prevForm.carts.filter(x => x.id !== id)
				}));
			}
		);
	};

	const handleUpdateCartStatus = (id, status, message) => {
		actionConfirmationRef.current.open(
			{ id, status },
			'cart/updateStatus',
			`¿Está seguro que el cliente ${message}?`,
			null,
			() => {
				setForm(prevForm => ({
					...prevForm,
					carts: prevForm.carts.map(cart =>
						cart.id === id
							? { ...cart, status }
							: cart
					),
				}));
			}
		);
	};

	const handleOpenLastProducts = (products) => {
		lastProductsRef.current.open(products);
	};

	const handleRestoreCartStatus = (id) => {
		actionConfirmationRef.current.open(
			{ id },
			'cart/restoreStatus',
			'¿Seguro deseas restablecer el estado de la bajada?',
			null,
			() => {
				setForm(prevForm => ({
					...prevForm,
					carts: prevForm.carts.map(cart =>
						cart.id === id
							? { ...cart, status: CartStatuses.Pending }
							: cart
					),
				}));
			}
		);
	};

	const handleConfirmCart = useCallback((id) => {
		if (submitting)
			return;

		const cart = form.carts.find(x => x.id === id);
		const totalPaid = cart.paymentMethods.reduce((sum, x) => sum + x.amount, 0);

		if (!cart.products.length && !cart.client.subscriptionProducts.length) {
			Toast.warning("Debes bajar al menos un producto pago o del abono.");
			return;
		};

		if (cart.client.subscriptionProducts.some(x => x.quantity > x.available)) {
			Toast.warning("La cantidad de un producto del abono no puede ser mayor a la disponible.");
			return;
		}

		if (cart.products.some(x => x.quantity < 0) && cart.client.subscriptionProducts.some(x => x.quantity < 0)) {
			Toast.warning("La cantidad de un producto no puede ser menor a cero.");
			return;
		};

		if (cart.paymentMethods.length && cart.paymentMethods.some(x => x.amount < 0)) {
			Toast.warning("La cantidad de dinero debe ser mayor a cero.");
			return;
		};

		if (totalPaid !== getTotalSold(cart))
			Toast.warning("Alerta, la cantidad total de dinero no coincide con el total");
		//TODO, poner un modal capaz (Modal de Toaster)

		setSubmitting(true);
		confirmCart(
			cart,
			// onConfirm
			(newCart, response) => {
				setForm(updateAfterSubmit(form, newCart, response));
				setSubmitting(false);
			},
			// onError
			() => { setSubmitting(false) },
		);
	}, [form, submitting]);

	const handleCartChange = (newCart) => {
		setForm(prevForm => ({
			...prevForm,
			carts: prevForm.carts.map(cart =>
				cart.id === newCart.id
					? newCart
					: cart
			)
		}));
	};

	const handleOpenMap = () => {
		const points = form.carts.map((cart) => {
			const client = cart.client;
			if (client && client.address.lat && client.address.lon) {
				const isVisited = cart.status === CartStatuses.Confirmed;
				const color = isVisited ? 'green' : 'yellow';
				return {
					id: cart.id,
					lng: client.address.lon,
					lat: client.address.lat,
					color,
					status: cart.status,
					clientName: client.name,
					isVisited: isVisited,
				};
			}
			return null;
		}).filter(point => point !== null);
		const visited = points.filter(point => point.isVisited);
		const dropOff = points.filter(point => !point.isVisited);

		setVisitedPoints(visited);
		setDropOffPoints(dropOff);

		mapModalRef.current.open(dropOff, visited);
	};

	return (
		<>
			<MapModal ref={mapModalRef}/>
			<BreadCrumb items={breadcrumbItems} title='Planillas' />
			<LastProductsModal ref={lastProductsRef} />
			<ActionConfirmationModal ref={actionConfirmationRef} disabled={submitting} />
			<Col xs={11} className='container-fluid'>
				{App.isAdmin() &&
					<Row>
						<DynamicRouteGeneralData form={form} />
					</Row>
				}
				<Card
					header={
						<h1 className="text-center">
							<span>Repartos de {form.dealer} para el {formatDeliveryDay(form.deliveryDay)}</span>
							<FontAwesomeIcon
								icon={faRoute}
								color='crimson'
								className='ms-4'
								style={{ cursor: 'pointer' }}
								onClick={handleOpenMap} />
						</h1>
					}
					className='mt-4'
					body={loading ? <Spinner /> :
						<Row>
							<DynamicRouteFilters
								filters={filters}
								setFilters={setFilters}
								cartStatuses={cartStatuses}
								cartTransfersTypes={cartTransfersTypes}
								cartPaymentStatuses={cartPaymentStatuses}
								cartServiceTypes={cartServiceTypes}
							/>
							{getFilteredCarts(form.carts, filters).map((cart, i) => {
								return (
									<Col key={i} className='mb-4' xs={12}>
										<SimpleCard
											body={
												<DynamicRouteCartDetailCard
													cart={cart}
													paymentMethods={paymentMethods}
													onConfirmCart={handleConfirmCart}
													onCartChange={handleCartChange}
													onDeleteCart={handleDeleteCart}
													onOpenLastProducts={handleOpenLastProducts}
													onOpenUpdateCartStatus={handleUpdateCartStatus}
													onRestoreCartStatus={handleRestoreCartStatus}
												/>
											}
										/>
									</Col>
								);
							})}
						</Row>
					}
					footer={
						<div className='d-flex justify-content-between'>
							{!form.isClosed && (
								<Button
									className='me-4'
									onClick={handleCloseRoute}
									variant='warning'>
									Cerrar planilla
								</Button>
							)}
							<Button
								onClick={() => navigate(`/planillas/agregarFueraReparto`, { state: { clientIds: form.carts.map(x => x.client.id), routeId: id } })}
								variant='primary'>
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
