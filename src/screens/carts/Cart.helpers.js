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

export const onProductsChange = (props, v, form, handleInputChange, name) => {
	const productIndex = form.products.findIndex(x => x.productTypeId === props.row.productTypeId);
	let newProducts = [...form.products];

	if (productIndex !== -1)
		newProducts[productIndex] = {
			...form.products[productIndex],
			[name]: v,
		  };
	else
		newProducts.push({productTypeId : props.row.productTypeId, [name] : v});

	handleInputChange(newProducts, 'products');
};

export const getSubscriptionProductsRows = (form) => {
	return form.subscriptionProducts?.map((sp) => {
		const existingSubscriptionProduct = form.products.find(x => x.productTypeId === sp.typeId);
		return {
			productTypeId: sp.typeId,
			name: `${sp.name} - Disponible: ${sp.available} `,
			subscriptionQuantity: existingSubscriptionProduct?.subscriptionQuantity || ""
		};
	})
};

export const getProductsRows = (form) => {
	return form.clientProducts?.map((cp) => {
		const existingCLientProduct = form.products.find(x => x.productTypeId === cp.productTypeId);
		return {
			productTypeId: cp.productTypeId,
			name: cp.name,
			soldQuantity: existingCLientProduct?.soldQuantity || "",
			returnedQuantity : existingCLientProduct?.returnedQuantity || 0,
		};
	})
};