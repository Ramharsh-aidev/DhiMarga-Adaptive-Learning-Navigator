import { Award, BookOpen, User } from 'lucide-react';
import Card from '../../common/Card';
import ProgressBar from '../../common/ProgressBar';
import Button from '../../common/Button';

const CourseHeader = ({ course, onViewCertificate }) => {
  const {
    courseTitle,
    courseThumbnailUrl,
    mentorName,
    progressPercentage,
    totalChapters,
    completedChapters
  } = course;

  const isCompleted = progressPercentage === 100;

  // Generate thumbnail from course title if not available
  const getThumbnail = (title) => {
    const keywords = {
      'java': '☕',
      'python': '🐍',
      'javascript': '📜',
      'react': '⚛️',
      'node': '🟢',
      'spring': '🍃',
      'database': '🗄️',
      'sql': '📊',
      'web': '🌐',
      'mobile': '📱',
      'cloud': '☁️',
      'docker': '🐳',
      'kubernetes': '⚓',
      'default': '📚'
    };

    const lowerTitle = title.toLowerCase();
    for (const [key, emoji] of Object.entries(keywords)) {
      if (lowerTitle.includes(key)) return emoji;
    }
    return keywords.default;
  };

  return (
    <Card padding="lg" className="mb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Thumbnail */}
        <div className="shrink-0">
          {courseThumbnailUrl ? (
            <img
              src={courseThumbnailUrl}
              alt={courseTitle}
              className="w-32 h-32 rounded-lg object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-6xl">
              {getThumbnail(courseTitle)}
            </div>
          )}
        </div>

        {/* Course Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {courseTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Mentor: {mentorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>
                {completedChapters} / {totalChapters} Chapters Completed
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                Course Progress
              </span>
              <span className="font-semibold text-indigo-600">
                {progressPercentage}%
              </span>
            </div>
            <ProgressBar value={progressPercentage} />
          </div>

          {/* Certificate Button */}
          {isCompleted && (
            <Button
              variant="primary"
              leftIcon={<Award className="w-5 h-5" />}
              onClick={onViewCertificate}
            >
              View Certificate
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CourseHeader;