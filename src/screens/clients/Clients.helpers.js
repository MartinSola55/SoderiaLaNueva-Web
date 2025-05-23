import { Toast } from "@components";
import App from "@app/App";
import API from "@app/API";
import { buildGenericGetAllRq, formatCurrency, formatDeliveryDay } from "@app/Helpers";
import { CartsTransfersTypes } from "@constants/CartsTransfersTypes";
import { Messages } from "@constants/Messages";

export const getBreadcrumbItems = (label) => {
	const items = App.isAdmin() ? [
		{
			active: label ? false : true,
			url: '/clientes/list',
			label: 'Clientes',
		}
	] : [];

	if (label) {
		items.push({
			active: true,
			label,
		});
	}

	return items;
};

export const getAddClientBreadcrumbItems = (label, routeId) => {
	const items = [
		{
			active: false,
			label: App.isAdmin() ? 'Planillas' : 'Mis planillas',
			url: App.isAdmin() ? '/planillas/list' : '/planillas/misPlanillas',
		},
		{
			active: false,
			url: '/planillas/abierta/' + routeId,
			label: 'Detalles planilla ' + routeId,
		}
	];

	if (label) {
		items.push({
			active: true,
			label,
		});
	}

	return items;
};

export const validateClient = (form) => {
	if (!form.name || !form.address.lat || !form.address.lon || !form.phone || (form.hasInvoice && (!form.invoiceType || !form.taxCondition || !form.cuit))) {
		return Messages.Validation.requiredFields;
	}

	if (form.products.every(x => x.quantity === '')) {
		return "El cliente debe tener al menos un producto asociado.";
	}

	if (form.products.some(x => x.quantity < 0)) {
		return Messages.Validation.fieldGreaterThan('cantidad de un producto', 0);
	}

	return '';
};

export const createClient = async (form, onSuccess, onError, onFinally) => {
	const rq = {
		name: form.name,
		address: form.address,
		phone: form.phone,
		observations: form.observations,
		dealerId: form.dealerId,
		deliveryDay: form.deliveryDay,
		hasInvoice: form.hasInvoice,
		invoiceType: form.invoiceType,
		taxCondition: form.taxCondition,
		cuit: form.cuit?.toString(),
		products: form.products.filter(x => x.quantity !== '').map((x) => ({
			productId: x.id,
			quantity: x.quantity,
		})).filter((x) => x.quantity >= 0),
	};

	API.post('client/create', rq)
		.then((r) => {
			Toast.success(r.message);
			onSuccess();
		})
		.catch((r) => {
			Toast.error(r.error?.message);
			onError(r);
		})
		.finally(() => {
			onFinally();
		})
};

export const updateClient = async (form, onSuccess, onError) => {
	const rq = {
		id: form.id,
		name: form.name,
		address: {
			houseNumber: form.address.houseNumber ?? '',
			road: form.address.road ?? '',
			neighbourhood: form.address.neighbourhood ?? '',
			suburb: form.address.suburb ?? '',
			cityDistrict: form.address.cityDistrict ?? '',
			city: form.address.city ?? '',
			town: form.address.town ?? '',
			village: form.address.village ?? '',
			county: form.address.county ?? '',
			state: form.address.state ?? '',
			country: form.address.country ?? '',
			postcode: form.address.postcode ?? '',
			lat: form.address.lat,
			lon: form.address.lon,
		},
		phone: form.phone,
		observations: form.observations,
		dealerId: form.dealerId,
		deliveryDay: form.deliveryDay,
		hasInvoice: form.hasInvoice,
		invoiceType: form.invoiceType,
		taxCondition: form.taxCondition,
		cuit: form.cuit,
		debt: form.debt,
		products: form.products.map((x) => ({
			productId: x.id,
			quantity: x.quantity,
		})).filter((x) => x.quantity >= 0),
	};

	API.post('client/updateClientData', rq)
		.then((r) => {
			Toast.success(r.message);
			onSuccess();
		})
		.catch((r) => {
			Toast.error(r.error?.message);
			onError();
		})
};

export const updateClientProducts = async (form, onSuccess, onError) => {
	const rq = {
		clientId: form.id,
		products: form.products.filter(x => x.quantity !== '').map((x) => ({
			productId: x.id,
			quantity: x.quantity,
		})).filter((x) => x.quantity >= 0),
	};

	API.post('client/updateClientProducts', rq)
		.then((r) => {
			Toast.success(r.message);
			onSuccess();
		})
		.catch((r) => {
			Toast.error(r.error?.message);
			onError();
		})
};

