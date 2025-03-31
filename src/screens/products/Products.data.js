import { AddressFormatter } from "@components";

export const productCols = [
	{
		name: 'name',
		text: 'Nombre',
		textCenter: true,
	},
	{
		name: 'price',
		text: 'Precio',
		textCenter: true,
	},
	{
		name: 'type',
		text: 'Tipo',
		textCenter: true,
	},
	{
		name: 'createdAt',
		text: 'Fecha de creación',
		textCenter: true,
	}
];

export const clientCols = [
	{
		name: 'name',
		text: 'Cliente',
		textCenter: true,
	},
	{
		name: 'address',
		text: 'Dirección',
		textCenter: true,
		formatter: AddressFormatter,
	},
	{
		name: 'route',
		text: 'Reparto',
		textCenter: true,
	}
];

export const sortProductItems = [
	{ value: 'name-asc', label: 'Nombre - Asc.' },
	{ value: 'name-desc', label: 'Nombre - Desc.' },
	{ value: 'createdAt-asc', label: 'Creado - Asc.' },
	{ value: 'createdAt-desc', label: 'Creado - Desc.' },
];

export const statusItems = [
	{ value: 'active', label: 'Activo' },
	{ value: 'inactive', label: 'Inactivo' },
];