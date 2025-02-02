/* eslint-disable no-console */
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Input, Table, TableSort, Toast } from '../../../components';
import { useEffect, useRef, useState } from 'react';
import { Messages } from '../../../constants/Messages';
import { getBreadcrumbItems, getClients } from '../../clients/Clients.helpers';
import { clientColumns, sortClientItems } from '../../clients/Clients.data';
import { useLocation } from 'react-router';
import AddClientModal from './AddClientModal';
import API from '../../../app/API';
import { formatCartProducts, formatPaymentMethods } from '../../../app/Helpers';

const AddClientList = () => {
    const columns = [
        ...clientColumns,
        {
            name: 'actions',
            text: 'Acciones',
            className: 'text-center',
            component: (props) => <Button {...props} onClick={() => handleSelectClient(props.row)}>Seleccionar</Button>,
        },
    ];

    // State
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [products, setProducts] = useState([]);
    const [submiting, setSubmiting] = useState(false);

	const location = useLocation();
    const { clientIds } = location.state || {}; 

	const addClientModal = useRef(null);

    // Effects
    useEffect(() => {
        getClients(sort, currentPage, clientIds, ({ clients, totalCount }) => {
            setTotalCount(totalCount);
            setRows(clients);
            if (clients.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
		API.get('Cart/GetPaymentStatusesCombo').then((r) => {
            setPaymentMethods(formatPaymentMethods(r.data.items));
        });
    }, [clientIds, currentPage, sort]);

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

    const handleSelectClient = (row) => {
		API.get('Client/GetClientProducts', {id: row.id}).then((r) => {
            setProducts(formatCartProducts(r.data.products));
        });
        addClientModal.current?.open(handleSubmit, () => {}, row.name);
    };

    const handleSubmit = async () => {
        if (submiting) return;

		if (products.some(y =>  y.quantity === 0))
		{
			Toast.warning("La cantidad de productos debe ser mayor a cero.");
			return;
		};
		
		if (paymentMethods.some(x =>  x.amount === 0))
		{
			Toast.warning("La cantidad de dinero debe ser mayor a cero.");
			return;
		};

		if (paymentMethods.reduce((sum, x) => sum + x.amount, 0) !== 0)
			Toast.warning("Alerta, la cantidad total de dinero no coincide con el total");
			//TODO, poner un modal capaz (Modal de Toaster)

        setSubmiting(true);

        const rq = {
            products: products.filter(x => x.quantity !== '').map(x => ({
				productTypeId : x.id,
				soldQuantity: x.quantity,
				ReturnedQuantity: x.quantity,
			})),
			paymentMethods: paymentMethods.filter(x => x.amount !== '').map((x) => {
				return ({
					id: x.id,
					amount: x.amount
				})
			})
        };

        API.post(`Cart/Confirm`, rq)
            .then((r) => {
                Toast.success(r.message);
            })
            .catch((r) => {
                Toast.error(r.error?.message);
            })
            .finally(() => {
                setSubmiting(false);
            });
    };

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems()} title='Clientes' />
			<AddClientModal ref={addClientModal} paymentMethods={paymentMethods} setPaymentMethods={setPaymentMethods} products={products} setProducts={setProducts}/>
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
                                />
                            </>
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default AddClientList;
