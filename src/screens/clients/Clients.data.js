import { DebtFormatter } from "../../components";

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

export const sortClientItems = [
    { value: 'name-asc', label: 'Nombre - Asc.' },
    { value: 'name-desc', label: 'Nombre - Desc.' },
    { value: 'createdAt-asc', label: 'Fecha de creación - Asc.' },
    { value: 'createdAt-desc', label: 'Fecha de creación - Desc.' },
];