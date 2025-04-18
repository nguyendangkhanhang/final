import { useParams, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useState, useEffect } from "react";
import { useGetOrderDetailsQuery } from "../../redux/api/orderApiSlice";
import ScrollAnimator from "../../components/ScrollAnimator";
import Title from "../../components/Title";

const OrderTracking = () => {
  const { id: orderId } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const currentStatus = queryParams.get("status");
  const [deliveryFeedback, setDeliveryFeedback] = useState(null);
  const { data: order } = useGetOrderDetailsQuery(orderId);

  const trackingSteps = [
    { number: 5, label: "Delivered", value: "Delivered", icon: assets.step_5, description: "Order delivered successfully" },
    { number: 4, label: "Out For Delivery", value: "Out for delivery", icon: assets.step_4, description: "Delivery in progress" },
    { number: 3, label: "Shipped", value: "Shipped", icon: assets.step_3, description: "Your order is on the way" },
    { number: 2, label: "Packing", value: "Packing", icon: assets.step_2, description: "We are preparing your items" },
    { number: 1, label: "Order Placed", value: "Order Placed", icon: assets.step_1, description: "Your order has been received" }
  ];

  const currentStepIndex = trackingSteps.findIndex((s) => s.value === currentStatus);
  
  // Formatted date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  
  // Formatted time helper function
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };
  
  // Get real dates for each step based on the order's timeline
  const getStepDate = (step) => {
    if (!order) return { date: "", time: "" };
    
    switch(step.value) {
      case "Delivered":
        return order.isDelivered 
          ? { date: formatDate(order.deliveredAt), time: formatTime(order.deliveredAt) }
          : { date: "", time: "" };
      case "Out for delivery":
        return order.status === "Out for delivery"
          ? { date: formatDate(order.updatedAt), time: formatTime(order.updatedAt) }
          : { date: "", time: "" };
      case "Packing":
        return order.status === "Packing" || order.status === "Shipped" || order.status === "Out for delivery" || order.isDelivered
          ? { date: formatDate(order.updatedAt), time: formatTime(order.updatedAt) }
          : { date: "", time: "" };
      case "Shipped":
        return order.status === "Shipped" || order.status === "Out for delivery" || order.isDelivered
          ? { date: formatDate(order.updatedAt), time: formatTime(order.updatedAt) }
          : { date: "", time: "" };
      case "Order Placed":
        return { date: formatDate(order.createdAt), time: formatTime(order.createdAt) };
      default:
        return { date: "", time: "" };
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ScrollAnimator>
        <div className="relative h-64 md:h-80 flex items-center justify-center text-black bg-[#efe9e0] overflow-hidden">
          <div className="relative z-10 text-center px-4">
            <div className="text-3xl text-center">
              <Title text1={'TRACKING'} text2={'NO.'} />
            </div>
            <p className="mt-2 text-4xl font-semibold text-black">#{orderId}</p>
          </div>
        </div>
        <div className="bg-[#efe9e0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="block" fill="#f9fafb">
            <path d="M1440,50 C1200,100 900,0 720,0 C540,0 240,100 0,50 L0,100 L1440,100 Z"></path>
          </svg>
        </div>
      </ScrollAnimator>
    
      <div className="min-h-screen flex items-center justify-center mt-[-8rem]">
        <div className="max-w-8xl ">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left Column */}
            <div className="p-6 md:p-8 bg-white border-r border-gray-100">

              <div className="mb-8">
                <p className="text-lg text-gray-700">Your order is</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{currentStatus}</h1>
                <p className="text-sm text-gray-600">
                  as on {formatDate(order?.updatedAt)}, {new Date(order?.updatedAt).toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Last updated on {formatDate(order?.updatedAt)}, {new Date(order?.updatedAt).toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Customer Name</p>
                  <p className="font-medium">{order?.user?.username || "User Name"}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm mb-1">Customer Contact</p>
                  <p className="font-medium">{order?.shippingAddress?.phone || "+91 XXXXX-XXXXX"}</p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm mb-1">Delivery Address</p>
                  <p className="font-medium">
                    {order?.shippingAddress?.address || "Address"}, {order?.shippingAddress?.city || "City"},
                    <br />
                    {order?.shippingAddress?.country || "Country"} - {order?.shippingAddress?.postalCode || "Postal Code"}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Tracking Info */}
            <div className="p-6 md:pl-20 col-span-2">
              <div>
                <p className="text-gray-700 font-semibold text-xl mb-4">Tracking History</p>
                <div className="relative">
                  {/* Main gray background line */}
                  <div className="absolute left-2 top-0 h-[calc(100%-20px)] w-0.5 bg-gray-200"></div>
                  
                  {/* Green progress line that goes from bottom (Order Placed) to current status */}
                  <div 
                    className="absolute left-2 bottom-[20px] w-0.5 bg-green-500 transition-all duration-300"
                    style={{ 
                      height: currentStepIndex !== -1 
                        ? `${(trackingSteps.length - currentStepIndex - 1) * 90}px` 
                        : '0px'
                    }}
                  ></div>
                  
                  {trackingSteps.map((step, index) => {
                    const isCompleted = currentStepIndex !== -1 && index >= currentStepIndex;
                    const timeInfo = getStepDate(step);
                    
                    return (
                      <div key={index} className="flex items-start mb-10 relative pl-6">
                        {/* Dot */}
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center absolute -left-3 top-0 border-2 ${
                          isCompleted ? "bg-green-500 border-green-500" : "bg-white border-gray-300"
                        }`}>
                          {isCompleted ? (
                            <img src={step.icon} alt={step.label} className="w-6 h-6 filter brightness-0 invert" />
                          ) : (
                            <span className="text-sm text-gray-400">{step.number}</span>
                          )}
                        </span>

                        {/* Step Content */}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium text-xl ml-4 text-gray-900">{step.number}. {step.label}</p>
                              <p className="text-sm ml-4 text-gray-500">{step.description}</p>
                            </div>
                            
                            {isCompleted && (
                              <div className="text-right">
                                <p className="text-base text-gray-600">{timeInfo.date}</p>
                                {timeInfo.time && (
                                  <p className="text-sm text-gray-500">At {timeInfo.time}</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
