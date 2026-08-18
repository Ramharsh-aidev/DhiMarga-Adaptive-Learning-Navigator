import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, UserPlus, Briefcase, GraduationCap, Home } from 'lucide-react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { PageLoader } from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../utils/constants';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.STUDENT,
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Only Student and Mentor roles are available for public registration
  // Admin accounts are pre-configured and not publicly accessible
  const roles = [
    { value: USER_ROLES.STUDENT, label: 'Student', icon: GraduationCap, color: 'primary' },
    { value: USER_ROLES.MENTOR, label: 'Mentor', icon: Briefcase, color: 'success' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      if (result.success) {
        // Check if mentor is pending approval (no auto-login)
        if (result.pendingApproval) {
          console.log('Mentor registration pending approval - showing message');
          setApiError(''); // Clear any errors
          setIsLoading(false);
          // Redirect to pending approval page with success message
          navigate('/mentor/pending-approval', { 
            replace: true,
            state: { 
              message: 'Registration successful! Your mentor account is pending admin approval.',
              userEmail: formData.email
            }
          });
          return;
        }
        
        // For STUDENT/ADMIN, auto-logged in, navigate based on role
        const userData = JSON.parse(localStorage.getItem('user'));
        const role = userData?.role?.toUpperCase();
        
        console.log('Registration successful - User data:', { role });
        
        // Navigate based on role
        if (role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else if (role === 'STUDENT') {
          navigate('/student/dashboard', { replace: true });
        } else {
          // Fallback to student dashboard
          navigate('/student/dashboard', { replace: true });
        }
      } else {
        setApiError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLoader text="DhiMārga" delay={1000}>
      <div className="min-h-screen bg-linear-to-br from-indigo-50/40 via-purple-50/30 to-pink-50/35 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Home Button */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-20 flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        >
          <Home size={24} className="text-indigo-600 group-hover:text-purple-600 transition-colors" />
        </Link>

        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl relative z-10"
        >
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <UserPlus size={32} className="text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Join DhiMārgaand start your learning journey</p>
          </div>

          {/* Register Card */}
          <Card glassmorphic padding="lg" className="shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {apiError && (
                <Alert
                  type="error"
                  message={apiError}
                  dismissible
                  onDismiss={() => setApiError('')}
                />
              )}

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Role <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = formData.role === role.value;
                    return (
                      <motion.button
                        key={role.value}
                        type="button"
                        onClick={() => handleRoleSelect(role.value)}
                        className={`
                          p-6 rounded-xl border-2 transition-all duration-300
                          ${isSelected 
                            ? 'border-indigo-500 bg-indigo-50/50 shadow-lg' 
                            : 'border-gray-200 bg-white/50 hover:border-indigo-300'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                      >
                        <Icon 
                          size={36} 
                          className={`mx-auto mb-3 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`}
                        />
                        <p className={`text-base font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-600'}`}>
                          {role.label}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
                {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
              </div>

              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  leftIcon={<User size={20} />}
                  error={errors.name}
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  leftIcon={<Mail size={20} />}
                  error={errors.email}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  leftIcon={<Lock size={20} />}
                  error={errors.password}
                  hint="At least 6 characters"
                  required
                  disabled={isLoading}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  leftIcon={<Lock size={20} />}
                  error={errors.confirmPassword}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    I agree to the{' '}
                    <Link to="/terms" className="text-indigo-600 hover:text-purple-600 font-medium">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-indigo-600 hover:text-purple-600 font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.acceptTerms && <p className="mt-2 text-sm text-red-600">{errors.acceptTerms}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                rightIcon={!isLoading && <ArrowRight size={20} />}
              >
                Create Account
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/50 text-gray-500">Or sign up with</span>
                </div>
              </div>

              {/* Social Register Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => console.log('Google signup')}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => console.log('GitHub signup')}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div>
            </form>
          </Card>

          {/* Login Link */}
          <motion.p
            className="text-center mt-6 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-purple-600 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </PageLoader>
  );
};

export default Register;
