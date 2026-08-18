import { CheckCircle2, BookOpen } from 'lucide-react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';

const ChapterInfo = ({ chapter, courseData, onComplete, completing }) => {
  return (
    <Card padding="lg" className="mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl font-bold text-indigo-600">
              Chapter {chapter.orderIndex}
            </span>
            {chapter.completed && (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {chapter.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {chapter.description}
          </p>
        </div>

        {!chapter.completed && (
          <Button
            variant="primary"
            leftIcon={<CheckCircle2 className="w-5 h-5" />}
            onClick={onComplete}
            loading={completing}
            disabled={completing}
          >
            Mark as Complete
          </Button>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span>
            Part of <strong>{courseData?.courseTitle}</strong> by {courseData?.mentorName}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ChapterInfo;
