import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import { PageLoader } from '../../components/common/Spinner';
import EmptyState from '../../components/ui/student/EmptyState';
import { getCourseById, getCourseChapters, addChapter, updateChapter, deleteChapter } from '../../services/courseService';
import { ArrowLeft, Plus, Edit, Trash2, Video, Upload } from 'lucide-react';

const ManageChapters = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  
  const [chapterModal, setChapterModal] = useState({ open: false, mode: 'add', chapter: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, chapterId: null, chapterTitle: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    orderIndex: 1,
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseData, chaptersData] = await Promise.all([
        getCourseById(courseId),
        getCourseChapters(courseId),
      ]);

      setCourse(courseData);
      setChapters(chaptersData || []);
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

  const openAddModal = () => {
    setFormData({
      title: '',
      videoUrl: '',
      orderIndex: chapters.length + 1,
    });
    setFormErrors({});
    setChapterModal({ open: true, mode: 'add', chapter: null });
  };

  const openEditModal = (chapter) => {
    setFormData({
      title: chapter.title,
      videoUrl: chapter.videoUrl,
      orderIndex: chapter.orderIndex,
    });
    setFormErrors({});
    setChapterModal({ open: true, mode: 'edit', chapter });
  };

  const closeChapterModal = () => {
    setChapterModal({ open: false, mode: 'add', chapter: null });
    setFormData({ title: '', videoUrl: '', orderIndex: 1 });
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'orderIndex' ? parseInt(value) || 1 : value 
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.videoUrl.trim()) {
      errors.videoUrl = 'Video URL is required';
    } else {
      try {
        new URL(formData.videoUrl);
      } catch {
        errors.videoUrl = 'Please enter a valid URL';
      }
    }

    if (formData.orderIndex < 1) {
      errors.orderIndex = 'Order must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      if (chapterModal.mode === 'add') {
        await addChapter(courseId, formData);
      } else {
        await updateChapter(courseId, chapterModal.chapter.id, formData);
      }

      await fetchData();
      closeChapterModal();
    } catch (err) {
      console.error('Error saving chapter:', err);
      setError(err.response?.data?.message || 'Failed to save chapter');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteChapter(courseId, deleteModal.chapterId);
      setChapters(chapters.filter((c) => c.id !== deleteModal.chapterId));
      setDeleteModal({ open: false, chapterId: null, chapterTitle: '' });
    } catch (err) {
      console.error('Error deleting chapter:', err);
      setError(err.response?.data?.message || 'Failed to delete chapter');
      setDeleteModal({ open: false, chapterId: null, chapterTitle: '' });
    }
  };

  if (loading) {
    return <PageLoader text="Loading Chapters..." />;
  }

  const sortedChapters = [...chapters].sort((a, b) => a.orderIndex - b.orderIndex);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course?.title}</h1>
              <p className="text-gray-600 mt-2">
                {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}
              </p>
            </div>
            <Button variant="primary" onClick={openAddModal}>
              <Plus className="w-5 h-5 mr-2" />
              Add Chapter
            </Button>
          </div>
        </div>

        {/* Chapters List */}
        {sortedChapters.length > 0 ? (
          <div className="space-y-4">
            {sortedChapters.map((chapter) => (
              <Card key={chapter.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded">
                            #{chapter.orderIndex}
                          </span>
                          <h3 className="font-bold text-lg text-gray-900">{chapter.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 truncate">
                          {chapter.videoUrl}
                        </p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(chapter)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDeleteModal({ open: true, chapterId: chapter.id, chapterTitle: chapter.title })
                          }
                          className="text-red-600 hover:text-red-700 hover:border-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Video}
            title="No chapters yet"
            message="Add your first chapter to get started"
            action={{
              label: 'Add Chapter',
              onClick: openAddModal,
            }}
          />
        )}
      </div>

      {/* Add/Edit Chapter Modal */}
      <Modal
        isOpen={chapterModal.open}
        onClose={closeChapterModal}
        title={chapterModal.mode === 'add' ? 'Add Chapter' : 'Edit Chapter'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Chapter Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Chapter 1: Introduction"
              error={formErrors.title}
              disabled={submitting}
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Video URL <span className="text-red-500">*</span>
            </label>
            <Input
              id="videoUrl"
              name="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://res.cloudinary.com/..."
              error={formErrors.videoUrl}
              disabled={submitting}
            />
            {formErrors.videoUrl && (
              <p className="mt-1 text-sm text-red-600">{formErrors.videoUrl}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              <Upload className="inline w-4 h-4 mr-1" />
              Upload video to Cloudinary first
            </p>
          </div>

          <div>
            <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700 mb-2">
              Order <span className="text-red-500">*</span>
            </label>
            <Input
              id="orderIndex"
              name="orderIndex"
              type="number"
              min="1"
              value={formData.orderIndex}
              onChange={handleChange}
              error={formErrors.orderIndex}
              disabled={submitting}
            />
            {formErrors.orderIndex && (
              <p className="mt-1 text-sm text-red-600">{formErrors.orderIndex}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeChapterModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
            >
              {submitting ? 'Saving...' : chapterModal.mode === 'add' ? 'Add Chapter' : 'Update Chapter'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, chapterId: null, chapterTitle: '' })}
        title="Delete Chapter"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.chapterTitle}</strong>?
          </p>
          <p className="text-sm text-red-600">
            ⚠️ This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, chapterId: null, chapterTitle: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete Chapter
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default ManageChapters;

