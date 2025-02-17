import { Col, Row } from "react-bootstrap";
import { Card, Spinner, Table } from "../../../components";

export const ClientProductHistoryTable = ({
    products = [],
    loading,
}) => {
    const productsColumns = [
        {
            name: 'name',
            text: 'Nombre',
            textCenter: true,
        },
        {
            name: 'type',
            text: 'Tipo',
            textCenter: true,
        },
        {
            name: 'quantity',
            text: 'Cantidad',
            textCenter: true,
        },
        {
            name: 'date',
            text: 'Fecha',
            textCenter: true,
        },
    ];

    return (
        <Card
            title='Historial de envases'
            body={loading ? <Spinner /> :
                <Row className='align-items-center'>
                    <Col xs={12}>
                        <Table
                            rows={products}
                            columns={productsColumns}
                            emptyTableMessage='El cliente no cuenta con un historial de envases'
                        />
                    </Col>
                </Row>
            }
        />
    );
}