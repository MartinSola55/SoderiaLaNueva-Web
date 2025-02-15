import API from "../../app/API";
import { buildDealerRouteName, buildGenericGetAllRq, formatCurrency } from "../../app/Helpers";
import { Toast } from "../../components";

export const getBreadcrumbItems = (label) => {
    const items = [
        {
            active: label ? false : true,
            url: '/productos/list',
            label: 'Productos',
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

export const getAllProducts = (sort, currentPage, onSuccess) => {
    const rq = buildGenericGetAllRq(sort, currentPage);

    API.post('product/getAll', rq).then((r) => {
        const { totalCount } = r.data;
        const products = r.data.products.map((x) => {
            return {
                ...x,
                price: formatCurrency(x.price),
                endpoint: 'product',
            };
        });
        onSuccess({ products, totalCount })
    });
};

export const getClientProducts = (productId, onSuccess) => {
    API.get('product/getClientList', { productId }).then((r) => {
        const clients = r.data.clients.map((x) => {
            return {
                ...x,
                route: buildDealerRouteName(x.dealerName, x.deliveryDay),
            };
        });
        onSuccess(clients);
    });
};

export const saveProduct = (form, id, onSuccess, onError) => {
    const rq = {
        name: form.name,
        price: form.price,
        typeId: form.typeId,
    };

    if (id) {
        rq.id = id;
    }

    API.post(`product/${id ? 'update' : 'create'}`, rq)
        .then((r) => {
            Toast.success(r.message);
            onSuccess();
        })
        .catch((r) => {
            Toast.error(r.error?.message);
            onError();
        })
};