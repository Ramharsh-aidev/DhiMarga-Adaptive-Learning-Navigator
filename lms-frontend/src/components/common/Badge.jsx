import { motion } from 'framer-motion';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  icon,
  pulse = false,
  className = ''
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200',
    warning: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border border-orange-200',
    danger: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200',
    info: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <motion.span
      className={`
        inline-flex items-center gap-1.5 font-medium
        ${rounded ? 'rounded-full' : 'rounded-lg'}
        ${variants[variant]}
        ${sizes[size]}
        ${pulse ? 'relative' : ''}
        ${className}
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {pulse && (
        <motion.span
          className={`
            absolute -inset-1 ${rounded ? 'rounded-full' : 'rounded-lg'}
            opacity-75
            ${variant === 'primary' ? 'bg-indigo-400' : ''}
            ${variant === 'success' ? 'bg-green-400' : ''}
            ${variant === 'warning' ? 'bg-orange-400' : ''}
            ${variant === 'danger' ? 'bg-red-400' : ''}
            ${variant === 'info' ? 'bg-blue-400' : ''}
          `}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
      {icon && <span className="relative">{icon}</span>}
      <span className="relative">{children}</span>
    </motion.span>
  );
};

export default Badge;
