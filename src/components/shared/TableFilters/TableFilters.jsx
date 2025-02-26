import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import { Button, DateRangePicker } from '@components';

const TableFilters = ({ dateRange = null, onRangeChange = () => { }, onReset = () => { } }) => {
	const handleRangeChange = (value) => {
		if (!value || !value[0] || !value[1]) {
			onRangeChange({ from: null, to: null });
			return;
		}
		onRangeChange({ from: value[0], to: value[1] });
	};

	return (
		<>
			<Col xs={12} sm={6} lg={3} className='mb-3 d-flex flex-row'>
				<DateRangePicker
					value={dateRange ? [dateRange.from, dateRange.to] : null}
					placeholder='Filtrar por fechas'
					maxDate={new Date()}
					onChange={handleRangeChange}
				/>
				<Button
					className='ms-2'
					variant='gray'
					style={{ minWidth: 'auto', maxHeight: 38 }}
					onClick={onReset}
				>
					<FontAwesomeIcon icon={faRotate} size='sm' />
				</Button>
			</Col>
		</>
	);
};

export default TableFilters;
