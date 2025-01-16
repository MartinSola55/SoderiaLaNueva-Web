import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Button, Card, Input, Table, TableSort, Toast } from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Messages } from '../../constants/Messages';
import { getBreadcrumbItems, getClients } from './Clients.helpers';
import { clientColumns, sortClientItems } from './Clients.data';
import App from '../../app/App';

const ClientList = () => {
    const columns = [
        ...clientColumns,
        {
            name: 'actions',
            text: 'Acciones',
            className: 'text-center',
            component: (props) => <ActionButtons entity='cliente' showEdit={false} {...props} />,
        },
    ];

    const navigate = useNavigate();

    // State
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(null);

    // Effects
    useEffect(() => {
        getClients(sort, currentPage, ({ clients, totalCount }) => {
            setTotalCount(totalCount);
            setRows(clients);
            if (clients.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

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

    const updateDeletedRow = (id) => {
        setRows((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    // Render
    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems()} title='Clientes' />
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
                                    onUpdate={updateDeletedRow}
                                />
                            </>
                        }
                        footer={
                            <div className='d-flex justify-content-end'>
                                <Button onClick={() => navigate('/clientes/new')} variant='primary'>
                                    Nuevo Cliente
                                </Button>
                            </div>
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default ClientList;
