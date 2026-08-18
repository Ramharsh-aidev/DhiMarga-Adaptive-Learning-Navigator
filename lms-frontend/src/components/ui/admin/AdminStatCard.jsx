import Card from '../../common/Card';

const AdminStatCard = ({ icon, title, value, subtitle, color = 'blue' }) => {
  const Icon = icon;
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
            <Icon className="w-4 h-4" />
            <span>{title}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-4 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default AdminStatCard;
