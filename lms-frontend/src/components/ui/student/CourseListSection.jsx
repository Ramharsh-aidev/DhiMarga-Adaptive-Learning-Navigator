import { BookOpen } from 'lucide-react';
import Card from '../../common/Card';
import CourseListCard from './CourseListCard';
import EmptyState from './EmptyState';

const CourseListSection = ({ courses, onCourseClick }) => {
  if (courses.length === 0) {
    return (
      <Card padding="lg">
        <EmptyState
          icon={BookOpen}
          title="No Courses Found"
          description="Try adjusting your filters to see more courses."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <CourseListCard
          key={course.courseId}
          course={course}
          onClick={() => onCourseClick(course.courseId)}
        />
      ))}
    </div>
  );
};

export default CourseListSection;
