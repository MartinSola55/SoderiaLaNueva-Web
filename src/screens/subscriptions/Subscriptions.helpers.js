import { buildDealerRouteName, buildGenericGetAllRq, formatCurrency } from "../../app/Helpers";
import API from "../../app/API";
import { Toast } from "../../components";

export const getBreadcrumbItems = (label) => {
    const items = [
        {
            active: false,
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

export const getSubscription = (id, onSuccess) => {
    API.get('subscription/getOneById', { id }).then((r) => {
        onSuccess(r.data);
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

export const saveSubscription = (form, id, onSuccess, onError) => {
    const rq = {
        name: form.name,
        price: form.price,
        subscriptionProducts: form.subscriptionProducts
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
            Toast.error(r.error.message);
            onError();
        })
};