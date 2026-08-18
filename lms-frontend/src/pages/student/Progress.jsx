import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BookOpen, Award, Target } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/ui/student/EmptyState';
import ProgressChart from '../../components/ui/student/ProgressChart';
import { getMyProgress, getCourseProgress } from '../../services/progressService';

const Progress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [detailedProgress, setDetailedProgress] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyProgress();
      setCourses(response || []);
      
      // Auto-select first course if available
      if (response && response.length > 0 && !selectedCourseId) {
        setSelectedCourseId(response[0].courseId);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError(err.response?.data?.message || 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCourseDetails(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchCourseDetails = async (courseId) => {
    try {
      setLoadingDetails(true);
      const response = await getCourseProgress(courseId);
      setDetailedProgress(response);
    } catch (err) {
      console.error('Error fetching course details:', err);
      setError(err.response?.data?.message || 'Failed to load course details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const calculateOverallStats = () => {
    if (courses.length === 0) return { totalCourses: 0, avgProgress: 0, totalCompleted: 0 };
    
    const totalCourses = courses.length;
    const avgProgress = Math.round(
      courses.reduce((sum, course) => sum + (course.progressPercentage || 0), 0) / totalCourses
    );
    const totalCompleted = courses.filter(course => course.progressPercentage === 100).length;
    
    return { totalCourses, avgProgress, totalCompleted };
  };

  if (loading) return <PageLoader text="Loading progress..." />;

  const stats = calculateOverallStats();

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Progress</h1>
          <p className="text-gray-600">Track your learning journey and achievements</p>
        </div>

        {courses.length > 0 ? (
          <>
            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
                    <div className="text-sm text-gray-600">Total Courses</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.avgProgress}%</div>
                    <div className="text-sm text-gray-600">Avg Progress</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalCompleted}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.totalCourses - stats.totalCompleted}
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Course Selection */}
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Course</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {courses.map((course) => (
                  <button
                    key={course.courseId}
                    onClick={() => setSelectedCourseId(course.courseId)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedCourseId === course.courseId
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{course.courseTitle}</h3>
                    <div className="text-sm text-gray-600 mb-2">
                      {course.completedChapters} / {course.totalChapters} chapters
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progressPercentage}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Detailed Progress Chart */}
            {loadingDetails ? (
              <Card className="p-12">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                  <span className="ml-3 text-gray-600">Loading chapter details...</span>
                </div>
              </Card>
            ) : detailedProgress ? (
              <>
                <ProgressChart course={detailedProgress} />
                
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/student/courses/${selectedCourseId}`)}
                  >
                    Continue Learning
                  </Button>
                </div>
              </>
            ) : null}
          </>
        ) : (
          <Card className="p-12">
            <EmptyState
              icon={BookOpen}
              title="No Progress Yet"
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

export default Progress;
