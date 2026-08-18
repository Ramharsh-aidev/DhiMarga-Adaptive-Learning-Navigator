import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Mail, CheckCircle, Home } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';

const PendingApproval = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(null);
  
  useEffect(() => {
    // Check if there's a success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50/40 via-purple-50/30 to-pink-50/35 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl" />

      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
      >
        <Home size={24} className="text-indigo-600 group-hover:text-purple-600 transition-colors" />
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        {successMessage && (
          <Alert
            variant="success"
            title="Registration Successful!"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
            className="mb-4"
          />
        )}
        
        <Card glassmorphic padding="lg" className="shadow-2xl text-center">
          {/* Animated Clock Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-r from-yellow-500 to-orange-500 rounded-full mb-6 shadow-xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Clock size={48} className="text-white" />
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl font-bold bg-linear-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Mentor Approval Pending
          </h1>

          {/* Welcome Message */}
          <p className="text-xl text-gray-700 mb-2">
            Welcome, <span className="font-semibold text-indigo-600">{user?.name}</span>!
          </p>

          {/* Status Message */}
          <div className="space-y-4 mb-8">
            <p className="text-gray-600 leading-relaxed">
              Thank you for registering as a <strong>Mentor</strong> on DhiMārga. 
              Your account has been created successfully!
            </p>

            <div className="bg-yellow-50/50 border-2 border-yellow-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Mail size={24} className="text-yellow-600 shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">Awaiting Admin Approval</h3>
                  <p className="text-sm text-gray-600">
                    Your mentor application is currently under review by our administrators. 
                    You will receive an email notification once your account has been approved.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 border-2 border-indigo-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <CheckCircle size={24} className="text-indigo-600 shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">What happens next?</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>An administrator will review your application within 24-48 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>You'll receive an email notification when approved</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>Once approved, you can create and manage courses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>You can login anytime to check your approval status</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/'}
            >
              Go to Home
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={logout}
            >
              Logout
            </Button>
          </div>

          {/* Support Contact */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions? Contact us at{' '}
              <a href="mailto:support@dhimarga.com" className="text-indigo-600 hover:text-purple-600 font-medium">
                support@dhimarga.com
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PendingApproval;
