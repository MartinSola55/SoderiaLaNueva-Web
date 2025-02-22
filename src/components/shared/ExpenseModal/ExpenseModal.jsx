import { forwardRef, useImperativeHandle, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { InitialFormStates } from '../../../app/InitialFormStates';
import { Button, DealerDropdown, Input, Label, Loader, Toast } from '../..';
import { Messages } from '../../../constants/Messages';
import API from '../../../app/API';

const initialExpense = InitialFormStates.Expense;

// eslint-disable-next-line react/display-name
const ExpenseModal = forwardRef((_, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [expense, setExpense] = useState(initialExpense);
    const [callBacks, setCallBacks] = useState({});
    const [title, setTitle] = useState(initialExpense);
    const [isWatching, setIsWatching] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useImperativeHandle(ref, () => ({
        open,
        close,
        confirm,
    }));

    const open = (onSuccess, expense, title, isWatching) => {
        setCallBacks({ onSuccess })
        setExpense(expense || initialExpense);
        setTitle(title);
        setIsWatching(isWatching);
        setIsVisible(true);
    };

    const close = () => {
        setIsVisible(false);
    };

    const handleConfirm = () => {
        if (!expense.dealerId || !expense.description || !expense.amount) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        if (expense.amount && expense.amount <= 0) {
            Toast.warning('El monto debe ser superior a cero.');
            return;
        }

        const rq = {
            dealerId: expense.dealerId,
            description: expense.description,
            amount: expense.amount,
        };

        if (expense.id) {
            rq.id = expense.id;
        }

        API.post(`expense/${expense.id ? 'update' : 'create'}`, rq)
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
        setExpense((prevExpense) => ({ ...prevExpense, [name]: v }));
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
                <Modal.Title>{title} gasto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={6} className='mb-3'>
                        <Label required={!isWatching}>Repartidor</Label>
                        <DealerDropdown
                            disabled={isWatching}
                            value={expense.dealerId}
                            required
                            onChange={(v) => handleChange(v, 'dealerId')}
                        />
                    </Col>
                    <Col xs={6}>
                        <Label required={!isWatching}>Monto</Label>
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
                    <Col xs={12} className='mb-3'>
                        <Label required={!isWatching}>Descripción</Label>
                        <Input
                            disabled={isWatching}
                            value={expense.description}
                            required
                            tag='textarea'
                            maxLength={100}
                            placeholder='Descripción'
                            onChange={(v) => handleChange(v, 'description')}
                        />
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button link onClick={handleClose}>
                    Cancelar
                </Button>
                {!isWatching && (
                    <Button onClick={handleConfirm} disabled={submitting}>
                        {submitting ? <Loader /> : title}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
});

export default ExpenseModal;
