import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "@app/Helpers";
import { formatRouteCarts } from "./Home.helpers";

export const soldProductsCols = [
	{
		name: 'icon',
		text: '',
		icon: faShoppingCart
	},
	{
		name: 'name',
		text: 'Producto/Envase',
		boldRow: true,
	},
	{
		name: 'sold',
		text: 'Vendidos',
	},
	{
		name: 'returned',
		text: 'Devueltos',
	}
];

export const expensesCols = [
	{
		name: 'dealerName',
		text: 'Repartidor',
		boldRow: true,
	},
	{
		name: 'description',
		text: 'Descripción',
		boldRow: true,
	},
	{
		name: 'amount',
		text: 'Monto',
		boldRow: true,
		formatter: formatCurrency
	}
];

export const routesCols = [
	{
		name: 'dealer',
		text: 'Repartidor',
		boldRow: true,
	},
	{
		name: 'completedCarts',
		text: 'Envíos completados',
		formatter: formatRouteCarts
	},
	{
		name: 'soldProducts',
		text: 'Productos vendidos',
		list: true
	},
	{
		name: 'totalCollected',
		text: 'Recaudado',
		formatter: formatCurrency
	}
];

export const dealerRoutesCols = [
	{
		name: 'dealer',
		text: 'Nombre',
		boldRow: true,
	},
	{
		name: 'completedCarts',
		text: 'Envíos completados',
		formatter: formatRouteCarts
	},
	{
		name: 'totalCollected',
		text: 'Recaudado',
		formatter: formatCurrency
	},
	{
		name: 'createdAt',
		text: 'Fecha'
	},
];

export const balanceCols = [
	{
		name: 'name',
		text: 'Tipo',
		boldRow: true,
		className: 'w-50'
	},
	{
		name: 'total',
		text: 'Total',
		formatter: formatCurrency
	}
];