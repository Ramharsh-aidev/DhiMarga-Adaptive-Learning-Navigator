import { motion } from 'framer-motion';

const Card = ({
  children,
  header,
  footer,
  glassmorphic = false,
  hover = false,
  padding = 'md',
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseStyles = 'rounded-2xl border overflow-hidden';

  const cardStyles = glassmorphic
    ? 'bg-white/70 backdrop-blur-xl border-white/30 shadow-xl'
    : 'bg-white border-gray-200 shadow-lg';

  return (
    <motion.div
      className={`
        ${baseStyles}
        ${cardStyles}
        ${hover ? 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-1' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02 } : {}}
      {...props}
    >
      {header && (
        <div
          className={`
            ${paddingStyles[padding]}
            border-b
            ${glassmorphic ? 'border-white/30 bg-white/20' : 'border-gray-200 bg-gray-50'}
            ${headerClassName}
          `}
        >
          {header}
        </div>
      )}

      <div
        className={`
          ${paddingStyles[padding]}
          ${bodyClassName}
        `}
      >
        {children}
      </div>

      {footer && (
        <div
          className={`
            ${paddingStyles[padding]}
            border-t
            ${glassmorphic ? 'border-white/30 bg-white/20' : 'border-gray-200 bg-gray-50'}
            ${footerClassName}
          `}
        >
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default Card;
