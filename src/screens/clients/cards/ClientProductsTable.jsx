import { Col, Row } from "react-bootstrap";
import { Card, CellNumericInput, Spinner, Table } from "../../../components";

export const ClientProductsTable = ({
    products,
    loading,
    isWatching,
    onProductsChange
}) => {
    const productsColumns = [
        {
            name: 'name',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: 'quantity',
            text: 'Stock',
            className: 'text-center',
            component: (props) => {
                if (isWatching)
                    return <span>{props.row.quantity !== '' ? props.row.quantity : '-'}</span>
                else
                    return <CellNumericInput {...props} value={props.row.quantity} onChange={(v) => onProductsChange(props, v)} />
            }
        },
    ];

    return (
        <Card
            title={isWatching ? 'Productos asociados' : 'Asociar productos'}
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