import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Button, Card, ChangePasswordModal, Input, Label, Loader, RolesDropdown, Spinner, } from '../../components';
import { useEffect, useRef, useState } from 'react';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { Messages } from '../../constants/Messages';
import { InitialFormStates } from '../../app/InitialFormStates';
import { useNavigate, useParams } from 'react-router';
import { Dates } from '../../app/Helpers';
import App from '../../app/App';

const initialForm = InitialFormStates.User;

const CreateUser = ({ isWatching = false, isEditing = false, viewProfileDetails = false }) => {
    const navigate = useNavigate();

    const modalRef = useRef();
    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(id ? true : false);

    const breadcrumbItems = [
        {
            active: true,
            label: isWatching ? 'Ver' : id ? 'Editar' : viewProfileDetails ? 'Mi perfil' : 'Nuevo',
        },
    ];

    if (!viewProfileDetails) {
        breadcrumbItems.unshift({
            active: false,
            url: '/usuarios/list',
            label: 'Usuarios',
        });
    }

    // Get form data
    useEffect(() => {
        if (id) {
            API.get('user/getOneById', { id })
                .then((r) => {
                    setForm(() => ({
                        ...r.data,
                        date: Dates.getTomorrow(r.data.date),
                        phoneNumber: r.data.phoneNumber || '',
                    }));
                    setLoading(false);
                })
                .catch(() => {
                    navigate('/notFound');
                });
        }
    }, [id, navigate, viewProfileDetails]);

    const handleSubmit = async () => {
        if (submitting) return;

        if (
            !form.fullName ||
            !form.email ||
            (!form.password && !viewProfileDetails && !isEditing) ||
            (!form.phoneNumber && !viewProfileDetails) ||
            (!form.role && !viewProfileDetails)
        ) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmitting(true);

        const rq = {
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            phoneNumber: form.phoneNumber,
            roleId: form.role,
        };

        if (id) {
            rq.id = id;
        }

        API.post(`user/${id ? 'update' : 'create'}`, rq)
            .then((r) => {
                Toast.success(r.message);
                navigate('/usuarios/list');
            })
            .catch((r) => {
                Toast.error(r.error?.message);
            })
            .finally(() => {
                setSubmitting(false);
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
    const handleChangePassword = () => {
        modalRef.current.open(id);
    };

    if (!App.isAdmin() && !viewProfileDetails) {
        return navigate('/notAllowed');
    }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Usuarios' />
            <ChangePasswordModal ref={modalRef} />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Usuario'
                        body={
                            loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <Row className='align-items-center'>
                                        <Col xs={12} md={4} className='pe-3 mb-3'>
                                            <Label required>Nombre completo</Label>
                                            <Input
                                                disabled={isWatching || viewProfileDetails}
                                                placeholder='Nombre completo'
                                                value={form.fullName}
                                                onChange={(value) =>
                                                    handleInputChange(value, 'fullName')
                                                }
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className='pe-3 mb-3'>
                                            <Label required>Número de teléfono</Label>
                                            <Input
                                                disabled={isWatching}
                                                numeric
                                                isPhone
                                                placeholder='Número de teléfono'
                                                value={form.phoneNumber}
                                                onChange={(value) =>
                                                    handleInputChange(value, 'phoneNumber')
                                                }
                                            />
                                        </Col>
                                        <Col xs={12} md={4} className='pe-3 mb-3'>
                                            <Label required>Rol</Label>
                                            <RolesDropdown
                                                disabled={isWatching || viewProfileDetails}
                                                placeholder='Seleccione un rol'
                                                required
                                                value={form.role}
                                                onChange={(value) => handleInputChange(value, 'role')}
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={6} className='pe-3 mb-3'>
                                            <Label required>Email</Label>
                                            <Input
                                                disabled={isWatching || viewProfileDetails}
                                                type='email'
                                                placeholder='Email'
                                                value={form.email}
                                                onChange={(value) =>
                                                    handleInputChange(value, 'email')
                                                }
                                            />
                                        </Col>
                                        {!viewProfileDetails && !id && (
                                            <Col xs={12} md={6} className='pe-3 mb-3'>
                                                <Label required>Contraseña</Label>
                                                <Input
                                                    disabled={isWatching}
                                                    placeholder='Contraseña'
                                                    type='password'
                                                    value={form.password}
                                                    onChange={(value) =>
                                                        handleInputChange(value, 'password')
                                                    }
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                </>
                            )
                        }
                        footer={
                            !isWatching && (
                                <div className='d-flex justify-content-end'>
                                    {id && (
                                        <Button
                                            onClick={handleChangePassword}
                                            className='me-auto'
                                            style={{
                                                backgroundColor: 'rgb(143, 162, 188)',
                                                borderColor: 'rgb(143, 162, 188)',
                                            }}
                                        >
                                            Cambiar contraseña
                                        </Button>
                                    )}
                                    <Button onClick={handleSubmit} disabled={submitting}>
                                        {submitting ? <Loader /> : id ? 'Actualizar' : 'Enviar'}
                                    </Button>
                                </div>
                            )
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default CreateUser;
