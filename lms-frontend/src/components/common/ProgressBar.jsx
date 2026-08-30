import { motion } from 'framer-motion';

const ProgressBar = ({
  value,
  progress,
  max = 100,
  size = 'md',
  variant = 'gradient',
  showPercentage = true,
  label,
  animated = true,
  className = ''
}) => {
  const finalValue = value !== undefined ? value : (progress || 0);
  const percentage = Math.min(Math.max((finalValue / max) * 100, 0), 100);

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variants = {
    gradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-600'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-indigo-600">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`
          w-full ${heights[size]} bg-gray-200 rounded-full overflow-hidden
          shadow-inner
        `}
      >
        <motion.div
          className={`
            h-full ${variants[variant]} rounded-full
            shadow-lg relative overflow-hidden
          `}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.8 : 0,
            ease: 'easeOut'
          }}
        >
          {/* Animated shine effect */}
          {animated && percentage > 0 && (
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
                ease: 'easeInOut'
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
