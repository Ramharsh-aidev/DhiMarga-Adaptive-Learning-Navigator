import Card from '../../common/Card';
import Button from '../../common/Button';
import EmptyState from '../student/EmptyState';
import { PlayCircle, Edit, Trash2, Users, BookOpen } from 'lucide-react';

const RecentCoursesSection = ({ courses, onEdit, onDelete, onManageChapters, onAssign, onViewAll }) => {
  if (!courses || courses.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          message="Create your first course to get started"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Courses</h2>
        <Button variant="text" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-blue-100 rounded-lg">
                <PlayCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {course.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(course.id)}
                title="Edit Course"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onManageChapters(course.id)}
                title="Manage Chapters"
              >
                <BookOpen className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAssign(course.id)}
                title="Assign to Students"
              >
                <Users className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(course.id)}
                title="Delete Course"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentCoursesSection;
