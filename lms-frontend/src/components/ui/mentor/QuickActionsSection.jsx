import Card from '../../common/Card';
import Button from '../../common/Button';
import { Plus, BookOpen, Users, BarChart } from 'lucide-react';

const QuickActionsSection = ({ onCreateCourse, onManageCourses, onViewStudents, onViewAnalytics }) => {
  const actions = [
    {
      icon: Plus,
      title: 'Create Course',
      description: 'Create a new course',
      color: 'blue',
      onClick: onCreateCourse,
    },
    {
      icon: BookOpen,
      title: 'My Courses',
      description: 'Manage your courses',
      color: 'green',
      onClick: onManageCourses,
    },
    {
      icon: Users,
      title: 'Students',
      description: 'View enrolled students',
      color: 'purple',
      onClick: onViewStudents,
    },
    {
      icon: BarChart,
      title: 'Analytics',
      description: 'View course analytics',
      color: 'orange',
      onClick: onViewAnalytics,
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    orange: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-lg transition-colors text-left ${colorClasses[action.color]}`}
          >
            <div className="flex items-center gap-3">
              <action.icon className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm opacity-80">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActionsSection;
