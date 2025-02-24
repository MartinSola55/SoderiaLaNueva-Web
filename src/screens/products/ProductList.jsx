import { Col, Row } from 'react-bootstrap';
import { ActionButtons, BreadCrumb, Button, Card, Input, ProductsDropdown, Table, TableSort, Toast } from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Messages } from '../../constants/Messages';
import App from '../../app/App';
import { clientCols, productCols, sortProductItems } from './Products.data';
import { getAllProducts, getBreadcrumbItems, getClientProducts } from './Products.helpers';

const ProductList = () => {
    const allProductCols = [
        ...productCols,
        {
            name: 'actions',
            text: 'Acciones',
            component: (props) => <ActionButtons entity='producto' {...props} />,
            className: 'text-center',
        },
    ];

    const navigate = useNavigate();

    // States
    const [products, setProducts] = useState([]);
    const [clients, setClients] = useState([]);
    const [prodFilter, setProdFilter] = useState('');
    const [clientFilter, setClientFilter] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(null);
    const [loading, setLoading] = useState(false);

    // Effects
    useEffect(() => {
        getAllProducts(sort, currentPage, ({ products, totalCount }) => {
            setTotalCount(totalCount);
            setProducts(products);

            if (products.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

    useEffect(() => {
        if (!selectedProduct)
            return;

        setLoading(true);
        getClientProducts(selectedProduct, (clients) => {
            setClients(clients);
            setLoading(false);
        });
    }, [selectedProduct]);

    // Handlers
    const handleFilterProducts = (value) => {
        setProdFilter(value);
    };

    const handleFilterClients = (value) => {
        setClientFilter(value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }) => {
        setSort({ column, direction });
    };

    const updateDeletedRow = (id) => {
        setProducts((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    // Render
    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems()} title='Productos' />
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
                                    <Col xs={12} sm={6} lg={4} className='pe-3 mb-3'>
                                        <Input
                                            showIcon
                                            borderless
                                            placeholder='Buscar'
                                            value={prodFilter}
                                            onChange={handleFilterProducts}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    className='mb-5'
                                    columns={allProductCols}
                                    rows={products.filter((x) => x.name.toLowerCase().includes(prodFilter.toLowerCase()))}
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
                                    onClick={() => navigate('/productos/new')}
                                    variant='primary'
                                >
                                    Nuevo producto
                                </Button>
                            </div>
                        }
                    />
                    <Card
                        header={<h4>Productos asociados a clientes</h4>}
                        body={
                            <>
                                <Row>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <ProductsDropdown
                                            value={selectedProduct}
                                            onChange={setSelectedProduct}
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
                                    rows={clients.filter((x) => x.name.toLowerCase().includes(clientFilter.toLowerCase()))}
                                    emptyTableMessage='No se encontraron clientes asociados a este producto'
                                    currentPage={currentPage}
                                    totalCount={totalCount}
                                    loading={loading}
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

export default ProductList;
