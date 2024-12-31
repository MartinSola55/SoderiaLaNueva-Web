import { forwardRef, useImperativeHandle, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { Button, Input, Label, Loader } from '../../components';
import { InitialFormStates } from '../../app/InitialFormStates';

const initialTransfer = InitialFormStates.Transfer;

// eslint-disable-next-line react/display-name
const TransferModal = forwardRef(({ disabled }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [callbacks, setCallbacks] = useState(null);
    const [transfer, setTransfer] = useState(initialTransfer);
    const [title, setTitle] = useState(initialTransfer);

    useImperativeHandle(ref, () => ({
        open,
        close,
        confirm,
    }));

    const open = (onConfirm, onClose, transfer, title) => {
        setCallbacks({
            onConfirm,
            onClose,
        });
        setIsVisible(true);
        setTransfer(transfer || initialTransfer);
        setTitle(title);
    };

    const close = () => {
        setIsVisible(false);
        if (callbacks?.onClose) callbacks?.onClose();
    };

    const confirm = () => {
        if (callbacks?.onConfirm) callbacks?.onConfirm(transfer);
    };

    const handleConfirm = () => {
        confirm();
    };

    const handleClose = () => {
        close();
    };

    const handleChange = (v, name) => {
        setTransfer((prevTransfer) => ({ ...prevTransfer, [name]: v }));
    };

    if (!isVisible) return null;

    const isWatching = title == 'Ver';

    return (
        <Modal
            dialogClassName='modal-dialog-centered'
            size='lg'
            show={isVisible}
            onHide={handleClose}
            backdrop='static'
        >
            <Modal.Header>
                <Modal.Title>{title} transferencia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={12}>
                        <Label required>Monto</Label>
                        <Input
                            disabled={isWatching}
                            isFloat
                            type='number'
                            minValue={0}
                            value={transfer.amount}
                            required
                            placeholder='Ingresa el monto'
                            onChange={(v) => handleChange(v, 'amount')}
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={handleClose}>
                    Cancelar
                </Button>
                {!isWatching && (
                    <Button onClick={handleConfirm} disabled={disabled}>
                        {disabled ? <Loader /> : title}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
});

export default TransferModal;
