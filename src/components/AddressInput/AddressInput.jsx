/* eslint-disable no-console */
import { useState, useEffect, useCallback } from "react";
import { fetchAddress } from "./AddressInput.data";
import { formatAddress, debounce } from "./addressInput.helper";
import Input from "../Input/Input";
import "./addressInput.scss";

const AddressInput = ({ onAddressSelect, disabled, value }) => {
    const [address, setAddress] = useState(value || "");
    const [cords, setCords] = useState([]);
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
            console.error("Error fetching address:", error);
            setSuggestions([]);
        }
        setLoading(false);
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

    const handleInputChange = (value) => {
        setAddress(value);
        debouncedFetchSuggestions(value);
    };

    const handleSelectAddress = (suggestion) => {
        const formattedAddress = formatAddress(suggestion);
        setAddress(formattedAddress);
        setSuggestions([]);
        if (onAddressSelect) {
            onAddressSelect(suggestion);
            setCords([suggestion.lat, suggestion.lon]);
        }
    };

    return (
        <div className="input-container">
            <div className="input-wrapper">
                <Input
                    value={address}
                    onChange={handleInputChange}
                    disabled={disabled}
                    placeholder="Ingrese su dirección"
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
