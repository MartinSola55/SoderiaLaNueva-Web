import { forwardRef, useImperativeHandle, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { Button, Table } from '@components';
import API from '@app/API';

const LastProductsModal = forwardRef((_, ref) => {
	const columns = [
		{
			name: 'date',
			text: 'Fecha',
			textCenter: true,
		},
		{
			name: 'name',
			text: 'Producto',
			textCenter: true,
		},
		{
			name: 'soldQuantity',
			text: 'Cantidad vendida',
			textCenter: true,
		},
		{
			name: 'returnedQuantity',
			text: 'Cantidad devuelta',
			textCenter: true,
		},
	];

	const [isVisible, setIsVisible] = useState(false);
	const [callbacks, setCallbacks] = useState(null);
	const [rows, setRows] = useState([]);

	useImperativeHandle(ref, () => ({
		open,
		close,
	}));

	const open = (id, onClose) => {
		setCallbacks({ onClose });
		setIsVisible(true);
		if (id)
			API.get('client/GetLastProducts',{ clientId: id }).then((r) => {
				setRows(r.data.lastProducts);
			});
	};

	const close = () => {
		setIsVisible(false);
		if (callbacks?.onClose)
			callbacks?.onClose();
	};

	const handleClose = () => {
		close();
	};

	if (!isVisible)
		return null;

	return (
		<Modal
			dialogClassName='modal-dialog-centered'
			size='lg'
			show={isVisible}
			onHide={handleClose}
			backdrop='static'
		>
			<Modal.Header>
				<Modal.Title>Últimos productos bajados</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col xs={12}>
						<Table
							rows={rows}
							columns={columns}
							emptyTableMessage='El cliente no cuenta con un historial de últimos productos bajados.'
						/>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button link onClick={handleClose}>
					Cerrar
				</Button>
			</Modal.Footer>
		</Modal>
	);
});

export default LastProductsModal;
