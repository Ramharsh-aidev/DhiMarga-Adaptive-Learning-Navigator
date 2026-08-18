import { useNavigate } from 'react-router-dom';
import { Home, Search, BookOpen, Users, AlertTriangle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const suggestions = [
    { icon: Home, label: 'Home', path: '/', description: 'Go back to homepage' },
    { icon: BookOpen, label: 'Courses', path: '/student/courses', description: 'Browse available courses' },
    { icon: Users, label: 'Dashboard', path: '/student/dashboard', description: 'View your dashboard' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.h1
                className="text-[150px] md:text-[200px] font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                404
              </motion.h1>
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <AlertTriangle className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-gray-500">
              Let's get you back on track!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              className="flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </Button>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-500 mb-4">Or try one of these:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {suggestions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-gray-900 mb-1">{item.label}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Search className="w-4 h-4" />
              <span>Need help? Try searching for what you need</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
