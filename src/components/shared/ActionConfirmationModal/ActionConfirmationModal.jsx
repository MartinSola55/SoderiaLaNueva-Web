import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../../Button/Button';
import Loader from '../../Loader/Loader';
import API from '../../../app/API';
import Toast from '../../Toast/Toast';

// eslint-disable-next-line
const ActionConfirmationModal = forwardRef(({ disabled }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [request, setRequest] = useState(null);
    const [endpoint, setEndpoint] = useState(null);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [callbacks, setCallbacks] = useState({});

    useImperativeHandle(ref, () => ({
        open,
    }));

    const open = (rq, endpoint, title, message, onSuccess) => {
        setRequest(rq);
        setEndpoint(endpoint);
        setIsVisible(true);
        setTitle(title);
        setMessage(message);
        setCallbacks({
            onSuccess,
        });
    };

    const handleConfirm = () => {
        API.post(`${endpoint}`, request)
            .then((r) => {
                Toast.success(r.message);
                handleClose();
                if (callbacks?.onSuccess) callbacks?.onSuccess(r);
            })
            .catch((r) => {
                Toast.error(r.error?.message);
            });
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <Modal size='lg' centered show={isVisible} onHide={handleClose} backdrop='static'>
            {title && (
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
            )}
            {message && (
                <Modal.Body>
                    <p className='mb-0'>
                        <b>{message}</b>
                    </p>
                </Modal.Body>
            )}
            <Modal.Footer>
                <Button link onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant='danger' onClick={handleConfirm} disabled={disabled}>
                    {disabled ? <Loader /> : 'Confirmar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default ActionConfirmationModal;
