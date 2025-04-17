import { FaCheck, FaUser, FaTruck, FaClipboardCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="max-w-5xl mx-auto mt-[-10px]">
      <div className="flex items-center justify-between relative mb-2">
        {/* Progress Line */}
        <motion.div 
          className="absolute top-6 left-6 right-6 h-1 bg-gray-100 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="h-full bg-[#5b3f15] rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: step1 && step2 && step3 ? '100%' : 
                    step1 && step2 ? '66%' : 
                    step1 ? '33%' : '0%'
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Step 1: Login */}
        <motion.div 
          className="relative z-10 flex flex-col items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              step1 ? 'bg-[#5b3f15] text-white shadow-lg' : 
                     'bg-white text-gray-400 border-2 border-gray-200'
            }`}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            {step1 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <FaCheck className="w-6 h-6" />
              </motion.div>
            ) : (
              <FaUser className="w-6 h-6" />
            )}
          </motion.div>
          <motion.span 
            className={`text-base font-medium mt-3 transition-colors duration-300 ${
              step1 ? 'text-gray-800' : 'text-gray-400'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Login
          </motion.span>
        </motion.div>

        {/* Step 2: Shipping */}
        <motion.div 
          className="relative z-10 flex flex-col items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              step2 ? 'bg-[#5b3f15] text-white shadow-lg' : 
                     'bg-white text-gray-400 border-2 border-gray-200'
            }`}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            {step2 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <FaCheck className="w-6 h-6" />
              </motion.div>
            ) : (
              <FaTruck className="w-6 h-6" />
            )}
          </motion.div>
          <motion.span 
            className={`text-base font-medium mt-3 transition-colors duration-300 ${
              step2 ? 'text-gray-800' : 'text-gray-400'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Shipping
          </motion.span>
        </motion.div>

        {/* Step 3: Summary */}
        <motion.div 
          className="relative z-10 flex flex-col items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              step3 ? 'bg-[#5b3f15] text-white shadow-lg' : 
                     'bg-white text-gray-400 border-2 border-gray-200'
            }`}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            {step3 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <FaCheck className="w-6 h-6" />
              </motion.div>
            ) : (
              <FaClipboardCheck className="w-6 h-6" />
            )}
          </motion.div>
          <motion.span 
            className={`text-base font-medium mt-3 transition-colors duration-300 ${
              step3 ? 'text-gray-800' : 'text-gray-400'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Summary
          </motion.span>
        </motion.div>
      </div>

      {/* Step Descriptions */}
      <motion.div 
        className="flex justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-center w-32">
          <p className="text-xs ml-[-70px] text-gray-500">Sign in to your account</p>
        </div>
        <div className="text-center w-32">
          <p className="text-xs ml-[-20px] text-gray-500">Enter shipping details</p>
        </div>
        <div className="text-center w-32">
          <p className="text-xs mr-[-60px] text-gray-500">Review your order</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressSteps;