import API from "../../app/API";
import { buildGenericGetAllRq, formatCurrency, formatDeliveryDay } from "../../app/Helpers";
import { Toast } from "../../components";

export const getBreadcrumbItems = (label) => {
    const items = [
        {
            active: label ? false : true,
            url: '/clientes/list',
            label: 'Clientes',
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

export const createClient = async (form, onSuccess, onError) => {
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
        cuit: form.cuit,
        products: form.products.map((x) => ({
            productId: x.id,
            quantity: x.quantity,
        })).filter((x) => x.quantity >= 0),
    };

    API.post('Client/Create', rq)
        .then((r) => {
            Toast.success(r.message);
            onSuccess();
        })
        .catch((r) => {
            Toast.error(r.error.message);
            onError();
        })
};

export const updateClient = async (form, onSuccess, onError) => {
    const rq = {
        id: form.id,
        name: form.name,
        address: form.address,
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

    API.post('Client/UpdateClientData', rq)
        .then((r) => {
            Toast.success(r.message);
            onSuccess();
        })
        .catch((r) => {
            Toast.error(r.error.message);
            onError();
        })
};

export const updateClientProducts = async (form, onSuccess, onError) => {
    const rq = {
        clientId: form.id,
        products: form.products.map((x) => ({
            productId: x.id,
            quantity: x.quantity,
        })).filter((x) => x.quantity >= 0),
    };

    API.post('Client/UpdateClientProducts', rq)
        .then((r) => {
            Toast.success(r.message);
            onSuccess();
        })
        .catch((r) => {
            Toast.error(r.error.message);
            onError();
        })
};

export const updateClientSubscriptions = async (form, onSuccess, onError) => {
    const rq = {
        clientId: form.id,
        subscriptionIds: form.subscriptions
    };

    API.post('Client/UpdateClientSubscriptions', rq)
        .then((r) => {
            Toast.success(r.message);
            onSuccess();
        })
        .catch((r) => {
            Toast.error(r.error.message);
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

export const getClients = (sort, currentPage, onSuccess) => {
    const rq = buildGenericGetAllRq(sort, currentPage);

    API.post('client/getAll', rq).then((r) => {
        const { clients, totalCount } = r.data;
        const formattedClients = clients.map((client) => {
            return {
                ...client,
                debt: formatCurrency(client.debt),
                deliveryDay: client.dealerName
                    ? `${client.dealerName} - ${formatDeliveryDay(client.deliveryDay)}`
                    : ' - ',
                endpoint: 'client',
            };
        });

        onSuccess({ clients: formattedClients, totalCount });
    });

};

export const getClient = (id, onSuccess) => {
    API.get('client/getOneById', { id }).then((r) => {
        onSuccess(r.data);
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
	if (!sales) return [];

    return sales.map((sale) => {
        return {
            ...sale,
            payments: sale.payments.length > 0 ? sale.payments.map((payment) => {
				return `${payment.name} - $${payment.amount}`
			}) : ['-'],
        };
    });
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
	const products = form.products.map((x) => {
		if (x.id === props.row.id)
			return {
				...x,
				quantity: value,
			};
		return x;
	});

	handleInputChange(products, 'products', setForm);
};

export const handleSubscriptionsChange = (props, value, form, setForm) => {
	const subscriptions = !value
		? form.subscriptions.filter((s) => s !== props.row.id.toString())
		: form.subscriptions.includes(props.row.id.toString())
			? [...form.subscriptions]
			: [...form.subscriptions, props.row.id.toString()];

	handleInputChange(subscriptions, 'subscriptions', setForm);
};