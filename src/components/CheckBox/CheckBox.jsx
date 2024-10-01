import classNames from 'classnames';
import { useEffect, useImperativeHandle, useState } from 'react';
import { useRef } from 'react';
import { forwardRef } from 'react';
import InfoButton from '../InfoButton/InfoButton';

import './checkBox.scss';

// eslint-disable-next-line
const CheckBox = forwardRef(({
    checked = false,
    isSwitch = false,
    name = '',
    label = '',
    disabled = false,
    className = '',
    style = {},
    helpText = null,
    helpColor = undefined,
    helpStyle = {},
    helpPlacement = undefined,
    onChange = () => { },
}, ref) => {
    const checkboxRef = useRef(null);
    const [value, setValue] = useState(checked);

    useImperativeHandle(ref, () => ({
        focus: () => checkboxRef.current.focus(),
    }));

    const _update = (value) => {
        setValue(value);
        onChange(value);
    };

    useEffect(() => {
        setValue(checked);
    }, [checked]);

    const handleChange = (e) => {
        _update(e.target.checked);
    };

    return (
        <div
            className={classNames('form-check', isSwitch && 'form-switch', disabled && 'disabled', className)}
            style={style}
        >
            <label className='form-check-label'>
                <input
                    className='form-check-input custom-checkbox'
                    name={name}
                    type='checkbox'
                    checked={value}
                    disabled={disabled}
                    onChange={handleChange}
                    ref={checkboxRef}
                />
                {label}
                {helpText && (
                    <InfoButton
                        style={{ marginLeft: '5px' }}
                        helpText={helpText}
                        helpColor={helpColor}
                        helpStyle={helpStyle}
                        helpPlacement={helpPlacement}
                    />
                )}
            </label>
        </div>
    );
},
);

export default CheckBox;