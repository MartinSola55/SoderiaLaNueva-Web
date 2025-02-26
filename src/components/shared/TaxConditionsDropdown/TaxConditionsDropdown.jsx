import { memo, useEffect, useState } from 'react';
import { Dropdown } from '@components';
import { formatComboItems } from '@app/Helpers';
import API from '@app/API';

const TaxConditionsDropdown = ({
	value = null,
	label = null,
	required = false,
	disabled = false,
	placeholder = 'Seleccione una condición',
	onChange = () => { },
}) => {
	const [items, setItems] = useState(null);

	// Get users
	useEffect(() => {
		if (items) return;

		API.get('client/getComboTaxConditions').then((r) => {
			setItems(formatComboItems(r.data.items));
		});
	}, [items]);

	const handleChange = (options) => {
		onChange(options.value);
	};

	return (
		<Dropdown
			placeholder={placeholder}
			label={label}
			required={required}
			disabled={disabled}
			items={items ?? []}
			value={value}
			onChange={(option) => handleChange(option)}
		/>
	);
};

const MemoDropdown = memo(TaxConditionsDropdown, (prevProps, nextProps) => {
	return (
		nextProps.value === prevProps.value &&
		nextProps.label === prevProps.label &&
		nextProps.required === prevProps.required &&
		nextProps.disabled === prevProps.disabled &&
		nextProps.placeholder === prevProps.placeholder
	);
});

export default MemoDropdown;
