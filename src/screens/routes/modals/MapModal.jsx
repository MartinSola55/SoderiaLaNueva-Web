import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Map from '../../../components/Map/Map';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './mapModal.scss';

// eslint-disable-next-line react/display-name
const MapModal = forwardRef((_, ref) => {
	const [isVisible, setIsVisible] = useState(false);
	const [dropOffPoints, setDropOffPoints] = useState([]);

	const open = (points) => {
		setDropOffPoints(points);
		setIsVisible(true);
	};

	const close = () => {
		setIsVisible(false);
	};

	const handleClose = () => {
		close();
	};

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
				<FontAwesomeIcon className="close" icon={faXmark} onClick={handleClose} />
			</Modal.Header>
			<Modal.Body>
				<Map dropOffPoints={dropOffPoints} />
			</Modal.Body>
		</Modal>
	);
});

export default MapModal;
