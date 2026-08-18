import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { useState } from 'react';

const Alert = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  icon,
  action,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const types = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle2 size={20} className="text-green-600" />,
      iconBg: 'bg-green-100'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-pink-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <XCircle size={20} className="text-red-600" />,
      iconBg: 'bg-red-100'
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      icon: <AlertCircle size={20} className="text-orange-600" />,
      iconBg: 'bg-orange-100'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: <Info size={20} className="text-blue-600" />,
      iconBg: 'bg-blue-100'
    }
  };

  const config = types[type];

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`
            ${config.bg} ${config.border} ${config.text}
            border-2 rounded-xl p-4 shadow-lg backdrop-blur-sm
            ${className}
          `}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`${config.iconBg} rounded-lg p-2 shrink-0`}>
              {icon || config.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className="font-semibold text-base mb-1">{title}</h4>
              )}
              {message && (
                <p className="text-sm opacity-90">{message}</p>
              )}
              {action && (
                <div className="mt-3">
                  {action}
                </div>
              )}
            </div>

            {/* Dismiss Button */}
            {dismissible && (
              <motion.button
                onClick={handleDismiss}
                className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
