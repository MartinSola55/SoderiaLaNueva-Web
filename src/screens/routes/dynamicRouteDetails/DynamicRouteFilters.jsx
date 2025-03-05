import { Col } from "react-bootstrap"
import { Dropdown, Input, PaymentMethodsDropdown, ProductTypesDropdown } from "@components"
import App from "@app/App";

export const DynamicRouteFilters = ({ filters, cartStatuses, cartPaymentStatuses, cartServiceTypes, setFilters }) => {
	const handleFilterRows = (value, name) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[name]: value,
		}));
	};

	return (
		<>
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
					items={cartServiceTypes}
					isMulti
					value={filters.cartServiceType}
					onChange={(options) => handleFilterRows(options.map(o => o.value), 'cartServiceType')}
				/>
			</Col>
			{App.isDealer() && (
				<Col xs={12} sm={6} lg={3} className='mb-3'>
					<PaymentMethodsDropdown
						value={filters.cartTransfersType}
						isMulti
						onChange={(options) => handleFilterRows(options.map(o => o.value), 'cartTransfersType')}
					/>
				</Col>
			)}
			{App.isAdmin() && (
				<Col xs={12} sm={6} lg={3} className='mb-3'>
					<Dropdown
						placeholder='Estado del pago'
						items={cartPaymentStatuses}
						isMulti
						value={filters.cartPaymentStatus}
						onChange={(options) => handleFilterRows(options.map(o => o.value), 'cartPaymentStatus')}
					/>
				</Col>
			)}
			<Col xs={12} md={6} lg={4} className='pe-3 mb-3'>
				<Input
					borderless
					placeholder='Buscar'
					helpText='Nombre del cliente'
					value={filters.text}
					onChange={(v) => handleFilterRows(v.toLowerCase(), 'text')}
				/>
			</Col>
		</>
	)
}