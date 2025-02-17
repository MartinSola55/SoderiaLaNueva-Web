import { useState, useEffect, useCallback } from "react";
import { fetchAddress } from "./AddressInput.data";
import { formatAddress, debounce } from "./addressInput.helper";
import Input from "../Input/Input";
import Toast from "../Toast/Toast";
import "./addressInput.scss";

const AddressInput = ({
    value,
    disabled,
    onAddressSelect = () => { },
}) => {
    const [address, setAddress] = useState(value || "");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAddress(value || "");
    }, [value]);

    const fetchSuggestions = async (value) => {
        if (value.length < 3) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        try {
            const results = await fetchAddress(value);
            setSuggestions(results);
        } catch (error) {
            Toast.error("Error fetching address");
            setSuggestions([]);
        }
        setLoading(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

    const handleInputChange = (value) => {
        setAddress(value);
        debouncedFetchSuggestions(value);
    };

    const handleSelectAddress = (suggestion) => {
        const formattedAddress = formatAddress(suggestion);
        setAddress(formattedAddress);
        setSuggestions([]);

        const addressData = {
            nameNumber: suggestion.address.road + ' ' + suggestion.address.house_number,
            state: suggestion.address.state,
            city: suggestion.address.city,
            country: suggestion.address.country,
            lat: suggestion.lat,
            lon: suggestion.lon
        };

        onAddressSelect(addressData);
    };

    return (
        <div className="input-container">
            <div className="input-wrapper">
                <Input
                    value={address}
                    disabled={disabled}
                    maxLength={100}
                    placeholder="Ingrese su dirección"
                    onChange={handleInputChange}
                />
                {loading && <span className="spinner">⏳</span>}
            </div>
            {suggestions.length > 0 && (
                <ul className="suggestions-list" role="listbox">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.place_id}
                            onClick={() => handleSelectAddress(suggestion)}
                            role="option"
                            className="suggestion-item"
                        >
                            {formatAddress(suggestion)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressInput;
