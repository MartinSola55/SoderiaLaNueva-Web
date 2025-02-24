import { Table } from "@components";

export const ReturnedProductsTable = ({
	cart = {},
}) => {
	const columns = [
		{
			name: 'name',
			text: 'Producto',
			textCenter: true,
		},
		{
			text: 'Cantidad',
			className: 'text-center',
			component: (props) => <div className="text-end">{props.row.returnedQuantity !== '' ? props.row.returnedQuantity : '-'}</div>,
		}
	];

	return (
		<Table
			className='mt-1'
			columns={columns}
			rows={cart.products}
		/>
	)
};