import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Col, Row } from "react-bootstrap";
import { BreadCrumb, Card, Input, TransferModal } from "@components";
import { getBreadcrumbItems } from "./Transfers.helpers";
import { ClientsTable } from "./ClientsTable";

const CreateTransfer = () => {
	const navigate = useNavigate();

	// Ref
	const transferModalRef = useRef(null);

	// State
	const [clientName, setClientName] = useState('');

	// Handlers
	const handleClientNameRows = (value) => {
		setClientName(value);
	};

	const handleSelectClient = ({ id, name }) => {
		const data = {
			clientId: id,
			clientName: name,
		};

		transferModalRef.current.open(data, () => navigate('/transferencias/list'));
	};

	return (
		<>
			<BreadCrumb items={getBreadcrumbItems('Nueva')} title='Transferencias' />
			<TransferModal ref={transferModalRef} />
			<div>
				<Col xs={11} className='container'>
					<Card
						title='Buscar clientes'
						body={
							<>
								<Row>
									<Col xs={12} sm={6} lg={4} className='pe-3 mb-3'>
										<Input
											showIcon
											borderless
											placeholder='Nombre'
											value={clientName}
											onChange={handleClientNameRows}
										/>
									</Col>
								</Row>
								<ClientsTable
									clientName={clientName}
									onClientClick={handleSelectClient} />
							</>
						}
					/>
				</Col>
			</div>
		</>
	);
};
export default CreateTransfer;
