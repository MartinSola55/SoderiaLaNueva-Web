export const validateUser = (form, viewProfileDetails, isEditing) => {
	if (!form.fullName || !form.email)
		return false
	if (!viewProfileDetails) {
		if ((!form.password && !isEditing) || !form.phoneNumber || !form.role)
			return false;
	}

	return true;
};

export const getBreadcrumbItems = (isWatching, id, viewProfileDetails) => {
	const breadcrumbItems = [
		{
			active: true,
			label: isWatching ? 'Ver' : id ? 'Editar' : viewProfileDetails ? 'Mi perfil' : 'Nuevo',
		},
	];

	if (!viewProfileDetails) {
		breadcrumbItems.unshift({
			active: false,
			url: '/usuarios/list',
			label: 'Usuarios',
		});
	}

	return breadcrumbItems;
};