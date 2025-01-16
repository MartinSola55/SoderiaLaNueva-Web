import { useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencil, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import '../../../components/shared/ActionButtons/ActionButtons.scss';
import App from '../../../app/App';
import { DeleteConfirmationModal, Tooltip } from '../../../components';

const ActionButtonsExpense = ({
    row = {},
    canDelete = App.isAdmin(),
    entity = 'entidad',
    female = false,
    onUpdate = () => {},
    onEdit = () => {},
}) => {
    const id = row.id;
    const endpoint = row.endpoint;

    const modalRef = useRef();

    const handleWatch = () => {
        onEdit(id, true);
    };

    const handleEdit = () => {
        onEdit(id, false);
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
                <Col className='action-button--container'>
                    <Tooltip text='Ver' placement='top'>
                        <FontAwesomeIcon
                            className='action-button'
                            icon={faEye}
                            color='black'
                            onClick={handleWatch}
                        />
                    </Tooltip>
                    {!(row.isOpen !== undefined && row.isOpen) && (
                        <Tooltip text='Editar' placement='top'>
                            <FontAwesomeIcon
                                className='action-button'
                                icon={faPencil}
                                color='black'
                                onClick={handleEdit}
                            />
                        </Tooltip>
                    )}
                    {canDelete && (
                        <Tooltip text='Eliminar' placement='top'>
                            <FontAwesomeIcon
                                className='action-button action-button--delete'
                                icon={faTrashAlt}
                                color='red'
                                onClick={handleDelete}
                            />
                        </Tooltip>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default ActionButtonsExpense;
