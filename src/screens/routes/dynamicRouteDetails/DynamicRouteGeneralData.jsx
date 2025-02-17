import { Col, Row } from "react-bootstrap"
import SimpleCard from "../../../components/SimpleCard/SimpleCard"
import { Card, Table, Tooltip } from "../../../components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import RouteInfoCard from "../cards/RouteInfoCard"
import { formatCurrency } from "../../../app/Helpers"
import { faCheck, faClock, faDollarSign, faInfoCircle, faShoppingBag } from "@fortawesome/free-solid-svg-icons"
import { getMoneyCollected, getSoldProductsRows, getTotalDebt } from "../Routes.helpers"
import { soldProductsColumns } from "../Routes.data"

export const DynamicRouteGeneralData = ({ form }) => {

	const countNotPendingCarts = form.carts.filter((cart) => cart.status.toLocaleLowerCase() !== 'pendiente'.toLocaleLowerCase())?.length;

	const getMoneyCollectedTooltip = () => {
		return (
			`<ul class='text-left ps-3 mb-0'>
				<li>Efectivo: ${formatCurrency(getMoneyCollected(form) - form.transfersAmount)}</li>
				${form.transfersAmount > 0 ? '<li>Transferencia (administración): ' + formatCurrency(form.transfersAmount) + '</li>' : ''}
			</ul>`
		)
	};

	return (
		<>
			<Col className='mt-4 mt-lg-0' xs={12}>
				<SimpleCard
					body={
						<>
							<span className='mb-1 d-block fs-4'>{`Total de repartos: ${form.carts.length}`}</span>
							<span className='mb-1 d-block fs-4'>{`Deuda total: ${formatCurrency(getTotalDebt(form))}`}</span>
						</>
					}
				/>
			</Col>
			<Col xs={12} xl={6} className='mt-5'>
				<Card
					title='Productos vendidos'
					header={<p className='mb-0'>06/01/2025</p>}
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
											<Tooltip text={getMoneyCollectedTooltip()}>
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
		</>
	)
}