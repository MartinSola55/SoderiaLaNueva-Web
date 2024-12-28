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
import { formatOptions, formatProducts } from '../../app/Helpers';
import { Roles } from '../../constants/Roles';

const initialForm = InitialFormStates.Client;

const CreateClient = ({ isWatching = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(initialForm);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);
    const [invoiceTypes, setInvoiceTypes] = useState([]);
    const [taxConditions, setTaxConditions] = useState([]);

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

    const columns = [
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
                    value={form.products.find((p) => p.id === props.row.id)?.quantity}
                    onChange={(value) => handleInputChange(value, 'products', props.row.id)}
                    {...props}
                />
            ),
            className: 'text-center',
        },
    ];

    // Get form data
    useEffect(() => {
        API.get('Client/GetFormData').then((r) => {
            setInvoiceTypes(formatOptions(r.data.invoiceTypes));
            setTaxConditions(formatOptions(r.data.taxConditions));
        });
        API.get('Product/GetComboProducts').then((r) => {
            setForm((prevForm) => ({
                ...prevForm,
                products: formatProducts(r.data.items, isWatching).map((prod) => {
                    const prevProduct = prevForm.products.find(
                        (prevProd) => prevProd.id === prod.id,
                    );
                    if (prevProduct) {
                        return {
                            ...prod,
                            quantity: prevProduct.quantity,
                        };
                    }
                    return prod;
                }),
            }));
        });
        if (id) {
            API.get('Client/GetOneById', { id }).then((r) => {
                setForm((prevForm) => ({
                    ...r.data,
                    products:
                        prevForm.products.length === 0
                            ? r.data.products
                            : prevForm.products.map((prevProd) => {
                                  const newProduct = r.data.products.find(
                                      (newProd) => newProd.id === prevProd.id,
                                  );
                                  if (newProduct) {
                                      return {
                                          ...prevProd,
                                          quantity: newProduct.quantity,
                                      };
                                  }
                                  return prevProd;
                              }),
                }));
                setLoading(false);
            });
        }
    }, [id, isWatching]);

    const handleSubmit = async () => {
        if (submiting) return;

        if (
            !form.name ||
            !form.address ||
            !form.phone ||
            (form.hasInvoice && (!form.invoiceType || !form.taxCondition || !form.cuit))
        ) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmiting(true);

        const rq = {
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
        };

        if (id) {
            rq.id = id;
        }

        API.post(`Client/${id ? 'Update' : 'Create'}`, rq)
            .then((r) => {
                Toast.success(r.message);
                navigate('/clientes/list');
            })
            .catch((r) => {
                Toast.error(r.error.message);
            })
            .finally(() => {
                setSubmiting(false);
            });
    };

    const handleInputChange = (value, field, rowId) => {
        if (!rowId)
            setForm((prevForm) => {
                return {
                    ...prevForm,
                    [field]: value,
                };
            });
        else {
            setForm((prevForm) => {
                const updatedFields = prevForm[field].map((x) => {
                    if (x.id === rowId) return { ...x, quantity: parseInt(value) };
                    return x;
                });
                return {
                    ...prevForm,
                    [field]: updatedFields,
                };
            });
        }
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
                    <Col sm={6}>
                        <Card
                            title='Asociar productos'
                            body={
                                loading ? (
                                    <Spinner />
                                ) : (
                                    <Row className='align-items-center'>
                                        <Col xs={12}>
                                            <Table rows={form.products} columns={columns}></Table>
                                        </Col>
                                    </Row>
                                )
                            }
                        ></Card>
                    </Col>
                    <Col sm={6}>
                        <Card
                            title='Asociar abonos'
                            body={
                                loading ? (
                                    <Spinner />
                                ) : (
                                    <Row className='align-items-center'>
                                        <Col xs={12}>
                                            <Table rows={form.products} columns={columns}></Table>
                                        </Col>
                                    </Row>
                                )
                            }
                        ></Card>
                    </Col>
                </Row>
            </Col>
        </>
    );
};

export default CreateClient;
