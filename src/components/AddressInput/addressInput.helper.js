export const formatAddress = (suggestion) => {
    if (!suggestion || !suggestion.address) return;

    const { road, state, house_number, city, country } = suggestion.address;

    return [road ?? "", house_number ?? "", city ?? "", state ?? "", country ?? ""]
        .filter(Boolean)
        .join(", ");
};

export const debounce = (callback, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
};