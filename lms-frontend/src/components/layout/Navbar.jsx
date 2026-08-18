import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  LogOut, 
  Settings, 
  LayoutDashboard,
  ChevronDown,
  BookOpen,
  Award,
  Users,
  BarChart3,
  Home
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../utils/constants';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return '/admin/dashboard';
      case USER_ROLES.MENTOR:
        return '/mentor/dashboard';
      case USER_ROLES.STUDENT:
        return '/student/dashboard';
      default:
        return '/';
    }
  };

  const getProfileLink = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return '/admin/profile';
      case USER_ROLES.MENTOR:
        return '/mentor/profile';
      case USER_ROLES.STUDENT:
        return '/student/profile';
      default:
        return '/profile';
    }
  };

  const getSettingsLink = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return '/admin/settings';
      case USER_ROLES.MENTOR:
        return '/mentor/settings';
      case USER_ROLES.STUDENT:
        return '/student/settings';
      default:
        return '/settings';
    }
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return 'bg-red-100 text-red-700';
      case USER_ROLES.MENTOR:
        return 'bg-green-100 text-green-700';
      case USER_ROLES.STUDENT:
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getQuickLinks = () => {
    switch (user?.role) {
      case USER_ROLES.ADMIN:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          { icon: Users, label: 'Users', path: '/admin/users' },
          { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        ];
      case USER_ROLES.MENTOR:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/mentor/dashboard' },
          { icon: BookOpen, label: 'My Courses', path: '/mentor/courses' },
          { icon: Users, label: 'Assign Courses', path: '/mentor/assign' },
        ];
      case USER_ROLES.STUDENT:
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
          { icon: BookOpen, label: 'My Courses', path: '/student/courses' },
          { icon: Award, label: 'Certificates', path: '/student/certificates' },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to={getDashboardLink()} 
            className="flex items-center gap-3 group"
          >
            <motion.div
              className="w-10 h-10 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <BookOpen size={24} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                DhiMārga
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Learning Management</p>
            </div>
          </Link>

          {/* Quick Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            {getQuickLinks().map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Home Link */}
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Home size={18} />
              <span className="text-sm font-medium">Home</span>
            </Link>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {/* Avatar */}
                <div className="w-9 h-9 bg-linear-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold shadow-md">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>

                {/* User Info */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className={`text-xs px-2 py-0.5 rounded-full inline-block ${getRoleBadgeColor()}`}>
                    {user?.role}
                  </p>
                </div>

                <ChevronDown 
                  size={18} 
                  className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                  >
                    {/* User Info in Dropdown */}
                    <div className="p-4 bg-linear-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <LayoutDashboard size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-700">Dashboard</span>
                      </Link>

                      <Link
                        to={getProfileLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <User size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-700">Profile</span>
                      </Link>

                      <Link
                        to={getSettingsLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={18} className="text-gray-500" />
                        <span className="text-sm text-gray-700">Settings</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
