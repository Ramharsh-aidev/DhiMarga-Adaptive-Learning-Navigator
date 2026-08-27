import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import WelcomeSection from '../../components/ui/student/WelcomeSection';
import StatsGrid from '../../components/ui/student/StatsGrid';
import CoursesSection from '../../components/ui/student/CoursesSection';
import TasksSection from '../../components/ui/student/TasksSection';
import NavigatorSummaryWidget from '../../components/ui/student/NavigatorSummaryWidget';
import PathHealthWidget from '../../components/ui/student/PathHealthWidget';
import StreakCounter from '../../components/ui/student/StreakCounter';
import AIInterventionModal from '../../components/ui/student/AIInterventionModal';
import useDashboardData from '../../hooks/useDashboardData';
import { RefreshCw } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    courseStats,
    navigatorStats,
    recentCourses,
    upcomingTasks,
    loading,
    error,
    lastUpdatedAt,
    refresh
  } = useDashboardData();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  if (loading) {
    return <PageLoader text="Loading Dashboard..." />;
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {error && (
          <Alert
            variant="danger"
            title="Error"
            message={error}
            onClose={() => {}}
            className="mb-6"
          />
        )}

        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <WelcomeSection userName={user?.name} />
            <StreakCounter streak={user?.currentStreak || 0} />
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400 mt-2 shrink-0">
            {lastUpdatedAt && (
              <span className="hidden sm:inline">Updated {new Date(lastUpdatedAt).toLocaleTimeString()}</span>
            )}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-50 font-medium"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Navigator widget — only shown if at least one path is active */}
        {navigatorStats.activePaths > 0 && (
          <div className="flex flex-col gap-6 mb-8">
            <NavigatorSummaryWidget />
            <PathHealthWidget />
          </div>
        )}

        <StatsGrid stats={courseStats} navigatorStats={navigatorStats} />

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
        
        <AIInterventionModal />
      </div>
    </Layout>
  );
};

export default StudentDashboard;
