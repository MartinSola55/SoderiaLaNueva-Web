import { Col, Row } from 'react-bootstrap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { buildGenericGetAllRq, formatCurrency } from '@app/Helpers';
import { ActionButtons, BreadCrumb, Button, Card, ExpenseModal, Input, Table, TableFilters, TableSort, Toast } from '@components';
import API from '@app/API';
import { Messages } from '@constants/Messages';

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
			name: 'dealerName',
			text: 'Repartidor',
			textCenter: true,
		},
		{
			name: 'description',
			text: 'Descripción',
			textCenter: true,
		},
		{
			name: 'amount',
			text: 'Monto',
			textCenter: true,
			formatter: formatCurrency,
		},
		{
			name: 'createdAt',
			text: 'Fecha',
			textCenter: true,
		},
		{
			name: 'actions',
			text: 'Acciones',
			component: (props) =>
				<ActionButtons
					navigateTo={false}
					entity='gasto'
					onEdit={(id) => handleOpenExpense(id, false)}
					onWatch={(id) => handleOpenExpense(id, true)}
					{...props} />,
			className: 'text-center',
		},
	];

	const sortExpenseItems = [
		{ value: 'createdAt-asc', label: 'Fecha - Asc.' },
		{ value: 'createdAt-desc', label: 'Fecha - Desc.' },
	];

	//States
	const [rows, setRows] = useState([]);
	const [filter, setFilter] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [sort, setSort] = useState(null);
	const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });

	// Refs
	const expenseModalRef = useRef(null);

	// Handlers
	const handleFilterRows = (value) => {
		setFilter(value);
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

	const handleOpenExpense = (id, isWatching) => {
		const row = rows.find((r) => r.id === id);
		const expense = {
			id: row.id,
			dealerId: row.dealerId,
			description: row.description,
			amount: row.amount,
		};
		expenseModalRef.current.open(
			() => getExpenses(),
			expense,
			isWatching ? 'Ver' : 'Editar',
			isWatching,
		);
	};

	const handleAddExpense = () => {
		expenseModalRef.current.open(
			() => getExpenses(),
			null,
			'Agregar',
			false,
		);
	};

	const getExpenses = useCallback(() => {
		const rq = buildGenericGetAllRq(sort, currentPage, dateRange);

		API.post('expense/getAll', rq).then((r) => {
			setTotalCount(r.data.totalCount);
			setRows(
				r.data.expenses.map((expense) => {
					return {
						...expense,
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
		getExpenses();
	}, [currentPage, dateRange, getExpenses, sort]);

	return (
		<>
			<BreadCrumb items={breadcrumbItems} title='Gastos' />
			<ExpenseModal ref={expenseModalRef} />
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
									<Col xs={12} sm={6} lg={4} className='pe-3 mb-3'>
										<Input
											borderless
											placeholder='Buscar'
											helpText='Descripción o repartidor'
											value={filter}
											onChange={handleFilterRows}
										/>
									</Col>
								</Row>
								<Table
									className='mb-5'
									columns={columns}
									rows={rows.filter((x) =>
										x.description.toLowerCase().includes(filter.toLowerCase())
										|| x.dealerName.toLowerCase().includes(filter.toLowerCase())
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
									onClick={handleAddExpense}
									variant='primary'
								>
									Nuevo gasto
								</Button>
							</div>
						}
					/>
				</Col>
			</div>
		</>
	);
};

export default ExpenseList;
