import React from 'react';

const AdminPagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md ${
          currentPage === 1
            ? 'bg-[#efe9e0] text-gray-400 cursor-not-allowed'
            : 'bg-[#5b3f15] text-white hover:bg-[#bd8837] transition-colors'
        }`}
      >
        Previous
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md ${
            currentPage === page
              ? 'bg-[#5b3f15] text-white'
              : 'bg-[#efe9e0] text-[#5b3f15] hover:bg-[#bd8837] hover:text-white transition-colors'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md ${
          currentPage === totalPages
            ? 'bg-[#efe9e0] text-gray-400 cursor-not-allowed'
            : 'bg-[#5b3f15] text-white hover:bg-[#bd8837] transition-colors'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default AdminPagination; 