import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Button, Card, DeliveryDayDropdown, Label, Table } from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getDayIndex } from '../../app/Helpers';
import App from '../../app/App';
import API from '../../app/API';

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
    const [dayFilter, setDayFilter] = useState(getDayIndex());

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDayFilterChange = (v) => {
        setDayFilter(v);
    };

    useEffect(() => {
        if (!App.isAdmin()) {
            return navigate('/notAllowed');
        }
    }, [navigate]);

    useEffect(() => {
        const rq = {
            deliveryDay: dayFilter,
        };

        API.get('route/getAllStaticRoutes', rq).then((r) => {
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
        });
    }, [currentPage, dayFilter]);

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
                                            value={dayFilter}
                                            onChange={(v) => handleDayFilterChange(v)}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    className='mb-5'
                                    columns={columns}
                                    rows={rows}
                                    emptyTableMessage='No se encontraron planillas para el día seleccionado'
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
                    />
                </Col>
            </div>
        </>
    );
};

export default RouteList;
