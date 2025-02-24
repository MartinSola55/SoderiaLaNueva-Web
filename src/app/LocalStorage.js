import * as Constants from '@constants/StorageKey';
import secureLocalStorage from 'react-secure-storage';

// Set & remove data from local storage
const set = (key, value) => {
	return secureLocalStorage.setItem(key, JSON.stringify(value));
};

const get = (key) => {
	const value = secureLocalStorage.getItem(key);
	return value ? JSON.parse(value) : null;
};

export class LocalStorage {
	static setToken = (v) => set(Constants.TOKEN, v);
	static getToken = () => get(Constants.TOKEN);

	static setUserId = (v) => set(Constants.USER_ID, v);
	static getUserId = () => get(Constants.USER_ID);

	static setUserRole = (v) => set(Constants.USER_ROLE, v);
	static getUserRole = () => get(Constants.USER_ROLE);

	static setUserName = (v) => set(Constants.USER_NAME, v);
	static getUserName = () => get(Constants.USER_NAME);

	static setUserEmail = (v) => set(Constants.USER_EMAIL, v);
	static getUserEmail = () => get(Constants.USER_EMAIL);

	static setSessionExpiration = (v) => set(Constants.SESSION_EXPIRATION, v);
	static getSessionExpiration = () => get(Constants.SESSION_EXPIRATION);

	static clearSessionData = () => {
		secureLocalStorage.clear();
	};
};