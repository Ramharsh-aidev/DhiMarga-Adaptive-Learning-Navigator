import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  success,
  hint,
  leftIcon,
  rightIcon,
  disabled = false,
  required = false,
  className = '',
  autoComplete,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  // Set default autocomplete values based on input type
  const getAutoComplete = () => {
    if (autoComplete) return autoComplete;
    if (type === 'password') return 'current-password';
    if (type === 'email') return 'email';
    if (name === 'name') return 'name';
    return undefined;
  };

  const baseInputStyles = 'w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed bg-white/50 backdrop-blur-sm';

  const stateStyles = error
    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
    : success
    ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-500/20'
    : 'border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20';

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <motion.label
          className="block text-sm font-medium text-gray-700 mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <motion.input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={getAutoComplete()}
          className={`
            ${baseInputStyles}
            ${stateStyles}
            ${leftIcon ? 'pl-11' : ''}
            ${rightIcon || type === 'password' || error || success ? 'pr-11' : ''}
          `}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {!type.includes('password') && (error || success || rightIcon) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {error ? (
              <AlertCircle size={20} className="text-red-500" />
            ) : success ? (
              <CheckCircle2 size={20} className="text-green-500" />
            ) : (
              <span className="text-gray-400">{rightIcon}</span>
            )}
          </div>
        )}
      </div>

      {(error || success || hint) && (
        <motion.p
          className={`mt-2 text-sm ${
            error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
          }`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error || success || hint}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
