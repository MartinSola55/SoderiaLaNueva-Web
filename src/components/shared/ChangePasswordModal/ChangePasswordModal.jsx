import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "../../Button/Button";
import Input from "../../Input/Input";
import Loader from "../../Loader/Loader";
import Label from "../../Label/Label";
import API from "../../../app/API";
import Toast from "../../Toast/Toast";
import { Messages } from "../../../constants/Messages";

// eslint-disable-next-line
const ChangePasswordModal = forwardRef((_, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [userId, setUserId] = useState(null);
    const [submiting, setSubmiting] = useState(false);

    useImperativeHandle(ref, () => ({
        open,
        close,
    }));

    const open = (userId) => {
        setPassword('');
        setPasswordCheck('');
        setUserId(userId);
        setIsVisible(true);
    };

    const close = () => {
        setIsVisible(false);
    };

    const handleConfirm = () => {
        if (password !== passwordCheck)
            return Toast.warning(Messages.Validation.passwordCheck);

        setSubmiting(true);

        API.post('User/UpdatePassword', { id: userId, password })
            .then((r) => {
                setSubmiting(false);
                Toast.success(r.message);
                handleClose();
            })
            .catch((r) => {
                setSubmiting(false);
                Toast.error(r.error?.message);
            });
    };

    const handleClose = () => {
        close();
    };

    const handleChange = (password) => {
        setPassword(password);
    };

    const handleCheckChange = (password) => {
        setPasswordCheck(password);
    };

    if (!isVisible)
        return null;

    return (
        <Modal size="md" show={isVisible} onHide={handleClose} backdrop="static" centered>
            <Modal.Header>
                <Modal.Title>
                    Cambio de contraseña
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Label required>Contraseña</Label>
                <Input
                    className="mb-3"
                    value={password}
                    type="password"
                    required
                    submitOnEnter
                    placeholder="Ingrese la nueva contraseña"
                    onChange={handleChange}
                    onSubmit={handleConfirm}
                />
                <Label required>Repita la contraseña</Label>
                <Input
                    value={passwordCheck}
                    type="password"
                    required
                    submitOnEnter
                    placeholder="Repita la nueva contraseña"
                    onChange={handleCheckChange}
                    onSubmit={handleConfirm}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={handleClose}>
                    Cancelar
                </Button>
                <Button onClick={handleConfirm} disabled={submiting} >
                    {submiting ? <Loader /> : 'Confirmar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default ChangePasswordModal;