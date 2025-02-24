import { useEffect, useState } from "react";
import { Card, DatePicker, Spinner, Table } from "@components";
import { Dates } from "@app/Helpers";
import API from "@app/API";
import { soldProductsCols } from "../Home.data";

import './SoldProductsCard.scss';

export const SoldProductsCard = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [date, setDate] = useState(new Date());

	// Effects
	useEffect(() => {
		setLoading(true);
		API.get('product/getSoldProductsByDate', { date: Dates.formatDate(date) }).then((r) => {
			setData(r.data.products);
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
					<h5 className="me-3 mb-0">Productos vendidos el</h5>
					<DatePicker
						value={date}
						placeholder='Filtrar por fechas'
						maxDate={new Date()}
						onChange={handleRangeChange}
					/>
				</div>
			}
			body={loading ? <Spinner /> :
				<Table
					className="sold-products-table"
					rows={data}
					columns={soldProductsCols}
					bordered={false}
					striped={false}
					hover={false}
				/>
			}
		/>
	)
};