import API from "../../app/API";
import { Toast } from "react-bootstrap";
import { buildGenericGetAllRq, formatCurrency, formatDeliveryDay } from "../../app/Helpers";

export const getBreadcrumbItems = (label) => {
    const items = [
        {
            active: false,
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