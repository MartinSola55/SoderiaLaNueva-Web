import { Col, Row } from "react-bootstrap";
import { Card, Spinner, Table } from "../../../components";

export const ClientProductSalesTable = ({
    products,
    loading,
}) => {
    const productsColumns = [
		{
            name: 'date',
            text: 'Fecha',
            textCenter: true,
        },
        {
            name: 'type',
            text: 'Productos/Abono/Transferencia',
            textCenter: true,
        },
        {
            name: 'payments',
            text: 'Pago',
            textCenter: true,
			list: true
        },
    ];

    return (
        <Card
            title='Historial de bajadas y transferencias'
            body={loading ? <Spinner /> :
                <Row className='align-items-center'>
                    <Col xs={12}>
                        <Table rows={products} columns={productsColumns} />
                    </Col>
                </Row>
            }
        />
    );
}