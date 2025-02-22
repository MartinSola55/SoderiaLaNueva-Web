import { Card, CellNumericInput, Spinner, Table } from "../../../components";

export const ReturnedProductsTable = ({
	form,
	loading,
	onTableChange = () => { },
}) => {

	const returnedColumns = [
		{
			name: 'name',
			text: 'Producto',
			textCenter: true,
		},
		{
			name: 'returnedQuantity',
			text: 'Cantidad',
			textCenter: true,
			component: (props) => (
				<CellNumericInput
					{...props}
					value={props.row.returnedQuantity}
					maxValue={null}
					onChange={(v) => handleChange(v, props.row)} />
			),
		},
	];

	const handleChange = (value, row) => {
		const newForm = {
			...form,
			products: form.products.map(x => x.productTypeId === row.productTypeId ? { ...x, returnedQuantity: value } : x),
		};
		onTableChange(newForm);
	};

	const rows = form.clientProducts.map(x => {
		const cartProduct = form.products.find(p => p.productTypeId === x.productTypeId);
		return {
			productTypeId: x.productTypeId,
			name: x.name,
			price: x.price,
			returnedQuantity: cartProduct?.returnedQuantity || "",
		};
	});

	return (
		<Card
			title='Devolución de productos'
			body={loading ? <Spinner /> :
				<Table
					columns={returnedColumns}
					rows={rows}
				/>
			}
		/>
	);
};