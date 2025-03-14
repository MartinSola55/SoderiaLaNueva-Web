import { formatCurrency } from "@app/Helpers";

export const formatRouteCarts = (v, row) => {
	return `${v}/${row.totalCarts}`;
};

export const getTotalCollected = (data) => {
	const sales = data.find((x) => x.name === 'Bajadas');
	const transfers = data.find((x) => x.name === 'Transferencias');
	const expenses = data.find((x) => x.name === 'Gastos');

	return formatCurrency(sales.total + transfers.total - expenses.total);
};