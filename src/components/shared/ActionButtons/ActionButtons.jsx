import { useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faToggleOff, faToggleOn, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { ActiveConfirmationModal, DeleteConfirmationModal, Tooltip } from "@components";
import App from "@app/App";

import "./ActionButtons.scss";

const ActionButtons = ({
	row = {},
	canDelete = App.isAdmin(),
	showEdit = true,
	showWatch = true,
	showEnableDisable = false,
	entity = "entidad",
	message,
	female = false,
	navigateTo = true,
	onUpdate = () => { },
	onWatch = () => { },
	onEdit = () => { },
}) => {
	const navigate = useNavigate();
	const { id, endpoint } = row;

	const deleteModalRef = useRef();
	const activeModalRef = useRef();

	const handleWatch = () => {
		if (navigateTo)
			navigate(window.location.pathname.replace(/\/[^/]+$/, `/${id}`));
		else
			onWatch(id);
	};

	const handleEdit = () => {
		if (navigateTo)
			navigate(window.location.pathname.replace(/\/[^/]+$/, `/edit/${id}`));
		else
			onEdit(id);
	};

	const handleActivate = () => {
		activeModalRef.current.open(id, endpoint);
	};

	const handleDelete = () => {
		deleteModalRef.current.open(id, endpoint);
	};

	return (
		<>
			<DeleteConfirmationModal
				ref={deleteModalRef}
				item={`est${female ? 'a' : 'e'} ${entity}`}
				showEnableDisable={showEnableDisable}
				message={message || `Esta acción no se puede deshacer. Una vez eliminad${female ? 'a' : 'o'} ${female ? 'la' : 'el'} ${entity}, no se podrá recuperar.`}
				onConfirm={() => onUpdate(row.id)}
			/>
			<ActiveConfirmationModal
				ref={activeModalRef}
				item={`est${female ? 'a' : 'e'} ${entity}`}
				message={`Esto hará que el producto vuelva a estar disponible para su uso.`}
				onConfirm={() => onUpdate(row.id)}
			/>
			<Row>
				<Col className="action-button--container">
					{row.isActive !== false && showWatch && (
						<Tooltip text="Ver" placement="top">
							<FontAwesomeIcon
								className="action-button"
								icon={faEye}
								color="black"
								onClick={handleWatch}
							/>
						</Tooltip>
					)}
					{row.isActive !== false && showEdit && (
						<Tooltip text="Editar" placement="top">
							<FontAwesomeIcon
								className="action-button"
								icon={faPencil}
								color="black"
								onClick={handleEdit}
							/>
						</Tooltip>
					)}
					{row.isActive === false && (
						<Tooltip text="Habilitar" placement="top">
							<FontAwesomeIcon
								className="action-button action-button--activate"
								icon={faToggleOff}
								color="green"
								onClick={handleActivate}
							/>
						</Tooltip>
					)}
					{canDelete && row.isActive !== false && (
						<Tooltip text={showEnableDisable ? "Deshabilitar" : "Eliminar"} placement="top">
							<FontAwesomeIcon
								className="action-button action-button--delete"
								icon={showEnableDisable ? faToggleOn : faTrashAlt}
								color="red"
								onClick={handleDelete}
							/>
						</Tooltip>
					)}
				</Col>
			</Row>
		</>
	)
};

export default ActionButtons;