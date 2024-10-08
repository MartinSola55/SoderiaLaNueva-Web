import { memo, useEffect, useState } from 'react';
import { Dropdown } from '../..';
import API from '../../../app/API';

const UserDropdown = ({
    value = null,
    label = null,
    required = false,
    disabled = false,
    placeholder = 'Seleccione un usuario',
    isMulti = false,
    role = null,
    onChange = () => { },
}) => {
    const [items, setItems] = useState(null);

    // Get users
    useEffect(() => {
        if (items) return;

        API.post('user/GetAll', { role }).then((r) => {
            setItems(
                r.data.users.map((user) => ({
                    value: user.id,
                    label: `${user.fullName} - ${user.role}`,
                }))
            );
        });
    }, [role, items]);


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

const MemoDropdown = memo(UserDropdown, (prevProps, nextProps) => {
    return (
        nextProps.value === prevProps.value &&
        nextProps.label === prevProps.label &&
        nextProps.required === prevProps.required &&
        nextProps.placeholder === prevProps.placeholder &&
        nextProps.isMulti === prevProps.isMulti &&
        JSON.stringify(nextProps.role) === JSON.stringify(prevProps.role)
    );
});

export default MemoDropdown;