import classNames from 'classnames';
import { endOfMonth, endOfWeek, isBefore, startOfMonth, startOfWeek, subMonths, subWeeks } from 'date-fns';
import * as RS from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';
import esAr from 'rsuite/locales/es_AR';

import './daterangepicker.scss';

const predefinedRanges = [
    {
        label: "Esta semana",
        value: [startOfWeek(new Date(), { weekStartsOn: 1 }), endOfWeek(new Date(), { weekStartsOn: 1 })],
    },
    {
        label: 'Semana pasada',
        value: [startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }), endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 })],
    },
    {
        label: 'Este mes',
        value: [startOfMonth(new Date()), endOfMonth(new Date())],
    },
    {
        label: 'Mes pasado',
        value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))],
    }
];

const DateRangePicker = ({
    value = [],
    placeholder = 'Ingrese una fecha',
    disabled = false,
    minDate = null,
    maxDate = null,
    showTime = false,
    required = false,
    className = undefined,
    helpText = null,
    onChange = () => { }
}) => {
    const format = showTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy';
    return (
        <div>
            <RS.CustomProvider locale={esAr}>
                <span className='daterangepicker-container'>
                    <RS.DateRangePicker
                        appearance="default"
                        character=" - "
                        className={className}
                        showHeader={false}
                        format={format}
                        editable={false}
                        weekStart={1}
                        block
                        ranges={predefinedRanges}
                        showOneCalendar
                        value={value}
                        placeholder={placeholder}
                        disabled={disabled}
                        shouldDisableDate={date => (minDate && isBefore(date, minDate)) || (maxDate && isBefore(maxDate, date))}
                        onChange={onChange}
                    />
                    {helpText && <small className={classNames("daterangepicker-text", required && "required")}>{helpText}</small>}
                </span>
            </RS.CustomProvider>
        </div>
    );
};

export default DateRangePicker;