import React from 'react';
import { motion } from 'framer-motion';

const UniversalLoading = ({ text = "Loading..." }) => {
  const flagUrl = "https://upload.wikimedia.org/wikipedia/commons/c/cb/Flag_of_the_Bangladesh_Nationalist_Party.svg";
  
  return (
    <div className="flex justify-center items-center h-[calc(100vh-180px)]">
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          {/* Flag image */}
          <motion.img
            src={flagUrl}
            alt="Loading..."
            className="w-full h-full object-contain"
            initial={{ opacity: 0.8, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          
          {/* Magnifier effect */}
          <motion.div
            className="absolute w-16 h-16 bg-no-repeat rounded-full shadow-lg pointer-events-none backdrop-saturate-50"
            style={{
              backgroundImage: `url(${flagUrl})`,
              backgroundSize: '300px 300px',
            }}
            animate={{
              top: ['-5px', '-5px', '100px', '100px', '-5px'],
              left: ['-30px', '130px', '130px', '-30px', '-30px'],
              backgroundPosition: [
                '-80px -70px',
                '-160px -70px',
                '-160px -180px',
                '-80px -180px',
                '-80px -70px'
              ]
            }}
            transition={{
              duration: 3,
              times: [0, 0.25, 0.5, 0.75, 1],
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Loading text */}
        <motion.div
          className="mt-6 text-xl font-semibold text-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [10, 0, 0, -10]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.div>
      </div>
    </div>
  );
};

export default UniversalLoading;