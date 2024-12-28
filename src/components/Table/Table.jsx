import * as BS from 'react-bootstrap';
import classNames from 'classnames';
import Pagination from '../Pagination/Pagination';

import './table.scss';

const Table = ({
    columns,
    rows,
    className = '',
    clickable = false,
    pagination = false,
    totalCount = 0,
    currentPage = 1,
    onRowClick = () => {},
    onCellClick = () => {},
    onPageChange = () => {},
    onUpdate = () => {},
}) => {
    const handlePageChange = (page) => {
        onPageChange(page);
    };

    const handleCellClick = (e) => {
        e.stopPropagation();
        onCellClick(e);
    };

    const handleRowClick = (e) => {
        if (!clickable) return;

        onRowClick(e, e.target.closest('tr').getAttribute('data-href'));
    };

    const handleColClick = (e, canClick) => {
        if (!canClick) return;

        onRowClick(e, e.target.closest('tr').getAttribute('data-href'));
    };

    return (
        <div className={`table-responsive px-1`}>
            <BS.Table className={`table-bordered table-striped table-hover  ${className} `}>
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
                                    <strong>{col.text}</strong>
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody className=''>
                    {rows &&
                        rows.map((row, i) => (
                            <tr
                                key={i}
                                style={row.style}
                                data-href={row.href}
                                className={`${clickable ? 'clickable-row' : ''} ${row.isSelected ? 'selected-row' : ''}`}
                                onClick={handleRowClick}
                            >
                                {columns &&
                                    columns.map((col, j) => {
                                        const isClickable = col.clickableColumn
                                            ? 'clickable-row'
                                            : '';

                                        return (
                                            <td
                                                key={j}
                                                className={`${col.className || ''} ${isClickable}`}
                                                onClick={(e) =>
                                                    handleColClick(e, col.clickableColumn)
                                                }
                                            >
                                                {!col.component ? (
                                                    col.list ? (
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
                                                    ) : (
                                                        row[col.name]
                                                    )
                                                ) : (
                                                    <col.component
                                                        row={row}
                                                        disabled={row.disabled}
                                                        onClick={handleCellClick}
                                                        onUpdate={onUpdate}
                                                    />
                                                )}
                                            </td>
                                        );
                                    })}
                            </tr>
                        ))}
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
