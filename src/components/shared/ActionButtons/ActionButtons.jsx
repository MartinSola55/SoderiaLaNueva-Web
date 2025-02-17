import { useRef } from "react";
import Tooltip from "../../Tooltip/Tooltip";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencil, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import App from "../../../app/App";
import { useNavigate } from "react-router";

import "./ActionButtons.scss";

const ActionButtons = ({
    row = {},
    canDelete = App.isAdmin(),
    showEdit = true,
    entity = "entidad",
    female = false,
    navigateTo = true,
    onUpdate = () => { },
    onWatch = () => { },
    onEdit = () => { },
}) => {
    const navigate = useNavigate();
    const id = row.id;
    const endpoint = row.endpoint;

    const modalRef = useRef();

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

    const handleDelete = () => {
        modalRef.current.open(id, endpoint);
    };

    return (
        <>
            <DeleteConfirmationModal
                ref={modalRef}
                item={`est${female ? 'a' : 'e'} ${entity}`}
                message={`Esta acción no se puede deshacer. Una vez eliminad${female ? 'a' : 'o'} ${female ? 'la' : 'el'} ${entity}, no se podrá recuperar.`}
                onConfirm={() => onUpdate(row.id)}
            />
            <Row>
                <Col className="action-button--container">
                    <Tooltip text="Ver" placement="top">
                        <FontAwesomeIcon
                            className="action-button"
                            icon={faEye}
                            color="black"
                            onClick={handleWatch}
                        />
                    </Tooltip>
                    {!(row.isOpen !== undefined && row.isOpen) && showEdit && (
                        <Tooltip text="Editar" placement="top">
                            <FontAwesomeIcon
                                className="action-button"
                                icon={faPencil}
                                color="black"
                                onClick={handleEdit}
                            />
                        </Tooltip>
                    )}
                    {canDelete && (
                        <Tooltip text="Eliminar" placement="top">
                            <FontAwesomeIcon
                                className="action-button action-button--delete"
                                icon={faTrashAlt}
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