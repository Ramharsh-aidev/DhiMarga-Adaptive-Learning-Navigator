import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Award,
  BarChart3,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import { getCourseAnalytics, getCourseStudentProgress } from '../../services/courseService';
import { formatDate } from '../../utils/formatters';

const CourseAnalytics = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [studentProgress, setStudentProgress] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, not-started, in-progress, completed

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [analyticsData, studentsData] = await Promise.all([
        getCourseAnalytics(courseId),
        getCourseStudentProgress(courseId)
      ]);
      
      setAnalytics(analyticsData);
      setStudentProgress(studentsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatDuration = (seconds) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStudentStatus = (student) => {
    if (student.completedChapters === student.totalChapters) return 'completed';
    if (student.completedChapters === 0 && student.inProgressChapters === 0) return 'not-started';
    return 'in-progress';
  };

  const filteredStudents = studentProgress
    .filter(student => {
      const matchesSearch = 
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const status = getStudentStatus(student);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.progressPercentage - a.progressPercentage);

  if (loading) {
    return <PageLoader text="Loading analytics..." />;
  }

  if (!analytics) {
    return (
      <Layout>
        <div className="p-6">
          <Alert variant="danger" title="Error" message="Analytics data not available" />
        </div>
      </Layout>
    );
  }

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mentor/analytics')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Analytics
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{analytics.courseTitle}</h1>
          <p className="text-gray-600 mt-2">Detailed Course Analytics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.completionRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {analytics.averageProgress.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Avg Progress</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatDuration(analytics.averageTimeToCompleteSeconds)}
                </div>
                <div className="text-sm text-gray-600">Avg Time</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Student Status Distribution */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Student Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Not Started</span>
                <span className="text-2xl font-bold text-gray-900">{analytics.studentsNotStarted}</span>
              </div>
              <ProgressBar 
                progress={(analytics.studentsNotStarted / analytics.totalStudents) * 100} 
                variant="warning"
                size="sm"
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-600">In Progress</span>
                <span className="text-2xl font-bold text-blue-900">{analytics.studentsInProgress}</span>
              </div>
              <ProgressBar 
                progress={(analytics.studentsInProgress / analytics.totalStudents) * 100} 
                variant="primary"
                size="sm"
              />
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-600">Completed</span>
                <span className="text-2xl font-bold text-green-900">{analytics.studentsCompleted}</span>
              </div>
              <ProgressBar 
                progress={(analytics.studentsCompleted / analytics.totalStudents) * 100} 
                variant="success"
                size="sm"
              />
            </div>
          </div>
        </Card>

        {/* Chapter Analytics */}
        <Card className="overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Chapter Performance
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Chapter
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Started
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Completed
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Completion Rate
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Avg Time
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Drop-offs
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.chapterAnalytics.map((chapter) => (
                  <tr key={chapter.chapterId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-semibold text-sm">
                          {chapter.sequenceOrder}
                        </div>
                        <div className="font-medium text-gray-900">{chapter.chapterTitle}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {chapter.studentsStarted}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {chapter.studentsCompleted}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-medium ${
                          chapter.completionRate >= 80 ? 'text-green-600' :
                          chapter.completionRate >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {chapter.completionRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">
                      {formatDuration(chapter.averageTimeToCompleteSeconds)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {chapter.dropOffCount > 0 ? (
                        <div className="flex items-center justify-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span className="font-medium text-orange-600">{chapter.dropOffCount}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Student Progress */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Student Progress Details
            </h2>
            
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Chapters
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Time Spent
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Velocity
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Last Active
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const status = getStudentStatus(student);
                  return (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{student.studentName}</div>
                          <div className="text-sm text-gray-600">{student.studentEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-sm font-medium text-gray-900">
                            {student.progressPercentage.toFixed(0)}%
                          </span>
                          <div className="w-full max-w-25">
                            <ProgressBar 
                              progress={student.progressPercentage} 
                              size="sm"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm">
                          <span className="font-medium text-green-600">{student.completedChapters}</span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-gray-600">{student.totalChapters}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        {formatDuration(student.totalTimeSpentSeconds)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {student.learningVelocity ? (
                          <span className={`text-sm font-medium ${
                            student.learningVelocity >= 0.5 ? 'text-green-600' :
                            student.learningVelocity >= 0.2 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {student.learningVelocity.toFixed(2)} ch/day
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {student.lastAccessedAt ? formatDate(student.lastAccessedAt) : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={
                          status === 'completed' ? 'success' :
                          status === 'in-progress' ? 'primary' :
                          'warning'
                        }>
                          {status === 'completed' ? 'Completed' :
                           status === 'in-progress' ? 'In Progress' :
                           'Not Started'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="p-12 text-center">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No students found matching your filters</p>
            </div>
          )}
        </Card>

        {/* Last Updated */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {formatDate(analytics.lastUpdated)}</span>
        </div>
      </div>
    </Layout>
  );
};

export default CourseAnalytics;
