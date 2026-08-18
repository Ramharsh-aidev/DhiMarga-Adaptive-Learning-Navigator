import { Search, SlidersHorizontal, BookOpen, Clock, Award } from 'lucide-react';
import Card from '../../common/Card';
import ProgressBar from '../../common/ProgressBar';
import Badge from '../../common/Badge';
import Button from '../../common/Button';

const CourseListCard = ({ course, onClick }) => {
  const getStatusBadge = () => {
    if (course.progressPercentage === 100) {
      return <Badge variant="success" leftIcon={<Award size={14} />}>Completed</Badge>;
    }
    if (course.progressPercentage > 0) {
      return <Badge variant="warning" leftIcon={<Clock size={14} />}>In Progress</Badge>;
    }
    return <Badge variant="secondary">Not Started</Badge>;
  };

  const getThumbnail = () => {
    const title = course.courseTitle?.toLowerCase() || '';
    const emojis = {
      'react': '⚛️', 'node': '🟢', 'javascript': '💛', 'typescript': '💙',
      'java': '☕', 'python': '🐍', 'spring': '🍃', 'database': '🗄️', 'api': '🔌'
    };
    const key = Object.keys(emojis).find(k => title.includes(k));
    return emojis[key] || '📚';
  };

  return (
    <Card hover className="cursor-pointer" onClick={onClick}>
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-linear-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-4xl shrink-0">
          {getThumbnail()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors truncate">
              {course.courseTitle}
            </h3>
            {getStatusBadge()}
          </div>

          <p className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Mentor:</span> {course.mentorName}
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {course.completedChapters} of {course.totalChapters} chapters completed
              </span>
              <span className="font-semibold text-indigo-600">
                {Math.round(course.progressPercentage)}%
              </span>
            </div>
            <ProgressBar 
              progress={course.progressPercentage} 
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-500">
              Last activity: {new Date(course.lastActivityAt).toLocaleDateString()}
            </span>
            <Button variant="ghost" size="sm">
              {course.progressPercentage === 100 ? 'View Certificate' : 'Continue Learning'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseListCard;
