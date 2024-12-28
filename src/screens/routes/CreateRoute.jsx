import { Col, Row } from 'react-bootstrap';
import { BreadCrumb, Card, Input, Table } from '../../components';
import { useEffect, useRef, useState } from 'react';
import Toast from '../../components/Toast/Toast';
import API from '../../app/API';
import { Messages } from '../../constants/Messages';
import { InitialFormStates } from '../../app/InitialFormStates';
import { useNavigate, useParams } from 'react-router';
import App from '../../app/App';
import { buildGenericGetAllRq } from '../../app/Helpers';
import { Roles } from '../../constants/Roles';
import RouteModal from './RouteModal';

const initialForm = InitialFormStates.StaticRoute;

const CreateRoute = () => {
    const columns = [
        {
            name: 'fullName',
            text: 'Nombre y apellido',
            textCenter: true,
        },
        {
            name: 'email',
            text: 'Email',
            textCenter: true,
        },
    ];

    const navigate = useNavigate();

    const modalRef = useRef();
    const params = useParams();
    const id = (params && params.id) || null;

    const [form, setForm] = useState(initialForm);
    const [submiting, setSubmiting] = useState(false);
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const breadcrumbItems = [
        {
            active: false,
            url: '/planillas/list',
            label: 'Planillas',
        },
        {
            active: true,
            label: 'Nuevo',
        },
    ];

    // Get form data
    useEffect(() => {
        const rq = buildGenericGetAllRq(null, currentPage);

        rq.roles = [Roles.Dealer];

        API.post('User/GetAll', rq).then((r) => {
            setTotalCount(r.data.totalCount);
            setRows(
                r.data.users.map((user) => {
                    return {
                        email: user.email,
                        fullName: user.fullName,
                        href: JSON.stringify({ id: user.id, fullName: user.fullName }),
                    };
                }),
            );
            if (r.data.users.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage]);

    const handleSubmit = async (form) => {
        if (submiting) return;

        if (!form.deliveryDay || !form.dealerId) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        setSubmiting(true);

        const rq = {
            deliveryDay: form.deliveryDay,
            dealerId: form.dealerId,
        };

        if (id) {
            rq.id = id;
        }

        API.post(`Route/${id ? 'Update' : 'CreateStaticRoute'}`, rq)
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

    const handleInputChange = (value, field) => {
        setForm((prevForm) => {
            return {
                ...prevForm,
                [field]: value,
            };
        });
    };

    const hanldeSelectRow = (v) => {
        const value = JSON.parse(v);

        handleInputChange(value.id, 'dealerId');
        modalRef.current?.open(
            (form) => handleSubmit(form),
            () => {},
            (v, n) => {
                handleInputChange(v, n);
            },
            value.fullName,
        );
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterRows = (value) => {
        setFilter(value.toLowerCase());
    };

    if (!App.isAdmin()) {
        return navigate('/notAllowed');
    }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Planillas' />
            <RouteModal ref={modalRef} form={form} />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Listado de repartidores'
                        body={
                            <>
                                <Row>
                                    <Col xs={12} className='pe-3 mb-3'>
                                        <Input
                                            borderless
                                            placeholder='Buscar'
                                            helpText='Nombre de usuario o email'
                                            value={filter}
                                            onChange={handleFilterRows}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    className='mb-5'
                                    columns={columns}
                                    rows={rows.filter(
                                        (r) =>
                                            r.fullName.toLowerCase().includes(filter) ||
                                            r.email.toLowerCase().includes(filter),
                                    )}
                                    clickable={true}
                                    pagination={true}
                                    currentPage={currentPage}
                                    totalCount={totalCount}
                                    onPageChange={handlePageChange}
                                    onRowClick={(_, v) => hanldeSelectRow(v)}
                                />
                            </>
                        }
                    ></Card>
                </Col>
            </div>
        </>
    );
};

export default CreateRoute;
