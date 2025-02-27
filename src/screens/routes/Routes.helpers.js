import API from "../../app/API";
import { buildGenericGetAllRq, formatClients, formatDeliveryDay } from "../../app/Helpers";
import { CartPaymentStatuses, CartServiceType, CartStatuses } from "../../constants/Cart";
import { Roles } from "../../constants/Roles";

// Routes List
export const getAllRoutes = (dayFilter, onSuccess) => {
	const rq = {
		deliveryDay: dayFilter,
	};

	API.get('route/getAllStaticRoutes', rq).then((r) => {
		const { totalCount } = r.data;
		const routes = r.data.routes.map((x) => {
			return {
				id: x.id,
				dealer: x.dealer,
				totalCarts: x.totalCarts,
				endpoint: 'Route',
			};
		});

		onSuccess({ routes, totalCount })
	});
};

// Dealer Routes List
export const getAllDealerRoutes = (onSuccess) => {
	API.get('route/getAllDealerStaticRoutes').then((r) => {
		const routes = r.data.routes.map((x) => {
			return {
				id: x.id,
				dealer: x.dealer,
				totalCarts: x.totalCarts,
				deliveryDay: formatDeliveryDay(x.deliveryDay),
				endpoint: 'Route',
			};
		});

		onSuccess({ routes })
	});
};

// Create Route
export const getAllDealers = (currentPage, onSuccess) => {
	const rq = buildGenericGetAllRq(null, currentPage);

	rq.roles = [Roles.Dealer];

	API.post('user/getAll', rq).then((r) => {
		const { totalCount } = r.data;
		const dealers = r.data.users.map((x) => {
			return {
				email: x.email,
				fullName: x.fullName,
				href: JSON.stringify({ id: x.id, fullName: x.fullName }),
			};
		});

		onSuccess({ dealers, totalCount })
	});
};

// Dynamic Route General Data
export const getTotalDebt = (form) => {
	let totalDebt = 0;
	form.carts.forEach((cart) => (totalDebt = totalDebt + cart.client.debt));
	return totalDebt;
};

export const getMoneyCollected = (form) => {
	let total = 0;
	form.carts.filter(x => x.status === CartStatuses.Confirmed).forEach((cart) => {
		cart.paymentMethods.forEach((pm) => {
			total = total + pm.amount
		})
	});
	return total + form.transfersAmount
};

export const geTotalCollectedByMethod = (form) => {
	const totalCollectedByMethod = [];
	form.carts.filter(x => x.status === CartStatuses.Confirmed).forEach((cart) => {
		cart.paymentMethods.forEach((x) => {
			const index = totalCollectedByMethod.findIndex(y => y.name === x.name);
			if (index === -1) {
				totalCollectedByMethod.push(x);
			} else {
				totalCollectedByMethod[index].amount += x.amount;
			}
		});
	});
	return totalCollectedByMethod;
};

export const getSoldProductsRows = (form) => {
	const productSummary = {};
	form.productTypes.forEach(product => {
		productSummary[product.id] = {
			name: product.name,
			sold: 0,
			returned: 0,
			stock: 0,
		};
	});

	form.carts.forEach(cart => {
		if (cart.status === CartStatuses.Confirmed) {
			cart.products?.length && cart.products.forEach(product => {
				productSummary[product.productTypeId].sold += product.soldQuantity + product.subscriptionQuantity;
				productSummary[product.productTypeId].returned += product.returnedQuantity;
			});
		}

		cart.client.products?.length && cart.client.products.forEach(product => {
			productSummary[product.productTypeId].stock += product.stock;
		});
	});

	return Object.values(productSummary);
};

export const getFilteredCarts = (carts, filters) => {
	let filteredCarts = carts;

	if (filters.cartStatus.length)
		filteredCarts = filteredCarts.filter(x => filters.cartStatus.includes(x.status));

	if (filters.productType.length)
		filteredCarts = filteredCarts.filter(x => x.products.some(y => filters.productType.includes(y.productTypeId)));

	// Only filter if pending OR completed
	if (filters.cartPaymentStatus.length === 1) {
		if (filters.cartPaymentStatus[0] === CartPaymentStatuses.Completed)
			filteredCarts = filteredCarts.filter(x => x.paymentMethods.some(y => y.amount));
		else
			filteredCarts = filteredCarts.filter(x => x.paymentMethods.every(y => !y.amount));
	}

	if (filters.cartServiceType.length) {
		if (filters.cartServiceType.includes(CartServiceType.Subscription))
			filteredCarts = filteredCarts.filter(x => x.products.some(y => y.subscriptionQuantity));

		if (filters.cartServiceType.includes(CartServiceType.Cart))
			filteredCarts = filteredCarts.filter(x => x.products.some(y => y.soldQuantity));
	}

	if (filters.text)
		filteredCarts = filteredCarts.filter((x) => x.client.name.toLowerCase().includes(filters.text.toLowerCase()));

	return filteredCarts;
};

export const getCartTitleClassname = (status) => {
	switch (status.toLocaleLowerCase()) {
		case CartStatuses.Pending.toLocaleLowerCase():
			return ''
		case CartStatuses.Confirmed.toLocaleLowerCase():
			return 'text-success'
		case CartStatuses.Absent.toLocaleLowerCase():
		case CartStatuses.DidNotNeed.toLocaleLowerCase():
		case CartStatuses.Holiday.toLocaleLowerCase():
			return 'text-warning'
		default:
			return ''
	}
};

export const onProductsChange = (props, value, setCartProductRows) => {
	setCartProductRows((prevState) => {
		return prevState.map((cart) => {
			if (cart.id === props.row.cartId) {
				const updatedProducts = cart.products.map((p) => {
					if (p.id === props.row.id) {
						return {
							...p,
							quantity: parseInt(value, 10),
						};
					}
					return p;
				});

				return {
					...cart,
					products: updatedProducts,
				};
			}
			return cart;
		});
	});
};

export const onSubscriptionProductsChange = (props, value, setCartSubscriptionProductRows) => {
	setCartSubscriptionProductRows((prevState) => {
		return prevState.map((cart) => {
			if (cart.id === props.row.cartId) {
				const updatedSubscriptionProducts = cart.subscriptionProducts.map((sp) => {
					if (sp.id === props.row.id) {

						return {
							...sp,
							quantity: parseInt(value, 10),
						};
					}
					return sp;
				});
				return {
					...cart,
					subscriptionProducts: updatedSubscriptionProducts,
				};
			}
			return cart;
		});
	})
};

// Edit Route
export const getAllClientList = (currentPage, id, onSuccess) => {
	API.post('route/getClientsList', { id: id, currentPage: currentPage }).then((r) => {
		const { totalCount } = r.data;
		const clients = formatClients(r.data.items);

		onSuccess({ clients, totalCount })
	});
};

// Shared
export const handleChangePaymentMethods = (props, value, paymentMethods, setPaymentMethods) => {
	const newPaymentMethods = paymentMethods.map((x) => {
		if (x.id === props.row.id)
			return {
				...x,
				amount: value
			};
		return x;
	});
	setPaymentMethods(newPaymentMethods);
};

export const getTotalCart = (id, cartProductRows = []) => {
	let total = 0;
	cartProductRows.find(x => x.id === id)?.products.filter(x => !Number.isNaN(x.quantity)).forEach((product) => (total = total + product.quantity * product.price));
	return total;
};

export const buildPaymentMethods = (items) => {
	return items.map((x) => {
		return {
			id: x.id,
			name: x.description,
		};
	});
};