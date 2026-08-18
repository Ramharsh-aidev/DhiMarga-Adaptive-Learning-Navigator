import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../utils/constants';

/**
 * Special route guard for mentor pending approval page
 * Only allows:
 * - Authenticated MENTOR users with approved = false/null
 * Blocks:
 * - STUDENT, ADMIN roles
 * - Approved MENTOR
 * - Unauthenticated users
 */
const PendingApprovalRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.toUpperCase();
  const approvalStatus = user?.approvalStatus;

  // Only MENTOR role can access this page
  if (userRole !== USER_ROLES.MENTOR) {
    // Redirect non-mentors to their respective dashboards
    if (userRole === USER_ROLES.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === USER_ROLES.STUDENT) {
      return <Navigate to="/student/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // If mentor is approved, redirect to mentor dashboard
  if (approvalStatus === 'APPROVED') {
    return <Navigate to="/mentor/dashboard" replace />;
  }

  // Mentor with pending/rejected approval - show pending page
  return children;
};

export default PendingApprovalRoute;
