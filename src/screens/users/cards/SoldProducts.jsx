import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Button, Card, DateRangePicker, Spinner, Table } from "@components";
import API from "@app/API";
import { Dates, formatCurrency } from "@app/Helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";

export const SoldProducts = ({ id }) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({});
	const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });

	const columns = [
		{
			name: 'name',
			text: 'Producto'
		},
		{
			name: 'amount',
			text: 'Cantidad'
		},
		{
			name: 'total',
			text: 'Total',
			formatter: (_, row) => `${formatCurrency(row.total)}`,
		},
	]

	useEffect(() => {
		setLoading(true);

		API.get('stats/SoldProductsByRange', { dealerId: id, dateFrom: Dates.formatDate(dateRange.from), dateTo: Dates.formatDate(dateRange.to) })
			.then((r) => {
				setData(r.data.products);
				setLoading(false);
			});
	}, [dateRange.from, dateRange.to, id]);

	const handleRangeChange = (value) => {
		if (!value || !value[0] || !value[1]) {
			setDateRange({ from: null, to: null });
			return;
		}
		setDateRange({ from: value[0], to: value[1] });
	};

	const handleResetFilters = () => {
		setDateRange({ from: new Date(), to: new Date() });
	};


	return (
		<Col className="mt-5" xs={6}>
			<Card
				cardBodyClassName='p-0'
				header={
					<>
						<div className="d-flex flex-column flex-sm-row justify-content-start align-items-start align-items-sm-center">
							<h5 className="me-3 mb-2">Productos vendidos en el rango:</h5>
							<div className="d-flex">
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
									onClick={handleResetFilters}
								>
									<FontAwesomeIcon icon={faRotate} size='sm' />
								</Button>
							</div>
						</div>
					</>
				}
				body={loading ? <Spinner /> :
					<Row>
						<Col>
							<Table
								columns={columns}
								rows={data}
								emptyTableMessage='No se encontraron productos vendidos entre esas fechas.'
							/>
						</Col>
					</Row>
				}
			/>
		</Col>
	);
};