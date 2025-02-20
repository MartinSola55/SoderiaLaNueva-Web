import { Col, Row } from "react-bootstrap"
import LastProductsButton from "../lastProducts/LastProductsButton"
import { formatCurrency, formatDebt, getDebtTextColor, handleOpenLastProducts, openActionConfirmationModal } from "../../../app/Helpers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faPhone } from "@fortawesome/free-solid-svg-icons"
import { getCartTitleClassname, getIsSkippedCart, getTableStyleColumns, getTotalCart, handleChangePaymentMethods, onProductsChange, onSubscriptionProductsChange, showTable } from "../Routes.helpers"
import { CartActionButton } from "../dynamicRouteDetails/CartActionButton"
import { CartStatuses } from "../../../constants/Cart"
import { AddressFormatter, Button, CellNumericInput, Table } from "../../../components"
import { useNavigate } from "react-router"
import App from "../../../app/App"
import { paymentMethodsColumns } from "../Routes.data"

export const DynamicRouteCartDetailCard = ({
	cart,
	setForm,
	actionConfirmationRef,
	lastProductsRef,
	paymentMethods,
	setCartSubscriptionProductRows,
	setCartProductRows,
	cartSubscriptionProductRows,
	cartProductRows,
	handleSubmit,
	setPaymentMethods
}) => {

	const navigate = useNavigate();

	const cartReturnedProductColumns = [
		{
			name: 'name',
			text: 'Producto',
			textCenter: true,
		},
		{
			name: 'quantity',
			text: 'Cantidad',
			component: (props) => { return <span>{props.row.returnedQuantity !== '' ? props.row.returnedQuantity : '-'}</span> },
			className: 'text-center',
		},
	];

	const paymentMethodsTableColumns = [
		...paymentMethodsColumns,
		{
			name: 'amount',
			text: 'Cantidad',
			component: (props) => (<CellNumericInput {...props} maxValue={undefined} value={props.row.amount} onChange={(v) => handleChangePaymentMethods(props, v, paymentMethods, setPaymentMethods)} />),
			textCenter: true,
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

	const handleOpenRestoreCartStatus = (cartId) => {
		openActionConfirmationModal(
			actionConfirmationRef,
			{ id: cartId },
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
		openActionConfirmationModal(
			actionConfirmationRef,
			{ id: cartId },
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
						{` ${AddressFormatter(cart.client.address)} - `} 
						<FontAwesomeIcon
							icon={faPhone}
						/>
						{` ${cart.client.phone}`}
					</p>
					{App.isAdmin() && (
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
					)}
				</Col>
				<Col xs={12} md={2} className='d-flex flex-md-column justify-content-between align-items-end' >
					<LastProductsButton onClick={() => handleOpenLastProducts(lastProductsRef, cart.client.lastProducts)} />
					{cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase() && (
						<CartActionButton
							actionConfirmationRef={actionConfirmationRef}
							setForm={setForm}
							cart={cart}
						/>
					)}
				</Col>
			</Row>
			<hr />
			{!getIsSkippedCart(cart.status) && (
				<Row>
					{showTable(cart, 'subscriptionProducts', 'subscriptionQuantity') && (
						<Col xs={12} md={getTableStyleColumns(cart)}>
							<h4>Abonos</h4>
							<Table
								className='mt-1'
								columns={cartSubscriptionProductsColumns(cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase())}
								rows={cart.products.length > 0 ? cart.products.filter(x => x.subscriptionQuantity !== 0) : cartSubscriptionProductRows.find((cr) => cr.id === cart.id)?.subscriptionProducts}
							/>
						</Col>
					)}
					{showTable(cart, null, 'soldQuantity') && (
						<Col xs={12} md={getTableStyleColumns(cart)}>
							<h4>Bajada</h4>
							<Table
								className='mt-1'
								columns={cartProductColumns(cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase())}
								rows={cart.products.length > 0 ? cart.products.filter(x => x.soldQuantity !== 0) : cartProductRows.find((cr) => cr.id === cart.id)?.products}
							/>
						</Col>
					)}
					{cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase() && (
						<Col xs={12} md={getTableStyleColumns(cart)}>
							<h4>Total: {formatCurrency(getTotalCart(cart.id, cartProductRows))}</h4>
							<Table
								columns={paymentMethodsTableColumns}
								rows={paymentMethods}
							/>
						</Col>
					)}
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
					)}
				</Row>
			)}
			<Row>
				<Col className='text-end mt-4' xs={12}>
					{!getIsSkippedCart(cart.status) ? (
						cart.status.toLocaleLowerCase() === CartStatuses.Pending.toLocaleLowerCase() ? (
							<Button
								onClick={() => handleSubmit({ id: cart.id })}
							>
								Confirmar bajada
							</Button>
						) : (
							<>
								{App.isAdmin() && (
									<Button onClick={() => handleDeleteCart(cart.id)} className='bg-danger border-0'>
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
						)) : (
						<Button className='bg-danger border-0' onClick={() => handleOpenRestoreCartStatus(cart.id)}>
							Cancelar estado
						</Button>
					)}
				</Col>
			</Row>
		</>
	)
}