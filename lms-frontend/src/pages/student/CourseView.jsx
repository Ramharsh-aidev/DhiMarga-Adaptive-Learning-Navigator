import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import CourseHeader from '../../components/ui/student/CourseHeader';
import ChapterList from '../../components/ui/student/ChapterList';
import EmptyState from '../../components/ui/student/EmptyState';
import { getCourseProgress } from '../../services/progressService';
import { getChaptersWithLockStatus } from '../../utils/courseHelpers';

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState(null);

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCourseProgress(courseId);
      setCourseData(response);
    } catch (err) {
      console.error('Error fetching course data:', err);
      setError(err.response?.data?.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleChapterClick = (chapterId) => {
    navigate(`/student/courses/${courseId}/chapters/${chapterId}`);
  };

  const handleViewCertificate = () => {
    navigate(`/student/credentials?courseId=${courseId}`);
  };

  if (loading) {
    return <PageLoader text="Loading course details..." />;
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6 max-w-7xl mx-auto">
          <Alert
            variant="danger"
            title="Error"
            message={error}
            className="mb-6"
          />
          <Card padding="lg">
            <EmptyState
              icon={BookOpen}
              title="Failed to Load Course"
              description="Unable to load course details. Please try again."
              actionLabel="Back to Courses"
              onAction={() => navigate('/student/courses')}
            />
          </Card>
        </div>
      </Layout>
    );
  }

  if (!courseData) {
    return (
      <Layout>
        <div className="p-6 max-w-7xl mx-auto">
          <Card padding="lg">
            <EmptyState
              icon={BookOpen}
              title="Course Not Found"
              description="The course you're looking for doesn't exist or you don't have access."
              actionLabel="Back to Courses"
              onAction={() => navigate('/student/courses')}
            />
          </Card>
        </div>
      </Layout>
    );
  }

  const chaptersWithLocks = getChaptersWithLockStatus(courseData.chapters || []);

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <CourseHeader
          course={courseData}
          onViewCertificate={handleViewCertificate}
        />

        <ChapterList
          chapters={chaptersWithLocks}
          title="Course Content"
          subtitle={`${courseData.totalChapters} chapter${courseData.totalChapters !== 1 ? 's' : ''}`}
          onChapterClick={handleChapterClick}
          onBackClick={() => navigate('/student/courses')}
        />
      </div>
    </Layout>
  );
};

export default CourseView;
