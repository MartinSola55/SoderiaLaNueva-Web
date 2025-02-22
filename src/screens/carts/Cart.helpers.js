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
		newProducts.push({ productTypeId: props.row.productTypeId, [name]: v });

	handleInputChange(newProducts, 'products');
};

export const formatAddress = (suggestion) => {
	if (!suggestion || !suggestion.address)
		return "";

	let addressParts = [];

	if (suggestion.address.nameNumber)
		addressParts.push(suggestion.address.nameNumber);
	else if (suggestion.address.road && suggestion.address.house_number)
		addressParts.push(suggestion.address.road + ' ' + suggestion.address.house_number);

	addressParts = [
		...addressParts,
		suggestion.address.neighbourhood || "",
		suggestion.address.city_district || suggestion.address.cityDistrict || "",
		suggestion.address.city || "",
		suggestion.address.state || "",
		suggestion.address.country || "",
		suggestion.address.postcode || "",
	].filter(Boolean);

	return addressParts.join(", ");
};