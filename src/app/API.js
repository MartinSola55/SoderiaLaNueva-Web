const URL = import.meta.env.VITE_API_URL;
import { Toast } from '@components';
import { LocalStorage } from './LocalStorage';
import { Messages } from '@constants/Messages';

const get = async (path, rq) => {
	const params = new URLSearchParams(rq);
	const response = await fetch(`${URL}/${path}?${params}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': 'no-cors',
			Authorization: `Bearer ${LocalStorage.getToken()}`,
		},
	});

	if (!response.ok) {
		if (response.status === 403)
			return Toast.error(Messages.Error[403]);
		else if (response.status === 404)
			return Toast.error(Messages.Error[404]);
		else if (response.status >= 500)
			return Toast.error(Messages.Error[500]);
		else
			return Toast.error(Messages.Error.generic);
	}

	const json = await response.json();

	if (!json.success)
		throw json;

	return json;
};

const getDifferentUrl = async (url, rq) => {
	const params = new URLSearchParams(rq);
	const response = await fetch(`${url}?${params}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': 'no-cors',
		},
	});

	if (!response.ok) {
		if (response.status === 403)
			return Toast.error(Messages.Error[403]);
		else if (response.status === 404)
			return Toast.error(Messages.Error[404]);
		else if (response.status >= 500)
			return Toast.error(Messages.Error[500]);
		else
			return Toast.error(Messages.Error.generic);
	}

	const json = await response.json();

	return json;
};

const post = async (path, rq, isFormData = false) => {
	const headers = isFormData ? {} : {
		'Content-Type': 'application/json',
	};

	const response = await fetch(`${URL}/${path}`, {
		method: 'POST',
		headers: {
			...headers,
			'Access-Control-Allow-Origin': 'no-cors',
			Authorization: `Bearer ${LocalStorage.getToken()}`,
		},
		body: isFormData ? rq : JSON.stringify(rq),
	});

	if (!response.ok) {
		if (response.status === 403)
			return Toast.error(Messages.Error[403]);
		else if (response.status === 404)
			return Toast.error(Messages.Error[404]);
		else if (response.status >= 500)
			return Toast.error(Messages.Error[500]);
		else
			return Toast.error(Messages.Error.generic);
	}

	const json = await response.json();

	if (!json.success)
		throw json;

	return json;
};

const download = async (path, rq) => {
	const response = get(path, rq);

	const imageResponse = await fetch(response.data.signedUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': 'no-cors',
		},
	});

	if (!imageResponse.ok) {
		if (imageResponse.status === 403)
			return Toast.error(Messages.Error[403]);
		else if (imageResponse.status === 404)
			return Toast.error(Messages.Error[404]);
		else if (imageResponse.status >= 500)
			return Toast.error(Messages.Error[500]);
		else
			return Toast.error(Messages.Error.generic);
	}

	const imageBlob = await imageResponse.blob();
	const url = URL.createObjectURL(imageBlob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'imagen';
	a.click();
	URL.revokeObjectURL(url);

	return response;
}

const API = {
	get,
	post,
	download,
	getDifferentUrl,
};

export default API;
