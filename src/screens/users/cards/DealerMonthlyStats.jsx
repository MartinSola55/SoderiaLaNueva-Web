import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { SimpleCard, Spinner } from "@components";
import API from "@app/API";
import { formatCurrency } from "@app/Helpers";

export const DealerMonthlyStats = ({id}) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({});

	const getProgress = (v) => {
		return Math.round(Number((v * 100 / (data.incompleteCarts + data.completedCarts)))) || 0
	};

	useEffect(() => {
		setLoading(true);

	API.get('stats/GetDealerMonthlyStats', { dealerId : id })
			.then((r) => {
				setData(r.data);
				setLoading(false);
			});
	}, [id]);

    return (
		<Row>
			{
				loading ? <Spinner/> 
					: ( 
						<>
							<Col>
								<SimpleCard 
									body={
										<div className="d-flex flex-column">
											<h4>
												Clientes del mes
											</h4>
											<p className="mb-0 text-end fs-5">
												Completados
											</p>
											<h6 className="mb-0 text-end fs-1">
												{data.completedCarts}
											</h6>
											<div>
												<span className="d-block">
													{getProgress(data.completedCarts)}%
												</span>
												<input
													disabled
													className="w-100 d-block custom-range completed"
													type="range"
													min="0"
													max="100"
													value={getProgress(data.completedCarts)}
													style={{ '--progress': `${getProgress(data.completedCarts)}%` }}
												/>
											</div>
										</div>
									}
								/>
							</Col>
							<Col>
								<SimpleCard 
									body={
										<div className="d-flex flex-column">
											<h4>
												Clientes del mes
											</h4>
											<p className="mb-0 text-end fs-5">
												Pendientes / No bajado
											</p>
											<h6 className="mb-0 text-end fs-1">
												{data.incompleteCarts}
											</h6>
											<div>
												<span className="d-block">
													{getProgress(data.incompleteCarts)}%
												</span>
												<input
													disabled
													className="w-100 d-block custom-range non-completed"
													type="range"
													min="0"
													max="100"
													value={getProgress(data.incompleteCarts)}
													style={{ '--progress': `${getProgress(data.incompleteCarts)}%` }}
												/>
											</div>
										</div>
									}
								/>
							</Col>
							<Col>
								<SimpleCard 
									body={
										<div className="d-flex flex-column">
											<h4>
												Total recaudado en el mes
											</h4>
											<h6 className="mb-0 text-end fs-1">
												{formatCurrency(data.totalAmount)}
											</h6>
										</div>
									}
								/>
							</Col>
						</>
					)
			}
		</Row>
    );
};