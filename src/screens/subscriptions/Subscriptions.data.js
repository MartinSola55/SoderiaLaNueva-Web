export const sortProductItems = [
    { value: 'price-asc', label: 'Precio - Asc.' },
    { value: 'price-desc', label: 'Precio - Desc.' },
    { value: 'name-asc', label: 'Nombre - Asc.' },
    { value: 'name-desc', label: 'Nombre - Desc.' },
];

export const subscriptionCols = [
    {
        name: 'name',
        text: 'Nombre',
        textCenter: true,
    },
    {
        name: 'price',
        text: 'Precio',
        textCenter: true,
    },
    {
        name: 'products',
        text: 'Productos',
        textCenter: true,
        list: true
    },
];

export const clientCols = [
    {
        name: 'name',
        text: 'Cliente',
        textCenter: true,
    },
    {
        name: 'address',
        text: 'Dirección',
        textCenter: true,
    },
    {
        name: 'route',
        text: 'Reparto',
        textCenter: true,
    }
];
