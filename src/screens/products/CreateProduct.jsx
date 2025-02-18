import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, Input, Label, Loader, ProductTypesDropdown, Spinner } from '../../components';
import { Messages } from '../../constants/Messages';
import { InitialFormStates } from '../../app/InitialFormStates';
import { getBreadcrumbItems, saveProduct } from './Products.helpers';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import App from '../../app/App';

const CreateProduct = ({ isWatching = false }) => {
    const navigate = useNavigate();

    const params = useParams();
    const id = params.id;

    // State
    const [form, setForm] = useState(InitialFormStates.Product);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);

    // Effects
    useEffect(() => {
        if (id) {
            API.get('product/getOneById', { id })
                .then((r) => {
                    setForm(r.data);
                    setLoading(false);
                })
                .catch(() => {
                    navigate('/notFound');
                });
        }
    }, [id, navigate]);

    // Handlers
    const handleSubmit = async () => {
        if (submitting) return;

        if (!form.name || !form.price || !form.typeId) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmitting(true);
        saveProduct(form, id,
            () => { navigate('/productos/list') },
            () => { setSubmitting(false) }
        );
    };

    const handleInputChange = (value, field) => {
        setForm((prevForm) => {
            return {
                ...prevForm,
                [field]: value,
            };
        });
    };

    // Render
    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    return (
        <>
            <BreadCrumb items={getBreadcrumbItems(id ? 'Editar' : 'Nuevo')} title='Productos' />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Producto'
                        body={loading ? <Spinner /> :
                            <>
                                <Row className='align-items-center'>
                                    <Col xs={12} md={4} className='pe-3 mb-3'>
                                        <Label required={!isWatching}>Nombre del producto</Label>
                                        <Input
                                            disabled={isWatching}
                                            placeholder='Nombre'
                                            value={form.name}
                                            onChange={(value) => handleInputChange(value, 'name')}
                                        />
                                    </Col>
                                    <Col xs={12} md={4} className='pe-3 mb-3'>
                                        <Label required={!isWatching}>Precio</Label>
                                        <Input
                                            disabled={isWatching}
                                            numeric
                                            isFloat
                                            placeholder='Precio'
                                            type='number'
                                            value={form.price}
                                            onChange={(value) => handleInputChange(value, 'price')}
                                        />
                                    </Col>
                                    <Col xs={12} md={4} className='pe-3 mb-3'>
                                        <Label required={!isWatching}>Tipo</Label>
                                        <ProductTypesDropdown
                                            disabled={isWatching}
                                            placeholder='Seleccione un tipo'
                                            required
                                            value={form.typeId}
                                            onChange={(value) => handleInputChange(value, 'typeId')}
                                        />
                                    </Col>
                                </Row>
                            </>
                        }
                        footer={
                            <div className='d-flex justify-content-end'>
                                <Button
                                    variant='secondary'
                                    className='me-2'
                                    onClick={() => navigate('/productos/list')}
                                >
                                    Volver
                                </Button>
                                {!isWatching && (
                                    <Button onClick={handleSubmit} disabled={submitting}>
                                        {submitting ? <Loader /> : id ? 'Actualizar' : 'Crear'}
                                    </Button>
                                )}
                            </div>
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default CreateProduct;
