import { formatCurrency } from "../../../app/Helpers";
import { Card, CellNumericInput, Spinner, Table } from "../../../components";

export const ProductsTable = ({
	form,
	loading,
	onTableChange = () => { },
}) => {

	const soldColumns = [
		{
			name: 'name',
			text: 'Producto',
			textCenter: true,
			formatter: (_, row) => `${row.name} - ${formatCurrency(row.price)}`
		},
		{
			name: 'soldQuantity',
			text: 'Cantidad',
			textCenter: true,
			component: (props) => (
				<CellNumericInput
					{...props}
					value={props.row.soldQuantity}
					maxValue={null}
					onChange={(v) => handleChange(v, props.row)} />
			),
		},
	];

	const handleChange = (value, row) => {
		const newForm = {
			...form,
			products: form.products.map(x => x.productTypeId === row.productTypeId ? { ...x, soldQuantity: value } : x),
		};
		onTableChange(newForm);
	};

	const rows = form.clientProducts.map(x => {
		const cartProduct = form.products.find(p => p.productTypeId === x.productTypeId);
		return {
			productTypeId: x.productTypeId,
			name: x.name,
			price: x.price,
			soldQuantity: cartProduct?.soldQuantity || "",
		};
	});

	return (
		<Card
			title='Productos bajados'
			body={loading ? <Spinner /> :
				<Table
					columns={soldColumns}
					rows={rows}
				/>
			}
		/>
	);
};