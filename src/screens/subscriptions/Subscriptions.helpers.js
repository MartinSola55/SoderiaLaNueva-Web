import { buildDealerRouteName, buildGenericGetAllRq, formatCurrency } from "../../app/Helpers";
import API from "../../app/API";
import { Toast } from "@components";

export const getBreadcrumbItems = (label) => {
    const items = [
        {
            active: label ? false : true,
            url: '/abonos/list',
            label: 'Abonos',
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

export const mapProducts = (products) => {
    return products.map((x) => `${x.name} x ${x.quantity} u.`);
};

export const getAllSubscriptions = (sort, currentPage, onSuccess) => {
    const rq = buildGenericGetAllRq(sort, currentPage);

    API.post('subscription/getAll', rq).then((r) => {
        const { totalCount } = r.data;
        const subscriptions = r.data.subscriptions.map((x) => {
            return {
                ...x,
                price: formatCurrency(x.price),
                products: mapProducts(x.subscriptionProductItems),
                endpoint: 'subscription',
            };
        });
        onSuccess({ subscriptions, totalCount })
    });
};

export const getClientSubscriptions = (subscriptionId, onSuccess) => {
    API.get('subscription/getClientList', { subscriptionId }).then((r) => {
        const clients = r.data.clients.map((x) => {
            return {
                ...x,
                route: buildDealerRouteName(x.dealerName, x.deliveryDay),
            };
        });
        onSuccess(clients);
    });
};

export const getSubscription = (id, onSuccess, onError) => {
    API.get('subscription/getOneById', { id })
        .then((r) => {
            onSuccess(r.data);
        })
        .catch(() => {
            onError();
        });
};

export const getProductTypes = (onSuccess) => {
    API.get('product/getComboProductTypes').then((r) => {
        const products = r.data.items.map((x) => ({
            ...x,
            quantity: '',
        }));
        onSuccess(products);
    });
};

export const getProductRows = (productTypes = [], form) => {
	return productTypes.map(x => {
		const productForm = form.subscriptionProducts.find(y => Number(y.id) === Number(x.id))
		if (productForm)
			return {
				...x,
				quantity: productForm.quantity,
			};
		return x;
	});
} 

export const saveSubscription = (form, id, productRows, onSuccess, onError) => {
    const rq = {
        name: form.name,
        price: form.price,
        subscriptionProducts: productRows
            .filter((x) => x.quantity)
            .map((x) => ({
                productTypeId: x.id,
                quantity: x.quantity,
            })),
    };

    if (id) {
        rq.id = id;
    }

    API.post(`subscription/${id ? 'update' : 'create'}`, rq)
        .then((r) => {
            Toast.success(r.message);
            onSuccess();
        })
        .catch((r) => {
            Toast.error(r.error?.message);
            onError();
        })
};