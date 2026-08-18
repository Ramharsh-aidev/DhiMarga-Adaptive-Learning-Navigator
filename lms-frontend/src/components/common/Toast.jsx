import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

// Toast Context
const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ message, type = 'info', duration = 3000, title }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration, title }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Toast Component
const Toast = ({ message, type, duration, title, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600',
      icon: <CheckCircle2 size={20} />,
      progress: 'bg-green-300'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-pink-600',
      icon: <XCircle size={20} />,
      progress: 'bg-red-300'
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-600',
      icon: <AlertCircle size={20} />,
      progress: 'bg-orange-300'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      icon: <Info size={20} />,
      progress: 'bg-blue-300'
    }
  };

  const config = types[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="pointer-events-auto"
    >
      <div
        className={`
          ${config.bg} text-white rounded-xl shadow-2xl
          min-w-75 max-w-md overflow-hidden
        `}
      >
        <div className="p-4 flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0 bg-white/20 rounded-lg p-2">
            {config.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold text-base mb-1">{title}</h4>
            )}
            <p className="text-sm opacity-90">{message}</p>
          </div>

          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* Progress Bar */}
        {duration && (
          <motion.div
            className="h-1 bg-white/20"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        )}
      </div>
    </motion.div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.string,
      duration: PropTypes.number,
      title: PropTypes.string
    })
  ).isRequired,
  removeToast: PropTypes.func.isRequired
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default Toast;
