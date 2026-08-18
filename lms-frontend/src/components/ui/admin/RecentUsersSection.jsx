import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { Users, Clock } from 'lucide-react';

const RecentUsersSection = ({ users }) => {
  if (!users || users.length === 0) {
    return null;
  }

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

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Users</h2>
      <div className="space-y-4">
        {users.slice(0, 5).map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentUsersSection;
