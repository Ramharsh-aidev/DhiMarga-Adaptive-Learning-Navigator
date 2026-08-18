import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import Card from '../../common/Card';
import ProgressBar from '../../common/ProgressBar';
import Button from '../../common/Button';

const CourseCard = ({ course, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
    >
      <Card hover className="group">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="w-16 h-16 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shrink-0">
            {course.thumbnail}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 mb-1 truncate">
              {course.title}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <span>{course.chaptersCompleted}/{course.totalChapters} chapters</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{course.lastAccessed}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <ProgressBar
              progress={course.progress}
              size="sm"
              showPercentage
            />
          </div>

          {/* Continue Button */}
          <div className="flex items-center">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Play size={16} />}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
