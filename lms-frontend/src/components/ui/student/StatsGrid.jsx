import { BookOpen, Award, TrendingUp, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';

const StatsGrid = ({ stats, navigatorStats }) => {
  const navigate = useNavigate();

  const statsConfig = [
    {
      icon: BookOpen,
      label: 'Enrolled Courses',
      value: stats.enrolledCourses.toString(),
      change: stats.enrolledCourses > 0 ? 'Active' : 'No courses yet',
      color: '#7c3aed',
      bgColor: 'bg-violet-50',
      onClick: () => navigate('/student/courses')
    },
    {
      icon: TrendingUp,
      label: 'Overall Progress',
      value: `${stats.overallProgress}%`,
      change: stats.overallProgress > 0 ? 'Keep going!' : 'Start learning',
      color: '#a855f7',
      bgColor: 'bg-purple-50',
      onClick: () => navigate('/student/progress')
    },
    {
      icon: Award,
      label: 'Certificates',
      value: stats.certificates.toString(),
      change: stats.certificates > 0 ? 'Earned' : 'Complete courses',
      color: '#ec4899',
      bgColor: 'bg-pink-50',
      onClick: () => navigate('/student/certificates')
    },
    {
      icon: Clock,
      label: 'Learning Hours',
      value: `${stats.learningHours}h`,
      change: stats.learningHours > 0 ? 'Total time' : 'Start now',
      color: '#10b981',
      bgColor: 'bg-green-50',
      onClick: () => navigate('/student/progress')
    }
  ];

  // Add Skills Mastered card only when navigator has data
  if (navigatorStats && navigatorStats.skillsMastered >= 0 && navigatorStats.activePaths > 0) {
    statsConfig.push({
      icon: Zap,
      label: 'Skills Mastered',
      value: navigatorStats.skillsMastered.toString(),
      change: navigatorStats.activePaths > 0
        ? `${navigatorStats.activePaths} active path${navigatorStats.activePaths > 1 ? 's' : ''}`
        : 'Start a path',
      color: '#8b5cf6',
      bgColor: 'bg-violet-50',
      onClick: () => navigate('/student/paths')
    });
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${statsConfig.length} gap-6 mb-8`}>
      {statsConfig.map((stat, index) => (
        <div
          key={stat.label}
          onClick={stat.onClick}
          className="cursor-pointer"
        >
          <StatCard {...stat} index={index} />
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
