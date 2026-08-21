import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Route
} from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';

const Sidebar = () => {
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

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 min-h-screen sticky top-16 overflow-y-auto">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 bg-linear-to-r ${config.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
            <PortalIcon size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{config.title}</h3>
            <p className="text-xs text-gray-500">{config.subtitle}</p>
          </div>
        </div>
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
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${active 
                    ? 'bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-linear-to-b from-indigo-600 to-purple-600 rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div className={`
                  w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                  ${active 
                    ? 'bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  <Icon size={18} />
                </div>

                {/* Label & Description */}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${active ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Study Stats Card */}
      <div className="mx-4 mt-6 mb-4">
        <div className="bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-4 border border-indigo-100">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Clock size={20} className="text-indigo-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Study Streak</h4>
              <p className="text-xs text-gray-500">Keep it going!</p>
            </div>
          </div>

          {/* Streak Days */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              7
            </span>
            <span className="text-sm text-gray-600">days</span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            🔥 You're on fire! Keep learning
          </p>
        </div>
      </div>

      {/* Help Card */}
      <div className="mx-4 mb-4">
        <div className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Need Help?</h4>
          <p className="text-xs text-gray-600 mb-3">
            Contact support or check our FAQs
          </p>
          <Link
            to="/support"
            className="text-xs text-indigo-600 hover:text-purple-600 font-medium"
          >
            Get Support →
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
