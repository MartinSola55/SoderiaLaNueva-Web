import * as RS from 'rsuite';
import esAr from 'rsuite/locales/es_AR';
import classNames from 'classnames';
import { addDays, isBefore } from 'date-fns';

import './datepicker.scss';
import 'rsuite/DatePicker/styles/index.css';

const predefinedRanges = [
	{
		label: 'Ayer',
		value: addDays(new Date(), -1),
	},
	{
		label: 'Hoy',
		value: new Date(),
	},
];

const DatePicker = ({
	value = null,
	placeholder = 'Ingrese una fecha',
	disabled = false,
	minDate = null,
	maxDate = null,
	showTime = false,
	onlyTime = false,
	required = false,
	className = undefined,
	helpText = null,
	onChange = () => { }
}) => {
	const format = onlyTime ? 'HH:mm' : showTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy';
	return (
		<div>
			<RS.CustomProvider locale={esAr}>
				<span className='datepicker-container'>
					<RS.DatePicker
						className={className}
						appearance="default"
						format={format}
						editable={false}
						weekStart={1}
						block
						ranges={predefinedRanges}
						oneTap={!onlyTime && !showTime}
						value={value}
						placeholder={placeholder}
						disabled={disabled}
						shouldDisableDate={date => (minDate && isBefore(date, minDate)) || (maxDate && isBefore(maxDate, date))}
						onChange={onChange}
					/>
					{helpText && <small className={classNames("datepicker-text", required && "required")}>{helpText}</small>}
				</span>
			</RS.CustomProvider>
		</div>
	);
};

export default DatePicker;