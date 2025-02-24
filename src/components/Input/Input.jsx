import classNames from 'classnames';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import InfoButton from '../InfoButton/InfoButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './input.scss';

// eslint-disable-next-line
const Input = forwardRef(({
	value = '',
	tag = 'input',
	type = 'text',
	placeholder = '',
	helpText = null,
	extraHelpText = null,
	extraHelpColor = undefined,
	extraHelpStyle = {},
	extraHelpPlacement = undefined,
	borderless = false,
	showIcon = false,
	isFloat = false,
	isPhone = false,
	required = false,
	style = {},
	onChange = () => { },
	onFocus = () => { },
	onClick = () => { },
	onSubmit = () => { },
	maxLength = 30,
	maxLengthFloat = 2,
	minValue = undefined,
	maxValue = undefined,
	autoTrim = false,
	disabled = false,
	className = undefined,
	submitOnEnter = false,
	cols = 30,
	rows = 4,
}, ref) => {
	const inputRef = useRef(null);

	useImperativeHandle(ref, () => ({
		clear: () => _update(''),
		focus: () => inputRef.current.focus(),
	}));

	const _update = (value) => {
		if (inputRef.current) {
			inputRef.current.value = value;
		}
		onChange(value);
	};

	const handleChange = (e) => {
		const isNumeric = type === 'number';

		let value = e.target.value;
		if (autoTrim) {
			value = value.trim();
		}
		if (maxLength && value.length > maxLength) {
			value = value.substring(0, maxLength);
		}
		if (isNumeric && isNaN(value)) {
			return;
		}
		if (isNumeric && value !== '' && !isNaN(value)) {
			if (isFloat) {
				const parts = value.split('.');
				if (parts.length > 1) {
					const decimalPart = parts[1];
					if (decimalPart.length > maxLengthFloat) {
						value = parseFloat(value).toFixed(maxLengthFloat);
					} else if (decimalPart != '') {
						value = decimalPart != '0' ? parseFloat(value).toString() : `${parts[0]}.0`;
					}
				} else {
					value = parseFloat(value).toString();
				}
			} else {
				value = parseInt(value).toString();
			}
		}
		if (minValue !== undefined && minValue !== null && value < minValue) {
			value = minValue;
		}
		if (maxValue !== undefined && maxValue !== null && value > maxValue) {
			value = maxValue;
		}
		if (isPhone && value.length > 10) {
			value = value.substring(0, 10);
		}

		if (isNumeric && !isFloat && Number.isInteger(parseFloat(value)) && value !== '' && !isNaN(value)) {
			value = parseInt(value);
		}
		_update(value);
	};

	const handleFocus = (e) => {
		if (autoTrim) {
			_update(e.target.value.trim());
		}
		onFocus(e);
	};

	const handleKeyDown = (e) => {
		if (submitOnEnter && e.key === 'Enter')
			onSubmit();
	};

	const inputProps = {
		value,
		style,
		type,
		required,
		placeholder,
		step: isFloat ? 0.01 : 1,
		disabled: disabled ? 'disabled' : undefined,
		className: classNames('form-control', borderless && 'input-borderless', showIcon && 'with-icon', className),
		onChange: handleChange,
		onFocus: handleFocus,
		onClick: onClick,
	};

	if (minValue !== undefined) inputProps.min = minValue;

	if (maxValue !== undefined) inputProps.max = maxValue;

	if (tag === 'input') {
		return (
			<span className='input-container'>
				<span className='input-wrapper'>
					<input {...inputProps} ref={inputRef} onKeyDown={handleKeyDown} />
					{showIcon && <FontAwesomeIcon icon={faSearch} color='#ccc' />}
				</span>
				{helpText && (
					<small className={classNames('input-text', required && 'required')}>
						{helpText}
					</small>
				)}
				{extraHelpText && (
					<InfoButton
						textStyle={extraHelpStyle}
						style={{ marginLeft: '5px' }}
						color={extraHelpColor}
						placement={extraHelpPlacement}
						helpText={extraHelpText}
					/>
				)}
			</span>
		);
	} else if (tag === 'textarea') {
		return (
			<span className='input-container'>
				<textarea {...inputProps} ref={inputRef} cols={cols} rows={rows} />
				{helpText && (
					<small className={classNames('input-text', required && 'required')}>
						{helpText}
					</small>
				)}
				{extraHelpText && (
					<InfoButton
						textStyle={extraHelpStyle}
						style={{ marginLeft: '5px' }}
						color={extraHelpColor}
						placement={extraHelpPlacement}
						helpText={extraHelpText}
					/>
				)}
			</span>
		);
	}
	return null;
});

export default Input;
