export const getBreadcrumbItems = (id) => [
	{
		active: false,
		label: 'Planilla',
		url: `/planillas/abierta/${id}`,
	},
	{
		active: true,
		label: 'Editar bajada',
	},
];