import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Card, DeliveryDayDropdown, Spinner, Table } from "@components";
import API from "@app/API";
import { formatCurrency, getDayIndex } from "@app/Helpers";
import './dealerMonthlySales.scss';

export const ClientsDebt = ({ id }) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [deliveryDay, setDeliveryDay] = useState(getDayIndex());

	const columns = [
		{
			name: 'name',
			text: 'Producto'
		},
		{
			name: 'debt',
			text: 'Deuda',
			formatter: (_, row) => `${formatCurrency(row.debt)}`,
		},
	]

	useEffect(() => {
		setLoading(true);

		API.get('stats/ClientsDebt', { dealerId: id, deliveryDay: deliveryDay })
			.then((r) => {
				setData(r.data.clients);
				setLoading(false);
			});
	}, [deliveryDay, id]);

	return (
		<Col className="mt-5" xs={6}>
			<Card
				cardBodyClassName='p-0'
				header={
					<>
						<div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
							<h5 className="me-3 mb-2">Clientes del día:</h5>
							<div className="d-flex">
								<DeliveryDayDropdown
									value={deliveryDay}
									placeholder='Dia'
									onChange={(v) => setDeliveryDay(v)}
								/>
							</div>
						</div>
						<h4>Total: {formatCurrency((data || []).reduce((acc, x) => acc + (x.debt || 0), 0))}</h4>
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