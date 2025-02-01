import { Col, Row } from "react-bootstrap"
import LastProductsButton from "../lastProducts/LastProductsButton"
import { formatDebt, getDebtTextColor, handleOpenLastProducts } from "../../../app/Helpers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse, faPhone, faTruckFast } from "@fortawesome/free-solid-svg-icons"

export const CartDetailCard = ({idx, cart, lastProductsRef}) => {
	return (
		<Col xs={12} key={idx} className='row mx-0'>
			<Col
				xs={10}
				md={5}
				className={`order-2 ${idx % 2 ? 'order-2' : 'order-md-1'}`}
			>
				<div className='shadow rounded p-3 mb-4 mb-md-0'>
					<Row className='m-0'>
						<Col className='p-0' xs={8} md={10}>
							<h4>{`${cart.name} - Pendiente`}</h4>
						</Col>
						<Col
							xs={4}
							md={2}
							className='d-flex justify-content-center align-items-center p-0'
						>
							<LastProductsButton
								onClick={() =>handleOpenLastProducts(lastProductsRef, cart.lastProducts)}
							/>
						</Col>
						<Col xs={12} className='mt-1 p-0'>
							<p className='mb-1'>Bajada: #{cart.id}</p>
							<p className='mb-1'>
								Creado: {cart.createdAt}
							</p>
							{cart.updatedAt && (
								<p className='mb-1'>
									Últ. modif: {cart.updatedAt}
								</p>
							)}
							<p className={`mb-1 ${getDebtTextColor(cart.debt)}`}>
								{formatDebt(cart.debt)}
							</p>
							<p className='mb-1'>
								<FontAwesomeIcon icon={faHouse} />{' '}{cart.address} -{' '}<FontAwesomeIcon icon={faPhone} />{' '}
								{cart.phone}
							</p>
						</Col>
					</Row>
				</div>
			</Col>
			<Col
				xs={2}
				className={`order-1 p-0 ${idx % 2 ? 'order-1 offset-md-5' : 'order-md-2 '}`}
			>
				<div className='timeline'>
					<div className='timeline-line'></div>
					<div className='timeline-icon'>
						<FontAwesomeIcon icon={faTruckFast} />
					</div>
				</div>
			</Col>
		</Col>
	)
}