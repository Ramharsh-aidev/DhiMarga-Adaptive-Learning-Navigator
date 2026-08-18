import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { PageLoader } from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import VideoPlayer from '../../components/ui/student/VideoPlayer';
import ChapterInfo from '../../components/ui/student/ChapterInfo';
import ChapterNavigation from '../../components/ui/student/ChapterNavigation';
import { getCourseProgress, completeChapter, trackChapterTime } from '../../services/progressService';
import { getCourseChapters } from '../../services/courseService';
import { mergeChapterProgress } from '../../utils/courseHelpers';

const ChapterView = () => {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [completing, setCompleting] = useState(false);
  
  // Time tracking
  const timeSpentRef = useRef(0);
  const timerRef = useRef(null);
  const lastTrackRef = useRef(Date.now());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [progressData, chaptersData] = await Promise.all([
        getCourseProgress(courseId),
        getCourseChapters(courseId)
      ]);
      
      setCourseData(progressData);
      setChapters(chaptersData);
      
      const chapter = mergeChapterProgress(chaptersData, progressData, chapterId);
      if (!chapter) {
        setError('Chapter not found');
        return;
      }
      
      setCurrentChapter(chapter);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load chapter');
    } finally {
      setLoading(false);
    }
  }, [courseId, chapterId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Time tracking effect
  useEffect(() => {
    if (!chapterId) return;

    // Start tracking time
    lastTrackRef.current = Date.now();
    timeSpentRef.current = 0;

    // Track time every 5 minutes (300 seconds)
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastTrackRef.current) / 1000);
      
      if (elapsedSeconds >= 300) { // 5 minutes
        trackChapterTime(chapterId, 300).catch(err => {
          console.error('Error tracking time:', err);
        });
        lastTrackRef.current = now;
        timeSpentRef.current += 300;
      }
    }, 60000); // Check every minute

    // Cleanup: track remaining time when leaving the page
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      const now = Date.now();
      const remainingSeconds = Math.floor((now - lastTrackRef.current) / 1000);
      
      // Track any remaining time (minimum 10 seconds to avoid spam)
      if (remainingSeconds >= 10 && chapterId) {
        trackChapterTime(chapterId, remainingSeconds).catch(err => {
          console.error('Error tracking final time:', err);
        });
      }
    };
  }, [chapterId]);

  const handleCompleteChapter = async () => {
    if (currentChapter.completed) return;
    
    try {
      setCompleting(true);
      setError(null);
      const response = await completeChapter(chapterId);
      
      setSuccess(response.message || 'Chapter completed successfully!');
      await fetchData();
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Error completing chapter:', err);
      setError(err.response?.data?.message || 'Failed to mark chapter as complete');
    } finally {
      setCompleting(false);
    }
  };

  const getNextChapter = () => {
    if (!currentChapter || !chapters.length) return null;
    const currentIndex = chapters.findIndex(ch => ch.id === chapterId);
    return currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  };

  const getPrevChapter = () => {
    if (!currentChapter || !chapters.length) return null;
    const currentIndex = chapters.findIndex(ch => ch.id === chapterId);
    return currentIndex > 0 ? chapters[currentIndex - 1] : null;
  };

  const handleNextChapter = () => {
    const next = getNextChapter();
    if (next) navigate(`/student/courses/${courseId}/chapters/${next.id}`);
  };

  const handlePrevChapter = () => {
    const prev = getPrevChapter();
    if (prev) navigate(`/student/courses/${courseId}/chapters/${prev.id}`);
  };

  if (loading) return <PageLoader text="Loading chapter..." />;

  if (error && !currentChapter) {
    return (
      <Layout>
        <div className="p-6 max-w-7xl mx-auto">
          <Alert variant="danger" title="Error" message={error} className="mb-6" />
          <Button
            variant="outline"
            leftIcon={<ChevronLeft className="w-5 h-5" />}
            onClick={() => navigate(`/student/courses/${courseId}`)}
          >
            Back to Course
          </Button>
        </div>
      </Layout>
    );
  }

  const nextChapter = getNextChapter();
  const prevChapter = getPrevChapter();
  const canGoNext = currentChapter?.completed || !nextChapter;

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
        
        {success && (
          <Alert 
            variant="success" 
            title="Success" 
            message={success} 
            onClose={() => setSuccess(null)} 
            className="mb-6" 
          />
        )}

        <Button
          variant="outline"
          leftIcon={<ChevronLeft className="w-5 h-5" />}
          onClick={() => navigate(`/student/courses/${courseId}`)}
          className="mb-6"
        >
          Back to Course
        </Button>

        <VideoPlayer videoUrl={currentChapter.videoUrl} />

        <ChapterInfo
          chapter={currentChapter}
          courseData={courseData}
          onComplete={handleCompleteChapter}
          completing={completing}
        />

        <ChapterNavigation
          prevChapter={prevChapter}
          nextChapter={nextChapter}
          canGoNext={canGoNext}
          onPrev={handlePrevChapter}
          onNext={handleNextChapter}
        />
      </div>
    </Layout>
  );
};

export default ChapterView;
