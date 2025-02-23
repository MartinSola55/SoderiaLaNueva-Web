import { Roles } from '../constants/Roles';

export const formatOptions = (options) => {
	return options.map((option) => ({
		value: option,
		label: option,
	}));
};

export const formatComboItems = (items) => {
	return items.map((item) => ({
		value: item.stringId ? item.stringId : item.id,
		label: item.description,
	}));
};

export const formatRoleItems = (items) => {
	return items.map((item) => ({
		value: item.stringId ? item.stringId : item.id,
		label: formatRole(item.description),
	}));
};

export const formatSubscriptions = (subscripstions, disabled = false) => {
	return subscripstions?.map((s) => ({
		id: s.id,
		description: s.description,
		disabled,
	}));
};

export const formatClients = (clients) => {
	return clients.map((c) => ({
		id: c.clientId,
		name: c.name,
		address: c.address,
	}));
};

export const formatProducts = (prod, disabled = false) => {
	return prod?.map((p) => ({
		id: p.id,
		description: p.description,
		quantity: p.quantity || 0,
		disabled,
	}));
};
export const formatCartProducts = (prod, cartId) => {
	return prod?.map((p) => ({
		id: p.productId,
		name: p.name,
		quantity: "",
		price: parseFloat(p.price),
		cartId
	}));
};

export const formatOptionsBoolean = (options) => {
	return options.map((option) => ({
		value: option.value,
		label: option.label,
	}));
};

export const formatPaymentMethods = (items) => {
	return items.map((item) => ({
		id: item.stringId ? item.stringId : item.id,
		label: item.description,
		amount: '',
	}));
};

export const formatSoldProducts = (items) => {
	return items.map((item) => (`${item.name} (${item.amount})`))
};

export const formatCurrency = (value) => {
	if (value === null || value === undefined)
		return '';

	if (value < 0)
		return `-$${Math.abs(value).toLocaleString('es-AR', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`;

	return `$${value.toLocaleString('es-AR', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`;
};

export const formatDebt = (value) => {
	if (parseFloat(value) === 0)
		return 'Sin deuda';

	return `${value < 0 ? 'A favor' : 'Deuda'}: $${Math.abs(value)}`;
};

export const getDebtTextColor = (value) => {
	if (value > 0) return 'text-danger'
	if (value < 0) return 'text-success'
	return ''
};

export const buildDealerRouteName = (dealerName, day) => {
	return `${dealerName || 'Sin repartidor'} - ${formatDeliveryDay(day)}`;
};

export const formatDeliveryDay = (value) => {
	switch (value) {
		case 1:
			return 'Lunes';
		case 2:
			return 'Martes';
		case 3:
			return 'Miercoles';
		case 4:
			return 'Jueves';
		case 5:
			return 'Viernes';
		default:
			return 'Sin día';
	}
};

// 1 for Monday, 2 for Tuesday, 3 for Wednesday, 4 for Thursday and 5 for Friday
export const getDayIndex = () => {
	const date = new Date();
	return date.getDay() === 0 ? 5 : date.getDay();
};

export const formatRole = (role) => {
	switch (role?.toUpperCase()) {
		case Roles.Admin:
			return 'Admin';
		case Roles.Dealer:
			return 'Repartidor';
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
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}T00:00:00Z`;
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

export const debounce = (func, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
};