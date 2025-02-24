import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, DatePicker, ExpenseModal, Spinner, Table } from "@components";
import { Dates, formatCurrency } from "@app/Helpers";
import API from "@app/API";
import { expensesCols } from "../Home.data";

import './ExpensesCard.scss';

export const ExpensesCard = () => {
	const expenseModalRef = useRef(null);

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [date, setDate] = useState(new Date());

	// Effects
	useEffect(() => {
		setLoading(true);
		getExpenses(date);
	}, [date]);

	// Private
	const getExpenses = (date) => {
		API.get('expense/getExpensesByDate', { date: Dates.formatDate(date) }).then((r) => {
			setData(r.data.expenses);
			setLoading(false);
		});
	};

	// Handlers
	const handleRangeChange = (date) => {
		setDate(date);
	};

	const handleAddExpense = useCallback(() => {
		expenseModalRef.current.open(
			() => getExpenses(date),
			null,
			'Agregar',
			false,
		);
	}, [date]);

	// Render
	return (
		<>
			<ExpenseModal ref={expenseModalRef} />
			<Card
				header={
					<div className="d-flex flex-row justify-content-between align-items-center">
						<div className="d-flex flex-row align-items-center">
							<h5 className="me-3 mb-0">Gastos del día</h5>
							<DatePicker
								value={date}
								placeholder='Filtrar por fechas'
								maxDate={new Date()}
								onChange={handleRangeChange}
							/>
						</div>
						<Button variant='primary' onClick={handleAddExpense}>Agregar gasto</Button>
					</div>
				}
				body={loading ? <Spinner /> :
					<>
						<Table
							className="expenses-table"
							rows={data}
							columns={expensesCols}
							bordered={false}
							striped={false}
							hover={false}
						/>
						<hr />
						<div className="d-flex flex-row justify-content-end">
							<h5 className="me-3 mb-0">Total:</h5>
							<h5 className="mb-0">{formatCurrency(data.reduce((acc, e) => acc + e.amount, 0))}</h5>
						</div>
					</>
				}
			/>
		</>
	)
};