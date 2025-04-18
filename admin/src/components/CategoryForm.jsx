const CategoryForm = ({
    value,
    setValue,
    handleSubmit,
    buttonText = "Submit",
    handleDelete,
  }) => {
    return (
      <div className="p-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text" 
            className="py-3 px-4 border rounded-lg w-full hover:border-[#5b3f15] transition-colors duration-200"
            placeholder="Write category name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
  
          <div className="flex justify-between">
            <button className="bg-[#5b3f15] text-white border border-[#5b3f15] font-semibold py-2 px-4 rounded-md hover:bg-white hover:text-[#5b3f15] transition-colors duration-200 shadow-lg">
              {buttonText}
            </button>
  
            {handleDelete && (
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white font-semibold border border-red-600 py-2 px-4 rounded-md hover:bg-white hover:text-red-600 transition-colors duration-200 shadow-lg"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };
  
  export default CategoryForm;