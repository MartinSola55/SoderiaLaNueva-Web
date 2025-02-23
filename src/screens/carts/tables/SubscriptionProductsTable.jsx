import { Card, CellNumericInput, Spinner, Table } from "@components";

export const SubscriptionProductsTable = ({
	form,
	loading,
	onTableChange = () => { },
}) => {
	const subscriptionColumns = [
		{
			name: 'name',
			text: 'Producto',
			textCenter: true,
		},
		{
			name: 'subscriptionQuantity',
			text: 'Cantidad',
			textCenter: true,
			component: (props) => (
				<CellNumericInput
					{...props}
					value={props.row.subscriptionQuantity}
					maxValue={null}
					onChange={(v) => handleChange(v, props.row)} />
			),
		},
	];

	const handleChange = (value, row) => {
		const newForm = {
			...form,
			products: form.products.map(x => x.productTypeId === row.productTypeId ? { ...x, subscriptionQuantity: value } : x),
		};
		onTableChange(newForm);
	};

	const rows = form.subscriptionProducts.map(x => {
		const product = form.products.find(p => p.productTypeId === x.typeId);
		return {
			productTypeId: x.typeId,
			name: `${x.name} - Disponible: ${x.available} `,
			subscriptionQuantity: product?.subscriptionQuantity || "",
		};
	})

	return (
		<Card
			title='Productos del abono'
			body={loading ? <Spinner /> :
				<Table
					columns={subscriptionColumns}
					rows={rows}
				/>
			}
		/>
	);
};