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
  Home,
  Menu
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../utils/constants';

const Navbar = ({ onMenuClick }) => {
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
          { icon: Award, label: 'Credentials', path: '/student/credentials' },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-2xl border-b border-slate-200 sticky top-0 z-50 shadow-sm relative">
      <div className="absolute inset-0 bg-linear-to-r from-violet-50/50 via-transparent to-purple-50/50 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 md:gap-0">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link 
              to={getDashboardLink()} 
              className="flex items-center gap-3 group"
            >
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(124,58,237,0.4)] hidden sm:flex overflow-hidden bg-white"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <img src="/logo.jpg" alt="DhiMarga Logo" className="w-full h-full object-cover" />
              </motion.div>
              <div>
                <h1 className="text-xl font-extrabold bg-linear-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
                  DhiMārga
                </h1>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider -mt-1 hidden sm:block">Learning Management</p>
              </div>
            </Link>
          </div>

          {/* Quick Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            {getQuickLinks().map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
                >
                  <Icon size={18} />
                  <span className="text-sm font-bold tracking-tight">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Home Link */}
            <Link
              to="/"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-slate-600 hover:text-violet-700 hover:bg-violet-50 transition-colors"
            >
              <Home size={18} />
              <span className="text-sm font-bold tracking-tight">Home</span>
            </Link>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                {/* Avatar Icon */}
                <div className="w-10 h-10 bg-linear-to-br from-violet-100 to-pink-100 border border-violet-200 rounded-[14px] flex items-center justify-center shadow-xs">
                  <User size={20} className="text-violet-600" />
                </div>

                {/* User Info */}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-900 tracking-tight leading-tight">{user?.name}</p>
                  <p className="text-[11px] font-bold text-violet-600 uppercase tracking-wide">
                    {user?.role}
                  </p>
                </div>

                <ChevronDown 
                  size={16} 
                  className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl shadow-violet-500/10 border border-slate-200 overflow-hidden origin-top-right"
                  >
                    {/* User Info in Dropdown */}
                    <div className="p-5 bg-linear-to-br from-violet-50 to-purple-50 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-linear-to-br from-violet-100 to-pink-100 border border-violet-200 rounded-[14px] flex items-center justify-center shadow-xs">
                          <User size={24} className="text-violet-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 tracking-tight">{user?.name}</p>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-violet-600 transition-colors group text-slate-600"
                      >
                        <LayoutDashboard size={18} className="group-hover:text-violet-500 transition-colors" />
                        <span className="text-sm font-semibold">Dashboard</span>
                      </Link>

                      <Link
                        to={getProfileLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-violet-600 transition-colors group text-slate-600"
                      >
                        <User size={18} className="group-hover:text-violet-500 transition-colors" />
                        <span className="text-sm font-semibold">Profile</span>
                      </Link>

                      <Link
                        to={getSettingsLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-violet-600 transition-colors group text-slate-600"
                      >
                        <Settings size={18} className="group-hover:text-violet-500 transition-colors" />
                        <span className="text-sm font-semibold">Settings</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors group"
                      >
                        <LogOut size={18} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                        <span className="text-sm font-semibold">Logout</span>
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
