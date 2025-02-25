import Chart from "react-apexcharts";
import { getChartDefaultOptions } from "./AreaChart.data";

export const AreaChart = ({
	data = [],
	title = '',
	dataTitle = '',
	xAxisLabel = '',
	yAxisLabel = '',
	isCurrency = true,
	categories = [],
}) => {
	const yMax = Math.max(...data);
	const options = getChartDefaultOptions(title, xAxisLabel, yAxisLabel, categories, yMax, isCurrency);
	const series = [
		{
			name: dataTitle,
			data,
		}
	];

	return (
		<Chart
			options={options}
			series={series}
			type="area"
			width='100%'
			height={400}
		/>
	);
};