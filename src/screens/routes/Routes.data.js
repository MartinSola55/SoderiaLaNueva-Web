import { AddressFormatter } from "../../components";
import { CartServiceType } from "../../constants/Cart";

export const listColumns = [
	{
		name: 'dealer',
		text: 'Repartidor',
		textCenter: true,
	},
	{
		name: 'totalCarts',
		text: 'Envíos a Realizar',
		textCenter: true,
	},
];

export const createColumns = [
	{
		name: 'fullName',
		text: 'Nombre y apellido',
		textCenter: true,
	},
	{
		name: 'email',
		text: 'Email',
		textCenter: true,
	},
];

export const editSelectedColumns = [
	{
		name: 'name',
		text: 'Nombre',
		textCenter: true,
	},
	{
		name: 'address',
		text: 'Dirección',
		textCenter: true,
		formatter: AddressFormatter,
	},
];

export const editNotSelectedColumns = [
	{
		name: 'name',
		text: 'Nombre',
		textCenter: true,
	},
	{
		name: 'address',
		text: 'Dirección',
		textCenter: true,
		formatter: AddressFormatter,
	},
];

export const soldProductsColumns = [
	{
		name: 'name',
		text: 'Producto',
		textCenter: true,
	},
	{
		name: 'soldQuantity',
		text: 'Vendidos',
		textCenter: true,
	},
	{
		name: 'returnedQuantity',
		text: 'Devueltos',
		textCenter: true,
	},
	{
		name: 'stock',
		text: 'Stock del cliente',
		textCenter: true,
	},
];

export const paymentMethodsColumns = [
	{
		name: 'label',
		text: 'Método',
		textCenter: true,
	}
];

export const cartServiceTypes = [{value: CartServiceType.Cart, label: CartServiceType.Cart}, {value: CartServiceType.Subscription, label: CartServiceType.Subscription}]