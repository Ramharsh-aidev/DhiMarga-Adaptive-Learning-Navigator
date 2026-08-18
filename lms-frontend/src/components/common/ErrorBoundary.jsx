import { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
    
    // You can log to error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-8"
              >
                <div className="relative inline-block">
                  <motion.div
                    className="w-32 h-32 bg-linear-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-16 h-16 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Error Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                  Oops!
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                  Something went wrong
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  We're sorry for the inconvenience. An unexpected error occurred.
                </p>
                <p className="text-gray-500">
                  Our team has been notified and is working on a fix.
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              >
                <Button
                  onClick={this.handleReload}
                  variant="primary"
                  className="flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go to Homepage
                </Button>
              </motion.div>

              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && this.state.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-red-200 text-left"
                >
                  <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Error Details (Development Mode)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Error Message:</p>
                      <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto text-red-600">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Stack Trace:</p>
                        <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto text-gray-600 max-h-64">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={this.handleReset}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Try to recover from error →
                  </button>
                </motion.div>
              )}

              {/* Help Text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 pt-8 border-t border-gray-200"
              >
                <p className="text-sm text-gray-500">
                  If this problem persists, please contact support with the error details above.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
