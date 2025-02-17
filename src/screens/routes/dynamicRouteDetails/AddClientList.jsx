import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { BreadCrumb, Card, CellButton, Input, Table, TableSort, Toast } from '../../../components';
import { useEffect, useRef, useState } from 'react';
import { Messages } from '../../../constants/Messages';
import { getAddClientBreadcrumbItems, getClients } from '../../clients/Clients.helpers';
import { clientColumns, sortClientItems } from '../../clients/Clients.data';
import { useLocation } from 'react-router';
import AddClientModal from './AddClientModal';
import API from '../../../app/API';

const AddClientList = () => {
    const columns = [
        ...clientColumns,
        {
            name: 'actions',
            text: 'Acciones',
            className: 'text-center',
            component: (props) => <CellButton {...props} onClick={() => handleSelectClient(props.row)}>Seleccionar</CellButton>,
        },
    ];

    // State
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { clientIds, routeId } = location.state || {};

    const addClientModal = useRef(null);

    // Effects
    useEffect(() => {
        getClients(sort, currentPage, clientIds, ({ clients, totalCount }) => {
            setTotalCount(totalCount);
            setRows(clients);
            if (clients.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [clientIds, currentPage, sort]);

    // Handlers
    const handleFilterRows = (value) => {
        setFilter(value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }) => {
        setSort({ column, direction });
    };

    const handleSelectClient = (row) => {
        addClientModal.current?.open((products, paymentMethods) => handleSubmit(products, paymentMethods, row.id), () => { }, row.name, row.id);
    };

    const handleSubmit = async (products, paymentMethods, clientId) => {
        if (submitting) return;

        if (products.some(y => y.quantity === 0)) {
            Toast.warning("La cantidad de productos debe ser mayor a cero.");
            return;
        };

        if (paymentMethods.some(x => x.amount === 0)) {
            Toast.warning("La cantidad de dinero debe ser mayor a cero.");
            return;
        };

        if (paymentMethods.reduce((sum, x) => sum + x.amount, 0) !== 0)
            Toast.warning("Alerta, la cantidad total de dinero no coincide con el total");
        //TODO, poner un modal capaz (Modal de Toaster)

        setSubmitting(true);

        const rq = {
            routeId,
            clientId,
            products: products.filter(x => x.quantity !== '').map(x => ({
                productTypeId: x.id,
                soldQuantity: x.quantity,
                returnedQuantity: x.quantity,
            })),
            paymentMethods: paymentMethods.filter(x => x.amount !== '').map((x) => {
                return ({
                    id: x.id,
                    amount: x.amount
                })
            })
        };

        API.post(`route/addClient`, rq)
            .then((r) => {
                Toast.success(r.message);
                navigate('/planillas/abierta/' + routeId)
            })
            .catch((r) => {
                Toast.error(r.error?.message);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <>
            <BreadCrumb items={getAddClientBreadcrumbItems('Agregar cliente fuera de reparto', routeId)} title='Clientes' />
            <AddClientModal ref={addClientModal} />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Clientes'
                        body={
                            <>
                                <Row>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <TableSort
                                            items={sortClientItems}
                                            onChange={handleSortChange}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} lg={4} className='pe-3 mb-3'>
                                        <Input
                                            showIcon
                                            borderless
                                            placeholder='Buscar'
                                            value={filter}
                                            onChange={handleFilterRows}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    className='mb-5'
                                    columns={columns}
                                    rows={rows.filter((r) => r.name.toLowerCase().includes(filter.toLowerCase()))}
                                    pagination={true}
                                    currentPage={currentPage}
                                    totalCount={totalCount}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default AddClientList;
