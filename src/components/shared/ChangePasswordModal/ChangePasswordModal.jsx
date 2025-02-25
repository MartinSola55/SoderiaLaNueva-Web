import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Input, Label, Loader, Toast } from "@components";
import { Messages } from "@constants/Messages";
import API from "@app/API";

// eslint-disable-next-line
const ChangePasswordModal = forwardRef((_, ref) => {
	const [isVisible, setIsVisible] = useState(false);
	const [password, setPassword] = useState('');
	const [passwordCheck, setPasswordCheck] = useState('');
	const [userId, setUserId] = useState(null);
	const [submitting, setSubmitting] = useState(false);

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

		setSubmitting(true);

		API.post('user/updatePassword', { id: userId, password })
			.then((r) => {
				setSubmitting(false);
				Toast.success(r.message);
				handleClose();
			})
			.catch((r) => {
				setSubmitting(false);
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
				<Button link onClick={handleClose}>
					Cancelar
				</Button>
				<Button onClick={handleConfirm} disabled={submitting} >
					{submitting ? <Loader /> : 'Confirmar'}
				</Button>
			</Modal.Footer>
		</Modal>
	);
});

export default ChangePasswordModal;