export const updateClientSubscriptions = async (form, onSuccess, onError) => {
	const rq = {
		clientId: form.id,
		subscriptionIds: form.subscriptions
	};

	API.post('client/updateClientSubscriptions', rq)
		.then((r) => {
			Toast.success(r.message);
			onSuccess(r);
		})
		.catch((r) => {
			Toast.error(r.error?.message);
			onError();
		})
};

export const getProducts = (onSuccess) => {
	API.post('product/getAll', { paginate: false }).then((r) => {
		// Sort by name. Then by price
		const products = r.data.products
			.sort((a, b) => a.name.localeCompare(b.name))
			.sort((a, b) => a.price - b.price)
			.map((x) => ({
				id: x.id,
				name: `${x.name} - $${x.price}`,
				quantity: '',
			}));
		onSuccess(products);
	});
};

export const getSubscriptions = (onSuccess) => {
	API.post('subscription/getAll', { paginate: false }).then((r) => {
		// Sort by name. Then by price
		const subscriptions = r.data.subscriptions
			.sort((a, b) => a.name.localeCompare(b.name))
			.sort((a, b) => a.price - b.price)
			.map((x) => ({
				id: x.id,
				name: `${x.name} - $${x.price}`,
			}));
		onSuccess(subscriptions);
	});
};

export const getClients = (sort, currentPage, filterClients = [], onSuccess) => {
	const rq = buildGenericGetAllRq(sort, currentPage);

	if (filterClients.length > 0) rq.filterClients = filterClients;

	API.post('client/getAll', rq).then((r) => {
		const { clients, totalCount } = r.data;
		const formattedClients = clients.map((client) => {
			return {
				...client,
				address: client.address,
				deliveryDay: client.dealerName
					? `${client.dealerName} - ${formatDeliveryDay(client.deliveryDay)}`
					: ' Sin repartidor asignado - Sin día asignado ',
				endpoint: 'client',
			};
		});

		onSuccess({ clients: formattedClients, totalCount });
	});
};

export const getClient = (id, onSuccess, onError) => {
	API.get('client/getOneById', { id })
		.then((r) => {
			onSuccess(r.data);
		})
		.catch(() => {
			onError();
		});
};

export const buildProductsTable = (products, clientProducts) => {
	return products.map((product) => {
		const clientProduct = clientProducts.find((x) => x.id === product.id);

		return {
			...product,
			quantity: clientProduct ? clientProduct.quantity : '',
		};
	});
};
export const buildSubscriptionsProductsTable = (subscriptions, clientSubscriptions) => {
	return subscriptions.map((subscription) => {
		const clientSubscription = clientSubscriptions.find((x) => parseInt(x) === parseInt(subscription.id));

		return {
			...subscription,
			checked: clientSubscription ? true : false,
		};
	});
};

export const buildProductsSalesTable = (sales) => {
	if (!sales)
		return [];

	return sales.map((sale) => ({
		...sale,
		payments: sale.payments.length > 0 ? sale.payments.map((payment) => {
			return sale.type === CartsTransfersTypes.Transfer
				? formatCurrency(payment.amount)
				: `${payment.name} - $${payment.amount}`
		}) : [],
	}));
};

export const handleInputChange = (value, field, setForm) => {
	setForm((prevForm) => {
		return {
			...prevForm,
			[field]: value,
		};
	});
};

export const handleOnSubmit = (onSubmit, setInteralIsWatching) => {
	onSubmit();
	setInteralIsWatching(true)
};


export const handleProductsChange = (props, value, form, setForm) => {
	const formProduct = form.products.find(fpm => fpm.id === props.row.id);
	const newProducts = formProduct ?
		form.products.map(x => {
			if (x.id === props.row.id)
				return {
					...x,
					quantity: value,
				};
			return x;
		}) :
		[...form.products, { id: props.row.id, quantity: value }];

	handleInputChange(newProducts, 'products', setForm);
};

export const handleSubscriptionsChange = (props, value, form, setForm) => {
	const subscriptions = !value
		? form.subscriptions.filter((s) => s !== props.row.id.toString())
		: form.subscriptions.includes(props.row.id.toString())
			? [...form.subscriptions]
			: [...form.subscriptions, props.row.id.toString()];

	handleInputChange(subscriptions, 'subscriptions', setForm);
};