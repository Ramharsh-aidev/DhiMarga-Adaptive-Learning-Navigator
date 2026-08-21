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
    primary: 'bg-linear-to-r from-violet-100 to-purple-100 text-violet-700 border border-violet-200',
    success: 'bg-linear-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200',
    warning: 'bg-linear-to-r from-yellow-100 to-amber-100 text-amber-700 border border-amber-200',
    danger: 'bg-linear-to-r from-rose-100 to-pink-100 text-rose-700 border border-rose-200',
    info: 'bg-linear-to-r from-violet-50 to-purple-50 text-violet-700 border border-violet-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200'
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
            ${variant === 'primary' ? 'bg-violet-400' : ''}
            ${variant === 'success' ? 'bg-green-400' : ''}
            ${variant === 'warning' ? 'bg-amber-400' : ''}
            ${variant === 'danger' ? 'bg-rose-400' : ''}
            ${variant === 'info' ? 'bg-violet-400' : ''}
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
