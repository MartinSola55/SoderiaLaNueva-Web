import { forwardRef, useImperativeHandle, useState } from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { Button, Table } from '../../components';

// eslint-disable-next-line react/display-name
const LastProductsModal = forwardRef((props, ref) => {
    const columns = [
        {
            name: 'date',
            text: 'Fecha',
            textCenter: true,
        },
        {
            name: 'name',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: 'soldQuantity',
            text: 'Cantidad vendida',
            textCenter: true,
        },
        {
            name: 'returnedQuantity',
            text: 'Cantidad devuelta',
            textCenter: true,
        },
    ];

    const [isVisible, setIsVisible] = useState(false);
    const [callbacks, setCallbacks] = useState(null);
    const [rows, setRows] = useState([]);

    useImperativeHandle(ref, () => ({
        open,
        close,
    }));

    const open = (onClose, rows) => {
        setCallbacks({
            onClose,
        });
        setIsVisible(true);
        setRows(rows);
    };

    const close = () => {
        setIsVisible(false);
        if (callbacks?.onClose) callbacks?.onClose();
    };

    const handleClose = () => {
        close();
    };

    if (!isVisible) return null;

    return (
        <Modal
            dialogClassName='modal-dialog-centered'
            size='lg'
            show={isVisible}
            onHide={handleClose}
            backdrop='static'
        >
            <Modal.Header>
                <Modal.Title>Últimos productos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={12}>
                        <Table columns={columns} rows={rows}></Table>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default LastProductsModal;
