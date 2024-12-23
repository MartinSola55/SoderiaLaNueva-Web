import { Col, Row } from 'react-bootstrap';
import {
    BreadCrumb,
    Button,
    Card,
    ChangePasswordModal,
    Input,
    Label,
    Loader,
    Spinner,
    Table,
} from '../../components';
import { useEffect, useRef, useState } from 'react';
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

    const modalRef = useRef();
    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(initialForm);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);

    const breadcrumbItems = [
        {
            active: false,
            url: '/abonos/list',
            label: 'Abonos',
        },
        {
            active: true,
            label: isWatching ? 'Ver' : 'Editar',
        },
    ];

    const columns = [
        {
            name: 'name',
            text: 'Nombre',
            textCenter: true,
        },
        {
            name: 'id',
            text: 'Cantidad',
            component: (props) => (
                <Input
                    numeric
                    isFloat
                    minValue={0}
                    placeholder='Cantidad'
                    type='number'
                    value={form.subscriptionProducts[props.row.index]?.quantity}
                    onChange={(value) =>
                        handleInputChange(value, 'subscriptionProducts', props.row.index)
                    }
                    {...props}
                />
            ),
            className: 'text-center',
        },
    ];

    // Get form data
    useEffect(() => {
        API.get('Subscription/GetFormData').then((r) => {
            setForm((prevForm) => ({
                ...prevForm,
                subscriptionProducts: formatProducts(r.data.products, isWatching),
            }));
        });
        if (id) {
            API.get('Subscription/GetOneById', { id }).then((r) => {
                setForm((prevForm) => {
                    const newSubscriptionProducts = prevForm.subscriptionProducts.map((x) => {
                        const product = r.data.subscriptionProducts.find((p) => p.id === x.id);
                        if (product) return { ...x, quantity: product.quantity };
                        return { ...x };
                    });
                    return {
                        ...r.data,
                        subscriptionProducts: [...newSubscriptionProducts],
                    };
                });
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

    const handleInputChange = (value, field, rowIdx) => {
        if (!rowIdx && rowIdx != 0) {
            setForm((prevForm) => {
                return {
                    ...prevForm,
                    [field]: value,
                };
            });
        } else {
            setForm((prevForm) => {
                const updatedFields = [...prevForm[field]];
                updatedFields[rowIdx] = {
                    ...updatedFields[rowIdx],
                    quantity: parseInt(value),
                };
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
            <BreadCrumb items={breadcrumbItems} title='Abonos' />
            <ChangePasswordModal ref={modalRef} />
            <Col xs={12} className='row mx-auto px-2'>
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
                                            onChange={(value) => handleInputChange(value, 'name')}
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
                                            onChange={(value) => handleInputChange(value, 'price')}
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
                                <>
                                    <Row className='align-items-center'>
                                        <Col xs={12}>
                                            <Table
                                                rows={form.subscriptionProducts}
                                                columns={columns}
                                            ></Table>
                                        </Col>
                                    </Row>
                                </>
                            )
                        }
                    ></Card>
                </Col>
            </Col>
        </>
    );
};

export default CreateSubscription;
