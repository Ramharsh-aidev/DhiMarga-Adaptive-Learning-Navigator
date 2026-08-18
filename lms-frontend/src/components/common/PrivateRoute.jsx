import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../utils/constants';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
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

  // Check mentor approval status - redirect to pending approval page if not approved
  const userRole = user?.role?.toUpperCase();
  if (userRole === USER_ROLES.MENTOR) {
    const approvalStatus = user?.approvalStatus;
    // If mentor is not approved (PENDING or REJECTED), redirect to pending approval page
    if (approvalStatus !== 'APPROVED') {
      return <Navigate to="/mentor/pending-approval" replace />;
    }
  }

  // Check role authorization if roles are specified
  if (allowedRoles.length > 0) {
    // Convert role to uppercase for case-insensitive comparison
    const normalizedAllowedRoles = allowedRoles.map(role => role.toUpperCase());
    
    if (!normalizedAllowedRoles.includes(userRole)) {
      console.error('Authorization failed:', { 
        userRole: user?.role, 
        normalizedUserRole: userRole,
        allowedRoles,
        normalizedAllowedRoles 
      });
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
