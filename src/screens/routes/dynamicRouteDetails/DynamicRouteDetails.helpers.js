import API from "@app/API";
import { Toast } from "@components";
import { CartStatuses } from "@constants/Cart";

export const getTotalSold = (cart) => {
	const total = cart.products.reduce((acc, x) => acc + x.soldQuantity * x.price, 0);
	return total;
};

export const mergeProducts = (clientProducts, products) => {
	return clientProducts.map((x) => {
		const product = products.find((y) => y.productId === x.productId);
		if (product)
			return {
				...x,
				soldQuantity: product.soldQuantity,
			};
		return x;
	});
};

export const mergePaymentMethods = (paymentMethods, cart) => {
	return paymentMethods.map((x) => {
		const method = cart.paymentMethods.find((y) => y.name === x.name);
		if (method)
			return {
				...x,
				amount: method.amount,
			};
		return x;
	});
};

export const confirmCart = (cart, onSuccess, onError) => {
	const rq = {
		id: cart.id,
		products: cart.products.filter(x => x.soldQuantity).map((x) => ({
			productTypeId: x.productTypeId,
			soldQuantity: x.soldQuantity,
			returnedQuantity: x.soldQuantity
		})),
		subscriptionProducts: cart.client.subscriptionProducts?.filter(x => x.quantity).map((x) => ({
			productTypeId: x.typeId,
			quantity: x.quantity,
		})) || [],
		paymentMethods: cart.paymentMethods.filter(x => x.amount).map((x) => {
			return ({
				id: x.id,
				amount: x.amount
			})
		})
	};

	API.post('cart/confirm', rq)
		.then((r) => {
			Toast.success(r.message);
			onSuccess(rq, r.data);
		})
		.catch((r) => {
			Toast.error(r.error?.message);
			onError();
		});
};

export const updateAfterSubmit = (form, newCart, response) => {
	// debugger;
	const oldCart = form.carts.find(x => x.id === newCart.id);

	oldCart.products.forEach(x => {
		const product = newCart.products.find(y => y.productTypeId === x.productTypeId);
		const subscriptionProduct = newCart.subscriptionProducts.find(y => y.productTypeId === x.productTypeId);
		if (product) {
			x.soldQuantity = product.soldQuantity;
			x.returnedQuantity = product.returnedQuantity;
		}
		if (subscriptionProduct) {
			x.returnedQuantity += subscriptionProduct.quantity;
		}
	});
	if (oldCart.products.length === 0) {
		oldCart.products = oldCart.client.products.map(x => {
			const subscriptionProduct = newCart.subscriptionProducts.find(y => y.productTypeId === x.productTypeId);

			return ({
				name: x.name,
				price: x.price,
				soldQuantity: 0,
				returnedQuantity: subscriptionProduct?.quantity || 0,
				productTypeId: x.productTypeId
			});
		})
	};
	if (newCart.subscriptionProducts.length === 0) {
		oldCart.client.subscriptionProducts = oldCart.client.subscriptionProducts.map(x => ({ ...x, quantity: 0 }));
	};
	oldCart.client.debt = response.clientDebt;
	oldCart.status = CartStatuses.Confirmed;
	return form;
};