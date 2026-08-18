import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/ui/student/EmptyState';
import { getAllUsers, approveMentor } from '../../services/adminService';
import { Search, Filter, Users, CheckCircle, XCircle } from 'lucide-react';

const UserManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [approvalFilter, setApprovalFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');
  const [approveModal, setApproveModal] = useState({ open: false, userId: null, userName: '' });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {};
      if (roleFilter !== 'ALL') {
        filters.role = roleFilter;
      }
      if (approvalFilter !== 'ALL') {
        filters.approvalStatus = approvalFilter;
      }

      const data = await getAllUsers(filters);
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to load users';
      setError(`Backend Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, approvalFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleApprove = async () => {
    try {
      await approveMentor(approveModal.userId);
      setSuccess(`${approveModal.userName} has been approved as a mentor!`);
      await fetchUsers();
      setApproveModal({ open: false, userId: null, userName: '' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error approving mentor:', err);
      setError(err.response?.data?.message || 'Failed to approve mentor');
      setApproveModal({ open: false, userId: null, userName: '' });
    }
  };

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'MENTOR':
        return 'primary';
      case 'STUDENT':
        return 'success';
      default:
        return 'default';
    }
  };

  const getApprovalBadge = (approvalStatus) => {
    if (approvalStatus === 'APPROVED') {
      return <Badge variant="success">Approved</Badge>;
    } else if (approvalStatus === 'PENDING') {
      return <Badge variant="warning">Pending</Badge>;
    } else if (approvalStatus === 'REJECTED') {
      return <Badge variant="danger">Rejected</Badge>;
    }
    return <Badge variant="default">N/A</Badge>;
  };

  if (loading) {
    return <PageLoader text="Loading Users..." />;
  }

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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            {users.length} total users
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MENTOR">Mentor</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>

            {/* Approval Filter */}
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gray-400" />
              <select
                value={approvalFilter}
                onChange={(e) => setApprovalFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('name')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    sortBy === 'name'
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Name
                </button>
                <button
                  onClick={() => setSortBy('role')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    sortBy === 'role'
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Role
                </button>
                <button
                  onClick={() => setSortBy('date')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    sortBy === 'date'
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Date Joined
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(roleFilter !== 'ALL' || approvalFilter !== 'ALL' || searchTerm) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {roleFilter !== 'ALL' && (
                  <Badge variant="primary">
                    Role: {roleFilter}
                    <button
                      onClick={() => setRoleFilter('ALL')}
                      className="ml-2 hover:text-white"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {approvalFilter !== 'ALL' && (
                  <Badge variant="warning">
                    Status: {approvalFilter}
                    <button
                      onClick={() => setApprovalFilter('ALL')}
                      className="ml-2 hover:text-white"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="default">
                    Search: &quot;{searchTerm}&quot;
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setRoleFilter('ALL');
                    setApprovalFilter('ALL');
                    setSearchTerm('');
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Users List */}
        {filteredUsers.length > 0 ? (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'MENTOR' ? getApprovalBadge(user.approvalStatus) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'MENTOR' && user.approvalStatus === 'PENDING' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              setApproveModal({ open: true, userId: user.id, userName: user.name })
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <EmptyState
            icon={Users}
            title="No users found"
            message={searchTerm ? `No users match "${searchTerm}"` : 'No users in the system'}
          />
        )}
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={approveModal.open}
        onClose={() => setApproveModal({ open: false, userId: null, userName: '' })}
        title="Approve Mentor"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to approve <strong>{approveModal.userName}</strong> as a mentor?
          </p>
          <p className="text-sm text-gray-500">
            They will be able to create courses and manage students.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setApproveModal({ open: false, userId: null, userName: '' })}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApprove}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Mentor
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default UserManagement;
