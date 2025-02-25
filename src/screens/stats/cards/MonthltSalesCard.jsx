import { useCallback, useEffect, useState } from "react";
import { Card, LineChart, MonthDropdown, SalesYearsDropdown, Spinner } from "@components";
import { formatCurrency } from "@app/Helpers";
import API from "@app/API";

export const MonthltSalesCard = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({});
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(new Date().getFullYear());

	useEffect(() => {
		setLoading(true);

		API.get('stats/getMonthlySales', { month, year })
			.then((r) => {
				setData(r.data);
				setLoading(false);
			});
	}, [month, year]);

	const getXValues = useCallback(() => {
		return data?.daily?.map((x) => x.total);
	}, [data]);

	const getYValues = useCallback(() => {
		return data?.daily?.map((x) => x.period);
	}, [data]);

	return (
		<Card
			cardBodyClassName='p-0'
			header={
				<>
					<div className="d-flex flex-column flex-sm-row justify-content-start align-items-start align-items-sm-center">
						<h5 className="me-3 mb-2">Ventas del mes:</h5>
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
					<h4>Total: {formatCurrency(data.total || 0)}</h4>
				</>
			}
			body={loading ? <Spinner /> :
				<LineChart
					data={getXValues()}
					categories={getYValues()}
				/>
			}
		/>
	);
};