import { forwardRef, useImperativeHandle, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { Button, DeliveryDayDropdown, Label, Loader } from '@components';

const RouteModal = forwardRef(({ disabled, form }, ref) => {
	const [isVisible, setIsVisible] = useState(false);
	const [callbacks, setCallbacks] = useState(null);
	const [fullName, setFullname] = useState('');

	useImperativeHandle(ref, () => ({
		open,
		close,
		confirm,
	}));

	const open = (onConfirm, onClose, onChange, fullName) => {
		setCallbacks({
			onConfirm,
			onClose,
			onChange,
		});
		setIsVisible(true);
		setFullname(fullName);
	};

	const close = () => {
		setIsVisible(false);
		if (callbacks?.onClose) callbacks?.onClose();
	};

	const confirm = () => {
		if (callbacks?.onConfirm) callbacks?.onConfirm(form);
	};

	const handleConfirm = () => {
		confirm();
	};

	const handleClose = () => {
		close();
	};

	const handleChange = (v, name) => {
		if (callbacks?.onChange) callbacks?.onChange(v, name);
	};

	if (!isVisible) return null;

	return (
		<Modal
			dialogClassName='modal-dialog-centered'
			size='lg'
			show={isVisible}
			onHide={handleClose}
			backdrop='static'
		>
			<Modal.Header>
				<Modal.Title>Crear reparto para {fullName}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col xs={12} className='mb-3'>
						<Label required>Día</Label>
						<DeliveryDayDropdown
							value={form.deliveryDay}
							required
							onChange={(v) => handleChange(v, 'deliveryDay')}
						/>
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button link onClick={handleClose}>
					Cancelar
				</Button>
				<Button onClick={handleConfirm} disabled={disabled}>
					{disabled ? <Loader /> : 'Confirmar'}
				</Button>
			</Modal.Footer>
		</Modal>
	);
});

export default RouteModal;
