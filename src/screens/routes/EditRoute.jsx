import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Input, Loader, Spinner, Table } from '../../components';
import { useEffect, useState } from 'react';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { InitialFormStates } from '../../app/InitialFormStates';
import { useNavigate, useParams } from 'react-router';
import App from '../../app/App';
import { formatClients, formatDeliveryDay } from '../../app/Helpers';
import { faArrowLeft, faRemove } from '@fortawesome/free-solid-svg-icons';

const initialForm = InitialFormStates.RouteClients;

const EditRoute = ({ isWatching = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(initialForm);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [filter, setFilter] = useState({ selected: '', notSelected: '' });

    const breadcrumbItems = [
        {
            active: false,
            url: '/planillas/list',
            label: 'Planillas',
        },
        {
            active: true,
            label: isWatching ? 'Ver' : 'Editar',
        },
    ];

    const selectedColumns = [
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
            name: 'remove',
            text: 'Quitar',
            component: (props) => (
                <Button
                    icon={faRemove}
                    disabled={isWatching}
                    className='bg-danger p-0 border-0'
                    style={{ minWidth: '35px' }}
                    iconStyle={{ marginLeft: '0px' }}
                    onClick={() => handleChangeRow(props.row, true)}
                ></Button>
            ),
            className: 'text-center',
        },
    ];

    const notSelectedColumns = [
        {
            name: 'add',
            text: 'Seleccionar',
            component: (props) => (
                <Button
                    icon={faArrowLeft}
                    className='p-0'
                    style={{ minWidth: '35px' }}
                    iconStyle={{ marginLeft: '0px' }}
                    onClick={() => handleChangeRow(props.row, false)}
                ></Button>
            ),
            className: 'text-center',
        },
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
    ];

    // Get form data
    useEffect(() => {
        if (id) {
            API.get('Route/GetStaticRouteClients', { id }).then((r) => {
                setForm(() => ({
                    ...r.data,
                    clients: formatClients(r.data.clients),
                }));
                setLoading(false);
            });
        }
    }, [id]);

    // Get clients
    useEffect(() => {
        if (!isWatching) {
            API.post('Route/GetClientsList', { id: id, currentPage: currentPage }).then((r) => {
                setTotalCount(r.data.totalCount);
                setClients(formatClients(r.data.items));
            });
        }
    }, [currentPage, id, isWatching]);

    const handleSubmit = async () => {
        if (submiting) return;

        setSubmiting(true);

        const rq = {
            routeId: id,
            clients: form.clients.map((x) => parseInt(x.id)),
        };

        API.post('Route/UpdateClients', rq)
            .then((r) => {
                Toast.success(r.message);
                navigate('/planillas/list');
            })
            .catch((r) => {
                Toast.error(r.error.message);
            })
            .finally(() => {
                setSubmiting(false);
            });
    };

    const handleChangeRow = (row, selected) => {
        if (selected) {
            setClients((prevClients) => [...prevClients, row]);
            setForm((prevForm) => ({
                ...prevForm,
                clients: prevForm.clients.filter((c) => parseInt(c.id) !== parseInt(row.id)),
            }));
        } else {
            setForm((prevForm) => ({
                ...prevForm,
                clients: [...prevForm.clients, row],
            }));
            setClients((prevClients) =>
                prevClients.filter((c) => parseInt(c.id) !== parseInt(row.id)),
            );
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterRows = (value, name) => {
        setFilter((prevFilters) => ({
            ...prevFilters,
            [name]: value.toLowerCase(),
        }));
    };

    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Clientes' />
            <Col xs={12} className='row mx-auto px-2'>
                <Col xs={11} className='container'>
                    {!isWatching && (
                        <>
                            <h3>
                                {`Agregar cliente al reparto del ${formatDeliveryDay(form.deliveryDay)} de ${form.dealer}`}
                            </h3>
                            <hr />
                        </>
                    )}
                    <Row>
                        <Col sm={6}>
                            <Card
                                title='Clientes seleccionados'
                                body={
                                    loading ? (
                                        <Spinner />
                                    ) : (
                                        <Row className='align-items-center'>
                                            <Col xs={12}>
                                                <Input
                                                    borderless
                                                    placeholder='Buscar'
                                                    helpText='Nombre'
                                                    value={filter.selected}
                                                    onChange={(v) =>
                                                        handleFilterRows(v, 'selected')
                                                    }
                                                />
                                                <Table
                                                    rows={form.clients.filter((r) =>
                                                        r.name
                                                            .toLowerCase()
                                                            .includes(filter.selected),
                                                    )}
                                                    columns={selectedColumns}
                                                ></Table>
                                            </Col>
                                        </Row>
                                    )
                                }
                                footer={
                                    <div className='d-flex justify-content-end'>
                                        <Button
                                            variant='secondary'
                                            className='me-2'
                                            onClick={() => navigate('/planillas/list')}
                                        >
                                            Volver
                                        </Button>
                                        {!isWatching && (
                                            <Button onClick={handleSubmit} disabled={submiting}>
                                                {submiting ? (
                                                    <Loader />
                                                ) : id ? (
                                                    'Actualizar'
                                                ) : (
                                                    'Crear'
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                }
                            ></Card>
                        </Col>
                        <Col sm={6}>
                            <Card
                                title='Listado de clientes'
                                body={
                                    loading ? (
                                        <Spinner />
                                    ) : (
                                        <Row className='align-items-center'>
                                            <Col xs={12}>
                                                <Col xs={12} className='pe-3 mb-3'>
                                                    <Input
                                                        borderless
                                                        placeholder='Buscar'
                                                        helpText='Nombre'
                                                        value={filter.notSelected}
                                                        onChange={(v) =>
                                                            handleFilterRows(v, 'notSelected')
                                                        }
                                                    />
                                                </Col>
                                                <Table
                                                    rows={clients.filter((r) =>
                                                        r.name
                                                            .toLowerCase()
                                                            .includes(filter.notSelected),
                                                    )}
                                                    columns={notSelectedColumns}
                                                    totalCount={totalCount}
                                                    currentPage={currentPage}
                                                    onPageChange={handlePageChange}
                                                ></Table>
                                            </Col>
                                        </Row>
                                    )
                                }
                            ></Card>
                        </Col>
                    </Row>
                </Col>
            </Col>
        </>
    );
};

export default EditRoute;
