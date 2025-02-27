import { useEffect, useState } from "react";
import { formatPaymentMethods } from "@app/Helpers";
import API from "@app/API";
import { Card, CellNumericInput, Spinner, Table } from "@components";

export const PaymentMethodsTable = ({
	form,
	loading,
	onTableChange = () => { },
}) => {
	const [paymentMethods, setPaymentMethods] = useState([]);

	useEffect(() => {
		if (paymentMethods.length)
			return;

		API.get('cart/getPaymentMethodsCombo').then((r) => {
			setPaymentMethods(formatPaymentMethods(r.data.items));
		});
	}, [paymentMethods]);

	const paymentMethodsColumns = [
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
					maxValue={null}
					value={props.row.amount}
					onChange={(v) => handleChange(v, props.row)} />
			),
		},
	];

	const handleChange = (value, row) => {
		const getNewPaymentMethods = () => {
			const formPaymentMethod = form.paymentMethods?.find(x => x.paymentMethodId === row.id);
			if (formPaymentMethod)
				return form.paymentMethods.map(x => x.paymentMethodId === row.id ? { ...x, amount: value } : x);
			return [...form.paymentMethods, {paymentMethodId: row.id, amount: value}]
		};

		const newForm = {
			...form,
			paymentMethods: getNewPaymentMethods(),
		};
		onTableChange(newForm);
	};

	const rows = paymentMethods.map((x) => {
		const formPm = form.paymentMethods.find((pm) => pm.paymentMethodId === x.id);
		return {
			id: x.id,
			name: x.label,
			amount: formPm?.amount || ''
		};
	});

	return (
		<Card
			title='Entrega'
			body={loading ? <Spinner /> :
				<Table
					rows={rows}
					columns={paymentMethodsColumns}
				/>
			}
		/>
	);
};