import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Input, Label, Loader, Spinner, Table } from '../../components';
import { useEffect, useState } from 'react';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { Messages } from '../../constants/Messages';
import { InitialFormStates } from '../../app/InitialFormStates';
import { useNavigate, useParams } from 'react-router';
import App from '../../app/App';
import { formatProducts } from '../../app/Helpers';

const initialForm = InitialFormStates.Subscription;

const CreateSubscription = ({ isWatching = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(initialForm);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);
    const [productTypes, setProductTypes] = useState([]);

    const productTypeRows = productTypes.map((py) => {
        const formProduct = form.subscriptionProducts.find(
            (sp) => parseInt(sp.id) === parseInt(py.id),
        );
        if (formProduct)
            return {
                ...py,
                quantity: formProduct.quantity,
            };
        return py;
    });

    const breadcrumbItems = [
        {
            active: false,
            url: '/abonos/list',
            label: 'Abonos',
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
            name: 'quantity',
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
                            productTypeRows.map((sp) => {
                                if (sp.id === props.row.id)
                                    return {
                                        ...sp,
                                        quantity: value,
                                    };
                                return sp;
                            }),
                            'subscriptionProducts',
                        )
                    }
                    {...props}
                />
            ),
            className: 'text-center',
        },
    ];

    // Get form data
    useEffect(() => {
        API.get('Product/GetComboProductTypes').then((r) => {
            setProductTypes(formatProducts(r.data.items, isWatching));
            if (!id) {
                setForm((prevForm) => ({
                    ...prevForm,
                    subscriptionProducts: formatProducts(r.data.items),
                }));
            }
        });
        if (id) {
            API.get('Subscription/GetOneById', { id }).then((r) => {
                setForm(() => ({
                    ...r.data,
                }));
                setLoading(false);
            });
        }
    }, [id, isWatching]);

    const handleSubmit = async () => {
        if (submiting) return;

        if (!form.name || !form.price) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmiting(true);

        const rq = {
            name: form.name,
            price: form.price,
            subscriptionProducts: form.subscriptionProducts.map((x) => ({
                productTypeId: x.id,
                quantity: x.quantity,
            })),
        };

        if (id) {
            rq.id = id;
        }

        API.post(`Subscription/${id ? 'Update' : 'Create'}`, rq)
            .then((r) => {
                Toast.success(r.message);
                navigate('/abonos/list');
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
            <BreadCrumb items={breadcrumbItems} title='Abonos' />
            <Col xs={12} className='container'>
                <Row>
                    <Col xs={6}>
                        <Card
                            title='Datos del abono'
                            body={
                                loading ? (
                                    <Spinner />
                                ) : (
                                    <Row className='align-items-center'>
                                        <Col xs={12} md={6} className='pe-3 mb-3'>
                                            <Label required>Nombre del abono</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder='Nombre'
                                                value={form.name}
                                                onChange={(value) =>
                                                    handleInputChange(value, 'name')
                                                }
                                            />
                                        </Col>
                                        <Col xs={12} md={6} className='pe-3 mb-3'>
                                            <Label required>Precio</Label>
                                            <Input
                                                disabled={isWatching}
                                                numeric
                                                isFloat
                                                minValue={0}
                                                placeholder='Precio'
                                                type='number'
                                                value={form.price}
                                                onChange={(value) =>
                                                    handleInputChange(value, 'price')
                                                }
                                            />
                                        </Col>
                                    </Row>
                                )
                            }
                            footer={
                                <div className='d-flex justify-content-end'>
                                    <Button
                                        variant='secondary'
                                        className='me-2'
                                        onClick={() => navigate('/abonos/list')}
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
                    <Col xs={6}>
                        <Card
                            title='Asociar productos'
                            body={
                                loading ? (
                                    <Spinner />
                                ) : (
                                    <Row className='align-items-center'>
                                        <Col xs={12}>
                                            <Table rows={productTypeRows} columns={columns}></Table>
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

export default CreateSubscription;
