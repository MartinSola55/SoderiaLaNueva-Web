import { forwardRef, useImperativeHandle, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { Button, Input, Loader, Toast } from '../..';
import { Messages } from '../../../constants/Messages';
import API from '../../../app/API';

const TransferModal = forwardRef((_, ref) => {
	const [isVisible, setIsVisible] = useState(false);
	const [transfer, setTransfer] = useState({});
	const [callBacks, setCallBacks] = useState({});
	const [submitting, setSubmitting] = useState(false);

	useImperativeHandle(ref, () => ({
		open,
		close,
		confirm,
	}));

	const open = (transfer, onSuccess) => {
		setCallBacks({ onSuccess })
		setTransfer(transfer);
		setIsVisible(true);
	};

	const close = () => {
		setIsVisible(false);
	};

	const handleConfirm = () => {
		if (!transfer.clientId || !transfer.amount) {
			Toast.warning(Messages.Validation.requiredFields);
			return;
		}

		if (transfer.amount <= 0) {
			Toast.warning('El monto debe ser superior a cero.');
			return;
		}

		const rq = {
			clientId: transfer.clientId,
			amount: transfer.amount,
		};

		if (transfer.id) {
			rq.id = transfer.id;
		}

		API.post('transfer/create', rq)
			.then((r) => {
				Toast.success(r.message);
				close();
				callBacks.onSuccess();
			})
			.catch((r) => {
				Toast.error(r.error?.message);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	const handleClose = () => {
		close();
	};

	const handleChange = (v, name) => {
		setTransfer((prevTransfer) => ({ ...prevTransfer, [name]: v }));
	};

	if (!isVisible)
		return null;

	return (
		<Modal
			dialogClassName='modal-dialog-centered'
			size='lg'
			show={isVisible}
			onHide={handleClose}
			backdrop='static'>
			<Modal.Header>
				<Modal.Title>Ingrese el monto de la transferencia para {transfer.clientName}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row className='justify-content-center'>
					<Col xs={4}>
						<Input
							isFloat
							type='number'
							minValue={0}
							value={transfer.amount}
							required
							placeholder='$'
							onChange={(v) => handleChange(v, 'amount')}
						/>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button link onClick={handleClose}>
					Cancelar
				</Button>
				<Button onClick={handleConfirm} disabled={submitting}>
					{submitting ? <Loader /> : 'Confirmar'}
				</Button>
			</Modal.Footer>
		</Modal>
	);
});

export default TransferModal;
