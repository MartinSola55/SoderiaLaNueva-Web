import { Col } from "react-bootstrap"
import { Dropdown, Input, ProductTypesDropdown } from "../../../components"
import App from "../../../app/App";

export const DynamicRouteFilters= ({filters, cartStatuses, cartTransfersTypes, cartPaymentStatuses, cartServiceTypes, setFilters}) => {
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
					<Dropdown
						placeholder='Método de pago'
						items={cartTransfersTypes}
						isMulti
						value={filters.cartTransfersType}
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
			<Col xs={12} className='pe-3 mb-3'>
				<Input
					borderless
					placeholder='Buscar'
					helpText='Nombre'
					value={filters.text}
					onChange={(v) => handleFilterRows(v.toLowerCase(), 'text')}
				/>
			</Col>
		</>
	)
}