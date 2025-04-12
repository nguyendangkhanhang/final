import { FaCheck, FaUser, FaTruck, FaClipboardCheck } from "react-icons/fa";

const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
          <div 
            className={`h-full bg-blue-600 transition-all duration-500 ease-in-out ${
              step1 && step2 && step3 ? 'w-full' : 
              step1 && step2 ? 'w-2/3' : 
              step1 ? 'w-1/3' : 'w-0'
            }`}
          />
        </div>

        {/* Step 1: Login */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
            step1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            <FaUser className="w-5 h-5" />
          </div>
          <span className={`text-sm font-medium transition-colors duration-300 ${
            step1 ? 'text-blue-600' : 'text-gray-400'
          }`}>
            Login
          </span>
        </div>

        {/* Step 2: Shipping */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
            step2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            <FaTruck className="w-5 h-5" />
          </div>
          <span className={`text-sm font-medium transition-colors duration-300 ${
            step2 ? 'text-blue-600' : 'text-gray-400'
          }`}>
            Shipping
          </span>
        </div>

        {/* Step 3: Summary */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
            step3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            <FaClipboardCheck className="w-5 h-5" />
          </div>
          <span className={`text-sm font-medium transition-colors duration-300 ${
            step3 ? 'text-blue-600' : 'text-gray-400'
          }`}>
            Summary
          </span>
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between mt-4">
        <div className="text-center w-24">
          <p className="text-xs text-gray-500">Sign in to your account</p>
        </div>
        <div className="text-center w-24">
          <p className="text-xs text-gray-500">Enter shipping details</p>
        </div>
        <div className="text-center w-24">
          <p className="text-xs text-gray-500">Review your order</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;