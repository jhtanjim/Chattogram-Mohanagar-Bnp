import React from 'react'; 
import { motion } from 'framer-motion';

const UniversalLoading = ({ 
  text = "Loading...", 
  bgColor = "bg-gradient-to-br from-green-50 to-green-100",
  iconColor = "bg-green-500",
  textColor = "text-green-800" 
}) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgColor} p-4`}>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 1], 
          opacity: [0, 1, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className={`w-48 h-48 ${iconColor} rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-white opacity-20"></div>
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 100 100" 
          className="w-32 h-32 text-white z-10"
        >
          <motion.path 
            d="M50 10 
               L70 40 
               Q80 50, 70 60 
               L50 90 
               L30 60 
               Q20 50, 30 40 
               Z"
            fill="white"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none"
            stroke="white"
            strokeWidth="4"
            initial={{ strokeDasharray: 0 }}
            animate={{ 
              strokeDasharray: [0, 282, 282],
              rotate: [0, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.svg>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: [0, 1, 1, 0], 
          y: [20, 0, 0, -20] 
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className={`mt-8 text-2xl font-bold ${textColor}`}
      >
        {text}
      </motion.div>
    </div>
  );
};

export default UniversalLoading;