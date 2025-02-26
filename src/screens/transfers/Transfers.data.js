import { formatCurrency } from "../../app/Helpers";
import { AddressFormatter, DebtFormatter } from "../../components";

export const transferColumns = [
    {
        name: 'clientName',
        text: 'Cliente',
        textCenter: true,
    },
    {
        name: 'dealerName',
        text: 'Repartidor',
        textCenter: true,
    },
    {
        name: 'amount',
        text: 'Monto',
        textCenter: true,
        formatter: formatCurrency,
    },
    {
        name: 'createdAt',
        text: 'Fecha realizada',
        textCenter: true,
    }
];

export const clientColumns = [
    {
        name: 'name',
        text: 'Nombre',
        textCenter: true,
    },
    {
        name: 'address',
        text: 'Dirección',
        textCenter: true,
        formatter: AddressFormatter,
    },
    {
        name: 'phone',
        text: 'Teléfono',
        textCenter: true,
    },
    {
        name: 'debt',
        text: 'Deuda',
        textCenter: true,
        formatter: DebtFormatter,
    },
    {
        name: 'deliveryDay',
        text: 'Reparto',
        textCenter: true,
    }
];

export const sortTransferItems = [
    { value: 'amount-asc', label: 'Monto - Asc.' },
    { value: 'amount-desc', label: 'Monto - Desc.' },
    { value: 'createdAt-asc', label: 'Fecha - Asc.' },
    { value: 'createdAt-desc', label: 'Fecha - Desc.' },
];