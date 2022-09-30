import React, { Dispatch, SetStateAction } from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from '../Hooks/usePagination';
import './index.scss';
const Pagination = ({
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
}: {
    onPageChange: Dispatch<SetStateAction<number>>,
    totalCount: number,
    siblingCount: number,
    currentPage: number,
    pageSize: number,
    className: string
}) => {

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={classnames('pagination-container', { [className]: className })}
    >
      <li
        className={classnames('pagination-item', {
          disabled: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>
      {paginationRange.map((pageNumber: (string|number), idx: number) => {
        if (pageNumber === DOTS) {
          return <li className="pagination-item dots" key={idx}>&#8230;</li>;
        }

        if(typeof pageNumber === 'number') {
            return (
              <li
                className={classnames('pagination-item', {
                  selected: pageNumber === currentPage
                })}
                key={idx}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </li>
            );
        }
      })}
      <li
        className={classnames('pagination-item', {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
    </ul>
  );
};

export default Pagination;
