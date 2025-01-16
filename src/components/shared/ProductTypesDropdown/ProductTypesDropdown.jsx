import { memo, useEffect, useState } from 'react';
import { Dropdown } from '../..';
import API from '../../../app/API';
import { formatComboItems } from '../../../app/Helpers';

const ProductTypesDropdown = ({
    value = null,
    label = null,
    required = false,
    disabled = false,
    placeholder = 'Seleccione un tipo de producto',
    isMulti = false,
    onChange = () => { },
}) => {
    const [items, setItems] = useState(null);

    // Get users
    useEffect(() => {
        if (items) return;

        API.get('product/getComboProductTypes').then((r) => {
            setItems(formatComboItems(r.data.items));
        });
    }, [items]);

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
            items={items ? items : []}
            value={value}
            onChange={(option) => handleChange(option)}
        />
    );
};

const MemoDropdown = memo(ProductTypesDropdown, (prevProps, nextProps) => {
    return (
        nextProps.value === prevProps.value &&
        nextProps.label === prevProps.label &&
        nextProps.required === prevProps.required &&
        nextProps.placeholder === prevProps.placeholder &&
        nextProps.isMulti === prevProps.isMulti
    );
});

export default MemoDropdown;
