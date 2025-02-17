import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Button, Card, Input, Table, TableSort, Toast } from '../../components';
import App from '../../app/App';
import { useNavigate } from 'react-router';
import { Messages } from '../../constants/Messages';
import { Dates } from '../../app/Helpers';
import TableFilters from '../../components/shared/TableFilters/TableFilters';
import { sortTransferItems, transferColumns } from './Transfers.data';
import { getBreadcrumbItems, getTransfers } from './Transfers.helpers';

const TransferList = () => {
    const columns = [
        ...transferColumns,
        {
            name: 'actions',
            text: 'Acciones',
            className: 'text-center',
            component: (props) =>
                <ActionButtons
                    navigateTo={false}
                    showEdit={false}
                    entity='gasto'
                    // onWatch={handleOpenTransfer}
                    {...props} />
        },
    ];

    const navigate = useNavigate();

    // States
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(null);
    const [dateRange, setDateRange] = useState({ from: Dates.getToday(), to: Dates.getToday() });

    // Effects
    useEffect(() => {
        if (!App.isAdmin()) {
            return navigate('/notAllowed');
        }
    }, [navigate]);

    useEffect(() => {
        getTransfers(sort, currentPage, dateRange, ({ transfers, totalCount }) => {
            setTotalCount(totalCount);
            setRows(transfers);
            if (transfers.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, dateRange, sort]);

    // Handlers
    const handleFilterRows = (value) => {
        setFilter(value.toLowerCase());
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }) => {
        setSort({ column, direction });
    };

    const handleResetFilters = () => {
        setDateRange(null);
    };

    const updateDeletedRow = (id) => {
        setRows((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems()} title='Transferencias' />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Transferencias'
                        body={
                            <>
                                <Row>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <TableSort
                                            items={sortTransferItems}
                                            onChange={handleSortChange}
                                        />
                                    </Col>
                                    <TableFilters
                                        dateRange={dateRange}
                                        onRangeChange={setDateRange}
                                        onReset={handleResetFilters}
                                    />
                                    <Col xs={12} sm={6} lg={4} className='pe-3 mb-3'>
                                        <Input
                                            borderless
                                            placeholder='Buscar'
                                            helpText='Nombre de cliente o repartidor'
                                            value={filter}
                                            onChange={handleFilterRows}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    className='mb-5'
                                    columns={columns}
                                    rows={rows.filter(
                                        (r) =>
                                            r.clientName.toLowerCase().includes(filter) ||
                                            r.dealerName.toLowerCase().includes(filter),
                                    )}
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
                                <Button onClick={() => navigate('/transferencias/new')} variant='primary'>
                                    Nueva transferencia
                                </Button>
                            </div>
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default TransferList;
