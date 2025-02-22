import { CellNumericInput, Table } from "../../../../components";
import { CartStatuses } from "../../../../constants/Cart";

export const SubscriptionProductsTable = ({
	cart = {},
	onChange = () => { },
}) => {
	const pending = cart.status === CartStatuses.Pending;
	const columns = [
		{
			name: 'name',
			text: 'Producto',
			textCenter: true,
			formatter: (_, row) => pending ? `${row.name} - Disponible: ${row.available}` : row.name,
		},
		{
			text: pending ? 'Bajó' : 'Cantidad',
			className: 'text-center',
			component: (props) => {
				if (!pending) {
					return <div className="text-end">{props.row.quantity !== '' ? props.row.quantity : '-'}</div>
				}
				else
					return (
						<CellNumericInput
							{...props}
							value={props.row.quantity}
							maxValue={null}
							onChange={(v) => onChange(props.row, v)}
						/>
					);
			},
		}
	];

	const rows = pending ?
		cart.client.subscriptionProducts :
		cart.client.subscriptionProducts.map(x => {
			const product = cart.products.find(y => y.productTypeId === x.typeId);
			return {
				...x,
				quantity: product ? product.subscriptionQuantity : 0,
			}
		});

	return (
		<Table
			className='mt-1'
			columns={columns}
			rows={rows}
		/>
	)
};