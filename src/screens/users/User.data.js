import { formatRole } from "@app/Helpers";
import { Roles } from "@constants/Roles";

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
];

export const sortUserItems = [
	{ value: 'createdAt-asc', label: 'Creado - Asc.' },
	{ value: 'createdAt-desc', label: 'Creado - Desc.' },
];

export const rolesItems = [
	{ value: Roles.Admin, label: formatRole(Roles.Admin) },
	{ value: Roles.Dealer, label: formatRole(Roles.Dealer) }
];
