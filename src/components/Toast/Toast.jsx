import { toast } from 'react-toastify';

const options = {
	position: "top-right",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	theme: "colored",
};

const info = (message) => {
	toast.info(message, options);
};

const success = (message) => {
	toast.success(message, options);
};

const warning = (message, timeout = 5000) => {
	toast.warn(message, { ...options, autoClose: timeout });
}

const error = (message) => {
	toast.error(message, options);
};

export default {
	info,
	success,
	warning,
	error,
};