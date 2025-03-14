import { useState, useEffect, useCallback } from "react";
import { Input, Toast } from "@components";
import { fetchAddress } from "./AddressInput.data";
import { formatAddress, debounce } from "./AddressInput.helper";
import "./addressInput.scss";

const AddressInput = ({
	address,
	disabled,
	onAddressSelect = () => { },
}) => {
	const [suggestions, setSuggestions] = useState([]);
	const [value, setValue] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setValue(formatAddress({ address }));
	}, [address]);

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
		setValue(value);
		debouncedFetchSuggestions(value);
	};

	const handleSelectAddress = (suggestion) => {
		setSuggestions([]);

		const addressData = {
			houseNumber: suggestion.address.house_number ?? '',
			road: suggestion.address.road ?? '',
			neighbourhood: suggestion.address.neighbourhood ?? '',
			suburb: suggestion.address.suburb ?? '',
			cityDistrict: suggestion.address.city_district ?? '',
			city: suggestion.address.city ?? '',
			town: suggestion.address.town ?? '',
			village: suggestion.address.village ?? '',
			county: suggestion.address.county ?? '',
			state: suggestion.address.state ?? '',
			country: suggestion.address.country ?? '',
			postcode: suggestion.address.postcode ?? '',
			lat: suggestion.lat,
			lon: suggestion.lon
		};

		onAddressSelect(addressData);
	};

	return (
		<div className="input-container">
			<div className="input-wrapper">
				<Input
					value={value}
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
