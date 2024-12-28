import { Col, Row } from 'react-bootstrap';
import {
    ActionButtons,
    BreadCrumb,
    Button,
    Card,
    DeliveryDayDropdown,
    Label,
    Table,
    Toast,
} from '../../components';
import { useEffect, useState } from 'react';
import API from '../../app/API';
import { useNavigate } from 'react-router';
import { Messages } from '../../constants/Messages';
import App from '../../app/App';

const breadcrumbItems = [
    {
        active: true,
        label: 'Planillas',
    },
];

const RouteList = () => {
    const columns = [
        {
            name: 'dealer',
            text: 'Repartidor',
            textCenter: true,
        },
        {
            name: 'totalCarts',
            text: 'Envíos a Realizar',
            textCenter: true,
        },
        {
            name: 'actions',
            text: 'Acciones',
            component: (props) => <ActionButtons entity='planilla' {...props} />,
            className: 'text-center',
        },
    ];

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [day, setDay] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDayChange = (v) => {
        setDay(v);
    };

    useEffect(() => {
        if (!App.isAdmin()) {
            return navigate('/notAllowed');
        }
    }, [navigate]);

    useEffect(() => {
        const rq = {
            deliveryDay: day,
        };

        API.get('Route/GetAllStaticRoutes', rq).then((r) => {
            setTotalCount(r.data.totalCount);
            setRows(
                r.data.routes.map((route) => {
                    return {
                        id: route.id,
                        dealer: route.dealer,
                        totalCarts: route.totalCarts,
                        endpoint: 'Routes',
                    };
                }),
            );
            if (r.data.routes.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, day]);

    const updateDeletedRow = (id) => {
        setRows((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Planillas' />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Planillas'
                        body={
                            <>
                                <Row>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <Label>Día</Label>
                                        <DeliveryDayDropdown
                                            placeholder='Dia'
                                            value={day}
                                            onChange={(v) => handleDayChange(v)}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    className='mb-5'
                                    columns={columns}
                                    rows={rows}
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
                                    onClick={() => navigate('/planillas/new')}
                                    variant='primary'
                                >
                                    Nueva planilla
                                </Button>
                            </div>
                        }
                    ></Card>
                </Col>
            </div>
        </>
    );
};

export default RouteList;
