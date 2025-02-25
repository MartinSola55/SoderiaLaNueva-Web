import { useCallback, useEffect, useState } from "react";
import { AreaChart, Card, SalesYearsDropdown, Spinner } from "@components";
import { formatCurrency, getMonthName } from "@app/Helpers";
import API from "@app/API";

export const AnualSalesCard = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({});
	const [year, setYear] = useState(new Date().getFullYear());

	useEffect(() => {
		setLoading(true);

		API.get('stats/getAnualSales', { year })
			.then((r) => {
				setData(r.data);
				setLoading(false);
			});
	}, [year]);

	const getXValues = useCallback(() => {
		return data?.daily?.map((x) => x.total);
	}, [data]);

	const getYValues = useCallback(() => {
		return data?.daily?.map((x) => getMonthName(x.period));
	}, [data]);

	return (
		<Card
			cardBodyClassName='p-0'
			header={
				<>
					<div className="d-flex flex-row justify-content-start align-items-start">
						<h5 className="me-3 mb-2">Ventas anuales</h5>
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
				<AreaChart
					data={getXValues()}
					categories={getYValues()}
				/>
			}
		/>
	);
};