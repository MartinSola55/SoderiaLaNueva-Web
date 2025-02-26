import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Map from '../../../components/Map/Map';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import './mapModal.scss';
import { CartStatuses } from '@constants/Cart';

// eslint-disable-next-line react/display-name
const MapModal = forwardRef((_, ref) => {
	const [isVisible, setIsVisible] = useState(false);
	const [dropOffPoints, setDropOffPoints] = useState([]);
	const [visitedPoints, setVisitedPoints] = useState([]);

	const open = (points, visited) => {
		const enhacedPoints = points.map((point) => ({
			...point,
			color: point.status === CartStatuses.Confirmed ? 'green' : 'yellow',
		}))
		setDropOffPoints(enhacedPoints);
		setVisitedPoints(visited);
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
			className='map-modal-dialog'
		>
			<Modal.Header className='map-modal-header'>
				<Modal.Title className='map-modal-title'>Ver mapa de puntos de entrega</Modal.Title>
				<FontAwesomeIcon className="close" icon={faXmark} onClick={handleClose} />
			</Modal.Header>
			<Modal.Body className='map-modal-body'>
				<Map dropOffPoints={dropOffPoints} visitedPoints={visitedPoints} />
			</Modal.Body>
		</Modal>
	);
});

export default MapModal;
