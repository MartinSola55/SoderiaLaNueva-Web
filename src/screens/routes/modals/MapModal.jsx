import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Map from '../../../components/Map/Map';

// eslint-disable-next-line react/display-name
const MapModal = forwardRef(({ disabled }, ref) => {
	const [isVisible, setIsVisible] = useState(false);
	const [dropOffPoints, setDropOffPoints] = useState([]);

	// Método para abrir el modal
	const open = (points) => {
		console.log(points);
		setDropOffPoints(points);
		setIsVisible(true);
	};

	// Método para cerrar el modal
	const close = () => {
		setIsVisible(false);
	};

	// Acciones de los botones
	const handleClose = () => {
		close();
	};

	const handleConfirm = () => {
		// Lógica de confirmación (si es necesario)
		close();
	};

	// Exposición de los métodos a través del ref
	useImperativeHandle(ref, () => ({
		open,
		close,
	}));

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
				<Modal.Title>Ver mapa de puntos de entrega</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Map dropOffPoints={dropOffPoints} />
			</Modal.Body>
			<Modal.Footer>
				<Button link onClick={handleClose}>
					Cancelar
				</Button>
				<Button onClick={handleConfirm} >
					Confirmar
				</Button>
			</Modal.Footer>
		</Modal>
	);
});

export default MapModal;
