import PropTypes from 'prop-types';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import Card from '../../common/Card';
import ProgressBar from '../../common/ProgressBar';
import { formatDate } from '../../../utils/formatters';

const ProgressChart = ({ course }) => {
  const { courseTitle, totalChapters, completedChapters, progressPercentage, chapters } = course;

  const getChapterIcon = (isCompleted) => {
    if (isCompleted) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  const getChapterStatus = (chapter) => {
    if (chapter.completed) {
      return {
        text: `Completed on ${formatDate(chapter.completedAt)}`,
        color: 'text-green-600',
      };
    }
    if (chapter.isAccessible) {
      return {
        text: 'Not Started',
        color: 'text-gray-500',
      };
    }
    return {
      text: 'Locked - Complete previous chapters',
      color: 'text-orange-500',
    };
  };

  return (
    <Card className="p-6">
      {/* Course Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{courseTitle}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            {completedChapters} of {totalChapters} chapters completed
          </span>
          <span>•</span>
          <span>{progressPercentage}% complete</span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-semibold text-indigo-600">{progressPercentage}%</span>
        </div>
        <ProgressBar progress={progressPercentage} size="lg" />
      </div>

      {/* Chapter Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chapter Progress</h3>
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Chapters */}
          <div className="space-y-6">
            {chapters.map((chapter, index) => {
              const status = getChapterStatus(chapter);
              return (
                <div key={chapter.chapterId} className="relative pl-10">
                  {/* Icon */}
                  <div className="absolute left-0 top-0 bg-white">
                    {getChapterIcon(chapter.completed)}
                  </div>

                  {/* Content */}
                  <div
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      chapter.completed
                        ? 'border-green-200 bg-green-50'
                        : chapter.isAccessible
                        ? 'border-gray-200 bg-white hover:border-indigo-300'
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Chapter {index + 1}: {chapter.chapterTitle}
                        </h4>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span className={status.color}>{status.text}</span>
                        </div>
                      </div>

                      {chapter.completed && (
                        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Complete
                        </div>
                      )}
                    </div>

                    {/* Chapter Description (if available) */}
                    {chapter.description && (
                      <p className="mt-2 text-sm text-gray-600">{chapter.description}</p>
                    )}

                    {/* Progress Bar for Current Chapter */}
                    {!chapter.completed && chapter.isAccessible && (
                      <div className="mt-3">
                        <ProgressBar progress={0} size="sm" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedChapters}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalChapters - completedChapters}
            </div>
            <div className="text-sm text-gray-600">Remaining</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

ProgressChart.propTypes = {
  course: PropTypes.shape({
    courseId: PropTypes.string.isRequired,
    courseTitle: PropTypes.string.isRequired,
    totalChapters: PropTypes.number.isRequired,
    completedChapters: PropTypes.number.isRequired,
    progressPercentage: PropTypes.number.isRequired,
    chapters: PropTypes.arrayOf(
      PropTypes.shape({
        chapterId: PropTypes.string.isRequired,
        chapterTitle: PropTypes.string.isRequired,
        description: PropTypes.string,
        completed: PropTypes.bool.isRequired,
        completedAt: PropTypes.string,
        isAccessible: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ProgressChart;
