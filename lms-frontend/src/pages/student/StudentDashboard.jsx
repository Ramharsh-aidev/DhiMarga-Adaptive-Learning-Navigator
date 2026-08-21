import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import WelcomeSection from '../../components/ui/student/WelcomeSection';
import StatsGrid from '../../components/ui/student/StatsGrid';
import CoursesSection from '../../components/ui/student/CoursesSection';
import TasksSection from '../../components/ui/student/TasksSection';
import { getMyProgress } from '../../services/progressService';
import { calculateStats, getRecentCourses, getUpcomingTasks } from '../../utils/dashboardHelpers';
import { useNavigator } from '../../context/NavigatorContext';
import { Compass, ArrowRight } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state: navigatorState } = useNavigator();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    overallProgress: 0,
    certificates: 0,
    learningHours: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const progressResponse = await getMyProgress();
      setProgressData(progressResponse || []);
      setStats(calculateStats(progressResponse));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader text="Loading Dashboard..." />;
  }

  const recentCourses = getRecentCourses(progressData);
  const upcomingTasks = getUpcomingTasks(progressData);

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

        <WelcomeSection userName={user?.name} />
        
        {navigatorState?.goal && (
          <div className="mb-6 bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Compass className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Navigator: {navigatorState.goal.targetRole.replace('_', ' ')}</h3>
                <p className="text-indigo-100 text-sm mt-1">
                  {navigatorState.pathStatus === 'active' || navigatorState.pathStatus === 'blocked' 
                    ? 'Your personalized learning journey is active.' 
                    : 'You have a pending learning path.'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => navigate(navigatorState.pathStatus === 'planning' ? '/student/navigator/plan' : '/student/navigator/dashboard')}
              className="px-5 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center gap-2 shrink-0"
            >
              {navigatorState.pathStatus === 'planning' ? 'View Plan' : 'Continue Journey'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CoursesSection 
              courses={recentCourses}
              onCourseClick={(id) => navigate(`/student/courses/${id}`)}
              onViewAll={() => navigate('/student/courses')}
            />
          </div>

          <div>
            <TasksSection 
              tasks={upcomingTasks}
              onTaskClick={(id) => navigate(`/student/courses/${id}`)}
              onViewAll={() => navigate('/student/courses')}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
