import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Button, Card, CellCheck, Loader, Spinner, Table } from "@components";
import { handleOnSubmit } from "../Clients.helpers";

export const ClientSubscriptionProductsTable = ({
	subscriptions,
	loading,
	isWatching,
	onSubscriptionsChange,
	submitting = false,
	onSubmit = () => { },
}) => {
	const [interalIsWatching, setInteralIsWatching] = useState(isWatching);

	const subscriptionsColumns = [
		{
			name: 'name',
			text: 'Abono',
			textCenter: true,
		},
		{
			name: 'quantity',
			text: 'Asociado',
			className: 'text-center',
			component: (props) => (<CellCheck {...props} disabled={interalIsWatching} checked={props.row.checked} onChange={(v) => onSubscriptionsChange(props, v)} />)
		}
	];

	return (
		<Card
			title={interalIsWatching ? 'Abonos asociados' : 'Asociar abonos'}
			body={loading ? <Spinner /> :
				<Row className='align-items-center'>
					<Col xs={12}>
						<Table 
							rows={subscriptions} 
							columns={subscriptionsColumns}
							emptyTableMessage='No se encontraron abonos creados'
						/>
					</Col>
				</Row>
			}
			footer={
				<div className={`d-flex justify-content-${interalIsWatching ? 'end' : 'between'}`}>
					{subscriptions.length > 0 && (
						!interalIsWatching ? (
							<>
								<Button link onClick={() => setInteralIsWatching(true)}>
									Cancelar
								</Button>
								<Button onClick={() => handleOnSubmit(onSubmit, setInteralIsWatching)} disabled={submitting}>
									{submitting ? <Loader /> : 'Guardar'}
								</Button>
							</>
						) : (
							<>
								<Button onClick={() => { setInteralIsWatching(false) }}>
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