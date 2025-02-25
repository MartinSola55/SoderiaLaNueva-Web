import { useEffect } from "react";
import * as BS from "react-bootstrap";
import classNames from "classnames";

import "./pagination.scss";

const Pagination = ({
	totalCount = 0,
	itemsPerPage = 10,
	currentPage = 1,
	setCurrentPage = () => { },
}) => {

	const pagesCount = Math.ceil(totalCount / itemsPerPage);
	const isPaginationShown = pagesCount > 1;
	const isCurrentPageFirst = currentPage === 1;
	const isCurrentPageLast = currentPage === pagesCount;

	const changePage = number => {
		if (currentPage === number) return;
		setCurrentPage(number);
	};

	const onPageNumberClick = pageNumber => {
		changePage(pageNumber);
	};

	const onPreviousPageClick = () => {
		if (currentPage <= 1) {
			return changePage(1);
		} else {
			changePage(currentPage => currentPage - 1);
		}

	};

	const onNextPageClick = () => {
		changePage(currentPage => currentPage + 1);
	};

	const setLastPageAsCurrent = () => {
		if (currentPage > pagesCount) {
			pagesCount && setCurrentPage(pagesCount);
		}
	};

	let isPageNumberOutOfRange;

	const pageNumbers = [...new Array(pagesCount)].map((_, index) => {
		const pageNumber = index + 1;
		const isPageNumberFirst = pageNumber === 1;
		const isPageNumberLast = pageNumber === pagesCount;
		const isCurrentPageWithinTwoPageNumbers =
			Math.abs(pageNumber - currentPage) <= 2;

		if (
			isPageNumberFirst ||
			isPageNumberLast ||
			isCurrentPageWithinTwoPageNumbers
		) {
			isPageNumberOutOfRange = false;
			return (
				<BS.Pagination.Item
					key={pageNumber}
					activeLabel=""
					className="custom-pagination-item"
					onClick={() => onPageNumberClick(pageNumber)}
					active={pageNumber === currentPage}
				>
					{pageNumber}
				</BS.Pagination.Item>
			);
		}

		if (!isPageNumberOutOfRange) {
			isPageNumberOutOfRange = true;
			return <BS.Pagination.Ellipsis key={pageNumber} className="muted custom-pagination-item" />;
		}

		return null;
	});

	useEffect(setLastPageAsCurrent, [currentPage, pagesCount, setCurrentPage]);

	return (
		<>
			{isPaginationShown && (
				<BS.Pagination>
					<BS.Pagination.Prev
						className={classNames('custom-pagination-item', isCurrentPageFirst ? "disable" : "")}
						onClick={onPreviousPageClick}
						disabled={isCurrentPageFirst}
					/>
					{pageNumbers}
					<BS.Pagination.Next
						className={classNames('custom-pagination-item', isCurrentPageFirst ? "disable" : "")}
						onClick={onNextPageClick}
						disabled={isCurrentPageLast}
					/>
				</BS.Pagination>
			)}
		</>
	);
};

export default Pagination;