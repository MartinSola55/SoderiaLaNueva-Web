import { Roles } from '../constants/Roles';

export const formatOptions = (options) => {
    return options.map((option) => ({
        value: option,
        label: option,
    }));
};

export const formatRoles = (roles) => {
    return roles.map((role) => ({
        value: role.id,
        label: role.name,
    }));
};

export const formatTypes = (types) => {
    return types.map((t) => ({
        value: t.id,
        label: t.type,
    }));
};

export const formatProducts = (prod,disabled) => {
    return prod.map((p,idx) => ({
        id: p.id,
        name: p.name,
        quantity: 0,
        index: idx,
        disabled
    }));
};

export const formatOptionsBoolean = (options) => {
    return options.map((option) => ({
        value: option.value,
        label: option.label,
    }));
};

export const formatCurrency = (value) => {
    if (value === null)
        return '';

    return `$${value.toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`
};

export const formatRole = (role) => {
    switch (role) {
        case Roles.Admin:
            return 'Admin';
        case Roles.Rol4:
            return 'Nivel 4';
        case Roles.Rol3:
            return 'Nivel 3';
        case Roles.Rol2:
            return 'Nivel 2';
        case Roles.Rol1:
            return 'Nivel 1';
        default:
            return 'Desconocido';
    }
};

export const buildGenericGetAllRq = (sort, currentPage, dateRange) => {
    const rq = {
        page: currentPage,
    };

    if (sort && sort.column) {
        rq.columnSort = sort.column;
        rq.sortDirection = sort.direction;
    }
    if (dateRange && dateRange.from && dateRange.to) {
        rq.dateFrom = Dates.formatDate(dateRange.from);
        rq.dateTo = Dates.formatDate(dateRange.to);
    }

    return rq;
};

export const validateInt = (value) => {
    const parsedValue = parseInt(value);
    return value === null || (!isNaN(parsedValue) && parsedValue);
};

export const validateFloat = (value) => {
    const parsedValue = parseFloat(value);
    return value === null || (!isNaN(parsedValue) && parsedValue);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export class Dates {
    static getToday(returnString = false) {
        const today = new Date();
        return returnString ? formatDate(today) : today;
    }

    static getTomorrow(date, returnString = false) {
        let today = date ? new Date(date) : new Date();
        const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        return returnString ? formatDate(tomorrow) : tomorrow;
    }

    static getLastWeek() {
        const today = new Date();
        const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        return formatDate(lastWeek);
    }

    static getPreviousWeek(day) {
        const date = new Date(day);
        const lastWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
        return formatDate(lastWeek);
    }

    static formatDate(date) {
        return formatDate(date);
    }

    static adjustDate = (date) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate.toISOString();
    };
};