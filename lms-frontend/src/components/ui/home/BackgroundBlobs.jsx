import React from 'react';
import { motion } from 'framer-motion';

const BackgroundBlobs = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-violet-300/20 rounded-full mix-blend-multiply filter blur-[80px]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-300/20 rounded-full mix-blend-multiply filter blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], x: [0, -20, 20, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-purple-300/20 rounded-full mix-blend-multiply filter blur-[80px]"
      />
    </div>
  );
};

export default BackgroundBlobs;
