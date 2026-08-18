import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import CourseFilters from '../../components/ui/student/CourseFilters';
import CourseListSection from '../../components/ui/student/CourseListSection';
import EmptyState from '../../components/ui/student/EmptyState';
import { getMyProgress } from '../../services/progressService';
import { filterAndSortCourses } from '../../utils/courseHelpers';

const MyCourses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'recent'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyProgress();
      setCourses(response || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader text="Loading courses..." />;
  }

  const filteredCourses = filterAndSortCourses(courses, filters);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {error && (
          <Alert
            variant="danger"
            title="Error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">
            {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled
          </p>
        </div>

        {courses.length > 0 ? (
          <>
            <CourseFilters filters={filters} onFilterChange={setFilters} />
            <CourseListSection 
              courses={filteredCourses} 
              onCourseClick={(courseId) => navigate(`/student/courses/${courseId}`)}
            />
          </>
        ) : (
          <Card padding="lg">
            <EmptyState
              icon={BookOpen}
              title="No Courses Yet"
              description="You haven't been assigned to any courses yet. Contact your mentor to get started."
              actionLabel="Back to Dashboard"
              onAction={() => navigate('/student/dashboard')}
            />
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MyCourses;
