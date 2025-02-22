import { Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router"
import { formatDebt, getDebtTextColor } from "../../../../app/Helpers"
import { Button } from "../../../../components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faPhone } from "@fortawesome/free-solid-svg-icons"
import { getCartTitleClassname } from "../../Routes.helpers"
import { CartActionButton } from "../CartActionButton"
import { CartStatuses } from "../../../../constants/Cart"
import { SubscriptionProductsTable } from "../tables/SubscriptionProductsTable"
import { SoldProductsTable } from "../tables/SoldProductsTable"
import { getTotalSold } from "../DynamicRouteDetails.helpers"
import { PaymentMethodsTable } from "../tables/PaymentMethodsTable"
import { ReturnedProductsTable } from "../tables/ReturnedProductsTable"
import LastProductsButton from "../../lastProducts/LastProductsButton"
import App from "../../../../app/App"

export const DynamicRouteCartDetailCard = ({
	cart,
	paymentMethods,
	onConfirmCart = () => { },
	onCartChange = () => { },
	onDeleteCart = () => { },
	onOpenLastProducts = () => { },
	onOpenUpdateCartStatus = () => { },
	onRestoreCartStatus = () => { },
}) => {
	const navigate = useNavigate();

	// Handlers
	const handleSubscriptionProductsChange = (product, value) => {
		const prodIdx = cart.client.subscriptionProducts.findIndex((x) => x.id === product.id);
		const subscriptionProduct = {
			...product,
			quantity: value,
		};
		const newCart = {
			...cart,
			client: {
				...cart.client,
				subscriptionProducts: prodIdx !== -1
					// Update quantity
					? cart.client.subscriptionProducts.map((x) => x.name === product.name ? { ...x, quantity: value } : x)
					// Add new subscription product
					: [...cart.client.subscriptionProducts, subscriptionProduct],
			},
		};

		onCartChange(newCart);
	};

	const handleSoldProductsChange = (product, value) => {
		const prodIdx = cart.products.findIndex((x) => x.productId === product.productId);
		const soldProduct = {
			...product,
			soldQuantity: value,
		};
		const newCart = {
			...cart,
			products: prodIdx !== -1
				// Update quantity
				? cart.products.map((x) => x.name === product.name ? { ...x, soldQuantity: value } : x)
				// Add new sold product
				: [...cart.products, soldProduct],
		};

		onCartChange(newCart);
	};

	const handlePaymentMethodsChange = (method, value) => {
		const methodIdx = cart.paymentMethods.findIndex((x) => x.id === method.id);
		const paymentMethod = {
			...method,
			amount: value,
		};
		const newCart = {
			...cart,
			paymentMethods: methodIdx !== -1
				// Update amount
				? cart.paymentMethods.map((x) => x.name === method.name ? { ...x, amount: value } : x)
				// Add new payment method
				: [...cart.paymentMethods, paymentMethod],
		};

		onCartChange(newCart);
	};

	// Render
	const renderSubscriptionsTable = () => {
		if ((cart.status !== CartStatuses.Pending && cart.status !== CartStatuses.Confirmed) || cart.client.subscriptionProducts.length === 0)
			return null;

		return (
			<Col xs={4}>
				<h4>Abonos</h4>
				<SubscriptionProductsTable
					cart={cart}
					onChange={handleSubscriptionProductsChange} />
			</Col>
		);
	};

	const renderSoldProductsTable = () => {
		if (cart.status !== CartStatuses.Pending && cart.status !== CartStatuses.Confirmed)
			return null;
		else if (cart.status === CartStatuses.Confirmed && cart.products.length === 0)
			return null;
		else if (cart.status === CartStatuses.Pending && cart.client.products.length === 0)
			return null;

		return (
			<Col xs={4}>
				<h4>Bajada</h4>
				<SoldProductsTable
					cart={cart}
					onChange={handleSoldProductsChange} />
			</Col>
		);
	};

	const renderPaymentMethodsTable = () => {
		if (cart.status !== CartStatuses.Pending || cart.client.products.length === 0)
			return null;

		return (
			<Col xs={4}>
				<h4>Total: {getTotalSold(cart)}</h4>
				<PaymentMethodsTable
					cart={cart}
					paymentMethods={paymentMethods}
					onChange={handlePaymentMethodsChange} />
			</Col>
		);
	};

	const renderPayments = () => {
		if (cart.status !== CartStatuses.Confirmed || cart.products.length === 0)
			return null;

		return (
			<>
				<Col xs={4}>
					<h4>Devoluciones</h4>
					<ReturnedProductsTable
						cart={cart}
					/>
				</Col>
				<hr />
				<Col xs={4}>
					{cart.paymentMethods.length > 0 ?
						<ul>
							{cart.paymentMethods.map((pm, i) => (
								<li key={i}>
									{`${pm.name}: $${pm.amount} `}
								</li>
							))}
						</ul>
						:
						<p className="mb-3">El cliente no realizó ningún pago.</p>
					}
				</Col>
				<hr />
			</>
		);
	};

	return (
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
					{App.isAdmin() && (
						<ul>
							{cart.client.products.map(
								(product, i) => (
									<li key={i}>
										<p className='mb-1'>
											{`${product.name} - Stock: ${product.stock}`}
										</p>
									</li>
								),
							)}
						</ul>
					)}
				</Col>
				<Col xs={12} md={2} className='d-flex flex-md-column justify-content-between align-items-end' >
					<LastProductsButton onClick={() => onOpenLastProducts(cart.client.lastProducts)} />
					{cart.status === CartStatuses.Pending && cart.client.products.length > 0 && (
						<CartActionButton onOpenUpdateCartStatus={(action, message) => onOpenUpdateCartStatus(cart.id, action, message)} />
					)}
				</Col>
			</Row>
			<hr />
			<Row className="justify-content-between">
				{renderSubscriptionsTable()}
				{renderSoldProductsTable()}
				{renderPaymentMethodsTable()}
				{renderPayments()}
			</Row>
			<Row>
				<Col className='d-flex justify-content-between' xs={12}>
					<div>
						{cart.status !== CartStatuses.Pending && cart.status !== CartStatuses.Confirmed &&
							<Button className='btn-warning' onClick={() => onRestoreCartStatus(cart.id)}>
								Cancelar estado
							</Button>
						}
					</div>
					<div>
						{cart.status === CartStatuses.Pending &&
							<Button
								disabled={cart.client.products.length === 0}
								onClick={() => onConfirmCart(cart.id)}>
								Confirmar bajada
							</Button>
						}
						{cart.status !== CartStatuses.Pending &&
							<>
								{App.isAdmin() && (
									<Button onClick={() => onDeleteCart(cart.id)} className='btn-danger'>
										Eliminar
									</Button>
								)}
								{App.isDealer() && (
									<Button onClick={() => navigate(`/planillas/bajada/${cart.id}`)}>
										Devuelve
									</Button>
								)}
								<Button onClick={() => navigate(`/planillas/bajada/${cart.id}`)} className='ms-3'>
									Editar bajada
								</Button>
							</>
						}
					</div>
				</Col>
			</Row>
		</>
	);
}