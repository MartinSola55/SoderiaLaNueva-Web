import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Button, Card, Input, Table, TableSort, Toast, } from '../../components';
import { useEffect, useState } from 'react';
import API from '../../app/API';
import { useNavigate } from 'react-router';
import { Messages } from '../../constants/Messages';
import App from '../../app/App';
import { formatCurrency } from '../../app/Helpers';

const breadcrumbItems = [
    {
        active: true,
        label: 'Productos',
    },
];

const ProductList = () => {
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
            name: 'type',
            text: 'Tipo',
            textCenter: true,
        },
        {
            name: 'createdAt',
            text: 'Fecha de creación',
            textCenter: true,
        },
        {
            name: 'actions',
            text: 'Acciones',
            component: (props) => <ActionButtons entity="producto" {...props} />,
            className: 'text-center',
        },
    ];

    const sortProductItems = [
        { value: 'createdAt-asc', label: 'Creado - Asc.' },
        { value: 'createdAt-desc', label: 'Creado - Desc.' },
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
        const rq = {
            page: currentPage,
        };

        if (sort && sort.column) {
            rq.columnSort = sort.column;
            rq.sortDirection = sort.direction;
        } else {
            rq.columnSort = 'createdAt';
            rq.sortDirection = 'desc';
        }

        API.post('Product/GetAll', rq).then((r) => {
            setTotalCount(r.data.totalCount);
            setRows(
                r.data.products.map((product) => {
                    return {
                        id: product.id,
                        name: product.name,
                        price: formatCurrency(product.price),
                        type: product.type,
                        createdAt: product.createdAt,
                        endpoint: 'Product',
                    };
                }),
            );
            if (r.data.products.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

    const updateDeletedRow = (id) => {
        setRows((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Productos' />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Productos'
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
                                <Button onClick={() => navigate('/productos/new')} variant='primary'>
                                    Nuevo producto
                                </Button>
                            </div>
                        }
                    ></Card>
                </Col>
            </div>
        </>
    );
};

export default ProductList;
