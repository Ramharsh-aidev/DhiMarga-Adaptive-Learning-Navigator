import Card from '../../common/Card';
import Badge from '../../common/Badge';

const StatCard = ({ icon, label, value, change, color, bgColor }) => {
  const Icon = icon;
  return (
    <Card hover className="h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <h3 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            {value}
          </h3>
          <Badge variant="success" size="sm">
            {change}
          </Badge>
        </div>
        <div
          className={`p-3 rounded-xl ${bgColor} shadow-lg`}
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
          }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
