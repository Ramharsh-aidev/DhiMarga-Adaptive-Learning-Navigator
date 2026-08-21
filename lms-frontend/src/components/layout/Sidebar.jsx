import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  User,
  TrendingUp,
  Clock,
  Users,
  Plus,
  Settings,
  BarChart,
  UserCheck,
  GraduationCap,
  Briefcase,
  Shield,
  Compass,
  Route,
  X
} from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Define menu items for each role
  const menuItemsByRole = {
    [USER_ROLES.STUDENT]: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/student/dashboard',
        description: 'Overview & Stats'
      },
      {
        icon: BookOpen,
        label: 'My Courses',
        path: '/student/courses',
        description: 'Enrolled Courses'
      },
      {
        icon: TrendingUp,
        label: 'Progress',
        path: '/student/progress',
        description: 'Track Learning'
      },
      {
        icon: Compass,
        label: 'AI Navigator',
        path: '/student/navigator',
        description: 'Adaptive Path'
      },
      {
        icon: Route,
        label: 'My Paths',
        path: '/student/paths',
        description: 'Learning Journeys'
      },
      {
        icon: Award,
        label: 'Certificates',
        path: '/student/certificates',
        description: 'Achievements'
      },
      {
        icon: User,
        label: 'Profile',
        path: '/student/profile',
        description: 'Account Settings'
      },
    ],
    [USER_ROLES.MENTOR]: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/mentor/dashboard',
        description: 'Overview & Stats'
      },
      {
        icon: BookOpen,
        label: 'My Courses',
        path: '/mentor/courses',
        description: 'Manage Courses'
      },
      {
        icon: Plus,
        label: 'Create Course',
        path: '/mentor/courses/create',
        description: 'New Course'
      },
      {
        icon: BarChart,
        label: 'Analytics',
        path: '/mentor/analytics',
        description: 'Course Insights'
      },
      {
        icon: User,
        label: 'Profile',
        path: '/mentor/profile',
        description: 'Account Settings'
      },
    ],
    [USER_ROLES.ADMIN]: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/admin/dashboard',
        description: 'System Overview'
      },
      {
        icon: Users,
        label: 'User Management',
        path: '/admin/users',
        description: 'Manage Users'
      },
      {
        icon: BarChart,
        label: 'Analytics',
        path: '/admin/analytics',
        description: 'Platform Stats'
      },
      {
        icon: User,
        label: 'Profile',
        path: '/admin/profile',
        description: 'Account Settings'
      },
    ],
  };

  // Portal titles and icons for each role
  const portalConfig = {
    [USER_ROLES.STUDENT]: {
      title: 'Student Portal',
      subtitle: 'Learning Hub',
      icon: GraduationCap,
      gradient: 'from-blue-500 to-indigo-500'
    },
    [USER_ROLES.MENTOR]: {
      title: 'Mentor Portal',
      subtitle: 'Teaching Hub',
      icon: Briefcase,
      gradient: 'from-green-500 to-emerald-500'
    },
    [USER_ROLES.ADMIN]: {
      title: 'Admin Portal',
      subtitle: 'Control Center',
      icon: Shield,
      gradient: 'from-red-500 to-pink-500'
    },
  };

  const menuItems = menuItemsByRole[user?.role] || menuItemsByRole[USER_ROLES.STUDENT];
  const config = portalConfig[user?.role] || portalConfig[USER_ROLES.STUDENT];
  const PortalIcon = config.icon;

  const isActive = (path) => location.pathname === path;

  const sidebarContent = (
    <>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-linear-to-br ${config.gradient} rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(124,58,237,0.3)]`}>
            <PortalIcon size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">{config.title}</h3>
            <p className="text-xs text-slate-500 font-medium">{config.subtitle}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative block"
            >
              <motion.div
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
                  ${active 
                    ? 'bg-linear-to-r from-violet-50/80 to-purple-50/80 text-violet-700 shadow-sm border border-violet-100/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-[3px] h-8 bg-linear-to-b from-violet-600 to-purple-600 rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className={`
                  w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-xs
                  ${active 
                    ? 'bg-linear-to-br from-violet-600 to-purple-600 text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]' 
                    : 'bg-white border border-slate-200 text-slate-400'
                  }
                `}>
                  <Icon size={18} />
                </div>

                {/* Label & Description */}
                <div className="flex-1">
                  <p className={`text-sm font-bold tracking-tight ${active ? 'text-violet-700' : 'text-slate-700'}`}>
                    {item.label}
                  </p>
                  <p className={`text-[11px] ${active ? 'text-violet-500/80' : 'text-slate-400'}`}>{item.description}</p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Study Stats Card */}
      <div className="mx-4 mt-6 mb-4">
        <div className="bg-linear-to-br from-violet-50 via-purple-50 to-pink-50 rounded-2xl p-5 border border-violet-100/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none" />
          
          <div className="flex items-start gap-3 mb-3 relative z-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-violet-100">
              <Clock size={20} className="text-violet-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Study Streak</h4>
              <p className="text-xs text-slate-500 font-medium">Keep it going!</p>
            </div>
          </div>

          {/* Streak Days */}
          <div className="flex items-baseline gap-2 mb-2 relative z-10">
            <span className="text-3xl font-extrabold bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              7
            </span>
            <span className="text-sm font-medium text-slate-600">days</span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2.5 bg-white/60 rounded-full overflow-hidden border border-violet-100/30">
            <motion.div
              className="absolute inset-y-0 left-0 bg-linear-to-r from-violet-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            🔥 You're on fire! Keep learning
          </p>
        </div>
      </div>

      {/* Help Card */}
      <div className="mx-4 mb-4">
        <div className="bg-linear-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-amber-200">
          <h4 className="text-sm font-bold text-slate-800 mb-1">Need Help?</h4>
          <p className="text-xs text-slate-600 font-medium mb-3">
            Contact support or check our FAQs
          </p>
          <Link
            to="/support"
            className="text-xs text-violet-600 hover:text-purple-600 font-bold"
          >
            Get Support →
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white/90 backdrop-blur-2xl border-r border-slate-200 z-50 overflow-y-auto md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white/80 backdrop-blur-2xl border-r border-slate-200 min-h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
