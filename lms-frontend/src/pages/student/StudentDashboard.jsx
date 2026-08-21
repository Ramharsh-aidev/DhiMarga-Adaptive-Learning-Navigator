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
import NavigatorSummaryWidget from '../../components/ui/student/NavigatorSummaryWidget';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
        
        <NavigatorSummaryWidget />

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
