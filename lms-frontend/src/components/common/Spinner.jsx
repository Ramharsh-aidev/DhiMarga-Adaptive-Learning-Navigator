import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Spinner = ({ text = 'Loading', size = 180, className = '' }) => {
  const letters = text.split('');

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Rotating gradient background */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: '0 10px 20px 0 #fff inset, 0 20px 30px 0 #ad5fff inset, 0 60px 60px 0 #471eec inset'
        }}
        animate={{
          rotate: [90, 270, 450],
          boxShadow: [
            '0 10px 20px 0 #fff inset, 0 20px 30px 0 #ad5fff inset, 0 60px 60px 0 #471eec inset',
            '0 10px 20px 0 #fff inset, 0 20px 10px 0 #d60a47 inset, 0 40px 60px 0 #311e80 inset',
            '0 10px 20px 0 #fff inset, 0 20px 30px 0 #ad5fff inset, 0 60px 60px 0 #471eec inset'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Animated text */}
      <div className="relative z-10 flex items-center justify-center text-white font-semibold tracking-wide" style={{ fontSize: size * 0.12 }}>
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block"
            animate={{
              opacity: [0.4, 1, 0.7, 0.4],
              scale: [1, 1.15, 1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

// Page Loading Wrapper Component
export const PageLoader = ({ children, delay = 1500, text = 'Loading' }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50/40 via-purple-50/30 to-pink-50/35 flex items-center justify-center">
        <Spinner text={text} />
      </div>
    );
  }

  return children;
};

export default Spinner;
