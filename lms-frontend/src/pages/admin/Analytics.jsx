import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import AdminStatCard from '../../components/ui/admin/AdminStatCard';
import { getAllUsers } from '../../services/adminService';
import { Users, BookOpen, Award, TrendingUp, Activity, Clock } from 'lucide-react';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersData] = await Promise.all([
        getAllUsers(),
        // We'd fetch courses from all mentors if we had that endpoint
      ]);

      setUsers(usersData || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader text="Loading Analytics..." />;
  }

  const stats = {
    totalUsers: users.length,
    newUsersThisMonth: users.filter((u) => {
      const userDate = new Date(u.createdAt);
      const now = new Date();
      return (
        userDate.getMonth() === now.getMonth() &&
        userDate.getFullYear() === now.getFullYear()
      );
    }).length,
    activeStudents: users.filter((u) => u.role === 'STUDENT').length,
    activeMentors: users.filter((u) => u.role === 'MENTOR' && u.approved === true).length,
  };

  const usersByRole = {
    students: users.filter((u) => u.role === 'STUDENT').length,
    mentors: users.filter((u) => u.role === 'MENTOR' && u.approved === true).length,
    pendingMentors: users.filter((u) => u.role === 'MENTOR' && u.approved === null).length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
  };

  const recentActivity = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600 mt-2">System statistics and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            subtitle="All time"
            color="blue"
          />
          <AdminStatCard
            icon={TrendingUp}
            title="New Users"
            value={stats.newUsersThisMonth}
            subtitle="This month"
            color="green"
          />
          <AdminStatCard
            icon={BookOpen}
            title="Active Students"
            value={stats.activeStudents}
            subtitle="Learning now"
            color="purple"
          />
          <AdminStatCard
            icon={Award}
            title="Active Mentors"
            value={stats.activeMentors}
            subtitle="Teaching now"
            color="orange"
          />
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Distribution */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Distribution
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Students</span>
                  <span className="text-sm font-bold text-gray-900">{usersByRole.students}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(usersByRole.students / stats.totalUsers) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Approved Mentors</span>
                  <span className="text-sm font-bold text-gray-900">{usersByRole.mentors}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${(usersByRole.mentors / stats.totalUsers) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Pending Mentors</span>
                  <span className="text-sm font-bold text-gray-900">{usersByRole.pendingMentors}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${(usersByRole.pendingMentors / stats.totalUsers) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Admins</span>
                  <span className="text-sm font-bold text-gray-900">{usersByRole.admins}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${(usersByRole.admins / stats.totalUsers) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent User Registrations
            </h2>
            <div className="space-y-3 max-h-75 overflow-y-auto">
              {recentActivity.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
