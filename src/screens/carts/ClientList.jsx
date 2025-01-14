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
import { buildGenericGetAllRq, formatCurrency, formatDeliveryDay } from '../../app/Helpers';

const breadcrumbItems = [
    {
        active: true,
        label: 'Clientes',
    },
];

const ClientList = () => {
    const columns = [
        {
            name: 'name',
            text: 'Nombre',
            textCenter: true,
        },
        {
            name: 'address',
            text: 'Dirección',
            textCenter: true,
        },
        {
            name: 'phone',
            text: 'Teléfono',
            textCenter: true,
        },
        {
            name: 'debt',
            text: 'Deuda',
            textCenter: true,
        },
        {
            name: 'deliveryDay',
            text: 'Reparto',
            textCenter: true,
        },
        {
            name: 'actions',
            text: 'Acciones',
            component: (props) => <ActionButtons entity='cliente' {...props} />,
            className: 'text-center',
        },
    ];

    const sortClientItems = [
        { value: 'name-asc', label: 'Nombre - Asc.' },
        { value: 'name-desc', label: 'Nombre - Desc.' },
        { value: 'createdAt-asc', label: 'Fecha de creación - Asc.' },
        { value: 'createdAt-desc', label: 'Fecha de creación - Desc.' },
    ];

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(null);

    const handleFilterRows = (value) => {
        setFilter(value.toLowerCase());
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }) => {
        setSort({ column, direction });
    };

    useEffect(() => {
        if (!App.isAdmin()) {
            return navigate('/notAllowed');
        }
    }, [navigate]);

    useEffect(() => {
        const rq = buildGenericGetAllRq(sort, currentPage);

        API.post('Client/GetAll', rq).then((r) => {
            setTotalCount(r.data.totalCount);
            setRows(
                r.data.clients.map((client) => {
                    return {
                        ...client,
                        debt: formatCurrency(client.debt),
                        deliveryDay: client.dealerName
                            ? `${client.dealerName} - ${formatDeliveryDay(client.deliveryDay)}`
                            : ' - ',
                        endpoint: 'Client',
                    };
                }),
            );
            if (r.data.clients.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

    const updateDeletedRow = (id) => {
        setRows((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Clientes' />
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
                                    <Col xs={12} className='pe-3 mb-3'>
                                        <Input
                                            borderless
                                            placeholder='Buscar'
                                            helpText='Nombre'
                                            value={filter}
                                            onChange={handleFilterRows}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    className='mb-5'
                                    columns={columns}
                                    rows={rows.filter((r) => r.name.toLowerCase().includes(filter))}
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
                    ></Card>
                </Col>
            </div>
        </>
    );
};

export default ClientList;
