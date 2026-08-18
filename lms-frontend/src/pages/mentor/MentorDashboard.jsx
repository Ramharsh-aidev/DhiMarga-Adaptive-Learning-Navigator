import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import MentorStatCard from '../../components/ui/mentor/MentorStatCard';
import RecentCoursesSection from '../../components/ui/mentor/RecentCoursesSection';
import QuickActionsSection from '../../components/ui/mentor/QuickActionsSection';
import Modal from '../../components/common/Modal';
import { getMentorCourses, deleteCourse } from '../../services/courseService';
import { BookOpen, Users, Video, Award } from 'lucide-react';

const MentorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, courseId: null });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const coursesData = await getMentorCourses();
      setCourses(coursesData || []);
    } catch (err) {
      console.error('Error fetching mentor dashboard:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await deleteCourse(deleteModal.courseId);
      setCourses(courses.filter((c) => c.id !== deleteModal.courseId));
      setDeleteModal({ open: false, courseId: null });
    } catch (err) {
      console.error('Error deleting course:', err);
      setError(err.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) {
    return <PageLoader text="Loading Dashboard..." />;
  }

  const stats = {
    totalCourses: courses.length,
    totalChapters: 0, // Will be calculated from chapters
    totalStudents: 0, // Will come from enrollment data
    completionRate: 0,
  };

  const recentCourses = courses.slice(0, 5);

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

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your courses today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MentorStatCard
            icon={BookOpen}
            title="Total Courses"
            value={stats.totalCourses}
            color="blue"
          />
          <MentorStatCard
            icon={Video}
            title="Total Chapters"
            value={stats.totalChapters}
            color="green"
          />
          <MentorStatCard
            icon={Users}
            title="Total Students"
            value={stats.totalStudents}
            color="purple"
          />
          <MentorStatCard
            icon={Award}
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            color="orange"
          />
        </div>

        {/* Quick Actions and Recent Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentCoursesSection
              courses={recentCourses}
              onEdit={(id) => navigate(`/mentor/courses/${id}/edit`)}
              onDelete={(id) => setDeleteModal({ open: true, courseId: id })}
              onManageChapters={(id) => navigate(`/mentor/courses/${id}/chapters`)}
              onAssign={(id) => navigate(`/mentor/courses/${id}/assign`)}
              onViewAll={() => navigate('/mentor/courses')}
            />
          </div>

          <div>
            <QuickActionsSection
              onCreateCourse={() => navigate('/mentor/courses/create')}
              onManageCourses={() => navigate('/mentor/courses')}
              onViewStudents={() => navigate('/mentor/students')}
              onViewAnalytics={() => navigate('/mentor/analytics')}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, courseId: null })}
        title="Delete Course"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this course? This action cannot be undone
            and will also delete all chapters and student progress.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModal({ open: false, courseId: null })}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCourse}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default MentorDashboard;

