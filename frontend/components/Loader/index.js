import { motion } from "framer-motion";
import React from "react";


const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2
    }
  },
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const DotVariants = {
  initial: {
    y: "0%"
  },
  animate: {
    y: "100%"
  }
};

const DotTransition = {
  duration: 0.5,
  yoyo: Infinity,
  ease: "easeInOut"
};

const Loader = () => {
  return (
    <button
      className="mt-4 block w-full p-3 font-bold text-white bg-teal-500 rounded-l disabled opacity-50 cursor-default"
    >
      <div className="w-full flex justify-center h-5" >
        <motion.div
          className="w-1/3 flex justify-around h-full"
          variants={ContainerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.span
            className="block w-2 h-2 bg-white rounded-full"
            variants={DotVariants}
            transition={DotTransition}
          />
          <motion.span
            className="block w-2 h-2 bg-white rounded-full"
            variants={DotVariants}
            transition={DotTransition}
          />
          <motion.span
            className="block w-2 h-2 bg-white rounded-full"
            variants={DotVariants}
            transition={DotTransition}
          />
        </motion.div>
      </div >
    </button>
  );
}

export default Loader
