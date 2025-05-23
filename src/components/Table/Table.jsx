import * as BS from 'react-bootstrap';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination } from '@components';

import './table.scss';

const Table = ({
	columns,
	rows = [],
	className = '',
	emptyTableMessage = '',
	clickable = false,
	pagination = false,
	bordered = true,
	striped = true,
	hover = true,
	loading = false,
	totalCount = 0,
	currentPage = 1,
	onRowClick = () => { },
	onCellClick = () => { },
	onPageChange = () => { },
	onUpdate = () => { },
}) => {
	const handlePageChange = (page) => {
		onPageChange(page);
	};
	const handleCellClick = (e) => {
		e.stopPropagation();
		onCellClick(e);
	};

	const handleRowClick = (e) => {
		if (!clickable)
			return;

		onRowClick(e, e.target.closest('tr').getAttribute('data-href'));
	};

	const handleColClick = (e, canClick) => {
		if (!canClick) return;

		onRowClick(e, e.target.closest('tr').getAttribute('data-href'));
	};

	const tableClassNames = classNames(
		'table',
		bordered && 'table-bordered',
		striped && 'table-striped',
		hover && 'table-hover',
		className
	);

	return (
		<div className={`table-responsive px-1`}>
			<BS.Table className={tableClassNames}>
				<thead>
					<tr>
						{columns &&
							columns.map((col, i) => (
								<th
									key={i}
									className={classNames(
										col.textCenter && 'text-center',
										col.className,
									)}
								>
									{col.bold ? <strong>{col.text}</strong> : col.text}
								</th>
							))}
					</tr>
				</thead>
				<tbody>
					{(rows.length && !loading) ? rows.map((row, i) => (
						<tr
							key={i}
							style={row.style}
							data-href={row.href}
							className={classNames({
								'clickable-row': clickable,
								'selected-row': row.isSelected,
								'inactive': row.isActive === false
							})}
							onClick={handleRowClick}
						>
							{columns && columns.map((col, j) => {
								const isClickable = col.clickableColumn
									? 'clickable-row'
									: '';

								if (col.name === 'icon')
									return (
										<td key={j} className={classNames(col.className, { [isClickable]: isClickable })}>
											<span className='table-icon-container'><FontAwesomeIcon icon={col.icon} /></span>
										</td>
									);

								return (
									<td
										key={j}
										className={classNames(col.className, { [isClickable]: isClickable })}
										onClick={(e) => handleColClick(e, col.clickableColumn)}
									>
										{!col.component ? (
											col.list ?
												<ul
													className='mb-0'
													style={{
														maxHeight: '100px',
														overflowY: 'auto',
													}}
												>
													{row[col.name].map((item, k) => (
														<li key={k}>{item}</li>
													))}
												</ul>
												: col.boldRow
													? <h6 className='mb-0'>{col.formatter ? col.formatter(row[col.name], row) : row[col.name]}</h6>
													: col.formatter
														? col.formatter(row[col.name], row)
														: row[col.name]
										) : 
											col.component({row, disabled: row.disabled, onClick: handleCellClick, onUpdate})
										}
									</td>
								);
							})}
						</tr>
					)) : null}
					{rows.length === 0 && emptyTableMessage && !loading &&
						<tr>
							<td colSpan={columns.length} className='text-start'>{emptyTableMessage}</td>
						</tr>
					}
					{loading && (
						<tr>
							<td colSpan={columns.length} className='text-center'>
								<span className="loader"></span>
							</td>
						</tr>
					)}
				</tbody>
			</BS.Table>
			{pagination && rows && (
				<div className='d-flex justify-content-end'>
					<Pagination
						currentPage={currentPage}
						totalCount={totalCount}
						setCurrentPage={handlePageChange}
					/>
				</div>
			)}
		</div>
	);
};

export default Table;
