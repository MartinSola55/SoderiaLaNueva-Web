import { Col, Row } from "react-bootstrap";
import { BreadCrumb, Button, Card, ChangePasswordModal, Dropdown, Input, Label, Loader, Spinner } from "../../components";
import { useEffect, useRef, useState } from "react";
import Toast from "../../components/Toast/Toast";
import API from "../../app/API";
import { Messages } from "../../constants/Messages";
import { InitialFormStates } from "../../app/InitialFormStates";
import { useNavigate, useParams } from "react-router";
import App from "../../app/App";
import { formatTypes } from "../../app/Helpers";

const initialForm = InitialFormStates.User;

const CreateProduct = ({ isWatching = false }) => {
    const navigate = useNavigate();

    const modalRef = useRef();
    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(initialForm);
    const [submiting, setSubmiting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);
    const [types, setTypes] = useState([]);

    const breadcrumbItems = [
        {
            active: false,
            url: '/productos/list',
            label: 'Productos',
        },
        {
            active: true,
            label: isWatching ? 'Ver' : 'Editar'
        }
    ];

    // Get form data
    useEffect(() => {
        API.get('Product/GetFormData')
            .then((r) => {
                setTypes(formatTypes(r.data.productTypes));
            });
        if (id) {
            API.get('Product/GetOneById', { id })
                .then((r) => {
                    setForm(() => ({
                        ...r.data,
                    }));
                    setLoading(false);
                })
        }
    }, [id]);


    const handleSubmit = async () => {
        if (submiting)
            return;

        if (!form.name || !form.price || !form.typeId) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmiting(true);

        const rq = {
            name: form.name,
            price: form.price,
            typeId: form.typeId,
        }

        if (id) {
            rq.id = id;
        }

        API.post(`Product/${id ? 'Update' : 'Create'}`, rq)
            .then((r) => {
                Toast.success(r.message);
                navigate('/productos/list');
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
            return ({
                ...prevForm,
                [field]: value,
            });
        });
    };

    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title="Productos" />
            <ChangePasswordModal ref={modalRef} />
            <div>
                <Col xs={11} className="container">
                    <Card
                        title="Producto"
                        body={(
                            loading ? <Spinner /> : (
                                <>
                                    <Row className="align-items-center">
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Nombre del producto</Label>
                                            <Input
                                                disabled={isWatching}
                                                placeholder="Nombre"
                                                value={form.name}
                                                onChange={(value) => handleInputChange(value, 'name')}
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Precio</Label>
                                            <Input
                                                disabled={isWatching}
                                                numeric
                                                isFloat
                                                placeholder="Precio"
                                                type="number"
                                                value={form.price}
                                                onChange={(value) => handleInputChange(value, 'price')}
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className="pe-3 mb-3">
                                            <Label required>Tipo</Label>
                                            <Dropdown
                                                disabled={isWatching}
                                                placeholder="Seleccione un tipo"
                                                required
                                                items={types}
                                                value={form.typeId}
                                                onChange={(option) => handleInputChange(option.value, 'typeId')}
                                            />
                                        </Col>
                                    </Row>
                                </>
                            )
                        )}
                        footer={
                            <div className="d-flex justify-content-end">
                                <Button variant="secondary" className="me-2" onClick={() => navigate('/productos/list')}>
                                    Volver
                                </Button>
                                {!isWatching && (
                                    <Button onClick={handleSubmit} disabled={submiting}>
                                        {submiting ? <Loader /> : id ? 'Actualizar' : 'Crear'}
                                    </Button>
                                )}
                            </div>
                        }
                    >
                    </Card>
                </Col >
            </div>
        </>
    );
};

export default CreateProduct;