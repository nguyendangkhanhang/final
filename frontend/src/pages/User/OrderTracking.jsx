import { useParams, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets"; // ✅ Import tất cả icon từ assets.js

const OrderTracking = () => {
  const { id: orderId } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const currentStatus = queryParams.get("status"); // 🔥 Lấy trạng thái từ URL

  // 🔥 Danh sách trạng thái đơn hàng kèm icon
  const steps = [
    { label: "Order Placed", value: "Order Placed", icon: assets.step_1 },
    { label: "Packing", value: "Packing", icon: assets.step_2 },
    { label: "Shipped", value: "Shipped", icon: assets.step_3 },
    { label: "Out for delivery", value: "Out for delivery", icon: assets.step_4 },
    { label: "Delivered", value: "Delivered", icon: assets.step_5 },
  ];

  // Tìm vị trí trạng thái hiện tại
  const currentStepIndex = steps.findIndex((s) => s.value === currentStatus);

  return (
    <div className="container mx-auto p-10">
      <h2 className="text-3xl font-semibold mb-6 text-center">Tracking Order: {orderId}</h2>

      <div className="bg-white p-8 rounded-lg shadow-md relative flex items-center gap-x-2 w-[90%] mx-auto">
        {/* Đường gạch ngang tổng (xám) - tăng độ dày */}
        <div className="absolute left-[10%] w-[80%] h-2 bg-gray-300 top-[41%] -translate-y-1/2"></div>

        {/* Đường gạch ngang màu xanh #008001 (bắt đầu từ bước 1) */}
        <div
          className="absolute left-[10%] h-2 bg-green-custom transition-all duration-300 top-[41%] -translate-y-1/2"
          style={{
            width: `${(currentStepIndex / (steps.length - 1)) * 80}%`,
          }}
        ></div>

        {/* Các bước trạng thái */}
        {steps.map((step, index) => {
          let statusClass =
            index < currentStepIndex
              ? "border-green-custom text-green-custom bg-white" // Trạng thái đã hoàn thành (viền xanh #008001, nền trắng)
              : index === currentStepIndex
              ? "bg-green-custom text-white border-green-custom" // Trạng thái hiện tại (nền xanh #008001, viền xanh #008001)
              : "border-gray-300 text-gray-300 bg-white"; // Trạng thái chưa tới (viền xám, nền trắng)

          let iconClass =
            index < currentStepIndex
              ? "img-green" // Trạng thái đã hoàn thành (icon xanh #008001)
              : index === currentStepIndex
              ? "img-white" // Trạng thái hiện tại (icon trắng)
              : "opacity-50"; // Trạng thái chưa tới (icon mờ đi)

          return (
            <div key={index} className="relative z-10 flex flex-col items-center w-full">
              <div
                 className={`w-20 h-20 flex items-center justify-center rounded-full font-bold border-[5px] ${statusClass}`}
              >
                {/* Thay số bằng icon có màu động */}
                <img src={step.icon} alt={step.label} className={`w-12 h-12 ${iconClass}`} />
              </div>
              <p className="mt-3 text-lg font-semibold">{step.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracking;
