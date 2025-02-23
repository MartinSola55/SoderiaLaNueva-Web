import { Roles } from '@constants/Roles';
import { LocalStorage } from './LocalStorage';

const isLoggedIn = () => {
	if (!LocalStorage.getUserId()) return false;

	const sessionExpiration = new Date(LocalStorage.getSessionExpiration());

	if (!sessionExpiration) return false;

	if (new Date() > sessionExpiration) {
		LocalStorage.clearSessionData();
		return false;
	}

	return true;
};

const isAdmin = () => {
	const role = LocalStorage.getUserRole();
	return role && role === Roles.Admin;
};

const isDealer = () => {
	const role = LocalStorage.getUserRole();
	return role && role === Roles.Dealer;
};

const App = {
	isLoggedIn,
	isAdmin,
	isDealer,
};

export default App;
