import Card from '../../common/Card';
import Button from '../../common/Button';
import EmptyState from '../student/EmptyState';
import Badge from '../../common/Badge';
import { UserCheck, X, CheckCircle, Clock } from 'lucide-react';

const PendingApprovalsSection = ({ pendingUsers, onApprove, onReject }) => {
  if (!pendingUsers || pendingUsers.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Mentor Approvals</h2>
        <EmptyState
          icon={UserCheck}
          title="No pending approvals"
          message="All mentor applications have been processed"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Pending Mentor Approvals</h2>
        <Badge variant="warning">
          <Clock className="w-3 h-3 mr-1" />
          {pendingUsers.length} Pending
        </Badge>
      </div>

      <div className="space-y-4">
        {pendingUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-linear-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Applied: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onApprove(user.id)}
                title="Approve as Mentor"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(user.id)}
                title="Reject Application"
                className="text-red-600 hover:text-red-700 hover:border-red-600"
              >
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PendingApprovalsSection;
