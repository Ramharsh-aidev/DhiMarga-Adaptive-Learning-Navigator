import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/ui/student/EmptyState';
import { getCourseById, assignCourse, getStudentsForCourse } from '../../services/courseService';
import { ArrowLeft, Search, Users, UserCheck } from 'lucide-react';

const AssignCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [course, setCourse] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [enrolledStudentIds, setEnrolledStudentIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseData, studentsData] = await Promise.all([
        getCourseById(courseId),
        getStudentsForCourse(courseId),
      ]);

      setCourse(courseData);
      setAllUsers(studentsData);
      
      // Extract enrolled student IDs from the response
      const enrolledIds = studentsData.filter(s => s.isEnrolled).map(s => s.id);
      setEnrolledStudentIds(enrolledIds);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    const availableStudentIds = availableStudents.map((s) => s.id);
    if (selectedStudents.length === availableStudentIds.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(availableStudentIds);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await assignCourse(courseId, selectedStudents);
      setSuccess(true);
      setSelectedStudents([]);

      // Refresh data to show updated enrollment status
      await fetchData();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error assigning course:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to assign course');
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = allUsers.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate enrolled and available students
  const availableStudents = filteredStudents.filter(s => !s.isEnrolled);
  const enrolledStudents = filteredStudents.filter(s => s.isEnrolled);

  if (loading) {
    return <PageLoader text="Loading Students..." />;
  }

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        {error && (
          <Alert
            variant="danger"
            title="Error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {success && (
          <Alert
            variant="success"
            title="Success"
            message={`Course assigned to ${selectedStudents.length} student(s) successfully!`}
            className="mb-6"
          />
        )}

        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/mentor/courses')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Assign Course</h1>
          <p className="text-gray-600 mt-2">{course?.title}</p>
        </div>

        {/* Search and Select All */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={submitting || success}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={submitting || success || availableStudents.length === 0}
            >
              {selectedStudents.length === availableStudents.length && availableStudents.length > 0
                ? 'Deselect All'
                : 'Select All'}
            </Button>
          </div>

          <p className="text-sm text-gray-600">
            {selectedStudents.length} of {availableStudents.length} available student(s) selected
          </p>
          {enrolledStudents.length > 0 && (
            <p className="text-sm text-green-600 mt-1">
              {enrolledStudents.length} student(s) already enrolled
            </p>
          )}
        </Card>

        {/* Students List */}
        {availableStudents.length > 0 ? (
          <form onSubmit={handleSubmit}>
            {/* Available Students Section */}
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Available Students ({availableStudents.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableStudents.map((student) => (
                  <label
                    key={student.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedStudents.includes(student.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleToggleStudent(student.id)}
                      disabled={submitting || success}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                      </div>
                    </div>
                    {selectedStudents.includes(student.id) && (
                      <UserCheck className="w-5 h-5 text-indigo-600" />
                    )}
                  </label>
                ))}
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/mentor/courses')}
                disabled={submitting || success}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                disabled={success || selectedStudents.length === 0}
              >
                {submitting
                  ? 'Assigning...'
                  : `Assign to ${selectedStudents.length} Student(s)`}
              </Button>
            </div>
          </form>
        ) : allUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students found"
            message="There are no students in the system yet"
          />
        ) : availableStudents.length === 0 && enrolledStudents.length > 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">All Students Enrolled!</h3>
              <p className="text-gray-600">All available students are already enrolled in this course.</p>
            </div>
          </Card>
        ) : (
          <EmptyState
            icon={Search}
            title="No students found"
            message={`No students match "${searchTerm}"`}
          />
        )}

        {/* Already Enrolled Students Section */}
        {enrolledStudents.length > 0 && (
          <Card className="p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              Already Enrolled ({enrolledStudents.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {enrolledStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-4 rounded-lg border-2 border-green-200 bg-green-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{student.name}</h3>
                          <Badge variant="success" size="sm">Enrolled</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        {student.enrolledAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Enrolled on {new Date(student.enrolledAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AssignCourse;

