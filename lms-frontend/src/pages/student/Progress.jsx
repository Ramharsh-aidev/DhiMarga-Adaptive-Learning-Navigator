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
      courses.reduce((sum, course) => sum + (course.completionPercentage || 0), 0) / totalCourses
    );
    const totalCompleted = courses.filter(course => course.completionPercentage === 100).length;
    
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

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-600 font-bold mb-2 uppercase tracking-wider text-sm">
              <BookOpen size={18} />
              Mentor-Led Track
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Industry Progress</h1>
            <p className="text-slate-500 font-medium">Track your achievements in mentor-led and standard courses</p>
          </div>
        </div>

        {courses.length > 0 ? (
          <>
            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-800">{stats.totalCourses}</div>
                  <div className="text-sm font-bold text-slate-500">Total Courses</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-800">{stats.avgProgress}%</div>
                  <div className="text-sm font-bold text-slate-500">Avg Progress</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-800">{stats.totalCompleted}</div>
                  <div className="text-sm font-bold text-slate-500">Completed</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-800">
                    {stats.totalCourses - stats.totalCompleted}
                  </div>
                  <div className="text-sm font-bold text-slate-500">In Progress</div>
                </div>
              </div>
            </div>

            {/* Course Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Select Course</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <button
                    key={course.courseId}
                    onClick={() => setSelectedCourseId(course.courseId)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      selectedCourseId === course.courseId
                        ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <h3 className="font-bold text-slate-900 mb-2 truncate">{course.courseTitle}</h3>
                    <div className="text-sm font-medium text-slate-500 mb-3">
                      {course.completedChapters} / {course.totalChapters} modules
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.completionPercentage}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Progress Chart */}
            {loadingDetails ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4" />
                  <span className="text-sm font-medium">Loading chapter details...</span>
                </div>
              </div>
            ) : detailedProgress ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <ProgressChart course={detailedProgress} />
                
                <div className="mt-8 flex justify-center border-t border-slate-100 pt-6">
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/student/courses/${selectedCourseId}`)}
                    className="px-8 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Resume Course
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 shadow-sm">
            <EmptyState
              icon={BookOpen}
              title="No Course Progress Yet"
              description="You haven't been assigned to any industry-led courses yet. Contact your mentor to get started."
              actionLabel="Back to Dashboard"
              onAction={() => navigate('/student/dashboard')}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Progress;
