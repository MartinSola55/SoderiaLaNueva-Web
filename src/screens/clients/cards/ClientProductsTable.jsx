import { Col, Row } from "react-bootstrap";
import { Button, Card, CellNumericInput, Loader, Spinner, Table } from "../../../components";
import { useState } from "react";
import { handleOnSubmit } from "../Clients.helpers";

export const ClientProductsTable = ({
    products,
    loading,
    isWatching,
    onProductsChange,
	onSubmit,
	submiting
}) => {
	const [interalIsWatching, setInteralIsWatching] = useState(isWatching);
	
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
                if (interalIsWatching)
                    return <span>{props.row.quantity !== '' ? props.row.quantity : '-'}</span>
                else
                    return <CellNumericInput {...props} value={props.row.quantity} onChange={(v) => onProductsChange(props, v)} />
            }
        },
    ];

    return (
        <Card
            title={interalIsWatching ? 'Productos asociados' : 'Asociar productos'}
            body={loading ? <Spinner /> :
                <Row className='align-items-center'>
                    <Col xs={12}>
                        <Table rows={products} columns={productsColumns} />
                    </Col>
                </Row>
            }
			footer={
                <div className={`d-flex justify-content-${interalIsWatching ? 'end' : 'between'}`}>
					{isWatching && (
						!interalIsWatching ? (
							<>
								<Button variant='danger' onClick={() => setInteralIsWatching(true)}>
									Cancelar
								</Button>
								<Button onClick={() => handleOnSubmit(onSubmit, setInteralIsWatching)} disabled={submiting}>
									{submiting ? <Loader /> : 'Guardar'}
								</Button>
							</>
						) : (
							<>
								<Button onClick={() => {setInteralIsWatching(false)}}>
									Editar
								</Button>
							</>
						)
					)}
                </div>
            }
        />
    );
}