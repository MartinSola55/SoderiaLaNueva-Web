import { CellNumericInput, Table } from "@components";
import { formatCurrency } from "@app/Helpers";
import { CartStatuses } from "@constants/Cart";
import { mergeProducts } from "../DynamicRouteDetails.helpers";

export const SoldProductsTable = ({
	cart = {},
	onChange = () => { },
}) => {
	const pending = cart.status === CartStatuses.Pending;
	const columns = [
		{
			name: 'name',
			text: 'Producto',
			textCenter: true,
			formatter: (_, row) => `${row.name} - ${formatCurrency(row.price)}`,
		},
		{
			text: pending ? 'Bajó' : 'Cantidad',
			textCenter: true,
			component: (props) => {
				if (!pending) {
					return <div className="text-end">{props.row.soldQuantity !== '' ? props.row.soldQuantity : '-'}</div>
				}
				else
					return (
						<CellNumericInput
							{...props}
							value={props.row.soldQuantity}
							maxValue={null}
							onChange={(v) => onChange(props.row, v)}
						/>
					);
			},
		}
	];

	return (
		<Table
			className='mt-1'
			columns={columns}
			rows={!pending ? cart.products : mergeProducts(cart.client.products, cart.products)}
		/>
	)
};