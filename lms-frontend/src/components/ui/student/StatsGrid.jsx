import { BookOpen, Award, TrendingUp, Clock } from 'lucide-react';
import StatCard from './StatCard';

const StatsGrid = ({ stats }) => {
  const statsConfig = [
    {
      icon: BookOpen,
      label: 'Enrolled Courses',
      value: stats.enrolledCourses.toString(),
      change: stats.enrolledCourses > 0 ? 'Active' : 'No courses yet',
      color: '#6366f1',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: TrendingUp,
      label: 'Overall Progress',
      value: `${stats.overallProgress}%`,
      change: stats.overallProgress > 0 ? 'Keep going!' : 'Start learning',
      color: '#a855f7',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Award,
      label: 'Certificates',
      value: stats.certificates.toString(),
      change: stats.certificates > 0 ? 'Earned' : 'Complete courses',
      color: '#f59e0b',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Clock,
      label: 'Learning Hours',
      value: `${stats.learningHours}h`,
      change: stats.learningHours > 0 ? 'Total time' : 'Start now',
      color: '#10b981',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((stat, index) => (
        <StatCard key={stat.label} {...stat} index={index} />
      ))}
    </div>
  );
};

export default StatsGrid;
