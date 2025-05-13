const CouponCard = ({ discount, onSave, isSaved = false }) => {
  const start = new Date(discount.startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  const end = new Date(discount.endDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const now = new Date();
  const endDate = new Date(discount.endDate);
  endDate.setHours(23, 59, 59, 999);

  const isUsageExpired = discount.usageLimit > 0 && discount.usedCount >= discount.usageLimit;
  const isDateExpired = now > endDate;
  const isTrulyExpired = isUsageExpired || isDateExpired;

  const buttonLabel =
    isTrulyExpired && !isSaved ? 'EXPIRED' :
    isSaved ? 'SAVED' : 'SAVE';

  return (
    <div
      className={`relative bg-white border rounded-xl w-full mx-auto overflow-hidden shadow-sm mt-8 transition-all duration-300 ${
        isTrulyExpired && !isSaved
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:scale-105 hover:shadow-lg hover:border-yellow-500'
      }`}
    >
      <div className="flex justify-between items-center px-8 py-6">
        <div className="text-[#bd8837] font-bold text-[3.5rem] leading-none ml-[10px]">
          <div>{discount.discountPercentage}%</div>
          <div className="text-[2rem]">OFF</div>
        </div>
        <div className="text-[#bd8837] text-right text-[2rem] font-semibold leading-tight tracking-wide mr-[20px]">
          <div>DISCOUNT</div>
          <div>COUPON</div>
        </div>
      </div>

      <div className="border-t border-dashed border-gray-400 mx-0" />

        <div className="flex justify-between items-center px-8 py-4 flex-wrap gap-4">
          <div className="text-xl font-semibold tracking-wider text-gray-800">
            {discount.code}
            <div className="text-xs text-gray-600 font-normal mt-1">
              Valid from <span className="font-semibold">{start}</span> to{' '}
              <span className="font-semibold">{end}</span>
            </div>
          </div>

          <button
            onClick={() => !isTrulyExpired && onSave(discount._id)}
            disabled={isTrulyExpired && !isSaved}
            className={`w-20 h-10 rounded-sm font-semibold transition-colors duration-300 ${
              isTrulyExpired && !isSaved
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : isSaved
                ? 'bg-[#bd8837] text-white border border-[#bd8837]'
                : 'bg-white text-[#bd8837] border border-[#bd8837]'
            }`}
          >
            {buttonLabel}
          </button>
        </div>
    </div>
  );
};

export default CouponCard;
