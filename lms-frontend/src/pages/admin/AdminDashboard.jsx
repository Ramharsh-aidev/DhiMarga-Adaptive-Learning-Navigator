import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import AdminStatCard from '../../components/ui/admin/AdminStatCard';
import PendingApprovalsSection from '../../components/ui/admin/PendingApprovalsSection';
import RecentUsersSection from '../../components/ui/admin/RecentUsersSection';
import Modal from '../../components/common/Modal';
import { getAllUsers, approveMentor } from '../../services/adminService';
import { Users, UserCheck, BookOpen, Award } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [users, setUsers] = useState([]);
  const [rejectModal, setRejectModal] = useState({ open: false, userId: null });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const usersData = await getAllUsers();
      // Data already has approvalStatus from backend
      setUsers(usersData || []);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to load dashboard data';
      setError(`Backend Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      setError(null);
      await approveMentor(userId);
      setSuccess('Mentor approved successfully! User can now access the mentor dashboard.');
      await fetchDashboardData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error approving mentor:', err);
      setError(err.response?.data?.message || 'Failed to approve mentor');
    }
  };

  const handleReject = (userId) => {
    setRejectModal({ open: true, userId });
  };

  const confirmReject = () => {
    // In a real app, you'd have a reject endpoint
    setRejectModal({ open: false, userId: null });
    setError('Reject functionality not yet implemented');
  };

  if (loading) {
    return <PageLoader text="Loading Dashboard..." />;
  }

  const stats = {
    totalUsers: users.length,
    students: users.filter((u) => u.role === 'STUDENT').length,
    mentors: users.filter((u) => u.role === 'MENTOR' && u.approvalStatus === 'APPROVED').length,
    pendingApprovals: users.filter((u) => u.role === 'MENTOR' && u.approvalStatus === 'PENDING').length,
  };

  const pendingUsers = users.filter((u) => u.role === 'MENTOR' && u.approvalStatus === 'PENDING');
  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {error && (
          <Alert
            variant="danger"
            title="Error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {success && (
          <Alert
            variant="success"
            title="Success"
            message={success}
            onClose={() => setSuccess(null)}
            className="mb-6"
          />
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            System overview and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            subtitle="All registered users"
            color="blue"
          />
          <AdminStatCard
            icon={BookOpen}
            title="Students"
            value={stats.students}
            subtitle="Active students"
            color="green"
          />
          <AdminStatCard
            icon={Award}
            title="Mentors"
            value={stats.mentors}
            subtitle="Approved mentors"
            color="purple"
          />
          <AdminStatCard
            icon={UserCheck}
            title="Pending Approvals"
            value={stats.pendingApprovals}
            subtitle="Awaiting review"
            color="orange"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PendingApprovalsSection
              pendingUsers={pendingUsers}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>

          <div>
            <RecentUsersSection users={recentUsers} />
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false, userId: null })}
        title="Reject Application"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to reject this mentor application?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setRejectModal({ open: false, userId: null })}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmReject}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default AdminDashboard;
