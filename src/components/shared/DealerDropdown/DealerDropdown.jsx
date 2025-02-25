import { memo, useEffect, useState } from 'react';
import { Dropdown } from '@components';
import { formatComboItems } from '@app/Helpers';
import API from '@app/API';

const DealerDropdown = ({
	value = null,
	label = null,
	required = false,
	disabled = false,
	placeholder = 'Seleccione un repartidor',
	isMulti = false,
	roles = [],
	onChange = () => { },
}) => {
	const [items, setItems] = useState(null);

	// Get users
	useEffect(() => {
		if (items) return;

		API.get('dealer/getComboDealers').then((r) => {
			setItems(formatComboItems(r.data.items));
		});
	}, [roles, items]);

	const handleChange = (options) => {
		const value = isMulti ? options : options.value;
		onChange(value);
	};

	return (
		<Dropdown
			placeholder={placeholder}
			label={label}
			required={required}
			isMulti={isMulti}
			disabled={disabled}
			items={items ?? []}
			value={value}
			onChange={(option) => handleChange(option)}
		/>
	);
};

const MemoDropdown = memo(DealerDropdown, (prevProps, nextProps) => {
	return (
		nextProps.value === prevProps.value &&
		nextProps.label === prevProps.label &&
		nextProps.required === prevProps.required &&
		nextProps.placeholder === prevProps.placeholder &&
		nextProps.isMulti === prevProps.isMulti &&
		nextProps.disabled === prevProps.disabled
	);
});

export default MemoDropdown;
