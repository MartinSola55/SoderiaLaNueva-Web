import { useEffect, useState } from "react";
import { Card, DatePicker, DeliveryDayDropdown, Spinner, Table } from "../../../components";
import { dealerRoutesCols, routesCols } from "../Home.data";
import API from "../../../app/API";
import { Dates, formatCurrency, formatSoldProducts, getDayIndex } from "../../../app/Helpers";

import './RoutesCard.scss';
import { useNavigate } from "react-router";
import App from "../../../app/App";

export const RoutesCard = ({ isAdmin }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(isAdmin ? new Date() : getDayIndex());
	
	const navigate = useNavigate()
	
	const finalDealerRoutesCols = [
		...dealerRoutesCols,
		{
			name: 'status',
			text: 'Estado',
			component: (props) => (
				<span className={`${props.row.totalCarts === props.row.completedCarts ? 'text-success' : 'text-warning'}`}>
					{`${props.row.totalCarts === props.row.completedCarts ? 'Completado' : 'Pendiente'}`}
				</span>
			),
		},
	];

    // Effects
    useEffect(() => {
        setLoading(true);
		let rq = isAdmin ? { date: Dates.formatDate(date) } : { deliveryDay : date };
        API.post('route/getDynamicRoutes', rq).then((r) => {
            setData(r.data.routes.map(r => ({
				...r, 
				href: r.id,
				soldProducts: r.soldProducts.length > 0 ? formatSoldProducts(r.soldProducts) : [] 
			})));
            setLoading(false);
        });
    }, [date, isAdmin]);

    // Handlers
    const handleRangeChange = (date) => {
        setDate(date);
    };

    // Render
    return (
        <Card
			cardBodyClassName='p-0'
            header={
                <div className="d-flex flex-row align-items-center">
                    <h5 className="me-3 mb-0">Repartos del día</h5>
					{isAdmin ? ( 
						<DatePicker
							value={date}
							placeholder='Filtrar por fechas'
							maxDate={new Date()}
							onChange={handleRangeChange}
						/> ) : (
							<DeliveryDayDropdown 
								value={date} 
								onChange={handleRangeChange} 
							/>
						)
					}
                </div>
            }
            body={loading ? <Spinner /> :
                <>
                    <Table
                        className={`routes-table ${App.isAdmin() ?  'admin-routes-table' : ''}`}
                        rows={data}
						onRowClick={(_, id) => navigate('planillas/abierta/' + id)}
						clickable={true}
                        columns={isAdmin ? routesCols : finalDealerRoutesCols}
						emptyTableMessage={data.length === 0 && 'No se encontraron repartos para dicho día.'}
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