import { useEffect, useState } from "react";
import { Button, Card, DatePicker, Spinner, Table } from "../../../components";
import { expensesCols } from "../Home.data";
import { Dates, formatCurrency } from "../../../app/Helpers";
import API from "../../../app/API";

import './ExpensesCard.scss';

export const ExpensesCard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date());

    // Effects
    useEffect(() => {
        setLoading(true);
        API.get('expense/getExpensesByDate', { date: Dates.formatDate(date) }).then((r) => {
            setData(r.data.expenses);
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
                    <Button variant='primary'>Agregar gasto</Button>
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
    )
};