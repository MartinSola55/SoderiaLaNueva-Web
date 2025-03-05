import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Card, Spinner, Table } from "../../../components";
import API from "@app/API";
import './dealerMonthlySales.scss';

export const ClientStock = ({id}) => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);

	const columns = [
		{
			name:'name',
			text: 'Producto'
		},
		{
			name:'stock',
			text: 'Stock',
		},
	]

	useEffect(() => {
		setLoading(true);

	API.get('stats/clientsStock', { dealerId: id })
			.then((r) => {
				setData(r.data.products);
				setLoading(false);
			});
	}, [id]);

    return (
		<Col className="mt-5" xs={6}>
			<Card
				cardBodyClassName='p-0'
				header={
					<>
						<div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
							<h5 className="me-3 mb-2">Stock de clientes</h5>
						</div>
					</>
				}
				body={loading ? <Spinner /> :
					<Row>
						<Col>
							<Table 
								columns={columns}
								rows={data}
								emptyTableMessage='No se encontró stock en los porductos de los clientes del repartidor.'
							/>
						</Col>
					</Row>
				}
			/>
		</Col>
    );
};