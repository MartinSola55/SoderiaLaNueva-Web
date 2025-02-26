import { memo } from 'react';
import { Dropdown } from '@components';

const MonthDropdown = ({
	value = null,
	label = null,
	required = false,
	disabled = false,
	placeholder = 'Mes',
	isMulti = false,
	onChange = () => { },
}) => {
	const months = [
		{ value: 1, label: 'Enero' },
		{ value: 2, label: 'Febrero' },
		{ value: 3, label: 'Marzo' },
		{ value: 4, label: 'Abril' },
		{ value: 5, label: 'Mayo' },
		{ value: 6, label: 'Junio' },
		{ value: 7, label: 'Julio' },
		{ value: 8, label: 'Agosto' },
		{ value: 9, label: 'Septiembre' },
		{ value: 10, label: 'Octubre' },
		{ value: 11, label: 'Noviembre' },
		{ value: 12, label: 'Diciembre' }
	];

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
			items={months}
			value={value}
			onChange={(option) => handleChange(option)}
		/>
	);
};

const MemoDropdown = memo(MonthDropdown, (prevProps, nextProps) => {
	return (
		nextProps.value === prevProps.value &&
		nextProps.label === prevProps.label &&
		nextProps.required === prevProps.required &&
		nextProps.placeholder === prevProps.placeholder &&
		nextProps.disabled === prevProps.disabled &&
		nextProps.isMulti === prevProps.isMulti
	);
});

export default MemoDropdown;
