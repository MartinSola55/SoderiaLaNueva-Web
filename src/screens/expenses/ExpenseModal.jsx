import { forwardRef, useImperativeHandle, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { Button, Input, Label, Loader, UserDropdown } from '../../components';
import { Roles } from '../../constants/Roles';
import { InitialFormStates } from '../../app/InitialFormStates';

const initialExpense = InitialFormStates.Expense;

// eslint-disable-next-line react/display-name
const ExpenseModal = forwardRef(({ disabled }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [callbacks, setCallbacks] = useState(null);
    const [expense, setExpense] = useState(initialExpense);
    const [title, setTitle] = useState(initialExpense);

    useImperativeHandle(ref, () => ({
        open,
        close,
        confirm,
    }));

    const open = (onConfirm, onClose, expense, title) => {
        setCallbacks({
            onConfirm,
            onClose,
        });
        setIsVisible(true);
        setExpense(expense || initialExpense);
        setTitle(title);
    };

    const close = () => {
        setIsVisible(false);
        if (callbacks?.onClose) callbacks?.onClose();
    };

    const confirm = () => {
        if (callbacks?.onConfirm) callbacks?.onConfirm(expense);
    };

    const handleConfirm = () => {
        confirm();
    };

    const handleClose = () => {
        close();
    };

    const handleChange = (v, name) => {
        setExpense((prevExpense) => ({ ...prevExpense, [name]: v }));
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
                <Modal.Title>{title} gasto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={12} className='mb-3'>
                        <Label required>Repartidor</Label>
                        <UserDropdown
                            disabled={isWatching}
                            value={expense.dealerId}
                            required
                            roles={[Roles.Dealer]}
                            placeholder='Seleccione repartidor'
                            onChange={(v) => handleChange(v, 'dealerId')}
                        />
                    </Col>
                    <Col xs={12} className='mb-3'>
                        <Label required>Descripción</Label>
                        <Input
                            disabled={isWatching}
                            value={expense.description}
                            required
                            maxLength={100}
                            placeholder='Descripción'
                            onChange={(v) => handleChange(v, 'description')}
                        />
                    </Col>
                    <Col xs={12}>
                        <Label required>Monto</Label>
                        <Input
                            disabled={isWatching}
                            isFloat
                            type='number'
                            minValue={0}
                            value={expense.amount}
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

export default ExpenseModal;
