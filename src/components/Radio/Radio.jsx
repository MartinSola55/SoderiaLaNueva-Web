import { forwardRef, useImperativeHandle, useRef } from "react";
import InfoButton from "../InfoButton/InfoButton";
import classNames from "classnames";

import "./radio.scss";

// eslint-disable-next-line
const Radio = forwardRef(({
    value = false,
    name = '',
    option = '',
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
    const radioRef = useRef(null);

    const checked = option === value;

    useImperativeHandle(ref, () => ({
        focus: () => radioRef.current.focus(),
    }));

    const _update = (option) => {
        onChange(option);
    };

    const handleChange = (e) => {
        _update(e.target.checked ? option : null);
    };

    return (
        <div
            className={classNames('form-check', className)}
            style={style}
        >
            <label className='form-check-label'>
                <input
                    className='form-check-input custom-radio'
                    name={name}
                    type='radio'
                    checked={checked}
                    disabled={disabled}
                    onChange={handleChange}
                    ref={radioRef}
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
});

export default Radio;