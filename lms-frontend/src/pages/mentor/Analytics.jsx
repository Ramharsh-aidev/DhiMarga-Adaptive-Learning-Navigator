import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Award,
  Calendar,
  ChevronRight,
  Eye,
  Edit,
  UserPlus
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/ui/student/EmptyState';
import { getMentorCourses } from '../../services/courseService';
import { formatDate } from '../../utils/formatters';

const Analytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // all, month, week

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMentorCourses();
      setCourses(data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalCourses = courses.length;
    const totalChapters = courses.reduce((sum, course) => sum + (course.chapterCount || 0), 0);
    const coursesThisMonth = courses.filter(c => new Date(c.createdAt) >= oneMonthAgo).length;
    const coursesThisWeek = courses.filter(c => new Date(c.createdAt) >= oneWeekAgo).length;

    // Calculate total students (sum of studentsEnrolled across all courses)
    const totalStudents = courses.reduce((sum, course) => sum + (course.studentsEnrolled || 0), 0);

    return {
      totalCourses,
      totalChapters,
      totalStudents,
      coursesThisMonth,
      coursesThisWeek,
      avgChaptersPerCourse: totalCourses > 0 ? Math.round(totalChapters / totalCourses) : 0,
      avgStudentsPerCourse: totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0,
    };
  };

  const getRecentCourses = () => {
    return [...courses]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const getTopCoursesByEnrollment = () => {
    return [...courses]
      .sort((a, b) => (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0))
      .slice(0, 5);
  };

  if (loading) {
    return <PageLoader text="Loading Analytics..." />;
  }

  if (courses.length === 0) {
    return (
      <Layout>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Course Analytics</h1>
            <p className="text-gray-600 mt-2">Insights about your courses</p>
          </div>
          <Card className="p-12">
            <EmptyState
              icon={BarChart3}
              title="No Analytics Yet"
              description="Create your first course to see analytics and insights here."
              actionLabel="Create Course"
              onAction={() => navigate('/mentor/courses/create')}
            />
          </Card>
        </div>
      </Layout>
    );
  }

  const stats = calculateStats();
  const recentCourses = getRecentCourses();
  const topCourses = getTopCoursesByEnrollment();

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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Analytics</h1>
          <p className="text-gray-600 mt-2">Insights and statistics about your courses</p>
        </div>

        {/* Period Filter */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 mr-2">Time Period:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedPeriod === 'week'
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedPeriod === 'month'
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setSelectedPeriod('all')}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedPeriod === 'all'
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Time
              </button>
            </div>
          </div>
        </Card>

        {/* Alert: Backend Limitation Notice */}
        <Alert
          variant="warning"
          title="Limited Analytics Data"
          message="Backend API does not provide student progress analytics. Showing course-level statistics only. For detailed student progress tracking, backend needs to implement analytics endpoints."
          className="mb-6"
        />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Courses */}
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

          {/* Total Students */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
                <div className="text-sm text-gray-600">Total Enrollments</div>
              </div>
            </div>
          </Card>

          {/* Total Chapters */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalChapters}</div>
                <div className="text-sm text-gray-600">Total Chapters</div>
              </div>
            </div>
          </Card>

          {/* Growth */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">+{stats.coursesThisMonth}</div>
                <div className="text-sm text-gray-600">New This Month</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {stats.avgChaptersPerCourse}
              </div>
              <div className="text-sm text-gray-600">Avg Chapters per Course</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {stats.avgStudentsPerCourse}
              </div>
              <div className="text-sm text-gray-600">Avg Students per Course</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                +{stats.coursesThisWeek}
              </div>
              <div className="text-sm text-gray-600">Created This Week</div>
            </div>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Courses by Enrollment */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Top Courses by Enrollment
            </h2>
            {topCourses.length > 0 ? (
              <div className="space-y-3">
                {topCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                  >
                    <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                      <p className="text-sm text-gray-600">
                        {course.chapterCount || 0} chapters
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-indigo-600">
                        {course.studentsEnrolled || 0}
                      </div>
                      <div className="text-xs text-gray-500">students</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No enrollment data available</p>
            )}
          </Card>

          {/* Recent Courses */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Recently Created Courses
            </h2>
            {recentCourses.length > 0 ? (
              <div className="space-y-3">
                {recentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-3 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <Badge variant={course.published ? 'success' : 'warning'}>
                        {course.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{course.chapterCount || 0} chapters</span>
                      <span>•</span>
                      <span>{course.studentsEnrolled || 0} students</span>
                      <span>•</span>
                      <span>{formatDate(course.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No courses yet</p>
            )}
          </Card>
        </div>

        {/* All Courses Table */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              All Courses Overview
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Chapters
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-600 line-clamp-1">
                          {course.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={course.published ? 'success' : 'warning'}>
                        {course.published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {course.chapterCount || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {course.studentsEnrolled || 0}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {formatDate(course.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/mentor/courses/${course.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/mentor/courses/${course.id}/edit`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/mentor/courses/${course.id}/assign`)}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/mentor/courses/${course.id}/analytics`)}
                        >
                          <BarChart3 className="w-4 h-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            variant="primary"
            onClick={() => navigate('/mentor/courses/create')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/mentor/courses')}
          >
            View All Courses
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
