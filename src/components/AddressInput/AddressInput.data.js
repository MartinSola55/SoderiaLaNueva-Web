import { Toast } from "@components";

export const fetchAddress = async (address) => {
	try {
		const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&countrycodes=ar&limit=8`;
		const resp = await fetch(url);

		if (!resp.ok) {
			Toast.error('Error fetching address');
		}

		const data = await resp.json();
		return data;
	} catch (error) {
		Toast.error(error);
	}
}