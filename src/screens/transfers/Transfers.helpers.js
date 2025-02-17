import API from "../../app/API";
import { buildGenericGetAllRq, formatDeliveryDay } from "../../app/Helpers";

export const getClients = (clientName, onSuccess) => {
    const rq = {
        name: clientName
    };

    API.post('client/search', rq).then((r) => {
        const { clients } = r.data;
        const formattedClients = clients.map((client) => {
            return {
                ...client,
                deliveryDay: client.dealerName
                    ? `${client.dealerName} - ${formatDeliveryDay(client.deliveryDay)}`
                    : ' Sin repartidor asignado - Sin día asignado ',
                endpoint: 'client',
            };
        });

        onSuccess(formattedClients);
    });
};

export const getTransfers = (sort, currentPage, dateRange, onSuccess) => {
    const rq = buildGenericGetAllRq(sort, currentPage, dateRange);

    API.post('transfer/getAll', rq).then((r) => {
        onSuccess({ transfers: r.data.transfers, totalCount: r.data.totalCount });
    });
};

export const getBreadcrumbItems = (label) => {
    const items = [
        {
            active: label ? false : true,
            url: '/transferencias/list',
            label: 'Transferencias',
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