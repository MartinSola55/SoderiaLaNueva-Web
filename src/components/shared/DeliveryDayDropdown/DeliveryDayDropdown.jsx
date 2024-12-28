import { memo, useState } from 'react';
import { Dropdown } from '../..';

const DeliveryDayDropdown = ({
    value = null,
    label = null,
    required = false,
    disabled = false,
    placeholder = 'Seleccione un día de reparto',
    isMulti = false,
    onChange = () => {},
}) => {
    // eslint-disable-next-line no-unused-vars
    const [deliveryDays, _] = useState([
        { value: 1, label: 'Lunes' },
        { value: 2, label: 'Martes' },
        { value: 3, label: 'Miércoles' },
        { value: 4, label: 'Jueves' },
        { value: 5, label: 'Viernes' },
    ]);

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
            items={deliveryDays}
            value={value}
            onChange={(option) => handleChange(option)}
        />
    );
};

const MemoDropdown = memo(DeliveryDayDropdown, (prevProps, nextProps) => {
    return (
        nextProps.value === prevProps.value &&
        nextProps.label === prevProps.label &&
        nextProps.required === prevProps.required &&
        nextProps.placeholder === prevProps.placeholder &&
        nextProps.isMulti === prevProps.isMulti &&
        JSON.stringify(nextProps.roles) === JSON.stringify(prevProps.roles)
    );
});

export default MemoDropdown;
