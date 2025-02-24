import { Col, Row } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faClock, faDollarSign, faInfoCircle, faShoppingBag } from "@fortawesome/free-solid-svg-icons"
import { Card, SimpleCard, Table, Tooltip } from "@components"
import { formatCurrency } from "@app/Helpers"
import { getMoneyCollected, geTotalCollectedByMethod, getSoldProductsRows, getTotalDebt } from "../Routes.helpers"
import { soldProductsColumns } from "../Routes.data"
import { RouteInfoCard } from "./cards"

export const DynamicRouteGeneralData = ({ form }) => {

	const totalDebt = getTotalDebt(form);
	const countNotPendingCarts = form.carts.filter((cart) => cart.status.toLocaleLowerCase() !== 'pendiente'.toLocaleLowerCase())?.length;

	const getMoneyCollectedTooltip = () => (
		<ul className='text-start ps-3 mb-0 money-collected-tooltip'>
			{geTotalCollectedByMethod(form).map((method, i) => (
				<li key={i}>{method.name}: {formatCurrency(method.amount)}</li>
			))}
			{form.transfersAmount > 0 ? <li>Transferencia (administración): {formatCurrency(form.transfersAmount)}</li> : ''}
		</ul>
	);

	return (
		<>
			<Col className='mt-4 mt-lg-0' xs={12}>
				<SimpleCard
					body={
						<>
							<h4 className='mb-1 d-block '>Total de repartos: {form.carts.length}</h4>
							<h4 className='mb-1 d-block '>Deuda total: {formatCurrency(Math.abs(totalDebt))} {totalDebt < 0 ? <small>(a favor de los clientes)</small> : ''}</h4>
						</>
					}
				/>
			</Col>
			<Col xs={12} xl={6} className='mt-5'>
				<Card
					title='Productos vendidos'
					body={
						<Table
							columns={soldProductsColumns}
							rows={getSoldProductsRows(form)}
							emptyTableMessage='No hay productos en la planilla' />
					}
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
									title={`${formatCurrency(getMoneyCollected(form))}`}
									description={
										<>
											<span className='me-2'>Recaudado en el día</span>
											<Tooltip tooltipContent={getMoneyCollectedTooltip()}>
												<FontAwesomeIcon icon={faInfoCircle} color='rgb(0, 158, 251)' />
											</Tooltip>
										</>
									}
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
									title={`${formatCurrency(form.spentAmount)}`}
									description='Gastos del día'
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
		</>
	)
}