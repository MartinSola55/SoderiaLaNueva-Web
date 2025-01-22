import { ActionButtons } from "../../components";

export const columns = [
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
	{
		name: 'phoneNumber',
		text: 'Numero de teléfono',
		textCenter: true,
	},
	{
		name: 'role',
		text: 'Rol',
		textCenter: true,
	},
	{
		name: 'createdAt',
		text: 'Fecha de ingreso',
		textCenter: true,
	},
	{
		name: 'actions',
		text: 'Acciones',
		component: (props) => <ActionButtons entity='usuario' {...props} />,
		className: 'text-center',
	},
];

export const sortUserItems = [
	{ value: 'createdAt-asc', label: 'Creado - Asc.' },
	{ value: 'createdAt-desc', label: 'Creado - Desc.' },
];