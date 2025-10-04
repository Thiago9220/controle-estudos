import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
      >
        Anterior
      </button>
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 mx-1 rounded-lg ${currentPage === number ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 mx-1 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
      >
        Próximo
      </button>
    </div>
  );
};

export default Pagination;
