import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Button, Card, Input, SubscriptionsDropdown, Table, TableSort, Toast } from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Messages } from '../../constants/Messages';
import App from '../../app/App';
import { clientCols, sortProductItems, subscriptionCols } from './Subscriptions.data';
import { getAllSubscriptions, getBreadcrumbItems, getClientSubscriptions } from './Subscriptions.helpers';

const SubscriptionList = () => {
    const allSubsCols = [
        ...subscriptionCols,
        {
            name: 'actions',
            text: 'Acciones',
            className: 'text-center',
            component: (props) => <ActionButtons entity='abono' {...props} />,
        },
    ];

    const navigate = useNavigate();

    // States
    const [subscriptions, setSubscriptions] = useState([]);
    const [clients, setClients] = useState([]);
    const [subsFilter, setSubsFilter] = useState('');
    const [clientFilter, setClientFilter] = useState('');
    const [selectedSubs, setSelectedSubs] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(null);

    // Effects
    useEffect(() => {
        getAllSubscriptions(sort, currentPage, ({ subscriptions, totalCount }) => {
            setTotalCount(totalCount);
            setSubscriptions(subscriptions);

            if (subscriptions.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

    useEffect(() => {
        if (!selectedSubs)
            return;

        getClientSubscriptions(selectedSubs, (clients) => {
            setClients(clients);
        });
    }, [selectedSubs]);

    // Handlers
    const handleFilterSubs = (value) => {
        setSubsFilter(value);
    };

    const handleFilterClients = (value) => {
        setClientFilter(value);
    };

    const handleSortChange = ({ column, direction }) => {
        setSort({ column, direction });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const updateDeletedRow = (id) => {
        setSubscriptions((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    // Render
    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems()} title='Abonos' />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Abonos'
                        body={
                            <>
                                <Row>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <TableSort
                                            items={sortProductItems}
                                            onChange={handleSortChange}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} lg={4} className='pe-3 mb-3'>
                                        <Input
                                            showIcon
                                            borderless
                                            placeholder='Buscar'
                                            value={subsFilter}
                                            onChange={handleFilterSubs}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    className='mb-5'
                                    columns={allSubsCols}
                                    rows={subscriptions.filter((r) => r.name.toLowerCase().includes(subsFilter.toLowerCase()))}
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
                                <Button onClick={() => navigate('/abonos/new')} variant='primary'>
                                    Nuevo abono
                                </Button>
                            </div>
                        }
                    />
                    <Card
                        header={<h4>Abonos asociados a clientes</h4>}
                        body={
                            <>
                                <Row>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <SubscriptionsDropdown
                                            value={selectedSubs}
                                            onChange={setSelectedSubs}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} lg={4} className='pe-3 mb-3'>
                                        <Input
                                            showIcon
                                            borderless
                                            placeholder='Nombre del cliente'
                                            value={clientFilter}
                                            onChange={handleFilterClients}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    className='mb-5'
                                    columns={clientCols}
                                    rows={clients.filter((x) => x.name.toLowerCase().includes(clientFilter))}
                                    emptyTableMessage={selectedSubs && 'No se encontraron clientes asociados a este abono'}
                                    pagination={true}
                                    currentPage={currentPage}
                                    totalCount={totalCount}
                                    onPageChange={handlePageChange}
                                    onUpdate={updateDeletedRow}
                                />
                            </>
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default SubscriptionList;
