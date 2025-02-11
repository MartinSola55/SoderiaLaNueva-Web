import { Col, Row } from 'react-bootstrap';
import {
	ActionButtons,
    BreadCrumb,
    Button,
    Card,
    Input,
    Table,
    TableSort,
    Toast,
} from '../../components';
import { useEffect, useState } from 'react';
import API from '../../app/API';
import { Roles } from '../../constants/Roles';
import { useNavigate } from 'react-router';
import { Messages } from '../../constants/Messages';
import App from '../../app/App';
import { buildGenericGetAllRq } from '../../app/Helpers';
import { columns, sortUserItems } from './User.data';

const breadcrumbItems = [
    {
        active: true,
        label: 'Usuarios',
    },
];

const userColumns = [
	...columns,
	{
		name: 'actions',
		text: 'Acciones',
		component: (props) => < ActionButtons entity='usuario' {...props} />,
		className: 'text-center',
	},
];

const UserList = () => {
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(null);

    const handleFilterRows = (value) => {
        setFilter(value.toLowerCase());
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }) => {
        setSort({ column, direction });
    };

    useEffect(() => {
        if (!App.isAdmin()) {
            return navigate('/notAllowed');
        }
    }, [navigate]);

    useEffect(() => {
        const rq = buildGenericGetAllRq(sort, currentPage);

        rq.roles = [Roles.Admin, Roles.Dealer];

        API.post('User/GetAll', rq).then((r) => {
            setTotalCount(r.data.totalCount);
            setRows(
                r.data.users.map((user) => {
                    return {
                        id: user.id,
                        email: user.email,
                        fullName: user.fullName,
                        endpoint: 'User',
                        createdAt: user.createdAt,
                        role: user.role,
                        phoneNumber: user.phoneNumber,
                    };
                }),
            );
            if (r.data.users.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, sort]);

    const updateDeletedRow = (id) => {
        setRows((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Usuarios' />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Usuarios'
                        body={
                            <>
                                <Row>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <TableSort
                                            items={sortUserItems}
                                            onChange={handleSortChange}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6} lg={4} className='pe-3 mb-3'>
                                        <Input
                                            showIcon
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
                                    columns={userColumns}
                                    rows={rows.filter(
                                        (r) =>
                                            r.fullName.toLowerCase().includes(filter) ||
                                            r.email.toLowerCase().includes(filter),
                                    )}
                                    pagination={true}
                                    currentPage={currentPage}
                                    totalCount={totalCount}
                                    onPageChange={handlePageChange}
                                    onUpdate={updateDeletedRow}
                                />
                            </>
                        }
                        footer={
                            <div className='d-flex justify-content-end'>
                                <Button onClick={() => navigate('/usuarios/new')} variant='primary'>
                                    Nuevo usuario
                                </Button>
                            </div>
                        }
                    />
                </Col>
            </div>
        </>
    );
};

export default UserList;
