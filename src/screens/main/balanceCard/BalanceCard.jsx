import { useEffect, useState } from "react";
import { Card, DatePicker, Spinner, Table } from "@components";
import { Dates } from "@app/Helpers";
import API from "@app/API";
import { getTotalCollected } from "../Home.helpers";
import { balanceCols } from "../Home.data";

import './BalanceCard.scss';

export const BalanceCard = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [date, setDate] = useState(new Date());

	// Effects
	useEffect(() => {
		setLoading(true);
		API.get('stats/getBalanceByDay', { date: Dates.formatDate(date) }).then((r) => {
			setData(r.data.items);
			setLoading(false);
		});
	}, [date]);

	// Handlers
	const handleRangeChange = (date) => {
		setDate(date);
	};

	// Render
	return (
		<Card
			header={
				<div className="d-flex flex-row align-items-center">
					<h5 className="me-3 mb-0">Balance del día</h5>
					<DatePicker
						value={date}
						placeholder='Filtrar por fechas'
						maxDate={new Date()}
						onChange={handleRangeChange}
					/>
				</div>
			}
			body={loading ? <Spinner /> :
				<>
					<Table
						className="balance-table"
						rows={data}
						columns={balanceCols}
						bordered={false}
						striped={false}
						hover={false}
					/>
					<hr />
					<div className="d-flex flex-row justify-content-end">
						<h5 className="me-3 mb-0">Total:</h5>
						<h5 className="mb-0">{getTotalCollected(data)}</h5>
					</div>
				</>
			}
		/>
	)
};