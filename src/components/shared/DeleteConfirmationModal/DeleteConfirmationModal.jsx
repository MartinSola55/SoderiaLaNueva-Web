import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Loader, Toast } from "@components";
import API from "@app/API";

// eslint-disable-next-line
const DeleteConfirmationModal = forwardRef(({ disabled, item, message, onConfirm = () => { } }, ref) => {

	const [isVisible, setIsVisible] = useState(false);
	const [id, setId] = useState(null);
	const [endpoint, setEndpoint] = useState(null);

	useImperativeHandle(ref, () => ({
		open,
	}));

	const open = (id, endpoint) => {
		setId(id);
		setEndpoint(endpoint);
		setIsVisible(true);
	};

	const handleConfirm = () => {
		API.post(`${endpoint}/delete`, { id })
			.then((r) => {
				Toast.success(r.message);
				handleClose();
				onConfirm && onConfirm(id);
			})
			.catch((r) => {
				Toast.error(r.error?.message);
			});
	};

	const handleClose = () => {
		setIsVisible(false);
	};

	if (!isVisible)
		return null;

	return (
		<Modal size="lg" centered show={isVisible} onHide={handleClose} backdrop="static">
			<Modal.Header>
				<Modal.Title>
					¿Seguro deseas eliminar {item}?
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p className="mb-0"><b>{message}</b></p>
			</Modal.Body>
			<Modal.Footer>
				<Button link onClick={handleClose}>
					Cancelar
				</Button>
				<Button variant='danger' onClick={handleConfirm} disabled={disabled} >
					{disabled ? <Loader /> : 'Confirmar'}
				</Button>
			</Modal.Footer>
		</Modal>
	);
});

export default DeleteConfirmationModal;