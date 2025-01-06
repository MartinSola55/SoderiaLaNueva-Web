import { Col, Row } from 'react-bootstrap';
import {
    BreadCrumb,
    Button,
    Card,
    CheckBox,
    Dropdown,
    Input,
    Label,
    Loader,
    Spinner,
    UserDropdown,
    DeliveryDayDropdown,
    Table,
} from '../../components';
import { useEffect, useState } from 'react';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { Messages } from '../../constants/Messages';
import { InitialFormStates } from '../../app/InitialFormStates';
import { useNavigate, useParams } from 'react-router';
import App from '../../app/App';
import { formatOptions, formatProducts, formatSubscriptions } from '../../app/Helpers';
import { Roles } from '../../constants/Roles';

const initialForm = InitialFormStates.Client;

const CreateClient = ({ isWatching = false, isEditing = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(initialForm);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);
    const [invoiceTypes, setInvoiceTypes] = useState([]);
    const [taxConditions, setTaxConditions] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [products, setProducts] = useState([]);

    const subscriptionsRows = subscriptions.map((s) => {
        const formSubscription = form.subscriptions.find((id) => parseInt(id) === parseInt(s.id));
        if (formSubscription)
            return {
                ...s,
                asociated: true,
            };
        return s;
    });

    const productRows = products.map((p) => {
        const formProduct = form.products.find((fp) => parseInt(fp.id) === parseInt(p.id));
        if (formProduct)
            return {
                ...p,
                quantity: formProduct.quantity,
            };
        return p;
    });

    const breadcrumbItems = [
        {
            active: false,
            url: '/clientes/list',
            label: 'Clientes',
        },
        {
            active: true,
            label: isWatching ? 'Ver' : id ? 'Editar' : 'Nuevo',
        },
    ];

    const productsColumns = [
        {
            name: 'description',
            text: 'Producto',
            textCenter: true,
        },
        {
            name: 'quiantity',
            text: 'Cantidad',
            component: (props) => (
                <Input
                    numeric
                    isFloat
                    minValue={0}
                    placeholder='Cantidad'
                    type='number'
                    value={props.row.quantity}
                    onChange={(value) =>
                        handleInputChange(
                            productRows.map((p) => {
                                if (p.id === props.row.id)
                                    return {
                                        ...p,
                                        quantity: value,
                                    };
                                return p;
                            }),
                            'products',
                        )
                    }
                    {...props}
                />
            ),
            className: 'text-center',
        },
    ];

    const subscriptionsColumns = [
        {
            name: 'description',
            text: 'Abono',
            textCenter: true,
        },
        {
            name: 'asociate',
            text: 'Asociar',
            component: (props) => (
                <CheckBox
                    onChange={(value) => {
                        handleInputChange(
                            value
                                ? [...form.subscriptions, props.row.id]
                                : form.subscriptions.filter((s) => s !== props.row.id),
                            'subscriptions',
                        );
                    }}
                    checked={props.row.asociated}
                    {...props}
                ></CheckBox>
            ),
            className: 'text-center',
        },
    ];
    const salesHistoryColumns = [
        {
            name: 'date',
            text: 'Fecha',
            textCenter: true,
        },
        {
            name: 'type',
            text: 'Tipo',
            textCenter: true,
        },
    ];

    const productHistoryColumns = [
        {
            name: 'name',
            text: 'Nombre',
            textCenter: true,
        },
        {
            name: 'type',
            text: 'Tipo',
            textCenter: true,
        },
        {
            name: 'quantity',
            text: 'Cantidad',
            textCenter: true,
        },
        {
            name: 'date',
            text: 'Fecha',
            textCenter: true,
        },
    ];

    // Get form data
    useEffect(() => {
        API.get('Client/GetFormData').then((r) => {
            setInvoiceTypes(formatOptions(r.data.invoiceTypes));
            setTaxConditions(formatOptions(r.data.taxConditions));
        });
        API.get('Product/GetComboProducts').then((r) => {
            setProducts(formatProducts(r.data.items, isWatching));
            if (!id) {
                setForm((prevForm) => ({
                    ...prevForm,
                    products: formatProducts(r.data.items),
                }));
            }
        });
        if (id) {
            API.get('Client/GetOneById', { id }).then((r) => {
                setForm(() => ({
                    ...r.data,
                }));
                setLoading(false);
            });
            API.get('Subscription/GetComboSubscriptions').then((r) => {
                setSubscriptions(formatSubscriptions(r.data.items, isWatching));
            });
        }
    }, [id, isWatching]);

    const handleSubmit = async (url) => {
        if (submiting) return;

        if (
            !url &&
            (!form.name ||
                !form.address ||
                !form.phone ||
                (form.hasInvoice && (!form.invoiceType || !form.taxCondition || !form.cuit)))
        ) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmiting(true);

        let rq;

        if (!url) {
            rq = {
                name: form.name,
                address: form.address,
                phone: form.phone,
                observations: form.observations,
                dealerId: form.dealerId,
                deliveryDay: form.deliveryDay,
                hasInvoice: form.hasInvoice,
                invoiceType: form.invoiceType,
                taxCondition: form.taxCondition,
                cuit: form.cuit,
                products: form.products.map((x) => ({
                    productId: x.id,
                    quantity: x.quantity,
                })),

                if(id) {
                    rq.id = id;
                },
            };
        } else if (url === 'UpdateClientProducts') {
            rq = {
                clientId: id,
                products: form.products.map((x) => ({
                    productId: x.id,
                    quantity: x.quantity,
                })),
            };
        } else if (url === 'UpdateClientSubscriptions') {
            rq = {
                clientId: id,
                subscriptionIds: form.subscriptions,
            };
        }

        API.post(`Client/${url || (id ? 'UpdateClientData' : 'Create')}`, rq)
            .then((r) => {
                Toast.success(r.message);
                if (!url) navigate('/clientes/list');
            })
            .catch((r) => {
                Toast.error(r.error.message);
            })
            .finally(() => {
                setSubmiting(false);
            });
    };

    const handleInputChange = (value, field) => {
        setForm((prevForm) => {
            return {
                ...prevForm,
                [field]: value,
            };
        });
    };

    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Clientes' />
            <Col xs={11} className='container'>
                <Row>
                    <Col sm={6}>
                        <Card
                            title='Cliente'
                            body={
                                loading ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        <Row className='align-items-center'>
                                            <Col xs={12} md={6} lg={4} className='pe-3 mb-3'>
                                                <Label required>Nombre del cliente</Label>
                                                <Input
                                                    disabled={isWatching}
                                                    placeholder='Nombre'
                                                    value={form.name}
                                                    onChange={(value) =>
                                                        handleInputChange(value, 'name')
                                                    }
                                                />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className='pe-3 mb-3'>
                                                <Label required>Dirección</Label>
                                                <Input
                                                    disabled={isWatching}
                                                    placeholder='Dirección'
                                                    value={form.address}
                                                    onChange={(value) =>
                                                        handleInputChange(value, 'address')
                                                    }
                                                />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className='pe-3 mb-3'>
                                                <Label required>Teléfono</Label>
                                                <Input
                                                    disabled={isWatching}
                                                    placeholder='Teléfono'
                                                    value={form.phone}
                                                    onChange={(value) =>
                                                        handleInputChange(value, 'phone')
                                                    }
                                                />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className='pe-3 mb-3'>
                                                <Label>Observaciones</Label>
                                                <Input
                                                    disabled={isWatching}
                                                    placeholder='Observaciones'
                                                    value={form.observations || ''}
                                                    onChange={(value) =>
                                                        handleInputChange(value, 'observations')
                                                    }
                                                />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className='pe-3 mb-3'>
                                                <Label>Repartidor</Label>
                                                <UserDropdown
                                                    disabled={isWatching}
                                                    placeholder='Seleccione un repartidor'
                                                    roles={[Roles.Dealer]}
                                                    value={form.dealerId}
                                                    onChange={(value) =>
                                                        handleInputChange(value, 'dealerId')
                                                    }
                                                />
                                            </Col>
                                            <Col xs={12} md={6} lg={4} className='pe-3 mb-3'>
                                                <Label>Día de reparto</Label>
                                                <DeliveryDayDropdown
                                                    disabled={isWatching}
                                                    placeholder='Seleccione un día de reparto'
                                                    value={form.deliveryDay}
                                                    onChange={(option) =>
                                                        handleInputChange(
                                                            option.value,
                                                            'deliveryDay',
                                                        )
                                                    }
                                                />
                                            </Col>
                                            <Col xs={12} className='pe-3 mb-3'>
                                                <CheckBox
                                                    label='¿Quiere factura?'
                                                    name='hasInvoice'
                                                    value={form.hasInvoice}
                                                    checked={form.hasInvoice}
                                                    onChange={(value) =>
                                                        handleInputChange(value, 'hasInvoice')
                                                    }
                                                />
                                            </Col>
                                            {form.hasInvoice && (
                                                <>
                                                    <Col xs={12} lg={4} className='pe-3 mb-3'>
                                                        <Label required>Tipo de factura</Label>
                                                        <Dropdown
                                                            disabled={isWatching}
                                                            placeholder='Seleccione un tipo de factura'
                                                            required
                                                            items={invoiceTypes}
                                                            value={form.invoiceType || ''}
                                                            onChange={(option) =>
                                                                handleInputChange(
                                                                    option.value,
                                                                    'invoiceType',
                                                                )
                                                            }
                                                        />
                                                    </Col>
                                                    <Col xs={12} lg={4} className='pe-3 mb-3'>
                                                        <Label required>
                                                            Condición frente al IVA
                                                        </Label>
                                                        <Dropdown
                                                            disabled={isWatching}
                                                            placeholder='Seleccione una condición frente al IVA'
                                                            required
                                                            items={taxConditions}
                                                            value={form.taxCondition || ''}
                                                            onChange={(option) =>
                                                                handleInputChange(
                                                                    option.value,
                                                                    'taxCondition',
                                                                )
                                                            }
                                                        />
                                                    </Col>
                                                    <Col xs={12} lg={4} className='pe-3 mb-3'>
                                                        <Label required>CUIT</Label>
                                                        <Input
                                                            disabled={isWatching}
                                                            placeholder='CUIT'
                                                            value={form.cuit || ''}
                                                            onChange={(value) =>
                                                                handleInputChange(value, 'cuit')
                                                            }
                                                        />
                                                    </Col>
                                                </>
                                            )}
                                        </Row>
                                    </>
                                )
                            }
                            footer={
                                <div className='d-flex justify-content-end'>
                                    <Button
                                        variant='secondary'
                                        className='me-2'
                                        onClick={() => navigate('/clientes/list')}
                                    >
                                        Volver
                                    </Button>
                                    {!isWatching && (
                                        <Button onClick={handleSubmit} disabled={submiting}>
                                            {submiting ? <Loader /> : id ? 'Actualizar' : 'Crear'}
                                        </Button>
                                    )}
                                </div>
                            }
                        ></Card>
                    </Col>
                    {(isEditing || isWatching) && (
                        <Col sm={6}>
                            <Row>
                                <Col xs={12}>
                                    <Card
                                        title={'Historial de bajadas y transferencias'}
                                        body={
                                            <Table
                                                rows={form.salesHistory}
                                                columns={salesHistoryColumns}
                                            ></Table>
                                        }
                                    ></Card>
                                </Col>
                                <Col xs={12}>
                                    <Card
                                        title={'Historial de envases'}
                                        body={
                                            <Table
                                                rows={form.productHistory}
                                                columns={productHistoryColumns}
                                            ></Table>
                                        }
                                    ></Card>
                                </Col>
                                {/* <Col xs={12}>
                                   
                                    <Table
                                        rows={form.productHistory}
                                        columns={productHistoryColumns}
                                    ></Table>
                                </Col> */}
                            </Row>
                        </Col>
                    )}
                    <Col sm={6}>
                        <Card
                            title={isWatching ? 'Productos asociados' : 'Asociar productos'}
                            body={
                                loading ? (
                                    <Spinner />
                                ) : (
                                    <Row className='align-items-center'>
                                        <Col xs={12}>
                                            <Table
                                                rows={productRows}
                                                columns={productsColumns}
                                            ></Table>
                                        </Col>
                                    </Row>
                                )
                            }
                            footer={
                                <div className='d-flex justify-content-end'>
                                    {!isWatching && (
                                        <Button
                                            onClick={() => handleSubmit('UpdateClientProducts')}
                                            disabled={submiting}
                                        >
                                            {submiting ? <Loader /> : id ? 'Actualizar' : 'Crear'}
                                        </Button>
                                    )}
                                </div>
                            }
                        ></Card>
                    </Col>
                    {(isEditing || isWatching) && (
                        <Col sm={6}>
                            <Card
                                title={isWatching ? 'Abonos asociados' : 'Asociar abonos'}
                                body={
                                    loading ? (
                                        <Spinner />
                                    ) : (
                                        <Row className='align-items-center'>
                                            <Col xs={12}>
                                                <Table
                                                    rows={subscriptionsRows}
                                                    columns={subscriptionsColumns}
                                                ></Table>
                                            </Col>
                                        </Row>
                                    )
                                }
                                footer={
                                    <div className='d-flex justify-content-end'>
                                        {!isWatching && (
                                            <Button
                                                onClick={() =>
                                                    handleSubmit('UpdateClientSubscriptions')
                                                }
                                                disabled={submiting}
                                            >
                                                {submiting ? <Loader /> : 'Actualizar'}
                                            </Button>
                                        )}
                                    </div>
                                }
                            ></Card>
                        </Col>
                    )}
                </Row>
            </Col>
        </>
    );
};

export default CreateClient;
