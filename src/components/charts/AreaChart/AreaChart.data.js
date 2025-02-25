import { formatCurrency } from "@app/Helpers";

export const getChartDefaultOptions = (title, xAxisLabel, yAxisLabel, categories, yMax, isCurrency) => ({
	chart: {
		height: 350,
		type: 'line',
		dropShadow: {
			enabled: true,
			color: '#000',
			top: 18,
			left: 7,
			blur: 10,
			opacity: 0.5
		},
		zoom: {
			enabled: false
		},
		toolbar: {
			show: false
		}
	},
	colors: ['#2F3D4A'],
	dataLabels: {
		enabled: false,
	},
	stroke: {
		curve: 'smooth'
	},
	title: {
		text: title,
		align: 'center'
	},
	grid: {
		borderColor: '#e7e7e7',
	},
	markers: {
		size: 1
	},
	xaxis: {
		categories: categories,
		tickAmount: 12,
		title: {
			text: xAxisLabel
		}
	},
	yaxis: {
		title: {
			text: yAxisLabel
		},
		min: 0,
		max: yMax,
		labels: {
			formatter: function (val) {
				return isCurrency ? formatCurrency(val, false) : val;
			}
		}
	}
});