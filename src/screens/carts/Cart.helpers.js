export const getPaymentMethodRows = (paymentMethods = [], form) => {
	return paymentMethods.map((pm) => {
		const formPm = form.paymentMethods.find((x) => x.paymentMethodId === pm.id);
		return {
			id: pm.id,
			name: pm.label,
			amount: formPm ? formPm.amount : ''
		};
	});
};

export const onPaymentMethodsChange = (props, v, form, handleInputChange) => {
	const formPayemntMethod = form.paymentMethods.find(fpm => fpm.paymentMethodId === props.row.id);
	const newPaymentMethods = formPayemntMethod ? 
		form.paymentMethods.map(x => {
			if (x.paymentMethodId === props.row.id)
				return {
					...x,
					amount: v,
				};
			return x;
		}) : 
		[...form.paymentMethods, { paymentMethodId: props.row.id, amount: v }];
		
	handleInputChange(newPaymentMethods, 'paymentMethods');
};

export const onQuantityChange = (props, v, form, handleInputChange, name) => {
	handleInputChange(
		form.products.map((p) => {
			if (p.id === props.row.id)
				return {
					...p,
					[name]: v,
				};
			return p;
		}),
		'products',
	);
};
