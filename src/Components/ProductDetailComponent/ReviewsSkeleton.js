import React from "react";
import { motion } from "framer-motion";

const ReviewsSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] p-6 bg-[#A8B5A2] text-[#317873] rounded-2xl shadow-md animate-pulse">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-[#228B22]"
      >
        Eco-Friendly Marketplace
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg text-center max-w-md mt-2 text-[#6B8E23]"
      >
        This app uses NLP to summarize and categorize eco-friendly products from top brands, helping you make sustainable choices effortlessly.
      </motion.p>
      <div className="w-full flex justify-center mt-4">
        <motion.div
          className="h-2 w-20 bg-[#317873] rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default ReviewsSkeleton;
