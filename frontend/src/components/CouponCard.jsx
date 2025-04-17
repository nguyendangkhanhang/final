import { FaBolt } from 'react-icons/fa';

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

  return (
    <div className="relative bg-white border border-gray-300 rounded-xl w-full mx-auto overflow-hidden shadow-sm mt-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-yellow-500">
      {/* Top content */}
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

      {/* Dotted line divider */}
      <div className="border-t border-dashed border-gray-400 mx-0" />

      {/* Bottom content */}
      <div className="flex justify-between items-center px-8 py-4 flex-wrap gap-4">
        <div className="text-xl font-semibold tracking-wider text-gray-800">
          {discount.code}
          <div className="text-xs text-gray-600 font-normal mt-1">
            Valid from{" "}
            <span className="font-semibold">{start}</span> to{" "}
            <span className="font-semibold">{end}</span>
          </div>
        </div>
        {!isSaved && (
          <button 
            onClick={() => onSave(discount._id)}
            className="bg-[#bd8837] text-white px-6 py-2 rounded-sm font-semibold hover:opacity-90"
          >
            SAVE
          </button>
        )}
      </div>
    </div>
  );
};

export default CouponCard; 