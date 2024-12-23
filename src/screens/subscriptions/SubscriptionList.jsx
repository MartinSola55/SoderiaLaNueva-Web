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
import { buildGenericGetAllRq, formatCurrency } from '../../app/Helpers';
import { SubscriptionProduct } from './SubscriptionProduct';

const breadcrumbItems = [
    {
        active: true,
        label: 'Abonos',
    },
];

const SubscriptionList = () => {
    const columns = [
        {
            name: 'name',
            text: 'Nombre',
            textCenter: true,
        },
        {
            name: 'price',
            text: 'Precio',
            textCenter: true,
        },
        {
            name: 'products',
            text: 'Productos',
            component: (props) => (
                <SubscriptionProduct products={props.row.subscriptionProductItems} />
            ),
            textCenter: true,
        },
        {
            name: 'actions',
            text: 'Acciones',
            component: (props) => <ActionButtons entity='abono' {...props} />,
            className: 'text-center',
        },
    ];

    const sortProductItems = [
        { value: 'price-asc', label: 'Precio - Asc.' },
        { value: 'price-desc', label: 'Precio - Desc.' },
        { value: 'name-asc', label: 'Nombre - Asc.' },
        { value: 'name-desc', label: 'Nombre - Desc.' },
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

        API.post('Subscription/GetAll', rq).then((r) => {
            setTotalCount(r.data.totalCount);
            setRows(
                r.data.subscriptions.map((subscription) => {
                    return {
                        id: subscription.id,
                        name: subscription.name,
                        price: formatCurrency(subscription.price),
                        subscriptionProductItems: subscription.subscriptionProductItems,
                        endpoint: 'Subscription',
                    };
                }),
            );
            if (r.data.subscriptions.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

    const updateDeletedRow = (id) => {
        setRows((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Abonos' />
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
                                <Button onClick={() => navigate('/abonos/new')} variant='primary'>
                                    Nuevo abono
                                </Button>
                            </div>
                        }
                    ></Card>
                </Col>
            </div>
        </>
    );
};

export default SubscriptionList;
