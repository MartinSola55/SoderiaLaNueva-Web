import { Button, Col, Row } from 'react-bootstrap';
import { BreadCrumb, Card, Input, Table, TableSort, Toast } from '../../components';
import { useCallback, useEffect, useRef, useState } from 'react';
import API from '../../app/API';
import { useNavigate } from 'react-router';
import { Messages } from '../../constants/Messages';
import App from '../../app/App';
import { buildGenericGetAllRq, Dates, formatCurrency } from '../../app/Helpers';
import TableFilters from '../../components/shared/TableFilters/TableFilters';
import ExpenseModal from './ExpenseModal';
import ActionButtonsExpense from './ActionButtonsExpenses/ActionButtonsExpense';

const breadcrumbItems = [
    {
        active: true,
        label: 'Gastos',
    },
];

const ExpenseList = () => {
    // Consts
    const columns = [
        {
            name: 'description',
            text: 'Descripción',
            textCenter: true,
        },
        {
            name: 'amount',
            text: 'Monto',
            textCenter: true,
        },
        {
            name: 'createdAt',
            text: 'Fecha',
            textCenter: true,
        },
        {
            name: 'actions',
            text: 'Acciones',
            component: (props) => (
                <ActionButtonsExpense onEdit={handleOpenExpense} entity='gasto' {...props} />
            ),
            className: 'text-center',
        },
    ];

    const sortExpenseItems = [
        { value: 'createdAt-asc', label: 'Creado - Asc.' },
        { value: 'createdAt-desc', label: 'Creado - Desc.' },
    ];

    const navigate = useNavigate();

    //States
    const [rows, setRows] = useState([]);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(null);
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [submiting, setSubmiting] = useState(false);

    // Refs
    const expenseRef = useRef(null);

    // Handlers
    const handleFilterRows = (value) => {
        setFilter(value.toLowerCase());
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSortChange = ({ column, direction }) => {
        setSort({ column, direction });
    };

    const handleResetFilters = () => {
        setDateRange(null);
    };

    const handleSubmit = async (expense, id) => {
        if (submiting) return;

        if (!expense.dealerId || !expense.description || !expense.amount) {
            Toast.warning(Messages.Validation.requiredFields);
            return;
        }

        if (expense.amount && expense.amount <= 0) {
            Toast.warning('El monto debe ser superior a cero.');
            return;
        }

        setSubmiting(true);

        const rq = {
            dealerId: expense.dealerId,
            description: expense.description,
            amount: expense.amount,
        };

        if (id) {
            rq.id = id;
        }

        API.post(`Expense/${id ? 'Update' : 'Create'}`, rq)
            .then((r) => {
                Toast.success(r.message);
                expenseRef.current?.close();
                getExpenses();
            })
            .catch((r) => {
                Toast.error(r.error.message);
            })
            .finally(() => {
                setSubmiting(false);
            });
    };

    const handleOpenExpense = (id, isWatching) => {
        const row = rows.find((r) => r.id === id);
        const expense = {
            dealerId: row.dealerId,
            description: row.description,
            amount: parseFloat(row.amount.replace(/[^0-9,]/g, '').replace(',', '.')),
        };
        expenseRef.current.open(
            (v) => handleSubmit(v, id),
            () => { },
            expense,
            isWatching ? 'Ver' : 'Editar',
            isWatching,
        );
    };

    const getExpenses = useCallback(() => {
        const rq = buildGenericGetAllRq(sort, currentPage, dateRange);

        API.post('Expense/GetAll', rq).then((r) => {
            setTotalCount(r.data.totalCount);
            setRows(
                r.data.expenses.map((expense) => {
                    return {
                        id: expense.id,
                        description: expense.description,
                        amount: formatCurrency(expense.amount),
                        createdAt: expense.createdAt,
                        dealerId: expense.dealerId,
                        endpoint: 'Expense',
                    };
                }),
            );
            if (r.data.expenses.length === 0) {
                Toast.warning(Messages.Error.noRows);
            }
        });
    }, [currentPage, dateRange, sort]);

    const updateDeletedRow = (id) => {
        setRows((prevRow) => prevRow.filter((row) => row.id !== id));
    };

    // Effects
    useEffect(() => {
        if (!App.isAdmin()) {
            return navigate('/notAllowed');
        }
    }, [navigate]);

    useEffect(() => {
        getExpenses();
    }, [currentPage, dateRange, getExpenses, sort]);

    return (
        <>
            <BreadCrumb items={breadcrumbItems} title='Gastos' />
            <ExpenseModal disabled={submiting} ref={expenseRef} />
            <div>
                <Col xs={11} className='container'>
                    <Card
                        title='Gastos'
                        body={
                            <>
                                <Row>
                                    <Col xs={12} sm={6} lg={3} className='mb-3'>
                                        <TableSort
                                            items={sortExpenseItems}
                                            onChange={handleSortChange}
                                        />
                                    </Col>
                                    <TableFilters
                                        dateRange={dateRange}
                                        onRangeChange={setDateRange}
                                        onReset={handleResetFilters}
                                    />
                                    <Col xs={12} className='pe-3 mb-3'>
                                        <Input
                                            borderless
                                            placeholder='Buscar'
                                            helpText='Descrición'
                                            value={filter}
                                            onChange={handleFilterRows}
                                        />
                                    </Col>
                                </Row>
                                <Table
                                    className='mb-5'
                                    columns={columns}
                                    rows={rows.filter((r) =>
                                        r.description.toLowerCase().includes(filter),
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
                                <Button
                                    onClick={() => {
                                        expenseRef.current.open(
                                            (v) => handleSubmit(v, null),
                                            () => { },
                                            null,
                                            'Agregar',
                                            false,
                                        );
                                    }}
                                    variant='primary'
                                >
                                    Nuevo gasto
                                </Button>
                            </div>
                        }
                    ></Card>
                </Col>
            </div>
        </>
    );
};

export default ExpenseList;
