import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import EmptyState from '../../components/ui/student/EmptyState';
import MentorCourseCard from '../../components/ui/mentor/MentorCourseCard';
import { getMentorCourses, deleteCourse } from '../../services/courseService';
import { Plus, Search, BookOpen } from 'lucide-react';

const MentorCourses = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, courseId: null, courseTitle: '' });

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
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await deleteCourse(deleteModal.courseId);
      setCourses(courses.filter((c) => c.id !== deleteModal.courseId));
      setDeleteModal({ open: false, courseId: null, courseTitle: '' });
    } catch (err) {
      console.error('Error deleting course:', err);
      setError(err.response?.data?.message || 'Failed to delete course');
      setDeleteModal({ open: false, courseId: null, courseTitle: '' });
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <PageLoader text="Loading Courses..." />;
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">
              {courses.length} {courses.length === 1 ? 'course' : 'courses'} created
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/mentor/courses/create')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Course
          </Button>
        </div>

        {/* Search */}
        {courses.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <MentorCourseCard
                key={course.id}
                course={course}
                onEdit={(id) => navigate(`/mentor/courses/${id}/edit`)}
                onDelete={(id) =>
                  setDeleteModal({ open: true, courseId: id, courseTitle: course.title })
                }
                onManageChapters={(id) => navigate(`/mentor/courses/${id}/chapters`)}
                onAssign={(id) => navigate(`/mentor/courses/${id}/assign`)}
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            message="Create your first course to get started"
            action={{
              label: 'Create Course',
              onClick: () => navigate('/mentor/courses/create'),
            }}
          />
        ) : (
          <EmptyState
            icon={Search}
            title="No courses found"
            message={`No courses match "${searchTerm}"`}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, courseId: null, courseTitle: '' })}
        title="Delete Course"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.courseTitle}</strong>?
          </p>
          <p className="text-sm text-red-600">
            ⚠️ This action cannot be undone. All chapters and student progress will also be deleted.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, courseId: null, courseTitle: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCourse}
            >
              Delete Course
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default MentorCourses;

