import { Link } from 'react-router-dom';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg ${
          currentPage === 1
            ? 'bg-[#efe9e0] text-[#bd8837] cursor-not-allowed'
            : 'bg-[#5b3f15] text-white hover:bg-[#bd8837]'
        }`}
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page
              ? 'bg-[#5b3f15] text-white'
              : 'bg-[#efe9e0] text-[#5b3f15] hover:bg-[#bd8837] hover:text-white'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg ${
          currentPage === totalPages
            ? 'bg-[#efe9e0] text-[#bd8837] cursor-not-allowed'
            : 'bg-[#5b3f15] text-white hover:bg-[#bd8837]'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination; 