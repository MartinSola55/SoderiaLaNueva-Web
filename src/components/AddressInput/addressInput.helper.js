export const formatAddress = (suggestion) => {
    if (!suggestion || !suggestion.address)
        return "";

    const addressParts = [
        suggestion.address.road || "",
        suggestion.address.house_number || suggestion.address.houseNumber || "",
        suggestion.address.suburb || "",
        suggestion.address.town || "",
        suggestion.address.village || "",
        suggestion.address.county || "",
        suggestion.address.neighbourhood || "",
        suggestion.address.city_district || suggestion.address.cityDistrict || "",
        suggestion.address.city || "",
        suggestion.address.state || "",
        suggestion.address.country || "",
        suggestion.address.postcode || "",
    ].filter(Boolean);

    return addressParts.join(", ");
};

export const debounce = (callback, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
};