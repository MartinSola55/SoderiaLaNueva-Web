import { useEffect, useState } from "react";
import { Card, DatePicker, Spinner, Table } from "../../../components";
import { routesCols } from "../Home.data";
import API from "../../../app/API";
import { Dates, formatCurrency } from "../../../app/Helpers";

import './RoutesCard.scss';

export const RoutesCard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date());

    // Effects
    useEffect(() => {
        setLoading(true);
        API.get('route/getDynamicRoutes', { date: Dates.formatDate(date) }).then((r) => {
            setData(r.data.routes);
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
                    <h5 className="me-3 mb-0">Repartos del día</h5>
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
                        className="routes-table"
                        rows={data}
                        columns={routesCols}
                        bordered={false}
                        striped={false}
                        hover={false}
                    />
                    <hr />
                    <div className="d-flex flex-row justify-content-end">
                        <h5 className="me-3 mb-0">Total (con transferencias):</h5>
                        <h5 className="mb-0">{formatCurrency(data.reduce((acc, e) => acc + e.totalCollected, 0))}</h5>
                    </div>
                </>
            }
        />
    )
};