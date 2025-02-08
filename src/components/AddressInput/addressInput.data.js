/* eslint-disable no-console */
export const fetchAddress = async (address) => {
    try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=jsonv2&addressdetails=1&countrycodes=ar&limit=8`;
        const resp = await fetch(url);

        if (!resp.ok) {
            alert('Error fetching address');
        }

        const data = await resp.json();
        console.log(data);
        return data;
    } catch(error) {
        alert(error);
    }
}