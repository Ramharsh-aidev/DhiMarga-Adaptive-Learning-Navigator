import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  BarChart,
  GraduationCap,
  Briefcase,
  Shield,
  Compass,
  Route,
  X,
  LogOut,
  Home
} from 'lucide-react';
import { USER_ROLES } from '../../utils/constants';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define menu items for each role
  const menuItemsByRole = {
    [USER_ROLES.STUDENT]: [
      {
        icon: Home,
        label: 'Home',
        path: '/',
        description: 'Main Website'
      },
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
        icon: Home,
        label: 'Home',
        path: '/',
        description: 'Main Website'
      },
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
        icon: Home,
        label: 'Home',
        path: '/',
        description: 'Main Website'
      },
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

  const isActive = (path) => location.pathname === path;

  const sidebarContent = (
    <div className="flex flex-col min-h-full">
      {/* Sidebar Header: DhiMārga Logo replacing the old Portal header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-linear-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(124,58,237,0.4)]">
            <BookOpen size={22} className="text-white group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold bg-linear-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
              DhiMārga
            </h1>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider -mt-1">{config.title}</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative block"
              onClick={onClose}
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
                  w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-xs shrink-0
                  ${active 
                    ? 'bg-linear-to-br from-violet-600 to-purple-600 text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]' 
                    : 'bg-white border border-slate-200 text-slate-400'
                  }
                `}>
                  <Icon size={18} />
                </div>

                {/* Label & Description */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold tracking-tight truncate ${active ? 'text-violet-700' : 'text-slate-700'}`}>
                    {item.label}
                  </p>
                  <p className={`text-[11px] truncate ${active ? 'text-violet-500/80' : 'text-slate-400'}`}>{item.description}</p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Study Stats Card Removed */}

      {/* User Profile & Logout (Bottom of Sidebar) */}
      <div className="p-4 mt-4 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-3 bg-white hover:bg-slate-50 p-2.5 rounded-2xl border border-slate-200 transition-colors shadow-sm group">
          <div className="w-10 h-10 bg-linear-to-br from-violet-100 to-pink-100 border border-violet-200 rounded-xl flex items-center justify-center shadow-xs shrink-0">
            <User size={18} className="text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || "Student"}</p>
            <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wide truncate">
              {user?.role || "STUDENT"}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white/95 backdrop-blur-2xl border-r border-slate-200 z-50 overflow-hidden md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-2xl border-r border-slate-200 min-h-screen sticky top-0 overflow-hidden shrink-0 z-20">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
