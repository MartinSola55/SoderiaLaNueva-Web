import classNames from 'classnames';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import InfoButton from '../InfoButton/InfoButton';

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
    }

    const handleChange = (e) => {
        const numeric = type === 'number';

        let value = e.target.value;
        if (autoTrim) {
            value = value.trim();
        }
        if (maxLength && value.length > maxLength) {
            value = value.substring(0, maxLength);
        }
        if (numeric && isNaN(value) && value !== '-') {
            return;
        }
        if (numeric && isFloat && value !== '' && !isNaN(value)) {
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
        }
        if (minValue !== undefined && value < minValue) {
            value = minValue;
        }
        if (maxValue !== undefined && value > maxValue) {
            value = maxValue;
        }
        if (isPhone && value.length > 10) {
            value = value.substring(0, 10);
        }

        if (numeric && !isFloat && Number.isInteger(parseFloat(value)) && value !== '' && !isNaN(value)) {
            value = parseInt(value);
        }
        _update(value);
    }

    const handleFocus = (e) => {
        if (autoTrim) {
            _update(e.target.value.trim());
        }
        onFocus(e);
    }

    const handleKeyDown = (e) => {
        if (submitOnEnter && e.key === 'Enter')
            onSubmit();
    };

    const inputProps = {
        value,
        style,
        type: type === 'number' ? 'text' : type,
        required,
        placeholder,
        step: isFloat ? 0.01 : 1,
        disabled: disabled ? 'disabled' : undefined,
        className: classNames('form-control', borderless && 'input-borderless', className),
        onChange: handleChange,
        onFocus: handleFocus,
        onClick: onClick,
    };

    if (minValue !== undefined)
        inputProps.min = minValue;

    if (maxValue !== undefined)
        inputProps.max = maxValue;

    if (tag === 'input') {
        return (
            <span className='input-container'>
                <input {...inputProps} ref={inputRef} onKeyDown={handleKeyDown} />
                {helpText && <small className={classNames("input-text", required && "required")}>{helpText}</small>}
                {extraHelpText
                    && (
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
                {helpText && <small className={classNames("input-text", required && "required")}>{helpText}</small>}
                {extraHelpText
                    && (
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