import API from "../../app/API";

export const updateCart = (form, onSuccess, onError) => {
	const rq = {
		id: form.id,
		products: form.products.filter(x => x.soldQuantity >= 0 && x.returnedQuantity >= 0).map((x) => ({
			productTypeId: x.productTypeId,
			soldQuantity: x.soldQuantity,
			returnedQuantity: x.returnedQuantity,
		})),
		subscriptionProducts: form.subscriptionProducts.map((x) => {
			const product = form.products.find(p => p.productTypeId === x.typeId);
			if (!product)
				return null;

			return {
				productTypeId: product.productTypeId,
				quantity: product.subscriptionQuantity,
			};
		}),
		paymentMethods: form.paymentMethods.filter(x => x.amount >= 0).map((x) => ({
			paymentMethodId: x.paymentMethodId,
			amount: x.amount,
		})),
	};

	API.post('cart/update', rq)
		.then((r) => {
			onSuccess(r.message);
		})
		.catch((r) => {
			onError(r.error.message);
		});
};