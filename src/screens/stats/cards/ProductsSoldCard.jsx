import { useEffect, useState } from "react";
import { Card, MonthDropdown, SalesYearsDropdown, Spinner, Table } from "@components";
import API from "@app/API";

export const ProductsSoldCard = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({});
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(new Date().getFullYear());

	useEffect(() => {
		setLoading(true);

		API.get('stats/getSoldProductsByMonth', { month, year })
			.then((r) => {
				setData(r.data);
				setLoading(false);
			});
	}, [month, year]);

	const columns = [
		{
			name: 'name',
			text: 'Producto',
			className: 'text-start',
		},
		{
			name: 'quantity',
			text: 'Cantidad',
			className: 'text-start',
		}
	];

	return (
		<Card
			cardBodyClassName='p-0'
			header={
				<>
					<div className="d-flex flex-column flex-sm-row justify-content-start align-items-start align-items-sm-center">
						<h5 className="me-3 mb-2">Productos vendidos en:</h5>
						<div style={{ width: 130 }} className="me-3 mb-2">
							<MonthDropdown
								value={month}
								onChange={setMonth} />
						</div>
						<h5 className="me-3 mb-2">Año:</h5>
						<div style={{ width: 130 }} className="mb-2">
							<SalesYearsDropdown
								value={year}
								onChange={setYear} />
						</div>
					</div>
				</>
			}
			body={loading ? <Spinner /> :
				<Table
					columns={columns}
					rows={data.products}
				/>
			}
		/>
	);
};