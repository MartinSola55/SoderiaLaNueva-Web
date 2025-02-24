import { CellNumericInput, Table } from "@components";
import { mergePaymentMethods } from "../DynamicRouteDetails.helpers";

export const PaymentMethodsTable = ({
	cart = {},
	paymentMethods = [],
	onChange = () => { }
}) => {
	const columns = [
		{
			name: 'name',
			text: 'Método',
			textCenter: true,
		},
		{
			name: 'amount',
			text: 'Cantidad',
			textCenter: true,
			component: (props) => (
				<CellNumericInput
					{...props}
					value={props.row.amount}
					maxValue={null}
					onChange={(v) => onChange(props.row, v)}
				/>
			),
		},
	];

	return (
		<Table
			className='mt-1'
			columns={columns}
			rows={mergePaymentMethods(paymentMethods, cart)}
		/>
	)
};