import { Col, Row } from 'react-bootstrap';
import {
    ActionButtons,
    BreadCrumb,
    Button,
    Card,
    Input,
    Table,
    TableSort,
    Toast,
} from '../../components';
import { useEffect, useState } from 'react';
import API from '../../app/API';
import { useNavigate } from 'react-router';
import { Messages } from '../../constants/Messages';
import App from '../../app/App';
import { buildGenericGetAllRq, Dates, formatCurrency } from '../../app/Helpers';
import TableFilters from '../../components/shared/FormFilters/FormFilters';

const breadcrumbItems = [
    {
        active: true,
        label: 'Transferencias',
    },
];

const TransferList = () => {
    const columns = [
        {
            name: 'Clientname',
            text: 'Cliente',
            textCenter: true,
        },
        {
            name: 'dealerName',
            text: 'Repartidor',
            textCenter: true,
        },
        {
            name: 'amount',
            text: 'Monto',
            textCenter: true,
        },
        {
            name: 'createdAt',
            text: 'Fecha establecida',
            textCenter: true,
        },
        {
            name: 'createdAt',
            text: 'Fecha recibida',
            textCenter: true,
        },
        {
            name: 'actions',
            text: 'Acciones',
            component: (props) => <ActionButtons entity='transferencia' {...props} />,
            className: 'text-center',
        },
    ];

    const sortTransferItems = [
        { value: 'createdAt-asc', label: 'Creado - Asc.' },
        { value: 'createdAt-desc', label: 'Creado - Desc.' },
    ];

    const navigate = useNavigate();

    // States
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(null);
    const [dateRange, setDateRange] = useState({ from: Dates.getToday(), to: Dates.getToday() });

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

    // Effects
    useEffect(() => {
        if (!App.isAdmin()) {
            return navigate('/notAllowed');
        }
    }, [navigate]);

    useEffect(() => {
        const rq = buildGenericGetAllRq(sort, currentPage);

        API.post('Transfer/GetAll', rq).then((r) => {
            setTotalCount(r.data.totalCount);
            setRows(
                r.data.transfers.map((transfer) => {
                    return {
                        id: transfer.id,
                        clientName: transfer.clientName,
                        amount: formatCurrency(transfer.amount),
                        dealerName: transfer.dealerName,
                        createdAt: transfer.createdAt,
                        endpoint: 'Transfer',
                    };
                }),
            );
            if (r.data.transfers.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

    const updateDeletedRow = (id) => {
        setRows((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Transferencias' />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Transferencias'
                        body={
                            <>
                                <Row>
                                    <Col xs={12} md={6} className='mb-3'>
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
                                    <Col xs={12} md={6} className='pe-3 mb-3'>
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
                                <Button
                                    onClick={() => navigate('/transferencias/new')}
                                    variant='primary'
                                >
                                    Nueva transferencia
                                </Button>
                            </div>
                        }
                    ></Card>
                </Col>
            </div>
        </>
    );
};

export default TransferList;
