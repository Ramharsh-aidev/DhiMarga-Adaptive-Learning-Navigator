import { BookOpen, ArrowRight } from 'lucide-react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import CourseCard from './CourseCard';
import EmptyState from './EmptyState';

const CoursesSection = ({ courses, onCourseClick, onViewAll }) => {
  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Pick up where you left off</p>
        </div>
        {courses.length > 0 && (
          <Button 
            variant="ghost" 
            rightIcon={<ArrowRight size={16} />}
            onClick={onViewAll}
          >
            View All
          </Button>
        )}
      </div>

      {courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((course, index) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              index={index}
              onClick={() => onCourseClick(course.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No Courses Yet"
          description="You haven't been assigned to any courses yet. Contact your mentor to get started."
          actionLabel="Browse Courses"
          onAction={onViewAll}
        />
      )}
    </Card>
  );
};

export default CoursesSection;
