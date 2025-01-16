import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import Select from 'react-select';
import classnames from 'classnames';
import InfoButton from '../InfoButton/InfoButton';
import classNames from 'classnames';

import './dropdown.scss';

const colorStyles = {
    control: (styles) => {
        return {
            ...styles,
            border: '1px solid steelblue !important;',
            boxShadow: 'none',
        };
    },
    option: (styles, { isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            backgroundColor: isDisabled ? '#ededed' : isSelected ? '#8fbc8f78' : isFocused ? 'rgba(0, 160, 0, 0.075)' : null,
            color: isSelected ? 'black' : '#646f75',
            cursor: isDisabled ? 'not-allowed' : 'default',
        };
    },
};

// eslint-disable-next-line
const Dropdown = forwardRef(({
    items,
    name = null,
    className = null,
    value = isMulti ? [] : null,
    required = false,
    disabled = false,
    placeholder = 'Seleccione una opción',
    searchable = true,
    clearable = false,
    isMulti = false,
    label = null,
    helpText = null,
    helpColor = undefined,
    helpStyle = undefined,
    helpPlacement = 'right',
    onChange = () => { },
    onDirt = () => { },
    disbaleOption = () => { },
    ...props
}, ref) => {
    const [selectedValue, setSelectedValue] = useState(isMulti ? [] : null);

    useImperativeHandle(ref, () => ({
        clear: () => setSelectedValue(null)
    }));

    const handleChange = useCallback((item) => {
        onDirt();
        onChange(item);
    }, [onDirt, onChange]);

    useEffect(() => {
        const selectedValue = isMulti ? items && items.filter((x) => value.includes(x.value)) || [] : items && items.find((x) => x.value === value) || null;
        setSelectedValue(selectedValue);
    }, [isMulti, items, value]);

    return (
        <div className={`dropdown-container ${helpText ? 'padding-end' : ''}`}>
            <span className='dropdown'>
                <Select
                    {...props}
                    className={classnames(className, "w-100")}
                    name={name}
                    styles={colorStyles}
                    required={required}
                    value={selectedValue}
                    placeholder={placeholder}
                    isDisabled={disabled}
                    isSearchable={searchable}
                    isClearable={clearable}
                    isMulti={isMulti}
                    options={items}
                    isOptionDisabled={disbaleOption}
                    onChange={handleChange}
                    noOptionsMessage={() => 'Sin resultados'}
                />
                {label && <small className={classNames("dropdown-text", required && "required")}>{label}</small>}
            </span>
            {helpText && (
                <div className='help-text'>
                    <span className='d-flex justify-content-center align-items-center'>
                        <InfoButton
                            textStyle={helpStyle}
                            style={{ marginLeft: '5px' }}
                            color={helpColor}
                            placement={helpPlacement}
                            helpText={helpText}
                        />
                    </span>
                </div>
            )}
        </div>
    );
});

// eslint-disable-next-line react-refresh/only-export-components
const MemoDropdown = memo(Dropdown, (prevProps, nextProps) => {
    return nextProps.value === prevProps.value
        && nextProps.items === prevProps.items
        && nextProps.disabled === prevProps.disabled;
});

// eslint-disable-next-line react-refresh/only-export-components
export default MemoDropdown;