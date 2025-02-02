import API from "../../app/API";
import App from "../../app/App";
import { buildGenericGetAllRq, formatClients, formatDeliveryDay } from "../../app/Helpers";
import { CartPaymentStatuses, CartStatuses } from "../../constants/Cart";
import { Roles } from "../../constants/Roles";

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


export const getAllDealers = (currentPage, onSuccess) => {
	const rq = buildGenericGetAllRq(null, currentPage);

	rq.roles = [Roles.Dealer];
	
    API.post('User/GetAll', rq).then((r) => {
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

export const getAllClientList = (currentPage, id, onSuccess) => {
    API.post('Route/GetClientsList', { id: id, currentPage: currentPage } ).then((r) => {
        const { totalCount } = r.data;
        const clients = formatClients(r.data.items);

        onSuccess({ clients, totalCount })
    });
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

export const getTotalDebt = (form) => {
	let totalDebt = 0;
	form.carts.forEach((cart) => (totalDebt = totalDebt + cart.client.debt));
	return totalDebt;
};

export const getTotalCart = (id, cartProductRows = []) => {
	let total = 0;
	cartProductRows.find(x => x.id === id)?.products.filter(x => !Number.isNaN(x.quantity)).forEach((product) => (total = total + product.quantity * product.price));
	return total;
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
}

export const getIsSkippedCart = (status) => {
	return status.toLocaleLowerCase() === CartStatuses.Absent.toLocaleLowerCase() 
		|| status.toLocaleLowerCase() === CartStatuses.DidNotNeed.toLocaleLowerCase() 
		|| status.toLocaleLowerCase() === CartStatuses.Holiday.toLocaleLowerCase()
}

export const getMoneyCollected = (form) => {
	let total = 0;
	form.carts.forEach((cart) => {
		cart.paymentMethods.forEach((pm) => {
			total = total + pm.amount
		})
	});
	return total + form.transfersAmount
}

export const getSoldProductsRows = (form) => {
	const productsStock = form.carts
		.flatMap(cart => cart.client.products)
		.reduce((acc, product) => {
			const existingProduct = acc.find(p => p.id === product.productId);
			if (existingProduct) {
				existingProduct.stock += product.stock;
			} else {
				acc.push({ id: product.productId, stock: product.stock, name: product.name });
			}
			return acc;
		}, []);

	const productsSoldReturnes = form.carts
		.flatMap(cart => cart.products)
		.reduce((acc, product) => {
			const existingProduct = acc.find(p => p.id === product.productTypeId);
			if (existingProduct) {
				existingProduct.soldQuantity += product.soldQuantity;
				existingProduct.returnedQuantity += product.returnedQuantity;
			} else {
				acc.push({ productTypeId: product.productTypeId, productId: product.productTypeId, soldQuantity: product.soldQuantity, returnedQuantity: product.returnedQuantity });
			}
			return acc;
		}, []);

		return productsStock.map((ps) => {
			const productSoldReturned = productsSoldReturnes.find(p => ps.id === p.productId);

			return {
				name: ps.name,	
				soldQuantity: productSoldReturned ? productSoldReturned.soldQuantity : 0,
				returnedQuantity: productSoldReturned ? productSoldReturned.returnedQuantity : 0,
				stock: ps.stock,
			};
		});
};

export const updateAfterSubmit = (form, id, rq, paymentMethods, setForm) => {
	const cart = form.carts.find(x => x.id === id);

	const products = rq.products.map((p) => (
		{
			productTypeId: p.productTypeId,
			soldQuantity: p.returnedQuantity,
			returnedQuantity: p.returnedQuantity,
			name: cart.client.products.find(x => x.productId === p.productTypeId)?.name
		}
	));
	
	const subscriptionProducts = rq.subscriptionProducts.map((p) => (
		{
			productTypeId: p.productTypeId,
			quantity: p.quantity,
		}
	));
	
	const newProducts = products.map(p => {
		const sp = subscriptionProducts.find(x => x.productTypeId === p.productTypeId);
		return {
			...p,
			subscriptionQuantity: sp ? sp.quantity : 0,
			returnedQuantity: sp ? sp.quantity + p.returnedQuantity : p.returnedQuantity 
		};
	});

	subscriptionProducts.forEach(sp => {
		const existingNewProduct = newProducts.find(x => x.productTypeId === sp.productTypeId);
		if (!existingNewProduct)
			newProducts.push({
				soldQuantity: 0,
				returnedQuantity: sp.quantity,
				subscriptionQuantity: sp.quantity,
				productTypeId: sp.productTypeId,
				name: form.carts.find(x => x.id === id).client.subscriptionProducts.find(x => sp.productTypeId === x.typeId)?.name,
			});
	});

	const newPaymentMethods = rq.paymentMethods.map(x => ({
		name: paymentMethods.find(y => y.id === x.id)?.label,
		amount: x.amount
	}))
	
	setForm(prevForm => ({
		...prevForm,
		carts: prevForm.carts.map(cart =>
			cart.id === id
				? { ...cart, status: CartStatuses.Confirmed, products: newProducts, paymentMethods: newPaymentMethods }
				: cart
		),
	}));
};

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

export const getFilteredCarts = (carts, filters, cartProductRows) => {
	const cartStatusFilter = (cart) => filters.cartStatus.length === 0 || filters.cartStatus.includes(cart.status);
	const cartProductTypes = (cart) => filters.productType.length === 0 || cart.products.every(p => filters.productType.includes(p.productTypeId));
	const cartPaymentStatus = (cart) => {
		const total = getTotalCart(cart.id, cartProductRows.find(x => x.id === cart.id)?.products);
		return filters.cartPaymentStatus.length === 0 || filters.cartPaymentStatus.length === 2 || (filters.cartPaymentStatus[0] === CartPaymentStatuses.Pending ? total === 0 : total !== 0)
	};
	const cartTransfersTypes = (cart) => {
		if (!filters.cartTransfersType.length) return true;

		return cart.paymentMethods.some(p => 
			filters.cartTransfersType.includes(p.productTypeId) && p.amount !== ''
		);
	};

	return carts.filter(cart => (cartStatusFilter(cart) && cartProductTypes(cart) && (App.isAdmin() || cartTransfersTypes(cart)) && cartPaymentStatus(cart)));
}