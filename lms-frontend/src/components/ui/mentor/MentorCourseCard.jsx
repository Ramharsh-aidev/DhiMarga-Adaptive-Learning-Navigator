import Card from '../../common/Card';
import Button from '../../common/Button';
import EmptyState from '../student/EmptyState';
import { PlayCircle, Edit, Trash2, Users, BookOpen } from 'lucide-react';

const MentorCourseCard = ({ course, onEdit, onDelete, onManageChapters, onAssign }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        {/* Course Icon */}
        <div className="p-3 bg-blue-100 rounded-lg shrink-0">
          <PlayCircle className="w-8 h-8 text-blue-600" />
        </div>

        {/* Course Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(course.updatedAt).toLocaleDateString()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(course.id)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onManageChapters(course.id)}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Chapters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAssign(course.id)}
            >
              <Users className="w-4 h-4 mr-1" />
              Assign
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(course.id)}
              className="text-red-600 hover:text-red-700 hover:border-red-600"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MentorCourseCard;
